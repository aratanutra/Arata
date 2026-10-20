import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { emailEnabled } from "@/lib/email";
import { Resend } from "resend";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Admin diagnostic: show Resend configuration + optionally send a
 * test email to a given recipient so you can verify end-to-end
 * delivery without touching an order.
 *
 * GET  /api/email/health           → config snapshot
 * POST /api/email/health { to }    → sends test email to `to`
 */

function configSnapshot() {
  const fromEmail = process.env.FROM_EMAIL?.trim() || "onboarding@resend.dev (default)";
  const fromName = process.env.FROM_NAME?.trim() || "Arata Nutraceuticals (default)";
  const replyTo = process.env.REPLY_TO_EMAIL?.trim() || "(not set)";
  const adminAlert =
    process.env.ADMIN_ALERT_EMAIL?.trim() || process.env.ADMIN_EMAIL?.trim() || "(not set)";
  return {
    emailEnabled: emailEnabled(),
    resendApiKeyPresent: Boolean(process.env.RESEND_API_KEY),
    from: `${fromName} <${fromEmail}>`,
    replyTo,
    adminAlertRecipient: adminAlert,
    usingDefaultFromDomain: fromEmail.endsWith("resend.dev"),
    advice: emailEnabled()
      ? fromEmail.endsWith("resend.dev")
        ? "Using Resend's shared sender onboarding@resend.dev. OK for small volume, but Gmail/Outlook may flag as spam. Add aratanutra.com in Resend Dashboard → Domains and set FROM_EMAIL=hello@aratanutra.com (or similar) in Netlify env vars."
        : "Custom sender configured. Verify the domain is marked 'Verified' in Resend Dashboard → Domains for best deliverability."
      : "RESEND_API_KEY is NOT set in Netlify env vars → no emails are being sent. Add it in Netlify → Site Settings → Environment Variables and redeploy."
  };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(configSnapshot());
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { to?: unknown } = {};
  try {
    body = (await req.json()) as { to?: unknown };
  } catch {
    // ignore
  }
  const to = typeof body.to === "string" ? body.to.trim() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(to)) {
    return NextResponse.json(
      { ok: false, error: "Provide a valid 'to' email in the request body." },
      { status: 400 }
    );
  }

  const snapshot = configSnapshot();
  if (!snapshot.resendApiKeyPresent) {
    return NextResponse.json(
      { ok: false, error: "RESEND_API_KEY not set.", config: snapshot },
      { status: 503 }
    );
  }

  const fromEmail = process.env.FROM_EMAIL?.trim() || "onboarding@resend.dev";
  const fromName = process.env.FROM_NAME?.trim() || "Arata Nutraceuticals";
  const from = `${fromName} <${fromEmail}>`;

  try {
    const client = new Resend(process.env.RESEND_API_KEY!);
    const res = await client.emails.send({
      from,
      to,
      subject: "Resend diagnostic — Arata Nutraceuticals admin",
      html: `<p>This is a test email from the <strong>Arata Nutraceuticals admin console</strong>.</p>
             <p>If you can read this, Resend delivery is working from <code>${from}</code>.</p>
             <p>Timestamp: ${new Date().toISOString()}</p>`,
      text: `This is a test email from the Arata Nutraceuticals admin console.
If you can read this, Resend delivery is working from ${from}.
Timestamp: ${new Date().toISOString()}`
    });
    if (res.error) {
      return NextResponse.json(
        { ok: false, error: res.error.message, config: snapshot },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true, id: res.data?.id, config: snapshot });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg, config: snapshot }, { status: 500 });
  }
}
