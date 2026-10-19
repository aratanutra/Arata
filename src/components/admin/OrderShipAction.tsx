"use client";

import { useState } from "react";

type Props = {
  orderId: string;
  initialTrackingUrl?: string;
  initialCourier?: string;
  initialAwbNumber?: string;
  initialShippedAt?: string;
  initialExpectedDeliveryDate?: string;
  status: "created" | "paid" | "failed" | "refunded" | "shipped";
};

function toDateInputValue(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function todayIso(): string {
  return toDateInputValue(new Date().toISOString());
}

function plusDaysIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toDateInputValue(d.toISOString());
}

export default function OrderShipAction({
  orderId,
  initialTrackingUrl,
  initialCourier,
  initialAwbNumber,
  initialShippedAt,
  initialExpectedDeliveryDate,
  status
}: Props) {
  const [open, setOpen] = useState(false);
  const [trackingUrl, setTrackingUrl] = useState(initialTrackingUrl ?? "");
  const [courier, setCourier] = useState(initialCourier ?? "");
  const [awbNumber, setAwbNumber] = useState(initialAwbNumber ?? "");
  const [shippedAt, setShippedAt] = useState(
    toDateInputValue(initialShippedAt) || todayIso()
  );
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(
    toDateInputValue(initialExpectedDeliveryDate) || plusDaysIso(5)
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status !== "paid" && status !== "shipped") return null;

  const label =
    status === "shipped" ? "Update tracking" : "Mark shipped";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/ship`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackingUrl: trackingUrl.trim() || undefined,
          courier: courier.trim() || undefined,
          awbNumber: awbNumber.trim() || undefined,
          shippedAt: shippedAt || undefined,
          expectedDeliveryDate: expectedDeliveryDate || undefined
        })
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? `Failed (${res.status})`);
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-4 border-t border-hairline pt-4">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-hairline bg-canvas px-3 py-1.5 text-[12px] font-semibold uppercase tracking-widest text-ink hover:border-ink"
        >
          {label}
        </button>
      ) : (
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="label-field" htmlFor={`courier-${orderId}`}>
              Courier
            </label>
            <input
              id={`courier-${orderId}`}
              type="text"
              value={courier}
              onChange={(e) => setCourier(e.target.value)}
              placeholder="e.g. Bluedart, DTDC, Delhivery, India Post"
              className="input-clean"
            />
          </div>
          <div>
            <label className="label-field" htmlFor={`awb-${orderId}`}>
              AWB / Tracking Number
            </label>
            <input
              id={`awb-${orderId}`}
              type="text"
              value={awbNumber}
              onChange={(e) => setAwbNumber(e.target.value)}
              placeholder="e.g. 12345678901234"
              className="input-clean"
            />
          </div>
          <div>
            <label className="label-field" htmlFor={`shipped-${orderId}`}>
              Dispatch Date
            </label>
            <input
              id={`shipped-${orderId}`}
              type="date"
              value={shippedAt}
              onChange={(e) => setShippedAt(e.target.value)}
              className="input-clean"
            />
          </div>
          <div>
            <label className="label-field" htmlFor={`expected-${orderId}`}>
              Expected Delivery Date
            </label>
            <input
              id={`expected-${orderId}`}
              type="date"
              value={expectedDeliveryDate}
              onChange={(e) => setExpectedDeliveryDate(e.target.value)}
              className="input-clean"
            />
          </div>
          <div className="md:col-span-2">
            <label className="label-field" htmlFor={`tracking-${orderId}`}>
              Tracking URL
            </label>
            <input
              id={`tracking-${orderId}`}
              type="url"
              value={trackingUrl}
              onChange={(e) => setTrackingUrl(e.target.value)}
              placeholder="https://…"
              className="input-clean"
            />
          </div>
          {error ? (
            <p className="md:col-span-2 rounded-md bg-red-50 px-3 py-2 text-[12px] text-red-700">
              {error}
            </p>
          ) : null}
          <div className="md:col-span-2 flex flex-wrap items-center gap-2">
            <button
              type="submit"
              disabled={busy}
              className="btn-primary text-[13px] disabled:opacity-60"
            >
              {busy
                ? "Saving…"
                : status === "shipped"
                  ? "Save + resend email"
                  : "Mark shipped + email customer"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={busy}
              className="rounded-full border border-hairline px-3 py-1.5 text-[12px] font-semibold uppercase tracking-widest text-muted hover:border-ink hover:text-ink disabled:opacity-60"
            >
              Cancel
            </button>
            <p className="ml-auto text-[11px] text-muted">
              An email goes to the customer only when you save.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
