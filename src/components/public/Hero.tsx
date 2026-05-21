"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

type Props = {
  brand: SiteContent["brand"];
  hero: SiteContent["hero"];
};

export default function Hero({ brand, hero }: Props) {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-obsidian">
      <div className="absolute inset-0 bg-obsidian-fade" />
      <div
        aria-hidden
        className="absolute left-1/2 top-[55%] -z-10 h-[110vmin] w-[110vmin] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="absolute inset-0 animate-orb-pulse rounded-full bg-[radial-gradient(circle_at_center,_rgba(232,213,176,0.35)_0%,_rgba(201,169,110,0.12)_30%,_transparent_65%)] blur-3xl" />
        <div className="absolute inset-[18%] animate-orb-spin rounded-full border border-gold/20" />
        <div className="absolute inset-[28%] animate-orb-spin rounded-full border border-gold/15" style={{ animationDirection: "reverse", animationDuration: "30s" }} />
        <div className="absolute inset-[38%] rounded-full border border-gold/25 shadow-gold-soft" />
        <div className="absolute inset-[44%] rounded-full bg-gradient-to-br from-gold/30 via-gold-light/10 to-transparent blur-2xl" />
      </div>

      <div className="container-luxe relative z-10 flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="eyebrow mb-8"
        >
          {hero.eyebrow}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[18vw] leading-[0.9] tracking-tight md:text-[clamp(96px,15vw,240px)]"
        >
          <span className="text-gold-gradient">{hero.title}</span>
          <sup className="ml-2 align-super text-[0.18em] text-gold/70">{brand.trademark}</sup>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55 }}
          className="mt-6 font-accent text-xs uppercase tracking-[0.5em] text-gold"
        >
          {hero.tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="mt-10 max-w-2xl text-balance font-body text-base leading-relaxed text-text-secondary md:text-lg"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
        >
          <a href={hero.primaryCta.href} className="btn-gold">
            {hero.primaryCta.label}
          </a>
          <a href={hero.secondaryCta.href} className="btn-ghost">
            {hero.secondaryCta.label}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.4 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-secondary"
        >
          <span className="font-accent text-[9px] uppercase tracking-widest">Scroll</span>
          <span className="h-10 w-px bg-gradient-to-b from-gold/60 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
