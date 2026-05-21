"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

type Props = {
  brand: SiteContent["brand"];
  nav: SiteContent["nav"];
};

export default function Nav({ brand, nav }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-hairline bg-canvas/85 backdrop-blur-xl py-3"
          : "border-b border-transparent bg-canvas/0 py-4"
      }`}
    >
      <div className="container-app flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-canvas text-sm font-semibold">
            {brand.logoMark}
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-ink">
            {brand.company}
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {nav.links.map((link) => (
            <a key={link.href} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href={nav.ctaHref} className="hidden md:inline-flex btn-primary py-2 px-5 text-[13px]">
            {nav.ctaLabel}
          </a>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-ink"
          >
            <span className="block h-px w-4 bg-ink relative before:absolute before:-top-1.5 before:left-0 before:h-px before:w-4 before:bg-ink after:absolute after:top-1.5 after:left-0 after:h-px after:w-4 after:bg-ink" />
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="lg:hidden border-t border-hairline bg-canvas">
          <div className="container-app flex flex-col gap-4 py-6">
            {nav.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="nav-link text-base"
              >
                {link.label}
              </a>
            ))}
            <a href={nav.ctaHref} className="btn-primary mt-2" onClick={() => setMobileOpen(false)}>
              {nav.ctaLabel}
            </a>
          </div>
        </div>
      ) : null}
    </motion.header>
  );
}
