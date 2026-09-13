/**
 * Server-side Razorpay helpers. Never import from a "use client" file —
 * the SDK and the KEY_SECRET must not reach the browser bundle.
 */

import Razorpay from "razorpay";
import { createHmac, timingSafeEqual } from "crypto";

export function razorpayConfigured(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export function razorpayKeyId(): string {
  const id = process.env.RAZORPAY_KEY_ID;
  if (!id) throw new Error("RAZORPAY_KEY_ID not set");
  return id;
}

export function razorpayClient(): Razorpay {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    throw new Error("Razorpay credentials not configured");
  }
  return new Razorpay({ key_id, key_secret });
}

/**
 * HMAC-SHA256 verification per Razorpay's Standard Checkout spec:
 *   signature = HMAC_SHA256(order_id + "|" + payment_id, KEY_SECRET)
 * Uses constant-time compare so a timing attack can't leak whether the
 * signature was close.
 */
export function verifyPaymentSignature(input: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;

  const expected = createHmac("sha256", secret)
    .update(`${input.orderId}|${input.paymentId}`)
    .digest("hex");

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(input.signature, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
