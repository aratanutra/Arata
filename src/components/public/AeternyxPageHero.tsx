"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

type Props = {
  brand: SiteContent["brand"];
  page: SiteContent["aeternyxPage"];
};

export default function AeternyxPageHero({ brand, page }: Props) {
  return (
    <section className="relative overflow-hidden bg-canvas pt-32 pb-16 md:pt-40 md:pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[40vh] bg-[radial-gradient(ellipse_at_top,_rgba(45,122,91,0.06)_0%,_transparent_60%)]"
      />
      <div className="container-app relative">
        <div className="mx-auto max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="eyebrow"
          >
            {page.eyebrow}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 text-5xl font-semibold tracking-tight text-ink md:text-7xl"
          >
            {page.title}
            <sup className="ml-1 align-super text-[0.28em] font-medium text-muted">
              {brand.trademark}
            </sup>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-4 text-sm font-medium uppercase tracking-widest text-sage md:text-base"
          >
            {page.tagline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-6 max-w-2xl mx-auto text-base leading-relaxed text-muted md:text-lg"
          >
            {page.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <a href={page.primaryCta.href} className="btn-primary">
              {page.primaryCta.label}
            </a>
            <a href={page.secondaryCta.href} className="btn-link">
              {page.secondaryCta.label}
              <span aria-hidden>→</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
