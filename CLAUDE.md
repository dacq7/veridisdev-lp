# Veridis Dev — Landing Page

## Project Overview
Landing page profesional para Veridis Dev, empresa de desarrollo de software 
fundada por Diego Correa en Medellín, Colombia.

## Tech Stack
- Next.js 14 + TypeScript
- Tailwind CSS
- Framer Motion
- Resend (contact form)
- Vercel (deploy)

## Brand Identity
- **Primary color:** #0D5C3A (verde esmeralda oscuro)
- **Accent color:** #1A8A5A (verde esmeralda claro)
- **Background:** #0F1A14 (negro profundo con tinte verde)
- **Text:** #FFFFFF (principal) / #4A6B58 (secundario)
- **Logo:** Hexágono con V interior en verde esmeralda

## Aesthetic Direction
Luxury tech — oscuro, preciso, refinado. Similar a Linear, Vercel o Stripe 
pero con identidad propia. NUNCA usar:
- Fuentes genéricas (Inter, Roboto, Arial)
- Purple gradients
- Layouts predecibles
- Diseño genérico de IA

## Content

### Services
1. Landing page profesional — Desde $600.000 COP
2. Sistema de citas y reservas — Desde $1.800.000 COP
3. App web personalizada — Desde $2.500.000 COP
4. Tienda online / Ecommerce — Desde $3.500.000 COP
5. App móvil — Desde $4.000.000 COP
6. Mantenimiento mensual — Desde $200.000 COP

### Projects in Production
1. Budokan SKIF — Karate dojo management
   - Stack: React · Node.js · PostgreSQL · Prisma
   - Live: https://budokan-app.vercel.app
   - Repo: https://github.com/dacq7/budokan-app

2. BarberOS — Barbershop management SaaS
   - Stack: React · FastAPI · PostgreSQL · Supabase
   - Live: https://barberos-os.vercel.app/admin/login
   - Repo: https://github.com/dacq7/barberos-os

3. Trucking CRM — Insurance pipeline
   - Stack: React · TypeScript · Node.js · Prisma
   - Live: https://trucking-crm-one.vercel.app/login
   - Repo: https://github.com/dacq7/trucking-crm

### Why Veridis Dev
1. AI-assisted development — Entregamos proyectos más rápido usando IA
2. Production-ready — Todo en producción con usuarios reales
3. Full stack — Frontend, backend, mobile y deploy
4. Tested — Suite de tests en todos los proyectos

### Tech Stack
React, Next.js, TypeScript, Python, FastAPI, Node.js, PostgreSQL, 
Prisma, Supabase, Docker, Vercel, Railway

## Contact
- Email: team@veridisdev.com
- Location: Medellín, Colombia

## File Structure
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── api/contact/route.ts
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Services.tsx
│   ├── Projects.tsx
│   ├── WhyVeridis.tsx
│   ├── TechStack.tsx
│   ├── Contact.tsx
│   └── Footer.tsx
├── lib/
│   └── resend.ts
└── styles/
    └── globals.css

## Important Rules
- Siempre usar TypeScript estricto
- Todos los componentes son Client o Server según necesidad
- Imágenes en /public/images/
- Variables de entorno en .env.local
- Nunca hardcodear API keys
- Framer Motion para todas las animaciones
- Tailwind para todos los estilos
- Responsivo desde 320px hasta 1920px
