"use client";

import { useState } from "react";

const STATES_UT: string[] = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
  "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman & Nicobar Islands","Chandigarh","Dadra & Nagar Haveli and Daman & Diu","Delhi",
  "Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry"
];

type PackOption = {
  id: string;
  label: string;
  sublabel?: string;
  priceNumber: number;
  shippingCost: number;
};

type Props = { packs: PackOption[] };

export default function CreateOrderButton({ packs }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [packId, setPackId] = useState(packs[0]?.id ?? "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState<"created" | "paid">("created");
  const [paymentId, setPaymentId] = useState("");
  const [createdAt, setCreatedAt] = useState(""); // optional ISO date; blank = now
  const [sendEmail, setSendEmail] = useState(false);

  const selectedPack = packs.find((p) => p.id === packId) ?? packs[0];
  const total = (selectedPack?.priceNumber ?? 0) + (selectedPack?.shippingCost ?? 0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPack) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/orders/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pack: {
            id: selectedPack.id,
            label: selectedPack.label,
            sublabel: selectedPack.sublabel,
            priceNumber: selectedPack.priceNumber,
            shippingCost: selectedPack.shippingCost
          },
          customer: {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            address1: address1.trim(),
            address2: address2.trim() || undefined,
            city: city.trim(),
            state: stateVal,
            pincode: pincode.trim()
          },
          status,
          paymentId: status === "paid" ? paymentId.trim() || undefined : undefined,
          createdAt: createdAt || undefined,
          sendConfirmationEmail: status === "paid" ? sendEmail : false
        })
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !body.ok) {
        throw new Error(body.error ?? `Failed (${res.status})`);
      }
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-primary text-[13px]"
      >
        + New order
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal
      aria-labelledby="newo-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 p-4 backdrop-blur-sm md:items-center"
      onClick={(e) => { if (e.target === e.currentTarget && !busy) setOpen(false); }}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-hairline bg-canvas shadow-xl">
        <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-gold-deep">New manual order</div>
            <h2 id="newo-title" className="mt-1 text-lg font-semibold tracking-tight text-ink">
              Record an order (walk-in · phone · missed WhatsApp)
            </h2>
          </div>
          <button
            type="button"
            onClick={() => !busy && setOpen(false)}
            disabled={busy}
            aria-label="Close"
            className="rounded-full border border-hairline p-1.5 text-muted hover:border-ink hover:text-ink disabled:opacity-50"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M4 4l12 12M16 4L4 16" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={submit} className="max-h-[80vh] overflow-y-auto px-6 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Pack */}
            <div className="sm:col-span-2">
              <label className="label-field" htmlFor="no-pack">Pack</label>
              <select
                id="no-pack"
                value={packId}
                onChange={(e) => setPackId(e.target.value)}
                className="input-clean border-hairline"
              >
                {packs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}{p.sublabel ? ` · ${p.sublabel}` : ""} · ₹{p.priceNumber}
                    {p.shippingCost > 0 ? ` + ₹${p.shippingCost} shipping` : " · Free shipping"}
                  </option>
                ))}
              </select>
              {selectedPack ? (
                <p className="mt-1 text-[11px] text-muted">
                  Total <span className="font-semibold text-ink">₹{total}</span>
                </p>
              ) : null}
            </div>

            {/* Customer */}
            <div className="sm:col-span-2">
              <label className="label-field" htmlFor="no-name">Full name</label>
              <input id="no-name" value={name} onChange={(e) => setName(e.target.value)} className="input-clean border-hairline" required />
            </div>
            <div>
              <label className="label-field" htmlFor="no-email">Email</label>
              <input id="no-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-clean border-hairline" required />
            </div>
            <div>
              <label className="label-field" htmlFor="no-phone">Phone (10 digits)</label>
              <input
                id="no-phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="input-clean border-hairline"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label-field" htmlFor="no-a1">Address (line 1)</label>
              <input id="no-a1" value={address1} onChange={(e) => setAddress1(e.target.value)} className="input-clean border-hairline" required />
            </div>
            <div className="sm:col-span-2">
              <label className="label-field" htmlFor="no-a2">Address (line 2) <span className="text-muted">(optional)</span></label>
              <input id="no-a2" value={address2} onChange={(e) => setAddress2(e.target.value)} className="input-clean border-hairline" />
            </div>
            <div>
              <label className="label-field" htmlFor="no-city">City</label>
              <input id="no-city" value={city} onChange={(e) => setCity(e.target.value)} className="input-clean border-hairline" required />
            </div>
            <div>
              <label className="label-field" htmlFor="no-state">State</label>
              <select id="no-state" value={stateVal} onChange={(e) => setStateVal(e.target.value)} className="input-clean border-hairline" required>
                <option value="">Select state</option>
                {STATES_UT.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field" htmlFor="no-pin">PIN (6 digits)</label>
              <input
                id="no-pin"
                inputMode="numeric"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="input-clean border-hairline"
                required
              />
            </div>

            {/* Status / payment */}
            <div className="sm:col-span-2 mt-2 rounded-xl border border-hairline bg-paper p-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="label-field" htmlFor="no-status">Status</label>
                  <select id="no-status" value={status} onChange={(e) => setStatus(e.target.value as "created" | "paid")} className="input-clean border-hairline">
                    <option value="created">Created (awaiting payment)</option>
                    <option value="paid">Paid (payment already received)</option>
                  </select>
                </div>
                <div>
                  <label className="label-field" htmlFor="no-date">Order date <span className="text-muted">(optional)</span></label>
                  <input
                    id="no-date"
                    type="datetime-local"
                    value={createdAt}
                    onChange={(e) => setCreatedAt(e.target.value)}
                    className="input-clean border-hairline"
                  />
                  <p className="mt-1 text-[11px] text-muted">Leave blank for now. Set for backfilled orders.</p>
                </div>
              </div>
              {status === "paid" ? (
                <>
                  <div className="mt-3">
                    <label className="label-field" htmlFor="no-pay">Payment reference <span className="text-muted">(e.g. UPI txn)</span></label>
                    <input id="no-pay" value={paymentId} onChange={(e) => setPaymentId(e.target.value)} className="input-clean border-hairline" placeholder="e.g. UPI 345217890" />
                  </div>
                  <label className="mt-3 flex items-start gap-2 text-[12px] text-ink-soft">
                    <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} className="mt-0.5 h-4 w-4 accent-gold-deep" />
                    <span>Send order-confirmation email to the customer now.</span>
                  </label>
                </>
              ) : null}
            </div>
          </div>

          {error ? (
            <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-[12px] text-red-700">{error}</p>
          ) : null}

          <div className="mt-5 flex flex-col gap-2 border-t border-hairline pt-4 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={busy}
              className="btn-primary text-[14px] disabled:opacity-60"
            >
              {busy ? "Saving…" : "Create order"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={busy}
              className="inline-flex items-center justify-center rounded-full border border-hairline bg-canvas px-5 py-2.5 text-[13px] font-medium text-ink hover:border-ink"
            >
              Cancel
            </button>
            <p className="ml-auto text-[11px] text-muted">
              Order is saved to Blobs · admin alert email fires.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
