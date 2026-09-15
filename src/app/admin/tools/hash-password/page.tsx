import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import HashPasswordForm from "./HashPasswordForm";

export const dynamic = "force-dynamic";

export default async function HashPasswordPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const usingHash = Boolean(process.env.ADMIN_PASSWORD_HASH);
  const usingPlain = !usingHash && Boolean(process.env.ADMIN_PASSWORD);

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <header className="border-b border-hairline pb-6">
        <p className="text-[10px] uppercase tracking-widest text-gold-deep">
          Arata Nutraceuticals · Admin Tools
        </p>
        <h1 className="mt-2 text-3xl text-ink">Generate admin password hash</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Enter a plaintext password to receive its bcrypt hash. Paste the hash into Netlify as
          <code className="mx-1 rounded bg-canvas px-1.5 py-0.5 text-[12px] text-ink">ADMIN_PASSWORD_HASH</code>
          and delete the old <code className="mx-1 rounded bg-canvas px-1.5 py-0.5 text-[12px] text-ink">ADMIN_PASSWORD</code>. Redeploy so both changes take effect.
        </p>
        <div className="mt-4 flex items-center gap-3 text-[11px] uppercase tracking-widest">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 font-semibold ${
              usingHash
                ? "bg-emerald-100 text-emerald-800"
                : "bg-hairline/60 text-ink-soft"
            }`}
          >
            {usingHash ? "Currently using: HASH" : usingPlain ? "Currently using: PLAINTEXT (migrate)" : "No credential set"}
          </span>
          <Link href="/admin" className="ml-auto text-muted hover:text-ink">
            ← Content Studio
          </Link>
        </div>
      </header>

      <HashPasswordForm />
    </main>
  );
}
