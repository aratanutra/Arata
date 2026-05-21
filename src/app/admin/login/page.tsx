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
    <div className="grid min-h-screen place-items-center bg-obsidian px-6">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold/40 font-display text-2xl text-gold">
            Æ
          </div>
          <h1 className="mt-6 font-display text-4xl text-gold-gradient">Aeternyx Admin</h1>
          <p className="mt-2 font-accent text-[10px] uppercase tracking-widest text-text-secondary">
            ARATA Nutraceuticals  •  Content Console
          </p>
        </div>

        <form onSubmit={onSubmit} className="luxe-card mt-10 space-y-5 p-8">
          <div>
            <label className="label-luxe">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-luxe"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="label-luxe">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-luxe"
              autoComplete="current-password"
            />
          </div>

          {error ? (
            <p className="font-accent text-[10px] uppercase tracking-widest text-red-400">
              {error}
            </p>
          ) : null}

          <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-60">
            {loading ? "Authenticating…" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center font-body text-xs text-text-secondary">
          Credentials configured via <code className="text-gold">.env.local</code>
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
