import { NextResponse } from "next/server";
import { listApprovedReviews, summarise } from "@/lib/reviews";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Public: list approved reviews with rating summary.
 * Query: ?limit=20 (default 50, max 200)
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const limitParam = url.searchParams.get("limit");
  const limit = Math.max(1, Math.min(200, Number(limitParam) || 50));

  const all = await listApprovedReviews(500);
  const summary = summarise(all);
  const items = all.slice(0, limit).map((r) => ({
    id: r.id,
    name: r.name,
    city: r.city,
    state: r.state,
    rating: r.rating,
    title: r.title,
    body: r.body,
    verifiedPurchaser: r.verifiedPurchaser,
    photoKey: r.photoKey,
    createdAt: r.createdAt
  }));

  return NextResponse.json({ summary, items });
}
