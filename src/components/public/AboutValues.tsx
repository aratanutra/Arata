"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

export default function AboutValues({ values }: { values: SiteContent["about"]["values"] }) {
  return (
    <section className="relative bg-canvas py-24 md:py-32">
      <div className="container-app">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="heading-md max-w-2xl"
        >
          {values.title}
        </motion.h2>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {values.items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.06 }}
              className="card flex h-full flex-col gap-4 p-6"
            >
              <span className="tnum text-[12px] font-semibold uppercase tracking-widest text-sage">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-ink">{item.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{item.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
