'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

const useIsTouch = () => {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => { setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0); }, []);
  return isTouch;
};

// ── Types ─────────────────────────────────────────────────────────────────────

type Tech = { name: string; icon: React.ReactNode };
type TechGroup = { label: string; techs: Tech[] };

// ── Icons ─────────────────────────────────────────────────────────────────────

const Icons: Record<string, React.ReactNode> = {
  React: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <ellipse cx="8" cy="8" rx="2" ry="2" fill="#61DAFB" />
      <ellipse cx="8" cy="8" rx="7" ry="2.8" stroke="#61DAFB" strokeWidth="1.2" fill="none" />
      <ellipse cx="8" cy="8" rx="7" ry="2.8" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(60 8 8)" />
      <ellipse cx="8" cy="8" rx="7" ry="2.8" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(120 8 8)" />
    </svg>
  ),
  'Next.js': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="#FFFFFF" strokeWidth="1.2" fill="none" />
      <text x="4.8" y="11.5" fontFamily="sans-serif" fontWeight="700" fontSize="7" fill="#FFFFFF">N</text>
    </svg>
  ),
  TypeScript: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="14" height="14" rx="2" fill="#3178C6" />
      <text x="3" y="11.5" fontFamily="sans-serif" fontWeight="700" fontSize="6.5" fill="#FFFFFF">TS</text>
    </svg>
  ),
  'Tailwind CSS': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 3.5C6 3.5 4.75 4.5 4.25 6.5C5 5.5 5.875 5.125 6.875 5.375C7.45 5.52 7.86 5.935 8.31 6.4C9.04 7.16 9.9 8 11.75 8C13.75 8 15 7 15.5 5C14.75 6 13.875 6.375 12.875 6.125C12.3 5.98 11.89 5.565 11.44 5.1C10.71 4.34 9.85 3.5 8 3.5ZM4.25 8C2.25 8 1 9 0.5 11C1.25 10 2.125 9.625 3.125 9.875C3.7 10.02 4.11 10.435 4.56 10.9C5.29 11.66 6.15 12.5 8 12.5C10 12.5 11.25 11.5 11.75 9.5C11 10.5 10.125 10.875 9.125 10.625C8.55 10.48 8.14 10.065 7.69 9.6C6.96 8.84 6.1 8 4.25 8Z" fill="#06B6D4" />
    </svg>
  ),
  'Framer Motion': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 2H13V7H8L13 14H8L3 9V2Z" stroke="#BB4B96" strokeWidth="1.3" fill="none" strokeLinejoin="round" />
    </svg>
  ),
  Python: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5C5.5 1.5 4 2.5 4 4V5.5H8V6H3C1.8 6 1 7 1 8.5C1 10 1.8 11 3 11H4.5V9.5C4.5 8.5 5.5 7.5 8 7.5V6H8.5V5.5H12V4C12 2.5 10.5 1.5 8 1.5Z" fill="#3776AB" />
      <path d="M8 14.5C10.5 14.5 12 13.5 12 12V10.5H8V10H13C14.2 10 15 9 15 7.5C15 6 14.2 5 13 5H11.5V6.5C11.5 7.5 10.5 8.5 8 8.5V10H7.5V10.5H4V12C4 13.5 5.5 14.5 8 14.5Z" fill="#FFD43B" />
      <circle cx="6.5" cy="4" r="0.8" fill="#FFFFFF" />
      <circle cx="9.5" cy="12" r="0.8" fill="#FFFFFF" />
    </svg>
  ),
  FastAPI: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="#009688" strokeWidth="1.2" fill="none" />
      <path d="M8 3L9.5 7H14L10.5 9.5L12 14L8 11L4 14L5.5 9.5L2 7H6.5L8 3Z" fill="#009688" />
    </svg>
  ),
  'Node.js': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5L14 5V11L8 14.5L2 11V5L8 1.5Z" stroke="#339933" strokeWidth="1.2" fill="none" strokeLinejoin="round" />
      <text x="5.3" y="10.5" fontFamily="sans-serif" fontWeight="700" fontSize="5.5" fill="#339933">js</text>
    </svg>
  ),
  Express: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <text x="1.5" y="11" fontFamily="sans-serif" fontWeight="700" fontSize="8" fill="#FFFFFF">E</text>
      <path d="M8 8H15" stroke="#FFFFFF" strokeWidth="1.2" />
    </svg>
  ),
  PostgreSQL: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <ellipse cx="8" cy="4.5" rx="5" ry="2" stroke="#4169E1" strokeWidth="1.2" fill="none" />
      <path d="M3 4.5V11.5C3 12.6 5.2 13.5 8 13.5C10.8 13.5 13 12.6 13 11.5V4.5" stroke="#4169E1" strokeWidth="1.2" fill="none" />
      <path d="M3 8C3 9.1 5.2 10 8 10C10.8 10 13 9.1 13 8" stroke="#4169E1" strokeWidth="1.2" />
    </svg>
  ),
  Supabase: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M9 1L2 9.5H8.5L7 15L14 6.5H7.5L9 1Z" fill="#3ECF8E" stroke="#3ECF8E" strokeWidth="0.5" strokeLinejoin="round" />
    </svg>
  ),
  Prisma: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1L14 13H2L8 1Z" stroke="#888" strokeWidth="1.2" fill="none" strokeLinejoin="round" />
      <path d="M8 1L14 13L8 10L8 1Z" fill="#888" fillOpacity="0.4" />
    </svg>
  ),
  Docker: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="6" width="2" height="2" rx="0.3" fill="#2496ED" />
      <rect x="4.5" y="6" width="2" height="2" rx="0.3" fill="#2496ED" />
      <rect x="7.5" y="6" width="2" height="2" rx="0.3" fill="#2496ED" />
      <rect x="4.5" y="3.5" width="2" height="2" rx="0.3" fill="#2496ED" />
      <rect x="7.5" y="3.5" width="2" height="2" rx="0.3" fill="#2496ED" />
      <path d="M1 8.5C1 8.5 1.5 10.5 5 10.5H11C13 10.5 14 9.5 14.5 8C13.5 8.3 12 7.8 11.5 7H10.5" stroke="#2496ED" strokeWidth="1.1" fill="none" />
    </svg>
  ),
  Vercel: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2L15 14H1L8 2Z" fill="#FFFFFF" />
    </svg>
  ),
  Railway: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" fill="#0B0D0E" stroke="#FFFFFF" strokeWidth="1.2" />
      <text x="5.2" y="11.5" fontFamily="sans-serif" fontWeight="700" fontSize="7" fill="#FFFFFF">R</text>
    </svg>
  ),
  Jest: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="#C21325" strokeWidth="1.2" fill="none" />
      <text x="5.5" y="11.5" fontFamily="sans-serif" fontWeight="700" fontSize="7.5" fill="#C21325">J</text>
    </svg>
  ),
  Pytest: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="#0A9EDC" strokeWidth="1.2" fill="none" />
      <text x="5" y="11.5" fontFamily="sans-serif" fontWeight="700" fontSize="7.5" fill="#0A9EDC">P</text>
    </svg>
  ),
};

// ── Data ──────────────────────────────────────────────────────────────────────

const GROUPS: TechGroup[] = [
  {
    label: 'Frontend',
    techs: [
      { name: 'React', icon: Icons['React'] },
      { name: 'Next.js', icon: Icons['Next.js'] },
      { name: 'TypeScript', icon: Icons['TypeScript'] },
      { name: 'Tailwind CSS', icon: Icons['Tailwind CSS'] },
      { name: 'Framer Motion', icon: Icons['Framer Motion'] },
    ],
  },
  {
    label: 'Backend',
    techs: [
      { name: 'Python', icon: Icons['Python'] },
      { name: 'FastAPI', icon: Icons['FastAPI'] },
      { name: 'Node.js', icon: Icons['Node.js'] },
      { name: 'Express', icon: Icons['Express'] },
    ],
  },
  {
    label: 'Database & Infra',
    techs: [
      { name: 'PostgreSQL', icon: Icons['PostgreSQL'] },
      { name: 'Supabase', icon: Icons['Supabase'] },
      { name: 'Prisma', icon: Icons['Prisma'] },
      { name: 'Docker', icon: Icons['Docker'] },
    ],
  },
  {
    label: 'Deploy & Testing',
    techs: [
      { name: 'Vercel', icon: Icons['Vercel'] },
      { name: 'Railway', icon: Icons['Railway'] },
      { name: 'Jest', icon: Icons['Jest'] },
      { name: 'Pytest', icon: Icons['Pytest'] },
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

const GROUP_ITEM = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

// Task 1: heading letter reveal
const LETTER_CONTAINER = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04 },
  },
};

const LETTER_VARIANT = {
  hidden: { opacity: 0, y: 20, rotateX: -90 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

// Task 3: pills wave entrance (spring + scale)
const PILLS_CONTAINER = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04 },
  },
  bounce: {
    transition: { staggerChildren: 0.04 },
  },
};

const PILL_ITEM = {
  hidden: { opacity: 0, y: 15, scale: 0.85 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 20 },
  },
  bounce: {
    y: [0, -6, 0],
    scale: [1, 1.05, 1],
    transition: { duration: 0.3, ease: 'easeInOut' as const },
  },
};

// ── Pill ──────────────────────────────────────────────────────────────────────

type PillProps = {
  tech: Tech;
  index: number;
  waveSource: number | null;
  onTouchPill: (i: number) => void;
};

function Pill({ tech, index, waveSource, onTouchPill }: PillProps) {
  const [hovered, setHovered] = useState(false);
  const iconControls = useAnimation();
  const waveControls = useAnimation();

  // Task 2: wave effect — animate adjacent pills with staggered translateY
  useEffect(() => {
    if (waveSource === null) return;
    const dist = Math.abs(waveSource - index);
    if (dist === 0 || dist > 2) return;
    waveControls.start({
      y: [-4, 0],
      transition: { duration: 0.25, ease: 'easeOut' as const, delay: dist * 0.08 },
    });
  }, [waveSource, index, waveControls]);

  const handleIconTouch = async () => {
    await iconControls.start({
      filter: 'drop-shadow(0 0 6px currentColor)',
      scale: 1.2,
      transition: { duration: 0.1 },
    });
    await new Promise<void>(r => setTimeout(r, 300));
    iconControls.start({ filter: 'none', scale: 1, transition: { duration: 0.15 } });
  };

  return (
    <motion.span
      variants={PILL_ITEM}
      whileTap={{ scale: 0.88, transition: { type: 'spring', stiffness: 500, damping: 20 } }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onTouchStart={() => onTouchPill(index)}
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
      <motion.span
        animate={waveControls}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
      >
        <motion.span
          animate={iconControls}
          whileHover={{ filter: 'drop-shadow(0 0 4px currentColor)', opacity: 1 }}
          whileTap={{ filter: 'drop-shadow(0 0 6px #1A8A5A)' }}
          onTouchStart={handleIconTouch}
          style={{
            width: 16,
            height: 16,
            flexShrink: 0,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.8,
          }}
        >
          {tech.icon}
        </motion.span>
        {tech.name}
      </motion.span>
    </motion.span>
  );
}

// ── Group ─────────────────────────────────────────────────────────────────────

function TechGroup({ group, index }: { group: TechGroup; index: number }) {
  const pillsControls = useAnimation();
  const labelControls = useAnimation();
  const isTouch = useIsTouch();
  const pillsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(pillsRef, { once: true, margin: '-40px' });
  const [waveSource, setWaveSource] = useState<number | null>(null);

  useEffect(() => {
    if (inView) pillsControls.start('show');
  }, [inView, pillsControls]);

  const handleCategoryTouch = () => pillsControls.start('bounce');

  // Task 1: label scale feedback on touch
  const handleLabelTouch = async () => {
    if (!isTouch) return;
    await labelControls.start({ scale: 1.08, transition: { duration: 0.125, ease: 'easeOut' as const } });
    labelControls.start({ scale: 1, transition: { duration: 0.125, ease: 'easeIn' as const } });
  };

  // Task 2: notify pill index so adjacent pills can wave
  const handleTouchPill = (i: number) => {
    setWaveSource(i);
    setTimeout(() => setWaveSource(null), 500);
  };

  return (
    // Task 3: scroll reveal per category with staggered delay
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const, delay: index * 0.1 }}
      onTouchStart={handleCategoryTouch}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.15 }}
      >
        <motion.p
          animate={labelControls}
          className="font-sans uppercase tracking-wide mb-3"
          style={{ color: '#4A6B58', fontSize: '11px', letterSpacing: '0.12em' }}
          initial={{ x: -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
          onTouchStart={handleLabelTouch}
        >
          {group.label}
        </motion.p>
        <motion.div
          ref={pillsRef}
          variants={PILLS_CONTAINER}
          initial="hidden"
          animate={pillsControls}
          className="flex flex-wrap gap-2"
        >
          {group.techs.map((tech, i) => (
            <Pill
              key={tech.name}
              tech={tech}
              index={i}
              waveSource={waveSource}
              onTouchPill={handleTouchPill}
            />
          ))}
        </motion.div>
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16">

        {/* Section header */}
        <motion.div
          variants={HEADER_VARIANT}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="mb-14 md:mb-16 max-sm:overflow-x-hidden"
        >
          <p className="font-sans text-xs tracking-widest uppercase text-accent mb-3">
            Tech Stack
          </p>
          {/* Task 1: heading letter reveal */}
          <motion.h2
            className="font-display font-semibold text-white text-3xl md:text-5xl mb-4 break-words"
            style={{ perspective: '400px' }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <motion.span
              variants={LETTER_CONTAINER}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              style={{ display: 'inline-flex', flexWrap: 'nowrap', whiteSpace: 'nowrap' }}
            >
              {'Tools we trust.'.split('').map((char, i) => (
                <motion.span
                  key={i}
                  variants={LETTER_VARIANT}
                  style={{ display: 'inline-block', whiteSpace: 'pre' }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.span>
          </motion.h2>
          <motion.p
            className="font-sans text-text-secondary text-base leading-relaxed max-w-lg"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Production-tested technologies across every layer of the stack.
          </motion.p>
        </motion.div>

        {/* 2×2 category grid */}
        <motion.div
          variants={GRID_CONTAINER}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12"
        >
          {GROUPS.map((group, i) => (
            <TechGroup key={group.label} group={group} index={i} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}
