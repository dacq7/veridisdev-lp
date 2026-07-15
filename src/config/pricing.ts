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
 * TRM reference: Ajustado según estrategia comercial de posicionamiento
 * competitivo — no conversión literal.
 *
 * To update prices: edit values here, run npm run build, deploy.
 * Never hardcode prices in component files or translation messages.
 */

export type Currency = 'COP' | 'USD';
export type Tier = 0 | 1 | 2 | 3;
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

export const PRICING: Record<ServiceId, Partial<Record<Tier, ServiceTierPricing>>> = {
  landing: {
    0: { COP: 1.05, USD: 0.3  },  // Express
    1: { COP: 2.8,  USD: 0.8  },  // Essential
    2: { COP: 5.2,  USD: 1.5  },  // Professional
    3: { COP: 12.0, USD: 3.5  },  // Premium
  },
  reservation: {
    1: { COP: 3.5, USD: 1.0 },
    2: { COP: 7.7, USD: 2.2 },
    3: { COP: 14.0, USD: 4.0 },
  },
  webapp: {
    1: { COP: 5.2,  USD: 1.5 },
    2: { COP: 11.5, USD: 3.3 },
    3: { COP: 24.5, USD: 7.0 },
  },
  ecommerce: {
    1: { COP: 6.3, USD: 1.8 },
    2: { COP: 13.3, USD: 3.8 },
    3: { COP: 31.5, USD: 9.0 },
  },
  mobile: {
    1: { COP: 8.75, USD: 2.5 },
    2: { COP: 16.8, USD: 4.8 },
    3: { COP: 29.75, USD: 8.5 },
  },
  maintenance: {
    1: { COP: 0.175, USD: 0.05 },
    2: { COP: 0.525, USD: 0.15 },
    3: { COP: 1.4,   USD: 0.4  },
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

export const TIER_IDS: Tier[] = [0, 1, 2, 3];

export const TIER_LABEL_KEYS: Record<Tier, string> = {
  0: 'pricing.tiers.express',
  1: 'pricing.tiers.essential',
  2: 'pricing.tiers.professional',
  3: 'pricing.tiers.premium',
};

/**
 * Tiers available per service. Landing offers an entry-level Express tier (0);
 * all other services start at Essential (1).
 */
export function getAvailableTiers(service: ServiceId): Tier[] {
  return service === 'landing' ? [0, 1, 2, 3] : [1, 2, 3];
}

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
