'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Ripple = { id: number; x: number; y: number };

export default function TouchRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    if (!('ontouchstart' in window)) return;

    let counter = 0;

    const onTouch = (e: TouchEvent) => {
      const touches = Array.from(e.changedTouches);
      setRipples(prev => [
        ...prev,
        ...touches.map(t => ({ id: ++counter, x: t.clientX, y: t.clientY })),
      ]);
    };

    document.addEventListener('touchstart', onTouch, { passive: true });
    return () => document.removeEventListener('touchstart', onTouch);
  }, []);

  const remove = (id: number) =>
    setRipples(prev => prev.filter(r => r.id !== id));

  return (
    <AnimatePresence>
      {ripples.map(({ id, x, y }) => (
        <motion.div
          key={id}
          initial={{ scale: 0, opacity: 0.4, width: 0, height: 0 }}
          animate={{ scale: 1, opacity: 0, width: 80, height: 80 }}
          exit={{}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          onAnimationComplete={() => remove(id)}
          style={{
            position: 'fixed',
            left: x - 40,
            top: y - 40,
            borderRadius: '50%',
            background: 'rgba(26, 138, 90, 0.25)',
            pointerEvents: 'none',
            zIndex: 99998,
          }}
        />
      ))}
    </AnimatePresence>
  );
}
