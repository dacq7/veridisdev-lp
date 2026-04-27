'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// ── Types ─────────────────────────────────────────────────────────────────────

type FormData = {
  name: string;
  email: string;
  project: string;
  budget: string;
};

type Status = 'idle' | 'loading' | 'success' | 'error';

// ── Data ──────────────────────────────────────────────────────────────────────

const BUDGET_OPTIONS = [
  { value: '', label: 'Select a budget range (optional)' },
  { value: '< $500 USD', label: '< $500 USD' },
  { value: '$500 - $1.500 USD', label: '$500 - $1.500 USD' },
  { value: '$1.500 - $5.000 USD', label: '$1.500 - $5.000 USD' },
  { value: '$5.000+ USD', label: '$5.000+ USD' },
  { value: "Let's talk", label: "Let's talk" },
];

const INITIAL_FORM: FormData = { name: '', email: '', project: '', budget: '' };

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
};

// ── Copy icon ─────────────────────────────────────────────────────────────────

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

// ── Chevron down ──────────────────────────────────────────────────────────────

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
      {/* Decorative "V" */}
      <div
        aria-hidden="true"
        className="absolute right-0 top-0 select-none pointer-events-none font-display font-bold leading-none"
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
        <div>
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
        </div>

        {/* Location */}
        <div>
          <p
            className="font-sans uppercase tracking-wide mb-1.5"
            style={{ color: '#4A6B58', fontSize: '11px', letterSpacing: '0.12em' }}
          >
            Location
          </p>
          <p className="font-sans text-white" style={{ fontSize: '15px' }}>
            Medellín, Colombia
          </p>
        </div>

        {/* Response time */}
        <div>
          <p
            className="font-sans uppercase tracking-wide mb-1.5"
            style={{ color: '#4A6B58', fontSize: '11px', letterSpacing: '0.12em' }}
          >
            Response time
          </p>
          <p className="font-sans" style={{ color: '#1A8A5A', fontSize: '15px' }}>
            We respond within 24 hours
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Form ──────────────────────────────────────────────────────────────────────

function ContactForm() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function set(field: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? 'Something went wrong');
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex flex-col items-start gap-4 py-12"
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(26, 138, 90, 0.12)',
            border: '1px solid rgba(26, 138, 90, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A8A5A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <div>
          <p className="font-display font-semibold text-white" style={{ fontSize: '20px', marginBottom: '8px' }}>
            Message sent!
          </p>
          <p className="font-sans text-text-secondary" style={{ fontSize: '15px', lineHeight: '1.6' }}>
            We&apos;ll get back to you within 24 hours.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Focus styles injected once */}
      <style>{`
        .contact-field:focus {
          border-color: rgba(26, 138, 90, 0.6) !important;
          box-shadow: 0 0 0 3px rgba(26, 138, 90, 0.08);
        }
        .contact-field option {
          background: #1A2820;
          color: #ffffff;
        }
      `}</style>

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="cf-name"
          className="font-sans uppercase tracking-wide"
          style={{ color: '#4A6B58', fontSize: '11px', letterSpacing: '0.12em' }}
        >
          Name <span style={{ color: '#1A8A5A' }}>*</span>
        </label>
        <input
          id="cf-name"
          type="text"
          required
          className="contact-field font-sans"
          style={FIELD_BASE}
          value={form.name}
          onChange={set('name')}
          placeholder="Diego Correa"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="cf-email"
          className="font-sans uppercase tracking-wide"
          style={{ color: '#4A6B58', fontSize: '11px', letterSpacing: '0.12em' }}
        >
          Email <span style={{ color: '#1A8A5A' }}>*</span>
        </label>
        <input
          id="cf-email"
          type="email"
          required
          className="contact-field font-sans"
          style={FIELD_BASE}
          value={form.email}
          onChange={set('email')}
          placeholder="you@company.com"
        />
      </div>

      {/* Project */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="cf-project"
          className="font-sans uppercase tracking-wide"
          style={{ color: '#4A6B58', fontSize: '11px', letterSpacing: '0.12em' }}
        >
          Project description <span style={{ color: '#1A8A5A' }}>*</span>
        </label>
        <textarea
          id="cf-project"
          required
          rows={4}
          className="contact-field font-sans resize-none"
          style={FIELD_BASE}
          value={form.project}
          onChange={set('project')}
          placeholder="Tell us what you want to build — what problem it solves and who uses it."
        />
      </div>

      {/* Budget */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="cf-budget"
          className="font-sans uppercase tracking-wide"
          style={{ color: '#4A6B58', fontSize: '11px', letterSpacing: '0.12em' }}
        >
          Budget range
        </label>
        <div className="relative">
          <select
            id="cf-budget"
            className="contact-field font-sans appearance-none cursor-pointer"
            style={{ ...FIELD_BASE, paddingRight: '36px' }}
            value={form.budget}
            onChange={set('budget')}
          >
            {BUDGET_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          >
            <IconChevron />
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="font-sans font-medium text-white rounded-[6px] transition-all duration-200"
        style={{
          width: '100%',
          padding: '14px',
          fontSize: '14px',
          background: status === 'loading' ? 'rgba(26, 138, 90, 0.6)' : '#1A8A5A',
          border: 'none',
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          letterSpacing: '0.01em',
        }}
      >
        {status === 'loading' ? 'Sending…' : 'Send message →'}
      </button>

      {/* Inline error */}
      {status === 'error' && (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-sans text-sm"
          style={{ color: '#E05C5C' }}
        >
          {errorMsg}
        </motion.p>
      )}
    </form>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-8">

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
          <h2 className="font-display font-semibold text-white text-4xl md:text-5xl mb-4">
            Let&apos;s build something.
          </h2>
          <p className="font-sans text-text-secondary text-base leading-relaxed max-w-lg">
            Tell us about your project. We respond within 24 hours.
          </p>
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
            variants={COL_RIGHT}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            <ContactForm />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
