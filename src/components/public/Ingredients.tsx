"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

export default function Ingredients({ data }: { data: SiteContent["ingredientsSection"] }) {
  return (
    <section id="ingredients" className="relative bg-mist py-28 md:py-40">
      <div className="container-app">
        <div className="max-w-2xl">
          <span className="eyebrow">{data.eyebrow}</span>
          <h2 className="mt-4 heading-lg">{data.title}</h2>
          <p className="mt-6 lede">{data.subtitle}</p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {data.items.map((ing, i) => (
            <motion.div
              key={ing.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.05 }}
              className="card group relative overflow-hidden p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-baseline gap-3">
                  <span className="tnum text-[12px] font-medium text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-xl font-semibold tracking-tight text-ink">{ing.name}</h3>
                </div>
                <span className="shrink-0 rounded-full bg-sage-soft px-3 py-1 text-[12px] font-semibold tabular-nums tracking-tight text-sage-deep">
                  {ing.dose}
                </span>
              </div>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">{ing.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
