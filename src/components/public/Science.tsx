"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

function CellDiagram() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" role="img" aria-label="Cell-level mechanism diagram">
      <defs>
        <radialGradient id="cellGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#EDF5F0" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="200" cy="200" r="180" fill="none" stroke="#D2D2D7" strokeDasharray="2 6" />
      <circle cx="200" cy="200" r="150" fill="none" stroke="#D2D2D7" />
      <circle cx="200" cy="200" r="110" fill="url(#cellGlow)" />
      <circle cx="200" cy="200" r="60" fill="none" stroke="#2D7A5B" strokeWidth="1" strokeOpacity="0.6" />
      <circle cx="200" cy="200" r="28" fill="#EDF5F0" stroke="#2D7A5B" strokeWidth="1" />

      <g stroke="#2D7A5B" strokeOpacity="0.85" fill="none">
        <ellipse cx="120" cy="140" rx="22" ry="10" />
        <ellipse cx="280" cy="260" rx="22" ry="10" />
        <ellipse cx="270" cy="120" rx="18" ry="8" />
        <ellipse cx="130" cy="280" rx="18" ry="8" />
      </g>

      <g stroke="#1D1D1F" strokeOpacity="0.25" strokeDasharray="3 4">
        <line x1="200" y1="200" x2="120" y2="140" />
        <line x1="200" y1="200" x2="280" y2="260" />
        <line x1="200" y1="200" x2="270" y2="120" />
        <line x1="200" y1="200" x2="130" y2="280" />
      </g>

      <text
        x="200"
        y="205"
        textAnchor="middle"
        fill="#1F5C44"
        fontFamily="Inter, sans-serif"
        fontWeight="600"
        fontSize="9"
        letterSpacing="3"
      >
        NUCLEUS
      </text>
    </svg>
  );
}

export default function Science({ data }: { data: SiteContent["science"] }) {
  return (
    <section id="science" className="relative bg-canvas py-28 md:py-40">
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

          <ul className="mt-10 space-y-6">
            {data.pathways.map((p, i) => (
              <motion.li
                key={p.name}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="flex gap-5"
              >
                <span className="tnum mt-1 w-8 shrink-0 text-[11px] font-medium uppercase tracking-widest text-sage">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="border-l border-hairline pl-5">
                  <h3 className="text-lg font-semibold tracking-tight text-ink">{p.name}</h3>
                  <p className="mt-1 text-[14px] leading-relaxed text-muted">{p.detail}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9 }}
          className="relative mx-auto aspect-square w-full max-w-md"
        >
          <div className="card-soft h-full w-full p-6">
            <CellDiagram />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
