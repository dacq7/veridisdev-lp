'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import Image from 'next/image';
import MagneticButton from '@/components/MagneticButton';

function useScrolled(threshold = 50): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > threshold);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return scrolled;
}

function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(navigator.maxTouchPoints > 0 || 'ontouchstart' in window);
  }, []);
  return isTouch;
}

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const;

function useActiveSection(): string {
  const [active, setActive] = useState('');
  useEffect(() => {
    const ids = NAV_LINKS.map(({ href }) => href.slice(1));
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);
  return active;
}

// Task 1: nav link with touch press physics + active section indicator
function NavLink({
  href,
  label,
  onClick,
  mobile,
  isActive,
}: {
  href: string;
  label: string;
  onClick?: () => void;
  mobile?: boolean;
  isActive?: boolean;
}) {
  const isTouch = useIsTouch();
  const controls = useAnimation();
  const [hovered, setHovered] = useState(false);

  const handleTouchStart = useCallback(() => {
    if (!isTouch) return;
    controls.set({ scale: 0.94 });
    controls.start({ scale: 1, transition: { type: 'spring', stiffness: 400, damping: 20 } });
  }, [isTouch, controls]);

  const indicatorOpacity = !mobile
    ? isTouch
      ? isActive ? 0.5 : 0
      : hovered ? 1 : 0
    : 0;

  return (
    <motion.a
      href={href}
      onClick={onClick}
      animate={controls}
      onTouchStart={handleTouchStart}
      onHoverStart={() => { if (!isTouch) setHovered(true); }}
      onHoverEnd={() => { if (!isTouch) setHovered(false); }}
      whileTap={!mobile ? { opacity: 0.6, scale: 0.95 } : undefined}
      transition={!mobile ? { type: 'spring', stiffness: 500, damping: 25 } : undefined}
      className={
        mobile
          ? 'block text-3xl font-display font-semibold text-[#4A6B58] hover:text-white transition-colors duration-300 py-3 border-b border-surface'
          : 'relative text-[#4A6B58] hover:text-white transition-colors duration-300 text-xs font-medium tracking-widest uppercase font-sans'
      }
    >
      {label}
      {!mobile && (
        <motion.span
          className="absolute -bottom-0.5 left-0 right-0 h-px bg-accent pointer-events-none"
          animate={{ opacity: indicatorOpacity }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.a>
  );
}

export default function Navbar() {
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);
  const isTouch = useIsTouch();
  const activeSection = useActiveSection();

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Task 2: hamburger bar animation controls (handle both open/close and touch scale)
  const bar1Controls = useAnimation();
  const bar2Controls = useAnimation();
  const bar3Controls = useAnimation();

  useEffect(() => {
    if (menuOpen) {
      bar1Controls.start({ rotate: 45, y: 7, transition: { duration: 0.2 } });
      bar2Controls.start({ opacity: 0, scaleX: 0, transition: { duration: 0.15 } });
      bar3Controls.start({ rotate: -45, y: -7, transition: { duration: 0.2 } });
    } else {
      bar1Controls.start({ rotate: 0, y: 0, transition: { duration: 0.2 } });
      bar2Controls.start({ opacity: 1, scaleX: 1, transition: { duration: 0.15 } });
      bar3Controls.start({ rotate: 0, y: 0, transition: { duration: 0.2 } });
    }
  }, [menuOpen, bar1Controls, bar2Controls, bar3Controls]);

  const handleHamburgerTouch = useCallback(() => {
    if (!isTouch) return;
    const spring = { type: 'spring' as const, stiffness: 500, damping: 25 };
    bar1Controls.set({ scaleY: 0.85 });
    bar1Controls.start({ scaleY: 1, transition: spring });
    setTimeout(() => {
      bar2Controls.set({ scaleY: 0.85 });
      bar2Controls.start({ scaleY: 1, transition: spring });
    }, 50);
    setTimeout(() => {
      bar3Controls.set({ scaleY: 0.85 });
      bar3Controls.start({ scaleY: 1, transition: spring });
    }, 100);
  }, [isTouch, bar1Controls, bar2Controls, bar3Controls]);

  // Logo touch animation
  const logoControls = useAnimation();
  const handleLogoTouch = useCallback(() => {
    if (!isTouch) return;
    logoControls.set({ scale: 1 });
    logoControls.start({
      scale: [1, 1.06, 1],
      transition: { type: 'spring', stiffness: 300, damping: 18 },
    });
  }, [isTouch, logoControls]);

  // Task 3: CTA touch animation controls
  const ctaScaleControls = useAnimation();
  const ctaFlashControls = useAnimation();

  const handleCtaTouch = useCallback(() => {
    if (!isTouch) return;
    ctaFlashControls.set({ opacity: 1 });
    ctaFlashControls.start({ opacity: 0, transition: { duration: 0.4 } });
    ctaScaleControls.set({ scale: 0.92 });
    ctaScaleControls.start({ scale: 1, transition: { type: 'spring', stiffness: 400, damping: 18 } });
  }, [isTouch, ctaScaleControls, ctaFlashControls]);

  const mobileCtaScaleControls = useAnimation();
  const mobileCtaFlashControls = useAnimation();

  const handleMobileCtaTouch = useCallback(() => {
    if (!isTouch) return;
    mobileCtaFlashControls.set({ opacity: 1 });
    mobileCtaFlashControls.start({ opacity: 0, transition: { duration: 0.4 } });
    mobileCtaScaleControls.set({ scale: 0.92 });
    mobileCtaScaleControls.start({ scale: 1, transition: { type: 'spring', stiffness: 400, damping: 18 } });
  }, [isTouch, mobileCtaScaleControls, mobileCtaFlashControls]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        role="banner"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={
          scrolled
            ? {
                background: 'rgba(15, 26, 20, 0.85)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(26, 138, 90, 0.15)',
              }
            : undefined
        }
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 overflow-x-hidden"
      >
        <nav
          role="navigation"
          aria-label="Main navigation"
          className="w-full max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between"
        >
          {/* Logo */}
          <motion.a
            href="/"
            animate={logoControls}
            onTouchStart={handleLogoTouch}
            className="flex items-center gap-2.5 shrink-0"
            aria-label="Veridis Dev — home"
          >
            <Image
              src="/logo/veridis-icon.svg"
              alt="Veridis Dev logo"
              width={32}
              height={32}
              priority
              unoptimized
            />
            <span className="font-display text-[15px] leading-none select-none">
              <span className="font-semibold text-white">Veridis</span>
              <span className="font-light text-[#1A8A5A]">Dev</span>
            </span>
          </motion.a>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-8" role="list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <NavLink href={href} label={label} isActive={activeSection === href.slice(1)} />
              </li>
            ))}
          </ul>

          {/* Desktop CTA — Task 3 */}
          <div className="hidden md:block">
            <MagneticButton>
              <motion.a
                href="#contact"
                animate={ctaScaleControls}
                onTouchStart={handleCtaTouch}
                className="relative overflow-hidden inline-flex items-center bg-accent text-white text-xs font-medium font-sans rounded-[6px] px-5 py-2.5 hover:bg-primary transition-all duration-200 hover:scale-[1.02]"
              >
                <motion.span
                  animate={ctaFlashControls}
                  initial={{ opacity: 0 }}
                  className="absolute inset-0 rounded-[6px] pointer-events-none"
                  style={{ backgroundColor: 'rgba(26,138,90,0.3)' }}
                />
                Start a project
              </motion.a>
            </MagneticButton>
          </div>

          {/* Mobile hamburger — Task 3 */}
          <motion.button
            className="md:hidden flex flex-col justify-center items-center w-11 h-11 gap-[5px] shrink-0 pr-4"
            onClick={() => setMenuOpen((v) => !v)}
            onTouchStart={handleHamburgerTouch}
            whileTap={{ scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <motion.span
              animate={bar1Controls}
              className="block w-5 h-[1.5px] bg-white origin-center"
            />
            <motion.span
              animate={bar2Controls}
              className="block w-5 h-[1.5px] bg-white"
            />
            <motion.span
              animate={bar3Controls}
              className="block w-5 h-[1.5px] bg-white origin-center"
            />
          </motion.button>
        </nav>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-40 bg-background flex flex-col pt-24 px-6 pb-10 md:hidden"
          >
            <ul className="flex flex-col gap-2" role="list">
              {NAV_LINKS.map(({ label, href }, i) => (
                <motion.li
                  key={href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.2 }}
                >
                  <NavLink href={href} label={label} onClick={closeMenu} mobile />
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.25 }}
              className="mt-10"
            >
              {/* Mobile CTA — Task 3 */}
              <motion.a
                href="#contact"
                onClick={closeMenu}
                animate={mobileCtaScaleControls}
                onTouchStart={handleMobileCtaTouch}
                className="relative overflow-hidden inline-flex items-center justify-center w-full bg-accent text-white text-sm font-medium font-sans rounded-[6px] px-5 py-3.5 hover:bg-primary transition-all duration-200"
              >
                <motion.span
                  animate={mobileCtaFlashControls}
                  initial={{ opacity: 0 }}
                  className="absolute inset-0 rounded-[6px] pointer-events-none"
                  style={{ backgroundColor: 'rgba(26,138,90,0.3)' }}
                />
                Start a project
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
