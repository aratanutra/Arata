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
 * URL/courier/AWB/dates, and email the customer.
 *
 * POST body: {
 *   trackingUrl?: string;
 *   courier?: string;
 *   awbNumber?: string;
 *   shippedAt?: string;              // ISO date — manual dispatch date override
 *   expectedDeliveryDate?: string;   // ISO date (YYYY-MM-DD)
 * }
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

  let body: {
    trackingUrl?: unknown;
    courier?: unknown;
    awbNumber?: unknown;
    shippedAt?: unknown;
    expectedDeliveryDate?: unknown;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    body = {};
  }

  const trim = (v: unknown): string | undefined =>
    typeof v === "string" && v.trim().length > 0 ? v.trim() : undefined;

  const trackingUrl = trim(body.trackingUrl);
  const courier = trim(body.courier);
  const awbNumber = trim(body.awbNumber);
  const shippedAtInput = trim(body.shippedAt);
  const expectedDeliveryDate = trim(body.expectedDeliveryDate);

  if (trackingUrl && !/^https?:\/\//i.test(trackingUrl)) {
    return NextResponse.json(
      { error: "Tracking URL must start with http:// or https://" },
      { status: 400 }
    );
  }

  // Normalise date inputs — accept YYYY-MM-DD or full ISO; reject garbage.
  function parseDate(s: string | undefined): string | undefined | "INVALID" {
    if (!s) return undefined;
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return "INVALID";
    return d.toISOString();
  }
  const shippedAtNormalised = parseDate(shippedAtInput);
  const expectedDeliveryNormalised = parseDate(expectedDeliveryDate);
  if (shippedAtNormalised === "INVALID" || expectedDeliveryNormalised === "INVALID") {
    return NextResponse.json(
      { error: "Dispatch date / expected delivery date must be a valid date." },
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
    shippedAt:
      shippedAtNormalised ?? existing.shippedAt ?? new Date().toISOString(),
    trackingUrl: trackingUrl ?? existing.trackingUrl,
    courier: courier ?? existing.courier,
    awbNumber: awbNumber ?? existing.awbNumber,
    expectedDeliveryDate:
      expectedDeliveryNormalised ?? existing.expectedDeliveryDate
  };
  await saveOrder(updated);

  // Fire the shipping email (best-effort, idempotent via marker).
  let emailResult: { ok: boolean; id?: string; error?: string; skipped?: boolean } | null = null;
  if (!updated.shippingEmailSentAt) {
    emailResult = await sendShippingNotification(updated);
    if (emailResult.ok) {
      updated = {
        ...updated,
        shippingEmailSentAt: new Date().toISOString(),
        shippingEmailError: undefined
      };
    } else {
      updated = {
        ...updated,
        shippingEmailError:
          emailResult.error ?? (emailResult.skipped ? "RESEND_API_KEY not configured" : "unknown error")
      };
    }
    await saveOrder(updated);
  }

  return NextResponse.json({ ok: true, order: updated, email: emailResult });
}
