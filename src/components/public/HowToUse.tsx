"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

const ICON_PATHS: Record<string, JSX.Element> = {
  pill: (
    <>
      <rect x="4" y="10" width="16" height="8" rx="4" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <line x1="12" y1="10" x2="12" y2="18" stroke="currentColor" strokeWidth="1.4" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <line x1="12" y1="3" x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="21" />
        <line x1="3" y1="12" x2="5" y2="12" />
        <line x1="19" y1="12" x2="21" y2="12" />
        <line x1="5.6" y1="5.6" x2="7" y2="7" />
        <line x1="17" y1="17" x2="18.4" y2="18.4" />
        <line x1="5.6" y1="18.4" x2="7" y2="17" />
        <line x1="17" y1="7" x2="18.4" y2="5.6" />
      </g>
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <line x1="4" y1="10" x2="20" y2="10" stroke="currentColor" strokeWidth="1.4" />
      <line x1="9" y1="3" x2="9" y2="7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="15" y1="3" x2="15" y2="7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
  store: (
    <>
      <path d="M4 8l1.4-3h13.2L20 8" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
      <rect x="5" y="8" width="14" height="12" rx="1" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <path d="M9 14h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </>
  )
};

function Icon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-gold-deep" fill="none" aria-hidden>
      {ICON_PATHS[name] ?? ICON_PATHS.pill}
    </svg>
  );
}

export default function HowToUse({ data }: { data: SiteContent["howToUse"] }) {
  return (
    <section className="relative bg-paper py-24 md:py-28">
      <div className="container-app">
        <div className="max-w-2xl">
          <span className="eyebrow">{data.eyebrow}</span>
          <h2 className="mt-4 heading-md">{data.title}</h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {data.steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              className="card flex h-full flex-col gap-4 p-6"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gold-soft">
                  <Icon name={step.icon} />
                </div>
                <span className="tnum text-[11px] font-semibold uppercase tracking-widest text-muted">
                  Step {i + 1}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-ink">{step.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{step.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-[13px] leading-relaxed text-muted">
          <span className="font-semibold text-ink">Caution.</span> {data.warning}
        </p>
      </div>
    </section>
  );
}
