/**
 * Transactional email — sends via Resend when RESEND_API_KEY is set.
 * All senders are best-effort: if email is unconfigured or fails, we
 * log and continue. The customer never sees an email failure block a
 * payment or fulfilment action.
 *
 * Sender domain: for production, verify your own domain in Resend
 * (Dashboard → Domains) and set FROM_EMAIL to e.g. orders@aratanutra.com.
 * Until then, we fall back to Resend's shared onboarding@resend.dev
 * which is fine for staging but not for production reputation.
 */

import { Resend } from "resend";
import type { StoredOrder } from "./orders";

const DEFAULT_FROM = "onboarding@resend.dev";
const DEFAULT_FROM_NAME = "Arata Nutraceuticals";

function fromHeader(): string {
  const email = process.env.FROM_EMAIL?.trim() || DEFAULT_FROM;
  const name = process.env.FROM_NAME?.trim() || DEFAULT_FROM_NAME;
  return `${name} <${email}>`;
}

function replyTo(): string | undefined {
  return process.env.REPLY_TO_EMAIL?.trim() || undefined;
}

function adminInbox(): string {
  return (
    process.env.ADMIN_ALERT_EMAIL?.trim() ||
    process.env.ADMIN_EMAIL?.trim() ||
    ""
  );
}

export function emailEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function client(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY not set");
  return new Resend(key);
}

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function shell(inner: string): string {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#F7F3E8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#14243F;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;margin:0 auto;padding:32px 20px;">
      <tr><td>
        <div style="text-align:center;margin-bottom:32px;">
          <div style="font-size:12px;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:#8A6318;">Arata Nutraceuticals</div>
          <div style="font-size:24px;font-weight:700;letter-spacing:0.05em;color:#B8935E;margin-top:4px;">AETERNYX<span style="font-size:14px;">®</span></div>
        </div>
        ${inner}
        <div style="margin-top:40px;padding-top:20px;border-top:1px solid rgba(20,36,63,0.12);text-align:center;font-size:11px;line-height:1.6;color:rgba(20,36,63,0.6);">
          <div>Arata Nutraceuticals · Hyderabad, Telangana, India</div>
          <div style="margin-top:4px;">Questions? WhatsApp us at +91 99599 93973 or reply to this email.</div>
        </div>
      </td></tr>
    </table>
  </body></html>`;
}

function addressBlock(order: StoredOrder): string {
  const c = order.customer;
  const line2 = c.address2 ? `<br>${escapeHtml(c.address2)}` : "";
  return `<div style="font-size:14px;line-height:1.6;">
    ${escapeHtml(c.name)}<br>
    ${escapeHtml(c.address1)}${line2}<br>
    ${escapeHtml(c.city)}, ${escapeHtml(c.state)} — ${escapeHtml(c.pincode)}<br>
    ${escapeHtml(c.phone)}
  </div>`;
}

function orderConfirmationTemplate(order: StoredOrder): {
  subject: string;
  html: string;
  text: string;
} {
  const total = inr.format(order.amount / 100);
  const productPrice = inr.format(order.breakdown.productPaise / 100);
  const shipping =
    order.breakdown.shippingPaise > 0
      ? inr.format(order.breakdown.shippingPaise / 100)
      : "Free";
  const subject = `Order confirmed — AETERNYX® ${order.pack.label} · ${total}`;
  const html = shell(`
    <h1 style="margin:0 0 12px;font-size:22px;">Thank you, ${escapeHtml(order.customer.name.split(" ")[0] ?? order.customer.name)}!</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;">
      Your AETERNYX® order is confirmed. We'll ship it within 5 business days and share tracking as soon as it's on the way.
    </p>

    <div style="background:#FFFDF6;border:1px solid rgba(184,147,94,0.25);border-radius:14px;padding:18px 20px;margin-bottom:24px;">
      <div style="font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:#8A6318;margin-bottom:8px;">Order summary</div>
      <div style="font-size:15px;font-weight:600;margin-bottom:2px;">${escapeHtml(order.pack.label)}${order.pack.sublabel ? ` <span style="font-weight:400;color:rgba(20,36,63,0.65);">· ${escapeHtml(order.pack.sublabel)}</span>` : ""}</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;font-size:14px;">
        <tr><td style="padding:2px 0;color:rgba(20,36,63,0.7);">Product</td><td align="right" style="padding:2px 0;">${productPrice}</td></tr>
        <tr><td style="padding:2px 0;color:rgba(20,36,63,0.7);">Shipping</td><td align="right" style="padding:2px 0;">${shipping}</td></tr>
        <tr><td style="padding:8px 0 0;border-top:1px solid rgba(20,36,63,0.1);font-weight:600;">Total paid</td><td align="right" style="padding:8px 0 0;border-top:1px solid rgba(20,36,63,0.1);font-weight:600;">${total}</td></tr>
      </table>
    </div>

    <div style="margin-bottom:24px;">
      <div style="font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:#8A6318;margin-bottom:8px;">Shipping to</div>
      ${addressBlock(order)}
    </div>

    <div style="font-size:12px;color:rgba(20,36,63,0.6);line-height:1.7;">
      Order ID: <span style="font-family:monospace;">${escapeHtml(order.orderId)}</span><br>
      ${order.paymentId ? `Payment ID: <span style="font-family:monospace;">${escapeHtml(order.paymentId)}</span>` : ""}
    </div>
  `);
  const text = [
    `Thank you, ${order.customer.name}!`,
    ``,
    `Your AETERNYX® order is confirmed. We'll ship within 5 business days.`,
    ``,
    `Order summary`,
    `- ${order.pack.label}${order.pack.sublabel ? ` · ${order.pack.sublabel}` : ""}`,
    `- Product: ${productPrice}`,
    `- Shipping: ${shipping}`,
    `- Total paid: ${total}`,
    ``,
    `Shipping to`,
    `${order.customer.name}`,
    `${order.customer.address1}${order.customer.address2 ? `, ${order.customer.address2}` : ""}`,
    `${order.customer.city}, ${order.customer.state} — ${order.customer.pincode}`,
    `${order.customer.phone}`,
    ``,
    `Order ID: ${order.orderId}`,
    order.paymentId ? `Payment ID: ${order.paymentId}` : "",
    ``,
    `Questions? WhatsApp +91 99599 93973 or reply to this email.`,
    `— Arata Nutraceuticals`
  ]
    .filter(Boolean)
    .join("\n");
  return { subject, html, text };
}

function adminAlertTemplate(order: StoredOrder): {
  subject: string;
  html: string;
  text: string;
} {
  const total = inr.format(order.amount / 100);
  const subject = `NEW ORDER · ${order.customer.name} · ${total} · ${order.pack.label}`;
  const html = shell(`
    <h1 style="margin:0 0 12px;font-size:22px;">New AETERNYX® order</h1>
    <p style="margin:0 0 24px;font-size:14px;color:rgba(20,36,63,0.7);">
      A customer just paid. Details below — full record in the admin.
    </p>
    <div style="background:#FFFDF6;border:1px solid rgba(184,147,94,0.25);border-radius:14px;padding:18px 20px;margin-bottom:24px;font-size:14px;line-height:1.7;">
      <div style="font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:#8A6318;margin-bottom:8px;">Customer</div>
      ${escapeHtml(order.customer.name)}<br>
      ${escapeHtml(order.customer.email)} · ${escapeHtml(order.customer.phone)}
    </div>
    <div style="background:#FFFDF6;border:1px solid rgba(184,147,94,0.25);border-radius:14px;padding:18px 20px;margin-bottom:24px;font-size:14px;line-height:1.6;">
      <div style="font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:#8A6318;margin-bottom:8px;">Ship to</div>
      ${addressBlock(order)}
    </div>
    <div style="background:#FFFDF6;border:1px solid rgba(184,147,94,0.25);border-radius:14px;padding:18px 20px;margin-bottom:24px;font-size:14px;line-height:1.7;">
      <div style="font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:#8A6318;margin-bottom:8px;">Order</div>
      Pack: ${escapeHtml(order.pack.label)}${order.pack.sublabel ? ` · ${escapeHtml(order.pack.sublabel)}` : ""}<br>
      Amount: ${total}<br>
      Order ID: <span style="font-family:monospace;font-size:13px;">${escapeHtml(order.orderId)}</span><br>
      ${order.paymentId ? `Payment ID: <span style="font-family:monospace;font-size:13px;">${escapeHtml(order.paymentId)}</span>` : ""}
    </div>
    <div style="text-align:center;margin-top:16px;">
      <a href="https://aratanutra.com/admin/orders" style="display:inline-block;padding:12px 24px;background:#14243F;color:#F7F3E8;border-radius:999px;font-size:14px;font-weight:600;text-decoration:none;">Open Admin Orders</a>
    </div>
  `);
  const text = [
    `NEW AETERNYX® ORDER`,
    ``,
    `Customer: ${order.customer.name}`,
    `${order.customer.email} · ${order.customer.phone}`,
    ``,
    `Ship to:`,
    `${order.customer.address1}${order.customer.address2 ? `, ${order.customer.address2}` : ""}`,
    `${order.customer.city}, ${order.customer.state} — ${order.customer.pincode}`,
    ``,
    `Pack: ${order.pack.label}${order.pack.sublabel ? ` · ${order.pack.sublabel}` : ""}`,
    `Amount: ${total}`,
    `Order ID: ${order.orderId}`,
    order.paymentId ? `Payment ID: ${order.paymentId}` : "",
    ``,
    `Admin: https://aratanutra.com/admin/orders`
  ]
    .filter(Boolean)
    .join("\n");
  return { subject, html, text };
}

function shippingNotificationTemplate(order: StoredOrder): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `Your AETERNYX® order is on the way`;
  const trackingBlock = order.trackingUrl
    ? `<div style="background:#FFFDF6;border:1px solid rgba(184,147,94,0.25);border-radius:14px;padding:18px 20px;margin-bottom:24px;">
        <div style="font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:#8A6318;margin-bottom:8px;">Track your order</div>
        ${order.courier ? `<div style="font-size:13px;color:rgba(20,36,63,0.7);margin-bottom:8px;">Courier: ${escapeHtml(order.courier)}</div>` : ""}
        <a href="${escapeHtml(order.trackingUrl)}" style="display:inline-block;padding:10px 20px;background:#14243F;color:#F7F3E8;border-radius:999px;font-size:14px;font-weight:600;text-decoration:none;">Open tracking</a>
        <div style="margin-top:12px;font-size:11px;word-break:break-all;color:rgba(20,36,63,0.55);">${escapeHtml(order.trackingUrl)}</div>
       </div>`
    : `<div style="background:#FFFDF6;border:1px solid rgba(184,147,94,0.25);border-radius:14px;padding:18px 20px;margin-bottom:24px;font-size:14px;line-height:1.6;">
        We'll share the tracking link as soon as the courier picks up your parcel.
       </div>`;
  const html = shell(`
    <h1 style="margin:0 0 12px;font-size:22px;">On the way, ${escapeHtml(order.customer.name.split(" ")[0] ?? order.customer.name)} —</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;">
      Your AETERNYX® ${escapeHtml(order.pack.label)} has just shipped. Expect delivery within 3–7 business days across India.
    </p>
    ${trackingBlock}
    <div style="font-size:12px;color:rgba(20,36,63,0.6);line-height:1.7;">
      Order ID: <span style="font-family:monospace;">${escapeHtml(order.orderId)}</span>
    </div>
  `);
  const text = [
    `Hi ${order.customer.name},`,
    ``,
    `Your AETERNYX® ${order.pack.label} has shipped. Delivery in 3-7 business days.`,
    ``,
    order.trackingUrl
      ? `Tracking: ${order.trackingUrl}${order.courier ? ` (${order.courier})` : ""}`
      : `We'll share the tracking link as soon as the courier picks up your parcel.`,
    ``,
    `Order ID: ${order.orderId}`,
    ``,
    `Questions? WhatsApp +91 99599 93973 or reply to this email.`,
    `— Arata Nutraceuticals`
  ].join("\n");
  return { subject, html, text };
}

async function safeSend(
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!to) return { ok: false, error: "no recipient" };
  try {
    const res = await client().emails.send({
      from: fromHeader(),
      to,
      replyTo: replyTo(),
      subject,
      html,
      text
    });
    if (res.error) {
      console.error("[email.send]", res.error);
      return { ok: false, error: res.error.message };
    }
    return { ok: true, id: res.data?.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[email.send.throw]", msg);
    return { ok: false, error: msg };
  }
}

export async function sendOrderConfirmation(order: StoredOrder) {
  if (!emailEnabled()) return { ok: false, skipped: true as const };
  const { subject, html, text } = orderConfirmationTemplate(order);
  return safeSend(order.customer.email, subject, html, text);
}

export async function sendAdminNewOrderAlert(order: StoredOrder) {
  if (!emailEnabled()) return { ok: false, skipped: true as const };
  const inbox = adminInbox();
  if (!inbox) return { ok: false, error: "ADMIN_ALERT_EMAIL/ADMIN_EMAIL not set" };
  const { subject, html, text } = adminAlertTemplate(order);
  return safeSend(inbox, subject, html, text);
}

export async function sendShippingNotification(order: StoredOrder) {
  if (!emailEnabled()) return { ok: false, skipped: true as const };
  const { subject, html, text } = shippingNotificationTemplate(order);
  return safeSend(order.customer.email, subject, html, text);
}
