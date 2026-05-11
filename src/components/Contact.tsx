import { getTranslations } from 'next-intl/server';
import ContactForm from '@/components/ContactForm';

// ── Section ───────────────────────────────────────────────────────────────────

export default async function Contact() {
  const t = await getTranslations('contact');

  return (
    <section
      id="contact"
      className="relative py-24 md:py-32"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16">

        {/* Section header — static server-rendered HTML */}
        <div className="mb-14 md:mb-16 max-sm:overflow-x-hidden">
          <p className="font-sans text-xs tracking-widest uppercase text-accent mb-3">
            {t('label')}
          </p>
          <h2
            className="font-display font-semibold text-white text-4xl md:text-5xl mb-4 break-words hyphens-auto"
          >
            {t('heading')}
          </h2>
          <p className="font-sans text-text-secondary text-base leading-relaxed max-w-lg">
            {t('subtitle')}
          </p>
        </div>

        {/* Two-column layout — client island */}
        <ContactForm />

      </div>
    </section>
  );
}
