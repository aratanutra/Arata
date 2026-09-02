"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";
import TabletExploded from "./TabletExploded";

type Props = { data: SiteContent["ingredientsSection"] };

export default function InteractiveTablet({ data }: Props) {
  return (
    <section id="composition" className="relative overflow-hidden bg-paper py-24 md:py-32">
      <div className="container-app">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <span className="eyebrow">Composition</span>
          <h2 className="mt-4 heading-md">Open the tablet. See every ingredient.</h2>
          <p className="mt-4 body-base">
            The AETERNYX™ tablet splits into ten discs. Each disc is a single active. Tap one to read
            the dose and see where in the body it goes to work.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12"
        >
          <TabletExploded data={data} />
        </motion.div>
      </div>
    </section>
  );
}
