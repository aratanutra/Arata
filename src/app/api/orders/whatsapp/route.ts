import { NextResponse } from "next/server";
import {
  ordersEnabled,
  saveOrder,
  type CustomerInfo,
  type StoredOrder
} from "@/lib/orders";
import { sendAdminNewOrderAlert } from "@/lib/email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Public: record a WhatsApp-channel order BEFORE the customer opens
 * WhatsApp with the pre-filled message. Creates a StoredOrder in
 * status "created" so it appears in /admin/orders immediately — the
 * admin then marks it paid once payment arrives via UPI/bank transfer.
 *
 * Why: the admin needs the shipping address + customer details in a
 * structured record. Relying on the WhatsApp chat alone loses orders
 * when messages get buried.
 *
 * POST body: {
 *   pack: { id, label, sublabel?, priceNumber, shippingCost },
 *   customer: { name, email, phone, address1, address2?, city, state, pincode }
 * }
 */
export async function POST(req: Request) {
  if (!ordersEnabled()) {
    return NextResponse.json(
      { error: "Orders storage unavailable in this environment." },
      { status: 503 }
    );
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

  const totalRupees = priceNumber + shippingCost;
  const now = Date.now();
  const orderId = `wa_${now}_${Math.random().toString(36).slice(2, 8)}`;
  const receipt = `wa-${packId}-${now}`;

  const order: StoredOrder = {
    orderId,
    receipt,
    amount: totalRupees * 100, // paise
    currency: "INR",
    pack: { id: packId, label: packLabel, sublabel },
    breakdown: {
      productPaise: priceNumber * 100,
      shippingPaise: shippingCost * 100
    },
    customer: c,
    status: "created",
    createdAt: new Date().toISOString()
  };

  await saveOrder(order);

  // Admin alert — fire best-effort; don't block the response.
  sendAdminNewOrderAlert(order).catch((err) => {
    console.error("[order.whatsapp.alert]", err);
  });

  return NextResponse.json({ ok: true, orderId });
}
