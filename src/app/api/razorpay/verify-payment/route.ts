import { NextResponse } from "next/server";
import { razorpayConfigured, verifyPaymentSignature } from "@/lib/razorpay";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Body = {
  razorpay_order_id?: unknown;
  razorpay_payment_id?: unknown;
  razorpay_signature?: unknown;
};

export async function POST(req: Request) {
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

  return NextResponse.json({
    verified: true,
    orderId,
    paymentId
  });
}
