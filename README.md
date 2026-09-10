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
ADMIN_PASSWORD=change-me
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
   - `ADMIN_PASSWORD`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your Netlify URL or custom domain — e.g. `https://aratanutra.com`)
5. Deploy. Netlify auto-detects Next.js and applies `@netlify/plugin-nextjs`, so admin, API routes, and middleware all work.

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
