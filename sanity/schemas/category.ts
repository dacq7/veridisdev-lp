// Sanity schema for blog post categories.
import { defineType, defineField } from 'sanity';

export const category = defineType({
  name: 'category',
  title: 'Category',
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
      type: 'slug',
      options: { source: 'title.en' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        { name: 'es', title: 'Spanish', type: 'text' },
        { name: 'en', title: 'English', type: 'text' },
      ],
    }),
  ],
  preview: {
    select: { titleEn: 'title.en', titleEs: 'title.es' },
    prepare({ titleEn, titleEs }) {
      return { title: titleEn || titleEs || 'Untitled category' };
    },
  },
});
