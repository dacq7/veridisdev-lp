// Sanity schema for BlogPost / Case Study content type.
// Bilingual: all user-facing fields have { es, en } structure.

import { defineType, defineField, defineArrayMember } from 'sanity';

export const post = defineType({
  name: 'post',
  title: 'Blog Post / Case Study',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'object',
      fields: [
        { name: 'es', title: 'Spanish', type: 'string', validation: (r) => r.required() },
        { name: 'en', title: 'English', type: 'string', validation: (r) => r.required() },
      ],
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'object',
      fields: [
        { name: 'es', title: 'Spanish slug', type: 'slug', options: { source: 'title.es' } },
        { name: 'en', title: 'English slug', type: 'slug', options: { source: 'title.en' } },
      ],
    }),
    defineField({
      name: 'isCaseStudy',
      title: 'Is Case Study?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'object',
          fields: [
            { name: 'es', title: 'Spanish alt', type: 'string' },
            { name: 'en', title: 'English alt', type: 'string' },
          ],
        }),
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'object',
      fields: [
        { name: 'es', title: 'Spanish', type: 'text', rows: 3 },
        { name: 'en', title: 'English', type: 'text', rows: 3 },
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'object',
      fields: [
        { name: 'es', title: 'Spanish', type: 'array', of: [{ type: 'block' }, { type: 'image' }] },
        { name: 'en', title: 'English', type: 'array', of: [{ type: 'block' }, { type: 'image' }] },
      ],
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    }),
    defineField({
      name: 'caseStudyMeta',
      title: 'Case Study Details',
      type: 'object',
      hidden: ({ document }) => !document?.isCaseStudy,
      fields: [
        { name: 'client',   title: 'Client name',  type: 'string' },
        { name: 'industry', title: 'Industry',     type: 'string' },
        { name: 'duration', title: 'Duration',     type: 'string' },
        { name: 'liveUrl',  title: 'Live URL',     type: 'url' },
        {
          name: 'stack',
          title: 'Tech Stack',
          type: 'array',
          of: [{ type: 'string' }],
        },
        {
          name: 'results',
          title: 'Results',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                { name: 'metric', title: 'Metric',     type: 'string' },
                { name: 'value',  title: 'Value',      type: 'string' },
                { name: 'change', title: 'Change',     type: 'string' },
              ],
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      titleEs: 'title.es',
      titleEn: 'title.en',
      media:   'coverImage',
    },
    prepare({ titleEs, titleEn, media }) {
      return { title: titleEn || titleEs || 'Untitled', media };
    },
  },
});
