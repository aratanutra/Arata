"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

export default function Philosophy({ data }: { data: SiteContent["philosophy"] }) {
  return (
    <section id="philosophy" className="relative overflow-hidden py-32 md:py-44">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,169,110,0.10)_0%,_transparent_55%)]"
      />
      <div className="container-luxe relative text-center">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="eyebrow"
        >
          {data.eyebrow}
        </motion.span>

        <motion.blockquote
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1 }}
          className="mx-auto mt-10 max-w-5xl font-display text-3xl leading-[1.25] text-text-primary md:text-5xl"
        >
          <span className="text-gold-gradient text-6xl leading-none">“</span>
          <span className="italic">{data.quote}</span>
          <span className="text-gold-gradient text-6xl leading-none">”</span>
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 inline-flex flex-col items-center gap-2"
        >
          <span className="gold-divider w-24" />
          <span className="font-display text-xl text-gold-gradient">{data.founderName}</span>
          <span className="font-accent text-[10px] uppercase tracking-widest text-text-secondary">
            {data.founderTitle}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
