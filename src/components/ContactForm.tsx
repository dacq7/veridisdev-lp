'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useIsTouch } from '@/hooks/useIsTouch';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

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

type SelectOption = { value: string; label: string };

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
  const t = useTranslations('contact');
  const { copied, copy } = useCopyToClipboard();

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
            {t('info.emailLabel')}
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
              onClick={() => copy('team@veridisdev.com')}
              title={copied ? t('info.copied') : t('info.copyEmail')}
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

        {/* WhatsApp */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <p
            className="font-sans uppercase tracking-wide mb-1.5"
            style={{ color: '#4A6B58', fontSize: '11px', letterSpacing: '0.12em' }}
          >
            {t('info.whatsapp.label')}
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/573017684794"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-white hover:text-accent transition-colors duration-200 flex items-center gap-2"
              style={{ fontSize: '15px' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {t('info.whatsapp.link')}
            </a>
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
            {t('info.locationLabel')}
          </p>
          <p className="font-sans text-white" style={{ fontSize: '15px' }}>
            {t('info.location')}
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
            {t('info.responseTimeLabel')}
          </p>
          <p className="font-sans" style={{ color: '#1A8A5A', fontSize: '15px' }}>
            {t('info.responseTime')}
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
  const t = useTranslations('contact');
  const steps = t.raw('steps') as Array<{ num: string; label: string }>;

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
  const t = useTranslations('contact');
  const { copied, copy } = useCopyToClipboard();

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
          onClick={() => copy('team@veridisdev.com')}
          title={copied ? t('info.copied') : t('info.copyEmail')}
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
        {t('info.stripResponse')}
      </span>
      <span style={{ color: '#4A6B58' }}>·</span>
      <span className="font-sans" style={{ color: '#4A6B58', fontSize: '13px' }}>
        {t('info.stripLocation')}
      </span>
    </div>
  );
}

// ── Success state ─────────────────────────────────────────────────────────────

function SuccessState() {
  const t = useTranslations('contact');
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center text-center gap-6 py-16"
    >
      <div className="relative">
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-20px',
            background: 'radial-gradient(circle, rgba(26,138,90,0.15), transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            border: '1px solid #1A8A5A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1A8A5A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              d="M20 6L9 17l-5-5"
              strokeDasharray="100"
              initial={{ strokeDashoffset: 100 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
            />
          </svg>
        </motion.div>
      </div>

      <div>
        <p className="font-display font-bold text-3xl text-white mb-3">
          {t('success.title')}
        </p>
        <p className="font-sans text-sm text-white opacity-70">
          {t('success.subtitle')}
        </p>
      </div>
    </motion.div>
  );
}

// ── Form ──────────────────────────────────────────────────────────────────────

function ContactFormInner() {
  const t = useTranslations('contact');
  const projectTypes = t.raw('options.projectTypes') as SelectOption[];
  const contactTimes = t.raw('options.contactTimes') as SelectOption[];
  const timelines = t.raw('options.timelines') as SelectOption[];
  const budgets = t.raw('options.budgets') as SelectOption[];
  const sources = t.raw('options.sources') as SelectOption[];

  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  // Listen for prefill events dispatched by QuoteCalculator
  useEffect(() => {
    const SERVICE_TO_PROJECT_TYPE: Record<string, string> = {
      landing:      'Landing Page',
      reservations: 'Reservation System',
      webapp:       'Web Application',
      ecommerce:    'E-commerce Store',
      mobile:       'Mobile App',
      maintenance:  'Monthly Maintenance',
    };
    function handlePrefill(e: Event) {
      const { message, service } = (e as CustomEvent<{ message: string; service: string }>).detail;
      setForm((prev) => ({
        ...prev,
        description: message,
        projectType: SERVICE_TO_PROJECT_TYPE[service] ?? prev.projectType,
      }));
    }
    window.addEventListener('veridis:prefill-contact', handlePrefill);
    return () => window.removeEventListener('veridis:prefill-contact', handlePrefill);
  }, []);
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
      setStepError(t('errors.nameRequired'));
      return false;
    }
    if (!form.email.trim()) {
      setStepError(t('errors.emailRequired'));
      return false;
    }
    if (!form.country.trim()) {
      setStepError(t('errors.countryRequired'));
      return false;
    }
    if (!form.projectType) {
      setStepError(t('errors.projectTypeRequired'));
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
      setError(t('errors.descriptionRequired'));
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
        if (res.status === 403) throw new Error(t('errors.forbidden'));
        if (res.status === 429) throw new Error(t('errors.rateLimited'));
        if (res.status === 400) throw new Error(t('errors.validationFailed'));
        throw new Error(t('errors.generic'));
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
                      {t('fields.name')}
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
                      {t('fields.email')}
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
                      {t('fields.country')}
                    </FieldLabel>
                    <motion.input
                      id="cf-country"
                      type="text"
                      placeholder={t('fields.countryPlaceholder')}
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
                      {t('fields.projectType')}
                    </FieldLabel>
                    <SelectField
                      id="cf-projectType"
                      value={form.projectType}
                      onChange={update('projectType')}
                      options={projectTypes}
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
                    {t('buttons.next')}
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
                      {t('fields.description')}
                    </FieldLabel>
                    <motion.textarea
                      id="cf-description"
                      rows={5}
                      className="contact-field font-sans resize-none"
                      style={FIELD_BASE}
                      value={form.description}
                      onChange={update('description')}
                      placeholder={t('fields.descriptionPlaceholder')}
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
                      {t('fields.contactTime')}
                    </p>
                    <div className="flex flex-col gap-2">
                      {contactTimes.map((ct) => (
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
                    <FieldLabel htmlFor="cf-timeline">{t('fields.timeline')}</FieldLabel>
                    <SelectField
                      id="cf-timeline"
                      value={form.timeline}
                      onChange={update('timeline')}
                      options={timelines}
                    />
                  </div>

                  {/* Budget range */}
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel htmlFor="cf-budget">{t('fields.budget')}</FieldLabel>
                    <SelectField
                      id="cf-budget"
                      value={form.budget}
                      onChange={update('budget')}
                      options={budgets}
                    />
                  </div>

                  {/* How did you find us */}
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel htmlFor="cf-source">{t('fields.source')}</FieldLabel>
                    <SelectField
                      id="cf-source"
                      value={form.source}
                      onChange={update('source')}
                      options={sources}
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
                      {t('buttons.back')}
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
                      {loading ? t('buttons.sending') : <>{t('buttons.send')} <motion.span whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} style={{ display: 'inline-block' }}>→</motion.span></>}
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

// ── Two-column layout exported as client island ───────────────────────────────

export default function ContactForm() {
  return (
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
        <ContactFormInner />
      </motion.div>
    </div>
  );
}
