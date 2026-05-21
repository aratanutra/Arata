"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

export default function Prescription({ data }: { data: SiteContent["prescription"] }) {
  return (
    <section id="prescription" className="relative bg-canvas py-28 md:py-40">
      <div className="container-app grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <span className="eyebrow">{data.eyebrow}</span>
          <h2 className="mt-4 heading-lg">{data.title}</h2>
          <p className="mt-6 lede">{data.subtitle}</p>

          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3">
            {data.specialties.map((s, i) => (
              <motion.li
                key={s}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="flex items-center gap-3 text-[15px] text-ink"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-sage" />
                {s}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="relative overflow-hidden rounded-3xl border border-hairline bg-canvas p-8 shadow-rx">
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.025] [background-image:repeating-linear-gradient(0deg,#1D1D1F_0_1px,transparent_1px_28px)]"
            />
            <div className="relative">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-5xl font-semibold leading-none text-sage">{data.rxCard.header}</div>
                  <div className="mt-1 text-[10px] font-medium uppercase tracking-widest text-muted">
                    ARATA Nutraceuticals
                  </div>
                </div>
                <div className="text-right text-[12px] text-muted">{data.rxCard.date}</div>
              </div>

              <div className="mt-6 border-t border-hairline pt-4 text-[14px] text-ink-soft">
                {data.rxCard.patient}
              </div>

              <ul className="mt-6 space-y-2 text-[15px] leading-snug text-ink">
                {data.rxCard.lines.map((line, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="tnum text-[11px] font-semibold tracking-widest text-sage">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex items-end justify-between border-t border-hairline pt-4">
                <div className="text-xl font-semibold italic text-ink-soft">Rx ✓</div>
                <div className="text-right">
                  <div className="text-[14px] font-semibold text-ink">{data.rxCard.signature}</div>
                  <div className="mt-1 text-[10px] font-medium uppercase tracking-widest text-muted">
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
