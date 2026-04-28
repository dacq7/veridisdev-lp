'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// ── Types ─────────────────────────────────────────────────────────────────────

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  badge: string;
  initials: string;
};

// ── Data ──────────────────────────────────────────────────────────────────────

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'The system Diego built transformed how we manage our dojo. Attendance, payments and student records — everything in one place. It just works.',
    name: 'Andrés M.',
    role: 'Student, Budokan SKIF',
    badge: 'Budokan SKIF',
    initials: 'AM',
  },
  {
    quote:
      'We went from managing bookings on paper to a fully automated system in under two weeks. Our barbers love it and clients book online without calling us.',
    name: 'Miguel T.',
    role: 'Owner, The Barber\'s Post',
    badge: 'BarberOS',
    initials: 'MT',
  },
  {
    quote:
      'Finally a CRM that understands trucking insurance. Pipeline tracking, client records, policy management — built exactly for how we operate.',
    name: 'Sarah K.',
    role: 'Operations Manager, Premier Trucking Ins.',
    badge: 'Trucking CRM',
    initials: 'SK',
  },
];

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

const quoteVariants = {
  visible: { scale: 1, x: 0, y: 0 },
  hover: {
    scale: 1.3,
    opacity: 0.4,
    x: -4,
    y: -4,
    transition: { type: 'spring' as const, stiffness: 300, damping: 20 },
  },
};

const badgeVariants = {
  visible: {
    backgroundColor: 'rgba(26,138,90,0.1)',
    borderColor: 'rgba(26,138,90,0.25)',
  },
  hover: {
    backgroundColor: 'rgba(26,138,90,0.2)',
    borderColor: 'rgba(26,138,90,0.5)',
    transition: { duration: 0.3 },
  },
};

const avatarVariants = {
  visible: { boxShadow: '0 0 0 0px rgba(26,138,90,0)' },
  hover: {
    boxShadow: '0 0 0 2px rgba(26,138,90,0.6)',
    transition: { duration: 0.3 },
  },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function Testimonials() {
  return (
    <section
      style={{
        backgroundColor: '#0F1A14',
        backgroundImage:
          'radial-gradient(circle, rgba(26,138,90,0.25) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
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
          className="mb-16"
        >
          <p
            style={{ fontFamily: 'DM Sans, sans-serif', color: '#1A8A5A' }}
            className="text-xs uppercase tracking-widest mb-4"
          >
            WHAT CLIENTS SAY
          </p>
          <h2
            style={{ fontFamily: 'Syne, sans-serif', color: '#FFFFFF' }}
            className="text-4xl md:text-5xl font-bold"
          >
            Trusted by real businesses.
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
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} testimonial={t} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const { quote, name, role, badge, initials } = testimonial;

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
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        backgroundColor: '#1A2820',
        border: '1px solid rgba(26, 138, 90, 0.12)',
        borderRadius: '12px',
        padding: '32px',
        position: 'relative',
        rotateX: springX,
        rotateY: springY,
        perspective: '800px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Decorative opening quote mark */}
      <motion.span
        aria-hidden="true"
        variants={quoteVariants}
        style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '64px',
          color: 'rgba(26, 138, 90, 0.2)',
          lineHeight: 1,
          position: 'absolute',
          top: '16px',
          left: '24px',
          userSelect: 'none',
        }}
      >
        &ldquo;
      </motion.span>

      {/* Quote */}
      <p
        style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '15px',
          color: '#CBD5C0',
          lineHeight: 1.7,
          fontStyle: 'italic',
          marginTop: '28px',
        }}
      >
        {quote}
      </p>

      {/* Divider */}
      <div
        style={{
          height: '1px',
          backgroundColor: 'rgba(26, 138, 90, 0.1)',
          margin: '20px 0',
        }}
      />

      {/* Footer row: avatar + name/role + badge */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <motion.div
          variants={avatarVariants}
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
          <span
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: '14px',
              color: '#1A8A5A',
              fontWeight: 600,
            }}
          >
            {initials}
          </span>
        </motion.div>

        {/* Name + role */}
        <div className="flex-1 min-w-0">
          <p
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
              color: '#FFFFFF',
              fontWeight: 600,
              lineHeight: 1.3,
            }}
          >
            {name}
          </p>
          <p
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '12px',
              color: '#4A6B58',
              lineHeight: 1.3,
            }}
          >
            {role}
          </p>
        </div>

        {/* Project badge */}
        <motion.span
          variants={badgeVariants}
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '11px',
            color: '#1A8A5A',
            borderRadius: '999px',
            padding: '3px 10px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            borderWidth: '1px',
            borderStyle: 'solid',
          }}
        >
          {badge}
        </motion.span>
      </div>
    </motion.div>
  );
}
