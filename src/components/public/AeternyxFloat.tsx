"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  label?: string;
  href?: string;
};

/**
 * Floating shortcut to the AETERNYX product page, drawn as a wide amber
 * tablet with a centre score line. A handwritten "Click me" cue with a
 * hand-drawn curved arrow sits to the right and gently bobs to draw the
 * eye. Suppressed on the destination route.
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
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -8, 0],
              rotate: [-1.2, 1.2, -1.2],
              transition: {
                opacity: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                scale: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                y: { duration: 3.4, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 4.6, repeat: Infinity, ease: "easeInOut" }
              }
            }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            className="relative flex items-center"
          >
            {/* Tablet */}
            <Link
              href={href}
              aria-label={`Explore ${label}`}
              onMouseEnter={() => setShowCue(false)}
              onClick={() => setShowCue(false)}
              className="group relative flex h-[64px] w-[168px] items-center justify-center overflow-hidden rounded-[32px] shadow-[0_18px_36px_-14px_rgba(200,105,20,0.5)] transition-transform duration-200 hover:scale-[1.04] hover:shadow-[0_22px_44px_-14px_rgba(200,105,20,0.7)] md:h-[68px] md:w-[184px]"
              style={{
                background:
                  "radial-gradient(120% 100% at 30% 20%, #F4A65C 0%, #E88F3A 40%, #C86F1C 100%)"
              }}
            >
              {/* Soft glossy highlight — small oval on the top-left, like a pill's reflection */}
              <span
                aria-hidden
                className="pointer-events-none absolute left-[12%] top-[14%] h-3.5 w-[26%] rounded-full bg-white/40 blur-[5px]"
              />
              {/* Bottom shadow lip */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-6 bottom-1 h-2 rounded-full bg-black/15 blur-[6px]"
              />
              {/* Centre score line */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-3 left-1/2 w-px -translate-x-1/2 bg-black/25"
              />
              {/* Wordmark — sits slightly left of centre, like the reference */}
              <span className="relative z-10 pr-3 text-[13px] font-semibold tracking-[0.24em] text-white/95 drop-shadow-[0_1px_1px_rgba(120,50,0,0.4)] md:text-[14px]">
                {label}
              </span>
            </Link>

            {/* "Click me" — handwritten script with a hand-drawn arrow */}
            <AnimatePresence>
              {showCue ? (
                <motion.div
                  key="cue"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    y: [0, -3, 0],
                    transition: {
                      opacity: { duration: 0.3 },
                      x: { duration: 0.3 },
                      y: { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                    }
                  }}
                  exit={{ opacity: 0, x: -6, transition: { duration: 0.2 } }}
                  className="pointer-events-none relative ml-2 flex items-center md:ml-3"
                >
                  {/* Hand-drawn curved arrow from the script back to the tablet */}
                  <svg
                    viewBox="0 0 90 60"
                    className="h-[52px] w-[76px] md:h-[58px] md:w-[86px]"
                    fill="none"
                    aria-hidden
                  >
                    {/* Curve arcs up from the tablet edge and loops to the "Click me" text */}
                    <path
                      d="M8 46 C 14 22, 40 8, 82 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="text-ink"
                    />
                    {/* Arrowhead pointing down at the tablet */}
                    <path
                      d="M4 42 L 8 48 L 14 44"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      className="text-ink"
                    />
                  </svg>

                  <span className="ml-1 font-script text-[26px] font-semibold leading-none text-ink md:text-[30px]">
                    Click me
                  </span>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
