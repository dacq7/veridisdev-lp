'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useTranslations } from 'next-intl';

// ── Types ─────────────────────────────────────────────────────────────────────

type IconName = 'clock' | 'users' | 'link';

type Metric = {
  value: string;
  label: string;
  description: string;
  icon: IconName;
};

// ── Data ──────────────────────────────────────────────────────────────────────
// Verifiable track-record metrics — no invented testimonials. Copy lives in
// i18n (es/en.json → testimonials.metrics); the decorative icon is matched by
// index here since it is not translatable content.

const METRIC_ICONS: IconName[] = ['clock', 'users', 'link'];

// ── Decorative metric icon ────────────────────────────────────────────────────

function MetricIcon({ name }: { name: IconName }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: '#1A8A5A',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  if (name === 'clock') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }
  if (name === 'users') {
    return (
      <svg {...common}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }
  // link
  return (
    <svg {...common}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

// ── Animation variants ────────────────────────────────────────────────────────

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

// hover state added so whileHover="hover" propagates to children
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: { scale: 1.02 },
};

const valueVariants = {
  visible: { scale: 1 },
  hover: {
    scale: 1.06,
    transition: { type: 'spring' as const, stiffness: 300, damping: 20 },
  },
};

const iconVariants = {
  visible: { boxShadow: '0 0 0 0px rgba(26,138,90,0)' },
  hover: {
    boxShadow: '0 0 0 2px rgba(26,138,90,0.6)',
    transition: { duration: 0.3 },
  },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function TrackRecord() {
  const t = useTranslations('testimonials');
  const headingWords = t.raw('headingWords') as string[];
  const tMetrics = t.raw('metrics') as Array<{ value: string; label: string; description: string }>;
  const metrics: Metric[] = tMetrics.map((m, i) => ({ ...m, icon: METRIC_ICONS[i] }));
  return (
    <section
      style={{
        backgroundColor: '#0F1A14',
      }}
      className="relative py-24 px-6 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16 max-sm:overflow-x-hidden"
        >
          <p
            style={{ fontFamily: 'DM Sans, sans-serif', color: '#1A8A5A' }}
            className="text-xs uppercase tracking-widest mb-4"
          >
            {t('label')}
          </p>
          <h2
            style={{ fontFamily: 'Syne, sans-serif', color: '#FFFFFF' }}
            className="text-4xl md:text-5xl font-bold break-words"
          >
            {headingWords.map((word, index) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{ display: 'inline-block', marginRight: '0.25em' }}
              >
                {word}
              </motion.span>
            ))}
          </h2>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </motion.div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4 mt-16 md:mt-20">
          <p className="font-mono text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {t('cta.question')}
          </p>
          <motion.button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="px-6 py-3 rounded-full text-white font-sans text-sm font-medium"
            style={{ background: '#1A8A5A' }}
          >
            {t('cta.button')}
          </motion.button>
        </div>
      </div>
    </section>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────

function MetricCard({ metric }: { metric: Metric }) {
  const { value, label, description, icon } = metric;
  const [beaming, setBeaming] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    rotateX.set(-dy * 3);
    rotateY.set(dx * 3);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      whileHover="hover"
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={() => { setBeaming(true); setTimeout(() => setBeaming(false), 600); }}
      style={{
        backgroundColor: '#1A2820',
        border: '1px solid rgba(26, 138, 90, 0.12)',
        borderRadius: '12px',
        padding: '32px',
        position: 'relative',
        overflow: 'hidden',
        rotateX: springX,
        rotateY: springY,
        perspective: '800px',
        transformStyle: 'preserve-3d',
      }}
    >
      <AnimatePresence>
        {beaming && (
          <motion.div
            key="beam"
            initial={{ x: '-100%', opacity: 0.7 }}
            animate={{ x: '200%', opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(26,138,90,0.25), transparent)', pointerEvents: 'none', zIndex: 10, borderRadius: 'inherit' }}
          />
        )}
      </AnimatePresence>

      {/* Big number */}
      <motion.p
        variants={valueVariants}
        style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '44px',
          lineHeight: 1.05,
          fontWeight: 700,
          color: '#FFFFFF',
          transformOrigin: 'left center',
        }}
      >
        {value}
      </motion.p>

      {/* Divider */}
      <div
        style={{
          height: '1px',
          backgroundColor: 'rgba(26, 138, 90, 0.1)',
          margin: '20px 0',
        }}
      />

      {/* Footer row: icon + label/description */}
      <div className="flex items-center gap-3">
        {/* Icon badge — occupies the slot where testimonial initials used to be */}
        <motion.div
          variants={iconVariants}
          whileTap={{ boxShadow: '0 0 0 3px rgba(26,138,90,0.8)' }}
          transition={{ duration: 0.2 }}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(26, 138, 90, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <MetricIcon name={icon} />
        </motion.div>

        {/* Label + description */}
        <div className="flex-1 min-w-0">
          <motion.p
            whileTap={{ color: '#1A8A5A' }}
            transition={{ duration: 0.2 }}
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '15px',
              color: '#FFFFFF',
              fontWeight: 600,
              lineHeight: 1.3,
            }}
          >
            {label}
          </motion.p>
          <motion.p
            initial={{ opacity: 0.6 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '12px',
              color: '#4A6B58',
              lineHeight: 1.4,
            }}
          >
            {description}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
