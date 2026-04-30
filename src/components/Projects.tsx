'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

const useIsTouch = () => {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => { setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0); }, []);
  return isTouch;
};

// ── Types ─────────────────────────────────────────────────────────────────────

type Credential = {
  role: string;
  user: string;
  pass: string;
};

type Metric = {
  value?: string;
  label: string;
  italic?: boolean;
};

type Project = {
  id: string;
  category: string;
  title: string;
  description: string;
  stack: string[];
  liveUrl: string;
  repoUrl: string;
  imgSrc: string;
  terminalPath: string;
  credentials: Credential[];
  features: string[];
  metrics: Metric[];
};

// ── Data ──────────────────────────────────────────────────────────────────────

const PROJECTS: Project[] = [
  {
    id: 'budokan',
    category: 'Karate Dojo Management',
    title: 'Budokan SKIF',
    description:
      'Full-featured management platform for a real karate dojo. Student registration, attendance tracking, belt progression, payments and inventory.',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Prisma', 'Jest'],
    liveUrl: 'https://budokan-app.vercel.app',
    repoUrl: 'https://github.com/dacq7/budokan-app',
    imgSrc: '/images/budokan-screenshot.png',
    terminalPath: 'diego@veridis:~/budokan-app',
    credentials: [
      { role: 'Sensei', user: '11111111', pass: 'demo2025' },
      { role: 'Karateca', user: '22222222', pass: 'demo2025' },
    ],
    features: [
      'Belt progression & exam auth',
      'Real-time attendance tracking',
      'Automated fee & mora detection',
    ],
    metrics: [
      { value: '25', label: 'active students' },
      { value: '3', label: 'user roles' },
      { value: '100%', label: 'automated payments' },
    ],
  },
  {
    id: 'barberos',
    category: 'Barbershop SaaS',
    title: 'BarberOS',
    description:
      'Complete SaaS platform for barbershop owners. Online booking, barber schedules, commission tracking and inventory. Role-based access for owners and barbers.',
    stack: ['React', 'FastAPI', 'PostgreSQL', 'Supabase', 'Pytest'],
    liveUrl: 'https://barberos-os.vercel.app/admin/login',
    repoUrl: 'https://github.com/dacq7/barberos-os',
    imgSrc: '/images/barberos-screenshot.png',
    terminalPath: 'diego@veridis:~/barberos-os',
    credentials: [
      { role: 'Admin', user: 'admin@barberos.com', pass: 'demo1234' },
      { role: 'Barber', user: 'carlos@barberos.com', pass: 'demo1234' },
    ],
    features: [
      '3-step public booking',
      '40/60 commission split',
      'Inventory with stock alerts',
    ],
    metrics: [
      { value: '3', label: 'barbers' },
      { value: '24+', label: 'daily appointments' },
      { value: '40/60', label: 'commission split' },
    ],
  },
  {
    id: 'trucking',
    category: 'Insurance Pipeline',
    title: 'Trucking CRM',
    description:
      'CRM for U.S. trucking insurance companies. 8-stage pipeline, role-based access, fleet vehicles, CDL drivers and revenue dashboard.',
    stack: ['React', 'TypeScript', 'Node.js', 'Prisma', 'Jest'],
    liveUrl: 'https://trucking-crm-one.vercel.app/login',
    repoUrl: 'https://github.com/dacq7/trucking-crm',
    imgSrc: '/images/trucking-screenshot.png',
    terminalPath: 'diego@veridis:~/trucking-crm',
    credentials: [
      { role: 'Admin', user: 'admin@premiertruckins.com', pass: 'Admin1234!' },
      { role: 'Vendor', user: 'maria.gonzalez@premiertruckins.com', pass: 'Vendor1234!' },
    ],
    features: [
      '8-stage insurance pipeline',
      'ADMIN/VENDOR role isolation',
      'DOT/MC profiles & fleet registry',
    ],
    metrics: [
      { value: '100+', label: 'active clients' },
      { value: '8', label: 'pipeline stages' },
      { label: 'Still in daily operation', italic: true },
    ],
  },
];

// ── Variants ──────────────────────────────────────────────────────────────────

const HEADER_VARIANT = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const GRID_CONTAINER = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.05 },
  },
};

// Task 2: direction-based entrance via custom prop
// custom=true (index 0,2) → from left (x: -60); custom=false (index 1) → from right (x: 60)
const CARD_ITEM = {
  hidden: (fromLeft: boolean) => ({ opacity: 0, x: fromLeft ? -60 : 60 }),
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

// ── Terminal frame ────────────────────────────────────────────────────────────

const SQUARE_BTN: React.CSSProperties = {
  width: 14,
  height: 14,
  borderRadius: 3,
  background: 'rgba(255,255,255,0.08)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  fontSize: 10,
  color: '#4A6B58',
  lineHeight: 1,
  userSelect: 'none',
};

function TerminalFrame({
  terminalPath,
  children,
}: {
  terminalPath: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: '#0A1510',
        border: '1px solid rgba(26, 138, 90, 0.2)',
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(26, 138, 90, 0.05)',
      }}
    >
      {/* Terminal bar */}
      <div
        style={{
          height: 36,
          background: '#0D1F16',
          borderBottom: '1px solid rgba(26, 138, 90, 0.2)',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 12,
          paddingRight: 12,
          gap: 4,
          flexShrink: 0,
          position: 'relative',
        }}
      >
        {/* Square WM buttons */}
        <span style={SQUARE_BTN}>×</span>
        <span style={SQUARE_BTN}>−</span>
        <span style={SQUARE_BTN}>□</span>

        {/* Terminal path — centered */}
        <span
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'DM Mono, DM Sans, monospace',
            fontSize: 11,
            color: '#1A8A5A',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          {terminalPath}
        </span>

        {/* Running indicator — pulsing green dot */}
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            marginLeft: 'auto',
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: '#1A8A5A',
            boxShadow: '0 0 6px rgba(26, 138, 90, 0.7)',
            flexShrink: 0,
          }}
          aria-hidden="true"
        />
      </div>

      {/* Viewport */}
      <div style={{ overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

// ── Placeholder ───────────────────────────────────────────────────────────────

function ProjectPlaceholder({ name }: { name: string }) {
  return (
    <div
      className="w-full flex items-center justify-center min-h-[260px]"
      style={{
        backgroundColor: '#1A2820',
        backgroundImage: [
          'linear-gradient(rgba(26,138,90,0.06) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(26,138,90,0.06) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: '40px 40px',
      }}
    >
      <span
        className="font-display font-medium select-none text-center px-6"
        style={{
          color: 'rgba(26, 138, 90, 0.3)',
          fontSize: '11px',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
        }}
      >
        {name}
      </span>
    </div>
  );
}

// ── Stack badge ───────────────────────────────────────────────────────────────

function StackBadge({ tech }: { tech: string }) {
  return (
    <span
      className="font-sans text-xs font-medium text-accent px-2.5 py-1 rounded"
      style={{
        background: 'rgba(26, 138, 90, 0.1)',
        border: '1px solid rgba(26, 138, 90, 0.3)',
      }}
    >
      {tech}
    </span>
  );
}

// ── Credentials block ─────────────────────────────────────────────────────────

function CredentialsBlock({ credentials }: { credentials: Credential[] }) {
  return (
    <div
      style={{
        borderTop: '1px solid rgba(26, 138, 90, 0.12)',
        paddingTop: '12px',
        marginTop: '12px',
      }}
    >
      <p
        className="font-sans uppercase tracking-wide mb-1.5"
        style={{ color: '#4A6B58', fontSize: '11px' }}
      >
        Demo credentials
      </p>
      {credentials.map(({ role, user, pass }) => (
        <p key={role} className="flex flex-wrap gap-x-2 leading-relaxed" style={{ fontSize: '11px' }}>
          <span className="shrink-0" style={{ color: '#4A6B58', minWidth: '64px' }}>
            {role}
          </span>
          <span style={{ color: '#1A8A5A', fontFamily: 'monospace', wordBreak: 'break-all' }}>
            {user} / {pass}
          </span>
        </p>
      ))}
    </div>
  );
}

// ── Feature bar (Task 4: staggered pill entrance) ─────────────────────────────

function FeatureBar({ features }: { features: string[] }) {
  return (
    <div
      className="flex flex-wrap md:flex-nowrap overflow-hidden"
      style={{
        padding: '12px 16px',
        background: 'rgba(13, 31, 22, 0.95)',
        borderTop: '1px solid rgba(26, 138, 90, 0.15)',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      {features.map((feature, i) => (
        <span key={feature} style={{ display: 'contents' }}>
          {i > 0 && (
            <span
              aria-hidden="true"
              style={{ color: 'rgba(26, 138, 90, 0.3)', fontSize: 11, flexShrink: 0 }}
            >
              ·
            </span>
          )}
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
              <path d="M2.5 7L5.5 10L11.5 4" stroke="#1A8A5A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span
              className="text-[10px] md:text-[11px]"
              style={{ fontFamily: 'DM Sans, sans-serif', color: '#4A6B58' }}
            >
              {feature}
            </span>
          </motion.span>
        </span>
      ))}
    </div>
  );
}

// ── Metrics row ───────────────────────────────────────────────────────────────

function MetricsRow({ metrics }: { metrics: Metric[] }) {
  return (
    <div
      style={{
        padding: '10px 16px',
        background: 'rgba(26, 138, 90, 0.04)',
        borderTop: '1px solid rgba(26, 138, 90, 0.1)',
        borderBottom: '1px solid rgba(26, 138, 90, 0.1)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 24,
        alignItems: 'center',
      }}
    >
      {metrics.map((metric, i) => (
        <span key={i} style={{ display: 'contents' }}>
          {i > 0 && (
            <span
              aria-hidden="true"
              style={{ color: 'rgba(26, 138, 90, 0.3)', flexShrink: 0 }}
            >
              ·
            </span>
          )}
          <span style={{ display: 'flex', flexDirection: 'column' }}>
            {metric.value !== undefined && (
              <span
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 600,
                  fontSize: 15,
                  color: '#FFFFFF',
                  lineHeight: 1.2,
                }}
              >
                {metric.value}
              </span>
            )}
            <span
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 11,
                color: metric.italic ? '#1A8A5A' : '#4A6B58',
                fontStyle: metric.italic ? 'italic' : 'normal',
              }}
            >
              {metric.label}
            </span>
          </span>
        </span>
      ))}
    </div>
  );
}

// ── Project card ──────────────────────────────────────────────────────────────

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [beaming, setBeaming] = useState(false);
  const [scanning, setScanning] = useState(false);
  const isEven = index % 2 === 0;

  const cardRef = useRef<HTMLElement>(null);
  const inView = useInView(cardRef, { once: false });

  return (
    <motion.article
      ref={cardRef}
      variants={CARD_ITEM}
      custom={isEven}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onTouchStart={() => { setBeaming(true); setTimeout(() => setBeaming(false), 700); }}
      whileTap={{ scale: 0.98, boxShadow: '0 0 0 1px rgba(26,138,90,0.6), 0 0 20px rgba(26,138,90,0.15)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={[
        'flex flex-col overflow-hidden rounded-[12px]',
        isEven ? 'md:flex-row' : 'md:flex-row-reverse',
      ].join(' ')}
      style={{
        position: 'relative',
        background: '#1A2820',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: hovered ? 'rgba(26, 138, 90, 0.45)' : 'rgba(26, 138, 90, 0.12)',
        transition: 'border-color 300ms',
      }}
    >
      <AnimatePresence>
        {beaming && (
          <motion.div
            key="beam"
            initial={{ x: '-100%', opacity: 0.8 }}
            animate={{ x: '200%', opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: 0, left: 0, width: '40%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(26,138,90,0.2), transparent)', pointerEvents: 'none', zIndex: 20, borderRadius: 'inherit' }}
          />
        )}
      </AnimatePresence>
      {/* Image side — 55% width on desktop, full width on mobile */}
      <div
        className="relative shrink-0 md:w-[55%]"
        style={{ padding: '16px', background: '#141F18' }}
        onTouchStart={() => { setScanning(true); setTimeout(() => setScanning(false), 900); }}
      >
        <TerminalFrame terminalPath={project.terminalPath}>
          {imgError ? (
            <ProjectPlaceholder name={project.title} />
          ) : (
            <div style={{ height: '260px', overflow: 'hidden', position: 'relative', backgroundColor: '#0A1510' }}>
              <img
                src={project.imgSrc}
                alt={`${project.title} screenshot`}
                onError={() => setImgError(true)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top center',
                  display: 'block',
                }}
              />
              {/* Task 3: scan line on hover */}
              <AnimatePresence>
                {(hovered || scanning) && (
                  <motion.div
                    key="scanline"
                    initial={{ top: '-2px' }}
                    animate={{ top: '100%' }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute',
                      left: 0,
                      width: '100%',
                      height: '1px',
                      background: 'linear-gradient(90deg, transparent, rgba(26,138,90,0.6), transparent)',
                      pointerEvents: 'none',
                    }}
                    aria-hidden="true"
                  />
                )}
              </AnimatePresence>
            </div>
          )}
        </TerminalFrame>

        <FeatureBar features={project.features} />

        {/* Green tint on hover */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-[12px]"
          style={{
            background: 'rgba(26, 138, 90, 0.04)',
            opacity: hovered ? 1 : 0,
          }}
          aria-hidden="true"
        />
      </div>

      {/* Content side — 45% width on desktop */}
      <div className="flex flex-col flex-1 md:w-[45%]">
        <MetricsRow metrics={project.metrics} />
        <div className="flex flex-col flex-1 p-5 md:p-12">
        {/* Category label */}
        <p className="font-sans text-xs tracking-widest uppercase text-accent mb-2">
          {project.category}
        </p>

        {/* Title */}
        <h3 className="font-display font-semibold text-white text-xl leading-snug mb-3">
          {project.title}
        </h3>

        {/* Description */}
        <p className="font-sans text-text-secondary text-sm leading-relaxed mb-5">
          {project.description}
        </p>

        {/* Stack badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.stack.map((tech) => (
            <StackBadge key={tech} tech={tech} />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-4 mt-auto">
          {/* Task 5: pulse animation when card is in viewport */}
          <motion.a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center border border-accent text-accent font-sans font-medium text-sm rounded-[6px] px-5 py-2.5 transition-all duration-200 hover:bg-accent hover:text-white"
            animate={
              inView
                ? {
                    boxShadow: [
                      '0 0 0px rgba(26,138,90,0)',
                      '0 0 12px rgba(26,138,90,0.4)',
                      '0 0 0px rgba(26,138,90,0)',
                    ],
                  }
                : { boxShadow: '0 0 0px rgba(26,138,90,0)' }
            }
            whileTap={{ scale: 0.95, boxShadow: '0 0 12px rgba(26,138,90,0.5)', transition: { type: 'spring', stiffness: 500, damping: 20 } }}
            transition={
              inView
                ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.8 }
                : { duration: 0.3 }
            }
          >
            Live Demo{' '}
            <motion.span
              whileTap={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            >→</motion.span>
          </motion.a>
          <motion.a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center font-sans font-medium text-sm text-text-secondary hover:text-white transition-colors duration-200 py-2.5"
            whileTap={{ scale: 0.95, color: '#ffffff' }}
            transition={{ duration: 0.15 }}
          >
            View Code
          </motion.a>
        </div>

        {/* Demo credentials */}
        <CredentialsBlock credentials={project.credentials} />
        </div>
      </div>
    </motion.article>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative py-24 md:py-32"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(26, 138, 90, 0.25) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Ambient glow — bottom-left */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 600px 500px at 0% 100%, rgba(26, 138, 90, 0.06), transparent)',
          zIndex: 0,
        }}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16">

        {/* Section header */}
        <motion.div
          variants={HEADER_VARIANT}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="mb-14 md:mb-16"
        >
          <p className="font-sans text-xs tracking-widest uppercase text-accent mb-3">
            Work in production
          </p>
          {/* Task 1: letter reveal on "Projects" */}
          <h2
            className="font-display font-semibold text-white text-4xl md:text-5xl mb-4"
            style={{ perspective: '400px' }}
          >
            {'Projects'.split('').map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20, rotateX: -90 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: i * 0.04,
                }}
                style={{ display: 'inline-block' }}
              >
                {letter}
              </motion.span>
            ))}
          </h2>
          <p className="font-sans text-text-secondary text-base leading-relaxed max-w-lg">
            Real software, deployed and used by real businesses.
          </p>
        </motion.div>

        {/* Alternating horizontal cards */}
        <motion.div
          variants={GRID_CONTAINER}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="flex flex-col gap-6 md:gap-8"
        >
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}
