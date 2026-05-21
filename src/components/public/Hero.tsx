"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

type Props = {
  brand: SiteContent["brand"];
  hero: SiteContent["hero"];
};

function CapsuleRender() {
  return (
    <div className="relative mx-auto h-[300px] w-[300px] md:h-[420px] md:w-[420px]">
      <div className="absolute inset-x-0 bottom-2 mx-auto h-6 w-3/4 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.18)_0%,_transparent_70%)] blur-md" />
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [-6, -2, -6] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-full w-full"
        style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.12))" }}
      >
        <svg viewBox="0 0 220 220" className="h-full w-full" role="img" aria-label="Aeternyx capsule">
          <defs>
            <linearGradient id="capTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F2F2F4" />
            </linearGradient>
            <linearGradient id="capBottom" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3A8C6E" />
              <stop offset="100%" stopColor="#1F5C44" />
            </linearGradient>
            <linearGradient id="hl" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.7)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>

          <g transform="translate(110 110) rotate(35) translate(-110 -110)">
            <rect x="74" y="20" width="72" height="90" rx="36" fill="url(#capTop)" stroke="#E4E4E7" strokeWidth="0.5" />
            <rect x="74" y="110" width="72" height="90" rx="36" fill="url(#capBottom)" />
            <rect x="74" y="106" width="72" height="8" fill="#1F5C44" opacity="0.18" />
            <rect x="82" y="34" width="10" height="60" rx="5" fill="url(#hl)" />
            <rect x="82" y="124" width="10" height="60" rx="5" fill="rgba(255,255,255,0.18)" />
            <text x="110" y="170" textAnchor="middle" fontSize="9" fontWeight="600" fill="rgba(255,255,255,0.85)" fontFamily="Inter, sans-serif" letterSpacing="2">
              ÆX
            </text>
          </g>
        </svg>
      </motion.div>
    </div>
  );
}

export default function Hero({ brand, hero }: Props) {
  return (
    <section className="relative overflow-hidden bg-canvas pt-32 pb-20 md:pt-40 md:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] bg-[radial-gradient(ellipse_at_top,_rgba(45,122,91,0.06)_0%,_transparent_60%)]"
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
            className="mt-6 heading-xl"
          >
            {hero.title}
            <sup className="ml-1 align-super text-[0.28em] font-medium text-muted">
              {brand.trademark}
            </sup>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-5 text-base font-medium uppercase tracking-widest text-sage md:text-lg"
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
            <a href={hero.primaryCta.href} className="btn-primary">
              {hero.primaryCta.label}
            </a>
            <a href={hero.secondaryCta.href} className="btn-link">
              {hero.secondaryCta.label}
              <span aria-hidden>→</span>
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 md:mt-24"
        >
          <CapsuleRender />
        </motion.div>
      </div>
    </section>
  );
}
