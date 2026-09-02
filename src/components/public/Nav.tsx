"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { NavLink, SiteContent } from "@/types/content";
import { asset } from "@/lib/asset";

type Props = {
  brand: SiteContent["brand"];
  nav: SiteContent["nav"];
};

function isHashOnly(href: string) {
  return href.startsWith("#");
}

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden>
      <path d="M16 3C9.4 3 4 8.4 4 15c0 2.4.7 4.6 1.9 6.4L4 29l7.8-1.8A11.9 11.9 0 0016 27c6.6 0 12-5.4 12-12S22.6 3 16 3zm5.5 15.2c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-.9 1.2-.4.2-.7.1c-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1s-.2-.5.1-.6c.1-.1.3-.4.5-.5s.2-.3.3-.5.1-.4 0-.5-.7-1.6-.9-2.2-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1.1 1-1.1 2.5 1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4s.3-1.3.2-1.4-.3-.2-.6-.4z" />
    </svg>
  );
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

  const waHref = `https://wa.me/${brand.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
    brand.whatsappGreeting
  )}`;
  const ctaIsWhatsApp = nav.ctaHref === "whatsapp";

  const showCta = Boolean(nav.ctaLabel && nav.ctaHref);

  function renderCta(onClick?: () => void, extraClass = "") {
    if (!showCta) return null;
    if (ctaIsWhatsApp) {
      return (
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
          className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-2 text-[13px] font-semibold text-white transition-all duration-200 hover:brightness-95 ${extraClass}`}
        >
          <WhatsAppGlyph className="h-4 w-4" />
          {nav.ctaLabel}
        </a>
      );
    }
    if (isHashOnly(nav.ctaHref)) {
      return (
        <a href={nav.ctaHref} onClick={onClick} className={`btn-primary py-2 px-5 text-[13px] ${extraClass}`}>
          {nav.ctaLabel}
        </a>
      );
    }
    return (
      <Link href={nav.ctaHref} onClick={onClick} className={`btn-primary py-2 px-5 text-[13px] ${extraClass}`}>
        {nav.ctaLabel}
      </Link>
    );
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
        <Link href="/" className="flex items-center gap-2.5 group" aria-label={`${brand.company} home`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(brand.logoMarkAsset)}
            alt=""
            className="h-9 w-9 object-contain"
            width={36}
            height={36}
          />
          <span className="text-[15px] font-semibold tracking-tight text-ink">{brand.company}</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {nav.links.map((link) => (
            <NavItem key={link.href} link={link} active={isActive(link.href)} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {showCta ? <span className="hidden md:inline-flex">{renderCta()}</span> : null}
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
            {renderCta(() => setMobileOpen(false), "mt-2 justify-center py-3")}
          </div>
        </div>
      ) : null}
    </motion.header>
  );
}
