import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteReview, getReview, reviewsEnabled } from "@/lib/reviews";
import { deletePhoto } from "@/lib/review-photos";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Admin: hard-delete a review (and its photo if any). Cannot be undone.
 */
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!reviewsEnabled()) {
    return NextResponse.json({ error: "Reviews storage unavailable." }, { status: 503 });
  }

  const existing = await getReview(params.id);
  if (!existing) {
    return NextResponse.json({ ok: true, note: "Already deleted." });
  }

  if (existing.photoKey) {
    await deletePhoto(existing.photoKey);
  }
  const ok = await deleteReview(params.id);
  if (!ok) return NextResponse.json({ error: "Delete failed." }, { status: 500 });

  return NextResponse.json({ ok: true });
}
