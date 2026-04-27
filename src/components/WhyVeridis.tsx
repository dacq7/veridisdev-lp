'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// ── Types ─────────────────────────────────────────────────────────────────────

type Differentiator = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
};

// ── Icons (stroke only, inherited from <svg>) ─────────────────────────────────

const SVG_BASE = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: '#1A8A5A',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function IconCpu() {
  return (
    <svg {...SVG_BASE}>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <path d="M6 9H3M6 12H3M6 15H3M18 9h3M18 12h3M18 15h3" />
      <path d="M9 6V3M12 6V3M15 6V3M9 18v3M12 18v3M15 18v3" />
    </svg>
  );
}

function IconRocket() {
  return (
    <svg {...SVG_BASE}>
      <path d="M12 2C8 7 8 13 8 13h8s0-6-4-11z" />
      <path d="M8 13l-3 6 5-2.5M16 13l3 6-5-2.5" />
      <circle cx="12" cy="10" r="1.5" />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg {...SVG_BASE}>
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 12l10 5 10-5" />
      <path d="M2 17l10 5 10-5" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg {...SVG_BASE}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────

const DIFFERENTIATORS: Differentiator[] = [
  {
    id: 'ai',
    icon: <IconCpu />,
    title: 'AI-assisted development',
    description:
      'We use Cursor and Claude to build faster without cutting corners. What takes agencies weeks, we ship in days — with tests and documentation included.',
  },
  {
    id: 'production',
    icon: <IconRocket />,
    title: 'Production-ready from day one',
    description:
      'Every project is deployed, monitored and running with real users. No demos, no prototypes — working software that businesses rely on daily.',
  },
  {
    id: 'fullstack',
    icon: <IconLayers />,
    title: 'Full stack, end to end',
    description:
      'Frontend, backend, database, deployment and maintenance — one team, one point of contact, zero handoff problems.',
  },
  {
    id: 'tested',
    icon: <IconShield />,
    title: 'Tested and documented',
    description:
      '110+ tests across our production projects. Every codebase ships with a test suite and documentation — not just working code, but maintainable code.',
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

// ── Card ──────────────────────────────────────────────────────────────────────

function DiffCard({ item }: { item: Differentiator }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={CARD_ITEM}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{
        scale: 1.02,
        transition: { type: 'spring', stiffness: 300, damping: 25 },
      }}
      style={{
        background: '#1A2820',
        borderRadius: '12px',
        padding: '36px',
        border: `1px solid ${hovered ? 'rgba(26, 138, 90, 0.35)' : 'rgba(26, 138, 90, 0.12)'}`,
        boxShadow: hovered ? '0 0 24px rgba(26, 138, 90, 0.08)' : 'none',
        transition: 'border-color 300ms, box-shadow 300ms',
      }}
    >
      {/* Icon container */}
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'rgba(26, 138, 90, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          flexShrink: 0,
        }}
      >
        {item.icon}
      </div>

      {/* Title */}
      <h3
        className="font-display font-semibold text-white"
        style={{ fontSize: '20px', marginBottom: '12px', lineHeight: '1.3' }}
      >
        {item.title}
      </h3>

      {/* Description */}
      <p
        className="font-sans text-text-secondary"
        style={{ fontSize: '15px', lineHeight: '1.6' }}
      >
        {item.description}
      </p>
    </motion.div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function WhyVeridis() {
  return (
    <section
      id="why"
      className="relative py-24 md:py-32"
      style={{
        backgroundImage: [
          'radial-gradient(circle, rgba(26, 138, 90, 0.25) 1px, transparent 1px)',
          'linear-gradient(135deg, #0F1A14 0%, #0D1A11 100%)',
        ].join(', '),
        backgroundSize: '24px 24px, 100% 100%',
      }}
    >
      {/* Ambient glow — center */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 800px 600px at 50% 50%, rgba(13, 92, 58, 0.07), transparent)',
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
            Why Veridis Dev
          </p>
          <h2 className="font-display font-semibold text-white text-4xl md:text-5xl mb-4">
            Built different.
          </h2>
          <p className="font-sans text-text-secondary text-base leading-relaxed max-w-lg">
            Not a freelancer. Not a big agency. A focused software company that ships.
          </p>
        </motion.div>

        {/* 2×2 grid */}
        <motion.div
          variants={GRID_CONTAINER}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
        >
          {DIFFERENTIATORS.map((item) => (
            <DiffCard key={item.id} item={item} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}
