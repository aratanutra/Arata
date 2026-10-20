import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteOrder, getOrder, ordersEnabled } from "@/lib/orders";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Admin-gated: permanently delete an order from Blobs. Use for
 * cancellations, test orders, duplicates, spam. Shipped orders are
 * blocked by default (customer already has the goods — not safe to
 * discard the record); pass { force: true } to override.
 *
 * DELETE body (optional): { force?: boolean }
 */
export async function DELETE(
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

  let body: { force?: unknown } = {};
  try {
    body = (await req.json()) as { force?: unknown };
  } catch {
    // Empty body is fine.
  }
  const force = body.force === true;

  const existing = await getOrder(orderId);
  if (!existing) {
    // Already gone — treat as success.
    return NextResponse.json({ ok: true, note: "Order was not found; already deleted." });
  }
  if (existing.status === "shipped" && !force) {
    return NextResponse.json(
      {
        error:
          "Order is already shipped. Pass { force: true } to delete anyway (not usually recommended)."
      },
      { status: 409 }
    );
  }

  const ok = await deleteOrder(orderId);
  if (!ok) {
    return NextResponse.json({ error: "Delete failed." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
