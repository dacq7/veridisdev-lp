'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// ── Types ─────────────────────────────────────────────────────────────────────

type TechGroup = {
  label: string;
  techs: string[];
};

// ── Data ──────────────────────────────────────────────────────────────────────

const GROUPS: TechGroup[] = [
  {
    label: 'Frontend',
    techs: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    label: 'Backend',
    techs: ['Python', 'FastAPI', 'Node.js', 'Express'],
  },
  {
    label: 'Database & Infra',
    techs: ['PostgreSQL', 'Supabase', 'Prisma', 'Docker'],
  },
  {
    label: 'Deploy & Testing',
    techs: ['Vercel', 'Railway', 'Jest', 'Pytest'],
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

const GROUP_ITEM = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const PILLS_CONTAINER = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04 },
  },
};

const PILL_ITEM = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

// ── Pill ──────────────────────────────────────────────────────────────────────

function Pill({ name }: { name: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.span
      variants={PILL_ITEM}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="font-sans inline-flex items-center cursor-default select-none"
      style={{
        background: hovered ? 'rgba(26, 138, 90, 0.15)' : 'rgba(26, 138, 90, 0.08)',
        border: `1px solid ${hovered ? 'rgba(26, 138, 90, 0.4)' : 'rgba(26, 138, 90, 0.2)'}`,
        borderRadius: '999px',
        padding: '6px 14px',
        color: '#1A8A5A',
        fontSize: '13px',
        lineHeight: '1',
        transition: 'background 200ms, border-color 200ms',
      }}
    >
      {name}
    </motion.span>
  );
}

// ── Group ─────────────────────────────────────────────────────────────────────

function TechGroup({ group }: { group: TechGroup }) {
  return (
    <motion.div variants={GROUP_ITEM}>
      <p
        className="font-sans uppercase tracking-wide mb-3"
        style={{ color: '#4A6B58', fontSize: '11px', letterSpacing: '0.12em' }}
      >
        {group.label}
      </p>
      <motion.div
        variants={PILLS_CONTAINER}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
        className="flex flex-wrap gap-2"
      >
        {group.techs.map((tech) => (
          <Pill key={tech} name={tech} />
        ))}
      </motion.div>
    </motion.div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function TechStack() {
  return (
    <section
      id="stack"
      className="relative py-24 md:py-32"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(26, 138, 90, 0.25) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Ambient glow — top-left */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 500px 400px at 0% 0%, rgba(26, 138, 90, 0.05), transparent)',
          zIndex: 0,
        }}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">

        {/* Section header */}
        <motion.div
          variants={HEADER_VARIANT}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="mb-14 md:mb-16"
        >
          <p className="font-sans text-xs tracking-widest uppercase text-accent mb-3">
            Tech Stack
          </p>
          <h2 className="font-display font-semibold text-white text-4xl md:text-5xl mb-4">
            Tools we trust.
          </h2>
          <p className="font-sans text-text-secondary text-base leading-relaxed max-w-lg">
            Production-tested technologies across every layer of the stack.
          </p>
        </motion.div>

        {/* 2×2 category grid */}
        <motion.div
          variants={GRID_CONTAINER}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12"
        >
          {GROUPS.map((group) => (
            <TechGroup key={group.label} group={group} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}
