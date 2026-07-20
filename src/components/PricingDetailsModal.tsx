'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  PRICING, TIER_LABEL_KEYS, getAvailableTiers,
  formatPrice, isMonthlyService,
  type ServiceId, type Tier, type Currency,
} from '@/config/pricing';

// ── Constants ────────────────────────────────────────────────────────────────

const RECOMMENDED_TIER: Tier = 2;

const CHECK_COLOR = '#1A8A5A';
const DASH_COLOR = '#3D4A44';
const MUTED = '#6B7280';

// ── Animation variants (module-level — PLAN-MAESTRO rule) ─────────────────────

const BACKDROP_VARIANT = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const MODAL_VARIANT = {
  hidden: { opacity: 0, scale: 0.95, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 8,
    transition: { duration: 0.15, ease: 'easeIn' as const },
  },
};

const ACCORDION_VARIANT = {
  collapsed: { height: 0, opacity: 0 },
  open: { height: 'auto' as const, opacity: 1 },
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface TierDetail {
  targetClient: string;
  timeline: string;
  support: string;
  included: string[];
  notIncluded: string[];
}

interface FaqItem {
  q: string;
  a: string;
}

interface PricingDetailsModalProps {
  service: ServiceId;
  isOpen: boolean;
  onClose: () => void;
  currency?: Currency;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Items ending in ":" (e.g. "Todo lo de Essential, más:") act as section
// headers inside the "included" list rather than checkmark features.
function isGroupHeader(item: string): boolean {
  return item.trim().endsWith(':');
}

// ── Shared tier body (client / timeline / support / included / notIncluded) ────

function TierBody({ detail }: { detail: TierDetail }) {
  const t = useTranslations('pricingDetails.modal');

  return (
    <div className="flex flex-col gap-4">
      {/* Target client */}
      <div>
        <p className="font-sans text-[11px] uppercase tracking-widest mb-1" style={{ color: MUTED }}>
          {t('targetClient')}
        </p>
        <p className="font-sans text-sm leading-relaxed text-white/80">{detail.targetClient}</p>
      </div>

      {/* Timeline + support */}
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <div>
          <p className="font-sans text-[11px] uppercase tracking-widest mb-0.5" style={{ color: MUTED }}>
            {t('timeline')}
          </p>
          <p className="font-sans text-sm font-medium text-white">{detail.timeline}</p>
        </div>
        <div>
          <p className="font-sans text-[11px] uppercase tracking-widest mb-0.5" style={{ color: MUTED }}>
            {t('support')}
          </p>
          <p className="font-sans text-sm font-medium text-white">{detail.support}</p>
        </div>
      </div>

      {/* Included */}
      <div>
        <p className="font-sans text-[11px] uppercase tracking-widest mb-2" style={{ color: MUTED }}>
          {t('included')}
        </p>
        <ul className="flex flex-col gap-1.5">
          {detail.included.map((item, i) =>
            isGroupHeader(item) ? (
              <li
                key={i}
                className="font-sans text-xs font-semibold text-white/90 pt-2 first:pt-0"
              >
                {item}
              </li>
            ) : (
              <li key={i} className="flex gap-2 items-start font-sans text-sm text-white/80">
                <span aria-hidden="true" className="mt-0.5 shrink-0" style={{ color: CHECK_COLOR }}>
                  ✓
                </span>
                <span>{item}</span>
              </li>
            )
          )}
        </ul>
      </div>

      {/* Not included */}
      {detail.notIncluded.length > 0 && (
        <div>
          <p className="font-sans text-[11px] uppercase tracking-widest mb-2" style={{ color: MUTED }}>
            {t('notIncluded')}
          </p>
          <ul className="flex flex-col gap-1.5">
            {detail.notIncluded.map((item, i) => (
              <li key={i} className="flex gap-2 items-start font-sans text-sm" style={{ color: MUTED }}>
                <span aria-hidden="true" className="mt-0.5 shrink-0" style={{ color: DASH_COLOR }}>
                  —
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Tier header (label + price + recommended badge) ───────────────────────────

function TierHeader({
  tierLabel,
  price,
  recommended,
  recommendedLabel,
}: {
  tierLabel: string;
  price: string;
  recommended: boolean;
  recommendedLabel: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
        <h4 className="font-display font-bold text-white text-lg">{tierLabel}</h4>
        {recommended && (
          <span
            className="font-sans text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(26, 138, 90, 0.18)', color: CHECK_COLOR }}
          >
            {recommendedLabel}
          </span>
        )}
      </div>
      <p className="font-display font-bold text-white text-xl leading-none">{price}</p>
    </div>
  );
}

// ── FAQ accordion ─────────────────────────────────────────────────────────────

function FaqSection() {
  const t = useTranslations('pricingDetails.faq');
  const items = t.raw('items') as FaqItem[];
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="mt-10 pt-8" style={{ borderTop: '1px solid rgba(26, 138, 90, 0.15)' }}>
      <h3 className="font-display font-bold text-white text-xl mb-5">{t('title')}</h3>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className="rounded-lg overflow-hidden"
              style={{ border: '1px solid rgba(26, 138, 90, 0.12)' }}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-4 text-left px-4 py-3.5 cursor-pointer"
              >
                <span className="font-sans text-sm font-medium text-white">{item.q}</span>
                <motion.span
                  aria-hidden="true"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                  style={{ color: CHECK_COLOR }}
                >
                  ▾
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    variants={ACCORDION_VARIANT}
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                    className="overflow-hidden"
                  >
                    <p
                      className="font-sans text-sm leading-relaxed px-4 pb-4"
                      style={{ color: MUTED }}
                    >
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────

export default function PricingDetailsModal({
  service,
  isOpen,
  onClose,
  currency = 'COP',
}: PricingDetailsModalProps) {
  const t = useTranslations('pricingDetails.modal');
  const tRoot = useTranslations();

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const tiers = getAvailableTiers(service);
  const serviceName = tRoot(`pricing.services.${service}`);
  const recommendedIsAvailable = tiers.includes(RECOMMENDED_TIER);

  // Mobile accordion: expand the recommended tier by default (fallback: first).
  const defaultOpen: Tier = recommendedIsAvailable ? RECOMMENDED_TIER : tiers[0];
  // -1 means "all collapsed".
  const [openTier, setOpenTier] = useState<number>(defaultOpen);

  // Reset the mobile accordion when the service changes (adjust-state-in-render
  // pattern — avoids a setState-in-effect cascade).
  const [prevService, setPrevService] = useState<ServiceId>(service);
  if (prevService !== service) {
    setPrevService(service);
    setOpenTier(defaultOpen);
  }

  // Body scroll lock + Escape + focus management.
  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [isOpen, onClose]);

  // Trap Tab focus inside the dialog (ignores hidden/duplicated layout nodes).
  function handleTabTrap(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'Tab') return;
    const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    );
    if (!nodes) return;
    const focusable = Array.from(nodes).filter((n) => n.offsetParent !== null);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function priceFor(tier: Tier): string {
    const p = PRICING[service][tier];
    if (!p) return '';
    return formatPrice(p[currency], currency, isMonthlyService(service));
  }

  function detailFor(tier: Tier): TierDetail {
    return tRoot.raw(`pricingDetails.services.${service}.tiers.${tier}`) as TierDetail;
  }

  // Grid columns scale with tier count (Landing = 4, others = 3).
  const gridColsClass =
    tiers.length >= 4
      ? 'md:grid-cols-2 lg:grid-cols-4'
      : 'md:grid-cols-2 lg:grid-cols-3';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          variants={BACKDROP_VARIANT}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-start md:items-center justify-center p-0 md:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto"
        >
          <motion.div
            key="dialog"
            ref={dialogRef}
            variants={MODAL_VARIANT}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleTabTrap}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pricing-details-title"
            className="relative w-full max-w-[1000px] md:max-h-[90vh] md:my-auto overflow-y-auto rounded-none md:rounded-2xl p-4 sm:p-6 md:p-8"
            style={{ background: '#111111', border: '1px solid rgba(26, 138, 90, 0.2)' }}
          >
            {/* Header */}
            <div
              className="flex items-start justify-between gap-4 pb-5 mb-6"
              style={{ borderBottom: '1px solid rgba(26, 138, 90, 0.15)' }}
            >
              <h2
                id="pricing-details-title"
                className="font-display font-bold text-white text-2xl md:text-3xl"
              >
                {t('title', { service: serviceName })}
              </h2>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label={t('close')}
                className="shrink-0 flex items-center justify-center w-9 h-9 rounded-lg text-white/70 hover:text-white transition-colors cursor-pointer"
                style={{ border: '1px solid rgba(26, 138, 90, 0.2)' }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M12 4L4 12M4 4l8 8"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Desktop / tablet: grid of tier cards */}
            <div className={`hidden md:grid gap-4 ${gridColsClass}`}>
              {tiers.map((tier) => {
                const recommended = tier === RECOMMENDED_TIER;
                return (
                  <div
                    key={tier}
                    className="rounded-xl p-5 flex flex-col"
                    style={{
                      background: recommended ? 'rgba(26, 138, 90, 0.05)' : 'transparent',
                      border: recommended
                        ? '2px solid #1A8A5A'
                        : '1px solid rgba(26, 138, 90, 0.15)',
                    }}
                  >
                    <TierHeader
                      tierLabel={tRoot(TIER_LABEL_KEYS[tier])}
                      price={priceFor(tier)}
                      recommended={recommended}
                      recommendedLabel={t('recommended')}
                    />
                    <TierBody detail={detailFor(tier)} />
                  </div>
                );
              })}
            </div>

            {/* Mobile: accordion of tier panels */}
            <div className="md:hidden flex flex-col gap-2">
              {tiers.map((tier) => {
                const recommended = tier === RECOMMENDED_TIER;
                const expanded = openTier === tier;
                return (
                  <div
                    key={tier}
                    className="rounded-xl overflow-hidden"
                    style={{
                      border: recommended
                        ? '2px solid #1A8A5A'
                        : '1px solid rgba(26, 138, 90, 0.15)',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenTier(expanded ? -1 : tier)}
                      aria-expanded={expanded}
                      className="w-full flex items-center justify-between gap-3 text-left px-4 py-3.5 cursor-pointer"
                    >
                      <span className="flex items-center gap-2 flex-wrap">
                        <span className="font-display font-bold text-white text-base">
                          {tRoot(TIER_LABEL_KEYS[tier])}
                        </span>
                        {recommended && (
                          <span
                            className="font-sans text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(26, 138, 90, 0.18)', color: CHECK_COLOR }}
                          >
                            {t('recommended')}
                          </span>
                        )}
                        <span className="font-display font-bold text-white/90 text-sm">
                          {priceFor(tier)}
                        </span>
                      </span>
                      <motion.span
                        aria-hidden="true"
                        animate={{ rotate: expanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="shrink-0"
                        style={{ color: CHECK_COLOR }}
                      >
                        ▾
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {expanded && (
                        <motion.div
                          variants={ACCORDION_VARIANT}
                          initial="collapsed"
                          animate="open"
                          exit="collapsed"
                          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-1">
                            <TierBody detail={detailFor(tier)} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* FAQ */}
            <FaqSection />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
