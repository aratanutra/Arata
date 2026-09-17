import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getOrder,
  ordersEnabled,
  saveOrder,
  type StoredOrder
} from "@/lib/orders";
import { sendShippingNotification } from "@/lib/email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Admin-gated: flip a paid order to "shipped", store the tracking
 * URL/courier, and email the customer.
 *
 * POST body: { trackingUrl?: string; courier?: string }
 */
export async function POST(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!ordersEnabled()) {
    return NextResponse.json(
      { error: "Orders storage unavailable in this environment." },
      { status: 503 }
    );
  }

  const { orderId } = params;
  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  let body: { trackingUrl?: unknown; courier?: unknown };
  try {
    body = (await req.json()) as { trackingUrl?: unknown; courier?: unknown };
  } catch {
    body = {};
  }

  const trackingUrl =
    typeof body.trackingUrl === "string" && body.trackingUrl.trim().length > 0
      ? body.trackingUrl.trim()
      : undefined;
  const courier =
    typeof body.courier === "string" && body.courier.trim().length > 0
      ? body.courier.trim()
      : undefined;

  if (trackingUrl && !/^https?:\/\//i.test(trackingUrl)) {
    return NextResponse.json(
      { error: "Tracking URL must start with http:// or https://" },
      { status: 400 }
    );
  }

  const existing = await getOrder(orderId);
  if (!existing) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (existing.status !== "paid" && existing.status !== "shipped") {
    return NextResponse.json(
      { error: `Cannot ship an order in status "${existing.status}".` },
      { status: 409 }
    );
  }

  let updated: StoredOrder = {
    ...existing,
    status: "shipped",
    shippedAt: existing.shippedAt ?? new Date().toISOString(),
    trackingUrl: trackingUrl ?? existing.trackingUrl,
    courier: courier ?? existing.courier
  };
  await saveOrder(updated);

  // Fire the shipping email (best-effort, idempotent via marker).
  if (!updated.shippingEmailSentAt) {
    const res = await sendShippingNotification(updated);
    if (res.ok) {
      updated = { ...updated, shippingEmailSentAt: new Date().toISOString() };
      await saveOrder(updated);
    }
  }

  return NextResponse.json({ ok: true, order: updated });
}
