"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";
import { asset } from "@/lib/asset";

type Props = { data: SiteContent["ingredientsSection"] };

type PlayerHooks = {
  __aeternyxPlayerPlay?: (n: number) => void;
  __aeternyxPlayerState?: () => number | null | undefined;
  __aeternyxPlayerCount?: () => number;
  __aeternyxLastPause?: number;
};

/** How long to hold after a user interaction before autoplay resumes. */
const IDLE_MS = 5000;

/** How long to hold the resting pack before autoplay first begins. */
const START_DELAY_MS = 3000;

/** Cycle interval between ingredients once autoplay is running. */
const CYCLE_MS = 3000;

function advanceOne(w: Window | null) {
  try {
    const hooks = w as unknown as PlayerHooks;
    const play = hooks?.__aeternyxPlayerPlay;
    if (typeof play !== "function") return false;
    const cur = hooks?.__aeternyxPlayerState?.();
    const total = hooks?.__aeternyxPlayerCount?.() || 10;
    const next = (cur === null || cur === undefined ? 0 : (cur + 1) % total) + 1;
    play(next);
    return true;
  } catch {
    return false;
  }
}

/** ms since the last time the user interacted with the artifact, or Infinity if never. */
function timeSinceLastPause(w: Window | null): number {
  try {
    const t = (w as unknown as PlayerHooks)?.__aeternyxLastPause;
    if (typeof t !== "number") return Infinity;
    return Date.now() - t;
  } catch {
    return Infinity;
  }
}

/**
 * Standalone bundled ingredient-explorer artifact (React app packaged into
 * one self-contained HTML file, ~1.3 MB with all assets embedded).
 *
 * Mounted via a same-origin <iframe> whose height auto-fits its content —
 * that removes the inner scroll bar that was fighting the outer page scroll
 * on mobile. The artifact ships with `body { min-height: 100vh }`; we
 * override that on load so scrollHeight reflects real content.
 */
export default function IngredientExplorer({ data }: Props) {
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

    let viewObserver: IntersectionObserver | null = null;
    let inView = true;
    let driverRaf = 0;
    let lastAdvanceAt = 0;

    function attach() {
      try {
        const doc = el?.contentDocument;
        if (!doc || !doc.body) return;

        // Neutralise the artifact's viewport-height baseline so the body wraps
        // content tightly. We intentionally do NOT force overflow:hidden — the
        // artifact draws absolutely-positioned graphics (anatomy diagrams) that
        // need to render outside the flow, and clipping was hiding them on
        // narrow viewports.
        const override = doc.createElement("style");
        override.textContent =
          "html, body { min-height: 0 !important; height: auto !important; }";
        doc.head.appendChild(override);

        fitHeight(doc);

        resizeObserver = new ResizeObserver(() => fitHeight(doc));
        resizeObserver.observe(doc.body);
      } catch {
        /* cross-origin (shouldn't happen for same-origin asset) — keep fallback height */
      }
    }

    // Parent-side autoplay driver: iOS Safari throttles setTimeout/setInterval
    // inside iframes (even RAF), but the PARENT document's RAF runs at native
    // frame rate whenever the tab is visible. Every CYCLE_MS we call into the
    // iframe's exposed play() to force the next ingredient — but only if the
    // user hasn't interacted in the last IDLE_MS (so tap-to-hold works).
    function drive() {
      const now = performance.now();
      const idle = timeSinceLastPause(el?.contentWindow ?? null);
      if (inView && now - lastAdvanceAt > CYCLE_MS && idle > IDLE_MS) {
        if (advanceOne(el?.contentWindow ?? null)) {
          lastAdvanceAt = now;
        }
      }
      driverRaf = requestAnimationFrame(drive);
    }

    if ("IntersectionObserver" in window) {
      viewObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry) inView = entry.isIntersecting;
        },
        { rootMargin: "200px" }
      );
      viewObserver.observe(el);
    }

    // Attach after the iframe finishes loading; also try immediately in case it's already loaded.
    el.addEventListener("load", attach);
    if (el.contentDocument?.readyState === "complete") attach();

    // Start the parent-side driver after the same START_DELAY_MS the artifact
    // uses for its own initial autoplay, so both wake up at the same moment
    // and the pack visibly holds still for 3 s before cycling begins.
    const driverStart = window.setTimeout(() => {
      lastAdvanceAt = performance.now();
      driverRaf = requestAnimationFrame(drive);
    }, START_DELAY_MS);

    return () => {
      el.removeEventListener("load", attach);
      resizeObserver?.disconnect();
      viewObserver?.disconnect();
      cancelAnimationFrame(raf);
      cancelAnimationFrame(driverRaf);
      clearTimeout(driverStart);
    };
  }, []);

  return (
    <section
      id="composition"
      className="relative hidden overflow-hidden bg-paper py-24 md:block md:py-32"
    >
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
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-12 overflow-hidden rounded-3xl border border-hairline bg-canvas shadow-sm"
        >
          <iframe
            ref={iframeRef}
            src={asset("/ingredient-explorer.html")}
            title="AETERNYX Ingredient Explorer"
            loading="eager"
            scrolling="no"
            className="block w-full"
            style={{ border: 0, height: 720 }}
            allow="clipboard-write"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {...({ fetchpriority: "high" } as any)}
          />
        </motion.div>
      </div>
    </section>
  );
}
