import Link from "next/link";
import type { SiteContent } from "@/types/content";

type Props = {
  banner: SiteContent["launchBanner"];
  orderStatus: SiteContent["orderStatus"];
};

/**
 * Top-of-page announcement strip. Only renders when:
 *   - launchBanner.enabled = true
 *   - orderStatus.blocked = false (i.e. we've actually opened orders)
 * Both toggles live in the admin; flipping either off hides the strip.
 */
export default function LaunchBanner({ banner, orderStatus }: Props) {
  if (!banner?.enabled) return null;
  if (orderStatus?.blocked) return null;

  const hasCta = Boolean(banner.ctaHref && banner.ctaLabel);

  return (
    <div className="relative z-40 bg-ink text-canvas">
      <div className="container-app flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 py-2 text-center text-[12px] font-medium tracking-wide md:text-[13px]">
        <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-gold-deep" />
        <span>{banner.text}</span>
        {hasCta ? (
          <Link
            href={banner.ctaHref!}
            className="inline-flex items-center gap-1 rounded-full border border-canvas/40 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-canvas hover:border-canvas hover:bg-canvas hover:text-ink md:text-[12px]"
          >
            {banner.ctaLabel} <span aria-hidden>→</span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
