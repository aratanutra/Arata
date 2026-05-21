"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

const ICON_MAP: Record<string, string> = {
  energy: "⚡",
  cognition: "✦",
  heart: "♡",
  skin: "◐",
  eye: "◎",
  cell: "❋",
  shield: "✧",
  gut: "◯"
};

export default function Benefits({ data }: { data: SiteContent["benefits"] }) {
  return (
    <section id="benefits" className="relative bg-deep py-32 md:py-40">
      <div className="container-luxe">
        <div className="max-w-2xl">
          <span className="eyebrow">{data.eyebrow}</span>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight md:text-6xl">
            {data.title}
          </h2>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.tiles.map((tile, i) => (
            <motion.div
              key={tile.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: (i % 4) * 0.08 }}
              className="luxe-card group relative aspect-[4/5] overflow-hidden p-6"
            >
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent" />
              </div>
              <div className="relative flex h-full flex-col justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-full border border-gold/30 font-display text-xl text-gold">
                  {ICON_MAP[tile.icon] ?? "✦"}
                </div>
                <div>
                  <h3 className="font-display text-2xl text-text-primary">{tile.title}</h3>
                  <p className="mt-3 font-body text-sm leading-relaxed text-text-secondary">
                    {tile.detail}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
