# CHANGELOG — Pre-launch (Veridis Dev landing)

Registro de las intervenciones previas al lanzamiento oficial de veridisdev.com.

> **Nota de transparencia (Veridis = verdad):** el repositorio no contiene un
> directorio `.claude/agents/`, por lo que los "agentes especializados" descritos
> abajo no se ejecutaron como subagentes independientes. Todo el trabajo lo realizó
> Claude (Opus 4.8) actuando en cada rol. Se conservan los nombres de rol para
> trazabilidad del proceso, no para simular una orquestación que no ocurrió.

---

### 2026-07-20 13:05 — engineering-technical-writer
- Qué hizo: redactó las copias nuevas en ES/EN — categoría "Gestión de Artes
  Marciales / Martial Arts Management" y descripción de Kensho sin referencia al
  cliente real; badge y stat "10+ apps en producción / 10+ apps in production"; y
  el contenido de la sección "En cifras / By the numbers" (3 métricas: años de
  experiencia, clientes en producción, integraciones fiscales y de pago).
- Archivos tocados: `src/messages/es.json`, `src/messages/en.json`
- Razón: reemplazar copy no autorizado o inventado por texto verificable y bilingüe consistente.

### 2026-07-20 13:05 — design-brand-guardian
- Qué hizo: verificó que la sección "En cifras" conserva el sistema visual del
  resto de la landing (paleta #0F1A14 / #1A2820 / #1A8A5A, tipografías Syne + DM
  Sans, radios y bordes de card, grid de 3 columnas) y que las animaciones Framer
  Motion (stagger, hover scale, tilt 3D, beam táctil, whileTap) se mantienen.
  Confirmó que el ícono decorativo ocupa el mismo slot que las iniciales previas.
- Archivos tocados: `src/components/TrackRecord.tsx` (revisión), `src/components/About.tsx` (revisión)
- Razón: coherencia visual y de marca antes del launch.

### 2026-07-20 13:05 — engineering-senior-developer
- Qué hizo: implementó los cambios de código —
  1. Rebrand Budokan → Kensho en `Projects.tsx` (id, categoría, título,
     descripción, liveUrl `kensho.veridisdev.com`, repoUrl, imgSrc
     `kensho-screenshot.png`, terminalPath).
  2. Métrica "3" → "10+" en `Hero.tsx` (glitch del terminal) y en el contador
     animado de `About.tsx` (`STAT_BASE` end 3 → 10, sufijo "+ apps") para evitar
     la contradicción 3-vs-10+ dentro de la misma página.
  3. Rename `Testimonials.tsx` → `TrackRecord.tsx` con `git mv`, reescritura del
     componente para renderizar métricas desde i18n, y actualización del import en
     `page.tsx`.
- Archivos tocados: `src/components/Projects.tsx`, `src/components/Hero.tsx`,
  `src/components/About.tsx`, `src/components/TrackRecord.tsx`
  (antes `Testimonials.tsx`), `src/app/[locale]/page.tsx`
- Razón: ejecutar los cambios 1–3 preservando TypeScript strict y las interacciones.

### 2026-07-20 13:10 — engineering-code-reviewer
- Qué hizo: validó `npm run build` (0 errores, 11/11 páginas generadas),
  `npm run lint` (14 warnings pre-existentes, 0 nuevos), JSON parseable en ES/EN, y
  el grep de i18n huérfano `Budokan|SKIF|budokan-app` → 0 líneas. Detectó y señaló
  que el texto visible de Projects proviene del i18n (no del array), por lo que el
  rebrand exigía editar también `projects.items[0]` en ambos JSON.
- Archivos tocados: ninguno (revisión); hallazgo aplicado en `src/messages/*.json`
- Razón: garantizar cero regresiones y cero copy antiguo antes de merge.

### 2026-07-20 13:12 — engineering-git-workflow-master
- Qué hizo: estructuró el trabajo en commits por scope sobre la rama `v2`:
  `refactor(projects)`, `refactor(hero,i18n)`, `refactor(metrics)` y este `docs`.
- Archivos tocados: historial de git (rama `v2`)
- Razón: commits atómicos y legibles por scope; el merge a `main` lo hace el usuario.

---

## Notas / seguimiento (fuera de este alcance)

- `src/config/demo-credentials.ts` conserva la clave `budokan` y las variables de
  entorno `NEXT_PUBLIC_DEMO_BUDOKAN_*`. No se renombraron: son internas, no visibles
  al usuario, no aparecen en el grep objetivo, y renombrarlas arrastra cambios en
  `.env.local`. Queda para el cleanup separado.
- `public/images/budokan-screenshot.png` **no se elimina** en estos commits (borrado
  planificado en un cleanup separado). La landing ya referencia `kensho-screenshot.png`.
- Decisión de datos confirmada con el usuario: "4 años de experiencia" (sección En
  cifras) y "1 año construyendo software en producción" (About) coexisten como
  métricas distintas; no se unificaron.
