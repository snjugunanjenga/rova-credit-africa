import { defineType, defineField, defineArrayMember } from 'sanity'

export const productPage = defineType({
  name: 'productPage',
  title: 'Product Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Product Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) =>
        rule.required().custom((slug) => {
          if (!slug?.current) return 'Required'
          if (!/^[a-z0-9-]+$/.test(slug.current)) {
            return 'Slug must be lowercase with hyphens only'
          }
          return true
        }),
    }),
    defineField({
      name: 'cloudSqlProductId',
      title: 'Cloud SQL Product ID',
      type: 'string',
      description:
        'UUID from the products table in Cloud SQL. Links marketing content to transactional pricing data.',
      validation: (rule) =>
        rule.custom((val) => {
          if (!val) return true
          if (
            !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
              val,
            )
          ) {
            return 'Must be a valid UUID'
          }
          return true
        }),
    }),
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'string',
      options: {
        list: [
          { title: 'Samsung', value: 'samsung' },
          { title: 'Tecno', value: 'tecno' },
          { title: 'Infinix', value: 'infinix' },
          { title: 'Apple', value: 'apple' },
          { title: 'Xiaomi', value: 'xiaomi' },
          { title: 'OPPO', value: 'oppo' },
        ],
      },
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: (rule) =>
        rule
          .max(200)
          .warning('Keep it under 200 characters for card previews'),
    }),
    defineField({
      name: 'body',
      title: 'Full Description',
      type: 'array',
      of: [
        defineArrayMember({ type: 'block' }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'features',
      title: 'Key Features',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'description', type: 'text', rows: 2 }),
            defineField({ name: 'icon', type: 'string' }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
          },
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      of: [
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
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'metaTitle', type: 'string', title: 'Meta Title' }),
        defineField({
          name: 'metaDescription',
          type: 'text',
          title: 'Meta Description',
          rows: 3,
        }),
        defineField({
          name: 'ogImage',
          type: 'image',
          title: 'Open Graph Image',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'brand',
      media: 'heroImage',
    },
  },
})
