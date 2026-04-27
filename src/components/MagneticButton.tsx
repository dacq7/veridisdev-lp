'use client';

import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// ── Types ─────────────────────────────────────────────────────────────────────

type Props = {
  children: React.ReactNode;
  strength?: number;
};

// ── Constants ─────────────────────────────────────────────────────────────────

const SPRING_CFG   = { stiffness: 200, damping: 20 };
const ACTIVE_RADIUS = 80;

// ── Component ─────────────────────────────────────────────────────────────────

export default function MagneticButton({ children, strength = 0.3 }: Props) {
  const ref  = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x    = useSpring(rawX, SPRING_CFG);
  const y    = useSpring(rawY, SPRING_CFG);

  useEffect(() => {
    // Only activate on fine-pointer devices — disable on touch/mobile
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const { left, top, width, height } = el.getBoundingClientRect();
      const dx   = e.clientX - (left + width / 2);
      const dy   = e.clientY - (top + height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < ACTIVE_RADIUS) {
        rawX.set(dx * strength);
        rawY.set(dy * strength);
      } else {
        rawX.set(0);
        rawY.set(0);
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [rawX, rawY, strength]);

  return (
    <motion.div ref={ref} style={{ x, y, display: 'inline-flex' }}>
      {children}
    </motion.div>
  );
}
