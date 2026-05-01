'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

// ── Hooks ─────────────────────────────────────────────────────────────────────

function useIsTouch() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(navigator.maxTouchPoints > 0);
  }, []);
  return isTouch;
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  email: string;
  country: string;
  projectType: string;
  description: string;
  contactTime: string;
  timeline: string;
  budget: string;
  source: string;
}

type Step = 1 | 2;
type Direction = 'forward' | 'back';

// ── Data ──────────────────────────────────────────────────────────────────────

const PROJECT_TYPES = [
  { value: '', label: 'Select a project type' },
  { value: 'Web Application', label: 'Web Application' },
  { value: 'Mobile App', label: 'Mobile App' },
  { value: 'Landing Page', label: 'Landing Page' },
  { value: 'E-commerce Store', label: 'E-commerce Store' },
  { value: 'CRM / Internal Tool', label: 'CRM / Internal Tool' },
  { value: 'Not sure yet', label: 'Not sure yet' },
];

const CONTACT_TIMES = [
  { value: 'Morning (9am — 12pm)', label: 'Morning (9am — 12pm)' },
  { value: 'Afternoon (12pm — 5pm)', label: 'Afternoon (12pm — 5pm)' },
  { value: 'Evening (5pm — 8pm)', label: 'Evening (5pm — 8pm)' },
  { value: 'Anytime', label: 'Anytime' },
];

const TIMELINES = [
  { value: '', label: 'Select a timeline' },
  { value: 'As soon as possible', label: 'As soon as possible' },
  { value: '1 — 3 months', label: '1 — 3 months' },
  { value: '3 — 6 months', label: '3 — 6 months' },
  { value: 'Flexible', label: 'Flexible' },
];

const BUDGETS = [
  { value: '', label: 'Select a budget range' },
  { value: '< $500 USD', label: '< $500 USD' },
  { value: '$500 — $1.500 USD', label: '$500 — $1.500 USD' },
  { value: '$1.500 — $5.000 USD', label: '$1.500 — $5.000 USD' },
  { value: '$5.000+ USD', label: '$5.000+ USD' },
  { value: "Let's talk", label: "Let's talk" },
];

const SOURCES = [
  { value: '', label: 'Select an option' },
  { value: 'Google', label: 'Google' },
  { value: 'LinkedIn', label: 'LinkedIn' },
  { value: 'GitHub', label: 'GitHub' },
  { value: 'Referral', label: 'Referral' },
  { value: 'Other', label: 'Other' },
];

const INITIAL_FORM: FormData = {
  name: '',
  email: '',
  country: '',
  projectType: '',
  description: '',
  contactTime: '',
  timeline: '',
  budget: '',
  source: '',
};

// ── Animation variants ────────────────────────────────────────────────────────

const HEADER_VARIANT = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const COL_LEFT = {
  hidden: { opacity: 0, x: -30 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const COL_RIGHT = {
  hidden: { opacity: 0, x: 30 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const STEP_VARIANTS = {
  enter: (dir: Direction) => ({ x: dir === 'forward' ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: Direction) => ({ x: dir === 'forward' ? -40 : 40, opacity: 0 }),
};

// ── Shared field styles ───────────────────────────────────────────────────────

const FIELD_BASE: React.CSSProperties = {
  width: '100%',
  background: '#1A2820',
  border: '1px solid rgba(26, 138, 90, 0.2)',
  borderRadius: '6px',
  padding: '12px',
  color: '#ffffff',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconCopy({ done }: { done: boolean }) {
  if (done) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function IconChevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A6B58" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

// ── Left column ───────────────────────────────────────────────────────────────

function ContactInfo() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText('team@veridisdev.com').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="relative flex flex-col gap-10 h-full">
      {/* Decorative "V" — hidden on mobile to avoid overlapping contact info */}
      <div
        aria-hidden="true"
        className="hidden md:block absolute right-0 top-0 select-none pointer-events-none font-display font-bold leading-none"
        style={{
          fontSize: 'clamp(160px, 20vw, 260px)',
          color: 'rgba(26, 138, 90, 0.05)',
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        V
      </div>

      {/* Info rows */}
      <div className="relative flex flex-col gap-7">
        {/* Email */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0 }}
        >
          <p
            className="font-sans uppercase tracking-wide mb-1.5"
            style={{ color: '#4A6B58', fontSize: '11px', letterSpacing: '0.12em' }}
          >
            Email
          </p>
          <div className="flex items-center gap-3">
            <a
              href="mailto:team@veridisdev.com"
              className="font-sans text-white hover:text-accent transition-colors duration-200"
              style={{ fontSize: '15px' }}
            >
              team@veridisdev.com
            </a>
            <button
              onClick={handleCopy}
              title={copied ? 'Copied!' : 'Copy email'}
              className="flex items-center justify-center rounded transition-colors duration-200"
              style={{
                color: copied ? '#1A8A5A' : '#4A6B58',
                padding: '4px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <IconCopy done={copied} />
            </button>
          </div>
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p
            className="font-sans uppercase tracking-wide mb-1.5"
            style={{ color: '#4A6B58', fontSize: '11px', letterSpacing: '0.12em' }}
          >
            Location
          </p>
          <p className="font-sans text-white" style={{ fontSize: '15px' }}>
            Medellín, Colombia
          </p>
        </motion.div>

        {/* Response time */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p
            className="font-sans uppercase tracking-wide mb-1.5"
            style={{ color: '#4A6B58', fontSize: '11px', letterSpacing: '0.12em' }}
          >
            Response time
          </p>
          <p className="font-sans" style={{ color: '#1A8A5A', fontSize: '15px' }}>
            We respond within 24 hours
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// ── Field helpers ─────────────────────────────────────────────────────────────

function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-sans uppercase tracking-wide"
      style={{ color: '#4A6B58', fontSize: '11px', letterSpacing: '0.12em' }}
    >
      {children}
      {required && <span style={{ color: '#1A8A5A' }}> *</span>}
    </label>
  );
}

function SelectField({
  id,
  value,
  onChange,
  options,
}: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}) {
  const isTouch = useIsTouch();
  const scaleCtrl = useAnimation();
  const borderCtrl = useAnimation();

  function handleTouchStart() {
    if (!isTouch) return;
    scaleCtrl.start({ scale: [0.98, 1], transition: { type: 'spring', stiffness: 400, damping: 20 } });
    borderCtrl.start({ borderColor: ['#1A8A5A', 'rgba(26, 138, 90, 0.2)'], transition: { duration: 0.3 } });
  }

  return (
    <motion.div className="relative" animate={scaleCtrl}>
      <motion.select
        id={id}
        className="contact-field font-sans appearance-none cursor-pointer"
        style={{ ...FIELD_BASE, paddingRight: '36px' }}
        animate={borderCtrl}
        value={value}
        onChange={onChange}
        onTouchStart={handleTouchStart}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </motion.select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
        <IconChevron />
      </div>
    </motion.div>
  );
}

// ── Step indicator ────────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: Step }) {
  const steps = [
    { num: '01', label: 'Your info' },
    { num: '02', label: 'Project details' },
  ];

  const ctrl1 = useAnimation();
  const ctrl2 = useAnimation();

  useEffect(() => {
    const ctrl = step === 1 ? ctrl1 : ctrl2;
    async function runSequence() {
      await ctrl.start({ scale: 1.3, color: '#1A8A5A', transition: { duration: 0.15, ease: 'easeOut' } });
      ctrl.start({ scale: 1, color: '#ffffff', transition: { type: 'spring', stiffness: 400, damping: 20 } });
    }
    runSequence();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <div className="mb-6">
      <div className="flex gap-6 mb-3">
        {steps.map((s, i) => {
          const active = step === i + 1;
          const ctrl = i === 0 ? ctrl1 : ctrl2;
          return (
            <div
              key={s.num}
              className="pb-2 relative"
            >
              <motion.span
                animate={ctrl}
                className="font-sans"
                style={{
                  fontSize: '13px',
                  color: active ? '#ffffff' : '#4A6B58',
                  letterSpacing: '0.02em',
                  display: 'inline-block',
                }}
              >
                {s.num} — {s.label}
              </motion.span>
              {active && (
                <motion.div
                  key={step}
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: '#1A8A5A',
                    transformOrigin: 'left',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      {/* Progress bar */}
      <div
        style={{
          height: '2px',
          background: 'rgba(26,138,90,0.1)',
          borderRadius: '1px',
          overflow: 'hidden',
        }}
      >
        <motion.div
          style={{ height: '100%', background: '#1A8A5A', borderRadius: '1px' }}
          animate={{ width: step === 1 ? '50%' : '100%' }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>
    </div>
  );
}

// ── Contact info strip ────────────────────────────────────────────────────────

function ContactInfoStrip() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText('team@veridisdev.com').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div
      className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-6 pt-5"
      style={{ borderTop: '1px solid rgba(26,138,90,0.1)' }}
    >
      <div className="flex items-center gap-2">
        <a
          href="mailto:team@veridisdev.com"
          className="font-sans transition-colors duration-200"
          style={{ color: '#ffffff', fontSize: '13px' }}
        >
          team@veridisdev.com
        </a>
        <button
          onClick={handleCopy}
          title={copied ? 'Copied!' : 'Copy email'}
          className="flex items-center justify-center rounded transition-colors duration-200"
          style={{
            color: copied ? '#1A8A5A' : '#4A6B58',
            padding: '2px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <IconCopy done={copied} />
        </button>
      </div>
      <span className="font-sans" style={{ color: '#4A6B58', fontSize: '13px' }}>
        We respond within 24 hours
      </span>
      <span style={{ color: '#4A6B58' }}>·</span>
      <span className="font-sans" style={{ color: '#4A6B58', fontSize: '13px' }}>
        Medellín, Colombia 🇨🇴 · Working globally
      </span>
    </div>
  );
}

// ── Success state ─────────────────────────────────────────────────────────────

function SuccessState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col items-center text-center gap-6 py-16"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'rgba(26, 138, 90, 0.12)',
          border: '1px solid rgba(26, 138, 90, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1A8A5A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ strokeDashoffset: 100 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <path d="M20 6L9 17l-5-5" strokeDasharray="100" strokeDashoffset="100" />
        </motion.svg>
      </motion.div>

      <div>
        <p className="font-display font-semibold text-white mb-3" style={{ fontSize: '28px' }}>
          {"Message sent!".split(' ').map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: 'blur(8px)', y: 10 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              style={{ display: 'inline-block' }}
            >
              {word}{' '}
            </motion.span>
          ))}
        </p>
        <p
          className="font-sans mb-4"
          style={{ color: '#4A6B58', fontSize: '15px', lineHeight: '1.6' }}
        >
          We&apos;ll review your project and get back to you within 24 hours.
        </p>
        <a
          href="#projects"
          className="font-sans transition-colors duration-200 hover:opacity-80"
          style={{ color: '#1A8A5A', fontSize: '14px' }}
        >
          While you wait, check out our work →
        </a>
      </div>
    </motion.div>
  );
}

// ── Form ──────────────────────────────────────────────────────────────────────

function ContactForm() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [stepError, setStepError] = useState('');
  const [direction, setDirection] = useState<Direction>('forward');

  const isTouch = useIsTouch();
  const nextBtnScale = useAnimation();
  const nextBtnFlash = useAnimation();
  const submitBtnScale = useAnimation();
  const submitBtnFlash = useAnimation();
  const backBtnCtrl = useAnimation();

  function firePress(scaleCtrl: ReturnType<typeof useAnimation>, flashCtrl: ReturnType<typeof useAnimation>) {
    if (!isTouch) return;
    scaleCtrl.start({ scale: [0.93, 1], transition: { type: 'spring', stiffness: 400, damping: 18 } });
    flashCtrl.start({ backgroundColor: ['rgba(26,138,90,0.25)', 'rgba(26,138,90,0)'], transition: { duration: 0.4 } });
  }

  function update(field: keyof FormData) {
    return (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  function setRadio(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validateStep1(): boolean {
    if (!form.name.trim()) {
      setStepError('Please enter your full name.');
      return false;
    }
    if (!form.email.trim()) {
      setStepError('Please enter your email.');
      return false;
    }
    if (!form.country.trim()) {
      setStepError('Please enter your country or city.');
      return false;
    }
    if (!form.projectType) {
      setStepError('Please select a project type.');
      return false;
    }
    setStepError('');
    return true;
  }

  function handleNext() {
    if (!validateStep1()) return;
    setDirection('forward');
    setStep(2);
  }

  function handleBack() {
    setDirection('back');
    setStep(1);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.description.trim()) {
      setError('Please describe your project.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? 'Something went wrong');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <style>{`
        .contact-field:focus {
          border-color: rgba(26, 138, 90, 0.6) !important;
        }
        .contact-field option {
          background: #1A2820;
          color: #ffffff;
        }
      `}</style>

      {success ? (
        <SuccessState />
      ) : (
        <>
          <StepIndicator step={step} />

          <form onSubmit={handleSubmit} noValidate>
            <AnimatePresence mode="wait" custom={direction}>
              {step === 1 ? (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={STEP_VARIANTS}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="flex flex-col gap-5"
                >
                  {/* Full name */}
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel htmlFor="cf-name" required>
                      Full name
                    </FieldLabel>
                    <motion.input
                      id="cf-name"
                      type="text"
                      className="contact-field font-sans"
                      style={FIELD_BASE}
                      value={form.name}
                      onChange={update('name')}
                      initial={{ boxShadow: '0 0 0px rgba(26,138,90,0)' }}
                      whileFocus={{ boxShadow: '0 0 0 2px rgba(26,138,90,0.4)', transition: { duration: 0.3, ease: 'easeOut' } }}
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel htmlFor="cf-email" required>
                      Email
                    </FieldLabel>
                    <motion.input
                      id="cf-email"
                      type="email"
                      className="contact-field font-sans"
                      style={FIELD_BASE}
                      value={form.email}
                      onChange={update('email')}
                      initial={{ boxShadow: '0 0 0px rgba(26,138,90,0)' }}
                      whileFocus={{ boxShadow: '0 0 0 2px rgba(26,138,90,0.4)', transition: { duration: 0.3, ease: 'easeOut' } }}
                    />
                  </div>

                  {/* Country / City */}
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel htmlFor="cf-country" required>
                      Country / City
                    </FieldLabel>
                    <motion.input
                      id="cf-country"
                      type="text"
                      placeholder="e.g. Medellín, Colombia or Austin, TX"
                      className="contact-field font-sans"
                      style={FIELD_BASE}
                      value={form.country}
                      onChange={update('country')}
                      initial={{ boxShadow: '0 0 0px rgba(26,138,90,0)' }}
                      whileFocus={{ boxShadow: '0 0 0 2px rgba(26,138,90,0.4)', transition: { duration: 0.3, ease: 'easeOut' } }}
                    />
                  </div>

                  {/* Project type */}
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel htmlFor="cf-projectType" required>
                      Project type
                    </FieldLabel>
                    <SelectField
                      id="cf-projectType"
                      value={form.projectType}
                      onChange={update('projectType')}
                      options={PROJECT_TYPES}
                    />
                  </div>

                  {/* Step validation error */}
                  {stepError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-sans text-sm"
                      style={{ color: '#E05C5C' }}
                    >
                      {stepError}
                    </motion.p>
                  )}

                  {/* Next button */}
                  <motion.button
                    type="button"
                    animate={nextBtnScale}
                    onTouchStart={() => firePress(nextBtnScale, nextBtnFlash)}
                    onClick={handleNext}
                    className="font-sans font-medium text-white rounded-[6px] transition-all duration-200"
                    style={{
                      width: '100%',
                      padding: '14px',
                      fontSize: '14px',
                      background: '#1A8A5A',
                      border: 'none',
                      cursor: 'pointer',
                      letterSpacing: '0.01em',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <motion.span
                      animate={nextBtnFlash}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '6px',
                        pointerEvents: 'none',
                        backgroundColor: 'rgba(26,138,90,0)',
                      }}
                    />
                    Next →
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={STEP_VARIANTS}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="flex flex-col gap-5"
                >
                  {/* Project description */}
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel htmlFor="cf-description" required>
                      Project description
                    </FieldLabel>
                    <motion.textarea
                      id="cf-description"
                      rows={5}
                      className="contact-field font-sans resize-none"
                      style={FIELD_BASE}
                      value={form.description}
                      onChange={update('description')}
                      placeholder="What problem does it solve? Who will use it? Do you have an existing system we need to integrate with?"
                      initial={{ boxShadow: '0 0 0px rgba(26,138,90,0)' }}
                      whileFocus={{ boxShadow: '0 0 0 2px rgba(26,138,90,0.4)', transition: { duration: 0.3, ease: 'easeOut' } }}
                    />
                  </div>

                  {/* Preferred contact time — custom radio */}
                  <div className="flex flex-col gap-2">
                    <p
                      className="font-sans uppercase tracking-wide"
                      style={{ color: '#4A6B58', fontSize: '11px', letterSpacing: '0.12em' }}
                    >
                      Preferred contact time
                    </p>
                    <div className="flex flex-col gap-2">
                      {CONTACT_TIMES.map((ct) => (
                        <button
                          key={ct.value}
                          type="button"
                          onClick={() => setRadio('contactTime', ct.value)}
                          className="flex items-center gap-2.5 text-left w-full"
                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                        >
                          <div
                            style={{
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              border: `1px solid ${
                                form.contactTime === ct.value
                                  ? '#1A8A5A'
                                  : 'rgba(26,138,90,0.3)'
                              }`,
                              background: '#1A2820',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {form.contactTime === ct.value && (
                              <div
                                style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  background: '#1A8A5A',
                                }}
                              />
                            )}
                          </div>
                          <span
                            className="font-sans"
                            style={{ color: '#4A6B58', fontSize: '13px' }}
                          >
                            {ct.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel htmlFor="cf-timeline">Timeline</FieldLabel>
                    <SelectField
                      id="cf-timeline"
                      value={form.timeline}
                      onChange={update('timeline')}
                      options={TIMELINES}
                    />
                  </div>

                  {/* Budget range */}
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel htmlFor="cf-budget">Budget range</FieldLabel>
                    <SelectField
                      id="cf-budget"
                      value={form.budget}
                      onChange={update('budget')}
                      options={BUDGETS}
                    />
                  </div>

                  {/* How did you find us */}
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel htmlFor="cf-source">How did you find us?</FieldLabel>
                    <SelectField
                      id="cf-source"
                      value={form.source}
                      onChange={update('source')}
                      options={SOURCES}
                    />
                  </div>

                  {/* Submit error */}
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-sans text-sm"
                      style={{ color: '#E05C5C' }}
                    >
                      {error}
                    </motion.p>
                  )}

                  {/* Back + Submit buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      type="button"
                      onClick={handleBack}
                      animate={backBtnCtrl}
                      onTouchStart={() => {
                        if (!isTouch) return;
                        backBtnCtrl.start({
                          scale: [0.92, 1],
                          opacity: [1, 0.5, 1],
                          transition: {
                            scale: { type: 'spring', stiffness: 400, damping: 18 },
                            opacity: { duration: 0.3 },
                          },
                        });
                      }}
                      className="font-sans font-medium rounded-[6px] transition-all duration-200"
                      style={{
                        padding: '14px 20px',
                        fontSize: '14px',
                        background: 'transparent',
                        border: '1px solid #1A8A5A',
                        color: '#1A8A5A',
                        cursor: 'pointer',
                        letterSpacing: '0.01em',
                        flexShrink: 0,
                      }}
                    >
                      ← Back
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={loading}
                      animate={submitBtnScale}
                      onTouchStart={() => firePress(submitBtnScale, submitBtnFlash)}
                      className="font-sans font-medium text-white rounded-[6px] transition-all duration-200"
                      style={{
                        flex: 1,
                        padding: '14px',
                        fontSize: '14px',
                        background: loading ? 'rgba(26, 138, 90, 0.6)' : '#1A8A5A',
                        border: 'none',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        letterSpacing: '0.01em',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <motion.span
                        animate={submitBtnFlash}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '6px',
                          pointerEvents: 'none',
                          backgroundColor: 'rgba(26,138,90,0)',
                        }}
                      />
                      {loading ? 'Sending…' : <>Send message <motion.span whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} style={{ display: 'inline-block' }}>→</motion.span></>}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </>
      )}

      <ContactInfoStrip />
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative py-24 md:py-32"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(26, 138, 90, 0.25) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16">

        {/* Section header */}
        <motion.div
          variants={HEADER_VARIANT}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="mb-14 md:mb-16"
        >
          <p className="font-sans text-xs tracking-widest uppercase text-accent mb-3">
            Start a project
          </p>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="font-display font-semibold text-white text-4xl md:text-5xl mb-4"
            style={{ perspective: '400px' }}
          >
            {"Let's build something.".split('').map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20, rotateX: -90 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                style={{ display: 'inline-block' }}
              >
                {char === ' ' ? ' ' : char}
              </motion.span>
            ))}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-sans text-text-secondary text-base leading-relaxed max-w-lg"
          >
            Tell us about your project. We respond within 24 hours.
          </motion.p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">

          {/* Left — contact info */}
          <motion.div
            variants={COL_LEFT}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            <ContactInfo />
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <ContactForm />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
