"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

export default function Prescription({ data }: { data: SiteContent["prescription"] }) {
  return (
    <section id="prescription" className="relative bg-deep py-32 md:py-40">
      <div className="container-luxe grid gap-16 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9 }}
        >
          <span className="eyebrow">{data.eyebrow}</span>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight md:text-5xl">
            {data.title}
          </h2>
          <p className="mt-6 font-body text-base leading-relaxed text-text-secondary">
            {data.subtitle}
          </p>

          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3">
            {data.specialties.map((s, i) => (
              <motion.li
                key={s}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-center gap-3 font-body text-sm text-text-primary"
              >
                <span className="h-px w-6 bg-gold/50" />
                {s}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, rotate: -2, y: 30 }}
          whileInView={{ opacity: 1, rotate: 0, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="luxe-card relative overflow-hidden bg-[#f5efe1] p-8 text-obsidian shadow-gold-soft">
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(0deg,#080808_0_1px,transparent_1px_28px)]"
            />
            <div className="relative">
              <div className="flex items-end justify-between">
                <div>
                  <div className="font-display text-5xl leading-none text-gold">
                    {data.rxCard.header}
                  </div>
                  <div className="mt-1 font-accent text-[9px] uppercase tracking-widest text-obsidian/60">
                    ARATA Nutraceuticals
                  </div>
                </div>
                <div className="text-right font-body text-[11px] text-obsidian/70">
                  {data.rxCard.date}
                </div>
              </div>

              <div className="mt-6 border-t border-obsidian/15 pt-4 font-body text-sm text-obsidian/80">
                {data.rxCard.patient}
              </div>

              <ul className="mt-6 space-y-2 font-display text-lg leading-snug text-obsidian">
                {data.rxCard.lines.map((line, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-accent text-[10px] tracking-widest text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex items-end justify-between border-t border-obsidian/15 pt-4">
                <div className="font-display italic text-2xl text-obsidian/80">Rx ✓</div>
                <div className="text-right">
                  <div className="font-display text-base text-obsidian">
                    {data.rxCard.signature}
                  </div>
                  <div className="mt-1 font-accent text-[8px] uppercase tracking-widest text-obsidian/50">
                    Aeternyx™ Prescriber Programme
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
