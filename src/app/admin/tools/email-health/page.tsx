import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import EmailHealthForm from "./EmailHealthForm";

export const dynamic = "force-dynamic";

function Pill({ ok, text }: { ok: boolean; text: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${
        ok ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"
      }`}
    >
      {text}
    </span>
  );
}

export default async function EmailHealthPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const resendApiKeyPresent = Boolean(process.env.RESEND_API_KEY);
  const fromEmail = process.env.FROM_EMAIL?.trim() || "onboarding@resend.dev";
  const fromName = process.env.FROM_NAME?.trim() || "Arata Nutraceuticals";
  const replyTo = process.env.REPLY_TO_EMAIL?.trim() || "(not set)";
  const adminAlert =
    process.env.ADMIN_ALERT_EMAIL?.trim() || process.env.ADMIN_EMAIL?.trim() || "(not set)";
  const usingDefaultFrom = fromEmail.endsWith("resend.dev");

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <header className="border-b border-hairline pb-6">
        <p className="text-[10px] uppercase tracking-widest text-gold-deep">
          Arata Nutraceuticals · Admin Tools
        </p>
        <h1 className="mt-2 text-3xl text-ink">Email delivery health</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Diagnose why customer confirmation / shipping emails may not be arriving.
          Send a test email to any address to verify end-to-end delivery through Resend.
        </p>
        <div className="mt-4">
          <Link href="/admin/orders" className="text-[11px] uppercase tracking-widest text-muted hover:text-ink">
            ← Back to orders
          </Link>
        </div>
      </header>

      {/* Config snapshot */}
      <section className="mt-8 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-gold-deep">
          Current configuration
        </h2>
        <dl className="space-y-3 rounded-2xl border border-hairline bg-paper p-5 text-[13px]">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted">RESEND_API_KEY</dt>
            <dd>
              <Pill ok={resendApiKeyPresent} text={resendApiKeyPresent ? "Set" : "Not set"} />
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted">From address</dt>
            <dd className="font-mono text-[12px] text-ink">
              {fromName} &lt;{fromEmail}&gt;
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted">Using default sender</dt>
            <dd>
              <Pill
                ok={!usingDefaultFrom}
                text={usingDefaultFrom ? "YES — may land in spam" : "NO (custom domain)"}
              />
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted">Reply-to</dt>
            <dd className="font-mono text-[12px] text-ink">{replyTo}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted">Admin alert recipient</dt>
            <dd className="font-mono text-[12px] text-ink">{adminAlert}</dd>
          </div>
        </dl>

        {/* Advice */}
        {!resendApiKeyPresent ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-[13px] text-red-800">
            <strong>No RESEND_API_KEY set.</strong> No customer emails are being sent. Add
            <code className="mx-1 rounded bg-white px-1.5 py-0.5 text-[12px]">RESEND_API_KEY</code>
            in Netlify → Site Settings → Environment Variables, then redeploy.
          </div>
        ) : usingDefaultFrom ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-[13px] text-amber-900">
            <strong>Using Resend&apos;s shared sender <code>onboarding@resend.dev</code>.</strong>
            {" "}This works for small volume but Gmail/Outlook will often flag it as spam
            and the daily limit is low. For launch:
            <ol className="mt-2 list-decimal pl-5 space-y-1">
              <li>Resend Dashboard → <strong>Domains</strong> → add <code>aratanutra.com</code> → copy the DNS records.</li>
              <li>Netlify → Domains → DNS records → add the SPF / DKIM / DMARC records.</li>
              <li>Wait ~5 minutes for Resend to mark the domain <em>Verified</em>.</li>
              <li>Netlify env vars → set <code>FROM_EMAIL=hello@aratanutra.com</code> (or similar) + <code>REPLY_TO_EMAIL=aratanutra@gmail.com</code>.</li>
              <li>Redeploy. Come back here and send a test to confirm.</li>
            </ol>
          </div>
        ) : (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-[13px] text-emerald-900">
            Custom sender configured. If delivery still fails, confirm the domain is marked
            <strong> Verified</strong> in Resend Dashboard → Domains.
          </div>
        )}
      </section>

      {/* Test send */}
      <section className="mt-10 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-gold-deep">
          Send a test email
        </h2>
        <EmailHealthForm />
      </section>
    </main>
  );
}
