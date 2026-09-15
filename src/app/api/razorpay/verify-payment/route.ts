import { NextResponse } from "next/server";
import { razorpayConfigured, verifyPaymentSignature } from "@/lib/razorpay";
import { markOrderPaid, ordersEnabled, getOrder } from "@/lib/orders";
import { clientIp, rateLimit } from "@/lib/ratelimit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Body = {
  razorpay_order_id?: unknown;
  razorpay_payment_id?: unknown;
  razorpay_signature?: unknown;
};

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = rateLimit(`verify-payment:${ip}`, 20, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many verification attempts. Please wait a moment." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) }
      }
    );
  }

  if (!razorpayConfigured()) {
    return NextResponse.json(
      { error: "Razorpay is not configured on the server." },
      { status: 500 }
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const orderId = body.razorpay_order_id;
  const paymentId = body.razorpay_payment_id;
  const signature = body.razorpay_signature;

  if (
    typeof orderId !== "string" ||
    typeof paymentId !== "string" ||
    typeof signature !== "string"
  ) {
    return NextResponse.json(
      { error: "razorpay_order_id, razorpay_payment_id and razorpay_signature are all required." },
      { status: 400 }
    );
  }

  const valid = verifyPaymentSignature({ orderId, paymentId, signature });
  if (!valid) {
    return NextResponse.json(
      { verified: false, error: "Signature mismatch — payment NOT marked as paid." },
      { status: 400 }
    );
  }

  // Signature verified — persist the paid status alongside the order
  // details we saved during create-order. Failure here shouldn't cause
  // the customer to see an error (their money moved fine); it just
  // means the admin view is stale until we retry.
  let paidOrder = null;
  if (ordersEnabled()) {
    try {
      paidOrder = await markOrderPaid(orderId, paymentId);
      if (!paidOrder) {
        // No stored record — try to at least fetch it so we can log a
        // gap; the payment is still valid.
        const existing = await getOrder(orderId);
        console.warn("[verify-payment] order not found in Blobs", { orderId, existingIsNull: !existing });
      }
    } catch (err) {
      console.error("[orders.markPaid]", err instanceof Error ? err.message : err);
    }
  }

  return NextResponse.json({
    verified: true,
    orderId,
    paymentId,
    order: paidOrder
      ? {
          receipt: paidOrder.receipt,
          amount: paidOrder.amount,
          currency: paidOrder.currency,
          pack: paidOrder.pack,
          customer: {
            name: paidOrder.customer.name,
            city: paidOrder.customer.city,
            state: paidOrder.customer.state,
            pincode: paidOrder.customer.pincode
          }
        }
      : undefined
  });
}
