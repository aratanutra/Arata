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
  if (!v.name.trim()) {
    errs.name = "Full name is required.";
  } else if (v.name.trim().length < 2) {
    errs.name = "Full name must be at least 2 letters.";
  }
  const email = v.email.trim();
  if (!email) {
    errs.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errs.email = "Enter a valid email (e.g. name@example.com).";
  }
  const digits = v.phone.replace(/\D/g, "");
  if (!digits) {
    errs.phone = "Phone number is required.";
  } else if (digits.length !== 10) {
    errs.phone = "Phone must be exactly 10 digits.";
  } else if (!/^[6-9]/.test(digits)) {
    errs.phone = "Indian mobile numbers start with 6, 7, 8 or 9.";
  }
  if (!v.address1.trim()) {
    errs.address1 = "Address is required.";
  } else if (v.address1.trim().length < 5) {
    errs.address1 = "Address looks too short — please include house/flat no. and street.";
  }
  if (!v.city.trim()) {
    errs.city = "City is required.";
  } else if (v.city.trim().length < 2) {
    errs.city = "City name must be at least 2 letters.";
  }
  if (!v.state) errs.state = "Please select your state.";
  if (!v.pincode) {
    errs.pincode = "PIN code is required.";
  } else if (!/^\d{6}$/.test(v.pincode)) {
    errs.pincode = "PIN must be exactly 6 digits.";
  } else if (/^0/.test(v.pincode)) {
    errs.pincode = "Indian PIN codes do not start with 0.";
  }
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
  const [touched, setTouched] = useState<Partial<Record<keyof CheckoutFormValues, boolean>>>({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsTouched, setTermsTouched] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Validate live on every change — needed to disable the submit button
  // until every required field is good.
  const errors = validate(values);
  const isFormValid = Object.keys(errors).length === 0 && termsAccepted;

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
      setTouched({});
      setTermsAccepted(false);
      setTermsTouched(false);
      setSubmitAttempted(false);
    }
  }, [open]);

  function setField<K extends keyof CheckoutFormValues>(k: K, v: CheckoutFormValues[K]) {
    setValues((prev) => ({ ...prev, [k]: v }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitAttempted(true);
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
    setTermsTouched(true);
    if (Object.keys(errors).length > 0 || !termsAccepted) {
      // Scroll the modal body to the first error so the user sees it.
      if (typeof window !== "undefined") {
        requestAnimationFrame(() => {
          const first = document.querySelector(
            "[data-ck-error='true'], [data-ck-terms-error='true']"
          );
          first?.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      }
      return;
    }
    onSubmit(values);
  }

  if (!open) return null;

  // Highlight a field as invalid when the user has touched it OR already
  // pressed submit at least once.
  const showErr = (k: keyof CheckoutFormValues) =>
    (touched[k] || submitAttempted) && Boolean(errors[k]);
  const errClass = (k: keyof CheckoutFormValues) =>
    showErr(k) ? "border-red-500 focus:border-red-600 bg-red-50/40" : "border-hairline";

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

          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2" noValidate>
            {submitAttempted && Object.keys(errors).length > 0 ? (
              <div
                role="alert"
                className="sm:col-span-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[12px] text-red-700"
              >
                Please fix the fields marked below — all fields except Address line 2 are required.
              </div>
            ) : null}

            <div className="sm:col-span-2">
              <label className="label-field" htmlFor="ck-name">
                Full name <span className="text-red-600" aria-hidden>*</span>
              </label>
              <input
                id="ck-name"
                type="text"
                autoComplete="name"
                required
                aria-invalid={showErr("name")}
                aria-describedby={showErr("name") ? "ck-name-err" : undefined}
                data-ck-error={showErr("name") || undefined}
                value={values.name}
                onChange={(e) => setField("name", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                className={`input-clean ${errClass("name")}`}
              />
              {showErr("name") ? (
                <p id="ck-name-err" className="mt-1 text-[11px] text-red-600">
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div>
              <label className="label-field" htmlFor="ck-email">
                Email <span className="text-red-600" aria-hidden>*</span>
              </label>
              <input
                id="ck-email"
                type="email"
                autoComplete="email"
                required
                aria-invalid={showErr("email")}
                aria-describedby={showErr("email") ? "ck-email-err" : undefined}
                data-ck-error={showErr("email") || undefined}
                placeholder="name@example.com"
                value={values.email}
                onChange={(e) => setField("email", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                className={`input-clean ${errClass("email")}`}
              />
              {showErr("email") ? (
                <p id="ck-email-err" className="mt-1 text-[11px] text-red-600">
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div>
              <label className="label-field" htmlFor="ck-phone">
                Phone <span className="text-red-600" aria-hidden>*</span>
              </label>
              <input
                id="ck-phone"
                type="tel"
                autoComplete="tel"
                inputMode="numeric"
                required
                maxLength={10}
                aria-invalid={showErr("phone")}
                aria-describedby={showErr("phone") ? "ck-phone-err" : undefined}
                data-ck-error={showErr("phone") || undefined}
                placeholder="10-digit mobile (e.g. 98765 43210)"
                value={values.phone}
                onChange={(e) =>
                  setField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                className={`input-clean ${errClass("phone")}`}
              />
              {showErr("phone") ? (
                <p id="ck-phone-err" className="mt-1 text-[11px] text-red-600">
                  {errors.phone}
                </p>
              ) : null}
            </div>

            <div className="sm:col-span-2">
              <label className="label-field" htmlFor="ck-address1">
                Address (line 1) <span className="text-red-600" aria-hidden>*</span>
              </label>
              <input
                id="ck-address1"
                type="text"
                autoComplete="address-line1"
                required
                aria-invalid={showErr("address1")}
                aria-describedby={showErr("address1") ? "ck-address1-err" : undefined}
                data-ck-error={showErr("address1") || undefined}
                placeholder="Flat / house no., street"
                value={values.address1}
                onChange={(e) => setField("address1", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, address1: true }))}
                className={`input-clean ${errClass("address1")}`}
              />
              {showErr("address1") ? (
                <p id="ck-address1-err" className="mt-1 text-[11px] text-red-600">
                  {errors.address1}
                </p>
              ) : null}
            </div>

            <div className="sm:col-span-2">
              <label className="label-field" htmlFor="ck-address2">
                Address (line 2) <span className="text-muted">(optional)</span>
              </label>
              <input
                id="ck-address2"
                type="text"
                autoComplete="address-line2"
                placeholder="Landmark, area"
                value={values.address2}
                onChange={(e) => setField("address2", e.target.value)}
                className="input-clean border-hairline"
              />
            </div>

            <div>
              <label className="label-field" htmlFor="ck-city">
                City <span className="text-red-600" aria-hidden>*</span>
              </label>
              <input
                id="ck-city"
                type="text"
                autoComplete="address-level2"
                required
                aria-invalid={showErr("city")}
                aria-describedby={showErr("city") ? "ck-city-err" : undefined}
                data-ck-error={showErr("city") || undefined}
                value={values.city}
                onChange={(e) => setField("city", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, city: true }))}
                className={`input-clean ${errClass("city")}`}
              />
              {showErr("city") ? (
                <p id="ck-city-err" className="mt-1 text-[11px] text-red-600">
                  {errors.city}
                </p>
              ) : null}
            </div>

            <div>
              <label className="label-field" htmlFor="ck-state">
                State <span className="text-red-600" aria-hidden>*</span>
              </label>
              <select
                id="ck-state"
                required
                aria-invalid={showErr("state")}
                aria-describedby={showErr("state") ? "ck-state-err" : undefined}
                data-ck-error={showErr("state") || undefined}
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
              {showErr("state") ? (
                <p id="ck-state-err" className="mt-1 text-[11px] text-red-600">
                  {errors.state}
                </p>
              ) : null}
            </div>

            <div>
              <label className="label-field" htmlFor="ck-pincode">
                PIN code <span className="text-red-600" aria-hidden>*</span>
              </label>
              <input
                id="ck-pincode"
                type="text"
                autoComplete="postal-code"
                inputMode="numeric"
                pattern="[0-9]*"
                required
                maxLength={6}
                aria-invalid={showErr("pincode")}
                aria-describedby={showErr("pincode") ? "ck-pincode-err" : undefined}
                data-ck-error={showErr("pincode") || undefined}
                placeholder="6-digit PIN (e.g. 500049)"
                value={values.pincode}
                onChange={(e) => setField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                onBlur={() => setTouched((t) => ({ ...t, pincode: true }))}
                className={`input-clean ${errClass("pincode")}`}
              />
              {showErr("pincode") ? (
                <p id="ck-pincode-err" className="mt-1 text-[11px] text-red-600">
                  {errors.pincode}
                </p>
              ) : null}
            </div>

            {submitError ? (
              <p className="sm:col-span-2 rounded-md bg-red-50 px-3 py-2 text-[12px] text-red-700">
                {submitError}
              </p>
            ) : null}

            <div
              className={`sm:col-span-2 rounded-xl border p-3 ${
                termsTouched && !termsAccepted
                  ? "border-red-300 bg-red-50/40"
                  : "border-hairline bg-paper"
              }`}
              data-ck-terms-error={termsTouched && !termsAccepted ? true : undefined}
            >
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    setTermsTouched(true);
                  }}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-gold-deep"
                  aria-describedby="terms-help"
                />
                <span className="text-[12px] leading-relaxed text-ink-soft">
                  I have read and agree to the{" "}
                  <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-gold-deep">Terms &amp; Conditions</a>,{" "}
                  <a href="/return-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gold-deep">Return Policy</a>,{" "}
                  <a href="/refund-and-cancellation" target="_blank" rel="noopener noreferrer" className="underline hover:text-gold-deep">Refund &amp; Cancellation</a>, and{" "}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gold-deep">Privacy Policy</a>. I confirm I am 18 years or older and understand this product is a health supplement, not for medicinal use.
                  <span className="text-red-600" aria-hidden> *</span>
                </span>
              </label>
              {termsTouched && !termsAccepted ? (
                <p id="terms-help" className="mt-2 pl-7 text-[11px] text-red-600">
                  Please accept the terms to continue.
                </p>
              ) : null}
            </div>

            <div className="sm:col-span-2 flex flex-col gap-2 pt-2">
              <button
                type="submit"
                disabled={submitting || !isFormValid}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-[15px] font-semibold text-canvas transition-all duration-200 hover:brightness-110 hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Please wait…" : submitLabel}
              </button>
              {!isFormValid && submitAttempted ? (
                <p className="text-center text-[11px] text-muted">
                  Fill all required fields and accept the terms to continue.
                </p>
              ) : null}
              <button
                type="button"
                onClick={onCancel}
                disabled={submitting}
                className="inline-flex w-full items-center justify-center rounded-full border border-hairline bg-canvas px-6 py-2.5 text-[13px] font-medium text-ink hover:border-ink"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
