// PROVISIONING: requires Sanity client configured via src/lib/sanity.ts.
// All functions return empty arrays/null when Sanity is not configured.
// ISR revalidation: 3600s (1 hour) with 'posts' cache tag.

import type { FilteredResponseQueryOptions } from '@sanity/client';
import { getSanityClient, isSanityConfigured } from './sanity';
import type { Post, PostPreview, Category } from '@/types/blog';

const REVALIDATE: FilteredResponseQueryOptions = { next: { revalidate: 3600, tags: ['posts'] } };

const POST_PREVIEW_FIELDS = `
  _id,
  title,
  slug,
  excerpt,
  coverImage,
  publishedAt,
  isCaseStudy,
  "author": author->{ _id, name, avatar },
  "categories": categories[]->{ _id, title, slug }
`;

export async function getAllPosts(_locale: 'es' | 'en'): Promise<PostPreview[]> {
  // PROVISIONING: Sanity required
  if (!isSanityConfigured()) return [];
  const client = getSanityClient()!;
  return client.fetch<PostPreview[]>(
    `*[_type == "post"] | order(publishedAt desc) { ${POST_PREVIEW_FIELDS} }`,
    {},
    REVALIDATE,
  );
}

export async function getPostBySlug(slug: string, locale: 'es' | 'en'): Promise<Post | null> {
  // PROVISIONING: Sanity required
  if (!isSanityConfigured()) return null;
  const client = getSanityClient()!;
  const slugField = locale === 'es' ? 'slug.es' : 'slug.en';
  const results = await client.fetch<Post[]>(
    `*[_type == "post" && ${slugField} == $slug][0..0] {
      ${POST_PREVIEW_FIELDS},
      body,
      caseStudyMeta
    }`,
    { slug },
    REVALIDATE,
  );
  return results[0] ?? null;
}

export async function getCaseStudies(_locale: 'es' | 'en'): Promise<PostPreview[]> {
  // PROVISIONING: Sanity required
  if (!isSanityConfigured()) return [];
  const client = getSanityClient()!;
  return client.fetch<PostPreview[]>(
    `*[_type == "post" && isCaseStudy == true] | order(publishedAt desc) { ${POST_PREVIEW_FIELDS} }`,
    {},
    REVALIDATE,
  );
}

export async function getLatestPosts(_locale: 'es' | 'en', limit = 3): Promise<PostPreview[]> {
  // PROVISIONING: Sanity required
  if (!isSanityConfigured()) return [];
  const client = getSanityClient()!;
  return client.fetch<PostPreview[]>(
    `*[_type == "post"] | order(publishedAt desc) [0..$limit] { ${POST_PREVIEW_FIELDS} }`,
    { limit: limit - 1 },
    REVALIDATE,
  );
}

export async function getAllCategories(_locale: 'es' | 'en'): Promise<Category[]> {
  // PROVISIONING: Sanity required
  if (!isSanityConfigured()) return [];
  const client = getSanityClient()!;
  return client.fetch<Category[]>(
    `*[_type == "category"] | order(title.en asc) { _id, title, slug, description }`,
    {},
    REVALIDATE,
  );
}
