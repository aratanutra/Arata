"use client";

import { useState } from "react";
import CheckoutModal, { type CheckoutFormValues } from "./CheckoutModal";

type Pack = {
  id: string;
  label: string;
  sublabel?: string;
  priceNumber: number;
  shippingCost: number;
};

type Props = {
  totalRupees: number;
  productRupees: number;
  shippingRupees: number;
  pack: Pack;
  whatsappNumber: string; // digits with country code, e.g. "919959993973"
  label: string;
  className?: string;
};

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function composeMessage(args: {
  values: CheckoutFormValues;
  pack: Pack;
  productRupees: number;
  shippingRupees: number;
  totalRupees: number;
  orderId?: string;
}): string {
  const { values, pack, productRupees, shippingRupees, totalRupees, orderId } = args;
  const addressLines = [
    values.address1.trim(),
    values.address2.trim(),
    `${values.city.trim()}, ${values.state} — ${values.pincode}`
  ].filter(Boolean);

  return [
    "Hi, I'd like to order AETERNYX®",
    "",
    `Pack: ${pack.label}${pack.sublabel ? ` (${pack.sublabel})` : ""}`,
    `Product: ${inr(productRupees)}`,
    shippingRupees > 0 ? `Shipping: ${inr(shippingRupees)}` : "Shipping: Free",
    `Total: ${inr(totalRupees)}`,
    orderId ? `Order ref: ${orderId}` : "",
    "",
    "Ship to:",
    values.name.trim(),
    values.phone.trim(),
    values.email.trim(),
    ...addressLines,
    "",
    "I accept the Terms, Return Policy and Privacy Policy at aratanutra.com.",
    "Please share the payment link to confirm the order."
  ].filter(Boolean).join("\n");
}

export default function WhatsAppOrderButton({
  totalRupees,
  productRupees,
  shippingRupees,
  pack,
  whatsappNumber,
  label,
  className
}: Props) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(values: CheckoutFormValues) {
    setSubmitting(true);
    setSubmitError(null);

    // Persist the order to Blobs BEFORE opening WhatsApp so the admin
    // sees it in /admin/orders even if the customer never sends the
    // WhatsApp message (or deletes it before sending). If this fails
    // we still open WhatsApp so the customer isn't blocked — but we
    // log the failure.
    let orderId: string | undefined;
    try {
      const res = await fetch("/api/orders/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pack: {
            id: pack.id,
            label: pack.label,
            sublabel: pack.sublabel,
            priceNumber: pack.priceNumber,
            shippingCost: pack.shippingCost
          },
          customer: {
            name: values.name.trim(),
            email: values.email.trim(),
            phone: values.phone.trim(),
            address1: values.address1.trim(),
            address2: values.address2.trim() || undefined,
            city: values.city.trim(),
            state: values.state,
            pincode: values.pincode
          }
        })
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; orderId?: string; error?: string };
      if (res.ok && body.ok) {
        orderId = body.orderId;
      } else {
        // Non-blocking: log and continue to WhatsApp.
        console.error("[whatsapp-order.persist]", body.error ?? `HTTP ${res.status}`);
      }
    } catch (err) {
      console.error("[whatsapp-order.persist]", err);
    }

    const message = composeMessage({
      values,
      pack,
      productRupees,
      shippingRupees,
      totalRupees,
      orderId
    });
    const digits = whatsappNumber.replace(/\D/g, "");
    const url = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;

    // Open in a new tab so the shopper keeps the site open.
    const win = typeof window !== "undefined" ? window.open(url, "_blank", "noopener,noreferrer") : null;
    // Fallback (popup blockers): navigate the current tab.
    if (!win) {
      window.location.href = url;
    }
    setSubmitting(false);
    setOpen(false);
  }

  const summaryLines = [
    `${pack.label}${pack.sublabel ? ` · ${pack.sublabel}` : ""}`,
    `Product ${inr(productRupees)}${shippingRupees > 0 ? ` · Shipping ${inr(shippingRupees)}` : " · Free shipping"}`
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          "inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-[15px] font-semibold text-white transition-all duration-200 hover:brightness-95 hover:shadow-card-hover"
        }
      >
        <svg viewBox="0 0 32 32" className="h-5 w-5" fill="currentColor" aria-hidden>
          <path d="M16 3C9.4 3 4 8.4 4 15c0 2.4.7 4.6 1.9 6.4L4 29l7.8-1.8A11.9 11.9 0 0016 27c6.6 0 12-5.4 12-12S22.6 3 16 3zm5.5 15.2c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-.9 1.2-.4.2-.7.1c-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1s-.2-.5.1-.6c.1-.1.3-.4.5-.5s.2-.3.3-.5.1-.4 0-.5-.7-1.6-.9-2.2-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1.1 1-1.1 2.5 1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4s.3-1.3.2-1.4-.3-.2-.6-.4z" />
        </svg>
        {label}
      </button>
      <CheckoutModal
        open={open}
        title="Order AETERNYX®"
        summaryLines={summaryLines}
        totalLabel={`Total ${inr(totalRupees)}`}
        onCancel={() => setOpen(false)}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitError={submitError}
        submitLabel="Confirm order on WhatsApp"
      />
    </>
  );
}
