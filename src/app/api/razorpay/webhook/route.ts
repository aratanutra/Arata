import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { getOrder, markOrderPaid, markOrderStatus, ordersEnabled } from "@/lib/orders";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Razorpay webhook receiver.
 *
 * Signature verification per Razorpay docs:
 *   expected = HMAC_SHA256(request_raw_body, RAZORPAY_WEBHOOK_SECRET) (hex)
 *   compare against header "X-Razorpay-Signature".
 *
 * Handled events (see Razorpay dashboard → Webhooks):
 *   - payment.captured        → mark order paid (also handled by
 *                                /api/razorpay/verify-payment; this is
 *                                the async fallback for cases where the
 *                                customer's device dropped before the
 *                                verify call landed).
 *   - payment.failed          → mark order failed.
 *   - refund.created / refund.processed → mark order refunded.
 *
 * IMPORTANT: verify signature BEFORE parsing JSON — otherwise a bad
 * actor could send a body that changes shape between our HMAC read
 * and our JSON.parse read (TOCTOU). We read the raw body as text
 * exactly once and reuse it for both.
 */
export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[razorpay.webhook] RAZORPAY_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signatureHeader = req.headers.get("x-razorpay-signature");
  if (!signatureHeader) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const raw = await req.text();
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signatureHeader, "utf8");
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "Signature mismatch" }, { status: 400 });
  }

  let body: WebhookPayload;
  try {
    body = JSON.parse(raw) as WebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = body.event;
  if (!event || typeof event !== "string") {
    return NextResponse.json({ error: "Missing event" }, { status: 400 });
  }

  if (!ordersEnabled()) {
    // Log the event so we can reconstruct manually if needed; ack the
    // webhook so Razorpay doesn't keep retrying.
    console.warn("[razorpay.webhook] ordersEnabled=false — event acknowledged but not persisted:", event);
    return NextResponse.json({ ok: true, note: "orders storage unavailable" });
  }

  try {
    switch (event) {
      case "payment.captured": {
        const payment = body.payload?.payment?.entity;
        if (payment?.order_id && payment?.id) {
          await markOrderPaid(payment.order_id, payment.id);
        }
        break;
      }
      case "payment.failed": {
        const payment = body.payload?.payment?.entity;
        if (payment?.order_id) {
          const existing = await getOrder(payment.order_id);
          // Don't downgrade a paid order to failed — a paid webhook might
          // arrive out of order after a stale failed event.
          if (existing && existing.status !== "paid" && existing.status !== "refunded") {
            await markOrderStatus(payment.order_id, "failed");
          }
        }
        break;
      }
      case "refund.created":
      case "refund.processed": {
        const refund = body.payload?.refund?.entity;
        // Payment ID is on the refund; look up the order via payment.
        // Razorpay includes the order_id on the payment entity too when
        // present in the payload; fall back to the payment lookup by id
        // only if we stored it.
        const orderId = refund?.notes?.order_id ?? body.payload?.payment?.entity?.order_id;
        if (orderId) {
          await markOrderStatus(orderId, "refunded");
        }
        break;
      }
      default:
        // Unrecognised events (dispute.*, subscription.*, etc.) are ack'd
        // silently — Razorpay retries anything we 4xx / 5xx.
        break;
    }
  } catch (err) {
    console.error("[razorpay.webhook] handler error", err instanceof Error ? err.message : err);
    // We still return 200 so Razorpay stops retrying a bad handler; the
    // error is in the logs. Change this to 500 if you'd rather Razorpay
    // retry.
  }

  return NextResponse.json({ ok: true });
}

type WebhookPayload = {
  event?: string;
  payload?: {
    payment?: { entity?: { id?: string; order_id?: string; status?: string } };
    refund?: { entity?: { id?: string; payment_id?: string; notes?: Record<string, string> } };
  };
};
