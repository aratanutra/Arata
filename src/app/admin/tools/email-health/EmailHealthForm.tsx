"use client";

import { useState } from "react";

type Result =
  | { ok: true; id?: string }
  | { ok: false; error: string }
  | null;

export default function EmailHealthForm() {
  const [to, setTo] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/email/health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: to.trim() })
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        id?: string;
        error?: string;
      };
      if (res.ok && body.ok) setResult({ ok: true, id: body.id });
      else setResult({ ok: false, error: body.error ?? `HTTP ${res.status}` });
    } catch (err) {
      setResult({ ok: false, error: err instanceof Error ? err.message : "Failed" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-hairline bg-paper p-5">
      <label className="label-field" htmlFor="test-to">
        Send test to
      </label>
      <input
        id="test-to"
        type="email"
        required
        value={to}
        onChange={(e) => setTo(e.target.value)}
        placeholder="your-personal@gmail.com"
        className="input-clean border-hairline"
      />
      <p className="text-[11px] text-muted">
        Try your personal Gmail + another provider (Outlook / Yahoo) to spot deliverability issues.
      </p>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={busy || !to}
          className="btn-primary text-[13px] disabled:opacity-60"
        >
          {busy ? "Sending…" : "Send test"}
        </button>
        {result?.ok ? (
          <span className="text-[12px] font-semibold text-emerald-700">
            ✓ Sent. Resend id: <code>{result.id ?? "—"}</code>
          </span>
        ) : null}
        {result && !result.ok ? (
          <span className="text-[12px] font-semibold text-red-700">✗ {result.error}</span>
        ) : null}
      </div>
    </form>
  );
}
