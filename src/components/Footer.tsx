'use client';

import { motion, useAnimation } from 'framer-motion';
import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useIsTouch } from '@/hooks/useIsTouch';

// ── Data ──────────────────────────────────────────────────────────────────────

const NAV_HREFS = [
  { key: 'services', href: '#services' },
  { key: 'projects', href: '#projects' },
  { key: 'about', href: '#about' },
  { key: 'contact', href: '#contact' },
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

function ColLabel({ children, index = 0 }: { children: React.ReactNode; index?: number }) {
  return (
    <motion.h3
      className="font-sans uppercase"
      style={{
        color: '#4A6B58',
        fontSize: '11px',
        letterSpacing: '0.12em',
        marginBottom: '16px',
      }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      {children}
    </motion.h3>
  );
}

// ── TouchNavLink — Task 1 (press 0.94→1) + Task 2 (beam sweep) ───────────────

function TouchNavLink({
  href,
  color = '#4A6B58',
  hoverWhite = true,
  external,
  children,
}: {
  href: string;
  color?: string;
  hoverWhite?: boolean;
  external?: boolean;
  children: React.ReactNode;
}) {
  const isTouch = useIsTouch();
  const controls = useAnimation();
  const beamControls = useAnimation();

  const handleTouchStart = useCallback(() => {
    if (!isTouch) return;
    controls.set({ scale: 0.94 });
    controls.start({ scale: 1, transition: { type: 'spring', stiffness: 400, damping: 20 } });
    beamControls.set({ x: '-100%', opacity: 1 });
    beamControls.start({ x: '100%', opacity: 0, transition: { duration: 0.4, ease: 'easeOut' } });
  }, [isTouch, controls, beamControls]);

  return (
    <div className="relative overflow-hidden w-fit">
      <motion.div
        animate={beamControls}
        className="absolute inset-y-0 left-0 w-full pointer-events-none"
        style={{ background: 'rgba(26,138,90,0.15)' }}
      />
      <motion.a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={`font-sans transition-colors duration-200 break-all relative z-10${hoverWhite ? ' hover:text-white' : ''}`}
        style={{ color, fontSize: '14px' }}
        animate={controls}
        whileHover={{ x: 4 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        onTouchStart={isTouch ? handleTouchStart : undefined}
      >
        {children}
      </motion.a>
    </div>
  );
}

// ── TouchSocialLink — Task 2 (beam sweep) + Task 3 (scale 1→1.2→1, color flash) ─

function TouchSocialLink({ label, href }: { label: string; href: string }) {
  const isTouch = useIsTouch();
  const controls = useAnimation();
  const beamControls = useAnimation();

  const handleTouchStart = useCallback(() => {
    if (!isTouch) return;
    controls.start({
      scale: [1, 1.2, 1],
      color: ['#4A6B58', '#1A8A5A', '#4A6B58'],
      transition: { duration: 0.3, ease: 'easeInOut' },
    });
    beamControls.set({ x: '-100%', opacity: 1 });
    beamControls.start({ x: '100%', opacity: 0, transition: { duration: 0.4, ease: 'easeOut' } });
  }, [isTouch, controls, beamControls]);

  return (
    <div className="relative overflow-hidden w-fit">
      <motion.div
        animate={beamControls}
        className="absolute inset-y-0 left-0 w-full pointer-events-none"
        style={{ background: 'rgba(26,138,90,0.15)' }}
      />
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-sans transition-colors duration-200 hover:text-white break-all relative z-10"
        style={{ color: '#4A6B58', fontSize: '14px' }}
        animate={controls}
        whileHover={{ x: 4 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        onTouchStart={isTouch ? handleTouchStart : undefined}
      >
        {label}
      </motion.a>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('navbar');
  const navLinks = NAV_HREFS.map(({ key, href }) => ({ label: tNav(key), href }));

  const isTouch = useIsTouch();
  const logoControls = useAnimation();
  const hexControls = useAnimation();

  const handleLogoTouch = useCallback(() => {
    if (!isTouch) return;
    logoControls.set({ scale: 1.05, filter: 'drop-shadow(0 0 8px rgba(26,138,90,0.4))' });
    logoControls.start({
      scale: 1,
      filter: 'drop-shadow(0 0 0px rgba(26,138,90,0))',
      transition: { type: 'spring', stiffness: 300, damping: 18 },
    });
    hexControls.set({ strokeDashoffset: 400 });
    hexControls.start({
      strokeDashoffset: 0,
      transition: { duration: 0.6, ease: 'easeInOut' },
    });
  }, [isTouch, logoControls, hexControls]);

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
              aria-label={t('logoLabel')}
              animate={logoControls}
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onTouchStart={isTouch ? handleLogoTouch : undefined}
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
                  animate={hexControls}
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
              {t('tagline')}
            </p>

            <motion.div
              className="font-sans mt-auto"
              style={{ color: '#4A6B58', fontSize: '12px', marginTop: '32px' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {t('copyright')}
            </motion.div>
          </motion.div>

          {/* ── Center: navigation ───────────────────────────────────── */}
          <motion.div variants={colVariants}>
            <ColLabel index={0}>{t('navLabel')}</ColLabel>
            <ul className="flex flex-col gap-3">
              {navLinks.map(({ label, href }, index) => (
                <motion.li
                  key={href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.3, delay: index * 0.07 }}
                >
                  <TouchNavLink href={href}>{label}</TouchNavLink>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* ── Right: contact ───────────────────────────────────────── */}
          <motion.div variants={colVariants}>
            <ColLabel index={1}>{t('contactLabel')}</ColLabel>
            <ul className="flex flex-col gap-3">
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.3, delay: 0 * 0.07 }}
              >
                <TouchNavLink href="mailto:team@veridisdev.com" color="#1A8A5A" hoverWhite={false}>
                  team@veridisdev.com
                </TouchNavLink>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.3, delay: 1 * 0.07 }}
              >
                <span className="font-sans" style={{ color: '#4A6B58', fontSize: '14px' }}>
                  {t('location')}
                </span>
              </motion.li>
              {EXTERNAL_LINKS.map(({ label, href }, index) => (
                <motion.li
                  key={href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.3, delay: (index + 2) * 0.07 }}
                >
                  <TouchSocialLink label={label} href={href} />
                </motion.li>
              ))}
            </ul>
          </motion.div>

        </motion.div>
      </div>
    </footer>
  );
}
