"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

type Props = {
  brand: SiteContent["brand"];
  product: SiteContent["product"];
};

function CapsuleStill() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div
        aria-hidden
        className="absolute inset-x-8 bottom-6 h-8 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.18)_0%,_transparent_70%)] blur-md"
      />
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-full w-full"
        style={{ filter: "drop-shadow(0 24px 36px rgba(0,0,0,0.10))" }}
      >
        <svg viewBox="0 0 320 320" className="h-full w-full" role="img" aria-label="Aeternyx capsule">
          <defs>
            <linearGradient id="pcTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#EFEFF2" />
            </linearGradient>
            <linearGradient id="pcBot" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3A8C6E" />
              <stop offset="100%" stopColor="#1F5C44" />
            </linearGradient>
          </defs>
          <g transform="translate(160 160) rotate(-12) translate(-160 -160)">
            <rect x="105" y="40" width="110" height="120" rx="55" fill="url(#pcTop)" stroke="#E4E4E7" strokeWidth="0.6" />
            <rect x="105" y="160" width="110" height="120" rx="55" fill="url(#pcBot)" />
            <rect x="105" y="155" width="110" height="10" fill="#1F5C44" opacity="0.2" />
            <rect x="118" y="60" width="14" height="80" rx="7" fill="rgba(255,255,255,0.8)" />
            <rect x="118" y="180" width="14" height="80" rx="7" fill="rgba(255,255,255,0.16)" />
            <text x="160" y="232" textAnchor="middle" fontSize="13" fontWeight="700" fill="rgba(255,255,255,0.95)" fontFamily="Inter, sans-serif" letterSpacing="3">
              ÆX
            </text>
          </g>
        </svg>
      </motion.div>
    </div>
  );
}

export default function Product({ brand, product }: Props) {
  return (
    <section id="product" className="relative bg-canvas py-28 md:py-40">
      <div className="container-app grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9 }}
          className="order-2 lg:order-1"
        >
          <div className="card-soft p-10 md:p-14">
            <CapsuleStill />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="order-1 lg:order-2"
        >
          <span className="eyebrow">{product.eyebrow}</span>
          <h2 className="mt-4 heading-lg">{product.title}</h2>
          <p className="mt-6 max-w-xl body-base">{product.description}</p>

          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {product.stats.map((stat) => (
              <div key={stat.label} className="card p-5">
                <div className="tnum text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-[11px] font-medium uppercase tracking-widest text-muted">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-baseline gap-3">
            <span className="tnum text-4xl font-semibold tracking-tight text-ink md:text-5xl">
              {product.price}
            </span>
            <span className="text-[12px] uppercase tracking-widest text-muted">
              {product.cadence}
            </span>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={product.primaryCta.href} className="btn-primary">
              {product.primaryCta.label}
            </a>
            <a href={product.secondaryCta.href} className="btn-secondary">
              {product.secondaryCta.label}
            </a>
          </div>

          <p className="mt-6 text-[11px] uppercase tracking-widest text-muted">
            {brand.company}  •  {brand.tagline}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
