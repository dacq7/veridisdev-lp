'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// ── Types ─────────────────────────────────────────────────────────────────────

type CursorState = 'default' | 'interactive' | 'text';

// ── State config ──────────────────────────────────────────────────────────────

const CONFIG: Record<CursorState, {
  dot: [number, number];
  ring: [number, number];
  borderRadius: number;
  ringOpacity: number;
}> = {
  default:     { dot: [8,  8],  ring: [36, 36], borderRadius: 18, ringOpacity: 0.6 },
  interactive: { dot: [4,  4],  ring: [52, 52], borderRadius: 26, ringOpacity: 1   },
  text:        { dot: [8,  8],  ring: [2,  20], borderRadius: 2,  ringOpacity: 0.8 },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function detectState(target: Element | null): CursorState {
  if (!target) return 'default';
  if (target.closest('a, button, [role="button"]')) return 'interactive';
  if (target.closest('p, h1, h2, h3, h4, h5, h6, span, li, label')) return 'text';
  return 'default';
}

// ── Constants ─────────────────────────────────────────────────────────────────

const SPRING_CFG = { stiffness: 400, damping: 28 };
const DOT_T      = { duration: 0.15 };
const RING_T     = { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const };

// Inner element is centered on the wrapper's origin via translate(-50%, -50%).
// The outer wrapper sits at (0,0) fixed and moves via Framer Motion x/y MotionValues,
// so the inner centering is not affected by Framer Motion's transform system.
const INNER_CENTER: React.CSSProperties = {
  position: 'relative',
  transform: 'translate(-50%, -50%)',
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function CustomCursor() {
  const [active, setActive]   = useState(false);
  const [state, setState]     = useState<CursorState>('default');

  const mouseX  = useMotionValue(-100);
  const mouseY  = useMotionValue(-100);
  const springX = useSpring(mouseX, SPRING_CFG);
  const springY = useSpring(mouseY, SPRING_CFG);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isPointerFine = window.matchMedia('(pointer: fine)').matches;
    const isNarrow = window.innerWidth < 768;

    if (isTouch || !isPointerFine || isNarrow) {
      document.body.classList.remove('custom-cursor-active');
      return;
    }

    setActive(true);
    document.body.style.cursor = 'none';
    document.body.classList.add('custom-cursor-active');

    const mq = window.matchMedia('(pointer: fine)');
    const handler = (e: MediaQueryListEvent) => { if (!e.matches) setActive(false); };
    mq.addEventListener('change', handler);

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      setState(detectState(e.target as Element | null));
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });

    return () => {
      document.body.style.cursor = '';
      document.body.classList.remove('custom-cursor-active');
      mq.removeEventListener('change', handler);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
    };
  }, [mouseX, mouseY]);

  if (!active) return null;

  const { dot, ring, borderRadius, ringOpacity } = CONFIG[state];

  return (
    <>
      {/* Dot — follows mouse exactly, no lag */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 99999,
          x: mouseX,
          y: mouseY,
        }}
      >
        <motion.div
          animate={{ width: dot[0], height: dot[1] }}
          transition={DOT_T}
          style={{
            ...INNER_CENTER,
            backgroundColor: '#1A8A5A',
            borderRadius: '50%',
          }}
        />
      </motion.div>

      {/* Ring — spring-lagged, context-aware shape */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 99999,
          x: springX,
          y: springY,
        }}
      >
        <motion.div
          animate={{
            width: ring[0],
            height: ring[1],
            borderRadius,
            opacity: ringOpacity,
          }}
          transition={RING_T}
          style={{
            ...INNER_CENTER,
            border: '1.5px solid #1A8A5A',
            backgroundColor: 'transparent',
          }}
        />
      </motion.div>
    </>
  );
}
