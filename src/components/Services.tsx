'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Currency hook ─────────────────────────────────────────────────────────────

type Currency = 'COP' | 'USD';

type ExchangeRateResponse = {
  result: string;
  rates: { USD: number };
};

function useCurrencyRate() {
  const [currency, setCurrency] = useState<Currency>('COP');
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const fetchedRef = useRef(false);

  const fetchRate = useCallback(async () => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    setLoading(true);
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/COP');
      if (!res.ok) throw new Error('API error');
      const data = (await res.json()) as ExchangeRateResponse;
      if (data.result !== 'success') throw new Error('API result error');
      setRate(data.rates.USD);
    } catch {
      setError(true);
      setCurrency('COP');
      fetchedRef.current = false;
    } finally {
      setLoading(false);
    }
  }, []);

  const selectCurrency = useCallback(
    (next: Currency) => {
      setCurrency(next);
      if (next === 'USD') fetchRate();
    },
    [fetchRate],
  );

  return { currency, rate, loading, error, selectCurrency };
}

// ── Price formatting ──────────────────────────────────────────────────────────

function formatCOPNumber(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function formatPrice(
  copBase: number,
  currency: Currency,
  rate: number | null,
  loading: boolean,
): string {
  if (currency === 'COP') return `From $${formatCOPNumber(copBase)} COP`;
  if (loading || rate === null) return '···';
  return `From $${Math.round(copBase * rate)} USD`;
}

// ── Icons — stroke-only SVG, 24×24 viewBox, hand-drawn style ────────────────

function IconBrowser() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <path d="M2 8h20" />
      <circle cx="5.5" cy="5.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="5.5" r="0.6" fill="currentColor" stroke="none" />
      <path d="M6 12h12M6 15.5h7" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M3 9h18M8 2v4M16 2v4" />
      <path d="M8.5 14.5l2 2 4.5-4.5" />
    </svg>
  );
}

function IconCode() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
      <path d="M12 4l-1 16" strokeWidth="1.2" />
    </svg>
  );
}

function IconBag() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M5 17h14" />
      <circle cx="12" cy="19.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconGear() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────

type ServiceDef = {
  id: string;
  icon: React.ReactNode;
  name: string;
  copPrice: number;
  description: string;
};

const SERVICES: ServiceDef[] = [
  {
    id: 'landing',
    icon: <IconBrowser />,
    name: 'Professional Landing Page',
    copPrice: 600000,
    description: 'Professional web presence that converts visitors into clients.',
  },
  {
    id: 'booking',
    icon: <IconCalendar />,
    name: 'Booking System',
    copPrice: 1800000,
    description: 'Online booking system for clinics, salons and service businesses.',
  },
  {
    id: 'webapp',
    icon: <IconCode />,
    name: 'Custom Web App',
    copPrice: 2500000,
    description: 'Custom web application built around your business logic.',
  },
  {
    id: 'ecommerce',
    icon: <IconBag />,
    name: 'E-commerce Store',
    copPrice: 3500000,
    description: 'Full ecommerce store with payments, inventory and order management.',
  },
  {
    id: 'mobile',
    icon: <IconPhone />,
    name: 'Mobile App',
    copPrice: 4000000,
    description: 'Native-quality mobile app for Android and iOS.',
  },
  {
    id: 'maintenance',
    icon: <IconGear />,
    name: 'Monthly Maintenance',
    copPrice: 200000,
    description: 'Monthly support, updates and monitoring for your software.',
  },
];

// ── Variants ─────────────────────────────────────────────────────────────────

const HEADER_VARIANT = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const GRID_CONTAINER = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const CARD_ITEM = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

// ── Currency toggle ───────────────────────────────────────────────────────────

function CurrencyToggle({
  currency,
  loading,
  selectCurrency,
}: {
  currency: Currency;
  loading: boolean;
  selectCurrency: (c: Currency) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Select currency"
      className="flex items-center gap-0.5 rounded-full p-0.5 border border-[rgba(26,138,90,0.25)] shrink-0 self-start sm:self-auto"
    >
      {(['COP', 'USD'] as const).map((c) => {
        const isActive = currency === c;
        const isDisabled = loading && c === 'USD';
        return (
          <button
            key={c}
            onClick={() => selectCurrency(c)}
            disabled={isDisabled}
            aria-pressed={isActive}
            className={[
              'px-3 py-1.5 rounded-full text-xs font-medium font-sans transition-all duration-200 select-none',
              isActive
                ? 'bg-accent text-white'
                : 'text-text-secondary hover:text-white',
              isDisabled ? 'opacity-40 cursor-wait' : 'cursor-pointer',
            ].join(' ')}
          >
            {c === 'USD' && loading ? '···' : c}
          </button>
        );
      })}
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────

function ServiceCard({
  icon,
  name,
  copPrice,
  description,
  currency,
  rate,
  loading,
}: Omit<ServiceDef, 'id'> & {
  currency: Currency;
  rate: number | null;
  loading: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      variants={CARD_ITEM}
      whileHover={{
        scale: 1.02,
        transition: { type: 'spring', stiffness: 300, damping: 25 },
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative overflow-hidden rounded-[8px] p-5 md:p-7 cursor-default flex flex-col"
      style={{
        background: '#1A2820',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: hovered
          ? 'rgba(26, 138, 90, 0.45)'
          : 'rgba(26, 138, 90, 0.12)',
        transition: 'border-color 300ms',
      }}
    >
      {/* Top accent line — scales in from left on hover */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="absolute top-0 left-0 right-0 h-[2px] bg-accent rounded-t-[8px]"
        style={{ originX: 0 }}
        aria-hidden="true"
      />

      {/* Icon */}
      <div className="text-accent mb-5">{icon}</div>

      {/* Name */}
      <h3 className="font-display font-medium text-white text-[17px] leading-snug mb-1.5">
        {name}
      </h3>

      {/* Price — animated on currency switch */}
      <div className="mb-3 h-4 flex items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currency}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="font-sans text-accent text-xs font-medium tracking-wide"
          >
            {formatPrice(copPrice, currency, rate, loading)}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Description */}
      <p className="font-sans text-text-secondary text-sm leading-relaxed mt-auto">
        {description}
      </p>
    </motion.article>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function Services() {
  const { currency, rate, loading, error, selectCurrency } = useCurrencyRate();

  return (
    <section
      id="services"
      className="relative py-24 md:py-32"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(26, 138, 90, 0.25) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Ambient glow — top-right */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 600px 500px at 100% 0%, rgba(13, 92, 58, 0.08), transparent)',
          zIndex: 0,
        }}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16">

        {/* Header row: left text + right toggle */}
        <motion.div
          variants={HEADER_VARIANT}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14 md:mb-16"
        >
          <div>
            <p className="font-sans text-xs tracking-widest uppercase text-accent mb-3">
              What we build
            </p>
            <h2 className="font-display font-semibold text-white text-4xl md:text-5xl mb-4">
              Services
            </h2>
            <p className="font-sans text-text-secondary text-base leading-relaxed max-w-lg">
              From landing pages to full SaaS platforms — we build what your business needs.
            </p>
          </div>

          {!error && (
            <CurrencyToggle
              currency={currency}
              loading={loading}
              selectCurrency={selectCurrency}
            />
          )}
        </motion.div>

        {/* Services grid */}
        <motion.div
          variants={GRID_CONTAINER}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
        >
          {SERVICES.map(({ id, icon, name, copPrice, description }) => (
            <ServiceCard
              key={id}
              icon={icon}
              name={name}
              copPrice={copPrice}
              description={description}
              currency={currency}
              rate={rate}
              loading={loading}
            />
          ))}
        </motion.div>

      </div>  {/* end relative z-10 */}
    </section>
  );
}
