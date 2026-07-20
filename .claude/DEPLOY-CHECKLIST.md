# Deploy Checklist — Veridis Landing v2

Linear procedure to activate all external services and merge `v2` to `main`.

**Estimated time:** ~90 minutes of manual work  
**Last updated:** 2026-05-14  
**Branch:** `v2` → `main`

---

## Prerequisites

Admin access required:
- GitHub — `dacq7/veridisdev-lp`
- Vercel — `diego-a-correas-projects`, project `veridisdev-lp`
- Upstash — rate limiting Redis instance (already used in Sprint 1)
- Resend — contact form email delivery (carried over from v1)

**Credit card not required** for launch. All services have free tiers. Plausible is the exception: 30-day trial, then $9/month. It can be skipped — the build degrades silently without it.

---

## Services

### 1. Sanity CMS (~25 min)

**Why:** Powers the blog, case studies, and the BlogPreview section on the home page. Without it, `/blog` shows a "coming soon" state and BlogPreview renders nothing.

**Account setup:**
1. Go to [sanity.io/manage](https://sanity.io/manage) — sign up if needed (free, no card)
2. Create a new project → name: `veridis-landing`
3. Dataset: `production` (default)
4. From the project dashboard: copy the **Project ID**
5. From **API settings**: note the API version — use `2024-01-01` as the stable pin
6. Optional: API → Tokens → Add token (Viewer role) → copy for `SANITY_API_READ_TOKEN` (only needed for draft preview)

**Required env vars:**
```
NEXT_PUBLIC_SANITY_PROJECT_ID=<project-id-from-dashboard>
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_READ_TOKEN=           # optional — leave empty unless you need draft preview
```

**Where to paste:** Vercel → Project → Settings → Environment Variables → add to **Production**, **Preview**, and **Development** environments. Also update `.env.local`.

**Verification:** Visit `/studio` on the Vercel preview URL — Sanity Studio should load. If you see the studio UI, provisioning succeeded. If you still see "not configured", the env vars weren't picked up — trigger a redeploy.

**PROVISIONING markers resolved:**
- `src/components/BlogPreview.tsx:4` — component guards on Sanity; renders nothing without it
- `src/components/BlogPreview.tsx:18` — inner data-fetch guard
- `src/app/studio/[[...tool]]/StudioClient.tsx:2` — only rendered when Sanity env vars are present
- `src/app/studio/[[...tool]]/page.tsx:1` — Sanity Studio embedded at `/studio`
- `src/app/[locale]/blog/page.tsx:2` — shows "coming soon" state without env vars
- `src/app/api/og/post/[slug]/route.tsx:1` — falls back to slug-based OG without Sanity
- `src/app/[locale]/blog/[slug]/page.tsx:2` — all slug lookups return 404 without Sanity
- `src/lib/sanity.ts:1` — client bootstrapped from `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `NEXT_PUBLIC_SANITY_API_VERSION`
- `src/lib/sanity-queries.ts:1` — requires Sanity client configured via `src/lib/sanity.ts`
- `src/lib/sanity-queries.ts:24` — `getLatestPosts` query guard
- `src/lib/sanity-queries.ts:35` — `getAllPostSlugs` query guard
- `src/lib/sanity-queries.ts:52` — `getPostBySlug` query guard
- `src/lib/sanity-queries.ts:63` — `getCaseStudies` query guard
- `src/lib/sanity-queries.ts:74` — `getPostsByCategory` query guard

---

### 2. Sentry Error Tracking (~20 min)

**Why:** Captures unhandled errors across client, server, and edge runtimes. Without it, production errors are silent.

**Account setup:**
1. Go to [sentry.io](https://sentry.io) — sign up (free Developer plan, no card)
2. Create a new project → platform: **Next.js**
3. From **Project Settings → Client Keys (DSN)**: copy the DSN URL
4. From **Organization Settings → General**: copy the **organization slug**
5. From the project URL (`sentry.io/organizations/<org>/projects/<project>/`): note the **project slug**
6. **Auth token**: User icon (top right) → User Settings → Auth Tokens → Create New Token → scope: `project:releases` → copy

**Required env vars:**
```
NEXT_PUBLIC_SENTRY_DSN=https://<key>@o<id>.ingest.sentry.io/<project-id>
SENTRY_ORG=<organization-slug>
SENTRY_PROJECT=<project-slug>
SENTRY_AUTH_TOKEN=sntrys_<token>
```

**Where to paste:** Vercel → Settings → Environment Variables → **Production**, **Preview**, **Development**. Also `.env.local`.

**Verification:** After deploying, open the browser console on the preview URL and run:
```javascript
throw new Error("Sentry test from console")
```
Check [sentry.io](https://sentry.io) — the error should appear in the Issues dashboard within 60 seconds.

**PROVISIONING markers resolved:**
- `sentry.client.config.ts:1` — client-side Sentry; requires `NEXT_PUBLIC_SENTRY_DSN` to activate
- `sentry.server.config.ts:1` — server-side Sentry; requires `NEXT_PUBLIC_SENTRY_DSN` to activate
- `sentry.edge.config.ts:1` — edge runtime Sentry; requires `NEXT_PUBLIC_SENTRY_DSN` to activate
- `src/lib/sentry-helpers.ts:1` — capture helpers; fall back to `console` without DSN

---

### 3. Plausible Analytics (~10 min) — OPTIONAL

> **Cost:** 30-day free trial, then $9/month (personal plan). If you don't plan to subscribe, **skip this service** — the code degrades silently. Pageview tracking will simply be absent.

**Why:** Privacy-first analytics with no cookie banner, no GDPR consent needed.

**Account setup:**
1. Go to [plausible.io](https://plausible.io) — sign up (30-day trial)
2. Add new site → domain: `veridisdev.com` (use the production domain, not the preview URL)
3. No further configuration needed

**Required env vars:**
```
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=veridisdev.com
```

**Where to paste:** Vercel → Settings → Environment Variables → **Production** only (analytics on preview URLs creates noise). Also `.env.local` if you want local pageview testing.

**Verification:** Visit `veridisdev.com` after production deploy. Open the Plausible dashboard — a pageview should appear within 1 minute.

**PROVISIONING markers resolved:**
- `src/components/PlausibleScript.tsx:1` — returns `null` without `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
- `src/lib/plausible.ts:3` — event tracking no-ops without `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`

---

### 4. Resend Email (~5 min, likely already done)

**Why:** Powers the contact form. Without `RESEND_API_KEY`, `/api/contact` returns `503 email_service_unavailable`. The v1 site already uses Resend — if you have the key, this is just copying it into Vercel.

**Required env vars:**
```
RESEND_API_KEY=re_<your-key>
RESEND_FROM_EMAIL=hola@veridisdev.com   # must be a verified domain in Resend
RESEND_TO_EMAIL=team@veridisdev.com     # inbox that receives submissions
```

**Where to paste:** Vercel → Settings → Environment Variables → **Production**, **Preview**, **Development**. Also `.env.local`.

**If you need a new key:** resend.com → API Keys → Create API Key → full access.

**Verification:** Submit the contact form on the preview URL with a valid email. The form should show a success state and an email should arrive at `RESEND_TO_EMAIL`.

**PROVISIONING markers resolved:**
- `src/app/api/contact/route.ts:1` — lazy Resend init; returns 503 if key absent

---

### 5. NEXT_PUBLIC_SITE_URL (~3 min)

**Why:** Used for canonical URLs, OG image absolute paths, sitemap, and the CSRF origin check on `/api/contact`. Has a safe code fallback to `https://veridisdev.com`, but setting it explicitly is cleaner.

**Required env vars:**
```
NEXT_PUBLIC_SITE_URL=https://veridisdev.com
```

**Where to paste:** Vercel → Settings → Environment Variables → **Production** and **Preview**. For Preview, the value can stay as `https://veridisdev.com` or be set to the Vercel preview URL if you want canonical tags to reflect the preview domain.

**Verification:** View HTML source of `/es` on production. Check that `<link rel="canonical">` points to `https://veridisdev.com/es`.

**PROVISIONING markers resolved:** Explicit configuration of the `SITE_URL` fallback in `src/lib/site-config.ts`.

---

## Pre-merge Checklist

Complete all items before opening the PR `v2 → main`.

### Environment variables
- [ ] All env vars from `.env.example` present in Vercel (Production + Preview + Development)
- [ ] `NEXT_PUBLIC_SITE_URL` set explicitly in Vercel Production environment

### CI pipeline
- [ ] GitHub Actions CI has run green at least once on the `v2` branch ([check here](https://github.com/dacq7/veridisdev-lp/actions))
- [ ] Branch protection rule configured on `main`:
  - Go to: `github.com/dacq7/veridisdev-lp` → Settings → Branches → Add branch protection rule
  - Branch name pattern: `main`
  - ☑ Require a pull request before merging
  - ☑ Require status checks to pass before merging → select `Validate` (appears after first CI run)
  - ☑ Require branches to be up to date before merging
  - ☑ *(Recommended)* Do not allow bypassing the above settings

### Content
- [ ] At least one case study published in Sanity Studio (recommended: **BarberOS**)
  - Visit `/studio` → create post → `isCaseStudy: true` → publish
- [ ] BlogPreview section visible on home page after publishing

### Smoke test (on Vercel preview URL — not localhost)
- [ ] `/es` and `/en` load, all sections visible
- [ ] Language switcher in Navbar toggles all text between ES and EN
- [ ] Services section shows prices (imported from `src/config/pricing.ts`)
- [ ] Quote Calculator: select service → price updates; switch tier → price updates; toggle COP/USD → reformats
- [ ] Quote Calculator: reload page → currency preference preserved (localStorage)
- [ ] Quote Calculator CTA → scrolls to contact section
- [ ] Contact form: valid submission → success state (verify email at `team@veridisdev.com`)
- [ ] Contact form: invalid email → validation error shown inline
- [ ] Contact form: submit 11 times quickly → 11th returns rate-limit error in UI
- [ ] AgentProcess section visible on home; primary button opens `.claude/` on GitHub in new tab
- [ ] `/es/blog` and `/en/blog` load (posts visible, or "coming soon" if no posts published — intentional)
- [ ] `/studio` loads Sanity Studio (post-Sanity provisioning)
- [ ] `/sitemap.xml` returns valid XML with at least 4 URLs
- [ ] `/robots.txt` returns plain text with `Allow: /` and `Disallow: /studio/`
- [ ] `/api/og?title=Test` returns a PNG image (open in browser tab)
- [ ] Mobile (375px): all sections render without horizontal overflow
- [ ] Browser console: zero JavaScript errors on `/es` and `/en`

### SEO verification
- [ ] Lighthouse mobile audit on `/es` ≥ 90 Performance (run on Vercel preview, not localhost)
- [ ] OG image verified: visit `https://www.opengraph.xyz/` → paste production URL → confirm image renders

---

## Merge Procedure

```bash
# 1. Sync v2
git checkout v2
git pull origin v2

# 2. Open PR via GitHub UI — do not merge from CLI
# https://github.com/dacq7/veridisdev-lp/compare/main...v2

# 3. Wait for CI to pass on the PR (lint + typecheck + build)

# 4. Merge strategy: use "Create a merge commit" (not squash)
#    This preserves the 28+ commit history — the auditable trail
#    that the AgentProcess section advertises publicly.

# 5. After merge:
git checkout main
git pull origin main
# Vercel automatically deploys to veridisdev.com
```

---

## Post-merge Verification

- [ ] `veridisdev.com` loads and all sections render
- [ ] `/studio` on production loads Sanity Studio
- [ ] Case study visible at `/es/blog/<slug>` and `/en/blog/<slug>`
- [ ] AgentProcess primary CTA on production points to `.claude/` on GitHub
- [ ] Share `veridisdev.com` on LinkedIn or X — verify OG image appears correctly in preview
- [ ] Sentry dashboard: confirms no critical errors in the first 24 hours

**Optional cleanup:**
```bash
git branch -d v2
git push origin --delete v2
```

---

## Appendix A: PROVISIONING Markers Index

| File | Line | Service Required |
|------|------|-----------------|
| `src/components/PlausibleScript.tsx` | 1 | Plausible Analytics |
| `src/lib/plausible.ts` | 3 | Plausible Analytics |
| `src/components/BlogPreview.tsx` | 4 | Sanity CMS |
| `src/components/BlogPreview.tsx` | 18 | Sanity CMS |
| `sentry.edge.config.ts` | 1 | Sentry Error Tracking |
| `src/app/studio/[[...tool]]/StudioClient.tsx` | 2 | Sanity CMS |
| `src/app/studio/[[...tool]]/page.tsx` | 1 | Sanity CMS |
| `src/app/api/contact/route.ts` | 1 | Resend (email) — carried from v1 |
| `src/lib/sentry-helpers.ts` | 1 | Sentry Error Tracking |
| `src/app/[locale]/blog/page.tsx` | 2 | Sanity CMS |
| `src/app/api/og/post/[slug]/route.tsx` | 1 | Sanity CMS |
| `src/lib/sanity.ts` | 1 | Sanity CMS |
| `sentry.client.config.ts` | 1 | Sentry Error Tracking |
| `src/app/[locale]/blog/[slug]/page.tsx` | 2 | Sanity CMS |
| `sentry.server.config.ts` | 1 | Sentry Error Tracking |
| `src/lib/sanity-queries.ts` | 1 | Sanity CMS |
| `src/lib/sanity-queries.ts` | 24 | Sanity CMS |
| `src/lib/sanity-queries.ts` | 35 | Sanity CMS |
| `src/lib/sanity-queries.ts` | 52 | Sanity CMS |
| `src/lib/sanity-queries.ts` | 63 | Sanity CMS |
| `src/lib/sanity-queries.ts` | 74 | Sanity CMS |

**Summary by service:**
- Sanity CMS: 14 markers
- Sentry Error Tracking: 4 markers
- Plausible Analytics: 2 markers
- Resend (contact email): 1 marker — no new provisioning needed; key carried from v1

**Total: 21 PROVISIONING markers across 15 files.**

---

## Appendix B: Environment Variables Reference

### Email — Resend

| Variable | Visibility | Required | Description |
|----------|-----------|----------|-------------|
| `RESEND_API_KEY` | Server-only | Required | Your Resend API key. Get from resend.com → API Keys. |
| `RESEND_FROM_EMAIL` | Server-only | Required | The "from" address for outgoing emails. Must be a verified domain in Resend. Default during development: `onboarding@resend.dev`. |
| `RESEND_TO_EMAIL` | Server-only | Required | The inbox that receives contact form submissions. |

### Rate Limiting — Upstash Redis

| Variable | Visibility | Required | Description |
|----------|-----------|----------|-------------|
| `UPSTASH_REDIS_REST_URL` | Server-only | Required | REST URL for your Upstash Redis instance. Get from console.upstash.com → Redis → Connect → REST API. |
| `UPSTASH_REDIS_REST_TOKEN` | Server-only | Required | REST auth token for Upstash Redis. Same source as URL above. |

### Error Tracking — Sentry

| Variable | Visibility | Required | Description |
|----------|-----------|----------|-------------|
| `NEXT_PUBLIC_SENTRY_DSN` | Client-exposed | Required for production | DSN that routes errors to your Sentry project. Get from Project Settings → Client Keys. |
| `SENTRY_AUTH_TOKEN` | Server-only | Required for production | Used by Sentry webpack plugin to upload source maps on build. Get from User Settings → Auth Tokens. |
| `SENTRY_ORG` | Server-only | Required for source map uploads | Your Sentry organization slug. Found in Settings → General. |
| `SENTRY_PROJECT` | Server-only | Required for source map uploads | Your Sentry project slug. Found in Project Settings → General. |

### CMS — Sanity

| Variable | Visibility | Required | Description |
|----------|-----------|----------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Client-exposed | Required | Project ID from sanity.io/manage → Project. |
| `NEXT_PUBLIC_SANITY_DATASET` | Client-exposed | Required | Sanity dataset to query. Use `production` for the live site. |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Client-exposed | Required | Content Lake API version to pin requests to (ISO date). Use `2024-01-01`. |
| `SANITY_API_READ_TOKEN` | Server-only | Optional | Read-only API token for fetching draft content in preview mode. Leave empty unless you implement draft preview. |

### Demo Credentials — Portfolio Projects

> These are fake credentials for demo accounts in portfolio projects. Exposed as `NEXT_PUBLIC_*` so they can be rotated without code changes. Never put real user credentials here.

| Variable | Project | Role |
|----------|---------|------|
| `NEXT_PUBLIC_DEMO_BUDOKAN_USER` | Budokan SKIF | Sensei |
| `NEXT_PUBLIC_DEMO_BUDOKAN_PASS` | Budokan SKIF | Sensei |
| `NEXT_PUBLIC_DEMO_BUDOKAN_KARATECA_USER` | Budokan SKIF | Karateca |
| `NEXT_PUBLIC_DEMO_BUDOKAN_KARATECA_PASS` | Budokan SKIF | Karateca |
| `NEXT_PUBLIC_DEMO_BARBEROS_ADMIN_USER` | BarberOS | Admin |
| `NEXT_PUBLIC_DEMO_BARBEROS_ADMIN_PASS` | BarberOS | Admin |
| `NEXT_PUBLIC_DEMO_BARBEROS_STAFF_USER` | BarberOS | Staff |
| `NEXT_PUBLIC_DEMO_BARBEROS_STAFF_PASS` | BarberOS | Staff |
| `NEXT_PUBLIC_DEMO_TRUCKING_ADMIN_USER` | Trucking CRM | Admin |
| `NEXT_PUBLIC_DEMO_TRUCKING_ADMIN_PASS` | Trucking CRM | Admin |
| `NEXT_PUBLIC_DEMO_TRUCKING_VENDOR_USER` | Trucking CRM | Vendor |
| `NEXT_PUBLIC_DEMO_TRUCKING_VENDOR_PASS` | Trucking CRM | Vendor |

### Site URL — Canonical Base URL

| Variable | Visibility | Required | Description |
|----------|-----------|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Client-exposed | Required for production | Canonical base URL. Used for OG image paths, sitemap, robots.txt, and CSRF origin check in `/api/contact`. Falls back to `https://veridisdev.com` in code if absent. |

### Analytics — Plausible

| Variable | Visibility | Required | Description |
|----------|-----------|----------|-------------|
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Client-exposed | Required for production | Site domain as registered in Plausible. No protocol, no trailing slash. Example: `veridisdev.com`. |
