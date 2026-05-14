'use client';

// PROVISIONING: requires NEXT_PUBLIC_PLAUSIBLE_DOMAIN to activate.
// Without it, all calls are silent no-ops. Never throws.

declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, string | number | boolean> }
    ) => void;
  }
}

export function isPlausibleEnabled(): boolean {
  return typeof window !== 'undefined' && typeof window.plausible === 'function';
}

export function trackEvent(
  eventName: string,
  props?: Record<string, string | number | boolean>
): void {
  if (!isPlausibleEnabled()) return;
  window.plausible!(eventName, props ? { props } : undefined);
}
