'use client';

import { motion } from 'framer-motion';

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

const FROM_RIGHT = {
  hidden: { opacity: 0, x: 20 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const, delay: 0.5 },
  },
};

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

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* ── Background layer 1: radial glow behind headline ─────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 32% 58%, rgba(26,138,90,0.06) 0%, transparent 70%)',
        }}
      />

      {/* ── Background layer 2: large decorative hexagon, off-center right ── */}
      <svg
        aria-hidden="true"
        width="720"
        height="720"
        viewBox="0 0 200 200"
        className="absolute right-[-160px] top-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{ opacity: 0.04 }}
      >
        <polygon
          points="40,72 100,38 160,72 160,138 100,172 40,138"
          fill="#1A8A5A"
        />
      </svg>

      {/* ── Background layer 3: grain texture ──────────────────────────── */}
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
        style={{ opacity: 0.045 }}
      >
        <filter id="hero-grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain-filter)" />
      </svg>

      {/* ── Badge desktop: absolute top-right, hidden on mobile ─────────── */}
      <motion.div
        variants={FROM_RIGHT}
        initial="hidden"
        animate="show"
        className="hidden md:block absolute top-24 right-6 md:right-12 lg:right-20 z-10"
      >
        <BadgeInner />
      </motion.div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 pt-20 pb-10">
        <motion.div
          variants={CONTAINER}
          initial="hidden"
          animate="show"
          className="max-w-4xl"
        >
          {/* Badge mobile: in-flow, above headline, hidden on md+ */}
          <motion.div variants={FADE_UP} className="md:hidden mb-6">
            <BadgeInner />
          </motion.div>

          {/* Headline — three intentional line breaks */}
          <motion.h1
            variants={FADE_UP}
            className="font-display tracking-tight"
            style={{ lineHeight: 0.95 }}
          >
            <span
              className="block text-white"
              style={{ fontSize: 'clamp(48px, 8vw, 110px)' }}
            >
              Software
            </span>
            <span
              className="block text-text-secondary"
              style={{ fontSize: 'clamp(48px, 8vw, 110px)' }}
            >
              you can
            </span>
            <span
              className="block text-accent"
              style={{ fontSize: 'clamp(48px, 8vw, 110px)' }}
            >
              trust.
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
            <a
              href="#projects"
              className="inline-flex items-center justify-center w-full md:w-auto border border-accent text-accent font-sans font-medium text-sm rounded-[6px] px-6 py-3 transition-all duration-200 hover:bg-accent hover:text-white"
            >
              See our work
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center w-full md:w-auto bg-accent text-white font-sans font-medium text-sm rounded-[6px] px-6 py-3 transition-all duration-200 hover:bg-primary"
            >
              Get in touch
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Scroll indicator: desktop only ───────────────────────────────── */}
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
