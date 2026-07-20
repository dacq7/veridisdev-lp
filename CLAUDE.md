# Veridis Dev — Landing Page

## What is this project

Landing page profesional para **Veridis Dev**, estudio de desarrollo de software fundado por Diego Correa en Medellín, Colombia. Veridis se especializa en construir software agénticamente — con proceso visible y auditable — para PYMEs y startups en Colombia y LATAM.

**Meaning of the name**: Veridis viene del latín *veritas* (verdad). El estudio se posiciona como la contraparte honesta y verificable de las agencias tradicionales.

## Business context

- **Target market**: PYMEs y startups en Colombia/LATAM que necesitan software real, no plantillas
- **Diferenciador**: proceso agéntico visible + integraciones locales (Wompi, Alegra DIAN, PSE, Nequi, Coordinadora)
- **Servicios**: 6 categorías con 3-4 tiers cada una (ver `src/config/pricing.ts` — single source of truth)
- **Landing Express**: producto de entrada a $300 USD / $1.05M COP, 3-5 días de entrega

## Tech stack

- **Framework**: Next.js 16.2.6 (App Router, RSC + client islands)
- **Language**: TypeScript strict
- **Styling**: Tailwind CSS v4 (NO downgrade a v3)
- **Animations**: Framer Motion
- **i18n**: next-intl (ES/EN)
- **CMS**: Sanity Studio embebido en `/studio` para blog + case studies
- **Analytics**: Plausible (configurable via env)
- **Contact form**: Resend + Upstash rate limiting
- **Deploy**: Vercel
- **Domain**: veridisdev.com (production)

## Current state (as of July 2026)

- Rama principal: `v2` (todo el trabajo agéntico del pre-launch vive aquí)
- Producción: `main` con deploy automático a veridisdev.com
- Lanzamiento oficial pendiente: merge de v2 hacia main
- Sanity Studio funcional pero sin contenido publicado aún
- Sentry deferido a post-launch (incompatibilidad con Turbopack + Next.js 16)

## Agentic workflow

Este proyecto usa un equipo de 16 agentes especializados en `.claude/agents/`. La misma composición se usa en los proyectos hijos del portafolio (Kensho, Alethia, BarberOS, Trucking CRM) para consistencia.

### Engineering (8)
- `engineering-codebase-onboarding-engineer` — primer análisis de código
- `engineering-software-architect` — decisiones de arquitectura
- `engineering-senior-developer` — implementación
- `engineering-frontend-developer` — React/Next.js específico
- `engineering-code-reviewer` — revisión pre-merge
- `engineering-technical-writer` — documentación, ADRs, READMEs
- `engineering-git-workflow-master` — commits limpios, PRs, branching
- `engineering-security-engineer` — auth, secrets, headers

### Design (3)
- `design-ui-designer` — mejoras visuales
- `design-ux-architect` — flujos y jerarquía
- `design-brand-guardian` — coherencia visual del sistema Veridis

### Product (1)
- `product-manager` — perspectiva del cliente final

### Testing (4)
- `testing-test-results-analyzer` — cobertura y calidad
- `testing-accessibility-auditor` — WCAG compliance
- `testing-performance-benchmarker` — Core Web Vitals
- `testing-api-tester` — endpoints de contact form + Sanity

## Global skills available

Las siguientes skills están instaladas globalmente en `~/.claude/skills/` y disponibles en cualquier sesión de Claude Code:

- **`frontend-design`** (Anthropic) — anti "AI slop", identidad visual deliberada
- **`brand-guidelines`** (Anthropic) — coherencia visual entre artefactos
- **`test-driven-development`** (obra/superpowers) — RED-GREEN-REFACTOR
- **`webapp-testing`** (Anthropic) — Playwright
- **`taste-skill`** — referencia estética

## Brand Identity

Sistema de diseño ya establecido y estable. No inventar variantes sin razón fuerte.

- **Primary color**: `#0D5C3A` (verde esmeralda oscuro)
- **Accent color**: `#1A8A5A` (verde esmeralda claro)
- **Background**: `#0F1A14` (negro profundo con tinte verde)
- **Text**: `#FFFFFF` (principal) / `#4A6B58` (secundario)
- **Logo**: hexágono con V interior en verde esmeralda
- **Fonts**: DM Sans (sans) + Syne (display), via `next/font/google`
- **Aesthetic**: luxury tech oscuro, preciso, refinado. Referencias: Linear, Vercel, Stripe

## Anti-patterns visuales (nunca)

- Inter, Roboto, Arial (fuentes genéricas)
- Purple gradients
- Layouts predecibles/templated
- "AI slop" — cards redondeadas por default sin razón
- Emojis en interfaces profesionales

## Coding principles

1. **TypeScript estricto** — `npm run build` debe pasar con 0 errores
2. **RSC first, client islands cuando sea necesario** — usar `'use client'` solo donde se justifique
3. **i18n en JSON** — nunca strings hardcoded en componentes visibles
4. **Framer Motion variants como constantes module-level** — no dentro del componente
5. **Single source of truth**: `pricing.ts` para precios, `site-config.ts` para constantes de marca
6. **Commits pequeños por scope** — un cambio lógico por commit

## Constraints for AI agents (críticas)

- **NO downgrade Next.js** — la versión 16.2.6 es la actual, no bajar a 14 o 15
- **NO cambiar Tailwind a v3** — el proyecto usa v4
- **NO reactivar Sentry** — está deferido hasta que la compatibilidad con Turbopack se resuelva. Volver a activarlo hoy rompe el build
- **NO tocar el matcher del middleware** sin verificar que `/studio` sigue excluido (bug conocido, ver commit b655fe5)
- **NO mentir en métricas o testimonios** — todos los números deben ser verificables. Veridis vende veritas
- **NO commitear secretos** — verificar `.gitignore` incluye `.env.local` antes de commitear cualquier config
- **Producción es sagrada** — main deploya automáticamente a veridisdev.com. Trabajar siempre en v2 o feature branches

## Pricing tiers (referencia rápida)

Precios canónicos en `src/config/pricing.ts`. Landing tiene 4 tiers, el resto 3.

| Servicio | T0 | T1 | T2 | T3 |
|----------|-----|-----|-----|-----|
| landing | $300 | $800 | $1,500 | $3,500 |
| reservation | — | $1,000 | $2,200 | $4,000 |
| webapp | — | $1,500 | $3,300 | $7,000 |
| ecommerce | — | $1,800 | $3,800 | $9,000 |
| mobile | — | $2,500 | $4,800 | $8,500 |
| maintenance | — | $50/mo | $150/mo | $400/mo |

Retainer solo aplica a productos con estado (webapp, ecommerce, mobile). Landings incluyen 1 año de hosting.

## Projects in portfolio

Referencia de las cards en `src/components/Projects.tsx`. Cada proyecto es un espejo público sanitizado del código real del cliente. El nombre del cliente aparece solo en los case studies de Sanity (con autorización), nunca en el repo público del espejo.

1. **Kensho** — Martial Arts Management (React + Node.js + PostgreSQL + Prisma + Jest)
2. **BarberOS** — Barbershop SaaS (React + FastAPI + PostgreSQL + Supabase + Pytest)
3. **Trucking CRM** — Insurance pipeline (React + TypeScript + Node.js + Prisma)

Próximamente: Alethia (e-commerce colombiano, espejo de Itza Beauty).

## File structure

Next.js App Router con next-intl. Rutas principales:

- `src/app/layout.tsx` — root layout con providers
- `src/app/[locale]/layout.tsx` — locale-specific
- `src/app/[locale]/page.tsx` — home
- `src/app/[locale]/blog/page.tsx` — blog index
- `src/app/[locale]/blog/[slug]/page.tsx` — post detail
- `src/app/studio/[[...tool]]/page.tsx` — Sanity Studio embebido
- `src/app/api/contact/route.ts` — contact form endpoint
- `src/app/api/og/` — OG images dinámicas
- `src/components/` — UI components
- `src/config/pricing.ts` — single source of truth de precios
- `src/lib/` — utils
- `src/messages/es.json` y `src/messages/en.json` — i18n
- `middleware.ts` — next-intl matcher (excluye /studio, /api, etc.)

## Common tasks and where to start

### Cambiar precios
Editar `src/config/pricing.ts`. Los componentes consumen desde ahí.

### Añadir un caso de estudio
Crear en Sanity Studio en `/studio`. Aparece automáticamente en `/[locale]/blog` y en la BlogPreview del home.

### Modificar la landing
Componentes en `src/components/`. Textos en `src/messages/es.json` y `en.json`. Cualquier string visible en pantalla debe estar en i18n.

### Verificar build antes de commit
Correr `npm run build` seguido de `npm run lint`.

## References

- **Production**: https://veridisdev.com
- **Repo**: https://github.com/dacq7/veridisdev-lp
- **Portfolio projects**: Kensho (kensho.veridisdev.com), BarberOS, Trucking CRM
- **Founder**: Diego Correa (Medellín, Colombia) — team@veridisdev.com
