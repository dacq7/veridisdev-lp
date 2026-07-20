// Next.js instrumentation hook — loads Sentry configs per runtime.
// Safe to import without Sentry env vars; each config file has its own guard.

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}
