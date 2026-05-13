// PROVISIONING: requires NEXT_PUBLIC_SENTRY_DSN to activate.
// Without it, this file is a no-op. Add the DSN to env vars to enable Sentry.

import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.0,
    replaysOnErrorSampleRate: 0.1,
    debug: false,
  });
}
