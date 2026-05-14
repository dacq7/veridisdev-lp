export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://veridisdev.com';
export const SITE_NAME = 'Veridis Dev';

export const SUPPORTED_LOCALES = ['es', 'en'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: SupportedLocale = 'es';
