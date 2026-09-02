"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";
import TabletStrip from "./TabletStrip";

type Props = {
  brand: SiteContent["brand"];
  hero: SiteContent["productHero"];
};

function Tick() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7.5 12.4l3 3 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Stars() {
  return (
    <span className="inline-flex items-center gap-0.5 text-gold-deep" aria-label="Composed to global standards">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M10 1l2.6 5.6 6.1.6-4.6 4.2 1.4 6L10 14.7 4.5 17.4l1.4-6L1.3 7.2l6.1-.6L10 1z" />
        </svg>
      ))}
    </span>
  );
}

export default function ProductHero({ brand, hero }: Props) {
  const [subscribe, setSubscribe] = useState(true);
  const price = subscribe ? hero.priceSubscription : hero.priceOneTime;

  const waHref = `https://wa.me/${brand.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
    brand.whatsappGreeting
  )}`;

  const secondary =
    hero.secondaryCta.href === "whatsapp" ? { ...hero.secondaryCta, href: waHref, external: true } : { ...hero.secondaryCta, external: false };

  return (
    <section className="relative overflow-hidden bg-canvas pt-28 pb-16 md:pt-36 md:pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[45vh] bg-[radial-gradient(ellipse_at_top,_rgba(184,147,94,0.10)_0%,_transparent_60%)]"
      />
      <div className="container-app relative">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          {/* Left: product visual */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="card-cream flex aspect-[4/5] items-center justify-center overflow-hidden p-6 md:p-10">
              <TabletStrip size="lg" />
            </div>
            <div className="mt-4 flex items-center justify-center gap-4 text-[11px] uppercase tracking-widest text-muted">
              <span>1×10 Tablet Strip</span>
              <span className="h-1 w-1 rounded-full bg-hairline" />
              <span>10 Actives</span>
              <span className="h-1 w-1 rounded-full bg-hairline" />
              <span>30-day supply</span>
            </div>
          </motion.div>

          {/* Right: purchase panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-hairline bg-paper px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-ink">
                {hero.tag}
              </span>
              <span className="inline-flex items-center gap-2 text-[12px] font-medium text-muted">
                <Stars />
                {hero.endorsement}
              </span>
            </div>

            <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-6xl">
              <span className="wordmark-gold">{hero.title}</span>
              <sup className="ml-1 align-super text-[0.28em] font-medium text-muted">
                {brand.trademark}
              </sup>
            </h1>
            <p className="mt-2 text-sm font-medium uppercase tracking-widest text-gold-deep md:text-base">
              {hero.tagline}
              <sup className="ml-0.5 text-[0.55em] font-medium">{brand.taglineTrademark}</sup>
            </p>

            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted md:text-base">{hero.lead}</p>

            <ul className="mt-6 space-y-2.5">
              {hero.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[14px] leading-relaxed text-ink md:text-[15px]">
                  <Tick />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl border border-hairline bg-paper p-5">
              {/* Purchase type toggle */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSubscribe(false)}
                  className={`rounded-xl border px-3 py-3 text-left transition-all ${
                    !subscribe
                      ? "border-ink bg-canvas shadow-card"
                      : "border-hairline bg-transparent hover:border-ink"
                  }`}
                >
                  <div className="text-[11px] font-medium uppercase tracking-widest text-muted">
                    {hero.priceLabel}
                  </div>
                  <div className="tnum mt-1 text-lg font-semibold tracking-tight text-ink">
                    {hero.priceOneTime}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setSubscribe(true)}
                  className={`relative rounded-xl border px-3 py-3 text-left transition-all ${
                    subscribe
                      ? "border-ink bg-canvas shadow-card"
                      : "border-hairline bg-transparent hover:border-ink"
                  }`}
                >
                  <span className="absolute -top-2 right-3 rounded-full bg-gold-deep px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-canvas">
                    {hero.subscriptionSavings}
                  </span>
                  <div className="text-[11px] font-medium uppercase tracking-widest text-muted">
                    {hero.subscriptionLabel}
                  </div>
                  <div className="tnum mt-1 text-lg font-semibold tracking-tight text-ink">
                    {hero.priceSubscription}
                  </div>
                </button>
              </div>

              <p className="mt-4 text-[12px] uppercase tracking-widest text-muted">
                {hero.cadence}
              </p>

              <div className="mt-5 flex flex-col gap-3">
                {hero.primaryCta.href.startsWith("#") ? (
                  <a href={hero.primaryCta.href} className="btn-primary text-[15px]">
                    {hero.primaryCta.label} <span aria-hidden>→</span>
                  </a>
                ) : (
                  <Link href={hero.primaryCta.href} className="btn-primary text-[15px]">
                    {hero.primaryCta.label} <span aria-hidden>→</span>
                  </Link>
                )}
                <a
                  href={secondary.href}
                  target={secondary.external ? "_blank" : undefined}
                  rel={secondary.external ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-hairline bg-canvas px-6 py-3 text-sm font-medium text-ink transition-all duration-200 hover:border-ink hover:bg-paper"
                >
                  <svg viewBox="0 0 32 32" className="h-4 w-4 text-[#25D366]" fill="currentColor" aria-hidden>
                    <path d="M16 3C9.4 3 4 8.4 4 15c0 2.4.7 4.6 1.9 6.4L4 29l7.8-1.8A11.9 11.9 0 0016 27c6.6 0 12-5.4 12-12S22.6 3 16 3zm5.5 15.2c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-.9 1.2-.4.2-.7.1c-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1s-.2-.5.1-.6c.1-.1.3-.4.5-.5s.2-.3.3-.5.1-.4 0-.5-.7-1.6-.9-2.2-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1.1 1-1.1 2.5 1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4s.3-1.3.2-1.4-.3-.2-.6-.4z"/>
                  </svg>
                  {secondary.label}
                </a>
              </div>

              <p className="mt-4 text-[11px] leading-relaxed text-muted">
                {hero.shipLine}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
              {hero.trustIcons.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-muted"
                >
                  <span aria-hidden className="text-gold-deep">✦</span>
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
