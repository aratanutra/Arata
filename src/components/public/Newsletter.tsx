"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

export default function Newsletter({ data }: { data: SiteContent["newsletter"] }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="newsletter" className="relative overflow-hidden bg-deep py-32 md:py-40">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,169,110,0.12)_0%,_transparent_55%)]"
      />
      <div className="container-luxe relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="eyebrow">{data.eyebrow}</span>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight md:text-5xl">
            {data.title}
          </h2>
          <p className="mt-5 font-body text-base text-text-secondary">{data.subtitle}</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.includes("@")) setSubmitted(true);
            }}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={data.placeholder}
              className="input-luxe flex-1 text-center sm:text-left"
            />
            <button type="submit" className="btn-gold">
              {data.buttonLabel}
            </button>
          </form>

          {submitted ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 font-accent text-[10px] uppercase tracking-widest text-gold"
            >
              ✓ Reservation received. We will be in touch.
            </motion.p>
          ) : (
            <p className="mt-6 font-body text-xs text-text-secondary/80">{data.disclaimer}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
