'use client';

import { motion } from 'framer-motion';

// ── Variants ──────────────────────────────────────────────────────────────────

const HEADER_VARIANT = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const COL_LEFT = {
  hidden: { opacity: 0, x: -40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const COL_RIGHT = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

// ── Data ──────────────────────────────────────────────────────────────────────

const STATS = [
  { value: '1 year', label: 'building production software' },
  { value: '3 apps', label: 'currently in production' },
] as const;

// ── Section ───────────────────────────────────────────────────────────────────

export default function About() {
  return (
    <section
      id="about"
      className="relative py-24 md:py-32"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(26, 138, 90, 0.25) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Ambient glow — bottom-right */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 500px 400px at 100% 100%, rgba(13, 92, 58, 0.07), transparent)',
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
            About
          </p>
          <h2 className="font-display font-semibold text-white text-4xl md:text-5xl">
            A developer who ships.
          </h2>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Left — logo composition */}
          <motion.div
            variants={COL_LEFT}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}
          >
            {/* Hexagon + V wrapper — positions glow, rotating hex, and V letter */}
            <div style={{ position: 'relative', width: '200px', height: '200px' }}>
              {/* Ambient glow */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: 'radial-gradient(ellipse 180px 180px at center, rgba(26, 138, 90, 0.1), transparent)',
                  pointerEvents: 'none',
                }}
              />

              {/* Rotating hexagon */}
              <motion.svg
                width="200"
                height="200"
                viewBox="0 0 200 200"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', inset: 0 }}
              >
                <polygon
                  points="40,72 100,38 160,72 160,138 100,172 40,138"
                  fill="rgba(26, 138, 90, 0.06)"
                  stroke="#1A8A5A"
                  strokeWidth="1.5"
                />
              </motion.svg>

              {/* "V" centered inside hex */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <span
                  className="font-display font-bold select-none"
                  style={{ fontSize: '72px', color: '#1A8A5A', lineHeight: 1 }}
                >
                  V
                </span>
              </div>
            </div>

            {/* Name + title */}
            <div style={{ textAlign: 'center' }}>
              <p className="font-display" style={{ fontSize: '18px', fontWeight: 500, color: '#ffffff', marginBottom: '4px' }}>
                Diego Correa
              </p>
              <p className="font-sans" style={{ fontSize: '13px', color: '#4A6B58' }}>
                Founder · Veridis Dev
              </p>
            </div>
          </motion.div>

          {/* Right — copy + stats + link */}
          <motion.div
            variants={COL_RIGHT}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="flex flex-col gap-5"
          >
            <p className="font-sans text-text-secondary text-base leading-relaxed">
              I&apos;m Diego Correa, a full stack developer based in Medellín, Colombia.
              I founded Veridis Dev to build software the right way — tested, documented
              and production-ready from day one.
            </p>
            <p className="font-sans text-text-secondary text-base leading-relaxed">
              I work across the entire stack — from React and Next.js frontends to FastAPI
              and Node.js backends, PostgreSQL databases and cloud deployments on Vercel
              and Railway. Every project I take on gets the same attention to quality,
              regardless of size.
            </p>
            <p className="font-sans text-text-secondary text-base leading-relaxed">
              Currently studying Software Analysis and Development at SENA while building
              real products for real businesses. I believe the best way to learn is to ship.
            </p>

            {/* Stats */}
            <div className="flex gap-10 mt-3">
              {STATS.map(({ value, label }) => (
                <div key={value}>
                  <p className="font-display font-semibold text-white text-2xl leading-none mb-1">
                    {value}
                  </p>
                  <p className="font-sans text-text-secondary text-sm leading-snug">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* GitHub CTA */}
            <a
              href="https://github.com/dacq7"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm font-medium w-fit transition-colors duration-200 hover:text-white"
              style={{ color: '#1A8A5A' }}
            >
              See my GitHub →
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
