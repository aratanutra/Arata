"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

function Action({
  href,
  label,
  variant,
  waHref
}: {
  href: string;
  label: string;
  variant: "primary" | "link";
  waHref: string;
}) {
  const className = variant === "primary" ? "btn-primary" : "btn-link";
  const arrow = variant === "link" ? <span aria-hidden>→</span> : null;
  if (href === "whatsapp") {
    return (
      <a href={waHref} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
        {arrow}
      </a>
    );
  }
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

type Props = {
  data: SiteContent["about"]["closingCta"];
  brand: SiteContent["brand"];
};

export default function AboutClosing({ data, brand }: Props) {
  const waHref = `https://wa.me/${brand.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
    brand.whatsappGreeting
  )}`;
  return (
    <section className="relative bg-paper py-24 md:py-32">
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
          <Action href={data.primaryCta.href} label={data.primaryCta.label} variant="primary" waHref={waHref} />
          <Action href={data.secondaryCta.href} label={data.secondaryCta.label} variant="link" waHref={waHref} />
        </motion.div>
      </div>
    </section>
  );
}
