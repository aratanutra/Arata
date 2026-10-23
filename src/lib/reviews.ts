import { getStore, type Store } from "@netlify/blobs";
import { isBlobsAvailable } from "./blobs";

export type ReviewStatus = "pending" | "approved" | "rejected";

export type StoredReview = {
  id: string;
  name: string;
  city: string;
  state?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  email?: string;
  orderId?: string;
  verifiedPurchaser: boolean;
  photoKey?: string; // reference into the "review-photos" blob store
  status: ReviewStatus;
  createdAt: string;
  approvedAt?: string;
  moderationNote?: string;
};

const STORE_NAME = "reviews";

function reviewsStore(): Store {
  const siteID = process.env.SITE_ID ?? process.env.NETLIFY_SITE_ID;
  const token =
    process.env.NETLIFY_BLOBS_TOKEN ??
    process.env.NETLIFY_API_TOKEN ??
    process.env.NETLIFY_AUTH_TOKEN;
  if (siteID && token && !process.env.NETLIFY_BLOBS_CONTEXT) {
    return getStore({ name: STORE_NAME, consistency: "strong", siteID, token });
  }
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

export function reviewsEnabled(): boolean {
  return isBlobsAvailable();
}

export async function saveReview(review: StoredReview): Promise<void> {
  await reviewsStore().setJSON(review.id, review);
}

export async function getReview(id: string): Promise<StoredReview | null> {
  try {
    const val = await reviewsStore().get(id, { type: "json" });
    return (val as StoredReview) ?? null;
  } catch {
    return null;
  }
}

export async function deleteReview(id: string): Promise<boolean> {
  try {
    await reviewsStore().delete(id);
    return true;
  } catch {
    return false;
  }
}

export type ListFilter = "all" | ReviewStatus;

export async function listReviews(filter: ListFilter = "all", limit = 500): Promise<StoredReview[]> {
  const store = reviewsStore();
  const out: StoredReview[] = [];
  try {
    const listing = await store.list();
    const keys = listing.blobs.map((b) => b.key).slice(0, limit);
    for (const key of keys) {
      const val = await store.get(key, { type: "json" });
      if (!val) continue;
      const r = val as StoredReview;
      if (filter === "all" || r.status === filter) out.push(r);
    }
  } catch {
    // fall through
  }
  // Newest first.
  out.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return out;
}

export async function listApprovedReviews(limit = 100): Promise<StoredReview[]> {
  return listReviews("approved", limit);
}

export type RatingSummary = {
  count: number;
  average: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
};

export function summarise(reviews: StoredReview[]): RatingSummary {
  const dist: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;
  for (const r of reviews) {
    dist[r.rating]++;
    sum += r.rating;
  }
  const count = reviews.length;
  const average = count ? Math.round((sum / count) * 10) / 10 : 0;
  return { count, average, distribution: dist };
}

export function newReviewId(): string {
  // Short, URL-safe id — 12 chars of random hex.
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
