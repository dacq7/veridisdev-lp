# REPO-INVENTORY.md

**Author:** Codebase Archaeologist
**Date:** 2026-05-10
**Repo audited:** veridisdev-lp (v1, pre-Sprint 1)
**Status:** Final

---

## Executive Summary

- The repo is a Next.js 16 App Router landing page (53 tracked files, 1.3 MB source excluding generated dirs) built in 11 days of active commits (2026-04-23 to 2026-05-04). It is production-deployed on Veridis' own domain and serves as the primary commercial showcase for the Veridis Dev studio.
- The UI layer is architecturally complete — 16 section components totalling 6,507 lines of TypeScript, fully i18n-covered in EN/ES — and demonstrates a uniform, high-effort animation vocabulary using Framer Motion 12 and Tailwind CSS 4.
- The single external service dependency for business function is Resend (email delivery via `src/lib/resend.ts:3`). The contact API route has no rate-limiting, no email-format validation, and no CSRF protection, making it trivially abusable.
- `useIsTouch` is defined independently in 10 different component files with three slightly different implementations — the most heavily duplicated utility in the codebase, with zero shared hooks directory.
- There are zero automated tests in the repository. The marketing copy in the site itself claims "110+ tests across production projects" — this refers to other client projects, not to this codebase.

---

## Repository Metrics

| Metric | Value |
|---|---|
| Total commits | 29 |
| Commits in last 90 days | 29 (all commits) |
| Oldest commit | 2026-04-23T18:44:52-05:00 |
| Newest commit | 2026-05-04T01:15:25-05:00 |
| Active development span | ~11 days |
| Source size (excl. generated) | 1.3 MB |
| Total tracked files | 53 |
| Source files (TypeScript/TSX) | 22 |
| Total source LOC | ~6,900 (components: 6,507 + API + i18n + config) |
| Test files | 0 |

---

## Directory Tree

```
current-repo/
├── AGENTS.md                  — Agent rules for Next.js version warnings
├── CLAUDE.md                  — Project overview, brand, stack, content reference
├── SKILL_FRONTEND.md          — Frontend skill instructions (agent tooling)
├── README.md                  — Standard Next.js scaffold README (not updated)
├── eslint.config.mjs          — ESLint configuration (Next.js plugin)
├── middleware.ts              — i18n routing middleware (next-intl)
├── proxy.ts                   — Duplicate of middleware logic (unused export, see WEAKNESSES)
├── next.config.ts             — Next.js config wrapped with next-intl plugin
├── next-env.d.ts              — Next.js ambient type declarations
├── postcss.config.mjs         — PostCSS with @tailwindcss/postcss plugin
├── tsconfig.json              — TypeScript strict mode, @/* path alias
├── package.json               — Runtime and dev dependencies
├── package-lock.json          — Lockfile
├── .gitignore                 — Standard Next.js gitignore
├── .env.local                 — Local secrets (not committed, not .example provided)
├── .claude/settings.local.json — Claude Code settings
│
├── public/
│   ├── logo/veridis-icon.svg  — Brand hexagon+V SVG logo
│   ├── images/
│   │   ├── barberos-screenshot.png    — BarberOS project screenshot
│   │   ├── budokan-screenshot.png     — Budokan project screenshot
│   │   └── trucking-screenshot.png   — Trucking CRM screenshot
│   └── *.svg                  — Next.js scaffold SVGs (file, globe, next, vercel, window)
│
└── src/
    ├── app/
    │   ├── page.tsx           — Root redirect: reads Accept-Language header → /{locale}
    │   ├── favicon.ico        — Favicon
    │   ├── globals.css        — Tailwind v4 @theme + base body/selection styles (43 lines)
    │   ├── [locale]/
    │   │   ├── layout.tsx     — Root layout: fonts, metadata, film grain overlay, NextIntlClientProvider
    │   │   └── page.tsx       — Single-page composition: all section components assembled here
    │   └── api/
    │       └── contact/
    │           └── route.ts   — POST handler: validates, sanitizes, sends email via Resend (125 lines)
    ├── components/            — 16 section/UI components (see Component Inventory below)
    ├── i18n/
    │   ├── navigation.ts      — Locale-aware Link/router/pathname exports
    │   └── request.ts         — next-intl server-side locale loader
    ├── lib/
    │   └── resend.ts          — Resend client singleton (3 lines)
    └── messages/
        ├── en.json            — English strings (385 lines)
        └── es.json            — Spanish strings (385 lines)
```

---

## Component Inventory (LOC)

| Component | LOC | Role |
|---|---|---|
| Contact.tsx | 1,069 | Two-step lead form + ContactInfo left column |
| Projects.tsx | 729 | Three project cards with terminal frames |
| Hero.tsx | 664 | Landing hero: headline, terminal, stats, parallax |
| HowWeWork.tsx | 426 | 4-step process cards with connector lines |
| Services.tsx | 501 | 6 service cards with COP/USD price toggle |
| About.tsx | 450 | Founder bio with rotating hexagon and CountUp stats |
| TechStack.tsx | 493 | Tech pill grid with wave interactions |
| WhyVeridis.tsx | 447 | 4 differentiator cards with 3D tilt |
| Testimonials.tsx | 391 | 3 testimonial cards with 3D tilt |
| Navbar.tsx | 374 | Fixed nav, active section tracking, language toggle |
| Footer.tsx | 341 | 3-column footer with animated links |
| CustomCursor.tsx | 154 | Context-aware custom cursor (desktop only) |
| FloatingCTA.tsx | 40 | Scroll-triggered floating button |
| MagneticButton.tsx | 56 | Magnetic hover wrapper for buttons |
| Marquee.tsx | 50 | CSS-animated tech stack ticker |
| TouchRipple.tsx | 54 | Global touch ripple effect (mobile) |

---

## Package Dependencies

### Runtime Dependencies

| Package | Version in package.json | Version type |
|---|---|---|
| next | 16.2.4 | Pinned (exact) |
| react | 19.2.4 | Pinned (exact) |
| react-dom | 19.2.4 | Pinned (exact) |
| framer-motion | ^12.38.0 | Floating (patch+minor) |
| next-intl | ^4.11.0 | Floating (patch+minor) |
| resend | ^6.12.2 | Floating (patch+minor) |

### Dev Dependencies

| Package | Version | Type |
|---|---|---|
| @tailwindcss/postcss | ^4 | Floating (major range) |
| tailwindcss | ^4 | Floating (major range) |
| typescript | ^5 | Floating (major range) |
| eslint | ^9 | Floating (major range) |
| eslint-config-next | 16.2.4 | Pinned |
| @types/node | ^20 | Floating |
| @types/react | ^19 | Floating |
| @types/react-dom | ^19 | Floating |

### Version Strategy Assessment

Next.js and React are pinned to exact versions (good). All other dependencies float, including `@tailwindcss/postcss ^4` which spans an entire major version. Tailwind v4 is significantly different from v3 (no `tailwind.config.js`, CSS-native `@theme` directive) — this is intentional (the codebase uses v4's `@theme` at `src/app/globals.css:3`) but floats across potentially breaking minor changes.

---

## Available Scripts

| Script | Command | Purpose |
|---|---|---|
| dev | next dev | Development server |
| build | next build | Production build |
| start | next start | Production server |
| lint | eslint | Lint TypeScript/TSX files |

No test script. No pre-commit hooks. No CI/CD scripts.

---

## Environment Variables

One environment variable referenced in source code:

| Variable | File:Line | Purpose |
|---|---|---|
| RESEND_API_KEY | src/lib/resend.ts:3 | Resend email delivery API key |

No `.env.example` file exists. The `.env.local` file exists but is gitignored and not readable by this audit. The variable must be inferred from source code.

---

## External Services / APIs

| Service | Integration point | Purpose |
|---|---|---|
| Resend | src/lib/resend.ts, src/app/api/contact/route.ts | Transactional email for contact form submissions |
| Google Fonts | src/app/[locale]/layout.tsx:3-4 | DM Sans and Syne typefaces via next/font/google |
| Vercel | Inferred from .gitignore (.vercel entry) and CLAUDE.md | Deployment platform |
| GitHub | Hardcoded URLs in Projects.tsx:53,79,103 | Links to project repos (dacq7/budokan-app, dacq7/barberos-os, dacq7/trucking-crm) |
| WhatsApp | Contact.tsx:209-221 | wa.me link to +573017684794 |

No analytics, no error tracking, no uptime monitoring, no CDN configuration detected.
