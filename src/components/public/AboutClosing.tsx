"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

function Action({ href, label, variant }: { href: string; label: string; variant: "primary" | "link" }) {
  const className = variant === "primary" ? "btn-primary" : "btn-link";
  const arrow = variant === "link" ? <span aria-hidden>→</span> : null;
  if (href.startsWith("#")) {
    return (
      <a href={href} className={className}>
        {label}
        {arrow}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {label}
      {arrow}
    </Link>
  );
}

export default function AboutClosing({ data }: { data: SiteContent["about"]["closingCta"] }) {
  return (
    <section className="relative bg-mist py-24 md:py-32">
      <div className="container-tight text-center">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="eyebrow"
        >
          {data.eyebrow}
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8 }}
          className="mt-4 text-3xl font-semibold tracking-tight text-ink md:text-5xl"
        >
          {data.title}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Action href={data.primaryCta.href} label={data.primaryCta.label} variant="primary" />
          <Action href={data.secondaryCta.href} label={data.secondaryCta.label} variant="link" />
        </motion.div>
      </div>
    </section>
  );
}
