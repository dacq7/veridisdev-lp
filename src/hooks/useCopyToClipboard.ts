'use client';

import { useCallback, useState, useRef } from 'react';

interface UseCopyToClipboardOptions {
  /** Milliseconds before `copied` resets to false. Default: 2000 */
  resetAfter?: number;
}

interface UseCopyToClipboardResult {
  copied: boolean;
  copy: (text: string) => Promise<boolean>;
}

/**
 * Returns a stateful copy() function and a `copied` flag that auto-resets.
 *
 * - Uses navigator.clipboard.writeText (browser API — SSR returns false safely).
 * - If copy() is called while a previous reset timer is pending, cancels
 *   the old timer and starts a new one (prevents stale resets on rapid clicks).
 * - Returns false and leaves `copied: false` if clipboard write fails.
 */
export function useCopyToClipboard(
  options: UseCopyToClipboardOptions = {}
): UseCopyToClipboardResult {
  const { resetAfter = 2000 } = options;
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (typeof navigator === 'undefined' || !navigator.clipboard) {
        return false;
      }
      try {
        await navigator.clipboard.writeText(text);
        if (timerRef.current !== null) {
          clearTimeout(timerRef.current);
        }
        setCopied(true);
        timerRef.current = setTimeout(() => {
          setCopied(false);
          timerRef.current = null;
        }, resetAfter);
        return true;
      } catch {
        return false;
      }
    },
    [resetAfter]
  );

  return { copied, copy };
}
