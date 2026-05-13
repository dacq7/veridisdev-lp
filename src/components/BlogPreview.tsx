// BlogPreview — RSC section for the homepage.
// Shows the latest 2-3 posts from Sanity.
// Returns null when Sanity is not configured or when there are no posts yet.
// PROVISIONING: Sanity required to show actual posts

import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getLatestPosts } from '@/lib/sanity-queries';
import { isSanityConfigured } from '@/lib/sanity';
import PostCard from '@/components/blog/PostCard';

interface Props {
  locale: 'es' | 'en';
}

export default async function BlogPreview({ locale }: Props) {
  // Defense in depth: check config before fetching
  // PROVISIONING: Sanity required to show actual posts
  if (!isSanityConfigured()) return null;

  const posts = await getLatestPosts(locale, 3);
  if (posts.length === 0) return null;

  const t = await getTranslations({ locale, namespace: 'blog' });

  // Adjust grid columns based on post count to avoid orphaned single-card rows
  const gridCols =
    posts.length === 1
      ? 'grid-cols-1 max-w-md mx-auto'
      : posts.length === 2
        ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <section
      id="blog"
      className="relative py-24 md:py-32"
      style={{ background: '#0A0A0A' }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section header */}
        <div className="mb-12 md:mb-14">
          <p
            className="font-sans text-xs tracking-widest uppercase mb-3"
            style={{ color: '#0D5C3A' }}
          >
            {t('preview.eyebrow')}
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="font-display font-bold text-white text-4xl md:text-5xl">
              {t('preview.title')}
            </h2>
            <Link
              href={`/${locale}/blog`}
              className="font-sans text-sm font-medium transition-colors duration-200 shrink-0"
              style={{ color: '#0D5C3A' }}
            >
              {t('preview.viewAll')}
            </Link>
          </div>
          <p
            className="font-sans text-base leading-relaxed mt-3 max-w-lg"
            style={{ color: '#6B7280' }}
          >
            {t('preview.subtitle')}
          </p>
        </div>

        {/* Cards grid */}
        <div className={`grid gap-6 ${gridCols}`}>
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              locale={locale}
              caseStudyLabel={t('post.caseStudy')}
              publishedOnLabel={t('post.publishedOn')}
            />
          ))}
        </div>

        {/* Mobile "view all" CTA (hidden on md+ where it's in the header) */}
        <div className="mt-10 flex justify-center md:hidden">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center font-sans text-sm font-medium px-5 py-2.5 rounded-full transition-colors duration-200"
            style={{ border: '1px solid rgba(26,138,90,0.4)', color: '#0D5C3A' }}
          >
            {t('preview.viewAll')}
          </Link>
        </div>
      </div>
    </section>
  );
}
