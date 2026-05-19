/**
 * SINGLE SOURCE OF TRUTH for all service pricing.
 *
 * Consumed by:
 * - Services.tsx  (landing service cards)
 * - QuoteCalculator.tsx  (interactive estimator)
 *
 * COP values in millions (2.8 = $2,800,000 COP)
 * USD values in thousands (0.8 = $800 USD)
 * Maintenance values are per month.
 * USD prices are NOT literal conversions — localized to market floor.
 * TRM reference: $3,793.64 COP/USD
 *
 * To update prices: edit values here, run npm run build, deploy.
 * Never hardcode prices in component files or translation messages.
 */

export type Currency = 'COP' | 'USD';
export type Tier = 1 | 2 | 3;
export type ServiceId =
  | 'landing'
  | 'reservation'
  | 'webapp'
  | 'ecommerce'
  | 'mobile'
  | 'maintenance';

export interface ServiceTierPricing {
  COP: number; // in millions
  USD: number; // in thousands
}

export const PRICING: Record<ServiceId, Record<Tier, ServiceTierPricing>> = {
  landing: {
    1: { COP: 2.8,  USD: 0.8  },
    2: { COP: 5.2,  USD: 1.5  },
    3: { COP: 12.0, USD: 3.5  },
  },
  reservation: {
    1: { COP: 4.2,  USD: 1.2  },
    2: { COP: 8.8,  USD: 2.5  },
    3: { COP: 16.0, USD: 4.5  },
  },
  webapp: {
    1: { COP: 6.2,  USD: 1.8  },
    2: { COP: 13.2, USD: 3.8  },
    3: { COP: 28.0, USD: 8.0  },
  },
  ecommerce: {
    1: { COP: 7.0,  USD: 2.0  },
    2: { COP: 14.8, USD: 4.2  },
    3: { COP: 35.0, USD: 10.0 },
  },
  mobile: {
    1: { COP: 9.8,  USD: 2.8  },
    2: { COP: 19.2, USD: 5.5  },
    3: { COP: 33.0, USD: 9.5  },
  },
  maintenance: {
    1: { COP: 0.28, USD: 0.08 },
    2: { COP: 0.70, USD: 0.20 },
    3: { COP: 1.70, USD: 0.50 },
  },
};

export const SERVICE_IDS: ServiceId[] = [
  'landing',
  'reservation',
  'webapp',
  'ecommerce',
  'mobile',
  'maintenance',
];

export const TIER_IDS: Tier[] = [1, 2, 3];

export const TIER_LABEL_KEYS: Record<Tier, string> = {
  1: 'pricing.tiers.essential',
  2: 'pricing.tiers.professional',
  3: 'pricing.tiers.premium',
};

export function formatPrice(
  amount: number,
  currency: 'COP' | 'USD',
  isMonthly: boolean = false
): string {
  if (currency === 'COP') {
    const cop = amount * 1_000_000;
    const formatter = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    });
    return formatter.format(cop) + (isMonthly ? '/mes' : '');
  }
  const usd = amount * 1_000;
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
  return formatter.format(usd) + (isMonthly ? '/mo' : '');
}

export function isMonthlyService(service: ServiceId): boolean {
  return service === 'maintenance';
}
