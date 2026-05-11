/**
 * SINGLE SOURCE OF TRUTH for all service pricing.
 *
 * Consumed by:
 * - Services.tsx  (landing service cards — Sprint 3 Block 2)
 * - QuoteCalculator.tsx  (interactive estimator — Sprint 3 Block 3)
 *
 * DRAFT pricing v1 — values pending final review before v2 launch.
 * To update prices: edit values here, run npm run build, deploy.
 * Never hardcode prices in component files or translation messages.
 */

export type Currency = 'COP' | 'USD';
export type ServiceTier = 'tier1' | 'tier2' | 'tier3';
export type ServiceId =
  | 'landing'
  | 'reservations'
  | 'webapp'
  | 'ecommerce'
  | 'mobile'
  | 'maintenance';

export interface PriceRange {
  min: number;
  max: number;
}

export interface TierPricing {
  COP: PriceRange;
  USD: PriceRange;
}

export interface ServicePricing {
  id: ServiceId;
  /** i18n key for the service name — actual label lives in messages/[locale].json */
  nameKey: string;
  /** true = monthly recurring; false = one-time project fee */
  recurring: boolean;
  tiers: Record<ServiceTier, TierPricing>;
}

export const PRICING: Record<ServiceId, ServicePricing> = {
  landing: {
    id: 'landing',
    nameKey: 'pricing.services.landing',
    recurring: false,
    tiers: {
      tier1: { COP: { min: 2_500_000, max: 4_000_000 }, USD: { min: 1200, max: 1800 } }, // DRAFT v1 — pending Diego review
      tier2: { COP: { min: 4_000_000, max: 7_000_000 }, USD: { min: 1800, max: 3500 } }, // DRAFT v1 — pending Diego review
      tier3: { COP: { min: 7_000_000, max: 12_000_000 }, USD: { min: 3500, max: 6000 } }, // DRAFT v1 — pending Diego review
    },
  },
  reservations: {
    id: 'reservations',
    nameKey: 'pricing.services.reservations',
    recurring: false,
    tiers: {
      tier1: { COP: { min: 5_000_000, max: 8_000_000 }, USD: { min: 2500, max: 4000 } }, // DRAFT v1 — pending Diego review
      tier2: { COP: { min: 8_000_000, max: 14_000_000 }, USD: { min: 4000, max: 7000 } }, // DRAFT v1 — pending Diego review
      tier3: { COP: { min: 14_000_000, max: 25_000_000 }, USD: { min: 7000, max: 13000 } }, // DRAFT v1 — pending Diego review
    },
  },
  webapp: {
    id: 'webapp',
    nameKey: 'pricing.services.webapp',
    recurring: false,
    tiers: {
      tier1: { COP: { min: 7_000_000, max: 12_000_000 }, USD: { min: 3500, max: 6000 } }, // DRAFT v1 — pending Diego review
      tier2: { COP: { min: 12_000_000, max: 22_000_000 }, USD: { min: 6000, max: 11000 } }, // DRAFT v1 — pending Diego review
      tier3: { COP: { min: 22_000_000, max: 45_000_000 }, USD: { min: 11000, max: 25000 } }, // DRAFT v1 — pending Diego review
    },
  },
  ecommerce: {
    id: 'ecommerce',
    nameKey: 'pricing.services.ecommerce',
    recurring: false,
    tiers: {
      tier1: { COP: { min: 8_000_000, max: 13_000_000 }, USD: { min: 4000, max: 6500 } }, // DRAFT v1 — pending Diego review
      tier2: { COP: { min: 13_000_000, max: 22_000_000 }, USD: { min: 6500, max: 11000 } }, // DRAFT v1 — pending Diego review
      tier3: { COP: { min: 22_000_000, max: 40_000_000 }, USD: { min: 11000, max: 22000 } }, // DRAFT v1 — pending Diego review
    },
  },
  mobile: {
    id: 'mobile',
    nameKey: 'pricing.services.mobile',
    recurring: false,
    tiers: {
      tier1: { COP: { min: 12_000_000, max: 20_000_000 }, USD: { min: 6000, max: 10000 } }, // DRAFT v1 — pending Diego review
      tier2: { COP: { min: 20_000_000, max: 35_000_000 }, USD: { min: 10000, max: 18000 } }, // DRAFT v1 — pending Diego review
      tier3: { COP: { min: 35_000_000, max: 70_000_000 }, USD: { min: 18000, max: 40000 } }, // DRAFT v1 — pending Diego review
    },
  },
  maintenance: {
    id: 'maintenance',
    nameKey: 'pricing.services.maintenance',
    recurring: true,
    tiers: {
      tier1: { COP: { min: 800_000, max: 1_500_000 }, USD: { min: 400, max: 750 } }, // DRAFT v1 — pending Diego review
      tier2: { COP: { min: 1_500_000, max: 3_000_000 }, USD: { min: 750, max: 1500 } }, // DRAFT v1 — pending Diego review
      tier3: { COP: { min: 3_000_000, max: 7_000_000 }, USD: { min: 1500, max: 3500 } }, // DRAFT v1 — pending Diego review
    },
  },
};

export const SERVICE_IDS: ServiceId[] = [
  'landing',
  'reservations',
  'webapp',
  'ecommerce',
  'mobile',
  'maintenance',
];

export const TIER_IDS: ServiceTier[] = ['tier1', 'tier2', 'tier3'];

export const TIER_LABEL_KEYS: Record<ServiceTier, string> = {
  tier1: 'pricing.tiers.essential',
  tier2: 'pricing.tiers.professional',
  tier3: 'pricing.tiers.premium',
};
