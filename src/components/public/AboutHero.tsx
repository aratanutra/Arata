"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

export default function AboutHero({ hero }: { hero: SiteContent["about"]["hero"] }) {
  return (
    <section className="relative overflow-hidden bg-canvas pt-32 pb-16 md:pt-40 md:pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[40vh] bg-[radial-gradient(ellipse_at_top,_rgba(45,122,91,0.06)_0%,_transparent_60%)]"
      />
      <div className="container-tight relative text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="eyebrow"
        >
          {hero.eyebrow}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 text-4xl font-semibold tracking-tight text-ink md:text-6xl"
        >
          {hero.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-6 mx-auto max-w-2xl text-base leading-relaxed text-muted md:text-lg"
        >
          {hero.subtitle}
        </motion.p>
      </div>
    </section>
  );
}
