import type { Metadata } from "next";
import Link from "next/link";
import { readContent } from "@/lib/content";
import Nav from "@/components/public/Nav";
import Footer from "@/components/public/Footer";
import WhatsAppFloat from "@/components/public/WhatsAppFloat";
import ReviewCard from "@/components/public/ReviewCard";
import { listApprovedReviews, summarise } from "@/lib/reviews";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "Customer Reviews — AETERNYX® | Arata Nutraceuticals"
  },
  description:
    "Read verified customer reviews for AETERNYX® — the single-tablet healthspan nutraceutical from Arata Nutraceuticals.",
  alternates: {
    canonical: "/reviews"
  }
};

function Stars({ rating, size = 20 }: { rating: number; size?: number }) {
  const r = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span className="inline-flex items-center gap-[3px] text-gold-deep" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" width={size} height={size} fill={i < r ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M12 2.5l2.95 6.17 6.8.73-5.1 4.62 1.46 6.66L12 17.3l-6.11 3.38 1.46-6.66L2.25 9.4l6.8-.73L12 2.5z" />
        </svg>
      ))}
    </span>
  );
}

export default async function ReviewsPage() {
  const content = await readContent();
  const all = await listApprovedReviews(500);
  const summary = summarise(all);

  return (
    <main className="relative bg-canvas">
      <Nav brand={content.brand} nav={content.nav} />

      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="container-app">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">Customer reviews</span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink md:text-5xl">
              What people are saying
            </h1>

            {summary.count > 0 ? (
              <div className="mt-6 flex flex-col items-center gap-2">
                <Stars rating={summary.average} />
                <p className="text-sm text-ink-soft">
                  <span className="text-2xl font-semibold text-ink">{summary.average.toFixed(1)}</span>
                  {" "}
                  <span className="text-muted">out of 5 · based on {summary.count} verified {summary.count === 1 ? "review" : "reviews"}</span>
                </p>
              </div>
            ) : (
              <p className="mt-6 text-sm text-ink-soft max-w-md mx-auto">
                No reviews yet. Taken AETERNYX® for a few weeks? Help the next person decide — share your experience.
              </p>
            )}

            <div className="mt-6">
              <Link href="/reviews/new" className="btn-primary text-[14px]">
                Write a review
              </Link>
            </div>
          </div>

          {all.length ? (
            <div className="mx-auto mt-14 grid max-w-3xl gap-4">
              {all.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <Footer brand={content.brand} footer={content.footer} />
      <WhatsAppFloat number={content.brand.whatsappNumber} greeting={content.brand.whatsappGreeting} />
    </main>
  );
}
