"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

export default function Philosophy({ data }: { data: SiteContent["philosophy"] }) {
  return (
    <section id="philosophy" className="relative overflow-hidden bg-mist py-28 md:py-44">
      <div className="container-tight relative text-center">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="eyebrow"
        >
          {data.eyebrow}
        </motion.span>

        <motion.blockquote
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9 }}
          className="mx-auto mt-8 max-w-4xl text-2xl font-medium leading-snug tracking-tight text-ink md:text-4xl"
        >
          <span aria-hidden className="block text-3xl text-sage md:text-5xl">&ldquo;</span>
          <span>{data.quote}</span>
          <span aria-hidden className="block text-3xl text-sage md:text-5xl">&rdquo;</span>
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 inline-flex flex-col items-center gap-2"
        >
          <span className="section-divider w-20" />
          <span className="text-base font-semibold tracking-tight text-ink">{data.founderName}</span>
          <span className="text-[11px] font-medium uppercase tracking-widest text-muted">
            {data.founderTitle}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
