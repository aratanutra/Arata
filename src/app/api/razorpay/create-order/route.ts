import { NextResponse } from "next/server";
import { razorpayClient, razorpayConfigured, razorpayKeyId } from "@/lib/razorpay";
import { ordersEnabled, saveOrder, type CustomerInfo, type StoredOrder } from "@/lib/orders";
import { clientIp, rateLimit } from "@/lib/ratelimit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PackInfo = { id: string; label: string; sublabel?: string };
type BreakdownInfo = { productPaise: number; shippingPaise: number };

type Body = {
  amount?: unknown;
  currency?: unknown;
  receipt?: unknown;
  notes?: unknown;
  customer?: unknown;
  pack?: unknown;
  breakdown?: unknown;
};

const MIN_PAISE = 100;
const MAX_PAISE = 100_00_000;

function isString(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

function validateCustomer(input: unknown): CustomerInfo | { error: string } {
  if (!input || typeof input !== "object") return { error: "Customer details are required." };
  const c = input as Record<string, unknown>;

  const name = isString(c.name) ? c.name.trim() : "";
  const email = isString(c.email) ? c.email.trim().toLowerCase() : "";
  const phone = isString(c.phone) ? c.phone.replace(/\D/g, "") : "";
  const address1 = isString(c.address1) ? c.address1.trim() : "";
  const address2 = isString(c.address2) ? c.address2.trim() : "";
  const city = isString(c.city) ? c.city.trim() : "";
  const state = isString(c.state) ? c.state.trim() : "";
  const pincode = isString(c.pincode) ? c.pincode.replace(/\D/g, "") : "";

  if (name.length < 2) return { error: "Full name is required (min 2 characters)." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email." };
  if (phone.length < 10 || phone.length > 13) return { error: "Enter a valid phone number." };
  if (address1.length < 4) return { error: "Enter a complete address." };
  if (city.length < 2) return { error: "City is required." };
  if (state.length < 2) return { error: "State is required." };
  if (!/^\d{6}$/.test(pincode)) return { error: "PIN code must be 6 digits." };

  return { name, email, phone, address1, address2: address2 || undefined, city, state, pincode };
}

export async function POST(req: Request) {
  // Rate limit before doing anything expensive. 10 order-creations
  // per minute per IP is more than enough for a real buyer bouncing
  // between packs and well below any abuse threshold.
  const ip = clientIp(req);
  const rl = rateLimit(`create-order:${ip}`, 10, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) }
      }
    );
  }

  if (!razorpayConfigured()) {
    const missing = [
      process.env.RAZORPAY_KEY_ID ? null : "RAZORPAY_KEY_ID",
      process.env.RAZORPAY_KEY_SECRET ? null : "RAZORPAY_KEY_SECRET"
    ].filter(Boolean);
    return NextResponse.json(
      {
        error: `Razorpay is not configured on the server. Missing: ${missing.join(", ") || "(check names + scope)"}.`,
        hint: "Verify at /api/razorpay/health"
      },
      { status: 500 }
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const amount = Number(body.amount);
  if (!Number.isInteger(amount) || amount < MIN_PAISE || amount > MAX_PAISE) {
    return NextResponse.json(
      { error: `Amount must be an integer between ${MIN_PAISE} and ${MAX_PAISE} paise.` },
      { status: 400 }
    );
  }

  const customerCheck = validateCustomer(body.customer);
  if ("error" in customerCheck) {
    return NextResponse.json({ error: customerCheck.error }, { status: 400 });
  }
  const customer = customerCheck;

  const currency = typeof body.currency === "string" ? body.currency : "INR";
  const receipt =
    typeof body.receipt === "string" && body.receipt.length > 0
      ? body.receipt.slice(0, 40)
      : `rcpt_${Date.now()}`;

  const packInput = body.pack as Record<string, unknown> | undefined;
  const pack: PackInfo = {
    id: isString(packInput?.id) ? (packInput!.id as string) : "unknown",
    label: isString(packInput?.label) ? (packInput!.label as string) : "AETERNYX",
    sublabel: isString(packInput?.sublabel) ? (packInput!.sublabel as string) : undefined
  };

  const breakdownInput = body.breakdown as Record<string, unknown> | undefined;
  const breakdown: BreakdownInfo = {
    productPaise: Number(breakdownInput?.productPaise) || 0,
    shippingPaise: Number(breakdownInput?.shippingPaise) || 0
  };

  // Razorpay notes cap at 15 keys, 256 chars per value.
  const notes: Record<string, string> = {
    ...(typeof body.notes === "object" && body.notes ? (body.notes as Record<string, string>) : {}),
    customer_name: customer.name.slice(0, 240),
    customer_email: customer.email.slice(0, 240),
    customer_phone: customer.phone.slice(0, 240),
    ship_address: `${customer.address1}${customer.address2 ? ", " + customer.address2 : ""}`.slice(0, 240),
    ship_city: customer.city.slice(0, 240),
    ship_state: customer.state.slice(0, 240),
    ship_pincode: customer.pincode.slice(0, 240),
    pack_id: pack.id.slice(0, 240),
    pack_label: pack.label.slice(0, 240)
  };

  try {
    const order = await razorpayClient().orders.create({
      amount,
      currency,
      receipt,
      notes
    });

    // Best-effort persist to Blobs so /admin/orders and verify-payment
    // can look this order up later. Failure here should not block the
    // Razorpay hand-off — payment can still succeed and the dashboard
    // has the notes.
    if (ordersEnabled()) {
      try {
        const stored: StoredOrder = {
          orderId: order.id,
          receipt: order.receipt ?? receipt,
          amount: typeof order.amount === "number" ? order.amount : amount,
          currency: order.currency ?? currency,
          pack,
          breakdown,
          customer,
          status: "created",
          createdAt: new Date().toISOString()
        };
        await saveOrder(stored);
      } catch (persistErr) {
        console.error("[orders.saveOrder]", persistErr instanceof Error ? persistErr.message : persistErr);
      }
    }

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      keyId: razorpayKeyId()
    });
  } catch (err) {
    const rzp = err as {
      statusCode?: number;
      error?: { code?: string; description?: string; reason?: string; field?: string };
    };
    const rzpDesc = rzp?.error?.description;
    const rzpCode = rzp?.error?.code;
    const msg =
      rzpDesc ??
      (err instanceof Error ? err.message : null) ??
      "Razorpay order creation failed";
    const status =
      typeof rzp?.statusCode === "number"
        ? rzp.statusCode
        : /auth|unauthor/i.test(msg)
          ? 401
          : 500;

    console.error(
      "[razorpay.create-order]",
      JSON.stringify({ msg, code: rzpCode, statusCode: status, raw: rzp })
    );

    return NextResponse.json(
      { error: msg, code: rzpCode, statusCode: status },
      { status: status >= 400 && status < 600 ? status : 500 }
    );
  }
}
