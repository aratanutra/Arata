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
 * Floating shortcut to the AETERNYX product page.
 *
 * Position: upper-right of the viewport, below the fixed nav — so it sits
 * inside the hero band and drifts continuously to draw the eye.
 * A handwritten "Click me" cue with a hand-drawn curved arrow sits to the
 * LEFT of the tablet (arrow points right at it).
 * Suppressed on the destination route.
 */
export default function AeternyxFloat({
  label = "AETERNYX",
  href = "/aeternyx#buy"
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

  // Strip the hash fragment so we suppress the floater on /aeternyx itself
  // regardless of which anchor it points to.
  const hrefPath = href.split("#")[0];
  const suppressed =
    pathname === hrefPath || pathname.startsWith(`${hrefPath}/`);
  if (suppressed) return null;

  return (
    <div className="fixed right-3 top-16 z-[90] md:right-8 md:top-20">
      <AnimatePresence>
        {visible ? (
          <motion.div
            key="aeternyx-tablet"
            initial={{ opacity: 0, scale: 0.6, y: -20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -10, 0, 8, 0],
              rotate: [-1.4, 1.4, -1.4],
              transition: {
                opacity: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                scale: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                y: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 5.4, repeat: Infinity, ease: "easeInOut" }
              }
            }}
            exit={{ opacity: 0, scale: 0.6, y: -20 }}
            className="relative flex items-center justify-end"
          >
            {/* "Click me" cue — sits ABOVE the tablet with a curved arrow
                looping down into the pill. Absolutely positioned so it
                doesn't push the tablet layout around. */}
            <AnimatePresence>
              {showCue ? (
                <motion.div
                  key="cue"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{
                    opacity: 1,
                    y: [0, -3, 0],
                    transition: {
                      opacity: { duration: 0.3 },
                      y: { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                    }
                  }}
                  exit={{ opacity: 0, y: -6, transition: { duration: 0.2 } }}
                  className="pointer-events-none absolute -top-14 left-0 flex flex-col items-start md:-top-16 md:left-2"
                >
                  <span className="font-script text-[24px] font-semibold leading-none text-ink md:text-[32px]">
                    Buy me
                  </span>
                  {/* Hand-drawn curved arrow looping down and into the tablet */}
                  <svg
                    viewBox="0 0 70 46"
                    className="-mt-1 h-[38px] w-[58px] md:h-[46px] md:w-[70px]"
                    fill="none"
                    aria-hidden
                  >
                    {/* Curve starts near the script's tail, arcs up-right,
                        then down into the tablet top. */}
                    <path
                      d="M8 8 C 30 -4, 62 6, 58 38"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="text-ink"
                    />
                    {/* Arrowhead pointing DOWN into the tablet */}
                    <path
                      d="M51 32 L 58 41 L 65 32"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-ink"
                    />
                  </svg>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Tablet */}
            <Link
              href={href}
              aria-label={`Explore ${label}`}
              onMouseEnter={() => setShowCue(false)}
              onClick={() => setShowCue(false)}
              className="group relative flex h-[54px] w-[140px] items-center justify-center overflow-hidden rounded-[28px] shadow-[0_14px_28px_-12px_rgba(200,105,20,0.55)] transition-transform duration-200 hover:scale-[1.04] hover:shadow-[0_22px_44px_-14px_rgba(200,105,20,0.75)] md:h-[68px] md:w-[184px] md:rounded-[32px]"
              style={{
                background:
                  "radial-gradient(120% 100% at 30% 20%, #F4A65C 0%, #E88F3A 40%, #C86F1C 100%)"
              }}
            >
              {/* Top-left highlight */}
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
              {/* Wordmark */}
              <span className="relative z-10 text-[11px] font-semibold tracking-[0.22em] text-white/95 drop-shadow-[0_1px_1px_rgba(120,50,0,0.4)] md:text-[14px] md:tracking-[0.24em]">
                {label}
              </span>
            </Link>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
