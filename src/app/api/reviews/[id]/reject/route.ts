import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getReview, reviewsEnabled, saveReview } from "@/lib/reviews";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Admin: reject a pending review. Keeps the record (so the same user can't
 * flood the queue with duplicates) but marks status=rejected and stores an
 * optional moderation note.
 *
 * POST body (optional): { note?: string }
 */
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!reviewsEnabled()) {
    return NextResponse.json({ error: "Reviews storage unavailable." }, { status: 503 });
  }

  const existing = await getReview(params.id);
  if (!existing) return NextResponse.json({ error: "Review not found" }, { status: 404 });

  let note: string | undefined;
  try {
    const body = (await req.json()) as { note?: unknown };
    if (typeof body.note === "string" && body.note.trim().length > 0) {
      note = body.note.trim().slice(0, 500);
    }
  } catch {
    // empty body is fine
  }

  const updated = {
    ...existing,
    status: "rejected" as const,
    approvedAt: undefined,
    moderationNote: note
  };
  await saveReview(updated);
  return NextResponse.json({ ok: true, review: updated });
}
