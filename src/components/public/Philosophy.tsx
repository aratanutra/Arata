"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

export default function Philosophy({ data }: { data: SiteContent["philosophy"] }) {
  return (
    <section id="philosophy" className="relative overflow-hidden bg-paper py-28 md:py-40">
      <div className="container-tight relative">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="eyebrow block text-center"
        >
          {data.eyebrow}
        </motion.span>

        {/* Large decorative opening quote mark */}
        <motion.span
          aria-hidden
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9 }}
          className="mt-6 block text-center font-serif text-[120px] leading-none text-gold-deep/70 md:text-[180px]"
        >
          &ldquo;
        </motion.span>

        <motion.blockquote
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="mx-auto -mt-8 max-w-3xl text-center font-serif text-2xl italic leading-[1.35] tracking-tight text-ink md:-mt-12 md:text-4xl md:leading-[1.3]"
        >
          {data.quote}
        </motion.blockquote>

        {data.founderName || data.founderTitle ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-col items-center gap-2"
          >
            <span className="section-divider w-20" />
            {data.founderName ? (
              <span className="text-base font-semibold tracking-tight text-ink">
                {data.founderName}
              </span>
            ) : null}
            {data.founderTitle ? (
              <span className="text-[11px] font-medium uppercase tracking-widest text-muted">
                {data.founderTitle}
              </span>
            ) : null}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex justify-center"
          >
            <span className="section-divider w-16" />
          </motion.div>
        )}
      </div>
    </section>
  );
}
