import { defineType, defineField, defineArrayMember } from 'sanity'

export const helpArticle = defineType({
  name: 'helpArticle',
  title: 'Help Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Getting Started', value: 'getting_started' },
          { title: 'Payments', value: 'payments' },
          { title: 'Device Setup', value: 'device_setup' },
          { title: 'Troubleshooting', value: 'troubleshooting' },
          { title: 'Account Management', value: 'account' },
          { title: 'Partner Guide', value: 'partner_guide' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 2,
      validation: (rule) =>
        rule.max(160).warning('Keep under 160 chars for search previews'),
    }),
    defineField({
      name: 'body',
      title: 'Content',
      type: 'array',
      of: [
        defineArrayMember({ type: 'block' }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Alt Text' }),
            defineField({ name: 'caption', type: 'string', title: 'Caption' }),
          ],
        }),
        defineArrayMember({
          type: 'code',
          options: {
            withFilename: true,
          },
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'relatedArticles',
      title: 'Related Articles',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'helpArticle' }],
        }),
      ],
      validation: (rule) => rule.max(5),
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
    },
  },
})
