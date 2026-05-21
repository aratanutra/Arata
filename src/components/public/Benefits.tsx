"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

const ICON_PATHS: Record<string, JSX.Element> = {
  energy: (
    <path d="M13 3 L5 14 H11 L9 21 L19 9 H13 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
  ),
  cognition: (
    <>
      <path d="M9 4a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h.5V4Z" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <path d="M15 4a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4h-.5V4Z" stroke="currentColor" strokeWidth="1.4" fill="none" />
    </>
  ),
  heart: (
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.7A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
  ),
  skin: (
    <>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <path d="M12 4a8 8 0 0 0 0 16" stroke="currentColor" strokeWidth="1.4" fill="none" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.4" fill="none" />
    </>
  ),
  cell: (
    <>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.4" fill="none" />
    </>
  ),
  shield: (
    <path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
  ),
  gut: (
    <path d="M6 4c0 3 4 3 4 6s-4 3-4 6 4 3 4 4M14 4c0 3 4 3 4 6s-4 3-4 6 4 3 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
  )
};

function Icon({ name }: { name: string }) {
  const inner = ICON_PATHS[name] ?? ICON_PATHS.cell;
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-sage-deep" aria-hidden>
      {inner}
    </svg>
  );
}

export default function Benefits({ data }: { data: SiteContent["benefits"] }) {
  return (
    <section id="benefits" className="relative bg-canvas py-28 md:py-40">
      <div className="container-app">
        <div className="max-w-2xl">
          <span className="eyebrow">{data.eyebrow}</span>
          <h2 className="mt-4 heading-lg">{data.title}</h2>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.tiles.map((tile, i) => (
            <motion.div
              key={tile.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              className="card group flex h-full flex-col gap-6 p-7"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-sage-soft">
                <Icon name={tile.icon} />
              </div>
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-ink">{tile.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{tile.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
