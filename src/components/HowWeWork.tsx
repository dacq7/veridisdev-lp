'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, type Variants, useInView } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Tell us your idea',
    description:
      "Schedule a free call or send us a message. We listen, ask the right questions and tell you honestly if we're the right fit.",
    tag: 'Free · No commitment',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A8A5A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'We send a proposal',
    description:
      'Within 24 hours you get a clear proposal — scope, timeline, price. No vague estimates, no hidden fees.',
    tag: 'Within 24 hours',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A8A5A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10,9 9,9 8,9" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'We build and keep you posted',
    description:
      'We start with a deposit and split payments based on project milestones — so you only pay for what\'s delivered. You get weekly updates and a staging environment to review progress at any time.',
    tag: 'Milestone-based payments',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A8A5A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16,18 22,12 16,6" />
        <polyline points="8,6 2,12 8,18" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Delivery + support',
    description:
      'We deploy, hand over the code and stay available for 30 days post-launch at no extra cost. Your software, your ownership.',
    tag: '30 days free support',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A8A5A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9,12 11,14 15,10" />
      </svg>
    ),
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

// ── CountUp ───────────────────────────────────────────────────────────────────

function CountUp({ target, duration, delay: startDelay }: {
  target: number;
  duration: number;
  delay: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let interval: ReturnType<typeof setInterval>;
    const timer = setTimeout(() => {
      if (target === 0) return;
      const stepTime = Math.max(16, Math.floor(duration / target));
      let current = 0;
      interval = setInterval(() => {
        current += 1;
        setCount(current);
        if (current >= target) clearInterval(interval);
      }, stepTime);
    }, startDelay * 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isInView, target, duration, startDelay]);

  return <span ref={ref}>{String(count).padStart(2, '0')}</span>;
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function HowWeWork() {
  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{ background: '#0F1A14' }}
    >
      {/* Dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(26,138,90,0.25) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="mb-16"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <p
            className="text-xs uppercase tracking-widest mb-3"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: '#1A8A5A',
            }}
          >
            The Process
          </p>
          <h2
            className="text-4xl md:text-5xl font-semibold text-white mb-4"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Simple. Transparent. Fast.
          </h2>
          <p
            className="text-base max-w-xl"
            style={{ fontFamily: 'DM Sans, sans-serif', color: '#4A6B58', lineHeight: 1.6 }}
          >
            No surprises, no endless back-and-forth. Here&apos;s exactly how we work.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="relative">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {steps.map((step, index) => (
              <div key={step.number} className="relative flex flex-col">
                {/* Connector line — desktop only, between cards */}
                {index < steps.length - 1 && (
                  <div
                    className="hidden md:block absolute top-[52px] z-0"
                    style={{
                      left: 'calc(100% - 0px)',
                      width: 'calc(100% + 24px)',
                      transform: 'translateX(28px)',
                      height: '2px',
                    }}
                  >
                    {/* Animated fill line */}
                    <motion.div
                      initial={{ width: '0%', opacity: 0 }}
                      whileInView={{ width: '100%', opacity: 1 }}
                      viewport={{ once: true, margin: '-100px' }}
                      transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 }}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, rgba(26,138,90,0.5), rgba(26,138,90,0.2))',
                      }}
                    />
                    {/* Junction dot */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, margin: '-100px' }}
                      transition={{ duration: 0.3, delay: 1.0 + index * 0.1 }}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#1A8A5A',
                      }}
                    />
                  </div>
                )}

                <motion.div
                  variants={stepVariants}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="relative flex flex-col h-full p-7 rounded-xl"
                  style={{
                    background: '#1A2820',
                    border: '1px solid rgba(26, 138, 90, 0.12)',
                    borderRadius: '12px',
                    padding: '28px',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.border =
                      '1px solid rgba(26, 138, 90, 0.35)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.border =
                      '1px solid rgba(26, 138, 90, 0.12)';
                  }}
                >
                  {/* Step number — count-up on viewport enter */}
                  <span
                    className="absolute top-4 right-5 select-none"
                    style={{
                      fontFamily: 'Syne, sans-serif',
                      fontSize: '48px',
                      fontWeight: 700,
                      color: 'rgba(26, 138, 90, 0.15)',
                      lineHeight: 1,
                    }}
                  >
                    <CountUp
                      target={parseInt(step.number, 10)}
                      duration={300 + index * 100}
                      delay={index * 0.15}
                    />
                  </span>

                  {/* Icon — breathing glow */}
                  <motion.div
                    className="flex items-center justify-center mb-5 flex-shrink-0"
                    animate={{
                      boxShadow: [
                        '0 0 0px rgba(26,138,90,0)',
                        '0 0 12px rgba(26,138,90,0.3)',
                        '0 0 0px rgba(26,138,90,0)',
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: index * 0.75,
                    }}
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      background: 'rgba(26, 138, 90, 0.08)',
                      border: '1px solid rgba(26, 138, 90, 0.2)',
                    }}
                  >
                    {step.icon}
                  </motion.div>

                  {/* Title */}
                  <h3
                    className="mb-3"
                    style={{
                      fontFamily: 'Syne, sans-serif',
                      fontWeight: 600,
                      fontSize: '18px',
                      color: '#FFFFFF',
                      lineHeight: 1.3,
                    }}
                  >
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="mb-5 flex-grow"
                    style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '14px',
                      color: '#4A6B58',
                      lineHeight: 1.6,
                    }}
                  >
                    {step.description}
                  </p>

                  {/* Tag pill — delayed independent entrance */}
                  <motion.span
                    className="self-start"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      delay: index * 0.15 + 0.3,
                    }}
                    style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '11px',
                      color: '#1A8A5A',
                      background: 'rgba(26, 138, 90, 0.1)',
                      border: '1px solid rgba(26, 138, 90, 0.25)',
                      borderRadius: '999px',
                      padding: '3px 10px',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {step.tag}
                  </motion.span>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
