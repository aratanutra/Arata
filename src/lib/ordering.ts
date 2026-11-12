/**
 * ORDERING_ENABLED — the single gate for every purchase path on aratanutra.com.
 *
 * Arata's FSSAI licence does not yet include the E-commerce Kind of Business
 * (per the Nov-2026 Regulatory Baseline review, §11.A). Until the FoSCoS
 * modification is live, the website must not take orders.
 *
 * When this is false:
 *   - every "Order now" / pack-selection checkout renders as a disabled
 *     "Coming soon" block
 *   - all wa.me ORDER / RESERVE links are hidden
 *   - the top-of-page launch banner is suppressed
 *   - the generic WhatsApp enquiry floater (brand.whatsappGreeting) stays
 *     live — that is a contact channel, not an order channel
 *
 * Turning ordering back on needs only one line: set the constant below to
 * `true` (or unset NEXT_PUBLIC_ORDERING_DISABLED on Netlify). No other
 * code path reads this value directly — everywhere else imports and
 * checks this constant.
 */
export const ORDERING_ENABLED: boolean =
  process.env.NEXT_PUBLIC_ORDERING_DISABLED === "true" ? false : false;

/** Shown in place of a pack purchase panel when ordering is paused. */
export const ORDERING_PAUSED_COPY = {
  heading: "Coming soon",
  message:
    "Online ordering opens shortly. For enquiries, contact customer care.",
  buttonLabel: "Coming soon"
} as const;
