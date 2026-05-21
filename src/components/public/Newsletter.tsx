"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

export default function Newsletter({ data }: { data: SiteContent["newsletter"] }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="newsletter" className="relative bg-canvas py-28 md:py-40">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8 }}
          className="card-soft px-8 py-14 text-center md:px-16 md:py-20"
        >
          <span className="eyebrow">{data.eyebrow}</span>
          <h2 className="mt-4 heading-md">{data.title}</h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted md:text-lg">{data.subtitle}</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.includes("@")) setSubmitted(true);
            }}
            className="mx-auto mt-10 flex max-w-lg flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={data.placeholder}
              className="input-clean flex-1 text-center sm:text-left"
            />
            <button type="submit" className="btn-primary">
              {data.buttonLabel}
            </button>
          </form>

          {submitted ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 text-[12px] font-medium uppercase tracking-widest text-sage"
            >
              ✓ Reservation received. We will be in touch.
            </motion.p>
          ) : (
            <p className="mt-6 text-[13px] text-muted">{data.disclaimer}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
