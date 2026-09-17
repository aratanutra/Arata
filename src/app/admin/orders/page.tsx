import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { listOrders, ordersEnabled, type StoredOrder } from "@/lib/orders";
import Link from "next/link";
import OrderShipAction from "@/components/admin/OrderShipAction";

export const dynamic = "force-dynamic";

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

function StatusBadge({ status }: { status: StoredOrder["status"] }) {
  const styles =
    status === "paid"
      ? "bg-emerald-100 text-emerald-800"
      : status === "shipped"
        ? "bg-sky-100 text-sky-800"
        : status === "failed"
          ? "bg-red-100 text-red-700"
          : status === "refunded"
            ? "bg-amber-100 text-amber-800"
            : "bg-hairline/60 text-ink-soft";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${styles}`}>
      {status}
    </span>
  );
}

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const enabled = ordersEnabled();
  const orders = enabled ? await listOrders(200) : [];

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="flex flex-col gap-4 border-b border-hairline pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gold-deep">
            Arata Nutraceuticals · Orders
          </p>
          <h1 className="mt-2 text-4xl text-ink">Orders</h1>
          <p className="mt-2 text-sm text-muted">
            Orders created through the AETERNYX® checkout, newest first. Paid orders have a
            shipping address ready. Cross-reference in Razorpay Dashboard → Payments if needed.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin" className="btn-secondary text-[13px]">
            ← Content Studio
          </Link>
        </div>
      </header>

      {!enabled ? (
        <p className="mt-8 rounded-2xl border border-hairline bg-canvas p-6 text-[13px] text-ink-soft">
          Netlify Blobs is not available in this environment. Orders are not being persisted;
          check the Razorpay dashboard for payment records.
        </p>
      ) : orders.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-hairline bg-canvas p-6 text-[13px] text-ink-soft">
          No orders yet.
        </p>
      ) : (
        <div className="mt-8 space-y-3">
          {orders.map((o) => (
            <article
              key={o.orderId}
              className="rounded-2xl border border-hairline bg-canvas p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={o.status} />
                    <span className="tnum text-[12px] text-muted">{o.orderId}</span>
                  </div>
                  <h2 className="mt-2 text-lg font-semibold text-ink">
                    {o.customer.name}
                  </h2>
                  <p className="text-[13px] text-muted">
                    {o.customer.email} · {o.customer.phone}
                  </p>
                </div>
                <div className="text-right">
                  <div className="tnum text-2xl font-semibold text-ink">
                    {INR.format(o.amount / 100)}
                  </div>
                  <div className="text-[11px] uppercase tracking-widest text-muted">
                    {o.pack.label} · {o.pack.sublabel ?? ""}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 border-t border-hairline pt-4 text-[13px] leading-relaxed text-ink-soft md:grid-cols-2">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-gold-deep">
                    Shipping address
                  </div>
                  <p className="mt-1">
                    {o.customer.address1}
                    {o.customer.address2 ? `, ${o.customer.address2}` : ""}<br />
                    {o.customer.city}, {o.customer.state} — {o.customer.pincode}
                  </p>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-gold-deep">
                    Breakdown
                  </div>
                  <p className="mt-1">
                    Product {INR.format(o.breakdown.productPaise / 100)} · Shipping{" "}
                    {o.breakdown.shippingPaise > 0
                      ? INR.format(o.breakdown.shippingPaise / 100)
                      : "Free"}
                  </p>
                  <p className="mt-2 text-[11px] text-muted">
                    Created {new Date(o.createdAt).toLocaleString("en-IN")}
                    {o.paidAt ? ` · Paid ${new Date(o.paidAt).toLocaleString("en-IN")}` : ""}
                    {o.shippedAt ? ` · Shipped ${new Date(o.shippedAt).toLocaleString("en-IN")}` : ""}
                  </p>
                  {o.paymentId ? (
                    <p className="mt-1 text-[11px] tnum text-muted">Payment ID: {o.paymentId}</p>
                  ) : null}
                  {o.trackingUrl ? (
                    <p className="mt-1 text-[11px] text-muted">
                      {o.courier ? `${o.courier} · ` : ""}
                      <a
                        href={o.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-hairline underline-offset-2 hover:text-ink"
                      >
                        {o.trackingUrl}
                      </a>
                    </p>
                  ) : null}
                </div>
              </div>

              <OrderShipAction
                orderId={o.orderId}
                initialTrackingUrl={o.trackingUrl}
                initialCourier={o.courier}
                status={o.status}
              />
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
