"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { NavLink, SiteContent } from "@/types/content";

type Props = {
  brand: SiteContent["brand"];
  nav: SiteContent["nav"];
};

function isHashOnly(href: string) {
  return href.startsWith("#");
}

function NavItem({
  link,
  active,
  onClick,
  size = "sm"
}: {
  link: NavLink;
  active: boolean;
  onClick?: () => void;
  size?: "sm" | "lg";
}) {
  const className = `${size === "lg" ? "text-base" : ""} nav-link ${active ? "text-ink" : ""}`;
  if (isHashOnly(link.href)) {
    return (
      <a href={link.href} onClick={onClick} className={className}>
        {link.label}
      </a>
    );
  }
  return (
    <Link href={link.href} onClick={onClick} className={className}>
      {link.label}
    </Link>
  );
}

export default function Nav({ brand, nav }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function isActive(href: string) {
    if (isHashOnly(href)) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

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
            <NavItem key={link.href} link={link} active={isActive(link.href)} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isHashOnly(nav.ctaHref) ? (
            <a
              href={nav.ctaHref}
              className="hidden md:inline-flex btn-primary py-2 px-5 text-[13px]"
            >
              {nav.ctaLabel}
            </a>
          ) : (
            <Link
              href={nav.ctaHref}
              className="hidden md:inline-flex btn-primary py-2 px-5 text-[13px]"
            >
              {nav.ctaLabel}
            </Link>
          )}
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
              <NavItem
                key={link.href}
                link={link}
                active={isActive(link.href)}
                onClick={() => setMobileOpen(false)}
                size="lg"
              />
            ))}
            {isHashOnly(nav.ctaHref) ? (
              <a
                href={nav.ctaHref}
                className="btn-primary mt-2"
                onClick={() => setMobileOpen(false)}
              >
                {nav.ctaLabel}
              </a>
            ) : (
              <Link
                href={nav.ctaHref}
                className="btn-primary mt-2"
                onClick={() => setMobileOpen(false)}
              >
                {nav.ctaLabel}
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </motion.header>
  );
}
