"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

type Props = {
  brand: SiteContent["brand"];
  product: SiteContent["product"];
};

function CapsuleVisual() {
  return (
    <div className="relative flex aspect-square w-full items-center justify-center">
      <div
        aria-hidden
        className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle_at_50%_40%,_rgba(232,213,176,0.20)_0%,_transparent_60%)] blur-2xl"
      />
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-[78%] w-[28%]"
      >
        <div className="absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-gradient-to-b from-[#1a1a1a] via-[#0e0e0e] to-[#0a0a0a] shadow-[inset_0_2px_0_rgba(232,213,176,0.18)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 rounded-b-full bg-gradient-to-b from-[#C9A96E] via-[#E8D5B0] to-[#9c804f] shadow-[inset_0_-2px_0_rgba(0,0,0,0.3),inset_0_2px_0_rgba(255,255,255,0.25)]" />
        <div className="absolute inset-y-0 left-[6%] w-[8%] rounded-full bg-gradient-to-b from-white/30 via-white/10 to-transparent blur-[1px]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-obsidian/80 px-2 py-0.5 font-accent text-[8px] tracking-widest text-gold-light">
          ÆX
        </div>
      </motion.div>

      <motion.div
        aria-hidden
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[6%] rounded-full border border-dashed border-gold/15"
      />
      <motion.div
        aria-hidden
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[18%] rounded-full border border-dashed border-gold/10"
      />
    </div>
  );
}

export default function Product({ brand, product }: Props) {
  return (
    <section id="product" className="relative py-32 md:py-40">
      <div className="container-luxe grid items-center gap-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.0 }}
          className="relative order-2 lg:order-1"
        >
          <CapsuleVisual />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9 }}
          className="order-1 lg:order-2"
        >
          <span className="eyebrow">{product.eyebrow}</span>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight md:text-6xl">
            {product.title}
          </h2>
          <p className="mt-6 max-w-xl font-body text-base leading-relaxed text-text-secondary">
            {product.description}
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {product.stats.map((stat) => (
              <div key={stat.label} className="luxe-card p-5">
                <div className="font-display text-4xl text-gold-gradient">{stat.value}</div>
                <div className="mt-2 font-accent text-[9px] uppercase tracking-widest text-text-secondary">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-baseline gap-3">
            <span className="font-display text-5xl text-gold-gradient">{product.price}</span>
            <span className="font-accent text-[10px] uppercase tracking-widest text-text-secondary">
              {product.cadence}
            </span>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={product.primaryCta.href} className="btn-gold">
              {product.primaryCta.label}
            </a>
            <a href={product.secondaryCta.href} className="btn-ghost">
              {product.secondaryCta.label}
            </a>
          </div>

          <p className="mt-6 font-accent text-[9px] uppercase tracking-widest text-text-secondary">
            {brand.company}  •  {brand.tagline}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
