import Link from "next/link";
import { listApprovedReviews, summarise, type StoredReview } from "@/lib/reviews";
import ReviewCard from "./ReviewCard";

function Stars({ rating }: { rating: number }) {
  const r = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span className="inline-flex items-center gap-[3px] text-gold-deep" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-5 w-5" fill={i < r ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M12 2.5l2.95 6.17 6.8.73-5.1 4.62 1.46 6.66L12 17.3l-6.11 3.38 1.46-6.66L2.25 9.4l6.8-.73L12 2.5z" />
        </svg>
      ))}
    </span>
  );
}

export default async function ReviewsSection() {
  const all = await listApprovedReviews(500);
  const summary = summarise(all);
  // Show the 3 highest-rated reviews, newest-first within rating.
  const featured = [...all].sort((a, b) => (b.rating - a.rating) || (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 3);

  return (
    <section className="relative bg-canvas py-20 md:py-28">
      <div className="container-app">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">What people say</span>
          <h2 className="mt-4 heading-md">Reviews from our founding batch</h2>

          {summary.count > 0 ? (
            <div className="mt-6 flex flex-col items-center gap-2">
              <Stars rating={summary.average} />
              <p className="text-sm text-ink-soft">
                <span className="font-semibold text-ink text-lg">{summary.average.toFixed(1)}</span>
                {" "}
                <span className="text-muted">out of 5 · based on {summary.count} verified {summary.count === 1 ? "review" : "reviews"}</span>
              </p>
            </div>
          ) : (
            <p className="mt-6 text-sm text-ink-soft">
              No reviews yet — be the first to share your experience.
            </p>
          )}

          <div className="mt-6">
            <Link href="/reviews/new" className="btn-secondary text-[13px]">
              Write a review →
            </Link>
          </div>
        </div>

        {featured.length ? (
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {featured.map((r) => (
              <ReviewCard key={r.id} review={r} compact />
            ))}
          </div>
        ) : null}

        {summary.count > 3 ? (
          <div className="mt-8 text-center">
            <Link
              href="/reviews"
              className="text-[13px] font-semibold uppercase tracking-widest text-gold-deep hover:text-ink"
            >
              Read all {summary.count} reviews →
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export async function fetchAggregateRating(): Promise<{ count: number; average: number } | null> {
  const all = await listApprovedReviews(500);
  if (!all.length) return null;
  const s = summarise(all);
  return { count: s.count, average: s.average };
}

export async function fetchReviewsForJsonLd(limit = 5): Promise<StoredReview[]> {
  const all = await listApprovedReviews(500);
  return [...all].sort((a, b) => (b.rating - a.rating) || (a.createdAt < b.createdAt ? 1 : -1)).slice(0, limit);
}
