import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getOrder,
  ordersEnabled,
  saveOrder,
  type StoredOrder
} from "@/lib/orders";
import { sendOrderConfirmation } from "@/lib/email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Admin-gated: manually flip a "created" order to "paid" when payment
 * arrives out-of-band (UPI, bank transfer, cash, etc. — the WhatsApp
 * order flow). Fires the customer order-confirmation email the first
 * time the status flips, same as the Razorpay path.
 *
 * POST body (all optional):
 *   paymentId?: string;              // e.g. UPI txn id, bank ref
 *   paidAt?: string;                 // ISO date — manual payment date
 *   skipEmail?: boolean;             // true = don't send confirmation
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

  let body: { paymentId?: unknown; paidAt?: unknown; skipEmail?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    body = {};
  }

  const trim = (v: unknown): string | undefined =>
    typeof v === "string" && v.trim().length > 0 ? v.trim() : undefined;

  const paymentId = trim(body.paymentId) ?? "manual";
  const paidAtInput = trim(body.paidAt);
  const skipEmail = body.skipEmail === true;

  let paidAtNormalised: string | undefined;
  if (paidAtInput) {
    const d = new Date(paidAtInput);
    if (Number.isNaN(d.getTime())) {
      return NextResponse.json(
        { error: "paidAt must be a valid date." },
        { status: 400 }
      );
    }
    paidAtNormalised = d.toISOString();
  }

  const existing = await getOrder(orderId);
  if (!existing) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (existing.status !== "created" && existing.status !== "failed") {
    return NextResponse.json(
      { error: `Cannot mark paid — order is "${existing.status}".` },
      { status: 409 }
    );
  }

  let updated: StoredOrder = {
    ...existing,
    status: "paid",
    paymentId,
    paidAt: paidAtNormalised ?? existing.paidAt ?? new Date().toISOString()
  };
  await saveOrder(updated);

  // Fire the customer order-confirmation (idempotent via marker).
  let emailResult: { ok: boolean; id?: string; error?: string; skipped?: boolean } | null = null;
  if (!skipEmail && !updated.confirmationEmailSentAt) {
    emailResult = await sendOrderConfirmation(updated);
    if (emailResult.ok) {
      updated = {
        ...updated,
        confirmationEmailSentAt: new Date().toISOString(),
        confirmationEmailError: undefined
      };
    } else {
      updated = {
        ...updated,
        confirmationEmailError: describeFailure(emailResult)
      };
    }
    await saveOrder(updated);
  }

  return NextResponse.json({ ok: true, order: updated, email: emailResult });
}

function describeFailure(res: { ok: boolean } & Record<string, unknown>): string {
  if ("error" in res && typeof res.error === "string" && res.error) return res.error;
  if ("skipped" in res && res.skipped === true) return "RESEND_API_KEY not configured";
  return "unknown error";
}
