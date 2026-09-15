"use client";

import { useEffect, useState } from "react";

const STATES_UT: string[] = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman & Nicobar Islands",
  "Chandigarh",
  "Dadra & Nagar Haveli and Daman & Diu",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

export type CheckoutFormValues = {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  pincode: string;
};

type Props = {
  open: boolean;
  title: string;
  summaryLines: string[];
  totalLabel: string;
  onCancel: () => void;
  onSubmit: (values: CheckoutFormValues) => void | Promise<void>;
  submitting?: boolean;
  submitError?: string | null;
  submitLabel: string;
};

const EMPTY: CheckoutFormValues = {
  name: "",
  email: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  pincode: ""
};

function validate(v: CheckoutFormValues): Partial<Record<keyof CheckoutFormValues, string>> {
  const errs: Partial<Record<keyof CheckoutFormValues, string>> = {};
  if (v.name.trim().length < 2) errs.name = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) errs.email = "Enter a valid email.";
  const digits = v.phone.replace(/\D/g, "");
  if (digits.length < 10) errs.phone = "Phone must be at least 10 digits.";
  if (v.address1.trim().length < 4) errs.address1 = "Enter your street address.";
  if (v.city.trim().length < 2) errs.city = "City is required.";
  if (!v.state) errs.state = "Select your state.";
  if (!/^\d{6}$/.test(v.pincode)) errs.pincode = "PIN must be 6 digits.";
  return errs;
}

export default function CheckoutModal({
  open,
  title,
  summaryLines,
  totalLabel,
  onCancel,
  onSubmit,
  submitting = false,
  submitError = null,
  submitLabel
}: Props) {
  const [values, setValues] = useState<CheckoutFormValues>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormValues, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CheckoutFormValues, boolean>>>({});

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
    return undefined;
  }, [open]);

  // Reset form when modal reopens.
  useEffect(() => {
    if (open) {
      setErrors({});
      setTouched({});
    }
  }, [open]);

  function setField<K extends keyof CheckoutFormValues>(k: K, v: CheckoutFormValues[K]) {
    setValues((prev) => ({ ...prev, [k]: v }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    setTouched({
      name: true,
      email: true,
      phone: true,
      address1: true,
      address2: true,
      city: true,
      state: true,
      pincode: true
    });
    if (Object.keys(errs).length > 0) return;
    onSubmit(values);
  }

  if (!open) return null;

  const errClass = (k: keyof CheckoutFormValues) =>
    touched[k] && errors[k] ? "border-red-400" : "border-hairline";

  return (
    <div
      role="dialog"
      aria-modal
      aria-labelledby="checkout-title"
      className="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto bg-ink/40 p-0 sm:items-center sm:p-4"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-t-3xl bg-canvas shadow-card-hover sm:rounded-3xl">
        <div className="flex items-start justify-between gap-4 border-b border-hairline px-6 py-5">
          <div>
            <h2 id="checkout-title" className="text-lg font-semibold tracking-tight text-ink">
              {title}
            </h2>
            <p className="mt-1 text-[12px] text-muted">
              We ship anywhere in India · Tracking sent on WhatsApp
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close checkout"
            className="rounded-full border border-hairline p-1.5 text-muted hover:border-ink hover:text-ink"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M4 4l12 12M16 4L4 16" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto px-6 py-5">
          <div className="mb-5 rounded-2xl bg-paper p-4">
            {summaryLines.map((line, i) => (
              <p key={i} className="text-[13px] text-ink-soft">
                {line}
              </p>
            ))}
            <div className="mt-2 flex items-baseline justify-between border-t border-hairline pt-2">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted">
                You pay
              </span>
              <span className="tnum text-xl font-semibold text-ink">{totalLabel}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label-field" htmlFor="ck-name">Full name</label>
              <input
                id="ck-name"
                type="text"
                autoComplete="name"
                required
                value={values.name}
                onChange={(e) => setField("name", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                className={`input-clean ${errClass("name")}`}
              />
              {touched.name && errors.name ? <p className="mt-1 text-[11px] text-red-600">{errors.name}</p> : null}
            </div>

            <div>
              <label className="label-field" htmlFor="ck-email">Email</label>
              <input
                id="ck-email"
                type="email"
                autoComplete="email"
                required
                value={values.email}
                onChange={(e) => setField("email", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                className={`input-clean ${errClass("email")}`}
              />
              {touched.email && errors.email ? <p className="mt-1 text-[11px] text-red-600">{errors.email}</p> : null}
            </div>

            <div>
              <label className="label-field" htmlFor="ck-phone">Phone</label>
              <input
                id="ck-phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                required
                placeholder="10-digit mobile"
                value={values.phone}
                onChange={(e) => setField("phone", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                className={`input-clean ${errClass("phone")}`}
              />
              {touched.phone && errors.phone ? <p className="mt-1 text-[11px] text-red-600">{errors.phone}</p> : null}
            </div>

            <div className="sm:col-span-2">
              <label className="label-field" htmlFor="ck-address1">Address (line 1)</label>
              <input
                id="ck-address1"
                type="text"
                autoComplete="address-line1"
                required
                placeholder="Flat / house no., street"
                value={values.address1}
                onChange={(e) => setField("address1", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, address1: true }))}
                className={`input-clean ${errClass("address1")}`}
              />
              {touched.address1 && errors.address1 ? (
                <p className="mt-1 text-[11px] text-red-600">{errors.address1}</p>
              ) : null}
            </div>

            <div className="sm:col-span-2">
              <label className="label-field" htmlFor="ck-address2">Address (line 2)</label>
              <input
                id="ck-address2"
                type="text"
                autoComplete="address-line2"
                placeholder="Landmark, area (optional)"
                value={values.address2}
                onChange={(e) => setField("address2", e.target.value)}
                className={`input-clean ${errClass("address2")}`}
              />
            </div>

            <div>
              <label className="label-field" htmlFor="ck-city">City</label>
              <input
                id="ck-city"
                type="text"
                autoComplete="address-level2"
                required
                value={values.city}
                onChange={(e) => setField("city", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, city: true }))}
                className={`input-clean ${errClass("city")}`}
              />
              {touched.city && errors.city ? <p className="mt-1 text-[11px] text-red-600">{errors.city}</p> : null}
            </div>

            <div>
              <label className="label-field" htmlFor="ck-state">State</label>
              <select
                id="ck-state"
                required
                value={values.state}
                onChange={(e) => setField("state", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, state: true }))}
                className={`input-clean ${errClass("state")}`}
              >
                <option value="">Select state</option>
                {STATES_UT.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {touched.state && errors.state ? <p className="mt-1 text-[11px] text-red-600">{errors.state}</p> : null}
            </div>

            <div>
              <label className="label-field" htmlFor="ck-pincode">PIN code</label>
              <input
                id="ck-pincode"
                type="text"
                autoComplete="postal-code"
                inputMode="numeric"
                pattern="[0-9]*"
                required
                maxLength={6}
                placeholder="6-digit PIN"
                value={values.pincode}
                onChange={(e) => setField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                onBlur={() => setTouched((t) => ({ ...t, pincode: true }))}
                className={`input-clean ${errClass("pincode")}`}
              />
              {touched.pincode && errors.pincode ? (
                <p className="mt-1 text-[11px] text-red-600">{errors.pincode}</p>
              ) : null}
            </div>

            {submitError ? (
              <p className="sm:col-span-2 rounded-md bg-red-50 px-3 py-2 text-[12px] text-red-700">
                {submitError}
              </p>
            ) : null}

            <div className="sm:col-span-2 flex flex-col gap-2 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-[15px] font-semibold text-canvas transition-all duration-200 hover:brightness-110 hover:shadow-card-hover disabled:cursor-wait disabled:opacity-70"
              >
                {submitting ? "Opening secure checkout…" : submitLabel}
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={submitting}
                className="inline-flex w-full items-center justify-center rounded-full border border-hairline bg-canvas px-6 py-2.5 text-[13px] font-medium text-ink hover:border-ink"
              >
                Cancel
              </button>
              <p className="text-center text-[11px] leading-relaxed text-muted">
                By continuing you agree to our{" "}
                <a href="/terms" className="underline hover:text-gold-deep">Terms</a> and{" "}
                <a href="/privacy" className="underline hover:text-gold-deep">Privacy Policy</a>.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
