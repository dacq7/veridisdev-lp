// Blog post preview card — RSC, no Framer Motion.
// Used in /blog listing page.

import Link from 'next/link';
import { urlForImage } from '@/lib/sanity';
import type { PostPreview } from '@/types/blog';

interface PostCardProps {
  post: PostPreview;
  locale: 'es' | 'en';
  caseStudyLabel: string;
  publishedOnLabel: string;
}

function formatDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale === 'es' ? 'es-CO' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function PostCard({ post, locale, caseStudyLabel, publishedOnLabel }: PostCardProps) {
  const title   = post.title?.[locale]   ?? post.title?.en ?? '';
  const excerpt = post.excerpt?.[locale] ?? post.excerpt?.en ?? '';
  const slugVal = post.slug?.[locale]    ?? post.slug?.en ?? '';
  const imgUrl  = post.coverImage ? urlForImage(post.coverImage) : null;

  return (
    <Link
      href={`/${locale}/blog/${slugVal}`}
      className="group flex flex-col overflow-hidden rounded-xl border transition-colors duration-200"
      style={{
        background: '#111111',
        borderColor: 'rgba(26, 138, 90, 0.15)',
      }}
    >
      {/* Cover */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9', background: '#1A1A1A' }}>
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={post.coverImage?.alt?.[locale] ?? title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: 'radial-gradient(ellipse at 30% 40%, rgba(26,138,90,0.18) 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />
        )}
        {post.isCaseStudy && (
          <span
            className="absolute top-3 left-3 font-sans text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ background: '#0D5C3A', color: '#fff' }}
          >
            {caseStudyLabel}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        <h2 className="font-display font-bold text-white text-lg leading-snug group-hover:text-emerald-400 transition-colors duration-200">
          {title}
        </h2>
        {excerpt && (
          <p className="font-sans text-sm leading-relaxed line-clamp-3" style={{ color: '#6B7280' }}>
            {excerpt}
          </p>
        )}
        <div className="mt-auto flex items-center gap-3 pt-3" style={{ borderTop: '1px solid rgba(26,138,90,0.1)' }}>
          <span className="font-sans text-xs" style={{ color: '#6B7280' }}>
            {publishedOnLabel} {formatDate(post.publishedAt, locale)}
          </span>
        </div>
      </div>
    </Link>
  );
}
