"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readConsent, writeConsent } from "./Analytics";

/**
 * DPDP-Act 2023 / GDPR-friendly consent banner. Shows the first time
 * a visitor arrives (and after they decline for the length of that
 * choice); disappears once the choice is recorded.
 *
 * Two buttons: Accept (all) and Decline. There's no "essential only"
 * option because we don't set any tracking cookies without consent —
 * "essential" and "decline" are the same state for this site.
 *
 * The site's Privacy Policy at /privacy explains what we collect.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const existing = readConsent();
    if (existing === null) setVisible(true);
  }, []);

  if (!visible) return null;

  function accept() {
    writeConsent("granted");
    setVisible(false);
  }
  function decline() {
    writeConsent("denied");
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-0 bottom-0 z-[95] mx-auto max-w-3xl px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="rounded-2xl border border-hairline bg-canvas p-5 shadow-card-hover md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl">
            <p id="cookie-consent-title" className="text-[11px] font-semibold uppercase tracking-widest text-gold-deep">
              Cookies
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink md:text-[14px]">
              We use analytics cookies to understand how visitors use aratanutra.com — see our{" "}
              <Link href="/privacy" className="underline decoration-hairline underline-offset-2 hover:text-gold-deep">
                Privacy Policy
              </Link>
              . Nothing loads until you choose.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row md:items-center">
            <button
              type="button"
              onClick={decline}
              className="rounded-full border border-hairline bg-canvas px-5 py-2.5 text-[13px] font-medium text-ink hover:border-ink"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={accept}
              className="rounded-full bg-ink px-5 py-2.5 text-[13px] font-semibold text-canvas hover:brightness-110"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
