# WEAKNESSES.md

**Author:** Codebase Archaeologist
**Date:** 2026-05-10
**Repo audited:** veridisdev-lp (v1, pre-Sprint 1)
**Status:** Final

---

[HIGH] The contact API endpoint has no rate limiting — it is open to spam and Resend quota exhaustion. See item 1 below.

---

## [HIGH] 1. Contact API Has No Rate Limiting, No Email Format Validation, No CSRF Protection

File: `src/app/api/contact/route.ts:90-124`

The POST endpoint accepts any request. Three specific gaps:

**No rate limiting**: Any IP can send unlimited POST requests to `/api/contact`. Resend's free tier is 3,000 emails/month. A single curl loop can exhaust this quota in seconds, silencing all legitimate leads. No IP-based throttling, no token bucket, no Vercel Edge rate limiting configuration exists in this repo.

**No email format validation**: `route.ts:101-108` checks `!email?.trim()` — presence only. A request body of `{"email": "notanemail", ...}` passes validation and sends an email. Resend may accept or bounce this silently. The `esc()` function escapes the email for HTML but does not validate its format.

**No CSRF protection**: This is a Next.js API route, not protected by same-site cookie logic. Any third-party page can issue a cross-origin POST to this endpoint from a user's browser. CSRF tokens or `Origin`/`Referer` header checks are absent.

---

## [HIGH] 2. `useIsTouch` Hook Defined 10 Times with Three Different Implementations

Found in: `Navbar.tsx:23`, `Contact.tsx:9`, `About.tsx:16`, `Footer.tsx:47`, `Services.tsx:7`, `Projects.tsx:7`, `TechStack.tsx:7`, `WhyVeridis.tsx:9`, `HowWeWork.tsx:7`, `Testimonials.tsx:7`

The three implementations differ in the initial value they detect:
- `navigator.maxTouchPoints > 0 || 'ontouchstart' in window` (most components)
- `'ontouchstart' in window || navigator.maxTouchPoints > 0` (same check, reversed order)
- `navigator.maxTouchPoints > 0 || 'ontouchstart' in window` (Navbar.tsx, which additionally checks `window.innerWidth` implicitly via the cursor component)

There is no `src/hooks/` directory. The hook has never been extracted. All 10 definitions run the same `useState(false)` + `useEffect` pattern, meaning 10 separate event listeners are registered and 10 state updates fire on the same page load. This does not break functionality but represents technical debt that would require touching 10 files to change the detection logic.

---

## [HIGH] 3. Demo Credentials for Production Systems Hardcoded in Source Code

File: `src/components/Projects.tsx:57-110`

Three sets of production application credentials are hardcoded as JavaScript constants:
- Budokan SKIF: `user: '11111111', pass: 'demo2025'` (`Projects.tsx:58-60`)
- BarberOS: `user: 'admin@barberos.com', pass: 'demo1234'` and `user: 'carlos@barberos.com', pass: 'demo1234'` (`Projects.tsx:83-86`)
- Trucking CRM: `user: 'admin@premiertruckins.com', pass: 'Admin1234!'` and `user: 'maria.gonzalez@premiertruckins.com', pass: 'Vendor1234!'` (`Projects.tsx:108-111`)

These ship in the JavaScript bundle visible to any user. Whether or not these are intentionally public demo accounts, they appear in the client-side bundle and are committed to git history. This is not a leak risk if the accounts are genuinely demo-only, but the pattern is dangerous — if any of these accounts were ever reused in a production context, or if the demo applications have access to real data, this is a direct credential exposure in public source.

---

## [MEDIUM] 4. No `.env.example` File

No `.env.example` or `.env.template` exists in the repo. The only environment variable (`RESEND_API_KEY`) is discoverable only by reading `src/lib/resend.ts:3`. A developer cloning the repo has no documented list of required secrets. If more variables are added in the future, they continue to be undocumented.

---

## [MEDIUM] 5. `proxy.ts` is a Dead/Orphaned File

File: `proxy.ts:1-17`

This file defines a `proxy()` function and a `config` export that duplicates the `middleware.ts:1-16` middleware logic. It is not imported anywhere in the application. It is not the active middleware (Next.js activates `middleware.ts` by convention). Its matcher includes `'/(en|es)/:path*'` while `middleware.ts` uses a different pattern. This file has no runtime effect but adds confusion about which middleware is active.

---

## [MEDIUM] 6. Services Prices Hardcoded as Constants in Component — Not in i18n or Config

File: `src/components/Services.tsx:116-165`

The `SERVICES` array contains hardcoded `copPrice` and `usdPrice` values. The service names and descriptions are correctly in the i18n JSON files, but prices are not. Changing a price requires a code deployment. A price update is a normal business event. If prices are updated in `en.json`/`es.json` (the service descriptions reference "From $600.000 COP" in `CLAUDE.md`), they would still not match `Services.tsx:122,129` because those are separate values. The `CLAUDE.md` prices are also inconsistent with the component prices: CLAUDE.md says landing page is "$600.000 COP" (`CLAUDE.md:32`) but `Services.tsx:122` has `copPrice: 2500000` ($2.5M COP).

---

## [MEDIUM] 7. All Page Components are `'use client'` — No Server Component Optimization

All 16 section components declare `'use client'` at line 1, sending the full JavaScript bundle for every component to the browser. Components like `Footer.tsx`, `Marquee.tsx`, and `Testimonials.tsx` contain data that is entirely static (no user interaction required for initial render) and could render as Server Components with progressive enhancement. The current architecture means the user must download and hydrate ~6,500 lines of TypeScript before any interaction is possible.

---

## [MEDIUM] 8. Page is SSR-only — No Static Generation for an Effectively Static Site

Files: `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`

No `generateStaticParams` is exported from `src/app/[locale]/page.tsx`. No `export const dynamic = 'force-static'`. Every request hits a serverless function. For a page whose content changes only when the developer deploys new code, this is unnecessary. Static generation at build time would eliminate serverless cold-start latency entirely and reduce Vercel function invocations to zero for page loads (only `/api/contact` would need the runtime).

---

## [MEDIUM] 9. Dot-Grid Background Pattern Applied 8 Times Redundantly

The `radial-gradient` dot pattern (`radial-gradient(circle, rgba(26, 138, 90, 0.25) 1px, transparent 1px) / 24px 24px`) is defined in `globals.css:22-24` on the `body` element, which already covers the entire page. It is then redundantly repeated as inline styles on at least 7 section components: `Services.tsx:396-401`, `Projects.tsx:640-644`, `Contact.tsx:991-994`, `Testimonials.tsx:110-115`, `WhyVeridis.tsx:348-354`, `TechStack.tsx:409-413`, `About.tsx:241-244`. Each section override is applying the same value as the body-level default — rendering them no-ops that add noise to the style calculations.

---

## [MEDIUM] 10. `HowWeWork.tsx` Mixes Raw Font Family String References

File: `src/components/HowWeWork.tsx:293-310`

`HowWeWork.tsx` uses raw font family strings: `fontFamily: 'Syne, sans-serif'` and `fontFamily: 'DM Sans, sans-serif'` in inline styles. The design system defines Tailwind custom properties `--font-display` (Syne) and `--font-sans` (DM Sans) at `globals.css:13-14`, exposed as `font-display` and `font-sans` utility classes. Other components use `className="font-display"` and `className="font-sans"` correctly. HowWeWork bypasses this system, creating a divergence that would break the font if the variable names ever change.

---

## [MEDIUM] 11. No Observability — No Error Tracking, No Analytics, No Uptime Monitoring

The codebase has no integration with any of the observability tools listed in the Veridis STANDARD 01. Specifically absent:
- No Sentry (`STANDARD 01`: errors)
- No PostHog (`STANDARD 01`: product analytics)
- No Google Analytics 4 or Microsoft Clarity (`STANDARD 01`: web analytics)
- No Better Stack or UptimeRobot (`STANDARD 01`: uptime)

If the contact form Resend call fails in production, the only trace is a `console.error` at `route.ts:119`. There is no alerting. There is no way to know how many visitors the site receives, where they come from, or how many contact forms are submitted.

---

## [LOW] 12. README.md is the Unmodified Next.js Scaffold README

File: `README.md:1-36`

The README contains only Next.js boilerplate text ("This is a Next.js project bootstrapped with `create-next-app`"). It does not describe what the project is, how to set it up, what environment variables are required, or how to deploy. The substantive documentation is in `CLAUDE.md`, which is an agent context file — not a project README.

---

## [LOW] 13. `proxy.ts` Exports a `config` That Differs from `middleware.ts`

File: `proxy.ts:15-17` vs `middleware.ts:14-16`

The `proxy.ts` config matcher is `['/', '/(en|es)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']` while `middleware.ts` uses `['/((?!api|_next|_vercel|.*\\..*).*)']`. These are different. Since `proxy.ts` is not the active middleware file, this has no runtime effect, but if a future developer imports from `proxy.ts` by mistake, the matcher difference would produce unexpected routing behavior.

---

## [LOW] 14. `eslint.config.mjs` — No Custom Rules Beyond Scaffold Default

File: `eslint.config.mjs`

ESLint is configured with only the Next.js defaults. No rules are added for: unused variables, explicit return types, no-console, import ordering, or react-hooks exhaustive-deps enforcement. Multiple `// eslint-disable-line react-hooks/exhaustive-deps` suppressions exist in `Hero.tsx:132` and `Contact.tsx:349`, indicating the rule is active but suppressed selectively rather than addressed.

---

## [LOW] 15. No CI/CD Pipeline

No `.github/workflows/` directory exists. Deployments appear to rely entirely on Vercel's automatic git-push integration. There is no lint step, no type-check step, and no build verification before deployment. A syntax error that passes ESLint but fails TypeScript compilation would be caught only when Vercel's build fails.

---

## [LOW] 16. `npm audit` Reports 3 Moderate Vulnerabilities

Running `npm audit --omit=dev` surfaces 3 moderate-severity vulnerabilities in `postcss < 8.5.10`, transitive through `next@16.2.4` and `next-intl`. The vulnerability is "XSS via Unescaped `</style>` in CSS Stringify Output" (GHSA-qx2v-qp2m-jg93). The automated fix (`npm audit fix --force`) would downgrade Next.js to 9.x, which is not acceptable. The actual risk is low for this specific site (no CSS is constructed from user input), but the vulnerability is tracked and unresolved.

---

## [LOW] 17. `Contact.tsx` Duplicates `ContactInfo` and `ContactInfoStrip` Logic

Files: `Contact.tsx:128-261` (ContactInfo) and `Contact.tsx:416-464` (ContactInfoStrip)

Both render the email address `team@veridisdev.com` with a copy button. `ContactInfo` is the full left column. `ContactInfoStrip` is a compact version shown below the form. The copy-to-clipboard logic (`navigator.clipboard.writeText`, `setCopied(true)`, timeout to reset) is implemented separately in both with the same logic (`Contact.tsx:132-136` and `Contact.tsx:421-425`). Neither extracts this into a shared `useCopyToClipboard` hook.
