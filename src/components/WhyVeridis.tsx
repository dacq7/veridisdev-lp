'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence, useInView, useMotionValue, useSpring, useAnimation } from 'framer-motion';
import { useIsTouch } from '@/hooks/useIsTouch';

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

// ── Highlight terms per card ───────────────────────────────────────────────────

const HIGHLIGHT_TERMS: Record<string, string[]> = {
  ai: ['weeks', 'days'],
  tested: ['110+'],
};

// ── Description with highlighted numbers ──────────────────────────────────────

function HighlightedDescription({
  text,
  highlights,
  inView,
  delay,
}: {
  text: string;
  highlights: string[];
  inView: boolean;
  delay: number;
}) {
  if (!highlights.length) {
    return (
      <motion.p
        className="font-sans text-text-secondary"
        style={{ fontSize: '15px', lineHeight: '1.6' }}
        initial={{ opacity: 0.6 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        {text}
      </motion.p>
    );
  }

  const escaped = highlights.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(${escaped.join('|')})`, 'g');
  const parts = text.split(pattern);

  return (
    <motion.p
      className="font-sans text-text-secondary"
      style={{ fontSize: '15px', lineHeight: '1.6' }}
      initial={{ opacity: 0.6 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      {parts.map((part, i) =>
        highlights.includes(part) ? (
          <motion.span
            key={i}
            initial={{ color: '#4A6B58' }}
            animate={{ color: inView ? '#1A8A5A' : '#4A6B58' }}
            whileTap={{ color: '#1A8A5A', scale: 1.05 }}
            transition={{
              color: { duration: 0.5, delay: delay + 0.3 },
              default: { type: 'spring', stiffness: 400, damping: 20 },
            }}
          >
            {part}
          </motion.span>
        ) : (
          part
        )
      )}
    </motion.p>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────

function DiffCard({ item, index }: { item: Differentiator; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [beaming, setBeaming] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true });

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const springRotateX = useSpring(rawRotateX, { stiffness: 200, damping: 20 });
  const springRotateY = useSpring(rawRotateY, { stiffness: 200, damping: 20 });

  const breathingDelay = index * 0.6;
  const entranceDelay = 0.05 + index * 0.1;
  const highlights = HIGHLIGHT_TERMS[item.id] ?? [];
  const isTouch = useIsTouch();
  const iconControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      iconControls.start({
        boxShadow: [
          '0 0 0px rgba(26,138,90,0)',
          '0 0 16px rgba(26,138,90,0.35)',
          '0 0 0px rgba(26,138,90,0)',
        ],
        transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: breathingDelay },
      });
    }
  }, [isInView]);

  async function handleIconTouch() {
    await iconControls.start({
      scale: [1, 1.2, 1],
      transition: { duration: 0.3, ease: 'easeInOut' },
    });
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    rawRotateY.set((x / rect.width) * 8);
    rawRotateX.set(-(y / rect.height) * 8);
  }

  return (
    <motion.div
      ref={cardRef}
      variants={CARD_ITEM}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => {
        setHovered(false);
        rawRotateX.set(0);
        rawRotateY.set(0);
      }}
      onMouseMove={handleMouseMove}
      onTouchStart={() => { setBeaming(true); setTimeout(() => setBeaming(false), 600); }}
      whileHover={{
        scale: 1.02,
        transition: { type: 'spring', stiffness: 300, damping: 25 },
      }}
      whileTap={{
        scale: 0.97,
        boxShadow: '0 0 0 1px rgba(26,138,90,0.5), 0 0 16px rgba(26,138,90,0.12)',
        transition: {
          scale: { type: 'spring', stiffness: 400, damping: 20 },
          boxShadow: { duration: 0.2 },
        },
      }}
      className="p-5 md:p-9"
      style={{
        background: '#1A2820',
        borderRadius: '12px',
        border: `1px solid ${hovered ? 'rgba(26, 138, 90, 0.35)' : 'rgba(26, 138, 90, 0.12)'}`,
        boxShadow: hovered ? '0 0 24px rgba(26, 138, 90, 0.08)' : 'none',
        transition: 'border-color 300ms, box-shadow 300ms',
        transformStyle: 'preserve-3d',
        perspective: '800px',
        rotateX: springRotateX,
        rotateY: springRotateY,
        position: 'relative',
        overflow: 'hidden',
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
      {/* Icon container — breathing glow */}
      <motion.div
        animate={iconControls}
        onTouchStart={handleIconTouch}
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
      </motion.div>

      {/* Title with underline draw */}
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <h3
          className="font-display font-semibold text-white"
          style={{ fontSize: '20px', lineHeight: '1.3' }}
        >
          {item.title}
        </h3>
        <motion.span
          initial={{ width: isTouch ? '100%' : '0%', opacity: isTouch ? 0.4 : 1 }}
          animate={
            isTouch
              ? { width: '100%', opacity: 0.4 }
              : { width: hovered ? '100%' : '0%', opacity: 1 }
          }
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            display: 'block',
            position: 'absolute',
            bottom: '-2px',
            left: 0,
            height: '1px',
            background: '#1A8A5A',
          }}
        />
      </div>

      {/* Description */}
      <HighlightedDescription
        text={item.description}
        highlights={highlights}
        inView={isInView}
        delay={entranceDelay}
      />
    </motion.div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function WhyVeridis() {
  const t = useTranslations('whyVeridis');
  const HEADING_LETTERS = t('heading').split('');
  const DIFFERENTIATORS: Differentiator[] = [
    { id: 'ai',         icon: <IconCpu />,    title: t('items.0.title'), description: t('items.0.description') },
    { id: 'production', icon: <IconRocket />, title: t('items.1.title'), description: t('items.1.description') },
    { id: 'fullstack',  icon: <IconLayers />, title: t('items.2.title'), description: t('items.2.description') },
    { id: 'tested',     icon: <IconShield />, title: t('items.3.title'), description: t('items.3.description') },
  ];
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
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {t('label')}
          </motion.p>

          {/* Heading — letter reveal */}
          <h2
            className="font-display font-semibold text-white text-4xl md:text-5xl mb-4 break-words"
            style={{ perspective: '400px' }}
          >
            {HEADING_LETTERS.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20, rotateX: -90 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.04 }}
                style={{ display: 'inline-block' }}
              >
                {letter === ' ' ? ' ' : letter}
              </motion.span>
            ))}
          </h2>

          <motion.p
            className="font-sans text-text-secondary text-base leading-relaxed max-w-lg"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t('subtitle')}
          </motion.p>
        </motion.div>

        {/* 2×2 grid */}
        <motion.div
          variants={GRID_CONTAINER}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
        >
          {DIFFERENTIATORS.map((item, index) => (
            <DiffCard key={item.id} item={item} index={index} />
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
