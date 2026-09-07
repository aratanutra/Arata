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
    <div className="fixed right-4 top-24 z-[90] md:right-8 md:top-32">
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
            {/* "Click me" cue — sits to the LEFT of the tablet */}
            <AnimatePresence>
              {showCue ? (
                <motion.div
                  key="cue"
                  initial={{ opacity: 0, x: 6 }}
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
                  exit={{ opacity: 0, x: 6, transition: { duration: 0.2 } }}
                  className="pointer-events-none mr-1 flex items-center md:mr-2"
                >
                  <span className="mr-1 font-script text-[24px] font-semibold leading-none text-ink md:text-[28px]">
                    Click me
                  </span>
                  {/* Hand-drawn curved arrow pointing RIGHT into the tablet */}
                  <svg
                    viewBox="0 0 90 60"
                    className="h-[48px] w-[70px] md:h-[54px] md:w-[80px]"
                    fill="none"
                    aria-hidden
                  >
                    {/* Curve arcs from the script down and to the right, ending at the pill's left edge */}
                    <path
                      d="M8 12 C 40 8, 66 22, 82 46"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="text-ink"
                    />
                    {/* Arrowhead pointing down-right at the tablet */}
                    <path
                      d="M86 42 L 82 48 L 76 44"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
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
              className="group relative flex h-[64px] w-[168px] items-center justify-center overflow-hidden rounded-[32px] shadow-[0_18px_36px_-14px_rgba(200,105,20,0.55)] transition-transform duration-200 hover:scale-[1.04] hover:shadow-[0_22px_44px_-14px_rgba(200,105,20,0.75)] md:h-[68px] md:w-[184px]"
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
              <span className="relative z-10 text-[13px] font-semibold tracking-[0.24em] text-white/95 drop-shadow-[0_1px_1px_rgba(120,50,0,0.4)] md:text-[14px]">
                {label}
              </span>
            </Link>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
