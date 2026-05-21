"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

function CellDiagram() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" role="img" aria-label="Aging pathway diagram">
      <defs>
        <radialGradient id="cellCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E8D5B0" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#C9A96E" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#C9A96E" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="goldStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C9A96E" />
          <stop offset="100%" stopColor="#E8D5B0" />
        </linearGradient>
      </defs>

      <circle cx="200" cy="200" r="180" fill="none" stroke="url(#goldStroke)" strokeOpacity="0.2" strokeDasharray="2 6" />
      <circle cx="200" cy="200" r="150" fill="none" stroke="url(#goldStroke)" strokeOpacity="0.3" />
      <circle cx="200" cy="200" r="110" fill="url(#cellCore)" />
      <circle cx="200" cy="200" r="60" fill="none" stroke="#C9A96E" strokeOpacity="0.5" />
      <circle cx="200" cy="200" r="28" fill="#C9A96E" fillOpacity="0.15" stroke="#E8D5B0" strokeOpacity="0.6" />

      {/* Mitochondria */}
      <g opacity="0.8">
        <ellipse cx="120" cy="140" rx="22" ry="10" fill="none" stroke="#C9A96E" strokeOpacity="0.6" />
        <ellipse cx="280" cy="260" rx="22" ry="10" fill="none" stroke="#C9A96E" strokeOpacity="0.6" />
        <ellipse cx="270" cy="120" rx="18" ry="8" fill="none" stroke="#C9A96E" strokeOpacity="0.5" />
        <ellipse cx="130" cy="280" rx="18" ry="8" fill="none" stroke="#C9A96E" strokeOpacity="0.5" />
      </g>

      {/* Connectors */}
      <g stroke="url(#goldStroke)" strokeOpacity="0.4" strokeDasharray="3 4">
        <line x1="200" y1="200" x2="120" y2="140" />
        <line x1="200" y1="200" x2="280" y2="260" />
        <line x1="200" y1="200" x2="270" y2="120" />
        <line x1="200" y1="200" x2="130" y2="280" />
      </g>

      <text x="200" y="206" textAnchor="middle" fill="#E8D5B0" fontFamily="Syncopate, sans-serif" fontSize="9" letterSpacing="3">
        NUCLEUS
      </text>
    </svg>
  );
}

export default function Science({ data }: { data: SiteContent["science"] }) {
  return (
    <section id="science" className="relative py-32 md:py-40">
      <div className="container-luxe grid gap-16 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9 }}
        >
          <span className="eyebrow">{data.eyebrow}</span>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight md:text-5xl">
            {data.title}
          </h2>
          <p className="mt-6 font-body text-base leading-relaxed text-text-secondary">
            {data.subtitle}
          </p>

          <ul className="mt-10 space-y-5">
            {data.pathways.map((p, i) => (
              <motion.li
                key={p.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex gap-5 border-l border-gold/30 pl-5"
              >
                <span className="font-accent text-[10px] tracking-widest text-gold/60">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="font-display text-xl text-text-primary">{p.name}</h3>
                  <p className="mt-1 font-body text-sm text-text-secondary">{p.detail}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1 }}
          className="relative mx-auto aspect-square w-full max-w-md"
        >
          <CellDiagram />
        </motion.div>
      </div>
    </section>
  );
}
