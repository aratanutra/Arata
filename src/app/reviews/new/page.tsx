import type { Metadata } from "next";
import { readContent } from "@/lib/content";
import Nav from "@/components/public/Nav";
import Footer from "@/components/public/Footer";
import WhatsAppFloat from "@/components/public/WhatsAppFloat";
import ReviewForm from "./ReviewForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "Write a Review — AETERNYX® | Arata Nutraceuticals"
  },
  description:
    "Share your experience with AETERNYX® — the single-tablet healthspan nutraceutical from Arata Nutraceuticals. Your review helps new readers decide.",
  alternates: {
    canonical: "/reviews/new"
  }
};

type Props = { searchParams?: { order?: string } };

export default async function NewReviewPage({ searchParams }: Props) {
  const content = await readContent();
  const prefilledOrderId = typeof searchParams?.order === "string" ? searchParams.order : "";

  return (
    <main className="relative bg-canvas">
      <Nav brand={content.brand} nav={content.nav} />

      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[40vh] bg-[radial-gradient(ellipse_at_top,_rgba(184,147,94,0.08)_0%,_transparent_60%)]"
        />
        <div className="container-app relative">
          <div className="mx-auto max-w-2xl">
            <span className="eyebrow">Write a review</span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink md:text-5xl">
              Share your experience
            </h1>
            <p className="mt-4 lede">
              Even one or two lines genuinely help new readers decide. Reviews are moderated —
              we approve honest, specific experiences; we don&apos;t publish personal attacks or
              anything medical advice-y.
            </p>

            <div className="mt-10">
              <ReviewForm prefilledOrderId={prefilledOrderId} />
            </div>
          </div>
        </div>
      </section>

      <Footer brand={content.brand} footer={content.footer} />
      <WhatsAppFloat number={content.brand.whatsappNumber} greeting={content.brand.whatsappGreeting} />
    </main>
  );
}
