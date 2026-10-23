"use client";

import { useState, useRef } from "react";
import Link from "next/link";

const STATES_UT: string[] = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
  "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman & Nicobar Islands","Chandigarh","Dadra & Nagar Haveli and Daman & Diu","Delhi",
  "Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry"
];

type Props = { prefilledOrderId?: string };

type Submitted = { ok: true; id: string };

async function compressImage(file: File, maxDim = 1600, quality = 0.82): Promise<Blob> {
  // Draw to canvas, downscale, re-encode as JPEG — keeps upload < 1 MB in most cases.
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, w, h);
  return new Promise<Blob>((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob ?? file),
      "image/jpeg",
      quality
    );
  });
}

export default function ReviewForm({ prefilledOrderId = "" }: Props) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [ratingHover, setRatingHover] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState(prefilledOrderId);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsTouched, setTermsTouched] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<Submitted | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const photoInput = useRef<HTMLInputElement>(null);

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) {
      setPhotoFile(null);
      setPhotoPreview(null);
      return;
    }
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) {
      setError("Photo must be JPG, PNG or WebP.");
      e.target.value = "";
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("Photo too large. Max 10 MB (will be compressed before upload).");
      e.target.value = "";
      return;
    }
    setError(null);
    setPhotoFile(f);
    setPhotoPreview(URL.createObjectURL(f));
  }

  function clearPhoto() {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (photoInput.current) photoInput.current.value = "";
  }

  const errs: Record<string, string> = {};
  if (!name.trim()) errs.name = "Your name is required.";
  else if (name.trim().length < 2) errs.name = "Name is too short.";
  if (!city.trim()) errs.city = "City is required.";
  if (!stateVal) errs.state = "Please pick your state.";
  if (!rating) errs.rating = "Please tap a star rating.";
  if (!title.trim()) errs.title = "A short title is required.";
  else if (title.trim().length < 3) errs.title = "Title is too short.";
  else if (title.trim().length > 90) errs.title = "Title too long (max 90 chars).";
  if (!body.trim()) errs.body = "Please write a few lines about your experience.";
  else if (body.trim().length < 10) errs.body = "A little more detail, please (10+ chars).";
  else if (body.trim().length > 2000) errs.body = "Too long (max 2000 chars).";
  if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) errs.email = "Invalid email.";

  const isValid = Object.keys(errs).length === 0 && termsAccepted;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitAttempted(true);
    setTermsTouched(true);
    if (!isValid) return;

    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("city", city.trim());
      fd.append("state", stateVal);
      fd.append("rating", String(rating));
      fd.append("title", title.trim());
      fd.append("body", body.trim());
      if (email.trim()) fd.append("email", email.trim());
      if (orderId.trim()) fd.append("orderId", orderId.trim());
      // Honeypot — always empty for humans
      fd.append("website", "");

      if (photoFile) {
        const compressed = await compressImage(photoFile);
        const blob = new Blob([compressed], { type: "image/jpeg" });
        fd.append("photo", blob, "review-photo.jpg");
      }

      const res = await fetch("/api/reviews", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; id?: string; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? `Submission failed (${res.status})`);
      }
      setSubmitted({ ok: true, id: data.id ?? "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setBusy(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink">Thank you.</h2>
        <p className="mt-3 text-[14px] leading-relaxed text-ink-soft max-w-md mx-auto">
          Your review is in our moderation queue. We approve honest, specific experiences within
          24 hours — once approved, you&apos;ll see it live on{" "}
          <Link href="/aeternyx" className="underline hover:text-gold-deep">the product page</Link>{" "}
          and the{" "}
          <Link href="/reviews" className="underline hover:text-gold-deep">reviews page</Link>.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {/* Also share on Google — hidden until GBP review URL is configured. */}
          {process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ? (
            <a
              href={process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-[13px]"
            >
              Also share on Google
            </a>
          ) : null}
          <Link href="/aeternyx" className="btn-secondary text-[13px]">
            Back to AETERNYX®
          </Link>
        </div>
      </div>
    );
  }

  const show = (k: keyof typeof errs) => submitAttempted && errs[k];
  const errClass = (k: keyof typeof errs) => (show(k) ? "border-red-500 bg-red-50/40" : "border-hairline");

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      {submitAttempted && !isValid ? (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[12px] text-red-700">
          Please fix the fields marked below.
        </div>
      ) : null}

      {/* Honeypot — hidden from humans */}
      <div style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }} aria-hidden>
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* Rating */}
      <div>
        <label className="label-field">Your rating <span className="text-red-600">*</span></label>
        <div
          className="mt-2 inline-flex items-center gap-1"
          onMouseLeave={() => setRatingHover(0)}
          role="radiogroup"
          aria-label="Star rating"
        >
          {[1, 2, 3, 4, 5].map((n) => {
            const filled = n <= (ratingHover || rating);
            return (
              <button
                key={n}
                type="button"
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                onMouseEnter={() => setRatingHover(n)}
                onClick={() => setRating(n)}
                className="p-1 text-gold-deep transition-transform hover:scale-110"
              >
                <svg viewBox="0 0 24 24" width="34" height="34" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M12 2.5l2.95 6.17 6.8.73-5.1 4.62 1.46 6.66L12 17.3l-6.11 3.38 1.46-6.66L2.25 9.4l6.8-.73L12 2.5z" />
                </svg>
              </button>
            );
          })}
        </div>
        {show("rating") ? <p className="mt-1 text-[11px] text-red-600">{errs.rating}</p> : null}
      </div>

      <div>
        <label className="label-field" htmlFor="r-title">Review title <span className="text-red-600">*</span></label>
        <input
          id="r-title"
          type="text"
          maxLength={90}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Noticeably better energy by week 3"
          className={`input-clean ${errClass("title")}`}
        />
        {show("title") ? <p className="mt-1 text-[11px] text-red-600">{errs.title}</p> : null}
      </div>

      <div>
        <label className="label-field" htmlFor="r-body">Your experience <span className="text-red-600">*</span></label>
        <textarea
          id="r-body"
          maxLength={2000}
          rows={6}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What was your experience? How did you take it, for how long, what did you notice (or not notice)?"
          className={`input-clean ${errClass("body")}`}
        />
        <div className="mt-1 flex items-center justify-between text-[11px] text-muted">
          <span>{show("body") ? <span className="text-red-600">{errs.body}</span> : <span>No medical advice or disease claims please — reviews with those get rejected.</span>}</span>
          <span>{body.length}/2000</span>
        </div>
      </div>

      {/* Photo */}
      <div>
        <label className="label-field" htmlFor="r-photo">Add a photo <span className="text-muted">(optional)</span></label>
        {!photoPreview ? (
          <div className="mt-2">
            <input
              ref={photoInput}
              id="r-photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhoto}
              className="block w-full text-[13px] text-ink-soft file:mr-3 file:rounded-full file:border file:border-hairline file:bg-canvas file:px-4 file:py-2 file:text-[12px] file:font-semibold file:uppercase file:tracking-widest file:text-ink hover:file:bg-paper"
            />
            <p className="mt-1 text-[11px] text-muted">
              JPG, PNG or WebP. We resize to 1600px and compress before upload.
            </p>
          </div>
        ) : (
          <div className="mt-2 flex items-start gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoPreview} alt="Preview" className="h-24 w-24 rounded-lg border border-hairline object-cover" />
            <button
              type="button"
              onClick={clearPhoto}
              className="text-[11px] font-semibold uppercase tracking-widest text-muted hover:text-ink"
            >
              Remove photo
            </button>
          </div>
        )}
      </div>

      {/* Identity */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label-field" htmlFor="r-name">Your name <span className="text-red-600">*</span></label>
          <input
            id="r-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`input-clean ${errClass("name")}`}
          />
          {show("name") ? <p className="mt-1 text-[11px] text-red-600">{errs.name}</p> : null}
        </div>
        <div>
          <label className="label-field" htmlFor="r-email">Email <span className="text-muted">(optional, not published)</span></label>
          <input
            id="r-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="For verification only"
            className={`input-clean ${errClass("email")}`}
          />
          {show("email") ? <p className="mt-1 text-[11px] text-red-600">{errs.email}</p> : null}
        </div>
        <div>
          <label className="label-field" htmlFor="r-city">City <span className="text-red-600">*</span></label>
          <input
            id="r-city"
            type="text"
            autoComplete="address-level2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={`input-clean ${errClass("city")}`}
          />
          {show("city") ? <p className="mt-1 text-[11px] text-red-600">{errs.city}</p> : null}
        </div>
        <div>
          <label className="label-field" htmlFor="r-state">State <span className="text-red-600">*</span></label>
          <select
            id="r-state"
            value={stateVal}
            onChange={(e) => setStateVal(e.target.value)}
            className={`input-clean ${errClass("state")}`}
          >
            <option value="">Select state</option>
            {STATES_UT.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {show("state") ? <p className="mt-1 text-[11px] text-red-600">{errs.state}</p> : null}
        </div>
      </div>

      <div>
        <label className="label-field" htmlFor="r-order">Order ID <span className="text-muted">(optional — pre-filled from your WhatsApp link)</span></label>
        <input
          id="r-order"
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="e.g. order_Tpz8es…"
          className="input-clean border-hairline"
        />
        <p className="mt-1 text-[11px] text-muted">
          If your order ID matches ours, your review gets a &quot;verified purchaser&quot; badge.
        </p>
      </div>

      {/* T&C */}
      <div className={`rounded-xl border p-3 ${termsTouched && !termsAccepted ? "border-red-300 bg-red-50/40" : "border-hairline bg-paper"}`}>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => { setTermsAccepted(e.target.checked); setTermsTouched(true); }}
            className="mt-0.5 h-4 w-4 shrink-0 accent-gold-deep"
          />
          <span className="text-[12px] leading-relaxed text-ink-soft">
            I confirm this is my honest, unincentivised review. I am 18 years or older. I understand reviews are moderated and may be published on the Arata Nutraceuticals website along with my first name, city and state. I agree to the{" "}
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-gold-deep">Terms</a>{" "}and{" "}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gold-deep">Privacy Policy</a>.
            <span className="text-red-600"> *</span>
          </span>
        </label>
        {termsTouched && !termsAccepted ? (
          <p className="mt-2 pl-7 text-[11px] text-red-600">Please accept to continue.</p>
        ) : null}
      </div>

      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-[12px] text-red-700">{error}</p>
      ) : null}

      <div className="flex flex-col gap-2 pt-1">
        <button
          type="submit"
          disabled={busy || !isValid}
          className="inline-flex w-full items-center justify-center rounded-full bg-ink px-6 py-3 text-[15px] font-semibold text-canvas transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? "Submitting…" : "Submit review"}
        </button>
      </div>
    </form>
  );
}
