'use client';

import { motion } from 'framer-motion';

// ── Data ──────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const;

const EXTERNAL_LINKS = [
  {
    label: 'github.com/dacq7',
    href: 'https://github.com/dacq7',
  },
  {
    label: 'linkedin.com/in/diegocorreadev',
    href: 'https://linkedin.com/in/diegocorreadev',
  },
] as const;

// ── Variants ──────────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const colVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

// ── Column label ──────────────────────────────────────────────────────────────

function ColLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-sans uppercase"
      style={{
        color: '#4A6B58',
        fontSize: '11px',
        letterSpacing: '0.12em',
        marginBottom: '16px',
      }}
    >
      {children}
    </p>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer
      style={{
        background: '#0A1510',
        borderTop: '1px solid rgba(26, 138, 90, 0.15)',
      }}
    >
      <div
        className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16"
        style={{ paddingTop: '64px', paddingBottom: '64px' }}
      >
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >

          {/* ── Left: logo + tagline + copyright ─────────────────────── */}
          <motion.div className="flex flex-col gap-4" variants={colVariants}>
            <motion.a
              href="/"
              className="flex items-center gap-2.5 w-fit"
              aria-label="Veridis Dev — home"
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <motion.polygon
                  points="40,72 100,38 160,72 160,138 100,172 40,138"
                  fill="none"
                  stroke="#1A8A5A"
                  strokeWidth="3"
                  strokeDasharray="400"
                  initial={{ strokeDashoffset: 400, opacity: 0 }}
                  whileInView={{ strokeDashoffset: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
                />
                <polygon
                  points="40,72 100,38 160,72 160,138 100,172 40,138"
                  fill="#1A8A5A"
                  fillOpacity="0.13"
                />
                <polyline
                  points="62,88 100,142 138,88"
                  fill="none"
                  stroke="#1A8A5A"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-display text-[15px] leading-none select-none">
                <span className="font-semibold text-white">Veridis</span>
                <span className="font-light" style={{ color: '#1A8A5A' }}>Dev</span>
              </span>
            </motion.a>

            <p className="font-sans" style={{ color: '#4A6B58', fontSize: '13px', lineHeight: '1.6' }}>
              Software you can trust.
            </p>

            <motion.p
              className="font-sans mt-auto"
              style={{ color: '#4A6B58', fontSize: '12px', marginTop: '32px' }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.8 }}
            >
              © 2026 Veridis Dev. All rights reserved.
            </motion.p>
          </motion.div>

          {/* ── Center: navigation ───────────────────────────────────── */}
          <motion.div variants={colVariants}>
            <ColLabel>Navigation</ColLabel>
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <motion.a
                    href={href}
                    className="font-sans transition-colors duration-200 hover:text-white break-all"
                    style={{ color: '#4A6B58', fontSize: '14px' }}
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    {label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Right: contact ───────────────────────────────────────── */}
          <motion.div variants={colVariants}>
            <ColLabel>Contact</ColLabel>
            <ul className="flex flex-col gap-3">
              <li>
                <motion.a
                  href="mailto:team@veridisdev.com"
                  className="font-sans footer-email-link transition-colors duration-200"
                  style={{ color: '#1A8A5A', fontSize: '14px' }}
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  team@veridisdev.com
                </motion.a>
              </li>
              <li>
                <span className="font-sans" style={{ color: '#4A6B58', fontSize: '14px' }}>
                  Medellín, Colombia
                </span>
              </li>
              {EXTERNAL_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <motion.a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans transition-colors duration-200 hover:text-white break-all"
                    style={{ color: '#4A6B58', fontSize: '14px' }}
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    {label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

        </motion.div>
      </div>
    </footer>
  );
}
