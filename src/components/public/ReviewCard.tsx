type Props = {
  review: {
    name: string;
    city: string;
    state?: string;
    rating: number;
    title: string;
    body: string;
    verifiedPurchaser?: boolean;
    photoKey?: string;
    createdAt: string;
  };
  compact?: boolean;
};

function Stars({ rating }: { rating: number }) {
  const r = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span
      className="inline-flex items-center gap-[2px] text-gold-deep"
      aria-label={`${r} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="h-[14px] w-[14px]"
          fill={i < r ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <path d="M12 2.5l2.95 6.17 6.8.73-5.1 4.62 1.46 6.66L12 17.3l-6.11 3.38 1.46-6.66L2.25 9.4l6.8-.73L12 2.5z" />
        </svg>
      ))}
    </span>
  );
}

export default function ReviewCard({ review, compact = false }: Props) {
  const dateLabel = new Date(review.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata"
  });
  const location = review.state ? `${review.city}, ${review.state}` : review.city;

  return (
    <article className="rounded-2xl border border-hairline bg-paper p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Stars rating={review.rating} />
          <h3 className={`mt-2 ${compact ? "text-base" : "text-lg"} font-semibold tracking-tight text-ink`}>
            {review.title}
          </h3>
        </div>
        {review.verifiedPurchaser ? (
          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-emerald-800">
            ✓ Verified
          </span>
        ) : null}
      </div>

      <p className={`mt-3 whitespace-pre-wrap ${compact ? "text-[13px]" : "text-[14px] md:text-[15px]"} leading-relaxed text-ink-soft`}>
        {review.body}
      </p>

      {review.photoKey ? (
        <div className="mt-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/reviews/photo/${review.photoKey}`}
            alt={`Photo shared by ${review.name}`}
            className="max-h-72 w-auto rounded-lg border border-hairline object-cover"
            loading="lazy"
          />
        </div>
      ) : null}

      <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-widest text-muted">
        <span>
          <span className="font-semibold text-ink">{review.name}</span> · {location}
        </span>
        <span>{dateLabel}</span>
      </div>
    </article>
  );
}
