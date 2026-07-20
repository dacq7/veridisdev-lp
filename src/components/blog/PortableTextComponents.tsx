// Custom renderers for Sanity Portable Text blocks.
// Used in /blog/[slug] post detail page.
// RSC-compatible: no hooks, no browser APIs.

import type { PortableTextComponents } from '@portabletext/react';
import { urlForImage } from '@/lib/sanity';
import type { SanityImage } from '@/types/blog';

export const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="font-display font-bold text-white text-3xl md:text-4xl mt-10 mb-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-display font-bold text-white text-2xl md:text-3xl mt-8 mb-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display font-semibold text-white text-xl mt-6 mb-2">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-display font-semibold text-white text-lg mt-5 mb-2">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="font-sans text-base leading-relaxed mb-4" style={{ color: '#D1D5DB' }}>{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className="font-sans text-lg italic my-6 pl-4"
        style={{ borderLeft: '3px solid #0D5C3A', color: '#9CA3AF' }}
      >
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
    em:     ({ children }) => <em className="italic">{children}</em>,
    code:   ({ children }) => (
      <code
        className="font-mono text-sm px-1.5 py-0.5 rounded"
        style={{ background: 'rgba(26,138,90,0.15)', color: '#34D399' }}
      >
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const href = value?.href ?? '#';
      const isExternal = href.startsWith('http');
      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="underline underline-offset-2 transition-colors duration-150"
          style={{ color: '#34D399' }}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }: { value: SanityImage & { alt?: { es?: string; en?: string } } }) => {
      const url = urlForImage(value);
      if (!url) return null;
      return (
        <figure className="my-8">
          <img
            src={url}
            alt={value.alt?.en ?? value.alt?.es ?? ''}
            className="w-full rounded-xl"
            style={{ border: '1px solid rgba(26,138,90,0.15)' }}
          />
        </figure>
      );
    },
  },
  list: {
    bullet:  ({ children }) => <ul className="font-sans list-disc list-inside mb-4 space-y-1" style={{ color: '#D1D5DB' }}>{children}</ul>,
    number:  ({ children }) => <ol className="font-sans list-decimal list-inside mb-4 space-y-1" style={{ color: '#D1D5DB' }}>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
  },
};
