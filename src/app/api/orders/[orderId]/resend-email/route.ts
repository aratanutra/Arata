import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOrder, ordersEnabled, saveOrder } from "@/lib/orders";
import { sendOrderConfirmation, sendShippingNotification } from "@/lib/email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Admin-gated: force-resend one of the customer transactional emails
 * for an order. Clears the "sent at" marker first so the send fires
 * even if the system thinks it was already sent, then records the
 * fresh result on the order.
 *
 * POST body: { type: "confirmation" | "shipping" }
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

  let body: { type?: unknown } = {};
  try {
    body = (await req.json()) as { type?: unknown };
  } catch {
    // Empty is fine; default below rejects it.
  }
  const type = typeof body.type === "string" ? body.type : "";
  if (type !== "confirmation" && type !== "shipping") {
    return NextResponse.json(
      { error: 'Body must include { type: "confirmation" | "shipping" }.' },
      { status: 400 }
    );
  }

  const existing = await getOrder(orderId);
  if (!existing) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (type === "confirmation") {
    if (existing.status !== "paid" && existing.status !== "shipped") {
      return NextResponse.json(
        { error: `Cannot send confirmation — order is "${existing.status}" (needs paid or shipped).` },
        { status: 409 }
      );
    }
    const res = await sendOrderConfirmation(existing);
    const updated = res.ok
      ? {
          ...existing,
          confirmationEmailSentAt: new Date().toISOString(),
          confirmationEmailError: undefined
        }
      : {
          ...existing,
          confirmationEmailError:
            res.error ?? (res.skipped ? "RESEND_API_KEY not configured" : "unknown error")
        };
    await saveOrder(updated);
    return NextResponse.json({ ok: res.ok, order: updated, email: res });
  }

  // shipping
  if (existing.status !== "shipped") {
    return NextResponse.json(
      { error: `Cannot send shipping email — order is "${existing.status}" (needs shipped).` },
      { status: 409 }
    );
  }
  const res = await sendShippingNotification(existing);
  const updated = res.ok
    ? {
        ...existing,
        shippingEmailSentAt: new Date().toISOString(),
        shippingEmailError: undefined
      }
    : {
        ...existing,
        shippingEmailError:
          res.error ?? (res.skipped ? "RESEND_API_KEY not configured" : "unknown error")
      };
  await saveOrder(updated);
  return NextResponse.json({ ok: res.ok, order: updated, email: res });
}
