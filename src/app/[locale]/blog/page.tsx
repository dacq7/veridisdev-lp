// Blog listing page — RSC, ISR (via Sanity queries), SSG when Sanity absent.
// PROVISIONING: Sanity required for posts to appear. Without env vars, shows "coming soon" state.

import { getTranslations } from 'next-intl/server';
import { getAllPosts }      from '@/lib/sanity-queries';
import { isSanityConfigured } from '@/lib/sanity';
import PostCard              from '@/components/blog/PostCard';
import type { Metadata }     from 'next';
import { SITE_URL, SITE_NAME } from '@/lib/site-config';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const canonicalUrl = `${SITE_URL}/${locale}/blog`;
  const ogParams = new URLSearchParams({ title: t('title'), subtitle: t('subtitle') });
  const ogImageUrl = `${SITE_URL}/api/og?${ogParams.toString()}`;

  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        es: `${SITE_URL}/es/blog`,
        en: `${SITE_URL}/en/blog`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('subtitle'),
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: locale === 'es' ? 'es_CO' : 'en_US',
      alternateLocale: locale === 'es' ? 'en_US' : 'es_CO',
      type: 'website',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: t('title') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('subtitle'),
      images: [ogImageUrl],
    },
  };
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const t     = await getTranslations({ locale, namespace: 'blog' });
  const posts = await getAllPosts(locale as 'es' | 'en');

  // Coming soon state — Sanity not configured OR no posts yet
  if (!isSanityConfigured() || posts.length === 0) {
    return (
      <main className="min-h-screen" style={{ background: '#0A0A0A' }}>
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32 flex flex-col items-center text-center gap-8">
          <p className="font-sans text-xs tracking-widest uppercase" style={{ color: '#0D5C3A' }}>
            Blog
          </p>
          <h1 className="font-display font-bold text-white text-4xl md:text-6xl">
            {t('comingSoon.title')}
          </h1>
          <p className="font-sans text-base leading-relaxed max-w-lg" style={{ color: '#6B7280' }}>
            {t('comingSoon.description')}
          </p>
          <a
            href={`/${locale}#contact`}
            className="inline-flex items-center font-sans font-medium text-sm px-6 py-3 rounded-full transition-colors duration-200"
            style={{ background: '#0D5C3A', color: '#fff' }}
          >
            {t('comingSoon.cta')} →
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: '#0A0A0A' }}>
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
        {/* Header */}
        <div className="mb-14">
          <p className="font-sans text-xs tracking-widest uppercase mb-3" style={{ color: '#0D5C3A' }}>
            Blog
          </p>
          <h1 className="font-display font-bold text-white text-4xl md:text-5xl mb-4">
            {t('title')}
          </h1>
          <p className="font-sans text-base leading-relaxed max-w-lg" style={{ color: '#6B7280' }}>
            {t('subtitle')}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              locale={locale as 'es' | 'en'}
              caseStudyLabel={t('post.caseStudy')}
              publishedOnLabel={t('post.publishedOn')}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
