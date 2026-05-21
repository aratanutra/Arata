"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

type Props = { contactForm: SiteContent["contactForm"] };

export default function ContactDialog({ contactForm }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function sync() {
      setOpen(window.location.hash === "#contact");
    }
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    setOpen(false);
    if (window.location.hash === "#contact") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }

  const embedUrl = (() => {
    const url = contactForm.formUrl?.trim();
    if (!url) return "";
    if (url.includes("embedded=true")) return url;
    return url + (url.includes("?") ? "&" : "?") + "embedded=true";
  })();

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-ink/40 p-4 backdrop-blur-sm"
          onClick={close}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-canvas shadow-card-hover"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-hairline px-6 py-5 md:px-8">
              <div>
                <h3 className="text-xl font-semibold tracking-tight text-ink md:text-2xl">
                  {contactForm.title}
                </h3>
                <p className="mt-1 text-[14px] leading-relaxed text-muted">
                  {contactForm.description}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-hairline text-muted transition-colors hover:border-ink hover:text-ink"
              >
                ×
              </button>
            </div>

            {embedUrl ? (
              <div className="h-[640px] max-h-[70vh] bg-mist">
                <iframe
                  src={embedUrl}
                  title={contactForm.title}
                  className="h-full w-full border-0"
                  loading="lazy"
                >
                  Loading…
                </iframe>
              </div>
            ) : (
              <div className="px-8 py-14 text-center">
                <p className="text-base text-ink">
                  Our enquiry form is being prepared. Until then, please write to us at
                </p>
                <a
                  href={`mailto:${contactForm.fallbackEmail}`}
                  className="mt-4 inline-block text-lg font-semibold tracking-tight text-sage-deep underline-offset-4 hover:underline"
                >
                  {contactForm.fallbackEmail}
                </a>
                <p className="mt-6 text-[13px] text-muted">
                  We respond within two business days.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
