// Blog and CMS types — mirrors Sanity schemas defined in sanity/schemas/
// No runtime dependencies; safe to import from anywhere (RSC, client, API routes).

export interface SanityImage {
  _type: 'image';
  asset: { _ref: string; _type: 'reference' };
  hotspot?: { x: number; y: number; height: number; width: number };
  alt?: { es: string; en: string };
}

export interface BilingualString {
  es: string;
  en: string;
}

export interface BilingualText {
  es: string;
  en: string;
}

// Portable Text block type (simplified — actual PortableText uses any internally)
export type PortableTextBlock = {
  _type: string;
  _key: string;
  [key: string]: unknown;
};

export interface BilingualBody {
  es: PortableTextBlock[];
  en: PortableTextBlock[];
}

export interface AuthorPreview {
  _id: string;
  name: string;
  avatar?: SanityImage;
}

export interface Category {
  _id: string;
  title: BilingualString;
  slug: string;
  description?: BilingualText;
}

export interface CaseStudyResult {
  metric: string;
  value: string;
  change: string;
}

export interface CaseStudyMeta {
  client: string;
  industry?: string;
  duration?: string;
  stack?: string[];
  liveUrl?: string;
  results?: CaseStudyResult[];
}

export interface PostPreview {
  _id: string;
  title: BilingualString;
  slug: { es: string; en: string };
  excerpt?: BilingualText;
  coverImage?: SanityImage;
  publishedAt: string;
  author?: AuthorPreview;
  categories?: Category[];
  isCaseStudy?: boolean;
}

export interface Post extends PostPreview {
  body: BilingualBody;
  caseStudyMeta?: CaseStudyMeta;
}

export interface Author {
  _id: string;
  name: string;
  role?: BilingualString;
  avatar?: SanityImage;
  bio?: BilingualText;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}
