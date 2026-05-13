// Individual blog post / case study page.
// PROVISIONING: Sanity required. Without it, all slug lookups return 404.

import { notFound }          from 'next/navigation';
import { getTranslations }   from 'next-intl/server';
import { PortableText }      from '@portabletext/react';
import { getPostBySlug }     from '@/lib/sanity-queries';
import { urlForImage }        from '@/lib/sanity';
import { portableTextComponents } from '@/components/blog/PortableTextComponents';
import type { Metadata }     from 'next';
import type { CaseStudyMeta } from '@/types/blog';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug, locale as 'es' | 'en');
  if (!post) return {};
  const title       = post.title?.[locale as 'es' | 'en'] ?? '';
  const description = post.excerpt?.[locale as 'es' | 'en'] ?? '';
  const ogImage     = post.coverImage ? urlForImage(post.coverImage) : undefined;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.publishedAt,
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

// No generateStaticParams — slugs are unknown without Sanity. Pages generate on-demand (ISR).

function formatDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale === 'es' ? 'es-CO' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function CaseStudyPanel({
  meta,
  labels,
}: {
  meta: CaseStudyMeta;
  labels: {
    client: string;
    industry: string;
    duration: string;
    stack: string;
    results: string;
    liveUrl: string;
  };
}) {
  return (
    <aside
      className="rounded-xl p-6 my-10"
      style={{ background: '#111111', border: '1px solid rgba(26,138,90,0.2)' }}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {meta.client   && <div><p className="font-sans text-xs uppercase tracking-widest mb-1" style={{ color: '#6B7280' }}>{labels.client}</p><p className="font-sans font-medium text-white text-sm">{meta.client}</p></div>}
        {meta.industry && <div><p className="font-sans text-xs uppercase tracking-widest mb-1" style={{ color: '#6B7280' }}>{labels.industry}</p><p className="font-sans font-medium text-white text-sm">{meta.industry}</p></div>}
        {meta.duration && <div><p className="font-sans text-xs uppercase tracking-widest mb-1" style={{ color: '#6B7280' }}>{labels.duration}</p><p className="font-sans font-medium text-white text-sm">{meta.duration}</p></div>}
      </div>
      {meta.stack && meta.stack.length > 0 && (
        <div className="mb-6">
          <p className="font-sans text-xs uppercase tracking-widest mb-2" style={{ color: '#6B7280' }}>{labels.stack}</p>
          <div className="flex flex-wrap gap-2">
            {meta.stack.map((tech) => (
              <span key={tech} className="font-sans text-xs px-2.5 py-1 rounded" style={{ background: 'rgba(26,138,90,0.1)', border: '1px solid rgba(26,138,90,0.3)', color: '#34D399' }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
      {meta.results && meta.results.length > 0 && (
        <div className="mb-4">
          <p className="font-sans text-xs uppercase tracking-widest mb-3" style={{ color: '#6B7280' }}>{labels.results}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {meta.results.map((r) => (
              <div key={r.metric}>
                <p className="font-display font-bold text-2xl" style={{ color: '#0D5C3A' }}>{r.value}</p>
                <p className="font-sans text-xs" style={{ color: '#6B7280' }}>{r.metric}</p>
                {r.change && <p className="font-sans text-xs" style={{ color: '#34D399' }}>{r.change}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
      {meta.liveUrl && (
        <a
          href={meta.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center font-sans text-sm font-medium gap-1 transition-colors duration-150"
          style={{ color: '#34D399' }}
        >
          {labels.liveUrl} →
        </a>
      )}
    </aside>
  );
}

export default async function PostPage({ params }: Props) {
  const { locale, slug } = await params;
  const t    = await getTranslations({ locale, namespace: 'blog' });
  const post = await getPostBySlug(slug, locale as 'es' | 'en');

  if (!post) notFound();

  const title       = post.title?.[locale as 'es' | 'en']   ?? '';
  const excerpt     = post.excerpt?.[locale as 'es' | 'en'] ?? '';
  const body        = post.body?.[locale as 'es' | 'en']    ?? [];
  const coverImgUrl = post.coverImage ? urlForImage(post.coverImage) : null;

  return (
    <main className="min-h-screen" style={{ background: '#0A0A0A' }}>
      {/* Cover */}
      {coverImgUrl && (
        <div className="relative w-full" style={{ height: '40vh', maxHeight: '480px', background: '#1A1A1A' }}>
          <img src={coverImgUrl} alt={title} className="w-full h-full object-cover" style={{ opacity: 0.85 }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, #0A0A0A 100%)' }} aria-hidden="true" />
        </div>
      )}

      <article className="max-w-3xl mx-auto px-6 md:px-8 py-16">
        {/* Badges */}
        {post.isCaseStudy && (
          <span
            className="inline-block font-sans text-xs font-medium px-2.5 py-1 rounded-full mb-4"
            style={{ background: '#0D5C3A', color: '#fff' }}
          >
            {t('post.caseStudy')}
          </span>
        )}

        {/* Title */}
        <h1 className="font-display font-bold text-white text-3xl md:text-5xl leading-tight mb-4">{title}</h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-8" style={{ borderBottom: '1px solid rgba(26,138,90,0.15)', paddingBottom: '1.5rem' }}>
          {post.author && (
            <span className="font-sans text-sm" style={{ color: '#6B7280' }}>
              {t('post.by')} <span className="text-white">{post.author.name}</span>
            </span>
          )}
          <span className="font-sans text-sm" style={{ color: '#6B7280' }}>
            {t('post.publishedOn')} {formatDate(post.publishedAt, locale)}
          </span>
          {post.categories?.map((cat) => (
            <span key={cat._id} className="font-sans text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(26,138,90,0.1)', color: '#34D399', border: '1px solid rgba(26,138,90,0.3)' }}>
              {cat.title?.[locale as 'es' | 'en'] ?? cat.title?.en}
            </span>
          ))}
        </div>

        {/* Excerpt */}
        {excerpt && (
          <p className="font-sans text-lg leading-relaxed mb-8" style={{ color: '#9CA3AF' }}>{excerpt}</p>
        )}

        {/* Case Study Panel */}
        {post.isCaseStudy && post.caseStudyMeta && (
          <CaseStudyPanel
            meta={post.caseStudyMeta}
            labels={{
              client:   t('caseStudyMeta.client'),
              industry: t('caseStudyMeta.industry'),
              duration: t('caseStudyMeta.duration'),
              stack:    t('caseStudyMeta.stack'),
              results:  t('caseStudyMeta.results'),
              liveUrl:  t('caseStudyMeta.liveUrl'),
            }}
          />
        )}

        {/* Body */}
        {body.length > 0 && (
          <div className="mt-4">
            <PortableText
              value={body as Parameters<typeof PortableText>[0]['value']}
              components={portableTextComponents}
            />
          </div>
        )}

        {/* Post footer CTA */}
        <div
          className="mt-16 pt-10 flex flex-col items-center text-center gap-4"
          style={{ borderTop: '1px solid rgba(26,138,90,0.15)' }}
        >
          <p className="font-display font-bold text-white text-2xl">{t('footer.ctaTitle')}</p>
          <a
            href={`/${locale}#contact`}
            className="inline-flex items-center font-sans font-medium text-sm px-6 py-3 rounded-full transition-colors duration-200"
            style={{ background: '#0D5C3A', color: '#fff' }}
          >
            {t('footer.ctaButton')}
          </a>
        </div>
      </article>
    </main>
  );
}
