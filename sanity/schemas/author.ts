// Sanity schema for content authors.
import { defineType, defineField } from 'sanity';

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({ name: 'name',   title: 'Name',   type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'avatar', title: 'Avatar', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'object',
      fields: [
        { name: 'es', title: 'Spanish', type: 'string' },
        { name: 'en', title: 'English', type: 'string' },
      ],
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'object',
      fields: [
        { name: 'es', title: 'Spanish', type: 'text' },
        { name: 'en', title: 'English', type: 'text' },
      ],
    }),
    defineField({
      name: 'social',
      title: 'Social links',
      type: 'object',
      fields: [
        { name: 'twitter',  title: 'Twitter / X',  type: 'url' },
        { name: 'linkedin', title: 'LinkedIn',     type: 'url' },
        { name: 'github',   title: 'GitHub',       type: 'url' },
      ],
    }),
  ],
  preview: {
    select: { title: 'name', media: 'avatar' },
  },
});
