import Image from 'next/image';

// ── Data ──────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const;

const EXTERNAL_LINKS = [
  {
    label: 'github.com/dacq7',
    href: 'https://github.com/dacq7',
  },
  {
    label: 'linkedin.com/in/diegocorreadev',
    href: 'https://linkedin.com/in/diegocorreadev',
  },
] as const;

// ── Column label ──────────────────────────────────────────────────────────────

function ColLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-sans uppercase"
      style={{
        color: '#4A6B58',
        fontSize: '11px',
        letterSpacing: '0.12em',
        marginBottom: '16px',
      }}
    >
      {children}
    </p>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer
      style={{
        background: '#0A1510',
        borderTop: '1px solid rgba(26, 138, 90, 0.15)',
      }}
    >
      <div
        className="max-w-7xl mx-auto px-6 md:px-8"
        style={{ paddingTop: '64px', paddingBottom: '64px' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">

          {/* ── Left: logo + tagline + copyright ─────────────────────── */}
          <div className="flex flex-col gap-4">
            <a href="/" className="flex items-center gap-2.5 w-fit" aria-label="Veridis Dev — home">
              <Image
                src="/logo/veridis-icon.svg"
                alt="Veridis Dev logo"
                width={28}
                height={28}
                unoptimized
              />
              <span className="font-display text-[15px] leading-none select-none">
                <span className="font-semibold text-white">Veridis</span>
                <span className="font-light" style={{ color: '#1A8A5A' }}>Dev</span>
              </span>
            </a>

            <p className="font-sans" style={{ color: '#4A6B58', fontSize: '13px', lineHeight: '1.6' }}>
              Software you can trust.
            </p>

            <p
              className="font-sans mt-auto"
              style={{ color: '#4A6B58', fontSize: '12px', marginTop: '32px' }}
            >
              © 2026 Veridis Dev. All rights reserved.
            </p>
          </div>

          {/* ── Center: navigation ───────────────────────────────────── */}
          <div>
            <ColLabel>Navigation</ColLabel>
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="font-sans transition-colors duration-200 hover:text-white"
                    style={{ color: '#4A6B58', fontSize: '14px' }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Right: contact ───────────────────────────────────────── */}
          <div>
            <ColLabel>Contact</ColLabel>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="mailto:team@veridisdev.com"
                  className="font-sans footer-email-link transition-colors duration-200"
                  style={{ color: '#1A8A5A', fontSize: '14px' }}
                >
                  team@veridisdev.com
                </a>
              </li>
              <li>
                <span className="font-sans" style={{ color: '#4A6B58', fontSize: '14px' }}>
                  Medellín, Colombia
                </span>
              </li>
              {EXTERNAL_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans transition-colors duration-200 hover:text-white"
                    style={{ color: '#4A6B58', fontSize: '14px' }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}
