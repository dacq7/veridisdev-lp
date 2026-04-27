'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// ── Types ─────────────────────────────────────────────────────────────────────

type Credential = {
  role: string;
  user: string;
  pass: string;
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
  credentials: Credential[];
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
    credentials: [
      { role: 'Sensei', user: '11111111', pass: 'demo2025' },
      { role: 'Karateca', user: '22222222', pass: 'demo2025' },
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
    credentials: [
      { role: 'Admin', user: 'admin@barberos.com', pass: 'demo1234' },
      { role: 'Barber', user: 'carlos@barberos.com', pass: 'demo1234' },
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
    credentials: [
      { role: 'Admin', user: 'admin@premiertruckins.com', pass: 'Admin1234!' },
      { role: 'Vendor', user: 'maria.gonzalez@premiertruckins.com', pass: 'Vendor1234!' },
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
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const CARD_ITEM = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

// ── Placeholder ───────────────────────────────────────────────────────────────

function ProjectPlaceholder({ name }: { name: string }) {
  return (
    <div
      className="w-full flex items-center justify-center min-h-[300px]"
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
        <p key={role} className="flex gap-2 leading-relaxed" style={{ fontSize: '11px' }}>
          <span className="shrink-0" style={{ color: '#4A6B58', minWidth: '64px' }}>
            {role}
          </span>
          <span style={{ color: '#1A8A5A', fontFamily: 'monospace' }}>
            {user} / {pass}
          </span>
        </p>
      ))}
    </div>
  );
}

// ── Project card ──────────────────────────────────────────────────────────────

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const isEven = index % 2 === 0;

  return (
    <motion.article
      variants={CARD_ITEM}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={[
        'flex flex-col overflow-hidden rounded-[12px]',
        isEven ? 'md:flex-row' : 'md:flex-row-reverse',
      ].join(' ')}
      style={{
        background: '#1A2820',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: hovered ? 'rgba(26, 138, 90, 0.45)' : 'rgba(26, 138, 90, 0.12)',
        transition: 'border-color 300ms',
      }}
    >
      {/* Image side — 55% width on desktop, full width on mobile */}
      <div className="relative overflow-hidden shrink-0 md:w-[55%]">
        <motion.div
          animate={{ scale: hovered ? 1.04 : 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {imgError ? (
            <ProjectPlaceholder name={project.title} />
          ) : (
            <img
              src={project.imgSrc}
              alt={`${project.title} screenshot`}
              onError={() => setImgError(true)}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                transform: 'scale(0.85)',
                transformOrigin: 'top left',
              }}
            />
          )}
        </motion.div>

        {/* Green tint on hover */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: 'rgba(26, 138, 90, 0.08)',
            opacity: hovered ? 1 : 0,
          }}
          aria-hidden="true"
        />
      </div>

      {/* Content side — 45% width on desktop */}
      <div className="flex flex-col flex-1 p-7 md:w-[45%] md:p-12">
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
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center border border-accent text-accent font-sans font-medium text-sm rounded-[6px] px-5 py-2.5 transition-all duration-200 hover:bg-accent hover:text-white"
          >
            Live Demo →
          </a>
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center font-sans font-medium text-sm text-text-secondary hover:text-white transition-colors duration-200 py-2.5"
          >
            View Code
          </a>
        </div>

        {/* Demo credentials */}
        <CredentialsBlock credentials={project.credentials} />
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
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">

        {/* Section header — unchanged */}
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
          <h2 className="font-display font-semibold text-white text-4xl md:text-5xl mb-4">
            Projects
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
