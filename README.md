# Elarion Labs — elarionlabsinc.com

A premium, animated landing page for an AI-powered health & fitness system, with
email + name pre-registration (early-access waitlist).

Built per [`doc/DESIGN.md`](doc/DESIGN.md): Next.js 15 (App Router) · TypeScript ·
Framer Motion · Lenis smooth scroll · bespoke CSS design system.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

> **Windows + WSL note:** if you run from a `/mnt/c/...` path inside WSL, npm
> launches the Windows `node.exe`, which binds the Windows network stack. Open
> the site from Windows at `http://localhost:3000`. To run fully inside Linux,
> clone the repo into the Linux filesystem (e.g. `~/elarion`).

## Build & run production

```bash
npm run build
npm start         # or: npx next start -p 3000
```

## Project structure

```
app/
  layout.tsx            # fonts, metadata/SEO, JSON-LD, global overlays
  page.tsx              # section assembly (wrapped in WaitlistProvider)
  globals.css           # design tokens + all component/section styles
  api/waitlist/route.ts # pre-registration endpoint (validate · dedupe · rate-limit)
components/
  sections/             # Nav, Hero, TrustBar, Promise, Capabilities,
                        # Showcase, HowItWorks, SocialProof, Waitlist, Footer
  Reveal, Counter, Particles, Aurora, ScrollProgress, SmoothScroll, ...
lib/
  motion.ts             # easing + reveal variants
  validation.ts         # Zod schema for the waitlist
  store.ts              # file-backed waitlist store (swap for Supabase in prod)
doc/DESIGN.md           # full design & implementation spec
```

## Waitlist API

`POST /api/waitlist` — body `{ name, email, goal?, hp? }`

| Outcome              | Status | Body                                                    |
|----------------------|--------|---------------------------------------------------------|
| New signup           | 200    | `{ success: true, position }`                           |
| Already registered   | 409    | `{ success: false, error: "already_registered", position }` |
| Invalid email        | 422    | `{ success: false, error: "invalid_email" }`            |
| Rate limited (5/min) | 429    | `{ success: false, error: "rate_limited" }`             |
| Honeypot (bot)       | 200    | `{ success: true, position: 0 }` (stored nothing)       |

[`lib/store.ts`](lib/store.ts) has two backends and picks automatically:

- **Production** → Upstash Redis (Vercel KV) when `KV_REST_API_URL` +
  `KV_REST_API_TOKEN` (or `UPSTASH_REDIS_REST_*`) are set.
- **Local dev** → `.data/waitlist.json` file (no setup needed).

## Deploy to Vercel

1. **Provision storage:** in the Vercel dashboard → **Storage** → add the
   **Upstash for Redis** integration and connect it to this project. Vercel
   injects `KV_REST_API_URL` / `KV_REST_API_TOKEN` automatically.
2. **Push the repo** to GitHub, then **Import** it in Vercel (Framework
   auto-detected as Next.js). Or run `npx vercel` then `npx vercel --prod`.
3. **Domain:** Project → Settings → Domains → add `elarionlabsinc.com` and
   `www`. Point DNS at Vercel (A `76.76.21.21` for the apex, CNAME
   `cname.vercel-dns.com` for `www`). HTTPS is issued automatically.

See `.env.example` for all environment variables.

## Notes

- Fully responsive (fluid `clamp()` type/spacing, `svh` units, 1023/767px breakpoints).
- Respects `prefers-reduced-motion` and disables heavy effects on low-end/touch devices.
- Smooth scrolling (Lenis) is enabled on pointer devices only; native scroll otherwise.
