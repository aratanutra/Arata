"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  /** Wordmark shown on the tablet face. */
  label?: string;
  /** Route to jump to. */
  href?: string;
};

/**
 * A shortcut to the AETERNYX product page, drawn as an orange tablet with
 * a centre score line. A "Click me" bubble fades in shortly after the
 * tablet appears (and hides once the viewer hovers/taps).
 *
 * Suppressed on the destination route so it never self-links.
 */
export default function AeternyxFloat({
  label = "AETERNYX",
  href = "/aeternyx"
}: Props = {}) {
  const [visible, setVisible] = useState(false);
  const [showCue, setShowCue] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200);
    const c = setTimeout(() => setShowCue(true), 2000);
    return () => {
      clearTimeout(t);
      clearTimeout(c);
    };
  }, []);

  const suppressed = pathname === href || pathname.startsWith(`${href}/`);
  if (suppressed) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[90] md:bottom-8 md:left-8">
      <AnimatePresence>
        {visible ? (
          <motion.div
            key="aeternyx-tablet"
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* "Click me" callout — dark bubble above the tablet */}
            <AnimatePresence>
              {showCue ? (
                <motion.div
                  key="cue"
                  initial={{ opacity: 0, y: 6, scale: 0.92 }}
                  animate={{
                    opacity: 1,
                    y: [0, -3, 0],
                    scale: 1,
                    transition: {
                      opacity: { duration: 0.3 },
                      scale: { duration: 0.3 },
                      y: { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                    }
                  }}
                  exit={{ opacity: 0, y: 6, transition: { duration: 0.2 } }}
                  className="pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-canvas shadow-md md:text-[11px]"
                >
                  Click me
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-[6px] border-t-[6px] border-x-transparent border-t-ink"
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>

            <Link
              href={href}
              aria-label={`Explore ${label}`}
              onMouseEnter={() => setShowCue(false)}
              onClick={() => setShowCue(false)}
              className="group relative flex h-[68px] w-[140px] items-center justify-center overflow-hidden rounded-[34px] shadow-[0_14px_32px_-10px_rgba(220,110,20,0.55)] transition-transform duration-200 hover:scale-[1.05] hover:shadow-[0_18px_40px_-10px_rgba(220,110,20,0.75)] md:h-[72px] md:w-[150px]"
              style={{
                background:
                  "linear-gradient(160deg, #F7AE49 0%, #EE8B27 45%, #C96712 100%)"
              }}
            >
              {/* Top gloss highlight — soft white bar for the tablet's polished ridge */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-3 top-1.5 h-4 rounded-full bg-white/30 blur-[6px]"
              />
              {/* Bottom shadow lip */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-4 bottom-1 h-2 rounded-full bg-black/15 blur-[5px]"
              />
              {/* Central score line — signature tablet detail */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-3.5 left-1/2 w-px -translate-x-1/2 bg-black/25"
              />
              {/* Wordmark */}
              <span className="relative z-10 flex flex-col items-center leading-tight text-white drop-shadow-[0_1px_1px_rgba(120,50,0,0.35)]">
                <span className="text-[9px] font-semibold uppercase tracking-[0.28em] opacity-90">
                  Explore
                </span>
                <span className="mt-0.5 text-[13px] font-extrabold tracking-tight md:text-[14px]">
                  {label}
                  <sup className="ml-0.5 text-[0.55em] font-medium">™</sup>
                </span>
              </span>
              {/* Warm inner glow on hover */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[34px] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                style={{ boxShadow: "inset 0 0 22px rgba(255, 235, 200, 0.55)" }}
              />
            </Link>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
