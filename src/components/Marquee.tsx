// No 'use client' — pure CSS @keyframes animation

const TRACK =
  'REACT · NEXT.JS · FASTAPI · PYTHON · NODE.JS · POSTGRESQL · PRISMA · SUPABASE · TYPESCRIPT · VERCEL · RAILWAY · JEST · PYTEST · DOCKER · TAILWIND CSS · FRAMER MOTION · ';

export default function Marquee() {
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
        <span>{TRACK}</span>
        <span aria-hidden="true">{TRACK}</span>
      </div>
    </div>
  );
}
