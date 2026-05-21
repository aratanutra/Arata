"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

type Props = {
  brand: SiteContent["brand"];
  data: SiteContent["homeFeatured"];
};

function CapsuleSmall() {
  return (
    <div className="relative aspect-square w-full">
      <div
        aria-hidden
        className="absolute inset-x-10 bottom-6 h-8 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.18)_0%,_transparent_70%)] blur-md"
      />
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-full w-full"
        style={{ filter: "drop-shadow(0 24px 36px rgba(0,0,0,0.10))" }}
      >
        <svg viewBox="0 0 320 320" className="h-full w-full" role="img" aria-label="Aeternyx capsule">
          <defs>
            <linearGradient id="hfTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#EFEFF2" />
            </linearGradient>
            <linearGradient id="hfBot" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3A8C6E" />
              <stop offset="100%" stopColor="#1F5C44" />
            </linearGradient>
          </defs>
          <g transform="translate(160 160) rotate(-12) translate(-160 -160)">
            <rect x="105" y="40" width="110" height="120" rx="55" fill="url(#hfTop)" stroke="#E4E4E7" strokeWidth="0.6" />
            <rect x="105" y="160" width="110" height="120" rx="55" fill="url(#hfBot)" />
            <rect x="105" y="155" width="110" height="10" fill="#1F5C44" opacity="0.2" />
            <rect x="118" y="60" width="14" height="80" rx="7" fill="rgba(255,255,255,0.8)" />
            <rect x="118" y="180" width="14" height="80" rx="7" fill="rgba(255,255,255,0.16)" />
            <text
              x="160"
              y="232"
              textAnchor="middle"
              fontSize="13"
              fontWeight="700"
              fill="rgba(255,255,255,0.95)"
              fontFamily="Inter, sans-serif"
              letterSpacing="3"
            >
              ÆX
            </text>
          </g>
        </svg>
      </motion.div>
    </div>
  );
}

export default function HomeFeatured({ brand, data }: Props) {
  return (
    <section className="relative bg-canvas py-24 md:py-32">
      <div className="container-app">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="card-elevated overflow-hidden"
        >
          <div className="grid gap-12 p-8 md:grid-cols-[1fr_1.1fr] md:gap-16 md:p-14 lg:p-20">
            <div className="card-soft order-2 grid place-items-center p-8 md:order-1 md:p-12">
              <CapsuleSmall />
            </div>
            <div className="order-1 flex flex-col justify-center md:order-2">
              <span className="eyebrow">{data.eyebrow}</span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink md:text-5xl">
                {data.title}
                <sup className="ml-1 align-super text-[0.32em] font-medium text-muted">
                  {brand.trademark}
                </sup>
              </h2>
              <p className="mt-3 text-sm font-medium uppercase tracking-widest text-sage md:text-base">
                {data.tagline}
              </p>
              <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">
                {data.description}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
                {data.highlights.map((h) => (
                  <div key={h.label} className="rounded-xl bg-mist px-4 py-3">
                    <div className="tnum text-xl font-semibold tracking-tight text-ink md:text-2xl">
                      {h.value}
                    </div>
                    <div className="mt-1 text-[10px] font-medium uppercase tracking-widest text-muted">
                      {h.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={data.primaryCta.href} className="btn-primary">
                  {data.primaryCta.label}
                </Link>
                <Link href={data.secondaryCta.href} className="btn-link">
                  {data.secondaryCta.label}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
