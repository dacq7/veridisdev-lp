import type { MetadataRoute } from 'next';
import { SITE_URL, SUPPORTED_LOCALES } from '@/lib/site-config';
import { isSanityConfigured, getSanityClient } from '@/lib/sanity';

interface SanitySlugEntry {
  slugEs: string | null;
  slugEn: string | null;
  publishedAt: string | null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap((locale) => [
    {
      url: `${SITE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/${locale}/blog`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]);

  if (!isSanityConfigured()) return staticUrls;

  const client = getSanityClient();
  if (!client) return staticUrls;

  let postEntries: SanitySlugEntry[] = [];
  try {
    postEntries = await client.fetch<SanitySlugEntry[]>(
      `*[_type == "post"] | order(publishedAt desc) {
        "slugEs": slug.es.current,
        "slugEn": slug.en.current,
        "publishedAt": publishedAt
      }`,
    );
  } catch {
    return staticUrls;
  }

  const postUrls: MetadataRoute.Sitemap = postEntries.flatMap((entry) => {
    const urls: MetadataRoute.Sitemap = [];
    const lastMod = entry.publishedAt ? new Date(entry.publishedAt) : now;
    if (entry.slugEs) {
      urls.push({
        url: `${SITE_URL}/es/blog/${entry.slugEs}`,
        lastModified: lastMod,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      });
    }
    if (entry.slugEn) {
      urls.push({
        url: `${SITE_URL}/en/blog/${entry.slugEn}`,
        lastModified: lastMod,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      });
    }
    return urls;
  });

  return [...staticUrls, ...postUrls];
}
