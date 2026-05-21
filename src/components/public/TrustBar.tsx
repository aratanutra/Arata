"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

function Tick() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="11" stroke="#2D7A5B" strokeWidth="1.2" />
      <path d="M7.5 12.4l3 3 6-6" stroke="#2D7A5B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function TrustBar({ data }: { data: SiteContent["trustBar"] }) {
  return (
    <section className="relative border-y border-hairline bg-mist">
      <div className="container-app grid grid-cols-2 gap-x-6 gap-y-8 py-10 md:grid-cols-3 lg:grid-cols-5">
        {data.badges.map((badge, i) => (
          <motion.div
            key={badge.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="flex items-start gap-3"
          >
            <Tick />
            <div>
              <h3 className="text-[13px] font-semibold tracking-tight text-ink">{badge.title}</h3>
              <p className="mt-1 text-[12px] leading-snug text-muted">{badge.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
