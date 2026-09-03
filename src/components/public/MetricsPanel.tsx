"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

type Props = { data: SiteContent["metricsPanel"] };

const USAGE_ICONS: Record<string, JSX.Element> = {
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <line x1="12" y1="2.5" x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="21.5" />
        <line x1="2.5" y1="12" x2="5" y2="12" />
        <line x1="19" y1="12" x2="21.5" y2="12" />
        <line x1="5" y1="5" x2="6.8" y2="6.8" />
        <line x1="17.2" y1="17.2" x2="19" y2="19" />
        <line x1="5" y1="19" x2="6.8" y2="17.2" />
        <line x1="17.2" y1="6.8" x2="19" y2="5" />
      </g>
    </>
  ),
  drop: (
    <>
      {/* stylised hand + tablet drop */}
      <path
        d="M12 3.5c1.6 2.4 4.2 4.6 4.2 7.2a4.2 4.2 0 1 1-8.4 0C7.8 8.1 10.4 5.9 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M5 17.5c1.4-1.2 3.6-1.4 5.4-.4l1 .6 1-.6c1.8-1 4-.8 5.4.4l.7.6-1.2 1.4c-.8 1-2 1.6-3.3 1.6H8.8c-1.3 0-2.5-.6-3.3-1.6L4.3 18l.7-.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
    </>
  ),
  warning: (
    <>
      <path
        d="M12 3.2 21 19.6H3L12 3.2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
      <line x1="12" y1="9.5" x2="12" y2="14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="16.6" r="0.9" fill="currentColor" />
    </>
  )
};

function UsageIcon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-gold-deep" fill="none" aria-hidden>
      {USAGE_ICONS[name] ?? USAGE_ICONS.sun}
    </svg>
  );
}

export default function MetricsPanel({ data }: Props) {
  return (
    <section className="relative bg-paper py-24 md:py-28">
      <div className="container-app">
        <div className="max-w-2xl">
          <span className="eyebrow">{data.eyebrow}</span>
          <h2 className="mt-4 heading-md">{data.title}</h2>
        </div>

        {/* Metric pills row: left copy + 2×2 pill grid */}
        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6 }}
            className="max-w-md"
          >
            <p className="body-base">
              AETERNYX™ converges{" "}
              <span className="font-semibold text-gold-deep">ten evidence-graded bioactives</span>{" "}
              across{" "}
              <span className="font-semibold text-gold-deep">five cellular wellness pathways</span>{" "}
              — mitochondrial energy, oxidative balance, membrane integrity, immune capacity, and
              vascular calcium handling. Every molecule dosed with the published evidence in mind.
              Every tablet calibrated for{" "}
              <span className="font-semibold text-gold-deep">daily, sustainable use</span>.
            </p>
            <p className="mt-5 text-[12px] italic leading-relaxed text-muted">{data.footnote}</p>
          </motion.div>

          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } }
            }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {data.pills.map((pill) => (
              <motion.li
                key={pill.label}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                }}
                className="flex items-center gap-5 rounded-full bg-gold-soft/70 px-7 py-6"
              >
                <div className="flex items-baseline">
                  <span className="tnum text-5xl font-semibold leading-none tracking-tight text-gold-deep md:text-6xl">
                    {pill.value}
                  </span>
                  {pill.unit ? (
                    <span className="ml-1 text-lg font-medium text-gold-deep/80">{pill.unit}</span>
                  ) : null}
                </div>
                <span className="text-[13px] font-medium leading-tight text-ink">{pill.label}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Dosage / Directions / Precautions strip */}
        <div className="mt-14 border-t border-hairline pt-10">
          <ul className="grid gap-8 md:grid-cols-3 md:gap-10">
            {data.usage.map((item) => (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5 }}
                className="flex items-start gap-4"
              >
                <div className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/40 bg-canvas">
                  <UsageIcon name={item.icon} />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-gold-deep">
                    {item.title}
                  </div>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">{item.detail}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
