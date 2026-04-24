import { defineType, defineField, defineArrayMember } from 'sanity'

export const partnerSpotlight = defineType({
  name: 'partnerSpotlight',
  title: 'Partner Spotlight',
  type: 'document',
  fields: [
    defineField({
      name: 'partnerName',
      title: 'Partner Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'partnerName' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'photo',
      title: 'Partner Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'quote',
      title: 'Featured Quote',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'story',
      title: 'Full Story',
      type: 'array',
      of: [
        defineArrayMember({ type: 'block' }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Alt Text' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'stats',
      title: 'Key Stats',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'value',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'value' },
          },
        }),
      ],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'partnerName',
      subtitle: 'location',
      media: 'photo',
    },
  },
})
