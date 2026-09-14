import { NextResponse } from "next/server";
import { razorpayClient, razorpayConfigured, razorpayKeyId } from "@/lib/razorpay";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Body = {
  amount?: unknown;
  currency?: unknown;
  receipt?: unknown;
  notes?: unknown;
};

const MIN_PAISE = 100;
const MAX_PAISE = 100_00_000; // ₹1,00,000 — a soft ceiling; raise if you sell higher-priced packs

export async function POST(req: Request) {
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

  const currency = typeof body.currency === "string" ? body.currency : "INR";
  const receipt =
    typeof body.receipt === "string" && body.receipt.length > 0
      ? body.receipt.slice(0, 40)
      : `rcpt_${Date.now()}`;
  const notes =
    body.notes && typeof body.notes === "object" ? (body.notes as Record<string, string>) : undefined;

  try {
    const order = await razorpayClient().orders.create({
      amount,
      currency,
      receipt,
      notes
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      keyId: razorpayKeyId()
    });
  } catch (err) {
    // Razorpay's SDK throws { statusCode, error: { code, description, ... } }
    // — a plain object, not an Error. Handle both shapes so the real reason
    // is surfaced instead of a generic fallback.
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

    // Server-side log so we can grep Netlify function logs for the raw payload.
    console.error("[razorpay.create-order]", JSON.stringify({ msg, code: rzpCode, statusCode: status, raw: rzp }));

    return NextResponse.json(
      { error: msg, code: rzpCode, statusCode: status },
      { status: status >= 400 && status < 600 ? status : 500 }
    );
  }
}
