# Aeternyx™ — ARATA Nutraceuticals

Production-grade Next.js 14 (App Router) marketing site for **Aeternyx™**, a physician-formulated longevity supplement by **ARATA Nutraceuticals**.

> *Cellular Intelligence.* One capsule. Ten bioactives. Five aging pathways. ₹2,500 / month.

---

## Stack

- **Next.js 14** App Router, React 18, TypeScript
- **Tailwind CSS** with bespoke design tokens (obsidian / gold luxury palette)
- **Framer Motion** for scroll-driven and hero animations
- **NextAuth (Credentials)** for the admin gate
- **Flat-file JSON** content store at `/content/site-content.json` — no DB required

## Pages

- `/` — full marketing site (Nav, Hero, Trust Bar, Product, Ingredients, Science, Benefits, Philosophy, Prescription, Blog, Newsletter, Footer)
- `/admin` — password-protected content studio (one editor card per section, image uploader, ingredient table editor, blog CRUD)
- `/admin/login` — admin sign-in

## Getting started

```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.example .env.local
# then edit .env.local with your admin credentials and a NEXTAUTH_SECRET
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

To edit content **without** the admin UI: just hand-edit `content/site-content.json` and commit.

## Project structure

```
content/
  site-content.json          # single source of truth for all section copy
public/
  uploads/                   # admin-uploaded images (gitignored)
src/
  app/
    page.tsx                 # public site
    layout.tsx               # fonts + global metadata
    globals.css
    admin/
      page.tsx               # dashboard (server-rendered)
      layout.tsx
      login/page.tsx
    api/
      auth/[...nextauth]/    # NextAuth route
      content/               # GET / POST content JSON
      upload/                # multipart image upload
  components/
    public/                  # Nav, Hero, TrustBar, Product, Ingredients, Science,
                             # Benefits, Philosophy, Prescription, Blog,
                             # Newsletter, Footer
    admin/                   # AdminDashboard + Section editors
  lib/                       # auth, content I/O
  types/                     # SiteContent typings
```

## Scripts

```bash
npm run dev         # next dev
npm run build       # production build
npm run start       # next start
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
```

## Deployment

The included GitHub Actions workflow at `.github/workflows/deploy.yml` deploys to Vercel on every push to `main`. Required repository secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Also configure these as **Vercel** environment variables (Production):

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (the live URL, e.g. `https://aeternyx.com`)

> **Note on the JSON content store**: writes from the admin panel persist to the local filesystem. On Vercel's serverless filesystem these writes do **not** survive deployments. For production durability, swap `src/lib/content.ts` to read/write from a database, Vercel KV, or GitHub. For now this is the simplest possible CMS for a single-author site.

## Design tokens

| Token              | Value      |
| ------------------ | ---------- |
| `obsidian`         | `#080808`  |
| `deep`             | `#0E0E0E`  |
| `surface`          | `#141414`  |
| `gold`             | `#C9A96E`  |
| `gold-light`       | `#E8D5B0`  |
| `text-primary`     | `#F0EBE1`  |
| `text-secondary`   | `#A89880`  |

Fonts: **Cormorant Garamond** (display), **DM Sans** (body), **Syncopate** (accent).

## License

(c) ARATA Nutraceuticals. Aeternyx is a registered trademark.
