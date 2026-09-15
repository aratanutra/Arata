"use client";

import { useState } from "react";

export default function HashPasswordForm() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hash, setHash] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setHash(null);
    setCopied(false);
    try {
      const res = await fetch("/api/admin/hash-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const body = (await res.json().catch(() => ({}))) as { hash?: string; error?: string };
      if (!res.ok || !body.hash) throw new Error(body.error ?? "Could not generate hash.");
      setHash(body.hash);
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleCopy() {
    if (!hash) return;
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore — user can select + copy manually
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div>
        <label className="label-field" htmlFor="hash-pw">
          New admin password
        </label>
        <div className="flex items-stretch gap-2">
          <input
            id="hash-pw"
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            maxLength={200}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-clean flex-1"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="rounded-lg border border-hairline px-3 text-[11px] uppercase tracking-widest text-muted hover:border-ink hover:text-ink"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <p className="mt-1 text-[11px] text-muted">
          Minimum 8 characters. This value never leaves the server — only its bcrypt hash is
          returned to your browser.
        </p>
      </div>

      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-[12px] text-red-700">{error}</p>
      ) : null}

      <div>
        <button
          type="submit"
          disabled={busy || password.length < 8}
          className="btn-primary w-full disabled:cursor-wait disabled:opacity-60"
        >
          {busy ? "Hashing…" : "Generate hash"}
        </button>
      </div>

      {hash ? (
        <div className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-emerald-800">
            Your ADMIN_PASSWORD_HASH
          </div>
          <textarea
            readOnly
            value={hash}
            rows={2}
            className="input-clean w-full font-mono text-[12px]"
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="btn-secondary text-[13px]"
            >
              {copied ? "✓ Copied" : "Copy hash"}
            </button>
            <p className="text-[11px] leading-relaxed text-emerald-900">
              Now: Netlify → Environment variables → Add <code>ADMIN_PASSWORD_HASH</code> (Secret,
              Runtime scope) → paste. Delete the old <code>ADMIN_PASSWORD</code>. Trigger a deploy.
            </p>
          </div>
        </div>
      ) : null}
    </form>
  );
}
