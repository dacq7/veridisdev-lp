'use client';

import { motion } from 'framer-motion';

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

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        backgroundColor: '#1A2820',
        border: '1px solid rgba(26, 138, 90, 0.12)',
        borderRadius: '12px',
        padding: '32px',
        position: 'relative',
      }}
    >
      {/* Decorative opening quote mark */}
      <span
        aria-hidden="true"
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
      </span>

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
        <div
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
        </div>

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
        <span
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '11px',
            color: '#1A8A5A',
            backgroundColor: 'rgba(26, 138, 90, 0.1)',
            border: '1px solid rgba(26, 138, 90, 0.25)',
            borderRadius: '999px',
            padding: '3px 10px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {badge}
        </span>
      </div>
    </motion.div>
  );
}
