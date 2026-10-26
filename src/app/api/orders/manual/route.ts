import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  ordersEnabled,
  saveOrder,
  type CustomerInfo,
  type StoredOrder
} from "@/lib/orders";
import { sendAdminNewOrderAlert, sendOrderConfirmation } from "@/lib/email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Admin: create an order manually (for walk-ins, phone orders, missed
 * WhatsApp orders, etc.). Mirrors /api/orders/whatsapp but requires an
 * admin session and lets you set the initial status directly.
 *
 * POST body: {
 *   pack: { id, label, sublabel?, priceNumber, shippingCost },
 *   customer: CustomerInfo,
 *   status?: "created" | "paid",          // default "created"
 *   paymentId?: string,                    // if status === "paid"
 *   paidAt?: string,                       // ISO date, if status === "paid"
 *   createdAt?: string,                    // ISO date — manual backfill
 *   sendConfirmationEmail?: boolean        // true = send customer email if status=paid
 * }
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!ordersEnabled()) {
    return NextResponse.json({ error: "Orders storage unavailable." }, { status: 503 });
  }

  let body: {
    pack?: {
      id?: unknown;
      label?: unknown;
      sublabel?: unknown;
      priceNumber?: unknown;
      shippingCost?: unknown;
    };
    customer?: Partial<Record<keyof CustomerInfo, unknown>>;
    status?: unknown;
    paymentId?: unknown;
    paidAt?: unknown;
    createdAt?: unknown;
    sendConfirmationEmail?: unknown;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const pack = body.pack;
  const customer = body.customer;
  if (!pack || !customer) {
    return NextResponse.json({ error: "pack and customer are required." }, { status: 400 });
  }

  const packId = typeof pack.id === "string" ? pack.id : "";
  const packLabel = typeof pack.label === "string" ? pack.label : "";
  const sublabel = typeof pack.sublabel === "string" ? pack.sublabel : undefined;
  const priceNumber = Number(pack.priceNumber) || 0;
  const shippingCost = Number(pack.shippingCost) || 0;
  if (!packId || !packLabel || priceNumber <= 0) {
    return NextResponse.json({ error: "Invalid pack details." }, { status: 400 });
  }

  const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
  const c: CustomerInfo = {
    name: str(customer.name),
    email: str(customer.email),
    phone: str(customer.phone),
    address1: str(customer.address1),
    address2: str(customer.address2) || undefined,
    city: str(customer.city),
    state: str(customer.state),
    pincode: str(customer.pincode)
  };

  const errs: string[] = [];
  if (!c.name || c.name.length < 2) errs.push("name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.email)) errs.push("email");
  if (!/^\d{10}$/.test(c.phone.replace(/\D/g, ""))) errs.push("phone");
  if (!c.address1 || c.address1.length < 5) errs.push("address1");
  if (!c.city) errs.push("city");
  if (!c.state) errs.push("state");
  if (!/^\d{6}$/.test(c.pincode)) errs.push("pincode");
  if (errs.length) {
    return NextResponse.json(
      { error: `Invalid or missing fields: ${errs.join(", ")}` },
      { status: 400 }
    );
  }

  const status = body.status === "paid" ? "paid" : "created";
  const paymentId = status === "paid" ? str(body.paymentId) || "manual" : undefined;
  const paidAtRaw = str(body.paidAt);
  const createdAtRaw = str(body.createdAt);

  function iso(input: string): string | undefined {
    if (!input) return undefined;
    const d = new Date(input);
    return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
  }
  const paidAt = status === "paid" ? iso(paidAtRaw) ?? new Date().toISOString() : undefined;
  const createdAt = iso(createdAtRaw) ?? new Date().toISOString();

  const totalRupees = priceNumber + shippingCost;
  const now = Date.now();
  const orderId = `manual_${now}_${Math.random().toString(36).slice(2, 8)}`;
  const receipt = `manual-${packId}-${now}`;

  let order: StoredOrder = {
    orderId,
    receipt,
    amount: totalRupees * 100,
    currency: "INR",
    pack: { id: packId, label: packLabel, sublabel },
    breakdown: {
      productPaise: priceNumber * 100,
      shippingPaise: shippingCost * 100
    },
    customer: c,
    status,
    createdAt,
    paidAt,
    paymentId
  };
  await saveOrder(order);

  // Fire admin alert for records (same alert the WhatsApp/Razorpay flows use).
  sendAdminNewOrderAlert(order).catch((err) => console.error("[order.manual.alert]", err));

  // If paid + opted-in, send customer confirmation.
  const wantEmail = body.sendConfirmationEmail === true;
  if (status === "paid" && wantEmail) {
    const res = await sendOrderConfirmation(order);
    if (res.ok) {
      order = { ...order, confirmationEmailSentAt: new Date().toISOString() };
      await saveOrder(order);
    }
  }

  return NextResponse.json({ ok: true, order });
}
