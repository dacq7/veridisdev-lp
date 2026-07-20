# ARCHITECTURE-CURRENT.md

**Author:** Codebase Archaeologist
**Date:** 2026-05-10
**Repo audited:** veridisdev-lp (v1, pre-Sprint 1)
**Status:** Final

---

## Runtime Architecture

### Request Flow

```
Browser
  │
  ▼
DNS → veridisdev.com
  │
  ▼
Vercel Edge Network
  │
  ├── middleware.ts (next-intl createMiddleware)
  │     Matcher: /((?!api|_next|_vercel|.*\..*).*)
  │     Reads: Accept-Language header
  │     Action: redirects / → /en or /es; detects locale from URL path
  │
  ▼
Next.js App Router (Node.js runtime on Vercel)
  │
  ├── src/app/page.tsx       [Server Component]
  │     Reads Accept-Language header (via next/headers)
  │     redirects to /{locale}
  │
  ├── src/app/[locale]/layout.tsx  [Server Component]
  │     Sets request locale, loads messages JSON
  │     Wraps children in NextIntlClientProvider
  │
  ├── src/app/[locale]/page.tsx    [Server Component — async]
  │     Calls setRequestLocale(locale)
  │     Renders all 16 section components
  │
  └── src/app/api/contact/route.ts  [Server Action / API Route]
        POST only
        Validates required fields
        Sanitizes user input (esc() function)
        Calls Resend API
        Returns JSON {success: true} or {error: string}
```

### Data Flow: Contact Form

```
User fills ContactForm (Client Component)
  │
  ▼
Client-side validation (validateStep1, handleSubmit)
  │
  ▼
fetch('/api/contact', { method: 'POST', body: JSON.stringify(form) })
  │
  ▼
route.ts POST handler
  ├── JSON parse
  ├── Required field presence check (not format validation)
  ├── esc() HTML-escaping on all fields
  └── resend.emails.send() → Resend API
        From: team@veridisdev.com
        To: team@veridisdev.com
        Subject: New project inquiry — {projectType} from {country}
```

---

## Framework and Rendering Strategy

**[LOAD-BEARING]** The entire site is built on Next.js 16 App Router with locale-segmented routing at `[locale]`. This is load-bearing because: (a) all 16 components use `useTranslations()` from next-intl which is wired through the `[locale]/layout.tsx:94` `NextIntlClientProvider`, (b) the middleware handles all locale routing logic, and (c) the root `src/app/page.tsx:1-9` only does a server-side redirect to a locale path. Removing this routing structure would require rewriting the entire component tree.

| Route | Type | Rendering |
|---|---|---|
| `/` | Server Component | Server-side redirect to `/{locale}` |
| `/en` and `/es` | Async Server Component | SSR (no `generateStaticParams`, no `export const dynamic`) |
| `/api/contact` | API Route | Node.js serverless function |

No `generateStaticParams` is defined for `[locale]`, so pages are not statically generated. They render server-side on each request. No `revalidate` directive is present. No `export const dynamic` override. The entire site is SSR-by-default in App Router.

**Impact:** Every page request hits Vercel's serverless functions. For a static marketing page, this adds ~50-200ms cold-start latency that static generation would eliminate.

---

## Locale Architecture

**[LOAD-BEARING]** The i18n system is implemented at three layers simultaneously:

1. **Middleware** (`middleware.ts:1-16`): Route-level locale detection and redirection. Matcher excludes `api`, `_next`, `_vercel`, and files with extensions.

2. **Server loader** (`src/i18n/request.ts:1-13`): `getRequestConfig` loads the correct JSON message file per locale. If locale is absent or invalid, calls `notFound()`.

3. **Navigation exports** (`src/i18n/navigation.ts:1-6`): Re-exports `Link`, `redirect`, `usePathname`, `useRouter` from `next-intl/navigation` with locales typed as `['en', 'es'] as const`. These are used in `Navbar.tsx:8` for the language toggle.

The locale list `['en', 'es']` is hardcoded in three places: `middleware.ts:5`, `request.ts:4`, and `navigation.ts:3`. Adding a third locale requires changes in all three files.

**Language toggle mechanism** (`Navbar.tsx:258-274`): Two plain `<button>` elements call `router.replace(pathname, { locale: 'en' | 'es' })`. This is a full page navigation — not a client-side state switch.

---

## Component Boundary Strategy

**[LOAD-BEARING]** Every single section component (`Hero`, `Contact`, `Services`, `Projects`, `Testimonials`, `HowWeWork`, `WhyVeridis`, `TechStack`, `About`, `Footer`, `Navbar`, `CustomCursor`, `TouchRipple`, `FloatingCTA`, `MagneticButton`, `Marquee`) carries the `'use client'` directive at line 1. This is universal — there are no Server Components below `src/app/[locale]/page.tsx`.

Evidence: `Hero.tsx:1`, `Contact.tsx:1`, `Navbar.tsx:1`, `Services.tsx:1`, `Projects.tsx:1`, `Testimonials.tsx:1`, `HowWeWork.tsx:1`, `WhyVeridis.tsx:1`, `TechStack.tsx:1`, `About.tsx:1`, `Footer.tsx:1`, `CustomCursor.tsx:1`, `MagneticButton.tsx:1`, `FloatingCTA.tsx:1`, `TouchRipple.tsx:1`, `Marquee.tsx:1`.

The reason is legitimate: every component uses either Framer Motion (which requires the browser DOM), `useTranslations()` client-side hooks, or touch/scroll event listeners. However, this means the entire page JavaScript bundle is shipped to the client.

---

## State Management

No global state library is used. State is entirely local to components via React `useState` and `useAnimation` (Framer Motion). The only shared state is:

- `locale` — managed by next-intl's server/middleware layer, read by components via `useLocale()` hook
- `messages` — passed as `messages` prop to `NextIntlClientProvider` at `layout.tsx:60,94`

There is no TanStack Query, no Zustand, no Redux. The contact form's `FormData` state lives entirely inside `ContactForm` component (`Contact.tsx:546-553`).

---

## Data Fetching Patterns

No dynamic data fetching exists. All data is:

1. **Hardcoded in components**: Service prices (`Services.tsx:117-165`), project URLs and credentials (`Projects.tsx:44-123`), testimonial content (`Testimonials.tsx:25-50`)
2. **Loaded from JSON at build/request time**: i18n strings from `src/messages/en.json` and `es.json`
3. **One write operation**: Contact form POSTs to `/api/contact` which calls Resend

There are no database connections, no CMS queries, no external API calls at render time.

---

## Auth Flow

None. This is a public marketing site with no authentication layer.

---

## Deployment Target

**Vercel** (inferred). Evidence:
- `.gitignore:37` contains `.vercel` entry
- `CLAUDE.md` states "Vercel (deploy)"
- `src/app/[locale]/layout.tsx:26` sets `metadataBase: new URL("https://veridisdev.com")`
- No `Dockerfile`, no `vercel.json`, no `.github/workflows/` — deployment is handled by Vercel's automatic Git integration

No CI/CD pipeline exists. Deploys happen on git push (implied by Vercel Git integration). No preview environment configuration is explicit.

---

## Styling Architecture

Tailwind CSS v4 with CSS-native `@theme` at `src/app/globals.css:3-14`. Design tokens defined:

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | #0D5C3A | Primary green |
| `--color-accent` | #1A8A5A | Accent green (dominant) |
| `--color-background` | #0F1A14 | Deep dark green |
| `--color-surface` | #1A2820 | Card background |
| `--color-text-secondary` | #4A6B58 | Muted text |
| `--font-display` | var(--font-syne) | Syne via next/font |
| `--font-sans` | var(--font-dm-sans) | DM Sans via next/font |

**[LOAD-BEARING]** The dot-grid background pattern (`radial-gradient(circle, rgba(26, 138, 90, 0.25) 1px, transparent 1px) / 24px 24px`) is applied in both the global body CSS (`globals.css:22-24`) and repeated in inline styles on 7+ section components (`Services.tsx:396-401`, `Projects.tsx:639-643`, `Contact.tsx:991-994`, `Testimonials.tsx:111-116`, `WhyVeridis.tsx:348-352`, `TechStack.tsx:409-412`, `About.tsx:241-244`). The body-level application is the canonical one; the section-level repetitions are redundant but harmless.

The film-grain overlay is a fixed SVG with `feTurbulence` filter applied at `layout.tsx:71-93` (z-index 9999, opacity 0.055, pointer-events none). This renders on top of every section including the Navbar. A duplicate grain SVG exists inline in `Hero.tsx:461-472` with lower opacity (0.045) for local reinforcement.
