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
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container-luxe flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-gold/40 font-display text-lg text-gold transition-all group-hover:border-gold group-hover:shadow-gold">
            {brand.logoMark}
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl tracking-wide">
              {brand.name}
              <sup className="ml-0.5 text-[8px] text-gold/80">{brand.trademark}</sup>
            </span>
            <span className="font-accent text-[8px] uppercase tracking-widest text-text-secondary">
              {brand.company}
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-accent text-[10px] uppercase tracking-widest text-text-secondary transition-colors duration-200 hover:text-gold"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href={nav.ctaHref} className="hidden md:inline-flex btn-gold">
            {nav.ctaLabel}
          </a>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold-soft text-gold"
          >
            <span className="block h-px w-5 bg-gold relative before:absolute before:-top-1.5 before:left-0 before:h-px before:w-5 before:bg-gold after:absolute after:top-1.5 after:left-0 after:h-px after:w-5 after:bg-gold" />
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="lg:hidden glass mt-3 border-t border-gold-soft">
          <div className="container-luxe flex flex-col gap-4 py-6">
            {nav.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-accent text-xs uppercase tracking-widest text-text-secondary hover:text-gold"
              >
                {link.label}
              </a>
            ))}
            <a href={nav.ctaHref} className="btn-gold mt-2" onClick={() => setMobileOpen(false)}>
              {nav.ctaLabel}
            </a>
          </div>
        </div>
      ) : null}
    </motion.header>
  );
}
