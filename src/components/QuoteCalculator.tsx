'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  PRICING, SERVICE_IDS, TIER_LABEL_KEYS, getAvailableTiers,
  formatPrice, isMonthlyService,
  type ServiceId, type Tier, type Currency,
} from '@/config/pricing';
import { trackEvent } from '@/lib/plausible';

// ── Animation variants (outside component — PLAN-MAESTRO rule) ────────────────

const CARD_VARIANT = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const PRICE_TRANSITION = { duration: 0.18, ease: 'easeOut' as const };

// ── Currency toggle ────────────────────────────────────────────────────────────

function CurrencyToggle({
  currency,
  setCurrency,
}: {
  currency: Currency;
  setCurrency: (c: Currency) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Currency"
      className="flex items-center gap-0.5 rounded-full p-0.5 border border-[rgba(26,138,90,0.25)] self-start"
    >
      {(['COP', 'USD'] as const).map((c) => {
        const isActive = currency === c;
        return (
          <button
            key={c}
            onClick={() => setCurrency(c)}
            aria-pressed={isActive}
            className={[
              'px-3 py-1.5 rounded-full text-xs font-medium font-sans transition-all duration-200 select-none cursor-pointer',
              isActive
                ? 'bg-accent text-white'
                : 'text-[#6B7280] hover:text-white',
            ].join(' ')}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}

// ── Section label ──────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-sans text-xs uppercase tracking-widest mb-2"
      style={{ color: '#6B7280' }}
    >
      {children}
    </p>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function QuoteCalculator() {
  const t = useTranslations('calculator');
  const tPricing = useTranslations();

  const [service, setService] = useState<ServiceId>('landing');
  const [tier, setTier] = useState<Tier>(1);
  const [currency, setCurrency] = useState<Currency>('COP');

  // Tiers available for the current service (Landing adds an Express tier 0).
  const availableTiers = getAvailableTiers(service);
  // Guard against a stale tier that isn't valid for the selected service.
  const activeTier: Tier = availableTiers.includes(tier) ? tier : 1;

  // Derived price
  const selected = PRICING[service][activeTier] ?? PRICING[service][1]!;
  const formattedPrice = formatPrice(selected[currency], currency, isMonthlyService(service));

  // Express descriptor — only for Landing + Express (tier 0).
  const showExpressDescriptor = service === 'landing' && activeTier === 0;

  const priceKey = `${service}-${activeTier}-${currency}`;

  // Switching service must not leave an Express-only tier selected.
  function handleSelectService(id: ServiceId) {
    setService(id);
    if (!getAvailableTiers(id).includes(tier)) {
      setTier(1);
    }
  }

  function handleContinueQuote() {
    const tierLabel = tPricing(TIER_LABEL_KEYS[activeTier]);
    const serviceName = tPricing(`pricing.services.${service}`);

    const message = t('prefilledMessage', {
      service: serviceName,
      tier: tierLabel,
      price: formattedPrice,
    });

    trackEvent('Quote Calculator CTA', { service, tier: activeTier, currency });

    window.dispatchEvent(
      new CustomEvent('veridis:prefill-contact', { detail: { message, service } })
    );

    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section id="calculator" className="relative py-24 md:py-32">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 700px 500px at 50% 100%, rgba(13, 92, 58, 0.07), transparent)',
          zIndex: 0,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-12 md:mb-16"
        >
          <p className="font-sans text-xs tracking-widest uppercase mb-3" style={{ color: '#1A8A5A' }}>
            {t('labels.estimatedRange')}
          </p>
          <h2 className="font-display font-bold text-white text-4xl md:text-5xl mb-4">
            {t('title')}
          </h2>
          <p className="font-sans text-base leading-relaxed max-w-lg" style={{ color: '#6B7280' }}>
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Calculator card */}
        <motion.div
          variants={CARD_VARIANT}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="rounded-[12px] p-6 md:p-10"
          style={{
            background: '#111111',
            border: '1px solid rgba(26, 138, 90, 0.2)',
          }}
        >
          <div className="flex flex-col gap-8 md:gap-10">

            {/* Row 1: Service selector + Currency toggle */}
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              {/* Service pills */}
              <div className="flex-1">
                <SectionLabel>{t('labels.service')}</SectionLabel>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {SERVICE_IDS.map((id) => {
                    const isActive = service === id;
                    return (
                      <button
                        key={id}
                        onClick={() => handleSelectService(id)}
                        aria-pressed={isActive}
                        className="px-3 py-2.5 rounded-[6px] text-sm font-sans font-medium transition-all duration-200 text-left cursor-pointer"
                        style={{
                          background: isActive ? '#0D5C3A' : 'transparent',
                          color: isActive ? '#fff' : '#6B7280',
                          border: `1px solid ${
                            isActive
                              ? 'rgba(26, 138, 90, 0.5)'
                              : 'rgba(26, 138, 90, 0.15)'
                          }`,
                        }}
                      >
                        {tPricing(`pricing.services.${id}`)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Currency toggle — right-aligned on md+ */}
              <div className="md:pt-5">
                <CurrencyToggle currency={currency} setCurrency={setCurrency} />
              </div>
            </div>

            {/* Row 2: Tier segmented control */}
            <div>
              <SectionLabel>{t('labels.tier')}</SectionLabel>
              <div
                className="flex gap-2"
                role="group"
                aria-label={t('labels.tier')}
              >
                {availableTiers.map((id: Tier) => {
                  const isActive = activeTier === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setTier(id)}
                      aria-pressed={isActive}
                      className="flex-1 py-2.5 px-3 rounded-[6px] text-sm font-sans font-medium transition-all duration-200 cursor-pointer"
                      style={{
                        background: isActive ? '#0D5C3A' : 'transparent',
                        color: isActive ? '#fff' : '#6B7280',
                        border: `1px solid ${
                          isActive
                            ? 'rgba(26, 138, 90, 0.5)'
                            : 'rgba(26, 138, 90, 0.15)'
                        }`,
                      }}
                    >
                      {tPricing(TIER_LABEL_KEYS[id])}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 3: Price display + CTA */}
            <div
              className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pt-4"
              style={{ borderTop: '1px solid rgba(26, 138, 90, 0.1)' }}
            >
              {/* Price */}
              <div className="max-w-md">
                <SectionLabel>{t('labels.estimatedRange')}</SectionLabel>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={priceKey}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={PRICE_TRANSITION}
                    className="font-display font-bold text-white text-3xl md:text-4xl leading-none"
                  >
                    {formattedPrice}
                  </motion.p>
                </AnimatePresence>

                {/* Express descriptor — only for Landing + Express tier */}
                <AnimatePresence mode="wait">
                  {showExpressDescriptor && (
                    <motion.p
                      key="express-descriptor"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={PRICE_TRANSITION}
                      className="font-sans text-sm leading-relaxed mt-3"
                      style={{ color: '#6B7280' }}
                    >
                      {tPricing('pricing.descriptors.landing.express')}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* CTA button */}
              <motion.button
                onClick={handleContinueQuote}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="font-sans font-medium text-white rounded-[6px] px-6 py-3.5 text-sm cursor-pointer shrink-0"
                style={{
                  background: '#0D5C3A',
                  border: '1px solid rgba(26, 138, 90, 0.4)',
                  letterSpacing: '0.01em',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#10713F';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#0D5C3A';
                }}
              >
                {t('labels.continueQuote')}
              </motion.button>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
