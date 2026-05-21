"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

export default function TrustBar({ data }: { data: SiteContent["trustBar"] }) {
  return (
    <section className="relative border-y border-gold-soft bg-deep">
      <div className="container-luxe grid grid-cols-2 gap-6 py-10 md:grid-cols-3 lg:grid-cols-5">
        {data.badges.map((badge, i) => (
          <motion.div
            key={badge.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="flex flex-col items-center gap-2 text-center"
          >
            <div className="grid h-10 w-10 place-items-center rounded-full border border-gold/30 text-gold">
              <span className="font-display text-base">✦</span>
            </div>
            <h3 className="font-accent text-[10px] uppercase tracking-widest text-text-primary">
              {badge.title}
            </h3>
            <p className="font-body text-xs text-text-secondary">{badge.subtitle}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
