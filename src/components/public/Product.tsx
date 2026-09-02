"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { CtaLink, SiteContent } from "@/types/content";
import TabletStrip from "./TabletStrip";

type Props = {
  brand: SiteContent["brand"];
  product: SiteContent["product"];
};

function Action({ cta, variant }: { cta: CtaLink; variant: "primary" | "secondary" }) {
  const className = variant === "primary" ? "btn-primary" : "btn-secondary";
  if (cta.href.startsWith("#")) {
    return (
      <a href={cta.href} className={className}>
        {cta.label}
      </a>
    );
  }
  return (
    <Link href={cta.href} className={className}>
      {cta.label}
    </Link>
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
          <div className="card-cream flex items-center justify-center p-10 md:p-14">
            <TabletStrip size="md" />
          </div>
          {product.packForm ? (
            <p className="mt-4 text-center text-[12px] uppercase tracking-widest text-muted">
              {product.packForm}
            </p>
          ) : null}
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
            <Action cta={product.primaryCta} variant="primary" />
            <Action cta={product.secondaryCta} variant="secondary" />
          </div>

          <p className="mt-6 text-[11px] uppercase tracking-widest text-muted">
            {brand.company} · {brand.tagline}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
