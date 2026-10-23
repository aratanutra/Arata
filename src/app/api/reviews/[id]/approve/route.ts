import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getReview, reviewsEnabled, saveReview } from "@/lib/reviews";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Admin: approve a pending review. Flips status to "approved" and
 * stamps approvedAt. Idempotent.
 */
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!reviewsEnabled()) {
    return NextResponse.json({ error: "Reviews storage unavailable." }, { status: 503 });
  }

  const existing = await getReview(params.id);
  if (!existing) return NextResponse.json({ error: "Review not found" }, { status: 404 });

  const updated = {
    ...existing,
    status: "approved" as const,
    approvedAt: existing.approvedAt ?? new Date().toISOString(),
    moderationNote: undefined
  };
  await saveReview(updated);
  return NextResponse.json({ ok: true, review: updated });
}
