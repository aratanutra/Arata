"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

export default function Philosophy({ data }: { data: SiteContent["philosophy"] }) {
  return (
    <section id="philosophy" className="relative overflow-hidden bg-paper py-24 md:py-32">
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

        <motion.blockquote
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto mt-8 max-w-2xl text-center font-serif text-lg italic leading-[1.55] text-ink md:mt-10 md:text-2xl md:leading-[1.5]"
        >
          <span
            aria-hidden
            className="absolute -left-1 -top-3 font-serif text-3xl leading-none text-gold-deep/40 md:-left-2 md:-top-5 md:text-5xl"
          >
            &ldquo;
          </span>
          <span className="relative">{data.quote}</span>
          <span
            aria-hidden
            className="ml-1 font-serif text-2xl leading-none text-gold-deep/40 md:text-4xl"
          >
            &rdquo;
          </span>
        </motion.blockquote>

        {data.founderName || data.founderTitle ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 flex flex-col items-center gap-2"
          >
            <span className="section-divider w-16" />
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
            className="mt-8 flex justify-center"
          >
            <span className="section-divider w-14" />
          </motion.div>
        )}
      </div>
    </section>
  );
}
