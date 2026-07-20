// PROVISIONING: Sentry required for capture; falls back to console without DSN.
// Safe to import anywhere — checks DSN at call time, never throws.

import * as Sentry from '@sentry/nextjs';

type SeverityLevel = 'fatal' | 'error' | 'warning' | 'info' | 'debug';

const isSentryEnabled = (): boolean => Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN);

export function captureError(error: unknown, context?: Record<string, unknown>): void {
  if (isSentryEnabled()) {
    Sentry.captureException(error, context ? { extra: context } : undefined);
  } else {
    console.error('[captureError]', error, context ?? '');
  }
}

export function captureMessage(
  message: string,
  level: SeverityLevel = 'info',
): void {
  if (isSentryEnabled()) {
    Sentry.captureMessage(message, level);
  } else {
    console.log(`[captureMessage:${level}]`, message);
  }
}
