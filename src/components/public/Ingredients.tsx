"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

export default function Ingredients({ data }: { data: SiteContent["ingredientsSection"] }) {
  return (
    <section id="ingredients" className="relative bg-deep py-32 md:py-40">
      <div className="container-luxe">
        <div className="max-w-2xl">
          <span className="eyebrow">{data.eyebrow}</span>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight md:text-6xl">
            {data.title}
          </h2>
          <p className="mt-6 font-body text-base leading-relaxed text-text-secondary">
            {data.subtitle}
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          {data.items.map((ing, i) => (
            <motion.div
              key={ing.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: (i % 4) * 0.05 }}
              className="luxe-card group relative overflow-hidden p-6"
            >
              <div className="absolute -top-px left-0 h-px w-0 bg-gold-gradient transition-all duration-500 group-hover:w-full" />
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-accent text-[9px] tracking-widest text-text-secondary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-2xl leading-tight text-text-primary">
                    {ing.name}
                  </h3>
                </div>
                <span className="shrink-0 rounded-full border border-gold/30 px-3 py-1 font-accent text-[10px] tracking-widest text-gold">
                  {ing.dose}
                </span>
              </div>
              <p className="mt-4 font-body text-sm leading-relaxed text-text-secondary">
                {ing.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
