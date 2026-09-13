"use client";

import { useCallback, useState } from "react";

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
  /** Amount to charge in the smallest currency unit (paise for INR). Integer, ≥ 100. */
  amountPaise: number;
  currency?: string;
  /** Short receipt/reference (≤ 40 chars); a timestamped default is used when omitted. */
  receipt?: string;
  /** Optional Razorpay `notes` — surfaces in the dashboard, useful for pack ids etc. */
  notes?: Record<string, string>;
  /** Product name shown in the checkout modal. */
  productName: string;
  /** Line under the product name in the checkout modal. */
  description?: string;
  /** Brand name shown in the checkout modal header. */
  brandName?: string;
  /** Theme colour for the checkout modal — brand gold by default. */
  themeColor?: string;
  /** Prefill contact details when known. */
  prefill?: { name?: string; email?: string; contact?: string };
  /** Button label. */
  label?: string;
  /** Extra classes appended to the button. */
  className?: string;
  /** Called after `/api/razorpay/verify-payment` returns verified. */
  onVerified?: (result: RazorpaySuccess) => void;
  /** Called on user dismiss, payment.failed, or any error. */
  onFailed?: (err: { code?: string; description: string }) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: unknown) => { open: () => void; on: (event: string, cb: (payload: unknown) => void) => void };
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
  currency = "INR",
  receipt,
  notes,
  productName,
  description,
  brandName = "Arata Nutraceuticals",
  themeColor = "#B8935E",
  prefill,
  label = "Pay & buy now",
  className = "",
  onVerified,
  onFailed
}: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error("Unable to load Razorpay checkout. Check your network and try again.");

      // 1) Create an order on the server.
      const createRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountPaise, currency, receipt, notes })
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
        prefill,
        modal: {
          ondismiss: () => {
            setBusy(false);
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
            onVerified?.(resp);
          } catch (err) {
            const msg = err instanceof Error ? err.message : "Verification failed.";
            setError(msg);
            onFailed?.({ description: msg });
          } finally {
            setBusy(false);
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
        setError(desc);
        setBusy(false);
        onFailed?.({ code, description: desc });
      });
      rzp.open();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Payment could not be started.";
      setError(msg);
      setBusy(false);
      onFailed?.({ description: msg });
    }
  }, [
    amountPaise,
    brandName,
    busy,
    currency,
    description,
    notes,
    onFailed,
    onVerified,
    prefill,
    productName,
    receipt,
    themeColor
  ]);

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        aria-busy={busy}
        className={`inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-[15px] font-semibold text-canvas transition-all duration-200 hover:brightness-110 hover:shadow-card-hover disabled:cursor-wait disabled:opacity-70 ${className}`}
      >
        {busy ? "Opening secure checkout…" : label}
      </button>
      {error ? (
        <p className="mt-2 text-[12px] leading-relaxed text-red-600">{error}</p>
      ) : null}
    </>
  );
}
