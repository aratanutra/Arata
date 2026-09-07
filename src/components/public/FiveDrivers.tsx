"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";
import { asset } from "@/lib/asset";

type Props = { data: SiteContent["science"] };

/**
 * "Five drivers" — the bundled cellular wellness pathways artifact.
 * Replaces the plain Science section as the interactive Mechanism
 * explainer on /aeternyx. Same iframe auto-fit pattern as the other
 * bundled artifacts so it hugs its own content height.
 */
export default function FiveDrivers({ data }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const el = iframeRef.current;
    if (!el) return;

    let resizeObserver: ResizeObserver | null = null;
    let raf = 0;

    function fitHeight(doc: Document) {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!el) return;
        const next = Math.max(
          doc.body?.scrollHeight ?? 0,
          doc.documentElement?.scrollHeight ?? 0
        );
        if (next > 0) el.style.height = `${next}px`;
      });
    }

    function attach() {
      try {
        const doc = el?.contentDocument;
        if (!doc || !doc.body) return;
        const override = doc.createElement("style");
        override.textContent =
          "html, body { min-height: 0 !important; height: auto !important; }";
        doc.head.appendChild(override);
        fitHeight(doc);
        resizeObserver = new ResizeObserver(() => fitHeight(doc));
        resizeObserver.observe(doc.body);
      } catch {
        /* noop */
      }
    }

    el.addEventListener("load", attach);
    if (el.contentDocument?.readyState === "complete") attach();

    return () => {
      el.removeEventListener("load", attach);
      resizeObserver?.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="science" className="relative overflow-hidden bg-canvas py-20 md:py-28">
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
          {/* Subtitle intentionally omitted — the artifact opens with the same line. */}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 overflow-hidden rounded-3xl border border-hairline bg-paper shadow-sm md:mt-12"
        >
          <iframe
            ref={iframeRef}
            src={asset("/aeternyx-five-drivers.html")}
            title="AETERNYX — Five cellular wellness pathways"
            loading="lazy"
            scrolling="no"
            className="block w-full"
            style={{ border: 0, height: 720 }}
          />
        </motion.div>
      </div>
    </section>
  );
}
