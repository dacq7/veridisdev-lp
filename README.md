# Veridis Landing v2

> Software you can trust. Built in public.

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Deployed on Vercel](https://img.shields.io/badge/deployed-Vercel-black?logo=vercel)](https://vercel.com)

**Production:** [veridisdev.com](https://veridisdev.com) — **v2 Preview:** [veridisdev-lp-git-v2-diego-a-correas-projects.vercel.app](https://veridisdev-lp-git-v2-diego-a-correas-projects.vercel.app)

---

## About

Veridis Dev is a custom software studio based in Medellín, Colombia. We build landing pages, web apps, e-commerce, and mobile apps — primarily for Colombian SMBs, LATAM startups, and US/EU tech clients.

This repository is the v2 rebuild of the studio's own public website. It is not a greenfield project — it is a deep architectural upgrade of the production v1 site, grounded in a full codebase audit before any code was written.

The entire v2 was designed and built by a team of specialized AI agents. Every architectural decision — component ownership, security stack, rendering model, data contracts — is documented publicly in [`.claude/`](./.claude/). The process itself is part of the product.

---

## Highlights

- **ES/EN multilingual** via next-intl — all UI copy in `src/messages/{es,en}.json`, zero hardcoded strings
- **ISR static generation** — home page: 24-hour revalidation; blog routes: 1-hour revalidation
- **7 client islands** — every other component is a Server Component by default
- **Hardened `/api/contact`** — CSRF origin check → Upstash sliding-window rate limit (10 req/IP/hour) → Zod validation → Resend
- **Interactive Quote Calculator** — service × tier × COP/USD, currency persisted in `localStorage`
- **Blog + Case Studies** via Sanity CMS — bilingual content schema, ISR revalidation (provisioning pending)
- **Dynamic OG images** via `@vercel/og` — edge-cached per unique URL, 1-year TTL
- **Organization + Article JSON-LD** structured data — homepage and blog post pages
- **Sentry error tracking** — client, server, and edge runtimes (provisioning pending)
- **Plausible analytics** — privacy-first, no cookie banner, GDPR compliant

---

## Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js App Router | 16.2.6 |
| Language | TypeScript (strict) | 5.x |
| Styling | Tailwind CSS | 4.x |
| Animation | Framer Motion | 12.x |
| i18n | next-intl | 4.x |
| CMS | Sanity | 5.x |
| Email | Resend | 6.x |
| Rate limiting | Upstash Redis + @upstash/ratelimit | 1.x / 2.x |
| Error tracking | Sentry (`@sentry/nextjs`) | 10.x |
| Analytics | Plausible | — |
| Hosting | Vercel | — |

---

## Quick Start

```bash
git clone https://github.com/dacq7/veridisdev-lp.git
cd veridisdev-lp
git checkout v2
npm install
cp .env.example .env.local
# Fill in .env.local — see comments in .env.example for where to get each value
npm run dev
# Open http://localhost:3000
```

The dev server redirects `/` to `/en` or `/es` based on browser locale. Test both at `http://localhost:3000/en` and `http://localhost:3000/es`.

---

## Commands

```bash
npm run dev        # Dev server (Turbopack)
npm run build      # Production build
npm run lint       # ESLint
npx tsc --noEmit   # Type check
```

---

## Project Structure

```
veridisdev-lp/
├── .claude/
│   └── PLAN-MAESTRO.md         # Architectural blueprint — full agent decision log
├── .env.example                # Every required env var documented with source links
├── sanity/
│   └── schemas/
│       ├── index.ts            # Schema registry
│       ├── post.ts             # Bilingual blog post + case study schema
│       ├── category.ts         # Post categories
│       └── author.ts           # Author schema
├── sanity.config.ts            # Sanity Studio config (root-level, Next.js integrated)
├── sentry.client.config.ts     # Sentry — browser runtime
├── sentry.server.config.ts     # Sentry — Node.js runtime
├── sentry.edge.config.ts       # Sentry — edge runtime
├── instrumentation.ts          # Next.js instrumentation hook (Sentry init)
├── next.config.ts              # Next.js config, wrapped with Sentry plugin
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx          # Root layout: fonts, Plausible script, JSON-LD
│   │   │   ├── page.tsx            # Home — ISR revalidate:86400, all sections
│   │   │   └── blog/
│   │   │       ├── page.tsx        # Blog listing — ISR revalidate:3600
│   │   │       └── [slug]/
│   │   │           └── page.tsx    # Post page — generateMetadata, Article JSON-LD
│   │   ├── studio/
│   │   │   └── [[...tool]]/
│   │   │       ├── page.tsx        # Embedded Sanity Studio (no locale prefix)
│   │   │       └── StudioClient.tsx
│   │   ├── api/
│   │   │   ├── contact/
│   │   │   │   └── route.ts        # CSRF → rate limit → Zod → Resend
│   │   │   └── og/
│   │   │       ├── route.tsx       # Default OG image (home, fallback)
│   │   │       └── post/[slug]/
│   │   │           └── route.tsx   # Per-post OG image
│   │   ├── sitemap.ts              # Full sitemap including Sanity blog slugs
│   │   └── robots.ts              # robots.txt — blocks /studio/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── Marquee.tsx
│   │   ├── Services.tsx            # Reads prices from src/config/pricing.ts
│   │   ├── QuoteCalculator.tsx     # CLIENT — service × tier × currency selector
│   │   ├── Projects.tsx
│   │   ├── BlogPreview.tsx         # RSC — fetches last 2 Sanity posts server-side
│   │   ├── AgentProcess.tsx        # RSC — .claude/ trust badge + GitHub link
│   │   ├── Testimonials.tsx
│   │   ├── HowWeWork.tsx
│   │   ├── WhyVeridis.tsx
│   │   ├── TechStack.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx             # RSC wrapper
│   │   ├── ContactForm.tsx         # CLIENT — form state, submit, rate-limit UX
│   │   ├── Footer.tsx
│   │   ├── MagneticButton.tsx      # CLIENT — mouse event listeners
│   │   ├── CustomCursor.tsx        # CLIENT — mousemove tracking
│   │   ├── FloatingCTA.tsx         # CLIENT — scroll visibility state
│   │   ├── TouchRipple.tsx         # CLIENT — touchstart listener
│   │   ├── PlausibleScript.tsx     # Plausible <Script> wrapper
│   │   └── blog/
│   │       ├── PostCard.tsx
│   │       └── PortableTextComponents.tsx
│   ├── config/
│   │   ├── pricing.ts              # Source of truth for all service prices (COP + USD)
│   │   ├── demo-credentials.ts     # Reads NEXT_PUBLIC_DEMO_* env vars
│   │   └── agent-process-stats.ts  # Static data for AgentProcess component
│   ├── hooks/
│   │   ├── useIsTouch.ts           # Canonical touch detection — do not duplicate
│   │   └── useCopyToClipboard.ts   # Clipboard hook — do not duplicate
│   ├── i18n/
│   │   ├── request.ts              # next-intl server config
│   │   └── navigation.ts          # Typed locale-aware Link, useRouter
│   ├── lib/
│   │   ├── sanity.ts               # Sanity client instance
│   │   ├── sanity-queries.ts       # All GROQ queries — never write inline queries in components
│   │   ├── upstash.ts              # Ratelimit instance (10 req/IP/hour)
│   │   ├── resend.ts               # Resend client
│   │   ├── sentry-helpers.ts       # captureException wrappers
│   │   ├── plausible.ts            # Plausible custom event helpers
│   │   └── site-config.ts          # SITE_URL, SITE_NAME constants
│   ├── messages/
│   │   ├── en.json                 # All English UI strings
│   │   └── es.json                 # All Spanish UI strings
│   └── types/
│       └── blog.ts                 # TypeScript types for Sanity blog documents
└── middleware.ts                   # next-intl locale routing
```

---

## Built in Public

Every architectural decision in this project was made by specialized AI agents and documented as it happened. The `.claude/` directory is intentionally public — it is a trust signal, not an artifact.

The full blueprint is at [`./.claude/PLAN-MAESTRO.md`](./.claude/PLAN-MAESTRO.md). It documents:

- Why each technology was chosen (or locked from v1)
- The security stack design for `/api/contact` and the reasoning behind each layer
- The rendering model decision (RSC by default, 7 named client islands, Framer Motion constraint that blocks further RSC migration)
- The Sanity data schema with bilingual content requirements
- The full sprint execution order — each step ends with a passing build

The pre-v2 [codebase audit](./.claude/audit/) is also public — six documents produced by the Codebase Archaeologist agent covering architecture, strengths, weaknesses, and extractable patterns. Every `[HIGH]` and `[MEDIUM]` finding in the audit was resolved before the v2 branch was merged.

Agents involved in the build:

| Role | Responsibility |
|---|---|
| The Architect | Blueprint, tech decisions, sprint plan |
| Security Engineer | CSRF, rate limiting, Zod schema, API hardening |
| RSC Migration Specialist | Component audit, client island identification, ISR configuration |
| Frontend Engineer | QuoteCalculator, AgentProcess, BlogPreview UI |
| CMS Engineer | Sanity schema, GROQ queries, Studio embed, blog routes |
| Observability Engineer | Sentry setup, Plausible integration |
| SEO Specialist | JSON-LD, dynamic OG, sitemap, robots |
| Technical Writer | This README, `.env.example` documentation |

*Open process. Open code. Open trust.*

---

## v2 Sprints

| Sprint | Scope |
|---|---|
| Sprint 1 — Security | CSRF + Upstash rate limiting + Zod on `/api/contact`; demo credentials moved to env vars |
| Sprint 2 — Architecture | RSC migration, `useIsTouch` consolidation, ISR static generation on home + blog routes |
| Sprint 3 — Pricing | `src/config/pricing.ts` as single source of truth; interactive Quote Calculator |
| Sprint 4 — CMS | Sanity scaffold, blog listing, post pages with JSON-LD, BlogPreview, AgentProcess |
| Sprint 5 — Observability + SEO | Sentry, Plausible, Organization JSON-LD, dynamic OG images, sitemap, robots |
| Sprint Final — Polish | AgentProcess showcase, CI/CD pipeline (GitHub Actions), README |

---

## Deployment

| Branch | Environment | URL | Triggered by |
|---|---|---|---|
| `v2` | Preview | Vercel auto-generated | Push to v2 |
| `main` | Production | veridisdev.com | PR merge after CI passes |

**Branch strategy:** all work happens on `v2`. When ready, open a PR to `main`. GitHub Actions runs lint + typecheck + build. On green CI, merge. Vercel production deploy triggers automatically.

### Branches

- `main` — production. Never push directly. PR only, CI must be green.
- `v2` — active development. Vercel auto-deploys previews on every push.

---

## Environment Variables

All variables are documented in [`.env.example`](./.env.example) with inline comments and source links. Copy it to `.env.local` and fill in values before running locally.

| Variable | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | Yes | Contact form email delivery |
| `RESEND_FROM_EMAIL` | Yes | Sender address (must be verified in Resend) |
| `RESEND_TO_EMAIL` | Yes | Inbox receiving contact submissions |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical URL; used for CSRF origin check |
| `UPSTASH_REDIS_REST_URL` | Yes | Rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Yes | Rate limiting |
| `NEXT_PUBLIC_SENTRY_DSN` | Production | Error tracking |
| `SENTRY_AUTH_TOKEN` | Production | Source map upload on build |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | CMS |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | CMS dataset (use `production`) |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Production | Analytics domain |
| `NEXT_PUBLIC_DEMO_*` | Yes | Fake credentials for portfolio project demos |

---

## Content Management

Blog posts and case studies are managed in Sanity Studio at `/studio` (Sanity authentication required). The studio is embedded in the Next.js app — no separate deployment.

Service prices are defined in `src/config/pricing.ts`. That file is the single source of truth. Do not hardcode prices in components or translation files.

---

## License

MIT

---

## Contact

Diego A. Correa Q. — [diegoacq7@gmail.com](mailto:diegoacq7@gmail.com) · [team@veridisdev.com](mailto:team@veridisdev.com)

Veridis Dev · Medellín, Colombia · [veridisdev.com](https://veridisdev.com)
