import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

/**
 * Compare a plaintext attempt against the configured admin password.
 *
 * Preferred: ADMIN_PASSWORD_HASH — a bcrypt hash. Generate one locally:
 *   node -e "console.log(require('bcryptjs').hashSync('yourpass', 12))"
 *
 * Legacy: ADMIN_PASSWORD — plaintext, used only when the hash isn't set,
 * with a runtime warning so it's obvious we should migrate.
 */
async function verifyAdminPassword(input: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (hash) {
    try {
      return await bcrypt.compare(input, hash);
    } catch {
      return false;
    }
  }
  const plain = process.env.ADMIN_PASSWORD?.trim();
  if (plain) {
    if (!process.env.ADMIN_PASSWORD_HASH) {
      console.warn(
        "[auth] Using ADMIN_PASSWORD (plaintext). Switch to ADMIN_PASSWORD_HASH — see README."
      );
    }
    // Constant-time compare so string length or early divergence can't leak.
    const a = Buffer.from(input, "utf8");
    const b = Buffer.from(plain, "utf8");
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
    return diff === 0;
  }
  return false;
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL;
        if (!adminEmail) return null;
        if (!credentials?.email || !credentials?.password) return null;

        const emailMatch =
          credentials.email.trim().toLowerCase() ===
          adminEmail.trim().toLowerCase();
        if (!emailMatch) return null;

        const passwordMatch = await verifyAdminPassword(credentials.password);
        if (!passwordMatch) return null;

        return { id: "admin", name: "AETERNYX Admin", email: adminEmail };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = "admin";
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as { role?: string }).role = token.role as string | undefined;
      return session;
    }
  }
};
