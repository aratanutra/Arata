"use client";

import { useCallback, useMemo, useState } from "react";
import CheckoutModal, { type CheckoutFormValues } from "./CheckoutModal";

type CreateOrderResponse = {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
};

export type RazorpaySuccess = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type Props = {
  amountPaise: number;
  productPaise: number;
  shippingPaise: number;
  currency?: string;
  receipt?: string;
  pack: { id: string; label: string; sublabel: string };
  productName: string;
  description?: string;
  brandName?: string;
  themeColor?: string;
  label?: string;
  className?: string;
  onVerified?: (result: RazorpaySuccess) => void;
  onFailed?: (err: { code?: string; description: string }) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: unknown) => {
      open: () => void;
      on: (event: string, cb: (payload: unknown) => void) => void;
    };
  }
}

const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);

  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function RazorpayCheckoutButton({
  amountPaise,
  productPaise,
  shippingPaise,
  currency = "INR",
  receipt,
  pack,
  productName,
  description,
  brandName = "Arata Nutraceuticals",
  themeColor = "#B8935E",
  label = "Buy now",
  className = "",
  onVerified,
  onFailed
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<null | { paymentId: string; orderId: string }>(null);

  const inr = useMemo(
    () =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
      }),
    []
  );

  const summaryLines = useMemo(
    () => [
      `${pack.label} · ${pack.sublabel}`,
      `Product ${inr.format(productPaise / 100)}${shippingPaise > 0 ? ` · Shipping ${inr.format(shippingPaise / 100)}` : " · Free shipping"}`
    ],
    [inr, pack.label, pack.sublabel, productPaise, shippingPaise]
  );

  const handleOpen = useCallback(() => {
    setSubmitError(null);
    setConfirmation(null);
    setModalOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (submitting) return;
    setModalOpen(false);
  }, [submitting]);

  const handleSubmit = useCallback(
    async (values: CheckoutFormValues) => {
      setSubmitting(true);
      setSubmitError(null);
      try {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded)
          throw new Error("Unable to load Razorpay checkout. Check your network and try again.");

        const createRes = await fetch("/api/razorpay/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: amountPaise,
            currency,
            receipt,
            pack,
            breakdown: { productPaise, shippingPaise },
            customer: {
              name: values.name.trim(),
              email: values.email.trim().toLowerCase(),
              phone: values.phone.replace(/\D/g, ""),
              address1: values.address1.trim(),
              address2: values.address2.trim(),
              city: values.city.trim(),
              state: values.state,
              pincode: values.pincode
            }
          })
        });
        const createBody = (await createRes.json().catch(() => ({}))) as
          | CreateOrderResponse
          | { error?: string };
        if (!createRes.ok || !("orderId" in createBody)) {
          const msg = (createBody as { error?: string }).error ?? "Could not create order.";
          throw new Error(msg);
        }

        const options = {
          key: createBody.keyId,
          amount: createBody.amount,
          currency: createBody.currency,
          order_id: createBody.orderId,
          name: brandName,
          description: description ?? productName,
          theme: { color: themeColor },
          prefill: {
            name: values.name,
            email: values.email,
            contact: values.phone
          },
          modal: {
            ondismiss: () => {
              setSubmitting(false);
              onFailed?.({ description: "Payment was cancelled." });
            }
          },
          handler: async (resp: RazorpaySuccess) => {
            try {
              const verifyRes = await fetch("/api/razorpay/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(resp)
              });
              const verifyBody = (await verifyRes.json().catch(() => ({}))) as {
                verified?: boolean;
                error?: string;
              };
              if (!verifyRes.ok || !verifyBody.verified) {
                throw new Error(verifyBody.error ?? "Payment verification failed.");
              }
              setConfirmation({ paymentId: resp.razorpay_payment_id, orderId: resp.razorpay_order_id });
              setModalOpen(false);
              onVerified?.(resp);
            } catch (err) {
              const msg = err instanceof Error ? err.message : "Verification failed.";
              setSubmitError(msg);
              onFailed?.({ description: msg });
            } finally {
              setSubmitting(false);
            }
          }
        };

        if (!window.Razorpay) throw new Error("Razorpay failed to initialise.");
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", (payload: unknown) => {
          const desc =
            (payload as { error?: { description?: string; code?: string } })?.error?.description ??
            "Payment failed.";
          const code = (payload as { error?: { description?: string; code?: string } })?.error?.code;
          setSubmitError(desc);
          setSubmitting(false);
          onFailed?.({ code, description: desc });
        });
        rzp.open();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Payment could not be started.";
        setSubmitError(msg);
        setSubmitting(false);
        onFailed?.({ description: msg });
      }
    },
    [
      amountPaise,
      brandName,
      currency,
      description,
      onFailed,
      onVerified,
      pack,
      productName,
      productPaise,
      receipt,
      shippingPaise,
      themeColor
    ]
  );

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={`inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-[15px] font-semibold text-canvas transition-all duration-200 hover:brightness-110 hover:shadow-card-hover ${className}`}
      >
        {label}
      </button>

      {confirmation ? (
        <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
          <div className="text-[11px] font-semibold uppercase tracking-widest">Payment received</div>
          <p className="mt-1 text-[13px]">
            Thank you! Your order is confirmed. We&apos;ll send tracking to you within 5 business days.
          </p>
          <p className="mt-2 text-[11px] tnum text-emerald-800">
            Payment ID: <span className="font-mono">{confirmation.paymentId}</span>
          </p>
        </div>
      ) : null}

      <CheckoutModal
        open={modalOpen}
        title={`${pack.label} — ${productName}`}
        summaryLines={summaryLines}
        totalLabel={inr.format(amountPaise / 100)}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitError={submitError}
        submitLabel={`Pay ${inr.format(amountPaise / 100)} securely`}
      />
    </>
  );
}
