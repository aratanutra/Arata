"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

type Props = { data: SiteContent["compositionTable"] };

export default function CompositionTable({ data }: Props) {
  return (
    <section id="composition-table" className="relative bg-canvas py-20 md:py-28">
      <div className="container-app">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <span className="eyebrow">{data.eyebrow}</span>
          <h2 className="mt-4 heading-md">{data.title}</h2>
          <p className="mt-4 body-base">{data.subtitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7 }}
          className="mt-10 grid gap-6 md:mt-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-8"
        >
          {/* Composition — card list on mobile, table on sm+ */}
          <div className="overflow-hidden rounded-2xl border border-hairline bg-paper">
            <div className="border-b border-hairline px-5 py-4 md:px-6">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-gold-deep">
                Nutraceutical
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-widest text-muted">
                Target consumer group: {data.targetConsumer}
              </div>
            </div>

            {/* Mobile: card list */}
            <ul className="divide-y divide-hairline sm:hidden">
              {data.composition.map((row) => (
                <li key={row.name} className="px-5 py-3">
                  <div className="text-[13px] font-medium leading-snug text-ink">
                    {row.name}
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[11px] uppercase tracking-widest text-muted">
                    <span>
                      Qty{" "}
                      <span className="tnum ml-0.5 text-[13px] normal-case tracking-tight text-ink">
                        {row.qty}
                      </span>
                    </span>
                    <span>
                      %RDA Men{" "}
                      <span className="tnum ml-0.5 text-[13px] normal-case tracking-tight text-ink-soft">
                        {row.rdaMen}
                      </span>
                    </span>
                    <span>
                      %RDA Women{" "}
                      <span className="tnum ml-0.5 text-[13px] normal-case tracking-tight text-ink-soft">
                        {row.rdaWomen}
                      </span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            {/* Tablet / desktop: table */}
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full text-left text-[13px] text-ink">
                <thead className="bg-canvas/60">
                  <tr>
                    {data.compositionHeaders.map((h, i) => (
                      <th
                        key={h}
                        className={`px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-ink md:px-6 ${
                          i > 0 ? "tnum text-right" : ""
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.composition.map((row, i) => (
                    <tr key={row.name} className={i % 2 === 1 ? "bg-canvas/40" : ""}>
                      <td className="px-5 py-2.5 leading-snug text-ink-soft md:px-6">
                        {row.name}
                      </td>
                      <td className="tnum px-5 py-2.5 text-right text-ink md:px-6">
                        {row.qty}
                      </td>
                      <td className="tnum px-5 py-2.5 text-right text-ink-soft md:px-6">
                        {row.rdaMen}
                      </td>
                      <td className="tnum px-5 py-2.5 text-right text-ink-soft md:px-6">
                        {row.rdaWomen}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Nutrition side card */}
          <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-2xl border border-hairline bg-paper">
              <div className="border-b border-hairline px-5 py-4 md:px-6">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-gold-deep">
                  {data.nutritionTitle}
                </div>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] uppercase tracking-widest text-muted">
                  <span>
                    Serving size:{" "}
                    <span className="text-ink-soft">{data.servingSize}</span>
                  </span>
                  <span>
                    Servings / pack:{" "}
                    <span className="text-ink-soft">{data.servingsPerPack}</span>
                  </span>
                </div>
              </div>

              {/* Mobile: compact rows */}
              <ul className="divide-y divide-hairline sm:hidden">
                {data.nutrition.map((row) => (
                  <li
                    key={row.name}
                    className="flex items-baseline justify-between gap-4 px-5 py-2.5"
                  >
                    <span className="text-[13px] text-ink-soft">{row.name}</span>
                    <span className="flex items-baseline gap-3">
                      <span className="tnum text-[13px] text-ink">{row.qty}</span>
                      <span className="tnum text-[11px] uppercase tracking-widest text-muted">
                        {row.rda}%
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              {/* Tablet / desktop: table */}
              <div className="hidden overflow-x-auto sm:block">
                <table className="w-full text-left text-[13px] text-ink">
                  <thead className="bg-canvas/60">
                    <tr>
                      {data.nutritionHeaders.map((h, i) => (
                        <th
                          key={h}
                          className={`px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-ink md:px-6 ${
                            i > 0 ? "tnum text-right" : ""
                          }`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.nutrition.map((row, i) => (
                      <tr key={row.name} className={i % 2 === 1 ? "bg-canvas/40" : ""}>
                        <td className="px-5 py-2 leading-snug text-ink-soft md:px-6">
                          {row.name}
                        </td>
                        <td className="tnum px-5 py-2 text-right text-ink md:px-6">
                          {row.qty}
                        </td>
                        <td className="tnum px-5 py-2 text-right text-ink-soft md:px-6">
                          {row.rda}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <ul className="space-y-1.5 rounded-2xl border border-hairline bg-paper px-5 py-4 text-[11px] leading-relaxed text-muted md:px-6">
              {data.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
