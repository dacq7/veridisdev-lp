'use client';

import { useTranslations } from 'next-intl';

export default function Marquee() {
  const t = useTranslations('marquee');
  const track = t('track');

  return (
    <div
      aria-hidden="true"
      className="marquee-track"
      style={{
        height: '44px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(26, 138, 90, 0.06)',
        borderTop: '1px solid rgba(26, 138, 90, 0.12)',
        borderBottom: '1px solid rgba(26, 138, 90, 0.12)',
      }}
    >
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-track:hover .marquee-inner {
          animation-play-state: paused;
        }
      `}</style>

      <div
        className="marquee-inner font-sans"
        style={{
          display: 'inline-flex',
          whiteSpace: 'nowrap',
          animation: 'marquee 30s linear infinite',
          color: '#1A8A5A',
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '2px',
        }}
      >
        <span>{track}</span>
        <span aria-hidden="true">{track}</span>
      </div>
    </div>
  );
}
