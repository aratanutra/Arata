"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callback = params.get("callbackUrl") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: callback
    });
    setLoading(false);
    if (!res || res.error) {
      setError("Invalid credentials.");
      return;
    }
    router.push(callback);
    router.refresh();
  }

  return (
    <div className="grid min-h-screen place-items-center bg-mist px-6">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-ink text-base font-semibold text-canvas">
            Æ
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-ink">Aeternyx Admin</h1>
          <p className="mt-2 text-[11px] font-medium uppercase tracking-widest text-muted">
            Arata Nutraceuticals · Content Console
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-10 space-y-5 rounded-2xl border border-hairline bg-canvas p-8 shadow-card">
          <div>
            <label className="label-field">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-clean"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="label-field">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-clean"
              autoComplete="current-password"
            />
          </div>

          {error ? (
            <p className="text-[11px] font-medium uppercase tracking-widest text-red-500">{error}</p>
          ) : null}

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? "Authenticating…" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-[12px] text-muted">
          Credentials configured via <code className="rounded bg-canvas px-1.5 py-0.5 text-ink">.env.local</code>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
