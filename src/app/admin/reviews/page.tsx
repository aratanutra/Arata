import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { listReviews, reviewsEnabled, type ListFilter, type StoredReview } from "@/lib/reviews";
import ReviewAdminActions from "@/components/admin/ReviewAdminActions";

export const dynamic = "force-dynamic";

type Props = { searchParams?: { tab?: string } };

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-gold-deep tracking-widest" aria-label={`${rating} stars`}>
      {"★".repeat(rating)}
      <span className="text-muted">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

function StatusPill({ status }: { status: StoredReview["status"] }) {
  const map: Record<StoredReview["status"], { bg: string; fg: string; label: string }> = {
    pending: { bg: "bg-amber-100", fg: "text-amber-800", label: "Pending" },
    approved: { bg: "bg-emerald-100", fg: "text-emerald-800", label: "Approved" },
    rejected: { bg: "bg-red-100", fg: "text-red-700", label: "Rejected" }
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${s.bg} ${s.fg}`}>
      {s.label}
    </span>
  );
}

export default async function AdminReviewsPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const enabled = reviewsEnabled();
  const tab = (searchParams?.tab as ListFilter) || "pending";
  const validTab: ListFilter = ["pending", "approved", "rejected", "all"].includes(tab) ? tab : "pending";

  const items = enabled ? await listReviews(validTab, 500) : [];
  const all = enabled ? await listReviews("all", 500) : [];
  const counts = {
    pending: all.filter((r) => r.status === "pending").length,
    approved: all.filter((r) => r.status === "approved").length,
    rejected: all.filter((r) => r.status === "rejected").length,
    all: all.length
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="flex flex-col gap-4 border-b border-hairline pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gold-deep">Arata Nutraceuticals · Reviews</p>
          <h1 className="mt-2 text-4xl text-ink">Review moderation</h1>
          <p className="mt-2 text-sm text-muted max-w-xl">
            New reviews land here as <strong>Pending</strong>. Approve to publish on
            /aeternyx and /reviews. Reject to hide (keeps the record so the same person
            can&apos;t spam). Delete to purge permanently.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="text-[11px] uppercase tracking-widest text-muted hover:text-ink">
            Orders →
          </Link>
          <Link href="/admin" className="btn-secondary text-[13px]">
            ← Content Studio
          </Link>
        </div>
      </header>

      {!enabled ? (
        <p className="mt-8 rounded-2xl border border-hairline bg-canvas p-6 text-[13px] text-ink-soft">
          Netlify Blobs is not available in this environment. Reviews are not being persisted.
        </p>
      ) : (
        <>
          {/* Tabs */}
          <nav className="mt-8 flex flex-wrap items-center gap-2 border-b border-hairline pb-3 text-[12px] uppercase tracking-widest">
            {(
              [
                ["pending", "Pending", counts.pending],
                ["approved", "Approved", counts.approved],
                ["rejected", "Rejected", counts.rejected],
                ["all", "All", counts.all]
              ] as const
            ).map(([key, label, n]) => {
              const active = key === validTab;
              return (
                <Link
                  key={key}
                  href={`/admin/reviews?tab=${key}`}
                  className={`rounded-full px-3 py-1.5 ${
                    active
                      ? "bg-ink text-canvas"
                      : "border border-hairline text-muted hover:border-ink hover:text-ink"
                  }`}
                >
                  {label} <span className="ml-1 tnum">{n}</span>
                </Link>
              );
            })}
          </nav>

          {items.length === 0 ? (
            <p className="mt-10 rounded-2xl border border-hairline bg-canvas p-6 text-[13px] text-ink-soft">
              No reviews in <strong>{validTab}</strong>.
            </p>
          ) : (
            <div className="mt-6 grid gap-4">
              {items.map((r) => (
                <article key={r.id} className="rounded-2xl border border-hairline bg-paper p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <Stars rating={r.rating} />
                        <StatusPill status={r.status} />
                        {r.verifiedPurchaser ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-emerald-800">
                            ✓ Verified
                          </span>
                        ) : null}
                      </div>
                      <h2 className="mt-2 text-lg font-semibold tracking-tight text-ink">{r.title}</h2>
                    </div>
                    <div className="text-[11px] text-muted">
                      Submitted {new Date(r.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
                    </div>
                  </div>

                  <p className="mt-3 whitespace-pre-wrap text-[14px] leading-relaxed text-ink-soft">
                    {r.body}
                  </p>

                  {r.photoKey ? (
                    <div className="mt-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/api/reviews/photo/${r.photoKey}`}
                        alt="Reviewer photo"
                        className="max-h-72 w-auto rounded-lg border border-hairline object-cover"
                      />
                    </div>
                  ) : null}

                  <dl className="mt-4 grid gap-2 text-[12px] text-muted sm:grid-cols-2">
                    <div><dt className="inline font-semibold text-ink">Reviewer:</dt> <dd className="inline">{r.name} · {r.city}{r.state ? ", " + r.state : ""}</dd></div>
                    {r.email ? <div><dt className="inline font-semibold text-ink">Email:</dt> <dd className="inline">{r.email}</dd></div> : null}
                    {r.orderId ? <div className="sm:col-span-2"><dt className="inline font-semibold text-ink">Order ID:</dt> <dd className="inline font-mono">{r.orderId}</dd></div> : null}
                    {r.moderationNote ? <div className="sm:col-span-2 text-red-700"><dt className="inline font-semibold">Moderation note:</dt> <dd className="inline">{r.moderationNote}</dd></div> : null}
                  </dl>

                  <ReviewAdminActions id={r.id} status={r.status} />
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
