# Aeternyx™ — Arata Nutraceuticals

Production-grade Next.js 14 (App Router) marketing site for **Aeternyx™**, a physician-formulated longevity supplement by **Arata Nutraceuticals**.

> *Cellular Intelligence.* One capsule. Ten bioactives. Five aging pathways. ₹2,500 / month.

---

## Stack

- **Next.js 14** App Router, React 18, TypeScript
- **Tailwind CSS** with bespoke clinical light tokens (canvas / mist / ink / sage)
- **Inter** (Google Fonts) — single typeface
- **Framer Motion** for scroll-driven and modal animations
- **NextAuth (Credentials)** for the admin gate
- **Flat-file JSON** content store at `/content/site-content.json` — no DB required
- **Netlify** for hosting (full Next.js — admin, API routes, image upload all work)

## Pages

- `/` — full marketing site (Nav, Hero, Trust Bar, Product, Ingredients, Science, Benefits, Philosophy, Prescription, Blog, Newsletter, Footer)
- `/journal/[slug]` — full article view for every published blog post
- `/admin` — password-protected content studio (one editor card per section, image uploader, ingredients table editor, blog CRUD, contact-form configuration)
- `/admin/login` — admin sign-in

## Contact form

Any link with `href="#contact"` opens a modal containing your Google Form (embedded as an iframe). The form URL is configurable from the **Admin → Contact Form** section. When no URL is set, the modal shows the fallback email (`brand.email` in JSON).

Currently wired to `#contact`:
- Footer "Contact" link
- Product "Speak to a Physician" CTA
- "Press Kit", "Clinical Dossier", "Sample Request" footer links

To plug in your form: paste the regular `/viewform` URL — we append `?embedded=true` automatically.

## Getting started

```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.example .env.local
# then edit .env.local with admin credentials and a NEXTAUTH_SECRET
#   openssl rand -base64 32   →   NEXTAUTH_SECRET

# 3. Run dev
npm run dev
```

Visit:

- Site: <http://localhost:3000>
- Admin: <http://localhost:3000/admin> (redirects to login)

## Environment

`.env.local` (never committed):

```dotenv
ADMIN_EMAIL=admin@aratanutra.com
# Preferred — bcrypt hash. Generate one locally:
#   node -e "console.log(require('bcryptjs').hashSync('yourpass', 12))"
ADMIN_PASSWORD_HASH=$2a$12$....
# Legacy fallback (plaintext) — only used if ADMIN_PASSWORD_HASH is unset.
# Auth logs a warning when this path is taken.
# ADMIN_PASSWORD=change-me
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
```

## Content model

All editable copy and image paths live in `/content/site-content.json`. The public site reads this file at request time; the admin panel writes back to it via `POST /api/content` (NextAuth-gated). Uploaded images land in `/public/uploads/`.

To edit content **without** the admin UI: hand-edit `content/site-content.json` and commit.

## Deployment — Netlify

1. Push to GitHub (already done — repo: `aratanutra/Arata`).
2. In Netlify, **Add new site → Import from GitHub** → pick this repo.
3. Build command: `npm run build` · Publish directory: `.next` (already in `netlify.toml`).
4. **Site settings → Environment variables** — add:
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD_HASH` (preferred; bcrypt) — or `ADMIN_PASSWORD` (legacy plaintext, fallback only)
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your Netlify URL or custom domain — e.g. `https://aratanutra.com`)
   - `RAZORPAY_KEY_ID` (test-mode: `rzp_test_...`, live: `rzp_live_...`)
   - `RAZORPAY_KEY_SECRET` (server-only — do NOT prefix with `NEXT_PUBLIC_`)
5. Deploy. Netlify auto-detects Next.js and applies `@netlify/plugin-nextjs`, so admin, API routes, and middleware all work.

### Staging / branch deploys (test payments without burning live fees)

Netlify runs a full deploy on every push. To test the checkout without charging real cards:

1. Netlify → **Site configuration → Build & deploy → Branches and deploy contexts**. Add `claude/aeternyx-nextjs-site-WXBgB` (or any working branch) under **Branch deploys**. Netlify starts serving that branch at `<branch>--<sitename>.netlify.app`.
2. **Environment variables** → for both `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`, switch the value type to **"Different value for each deploy context"**:
   - `Production` → `rzp_live_...` (charges real cards)
   - `Branch deploys` → `rzp_test_...` (test mode, no fees)
   - `Deploy Previews` → `rzp_test_...` (test mode)
3. On the branch URL, click Pay and use test card `4111 1111 1111 1111` · any future date · any CVV · OTP `1234`. No money moves.
4. When you're ready to publish, tell Claude to `push it` and the change lands on `main` → the production URL is what customers see.

### Security posture

- **Admin auth**: password stored as a bcrypt hash (`ADMIN_PASSWORD_HASH`); constant-time compare on the legacy plaintext path so nothing about the correct password leaks through response timing.
- **Payment integrity**: Razorpay signature verified with HMAC-SHA256 in constant time (`crypto.timingSafeEqual`).
- **Rate limiting**: in-memory sliding-window limits on `POST /api/razorpay/create-order` (10/min/IP) and `POST /api/razorpay/verify-payment` (20/min/IP). Per-instance only; for stronger guarantees front the routes with Netlify Edge Functions or Cloudflare.
- **HTTP headers**: `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` set both in `next.config.mjs` (for the Next runtime) and `netlify.toml` (for CDN-served assets). `X-Powered-By: Next.js` suppressed.
- **Content Security Policy**: intentionally not enabled yet — CSP interacts with Razorpay's inline scripts and Next.js's hydration; enabling without a staging URL to validate would risk breaking checkout. Turn on after the branch-deploy URL exists.
- **Dependency updates**: Dependabot opens PRs weekly (`.github/dependabot.yml`) for npm and GitHub Actions.
- **Code review**: `.github/CODEOWNERS` requires review on `auth.ts`, `razorpay.ts`, `ratelimit.ts`, every API route, middleware, and both deploy configs.

**Still requires a manual dashboard step (Claude can't do these):**
- GitHub → Settings → Branches → protect `main` (require PR review, disallow force pushes, require the Netlify deploy check).
- Netlify → Site configuration → deploy notifications for the security scan.
- Razorpay → Account Settings → Webhooks → configure a webhook to `https://aratanutra.com/api/razorpay/webhook` if you want async payment updates (not implemented yet — say the word).

### Razorpay checkout

- Server routes:
  - `POST /api/razorpay/create-order` — takes `{ amount, currency?, receipt?, notes? }` where `amount` is paise (integer, ≥ 100). Returns `{ orderId, amount, currency, keyId }`. `keyId` comes from the server so no `NEXT_PUBLIC_RAZORPAY_KEY_ID` is required.
  - `POST /api/razorpay/verify-payment` — HMAC-SHA256 verifies the `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }` returned by the checkout modal. Constant-time compare; returns `{ verified: true }` only on match.
- Client component: `src/components/public/RazorpayCheckoutButton.tsx` — loads `checkout.js`, calls create-order, opens the modal, verifies the signature, and reports success / dismiss / payment.failed via `onVerified` / `onFailed` callbacks.
- Wired into: `ProductHero` (the `#buy` panel on `/aeternyx`) and `HomeOrderCard` (the home order window). Only rendered when `orderStatus.blocked` is `false` — while orders are paused, the launch card takes over as before.
- Test cards: <https://razorpay.com/docs/payments/payments/test-card-details/>. A safe one for the test-mode key: `4111 1111 1111 1111` · any future date · any CVV · OTP `1234`.
- Amount charged = `selectedPack.priceNumber + selectedPack.shippingCost` (in rupees), converted to paise. Pack shipping cost lives in `content/site-content.json` under `productHero.packs[*].shippingCost` — edit there to change what customers pay.

### How admin saves persist

`/api/content` writes to **Netlify Blobs** (`src/lib/blobs.ts`) — Netlify's built-in KV store. No env var setup required: on Netlify runtime the SDK auto-discovers credentials. On save, the API route writes the JSON to Blobs and calls `revalidatePath()` for every public route that reads content, so the change is visible within seconds.

Public pages that read `readContent()` set `export const dynamic = "force-dynamic"` so each request re-reads from Blobs.

Fallback chain (in `/api/content` route):

1. **Netlify Blobs** (default in production) — chosen when `process.env.NETLIFY === "true"`.
2. **GitHub commit** — used when `GITHUB_TOKEN` is set (a fine-grained PAT with Contents: Read & write on `aratanutra/Arata`). Slower (waits for Netlify rebuild) but versions edits in git.
3. **Local filesystem** — used when neither is available (i.e. `npm run dev` without either setup).

Note: Blobs edits are **not** in git. Every deploy from `main` still ships whatever's committed in `content/site-content.json`; if the two drift and you rebuild, admin edits held only in Blobs will not be overwritten (readContent prefers Blobs) but the deploy artifact and Blobs are separate stores. For durable git-versioned edits, set `GITHUB_TOKEN` — the route will prefer that path.

Optional GitHub-path overrides (rarely needed):
- `GITHUB_REPO_OWNER` (default `aratanutra`)
- `GITHUB_REPO_NAME` (default `Arata`)
- `GITHUB_CONTENT_BRANCH` (default `main`)
- `GITHUB_CONTENT_PATH` (default `content/site-content.json`)

## Custom domain

Once `aratanutra.com` is pointed at Netlify, update `NEXTAUTH_URL` in Netlify env vars to `https://aratanutra.com` and redeploy.

## Project structure

```
content/
  site-content.json          # single source of truth for all section copy
public/
  seed/                      # default blog hero SVGs
  uploads/                   # admin-uploaded images (gitignored)
src/
  app/
    page.tsx                 # public homepage
    journal/[slug]/page.tsx  # blog post detail
    layout.tsx               # fonts + global metadata
    globals.css
    admin/
      page.tsx               # dashboard (server-rendered, auth-gated)
      layout.tsx
      login/page.tsx
    api/
      auth/[...nextauth]/    # NextAuth route
      content/               # GET / POST content JSON
      upload/                # multipart image upload
  components/
    public/                  # Nav, Hero, TrustBar, Product, Ingredients, Science,
                             # Benefits, Philosophy, Prescription, Blog,
                             # Newsletter, Footer, ContactDialog
    admin/                   # AdminDashboard + Section editors
  lib/                       # auth, content I/O, asset helper
  types/                     # SiteContent typings
netlify.toml                 # Netlify build config
```

## Scripts

```bash
npm run dev         # next dev
npm run build       # production build
npm run start       # next start
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
```

## Design tokens

| Token            | Value     |
| ---------------- | --------- |
| `canvas`         | `#FFFFFF` |
| `mist`           | `#F5F5F7` |
| `cloud`          | `#FAFAFA` |
| `hairline`       | `#D2D2D7` |
| `ink`            | `#1D1D1F` |
| `ink-soft`       | `#3C3C43` |
| `muted`          | `#6E6E73` |
| `sage`           | `#2D7A5B` |
| `sage-deep`      | `#1F5C44` |
| `sage-soft`      | `#EDF5F0` |

Font: **Inter** (300 – 800).

## License

(c) Arata Nutraceuticals. Aeternyx™ is a registered trademark.
