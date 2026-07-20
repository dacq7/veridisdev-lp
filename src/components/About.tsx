'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import {
  motion,
  useAnimation,
  useInView,
  useMotionValue,
  useTransform,
  useScroll,
} from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useIsTouch } from '@/hooks/useIsTouch';

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

// ── CountUp ───────────────────────────────────────────────────────────────────

interface CountUpProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

function CountUp({ end, suffix = '', prefix = '', duration = 1.5 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    return rounded.on('change', (v) => setDisplayValue(v));
  }, [rounded]);

  useEffect(() => {
    if (!isInView) return;
    const startTime = performance.now();
    const durationMs = duration * 1000;
    let rafId: number;
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1);
      motionValue.set((1 - Math.pow(1 - progress, 3)) * end);
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, end, duration, motionValue]);

  return (
    <span ref={ref}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}

// ── StatItem ──────────────────────────────────────────────────────────────────

interface StatItemProps {
  end: number;
  suffix: string;
  label: string;
  duration: number;
}

function StatItem({ end, suffix, label, duration }: StatItemProps) {
  const isTouch = useIsTouch();
  const scaleControls = useAnimation();
  const colorControls = useAnimation();

  const handleTouchStart = useCallback(async () => {
    if (!isTouch) return;
    await Promise.all([
      scaleControls.start({ scale: 1.15, transition: { duration: 0.15, ease: 'easeOut' } }),
      colorControls.start({ color: '#1A8A5A', transition: { duration: 0.15, ease: 'easeOut' } }),
    ]);
    scaleControls.start({ scale: 1, transition: { type: 'spring', stiffness: 400, damping: 20 } });
    colorControls.start({ color: '#ffffff', transition: { type: 'spring', stiffness: 400, damping: 20 } });
  }, [isTouch, scaleControls, colorControls]);

  return (
    <motion.div animate={scaleControls} onTouchStart={handleTouchStart}>
      <motion.p
        className="font-display font-semibold text-2xl leading-none mb-1"
        animate={colorControls}
        style={{ color: '#ffffff' }}
      >
        <CountUp end={end} suffix={suffix} duration={duration} />
      </motion.p>
      <motion.span
        className="font-sans text-text-secondary text-sm leading-snug"
        style={{ display: 'block' }}
        whileTap={{ color: '#1A8A5A', scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────

const STAT_BASE = [
  { end: 1, duration: 1.2 },
  { end: 10, duration: 1.5 },
];

// ── Section ───────────────────────────────────────────────────────────────────

export default function About() {
  const t = useTranslations('about');
  const rawStats = t.raw('stats') as Array<{ suffix: string; label: string }>;
  const stats = STAT_BASE.map((base, i) => ({
    ...base,
    suffix: rawStats[i].suffix,
    label: rawStats[i].label,
  }));

  const aboutRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: aboutRef });
  const hexagonY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  const hexControls = useAnimation();
  const isTouch = useIsTouch();
  const githubControls = useAnimation();
  const beamControls = useAnimation();
  const bioControls = useAnimation();

  const handleSectionTouch = useCallback(async () => {
    if (!isTouch) return;
    beamControls.set({ x: '-100%' });
    await beamControls.start({ x: '100%', transition: { duration: 0.6, ease: 'easeOut' } });
  }, [isTouch, beamControls]);

  const handleBioTouch = useCallback(async () => {
    if (!isTouch) return;
    await bioControls.start({
      opacity: [1, 0.7, 1],
      transition: { duration: 0.4, ease: 'easeInOut', times: [0, 0.5, 1] },
    });
  }, [isTouch, bioControls]);

  useEffect(() => {
    hexControls.start({
      rotate: [0, 360],
      transition: { duration: 25, repeat: Infinity, ease: 'linear' },
    });
  }, [hexControls]);

  const handleLeftHoverStart = () => {
    hexControls.start({
      rotate: [0, 360],
      transition: { duration: 6, repeat: Infinity, ease: 'linear' },
    });
  };

  const handleLeftHoverEnd = () => {
    hexControls.start({
      rotate: [0, 360],
      transition: { duration: 25, repeat: Infinity, ease: 'linear' },
    });
  };

  const handleHexTouchStart = useCallback(() => {
    if (!isTouch) return;
    hexControls.start({
      rotate: [0, 360],
      transition: { duration: 0.3, repeat: Infinity, ease: 'linear' },
    });
    setTimeout(() => {
      hexControls.start({
        rotate: [0, 360],
        transition: { duration: 25, repeat: Infinity, ease: 'linear' },
      });
    }, 1000);
  }, [isTouch, hexControls]);

  const handleGithubTouch = useCallback(async () => {
    if (!isTouch) return;
    await githubControls.start({
      scale: 0.92,
      backgroundColor: 'rgba(26,138,90,0.2)',
      transition: { duration: 0.1, ease: 'easeOut' },
    });
    githubControls.start({
      scale: 1,
      backgroundColor: 'rgba(26,138,90,0)',
      transition: {
        scale: { type: 'spring', stiffness: 400, damping: 18 },
        backgroundColor: { duration: 0.4 },
      },
    });
  }, [isTouch, githubControls]);

  const [githubHovered, setGithubHovered] = useState(false);

  return (
    <section
      ref={aboutRef}
      id="about"
      className="relative py-24 md:py-32 overflow-hidden"
      onTouchStart={handleSectionTouch}
    >
      {/* Touch beam */}
      <motion.div
        aria-hidden="true"
        initial={{ x: '-100%' }}
        animate={beamControls}
        className="absolute inset-y-0 left-0 w-full pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(26,138,90,0.12), transparent)', zIndex: 1 }}
      />

      {/* Ambient glow — bottom-right */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 500px 400px at 100% 100%, rgba(13, 92, 58, 0.07), transparent)',
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
          className="mb-14 md:mb-16 max-sm:overflow-x-hidden"
        >
          <motion.p
            className="font-sans text-xs tracking-widest uppercase text-accent mb-3"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t('label')}
          </motion.p>
          <motion.h2
            className="font-display font-semibold text-white text-4xl md:text-5xl break-words"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {t('heading')}
          </motion.h2>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Left — logo composition */}
          <motion.div
            variants={COL_LEFT}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            onHoverStart={handleLeftHoverStart}
            onHoverEnd={handleLeftHoverEnd}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}
          >
            {/* Hexagon + V wrapper — positions glow, rotating hex, and V letter */}
            <motion.div
              style={{ position: 'relative', width: '200px', height: '200px', y: hexagonY }}
              onTouchStart={handleHexTouchStart}
            >
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
                animate={hexControls}
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
            </motion.div>

            {/* Name + title */}
            <div style={{ textAlign: 'center' }}>
              <p className="font-display" style={{ fontSize: '18px', fontWeight: 500, color: '#ffffff', marginBottom: '4px' }}>
                {t('founderName')}
              </p>
              <p className="font-sans" style={{ fontSize: '13px', color: '#4A6B58' }}>
                {t('founderTitle')}
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
            <motion.p
              className="font-sans text-text-secondary text-base leading-relaxed"
              animate={bioControls}
              onTouchStart={handleBioTouch}
            >
              {t('bio1')}
            </motion.p>
            <p className="font-sans text-text-secondary text-base leading-relaxed">
              {t('bio2')}
            </p>
            <p className="font-sans text-text-secondary text-base leading-relaxed">
              {t('bio3')}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 md:gap-10 mt-3">
              {stats.map(({ end, suffix, label, duration }, index) => (
                <motion.div
                  key={suffix}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <StatItem end={end} suffix={suffix} label={label} duration={duration} />
                </motion.div>
              ))}
            </div>

            {/* GitHub CTA */}
            <motion.a
              href="https://github.com/dacq7"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm font-medium w-fit transition-colors duration-200 hover:text-white"
              style={{ color: '#1A8A5A', position: 'relative', display: 'inline-block', backgroundColor: 'rgba(26,138,90,0)' }}
              animate={githubControls}
              onTouchStart={handleGithubTouch}
              onMouseEnter={() => setGithubHovered(true)}
              onMouseLeave={() => setGithubHovered(false)}
            >
              {t('githubCta')}{' '}
              <motion.span
                animate={{ x: githubHovered ? 6 : 0, opacity: githubHovered ? 0.7 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                style={{ display: 'inline-block' }}
              >
                →
              </motion.span>
              <motion.span
                aria-hidden="true"
                initial={{ width: '0%' }}
                animate={{ width: githubHovered ? '100%' : '0%' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  bottom: -2,
                  left: 0,
                  height: 1,
                  background: '#1A8A5A',
                  display: 'block',
                }}
              />
            </motion.a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
