import { getTranslations } from 'next-intl/server';
import { AGENT_PROCESS_STATS } from '@/config/agent-process-stats';

interface Props {
  locale: 'es' | 'en';
}

export default async function AgentProcess({ locale }: Props) {
  const t = await getTranslations('agentProcess');

  const stats = [
    {
      value: AGENT_PROCESS_STATS.commits.value,
      label: locale === 'es' ? AGENT_PROCESS_STATS.commits.labelEs : AGENT_PROCESS_STATS.commits.labelEn,
    },
    {
      value: AGENT_PROCESS_STATS.agents.value,
      label: locale === 'es' ? AGENT_PROCESS_STATS.agents.labelEs : AGENT_PROCESS_STATS.agents.labelEn,
    },
    {
      value: AGENT_PROCESS_STATS.adrs.value,
      label: locale === 'es' ? AGENT_PROCESS_STATS.adrs.labelEs : AGENT_PROCESS_STATS.adrs.labelEn,
    },
  ];

  return (
    <section
      className="relative py-24 px-6 md:px-12 overflow-hidden"
      style={{ background: '#0A0A0A' }}
      aria-labelledby="agent-process-heading"
    >
      {/* Inline styles for hover states (no JS handlers needed) */}
      <style>{`
        .ap-btn-primary {
          background: #0D5C3A;
          color: #ffffff;
          transition: background 0.2s ease;
        }
        .ap-btn-primary:hover {
          background: #10713F;
        }
        .ap-link-secondary {
          color: #6B7280;
          transition: color 0.2s ease;
        }
        .ap-link-secondary:hover {
          color: #F5F5F5;
        }
        .ap-stat-card {
          background: #111111;
          border: 1px solid rgba(13,92,58,0.2);
          transition: border-color 0.2s ease;
        }
        .ap-stat-card:hover {
          border-color: rgba(13,92,58,0.45);
        }
      `}</style>

      {/* Subtle green top border accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(13,92,58,0.4), transparent)' }}
        aria-hidden="true"
      />

      {/* Background grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(13,92,58,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-14">
          {/* Eyebrow */}
          <p
            className="text-xs uppercase tracking-widest mb-4 font-sans"
            style={{ color: '#0D5C3A' }}
          >
            {t('eyebrow')}
          </p>

          {/* Headline with left accent bar */}
          <div className="flex items-start gap-4 mb-6">
            <div
              className="flex-shrink-0 mt-1 w-1 rounded-full self-stretch"
              style={{ background: '#0D5C3A', minHeight: '2.5rem' }}
              aria-hidden="true"
            />
            <h2
              id="agent-process-heading"
              className="text-4xl md:text-5xl font-display font-semibold leading-tight"
              style={{ color: '#F5F5F5' }}
            >
              {t('title')}
            </h2>
          </div>

          {/* Description */}
          <p
            className="max-w-2xl font-sans text-base leading-relaxed"
            style={{ color: '#6B7280' }}
          >
            {t('description')}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="ap-stat-card rounded-xl px-8 py-7 flex flex-col gap-2"
            >
              <span
                className="text-5xl md:text-6xl font-display font-bold leading-none"
                style={{ color: '#0D5C3A' }}
              >
                {stat.value}
              </span>
              <span
                className="text-sm font-sans"
                style={{ color: '#6B7280' }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <a
            href="https://github.com/dacq7/veridisdev-lp/tree/v2/.claude"
            target="_blank"
            rel="noopener noreferrer"
            className="ap-btn-primary inline-flex items-center gap-2 font-sans font-medium text-sm rounded-full px-6 py-3"
          >
            {t('cta.primary')}
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2.5 7h9M7.5 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          <a
            href="https://github.com/dacq7/veridisdev-lp"
            target="_blank"
            rel="noopener noreferrer"
            className="ap-link-secondary inline-flex items-center gap-1.5 font-sans text-sm"
          >
            {t('cta.secondary')}
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 10L10 2M5 2h5v5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Subtle green bottom border accent */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(13,92,58,0.2), transparent)' }}
        aria-hidden="true"
      />
    </section>
  );
}
