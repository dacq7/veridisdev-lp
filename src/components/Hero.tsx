'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import MagneticButton from '@/components/MagneticButton';

// ── Animation variants ────────────────────────────────────────────────────────

const CONTAINER = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.12,
    },
  },
};

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const TERMINAL_ENTER = {
  hidden: { opacity: 0, x: 24 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const, delay: 0.6 },
  },
};

const STATS_CONTAINER = {
  hidden: {},
  show: {
    transition: { delayChildren: 0.9, staggerChildren: 0.1 },
  },
};

const STAT_ITEM = {
  hidden: { opacity: 0, x: 20 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const HEADLINE_CONTAINER = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const WORD_REVEAL = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

// ── Data ──────────────────────────────────────────────────────────────────────

const TERMINAL_LINES: { text: string; delay: number }[] = [
  { text: '▲ Next.js 15 ready',      delay: 0.9 },
  { text: '✓ compiled in 797ms',     delay: 1.4 },
  { text: '✓ 47 tests passing',      delay: 1.9 },
  { text: '→ Local:  localhost:3000', delay: 2.4 },
  { text: '✓ Deployed to Vercel',    delay: 2.9 },
];

const STATS: { value: string; label: string }[] = [
  { value: '3',               label: 'Apps in production' },
  { value: '110+',            label: 'Tests passing' },
  { value: 'React · FastAPI', label: 'Core stack' },
  { value: 'Vercel · Railway', label: 'Deployed on' },
];

// ── Badge ─────────────────────────────────────────────────────────────────────

const BADGE_STYLE = {
  background: 'rgba(26, 40, 32, 0.9)',
  borderColor: 'rgba(26, 138, 90, 0.25)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
} as const;

function BadgeInner() {
  return (
    <div
      className="inline-flex items-center gap-2.5 rounded-full px-4 py-2.5 border"
      style={BADGE_STYLE}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <motion.span
          animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          className="absolute inline-flex h-full w-full rounded-full bg-accent"
        />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
      </span>
      <span className="font-sans text-xs font-medium text-white/75 whitespace-nowrap tracking-wide">
        3 projects in production
      </span>
    </div>
  );
}

// ── Terminal window ───────────────────────────────────────────────────────────

function TerminalWindow() {
  return (
    <div
      className="rounded-[12px] overflow-hidden"
      style={{
        background: '#0D1F16',
        border: '1px solid rgba(26, 138, 90, 0.2)',
        boxShadow: '0 0 48px rgba(26, 138, 90, 0.08), 0 8px 32px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Header bar */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: '1px solid rgba(26, 138, 90, 0.12)', background: 'rgba(0,0,0,0.2)' }}
      >
        <span className="w-3 h-3 rounded-full bg-[#FF5F57] shrink-0" />
        <span className="w-3 h-3 rounded-full bg-[#FEBC2E] shrink-0" />
        <span className="w-3 h-3 rounded-full bg-[#28C840] shrink-0" />
        <span
          className="ml-2 font-mono text-[11px] select-none"
          style={{ color: 'rgba(26, 138, 90, 0.5)' }}
        >
          veridis ~ npm run dev
        </span>
      </div>

      {/* Terminal body */}
      <div className="px-4 py-4 space-y-1">
        {TERMINAL_LINES.map(({ text, delay }, i) => (
          <div
            key={i}
            className="font-mono text-[12px] leading-relaxed"
            style={{
              color: '#1A8A5A',
              opacity: 0,
              animation: 'termLine 0.4s ease both',
              animationDelay: `${delay}s`,
            }}
          >
            {text}
            {i === TERMINAL_LINES.length - 1 && (
              <span
                className="inline-block ml-0.5 font-mono"
                style={{
                  color: '#1A8A5A',
                  animation: 'cursorBlink 1s step-end infinite',
                  animationDelay: `${delay + 0.4}s`,
                  opacity: 0,
                }}
              >
                ▌
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Stats grid ────────────────────────────────────────────────────────────────

function StatsGrid() {
  return (
    <motion.div
      variants={STATS_CONTAINER}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-2.5"
    >
      {STATS.map(({ value, label }) => (
        <motion.div
          key={label}
          variants={STAT_ITEM}
          className="rounded-[8px] p-3 flex flex-col gap-1"
          style={{
            background: 'rgba(26, 138, 90, 0.06)',
            border: '1px solid rgba(26, 138, 90, 0.15)',
          }}
        >
          <span className="font-display font-medium text-white text-sm leading-snug">
            {value}
          </span>
          <span className="font-sans text-text-secondary text-[11px] leading-snug">
            {label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const terminalY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const statsY    = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const hexagonY  = useTransform(scrollYProgress, [0, 1], [0,  60]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* CSS keyframes for terminal typewriter */}
      <style>{`
        @keyframes termLine {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>

      {/* ── Background blob 1: primary glow, top-left, breathes up ─── */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(ellipse 600px 400px at 20% 50%, rgba(13, 92, 58, 0.12), transparent)',
        }}
      />

      {/* ── Background blob 2: accent glow, bottom-right, breathes down */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(ellipse 400px 300px at 80% 80%, rgba(26, 138, 90, 0.06), transparent)',
        }}
      />

      {/* ── Background layer 1: radial glow ─────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 32% 58%, rgba(26,138,90,0.06) 0%, transparent 70%)',
        }}
      />

      {/* ── Background layer 2: decorative hexagon + deep parallax ──── */}
      <div
        aria-hidden="true"
        className="absolute right-[-160px] top-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{ opacity: 0.04 }}
      >
        <motion.div style={{ y: hexagonY }}>
          <svg width="720" height="720" viewBox="0 0 200 200">
            <polygon points="40,72 100,38 160,72 160,138 100,172 40,138" fill="#1A8A5A" />
          </svg>
        </motion.div>
      </div>

      {/* ── Background layer 3: grain texture ──────────────────────── */}
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
        style={{ opacity: 0.045 }}
      >
        <filter id="hero-grain-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain-filter)" />
      </svg>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-16 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* ── Left column: headline + subtext + buttons ────────────── */}
          <motion.div
            variants={CONTAINER}
            initial="hidden"
            animate="show"
          >
            {/* Badge — mobile only (in flow above headline) */}
            <motion.div variants={FADE_UP} className="md:hidden mb-6">
              <BadgeInner />
            </motion.div>

            {/* Badge — desktop only (above headline in left column) */}
            <motion.div variants={FADE_UP} className="hidden md:block mb-8">
              <BadgeInner />
            </motion.div>

            {/* Headline — word-by-word blur reveal */}
            <motion.h1
              variants={HEADLINE_CONTAINER}
              className="font-display tracking-tight"
              style={{ lineHeight: 0.95 }}
            >
              <span className="block text-white" style={{ fontSize: 'clamp(48px, 8vw, 110px)' }}>
                <motion.span variants={WORD_REVEAL} style={{ display: 'inline-block' }}>
                  Software
                </motion.span>
              </span>
              <span className="block text-text-secondary" style={{ fontSize: 'clamp(48px, 8vw, 110px)' }}>
                <motion.span variants={WORD_REVEAL} style={{ display: 'inline-block' }}>
                  {'you '}
                </motion.span>
                <motion.span variants={WORD_REVEAL} style={{ display: 'inline-block' }}>
                  can
                </motion.span>
              </span>
              <span className="block text-accent" style={{ fontSize: 'clamp(48px, 8vw, 110px)' }}>
                <motion.span variants={WORD_REVEAL} style={{ display: 'inline-block' }}>
                  trust.
                </motion.span>
              </span>
            </motion.h1>

            {/* Accent divider */}
            <motion.div
              variants={FADE_UP}
              className="mt-7 mb-5 w-10 h-px bg-accent"
              style={{ opacity: 0.45 }}
            />

            {/* Subheadline */}
            <motion.p
              variants={FADE_UP}
              className="font-sans text-text-secondary text-base leading-relaxed max-w-[420px]"
            >
              We build reliable web and mobile software for businesses — faster than traditional agencies, with enterprise-level quality.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={FADE_UP}
              className="mt-8 flex flex-col md:flex-row gap-3"
            >
              <MagneticButton>
                <a
                  href="#projects"
                  className="inline-flex items-center justify-center w-full md:w-auto border border-accent text-accent font-sans font-medium text-sm rounded-[6px] px-6 py-3 transition-all duration-200 hover:bg-accent hover:text-white"
                >
                  See our work
                </a>
              </MagneticButton>
              <MagneticButton>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center w-full md:w-auto bg-accent text-white font-sans font-medium text-sm rounded-[6px] px-6 py-3 transition-all duration-200 hover:bg-primary"
                >
                  Get in touch
                </a>
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* ── Right column: terminal + stats (desktop only) ─────────── */}
          <div className="hidden md:flex flex-col gap-5">
            {/* Terminal — entry animation shell + inner parallax layer */}
            <motion.div
              variants={TERMINAL_ENTER}
              initial="hidden"
              animate="show"
              style={{ rotate: -2 }}
            >
              <motion.div style={{ y: terminalY }}>
                <TerminalWindow />
              </motion.div>
            </motion.div>

            {/* Stats grid — parallax at half terminal speed */}
            <motion.div style={{ rotate: 1, y: statsY }}>
              <StatsGrid />
            </motion.div>
          </div>

        </div>
      </div>

      {/* ── Scroll indicator: desktop only ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5"
        aria-label="Scroll down"
      >
        <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-text-secondary/60 select-none">
          scroll
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(74, 107, 88, 0.6))',
          }}
        />
      </motion.div>
    </section>
  );
}
