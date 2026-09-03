"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";
import Carton3D from "./Carton3D";

type Props = {
  brand: SiteContent["brand"];
  data: SiteContent["homeFeatured"];
};

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
            <Carton3D
              className="card-cream relative order-2 aspect-[4/5] w-full overflow-hidden md:aspect-auto md:h-full"
              showHint
            />
            <div className="order-1 flex flex-col justify-center">
              <span className="eyebrow">{data.eyebrow}</span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink md:text-5xl">
                <span className="wordmark-gold">{data.title}</span>
                <sup className="ml-1 align-super text-[0.32em] font-medium text-muted">
                  {brand.trademark}
                </sup>
              </h2>
              <p className="mt-3 text-sm font-medium uppercase tracking-widest text-gold-deep md:text-base">
                {data.tagline}
                <sup className="ml-0.5 text-[0.55em] font-medium">™</sup>
              </p>
              <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">
                {data.description}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
                {data.highlights.map((h) => (
                  <div key={h.label} className="rounded-xl bg-paper px-4 py-3">
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
