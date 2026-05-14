# PROMOTABLE-ASSETS.md

**Author:** Codebase Archaeologist
**Date:** 2026-05-10
**Repo audited:** veridisdev-lp (v1, pre-Sprint 1)
**Status:** Final

---

## Asset: MagneticButton Component

- **File:** `src/components/MagneticButton.tsx`
- **LOC:** 56
- **What it does:** Wraps any children in a `motion.div` that applies spring-physics mouse attraction when the pointer enters an 80px radius. Deactivates automatically on touch devices via `window.matchMedia('(pointer: fine)')`. Configurable `strength` prop (default 0.3).
- **Why it is promotable:** Self-contained, zero dependencies beyond `framer-motion` and React. No business logic. No hardcoded brand values. Correct cleanup of global event listener. Can be dropped into any Veridis project using Framer Motion with no modification.
- **What needs updating before use:** Nothing. The `ACTIVE_RADIUS` constant (`MagneticButton.tsx:17`) and `SPRING_CFG` (`MagneticButton.tsx:16`) could be made configurable via props, but the defaults are sensible as-is.

---

## Asset: CustomCursor Component

- **File:** `src/components/CustomCursor.tsx`
- **LOC:** 154
- **What it does:** Renders a two-part custom cursor (dot + lagged ring) that changes shape based on what element the cursor is hovering (interactive elements, text, default). Activates only on fine-pointer desktop devices and not on touch or narrow viewports. Listens to `MediaQueryList` changes to deactivate if device changes.
- **Why it is promotable:** Implements the correct detection stack (touch, pointer-fine, narrow screen). The `CONFIG` object (`CustomCursor.tsx:12-21`) cleanly maps cursor states to dimensions, making it easy to customize the ring behavior. The `detectState()` function (`CustomCursor.tsx:25-29`) uses DOM traversal rather than element tagging, so it works without any markup changes.
- **What needs updating before use:** The color `#1A8A5A` is hardcoded in `CustomCursor.tsx:119` and `CustomCursor.tsx:148`. For a different brand color, two lines need updating. Optionally, the color could be extracted to a prop or CSS variable.

---

## Asset: TouchRipple Component

- **File:** `src/components/TouchRipple.tsx`
- **LOC:** 54
- **What it does:** Attaches a global `touchstart` listener to the document and renders animated green circle ripples at each touch point. Self-managing — removes completed ripples from state after animation. Uses `AnimatePresence` for exit animations.
- **Why it is promotable:** Zero dependencies beyond `framer-motion`. No business logic. Correct use of `{ passive: true }` on the event listener. Correct cleanup on unmount.
- **What needs updating before use:** The color `rgba(26, 138, 90, 0.25)` is hardcoded at `TouchRipple.tsx:44`. For a different brand, one line changes. Ripple size (80px at `TouchRipple.tsx:36`) and duration (0.6s) could be made configurable but are reasonable defaults.

---

## Asset: `esc()` HTML Sanitizer Function + `buildHtml()` Email Builder Pattern

- **File:** `src/app/api/contact/route.ts:20-86`
- **LOC:** 67 (the two functions combined)
- **What it does:** `esc()` performs standard five-character HTML escaping on user input strings. `buildHtml()` assembles an HTML email body using inline-styled table layout, applying `esc()` to every user-supplied value. The `optRow()` helper renders optional fields with a "Not specified" fallback.
- **Why it is promotable:** This is the correct pattern for transactional email assembly. The separation of escaping from templating, the inline style approach (required for email client compatibility), and the optional field handling are all production-correct. Any Veridis project that sends HTML emails from user input can reuse this pattern.
- **What needs updating before use:** Brand colors (`#0F1A14`, `#1A8A5A`, `#4A6B58`, `#ffffff`) are hardcoded in style strings at `route.ts:31-33`. The `ContactBody` type and the specific fields need adjustment for different form schemas.

---

## Asset: i18n Navigation Wrapper

- **File:** `src/i18n/navigation.ts`
- **LOC:** 6
- **What it does:** Re-exports `Link`, `redirect`, `usePathname`, `useRouter` from `next-intl/navigation` with `locales: ['en', 'es'] as const` and `defaultLocale: 'en'`. These typed exports prevent using the wrong locale string anywhere in the app.
- **Why it is promotable:** This is the correct way to expose locale-aware navigation in a next-intl project. It provides a single import point for all navigation utilities, ensuring locale typing is enforced.
- **What needs updating before use:** The `locales` array (`navigation.ts:3`) needs to be updated to match the new project's supported locales.

---

## Asset: `request.ts` i18n Server Loader

- **File:** `src/i18n/request.ts`
- **LOC:** 13
- **What it does:** `getRequestConfig` handler that reads the request locale, validates it against the supported list, calls `notFound()` for invalid locales, and dynamically imports the correct messages JSON file.
- **Why it is promotable:** This is the canonical next-intl server-side configuration file. The pattern of dynamic `import(`../messages/${locale}.json`)` is the correct one for avoiding loading all locale files in memory.
- **What needs updating before use:** The `locales` array at `request.ts:4` and the import path for message files.

---

## Asset: Contact API Route Handler

- **File:** `src/app/api/contact/route.ts`
- **LOC:** 125
- **What it does:** POST handler that parses JSON body, validates required fields server-side, sanitizes all user input with `esc()`, constructs an HTML email, and sends it via the Resend API. Returns typed JSON responses.
- **Why it is promotable:** The validation pattern, error handling structure (try/catch on JSON parse, then field checks, then API call), and logging (`console.error` at `route.ts:119`) are all correct. The `ContactBody` type definition (`route.ts:6-16`) documents the schema explicitly.
- **What needs updating before use:** (1) Add email format validation before line 111. (2) Add rate limiting (e.g., via Upstash Ratelimit or Vercel Edge rate limiting). (3) Update `to` and `from` addresses at `route.ts:112-113`. (4) Update the `ContactBody` type to match the new form fields. (5) Update `buildHtml()` for the new schema.

---

## Asset: Resend Client Singleton

- **File:** `src/lib/resend.ts`
- **LOC:** 3
- **What it does:** Creates and exports a single Resend client instance initialized from `process.env.RESEND_API_KEY`.
- **Why it is promotable:** Module-level singleton pattern prevents multiple client instantiations. The pattern is identical to how all Resend integrations should be structured.
- **What needs updating before use:** Nothing. Copy as-is. Environment variable name is already standard.

---

## Asset: Brand Identity Visual System (SVG Assets + CSS Tokens)

- **Files:**
  - `public/logo/veridis-icon.svg` — Hexagon + V logo mark
  - `src/app/globals.css:3-14` — Design token definitions
- **What it does:** The SVG logo is a clean, minimal hexagon-V mark used in Navbar, Footer, About section (as an animated variant), and as the favicon. The CSS token block defines the 5-color brand palette and 2-font-family system.
- **Why it is promotable:** The SVG is clean (no raster, no external dependencies, scales to any size). The token structure maps cleanly to Tailwind v4's `@theme` syntax. The palette is coherent and documented.
- **What needs updating before use:** Nothing for the Veridis brand. For client projects, all five `--color-*` values and both `--font-*` values need replacing.

---

## Asset: Marquee Component

- **File:** `src/components/Marquee.tsx`
- **LOC:** 50
- **What it does:** Renders a CSS-animated infinite horizontal ticker. Duplicates the content string to create a seamless loop. Pauses on hover via CSS `animation-play-state: paused`. Content is sourced from the i18n system.
- **Why it is promotable:** Simple, correct, no JavaScript event listeners for the animation itself (pure CSS). The pause-on-hover mechanism works without JavaScript. Can display any string content.
- **What needs updating before use:** The `aria-hidden="true"` at `Marquee.tsx:16` is correct for decorative marquees but should be reconsidered if the marquee displays navigation-relevant content. The content string needs replacing for non-Veridis usage.

---

## Asset: Project Screenshots

- **Files:**
  - `public/images/barberos-screenshot.png`
  - `public/images/budokan-screenshot.png`
  - `public/images/trucking-screenshot.png`
- **What it does:** Application screenshots displayed inside the terminal frames in the Projects section.
- **Why it is promotable:** These are production screenshots of live, working applications. For future portfolio/marketing sites, these exact images can be reused to demonstrate the same projects.
- **What needs updating before use:** Nothing for Veridis Dev marketing use. For v2 of this site, screenshots may need re-capturing if the applications have changed.
