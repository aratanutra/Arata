"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  /** Displayed inside the pill. Defaults to "Explore AETERNYX". A trademark ™ is appended. */
  label?: string;
  /** Route to jump to. */
  href?: string;
};

/**
 * A brand-accent floater that shortcuts to the AETERNYX product page.
 * Hidden while the viewer is already on that page so it doesn't self-link.
 * Positioned bottom-left so it doesn't fight the WhatsApp floater on the right.
 */
export default function AeternyxFloat({
  label = "Explore AETERNYX",
  href = "/aeternyx"
}: Props) {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  // Suppress on the destination page itself
  const suppressed = pathname === href || pathname.startsWith(`${href}/`);
  if (suppressed) return null;

  return (
    <div className="fixed bottom-5 left-5 z-[90] md:bottom-8 md:left-8">
      <AnimatePresence>
        {visible ? (
          <motion.div
            key="aeternyx"
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href={href}
              aria-label={`${label}™`}
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[13px] font-semibold tracking-tight text-canvas shadow-[0_10px_28px_-8px_rgba(15,22,40,0.55)] transition-transform duration-200 hover:scale-[1.03] hover:shadow-[0_14px_36px_-8px_rgba(15,22,40,0.7)] md:px-5 md:py-3 md:text-[14px]"
            >
              <span className="wordmark-gold uppercase tracking-[0.14em]">{label}</span>
              <sup className="ml-0.5 text-[0.55em] font-medium text-canvas/70">™</sup>
              <span
                aria-hidden
                className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gold-deep/25 text-canvas transition-transform duration-200 group-hover:translate-x-0.5"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
                  <path
                    d="M5 12h13m0 0-5-5m5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
