"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { CtaLink, SiteContent } from "@/types/content";
import TabletStrip from "./TabletStrip";

type Props = {
  hero: SiteContent["hero"];
};

function Action({ cta, variant }: { cta: CtaLink; variant: "primary" | "link" }) {
  const className = variant === "primary" ? "btn-primary" : "btn-link";
  const arrow = variant === "link" ? <span aria-hidden>→</span> : null;
  if (cta.href.startsWith("#")) {
    return (
      <a href={cta.href} className={className}>
        {cta.label}
        {arrow}
      </a>
    );
  }
  return (
    <Link href={cta.href} className={className}>
      {cta.label}
      {arrow}
    </Link>
  );
}

export default function Hero({ hero }: Props) {
  return (
    <section className="relative overflow-hidden bg-canvas pt-32 pb-20 md:pt-40 md:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] bg-[radial-gradient(ellipse_at_top,_rgba(184,147,94,0.10)_0%,_transparent_60%)]"
      />
      <div className="container-app relative">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="eyebrow"
          >
            {hero.eyebrow}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-4xl font-semibold tracking-tight text-ink md:text-7xl lg:text-8xl lg:leading-[1.02]"
          >
            {hero.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-5 text-base font-medium uppercase tracking-widest text-gold-deep md:text-lg"
          >
            {hero.tagline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mt-8 max-w-2xl lede"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Action cta={hero.primaryCta} variant="primary" />
            <Action cta={hero.secondaryCta} variant="link" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 flex justify-center md:mt-24"
        >
          <TabletStrip size="lg" />
        </motion.div>
      </div>
    </section>
  );
}
