"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

type Props = { data: SiteContent["metricsPanel"] };

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

      </div>
    </section>
  );
}
