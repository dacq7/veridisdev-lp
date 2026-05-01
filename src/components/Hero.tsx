'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import MagneticButton from '@/components/MagneticButton';

// ── Animation variants ────────────────────────────────────────────────────────

// Phase 1 — Background awakens (0–800ms)
const BLOB_ENTER = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: 'easeOut' as const },
  },
};

// Phase 2 — Right column (terminal + stats) slides in (600ms–1300ms)
const RIGHT_COL = {
  hidden: { opacity: 0, x: 60, rotateY: 8 },
  show: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const, delay: 0.6 },
  },
};

// Phase 3 — Headline words snap in (900ms–1600ms)
const HEADLINE_CONTAINER = {
  hidden: {},
  show: {
    transition: { delayChildren: 0.9, staggerChildren: 0.06 },
  },
};

const WORD_REVEAL = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)', scaleX: 0.85 },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    scaleX: 1,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

// Phase 4 — Supporting elements settle (1400ms–2200ms)
const BADGE = {
  hidden: { opacity: 0, y: -20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const, delay: 1.4 },
  },
};

const DIVIDER = {
  hidden: { opacity: 0 },
  show: {
    opacity: 0.45,
    transition: { duration: 0.5, delay: 1.55 },
  },
};

const SUBHEADLINE = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.7, delay: 1.6 },
  },
};

const BUTTONS = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 200, delay: 1.8 },
  },
};

// Stats — stagger after right column arrives
const STATS_CONTAINER = {
  hidden: {},
  show: {
    transition: { delayChildren: 1.1, staggerChildren: 0.1 },
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

// ── Data ──────────────────────────────────────────────────────────────────────

type GlitchSeg = { glitch: string; glitchDelay: number };

const TERMINAL_LINES: { segments: (string | GlitchSeg)[]; delay: number }[] = [
  { segments: ['▲ Next.js 16 ready in ', { glitch: '797', glitchDelay: 1200 }, 'ms'], delay: 0.9 },
  { segments: ['✓ TypeScript — zero errors'],                                          delay: 1.4 },
  { segments: ['✓ ', { glitch: '110', glitchDelay: 1800 }, ' tests passing'],         delay: 1.9 },
  { segments: ['✓ ', { glitch: '3',   glitchDelay: 2100 }, ' apps in production'],    delay: 2.4 },
  { segments: ['→ veridisdev.com'],                                                    delay: 2.9 },
];

const STATS: { value: string; label: string }[] = [
  { value: '3',               label: 'Apps in production' },
  { value: '110+',            label: 'Tests passing' },
  { value: 'React · FastAPI', label: 'Core stack' },
  { value: 'Vercel · Railway', label: 'Deployed on' },
];

// ── GlitchNumber ─────────────────────────────────────────────────────────────

function GlitchNumber({ finalValue, delay }: { finalValue: string; delay: number }) {
  const [display, setDisplay] = useState(finalValue);
  const final = parseInt(finalValue, 10);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    const timeout = setTimeout(() => {
      const startMs = Date.now();
      interval = setInterval(() => {
        if (Date.now() - startMs >= 400) {
          setDisplay(finalValue);
          clearInterval(interval!);
          return;
        }
        const offset = Math.floor(Math.random() * 7) - 3;
        setDisplay(String(Math.max(0, final + offset)));
      }, 80);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <span>{display}</span>;
}

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
        style={{
          height: 36,
          background: '#0A1510',
          borderBottom: '1px solid rgba(26, 138, 90, 0.2)',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 12,
          paddingRight: 12,
          gap: 4,
          position: 'relative',
          flexShrink: 0,
        }}
      >
        {/* Square WM buttons */}
        {(['×', '−', '□'] as const).map((icon) => (
          <span
            key={icon}
            aria-hidden="true"
            style={{
              width: 14, height: 14, borderRadius: 3,
              background: 'rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, fontSize: 10, color: '#4A6B58',
              lineHeight: 1, userSelect: 'none',
            }}
          >
            {icon}
          </span>
        ))}

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
          diego@veridis:~$ npm run dev
        </span>

        {/* Running indicator — CSS pulsing green dot */}
        <span
          aria-hidden="true"
          style={{
            marginLeft: 'auto',
            width: 7, height: 7,
            borderRadius: '50%',
            background: '#1A8A5A',
            boxShadow: '0 0 6px rgba(26, 138, 90, 0.7)',
            flexShrink: 0,
            animation: 'dotPulse 2s ease-in-out infinite',
          }}
        />
      </div>

      {/* Terminal body */}
      <div className="px-4 py-4 space-y-1">
        {TERMINAL_LINES.map(({ segments, delay }, i) => (
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
            {segments.map((seg, j) =>
              typeof seg === 'string'
                ? seg
                : <GlitchNumber key={j} finalValue={seg.glitch} delay={seg.glitchDelay} />
            )}
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
      {/* ── Scan line: one-shot sweep on load ───────────────────────── */}
      <div
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10, overflow: 'hidden' }}
      >
        <motion.div
          animate={{ opacity: [1, 1, 0] }}
          transition={{ duration: 1.8, times: [0, 0.8, 1], delay: 0.3 }}
        >
          <motion.div
            animate={{ top: ['-2px', '100%'] }}
            transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.3 }}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: '1px',
              background:
                'linear-gradient(90deg, transparent 0%, rgba(26,138,90,0.6) 20%, rgba(26,138,90,0.9) 50%, rgba(26,138,90,0.6) 80%, transparent 100%)',
              boxShadow: '0 0 8px rgba(26,138,90,0.4), 0 0 20px rgba(26,138,90,0.2)',
              pointerEvents: 'none',
            }}
          />
        </motion.div>
      </div>

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
        @keyframes dotPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>

      {/* ── Background blob 1: primary glow, top-left — Phase 1 entry + breathe */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        initial="hidden"
        animate="show"
        variants={BLOB_ENTER}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background:
              'radial-gradient(ellipse 600px 400px at 20% 50%, rgba(13, 92, 58, 0.12), transparent)',
          }}
        />
      </motion.div>

      {/* ── Background blob 2: accent glow, bottom-right — Phase 1 entry + breathe */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        initial="hidden"
        animate="show"
        variants={BLOB_ENTER}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background:
              'radial-gradient(ellipse 400px 300px at 80% 80%, rgba(26, 138, 90, 0.06), transparent)',
          }}
        />
      </motion.div>

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
      >
        <motion.div style={{ y: hexagonY }}>
          <motion.svg
            width="720"
            height="720"
            viewBox="0 0 200 200"
            strokeDasharray="1000"
            strokeDashoffset="1000"
            initial={{ strokeDashoffset: 1000, opacity: 0 }}
            animate={{ strokeDashoffset: 0, opacity: 0.08 }}
            transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] as const, delay: 0.2 }}
          >
            <polygon
              points="40,72 100,38 160,72 160,138 100,172 40,138"
              stroke="#1A8A5A"
              strokeWidth="1.5"
              fill="rgba(26,138,90,0.04)"
            />
          </motion.svg>
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
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-16 pt-20 pb-10 max-sm:pt-8 max-sm:pb-8">
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center"
          style={{ perspective: '1000px' }}
        >

          {/* ── Left column: headline + subtext + buttons ────────────── */}
          <motion.div initial="hidden" animate="show">

            {/* ── Mobile terminal — visible ONLY below 640px ───────────── */}
            <div
              className="block sm:hidden mb-5 relative overflow-hidden rounded-lg px-4 py-3 w-full max-w-sm"
              style={{
                background: 'rgba(26, 138, 90, 0.06)',
                border: '1px solid rgba(26, 138, 90, 0.2)',
              }}
            >
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.3 }}
                className="font-mono text-xs"
                style={{ color: 'rgba(26, 138, 90, 0.85)' }}
              >
                {'> building veridisdev.com'}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 1.2 }}
                className="font-mono text-xs"
                style={{ color: 'rgba(26, 138, 90, 0.85)' }}
              >
                {'> stack: Next.js · TypeScript · Tailwind'}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 2.1 }}
                className="font-mono text-xs"
                style={{ color: 'rgba(26, 138, 90, 0.85)' }}
              >
                {'> status: live '}
                <span style={{ color: '#1A8A5A' }}>✓</span>
                <motion.span
                  className="font-mono"
                  style={{ color: '#1A8A5A' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 2.5 }}
                >
                  _
                </motion.span>
              </motion.div>
              {/* Scan line — Task 2 */}
              <motion.div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(26,138,90,0.4), transparent)',
                  pointerEvents: 'none',
                }}
                animate={{ top: ['-1px', '100%'] }}
                transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, delay: 2.5 }}
              />
            </div>

            {/* Badge — mobile only (Phase 4: drops from above) */}
            <motion.div variants={BADGE} className="md:hidden mb-6">
              <BadgeInner />
            </motion.div>

            {/* Badge — desktop only (Phase 4: drops from above) */}
            <motion.div variants={BADGE} className="hidden md:block mb-8">
              <BadgeInner />
            </motion.div>

            {/* Headline — word-by-word blur + scaleX snap (Phase 3) */}
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

            {/* Accent divider (Phase 4) */}
            <motion.div
              variants={DIVIDER}
              className="mt-7 mb-5 w-10 h-px bg-accent"
            />

            {/* Subheadline (Phase 4) */}
            <motion.p
              variants={SUBHEADLINE}
              className="font-sans text-text-secondary text-base leading-relaxed max-w-[420px]"
            >
              We build reliable web and mobile software for businesses — faster than traditional agencies, with enterprise-level quality.
            </motion.p>

            {/* CTA buttons — spring scale-in (Phase 4) */}
            <motion.div
              variants={BUTTONS}
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

          {/* ── Right column: terminal + stats — Phase 2 cinematic entry ─ */}
          <motion.div
            className="hidden md:flex flex-col gap-5"
            initial="hidden"
            animate="show"
            variants={RIGHT_COL}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Terminal — inner parallax layer */}
            <motion.div style={{ rotate: -2 }}>
              <motion.div style={{ y: terminalY }}>
                <TerminalWindow />
              </motion.div>
            </motion.div>

            {/* Stats grid — parallax at half terminal speed */}
            <motion.div style={{ rotate: 1, y: statsY }}>
              <StatsGrid />
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* ── Scroll indicator: desktop only — last to appear (Phase 4) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
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
