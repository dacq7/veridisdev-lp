# PATTERNS-EXTRACTED.md

**Author:** Codebase Archaeologist
**Date:** 2026-05-10
**Repo audited:** veridisdev-lp (v1, pre-Sprint 1)
**Status:** Final

---

## Pattern: Named Animation Variant Constants

- **Found in:** `src/components/Hero.tsx:11-100`, `src/components/Contact.tsx:51-83`, `src/components/Services.tsx:169-197`, `src/components/Projects.tsx:126-152`, `src/components/WhyVeridis.tsx:81-104`, `src/components/TechStack.tsx:170-237`
- **Solves:** Prevents Framer Motion variant objects from being recreated on every render; keeps JSX clean and readable; enables TypeScript inference on variant names
- **In STANDARDS already?** No
- **Should be promoted?** Yes. This is applied consistently across all animated components. The pattern is: define variant objects as `const` at module level with typed `as const` on easing arrays (e.g., `ease: [0.25, 0.1, 0.25, 1] as const`), then reference by name in JSX. The easing curve `[0.25, 0.1, 0.25, 1]` appears as the default cubic-bezier in 12+ components — it is the de facto house animation easing and should be named in a shared constants file.

---

## Pattern: Touch vs. Pointer-Fine Device Detection

- **Found in:** `src/components/CustomCursor.tsx:57-65`, `src/components/MagneticButton.tsx:29`
- **Solves:** Distinguishes touch screens from desktop pointer devices without relying on viewport width, which fails on tablet/hybrid devices
- **In STANDARDS already?** No
- **Should be promoted?** Yes. The correct implementation is:
  ```typescript
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isPointerFine = window.matchMedia('(pointer: fine)').matches;
  ```
  This combination handles Surface devices, iPads with Magic Keyboard, and desktop touchscreens correctly. Currently duplicated across 10 files as a local hook — it belongs in `src/hooks/useIsTouch.ts`.

---

## Pattern: Staged Scroll-Reveal with `viewport: { once: true }`

- **Found in:** `src/components/Services.tsx:413-419`, `src/components/Projects.tsx:659-694`, `src/components/WhyVeridis.tsx:367-373`, `src/components/HowWeWork.tsx:355-368`, `src/components/Testimonials.tsx:119-149`, `src/components/About.tsx:266-273`
- **Solves:** Animates section headers and cards into view on first scroll without re-triggering on scroll-back, using Framer Motion's `whileInView` with `once: true`
- **In STANDARDS already?** No
- **Should be promoted?** Yes. The pattern is consistent: outer `motion.div` with `variants={HEADER_VARIANT}`, `initial="hidden"`, `whileInView="show"`, `viewport={{ once: true, margin: '-100px' }}`. The `-100px` margin triggers the animation before the element fully enters the viewport. This is the correct behavior for sections. Should be documented as the canonical reveal pattern.

---

## Pattern: Per-Letter Heading Reveal with `rotateX`

- **Found in:** `src/components/Services.tsx:430-441`, `src/components/Projects.tsx:675-690`, `src/components/WhyVeridis.tsx:389-399`, `src/components/TechStack.tsx:455-463`, `src/components/Contact.tsx:1017-1030`
- **Solves:** Creates a typographic reveal effect where each character rotates from -90deg on the X axis into position, producing a "flipping card" entrance
- **In STANDARDS already?** No
- **Should be promoted?** Maybe. This is visually distinctive and tied to the brand aesthetic. The implementation is: `text.split('').map((char, i) => <motion.span initial={{ opacity: 0, y: 20, rotateX: -90 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 0.4, delay: i * 0.04 }} style={{ display: 'inline-block' }}>`)`. It requires the parent to have `style={{ perspective: '400px' }}`. This pattern is repeated 5 times — it meets the promotion threshold (>2 occurrences).

---

## Pattern: HTML Email Builder with Field-Level Escaping

- **Found in:** `src/app/api/contact/route.ts:20-86`
- **Solves:** Generates HTML email body from user-submitted form data with XSS protection via the `esc()` function applied to every field before interpolation
- **In STANDARDS already?** No
- **Should be promoted?** Yes. The `esc()` function (`route.ts:20-27`) is a standalone, testable utility. The `buildHtml()` function (`route.ts:29-86`) demonstrates the correct pattern: separate the escaping from the templating, apply escaping at the point of interpolation, use inline table-based layout for email compatibility. This should be promoted as the standard contact API pattern.

---

## Pattern: CSS Keyframe Animations Injected via `<style>` in JSX

- **Found in:** `src/components/Hero.tsx:371-384` (termLine, cursorBlink, dotPulse), `src/components/Marquee.tsx:24-31` (marquee, paused on hover)
- **Solves:** Applies CSS animations to elements that are styled with inline styles (not Tailwind classes), where Framer Motion's JS-driven approach would be less efficient for looping animations
- **In STANDARDS already?** No
- **Should be promoted?** Maybe. This is an appropriate escape hatch for CSS `animation` properties that Framer Motion does not natively expose (like `animation-play-state: paused` for the marquee hover pause at `Marquee.tsx:27-29`). However, injecting `<style>` tags into component JSX is non-idiomatic in the App Router world and pollutes the global scope. Should be documented as an exception pattern, not the standard.

---

## Pattern: Magnetic Button Wrapper

- **Found in:** `src/components/MagneticButton.tsx:1-56`, used in `Hero.tsx:599,607`, `Navbar.tsx:275-291`
- **Solves:** Applies a spring-physics mouse attraction effect to wrapped buttons on desktop pointer devices only
- **In STANDARDS already?** No
- **Should be promoted?** Yes. `MagneticButton` is a clean, self-contained wrapper component with configurable `strength`, proper cleanup of the global `mousemove` listener, and pointer-fine gate. It wraps any children without coupling to their implementation. This is a promotable UI primitive for any Veridis landing page or product with desktop interactions.

---

## Pattern: Beam Sweep Touch Feedback

- **Found in:** `src/components/Services.tsx:296-317`, `src/components/Projects.tsx:483-492`, `src/components/Testimonials.tsx:247-258`, `src/components/WhyVeridis.tsx:265-274`, `src/components/Footer.tsx:100-102`
- **Solves:** Provides visual tap feedback on mobile by sweeping a semi-transparent green gradient across a card from left to right, triggered by `onTouchStart`
- **In STANDARDS already?** No
- **Should be promoted?** Yes. The implementation is consistent: a `boolean` state (`beaming`), an `AnimatePresence`-wrapped `motion.div` with `initial={{ x: '-100%', opacity: 0.7 }}`, `animate={{ x: '200%', opacity: 0 }}`, `transition={{ duration: 0.5, ease: 'easeInOut' }}`, `position: 'absolute'`, `pointerEvents: 'none'`. The trigger is `onTouchStart` with a `setTimeout` to reset the boolean. This is the canonical mobile tap feedback pattern for this design system.

---

## Pattern: Section Header with Label + Heading + Subtitle

- **Found in:** `src/components/Services.tsx:414-457`, `src/components/Projects.tsx:658-694`, `src/components/About.tsx:266-293`, `src/components/TechStack.tsx:428-475`, `src/components/Contact.tsx:999-1041`, `src/components/WhyVeridis.tsx:366-412`
- **Solves:** Consistent section header composition: small uppercase tracking label in accent color, large display-font heading with reveal animation, muted body-font subtitle
- **In STANDARDS already?** No
- **Should be promoted?** Yes. The structure is: `<p className="font-sans text-xs tracking-widest uppercase text-accent mb-3">`, `<h2 className="font-display font-semibold text-white text-4xl md:text-5xl mb-4">` with letter-reveal, `<p className="font-sans text-text-secondary text-base leading-relaxed max-w-lg">`. This is the landing page's heading system. Should be extracted to a `SectionHeader` component.

---

## Pattern: Dual-State Icon Animation (desktop hover / mobile touch)

- **Found in:** `src/components/Services.tsx:330-343`, `src/components/TechStack.tsx:264-272`, `src/components/WhyVeridis.tsx:207-212`
- **Solves:** Icon elements respond to hover on desktop (via Framer Motion `whileHover`) and to touch on mobile (via `onTouchStart` calling `useAnimation()`)
- **In STANDARDS already?** No
- **Should be promoted?** Maybe. The pattern is correct but verbose — each instance requires 3-5 separate animation control hooks. The underlying principle (different interaction model per device class) is the right approach and worth documenting even if the implementation needs simplification.

---

## Naming Conventions

### Consistent

- Component files: PascalCase, one default export per file (`Hero.tsx`, `Contact.tsx`)
- Animation variant constants: SCREAMING_SNAKE_CASE (`HEADER_VARIANT`, `GRID_CONTAINER`, `CARD_ITEM`)
- Tailwind class composition: string concatenation with ternary (`[classA, classB].join(' ')`) — used in `Navbar.tsx:97-101`, `Services.tsx:226-231`
- Section IDs: lowercase single words matching nav keys (`#services`, `#projects`, `#about`, `#contact`, `#hero`)

### Inconsistent

- `useIsTouch` is defined as both `const useIsTouch = () => {` (arrow, Services, Projects, etc.) and `function useIsTouch() {` (named function, Navbar, About, Footer, Contact)
- Some helper components are defined before the section they belong to in the same file (consistent); `TestimonialCard` in `Testimonials.tsx:197` is defined after the section component it is used in (`Testimonials.tsx:104`) — reverse of the established order.

### CSS Styling Pattern

Two patterns coexist throughout:
1. Tailwind utility classes for layout, typography, spacing: `className="font-sans text-xs tracking-widest uppercase text-accent mb-3"`
2. Inline `style={{}}` for dynamic/brand-specific values: `style={{ color: '#4A6B58', fontSize: '11px' }}`

The boundary: Tailwind is used when the value maps to a design token or a responsive breakpoint; inline style is used when the value is a hardcoded hex color or pixel size not in the token system. This is consistent but indicates that the design token system (at `globals.css:3-14`) is incomplete — `#4A6B58` appears as an inline hex string in dozens of places despite being the `text-secondary` token.
