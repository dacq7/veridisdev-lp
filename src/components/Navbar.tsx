'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

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

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const;


function NavLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="text-[#4A6B58] hover:text-white transition-colors duration-300 text-xs font-medium tracking-widest uppercase font-sans"
    >
      {label}
    </a>
  );
}

export default function Navbar() {
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

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
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      >
        <nav
          role="navigation"
          aria-label="Main navigation"
          className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between"
        >
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Veridis Dev — home">
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
          </a>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-8" role="list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <NavLink href={href} label={label} />
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <a
              href="#contact"
              className="inline-flex items-center bg-accent text-white text-xs font-medium font-sans rounded-[6px] px-5 py-2.5 hover:bg-primary transition-all duration-200 hover:scale-[1.02]"
            >
              Start a project
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] shrink-0"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              className="block w-5 h-[1.5px] bg-white origin-center"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.15 }}
              className="block w-5 h-[1.5px] bg-white"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              className="block w-5 h-[1.5px] bg-white origin-center"
            />
          </button>
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
                  transition={{ delay: i * 0.07, duration: 0.25, ease: 'easeOut' }}
                >
                  <a
                    href={href}
                    onClick={closeMenu}
                    className="block text-3xl font-display font-semibold text-[#4A6B58] hover:text-white transition-colors duration-300 py-3 border-b border-surface"
                  >
                    {label}
                  </a>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.25 }}
              className="mt-10"
            >
              <a
                href="#contact"
                onClick={closeMenu}
                className="inline-flex items-center justify-center w-full bg-accent text-white text-sm font-medium font-sans rounded-[6px] px-5 py-3.5 hover:bg-primary transition-all duration-200"
              >
                Start a project
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
