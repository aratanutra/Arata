"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  number: string;
  greeting: string;
};

export default function WhatsAppFloat({ number, greeting }: Props) {
  const [visible, setVisible] = useState(false);
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 900);
    const l = setTimeout(() => setShowLabel(true), 1800);
    const hideL = setTimeout(() => setShowLabel(false), 6500);
    return () => {
      clearTimeout(t);
      clearTimeout(l);
      clearTimeout(hideL);
    };
  }, []);

  const digits = number.replace(/\D/g, "");
  const href = `https://wa.me/${digits}?text=${encodeURIComponent(greeting)}`;

  return (
    <div className="fixed bottom-5 right-5 z-[90] md:bottom-8 md:right-8">
      <AnimatePresence>
        {visible ? (
          <motion.a
            key="whatsapp"
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            className="group flex items-center gap-3 rounded-full bg-[#25D366] p-4 text-white shadow-[0_10px_28px_-8px_rgba(37,211,102,0.55)] transition-transform duration-200 hover:scale-105 hover:shadow-[0_14px_36px_-8px_rgba(37,211,102,0.7)]"
            onMouseEnter={() => setShowLabel(true)}
            onMouseLeave={() => setShowLabel(false)}
          >
            <span aria-hidden className="pointer-events-none absolute -top-1 -right-1 h-3 w-3 rounded-full bg-white/95">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-70" />
            </span>
            <svg viewBox="0 0 32 32" className="h-6 w-6 shrink-0" fill="currentColor" aria-hidden>
              <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.36.685 4.556 1.867 6.417L4 29l7.783-1.828A11.947 11.947 0 0016.001 27C22.629 27 28 21.627 28 15S22.629 3 16.001 3zm0 21.6c-1.859 0-3.657-.5-5.223-1.446l-.375-.223-4.62 1.085 1.104-4.5-.244-.386A9.586 9.586 0 016.4 15c0-5.293 4.307-9.6 9.601-9.6 5.294 0 9.599 4.307 9.599 9.6s-4.305 9.6-9.599 9.6zm5.507-7.184c-.302-.152-1.786-.881-2.062-.983-.276-.101-.478-.152-.68.152s-.779.983-.955 1.184c-.176.202-.352.227-.653.076-.302-.152-1.273-.469-2.425-1.494-.897-.8-1.501-1.788-1.678-2.09-.176-.302-.019-.465.133-.616.137-.136.302-.354.454-.531.152-.176.202-.302.302-.505.101-.202.05-.379-.025-.531-.076-.152-.68-1.638-.931-2.243-.246-.591-.496-.51-.68-.52l-.579-.011c-.202 0-.53.076-.807.379s-1.06 1.035-1.06 2.522 1.084 2.926 1.234 3.128c.152.202 2.14 3.268 5.183 4.583.724.312 1.288.499 1.728.638.726.231 1.386.198 1.908.12.582-.088 1.786-.729 2.038-1.434.252-.706.252-1.31.176-1.434-.076-.126-.276-.202-.579-.354z" />
            </svg>
            <span
              className={`whitespace-nowrap text-[13px] font-semibold tracking-tight transition-all duration-300 ${
                showLabel ? "max-w-[220px] pr-1 opacity-100" : "max-w-0 pr-0 opacity-0"
              } overflow-hidden`}
            >
              Chat on WhatsApp
            </span>
          </motion.a>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
