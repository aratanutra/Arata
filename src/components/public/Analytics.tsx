"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

/**
 * Loads Google Analytics 4 + Meta (Facebook) Pixel scripts, gated on
 * the user's cookie consent (stored under CONSENT_KEY in localStorage).
 * Nothing loads at all until consent is granted, so the page ships with
 * zero third-party surface when a visitor lands.
 *
 * Env vars (both must start with NEXT_PUBLIC_ so they inline into the
 * client bundle):
 *   NEXT_PUBLIC_GA4_MEASUREMENT_ID  — G-XXXXXXXXXX
 *   NEXT_PUBLIC_META_PIXEL_ID       — numeric pixel id
 * Either or both can be omitted; only the configured tag loads.
 */

export const CONSENT_KEY = "arata:analytics-consent";
export type ConsentState = "granted" | "denied" | null;

export function readConsent(): ConsentState {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (raw === "granted" || raw === "denied") return raw;
    return null;
  } catch {
    return null;
  }
}

export function writeConsent(next: Exclude<ConsentState, null>): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, next);
    window.dispatchEvent(new CustomEvent("arata:consent-change", { detail: next }));
  } catch {
    // ignore
  }
}

export default function Analytics() {
  const [consent, setConsent] = useState<ConsentState>(null);

  useEffect(() => {
    setConsent(readConsent());
    function onChange(e: Event) {
      const detail = (e as CustomEvent<Exclude<ConsentState, null>>).detail;
      if (detail === "granted" || detail === "denied") setConsent(detail);
    }
    window.addEventListener("arata:consent-change", onChange);
    return () => window.removeEventListener("arata:consent-change", onChange);
  }, []);

  if (consent !== "granted") return null;

  const gaId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <>
      {gaId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('consent', 'default', {ad_storage: 'granted', analytics_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted'});
gtag('config', '${gaId}', {anonymize_ip: true});`}
          </Script>
        </>
      ) : null}

      {pixelId ? (
        <>
          <Script id="meta-pixel-init" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${pixelId}');
fbq('track','PageView');`}
          </Script>
          {/* noscript fallback for the pixel */}
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              alt=""
              src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      ) : null}
    </>
  );
}
