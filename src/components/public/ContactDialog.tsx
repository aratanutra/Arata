"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

type Props = { contactForm: SiteContent["contactForm"] };

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "submitted"; mode: "endpoint" | "mailto" }
  | { kind: "error"; msg: string };

export default function ContactDialog({ contactForm }: Props) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<string>(contactForm.types[0]?.id ?? "general");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [clinic, setClinic] = useState("");
  const [address, setAddress] = useState("");
  const [qty, setQty] = useState("1");
  const [message, setMessage] = useState("");
  const [submit, setSubmit] = useState<SubmitState>({ kind: "idle" });

  useEffect(() => {
    function sync() {
      const isContact = window.location.hash === "#contact";
      setOpen(isContact);
      if (isContact) setSubmit({ kind: "idle" });
    }
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    setOpen(false);
    if (typeof window !== "undefined" && window.location.hash === "#contact") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }

  const needsSpecialty = type === "prescriber" || type === "sample";
  const needsShipping = type === "sample";

  const summary = useMemo(() => {
    const lines: string[] = [];
    lines.push(`Enquiry type: ${contactForm.types.find((t) => t.id === type)?.label ?? type}`);
    if (name) lines.push(`Name: ${name}`);
    if (email) lines.push(`Email: ${email}`);
    if (phone) lines.push(`Phone: ${phone}`);
    if (needsSpecialty && specialty) lines.push(`Specialty / Practice: ${specialty}`);
    if (needsSpecialty && clinic) lines.push(`Clinic / Hospital: ${clinic}`);
    if (needsShipping && address) lines.push(`Shipping address: ${address}`);
    if (needsShipping && qty) lines.push(`Quantity: ${qty}`);
    if (message) lines.push(`\nMessage:\n${message}`);
    return lines.join("\n");
  }, [contactForm.types, type, name, email, phone, needsSpecialty, specialty, clinic, needsShipping, address, qty, message]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmit({ kind: "submitting" });
    const payload = {
      type,
      name,
      email,
      phone,
      specialty: needsSpecialty ? specialty : "",
      clinic: needsSpecialty ? clinic : "",
      address: needsShipping ? address : "",
      qty: needsShipping ? qty : "",
      message
    };

    const endpoint = contactForm.endpointUrl?.trim();
    if (endpoint) {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(`Endpoint responded ${res.status}`);
        setSubmit({ kind: "submitted", mode: "endpoint" });
        return;
      } catch (err) {
        // fall through to mailto
        // eslint-disable-next-line no-console
        console.warn("Contact endpoint failed, falling back to mailto:", err);
      }
    }

    // Mailto fallback works without a backend
    const subject = encodeURIComponent(
      `[${contactForm.types.find((t) => t.id === type)?.label ?? "Enquiry"}] from ${name || "website"}`
    );
    const body = encodeURIComponent(summary);
    window.location.href = `mailto:${contactForm.fallbackEmail}?subject=${subject}&body=${body}`;
    setSubmit({ kind: "submitted", mode: "mailto" });
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-ink/40 p-4 backdrop-blur-sm"
          onClick={close}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-canvas shadow-card-hover"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-hairline px-6 py-5 md:px-8">
              <div>
                <h3 className="text-xl font-semibold tracking-tight text-ink md:text-2xl">
                  {contactForm.title}
                </h3>
                <p className="mt-1 text-[14px] leading-relaxed text-muted">
                  {contactForm.description}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-hairline text-muted transition-colors hover:border-ink hover:text-ink"
              >
                ×
              </button>
            </div>

            {submit.kind === "submitted" ? (
              <div className="px-8 py-12 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-sage-soft text-2xl text-sage-deep">
                  ✓
                </div>
                <h4 className="mt-5 text-xl font-semibold tracking-tight text-ink">
                  {submit.mode === "mailto" ? "Email draft opened" : "Message received"}
                </h4>
                <p className="mt-2 max-w-sm mx-auto text-[14px] leading-relaxed text-muted">
                  {submit.mode === "mailto"
                    ? `Your mail client has opened a pre-filled message to ${contactForm.fallbackEmail}. Just hit send.`
                    : "Thank you. We will respond within two business days."}
                </p>
                <button type="button" onClick={close} className="btn-secondary mt-8">
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="max-h-[70vh] overflow-y-auto px-6 py-6 md:px-8 md:py-8 space-y-5">
                <div>
                  <label className="label-field">What is this about?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {contactForm.types.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setType(t.id)}
                        className={`rounded-xl border px-3 py-3 text-left text-[13px] font-medium transition-all ${
                          type === t.id
                            ? "border-ink bg-ink text-canvas"
                            : "border-hairline bg-canvas text-ink hover:border-ink"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="label-field">Full name</label>
                    <input className="input-clean" required value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div>
                    <label className="label-field">Email</label>
                    <input
                      type="email"
                      className="input-clean"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="label-field">Phone (optional)</label>
                  <input className="input-clean" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>

                {needsSpecialty ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="label-field">Specialty / Practice</label>
                      <input
                        className="input-clean"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="label-field">Clinic / Hospital</label>
                      <input
                        className="input-clean"
                        value={clinic}
                        onChange={(e) => setClinic(e.target.value)}
                      />
                    </div>
                  </div>
                ) : null}

                {needsShipping ? (
                  <>
                    <div>
                      <label className="label-field">Shipping address</label>
                      <textarea
                        className="input-clean resize-y"
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street, city, state, PIN code"
                      />
                    </div>
                    <div>
                      <label className="label-field">Quantity</label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        className="input-clean w-32"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                      />
                      <p className="mt-2 text-[12px] text-muted">
                        Samples are courier-shipped to verified practitioners only. We may follow up to confirm credentials.
                      </p>
                    </div>
                  </>
                ) : null}

                <div>
                  <label className="label-field">Message</label>
                  <textarea
                    className="input-clean resize-y"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Anything else we should know."
                  />
                </div>

                {submit.kind === "error" ? (
                  <p className="text-[12px] font-medium uppercase tracking-widest text-red-500">{submit.msg}</p>
                ) : null}

                <div className="flex items-center justify-between gap-4 pt-2">
                  <p className="text-[12px] text-muted">
                    Or write directly to{" "}
                    <a href={`mailto:${contactForm.fallbackEmail}`} className="text-sage hover:text-sage-deep">
                      {contactForm.fallbackEmail}
                    </a>
                  </p>
                  <button
                    type="submit"
                    disabled={submit.kind === "submitting"}
                    className="btn-primary disabled:opacity-60"
                  >
                    {submit.kind === "submitting" ? "Sending…" : "Send enquiry"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
