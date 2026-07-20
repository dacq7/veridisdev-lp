'use client';

import { useEffect, useState } from 'react';

/**
 * Detects whether the current device is touch-primary.
 *
 * Triple-condition check:
 * - 'ontouchstart' in window        — basic touch capability
 * - navigator.maxTouchPoints > 0   — modern touch detection
 * - !matchMedia('pointer: fine')   — primary pointer is NOT a fine-pointer (mouse)
 *
 * Subscribes to pointer media query changes so hybrid devices (tablet + mouse)
 * update correctly when the user connects or disconnects a pointing device.
 *
 * SSR-safe: initializes to false, hydrates on client via useEffect.
 */
export function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(pointer: fine)');

    function detect() {
      setIsTouch(
        'ontouchstart' in window &&
        navigator.maxTouchPoints > 0 &&
        !mql.matches
      );
    }

    detect();
    mql.addEventListener('change', detect);
    return () => mql.removeEventListener('change', detect);
  }, []);

  return isTouch;
}
