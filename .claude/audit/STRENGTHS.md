# STRENGTHS.md

**Author:** Codebase Archaeologist
**Date:** 2026-05-10
**Repo audited:** veridisdev-lp (v1, pre-Sprint 1)
**Status:** Final

---

## 1. HTML Sanitization on the Contact API Route

The `esc()` function in `src/app/api/contact/route.ts:20-27` escapes `&`, `<`, `>`, `"`, and `'` before inserting user input into the email HTML. This is applied to every field before use in `buildHtml()` at `route.ts:29-86`. The email body is assembled with inline styles rather than external CSS, which avoids a class of CSS injection. This is the correct defense for an HTML email body and it is applied consistently to all user-controlled strings.

## 2. Touch vs. Pointer Device Distinction is Systematic and Correct

The `CustomCursor` component (`CustomCursor.tsx:57-65`) uses a three-condition check — `'ontouchstart' in window`, `navigator.maxTouchPoints > 0`, AND `window.matchMedia('(pointer: fine)').matches` — before activating the custom cursor. It also adds a `MediaQueryList` listener to react to device changes at `CustomCursor.tsx:71-73`. The `MagneticButton` component (`MagneticButton.tsx:29`) uses `(pointer: fine)` as its activation gate. This is sophisticated and correct: it avoids the common trap of using `window.innerWidth < 768` as a touch proxy, which fails on Surface devices and desktop touchscreens.

## 3. Animation Variants are Declared as Named Constants, Not Inline

All Framer Motion animation variants are declared as named module-level constants (`BLOB_ENTER`, `RIGHT_COL`, `HEADLINE_CONTAINER`, `WORD_REVEAL`, `BADGE`, `DIVIDER`, `SUBHEADLINE`, `BUTTONS`, `STATS_CONTAINER`, `STAT_ITEM` in `Hero.tsx:11-100`; similar pattern in every other component). This is the correct pattern — it keeps JSX clean, enables TypeScript inference, and prevents recreation on every render.

## 4. Contact Form HTML Escaping and Server-Side Required Field Validation are Layered

The contact API (`route.ts:99-109`) performs server-side required-field presence checks independent of the client-side form validation in `Contact.tsx:579-597`. Both layers check the same required fields. This means the server cannot be tricked by a direct POST that skips the browser form.

## 5. Accessibility Landmarks are Present on Structural Elements

The `Navbar` uses semantic `<header role="banner">` and `<nav role="navigation" aria-label={t('mainNav')}>` at `Navbar.tsx:202-224`. The hamburger button has `aria-label`, `aria-expanded`, and `aria-controls` attributes (`Navbar.tsx:299-303`). The mobile menu overlay has `role="dialog"`, `aria-modal="true"`, and `aria-label` (`Navbar.tsx:322-328`). Decorative elements throughout use `aria-hidden="true"` consistently (grain SVG at `layout.tsx:74`, decorative hexagon at `Hero.tsx:435`, background blobs at `Hero.tsx:386,405`, scan lines at `Hero.tsx:344`, marquee ticker at `Marquee.tsx:16`).

## 6. Font Loading is Optimized via next/font

Both typefaces (DM Sans and Syne) are loaded through `next/font/google` at `layout.tsx:2-18` with `display: "swap"` and subset `"latin"`. This eliminates flash of unstyled text, eliminates a render-blocking external font request, and inlines the font face CSS. The CSS variables (`--font-syne`, `--font-dm-sans`) are then consumed by the Tailwind `@theme` custom properties at `globals.css:13-14`.

## 7. i18n Message Data for Dynamic Content is Typed via t.raw()

Where message values are arrays or objects (stats, steps, project items, testimonial items), components use `t.raw()` with explicit TypeScript casts (`t.raw('stats') as Array<{ value: string; label: string }>` at `Hero.tsx:294`). This preserves type information rather than relying on string interpolation that would lose structure.

## 8. The `esc()` Function is a Reusable, Well-Structured HTML Sanitizer

`route.ts:20-27` implements the standard five-replacement HTML escaping sequence in a named, testable function. It handles all five standard HTML injection vectors (ampersand, angle brackets, double quote, single quote). It is correctly applied to every user-supplied string before HTML composition.

## 9. Responsive Breakpoint Strategy is Consistent

Throughout all 16 components, the responsive pattern `className="hidden md:flex"` / `className="flex md:hidden"` and mobile-first padding (`px-4 md:px-8 lg:px-16`) is applied uniformly. Section padding follows `py-24 md:py-32` consistently across `Services.tsx:394`, `Projects.tsx:637`, `About.tsx:239`, `WhyVeridis.tsx:344`, `TechStack.tsx:408`, `Contact.tsx:989`. The mobile-specific terminal at `Hero.tsx:484-542` (`block sm:hidden`) demonstrates intentional mobile-first design rather than afterthought.

## 10. The `CLAUDE.md` is Substantive and Well-Structured

The `CLAUDE.md` (`CLAUDE.md:1-106`) contains brand identity values (colors, fonts, design direction), content (service names, prices, project descriptions), project structure, and rules. This is a complete agent context document rather than a token README. It represents the kind of institutional memory that makes AI-assisted development reliable across sessions.

## 11. Framer Motion Scroll Parallax on Hero is Correctly Implemented

The Hero component uses `useScroll` with a `target` ref and `offset` configuration (`Hero.tsx:329-337`) to scope scroll tracking to the hero section specifically, not to the window. This is the correct pattern — window-level scroll tracking would fire across the entire page. The three distinct parallax rates (`terminalY`, `statsY`, `hexagonY` at `Hero.tsx:334-336`) produce a convincing layered depth effect.

## 12. GlitchNumber Animation Properly Cleans Up Its Timers

The `GlitchNumber` component (`Hero.tsx:108-135`) returns a cleanup function from `useEffect` that clears both the `setTimeout` and `setInterval` handles. This prevents memory leaks on unmount. The comment at `Hero.tsx:132` acknowledging the `react-hooks/exhaustive-deps` suppression is honest documentation of a deliberate choice.
