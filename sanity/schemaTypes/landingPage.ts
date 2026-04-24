import { defineType, defineField, defineArrayMember } from 'sanity'

export const landingPage = defineType({
  name: 'landingPage',
  title: 'Landing Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
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
      name: 'pageBuilder',
      title: 'Page Sections',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'hero',
          title: 'Hero Section',
          fields: [
            defineField({
              name: 'heading',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'subheading', type: 'text', rows: 2 }),
            defineField({
              name: 'backgroundImage',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'cta',
              title: 'Call to Action',
              type: 'object',
              fields: [
                defineField({ name: 'label', type: 'string' }),
                defineField({ name: 'url', type: 'url' }),
              ],
            }),
          ],
          preview: {
            select: { title: 'heading' },
            prepare({ title }) {
              return { title: `Hero: ${title}` }
            },
          },
        }),
        defineArrayMember({
          type: 'object',
          name: 'featuresGrid',
          title: 'Features Grid',
          fields: [
            defineField({ name: 'heading', type: 'string' }),
            defineField({
              name: 'items',
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
                    defineField({
                      name: 'description',
                      type: 'text',
                      rows: 2,
                    }),
                    defineField({ name: 'icon', type: 'string' }),
                  ],
                  preview: {
                    select: { title: 'title' },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: { title: 'heading' },
            prepare({ title }) {
              return { title: `Features: ${title || 'Untitled'}` }
            },
          },
        }),
        defineArrayMember({
          type: 'object',
          name: 'testimonials',
          title: 'Testimonials',
          fields: [
            defineField({ name: 'heading', type: 'string' }),
            defineField({
              name: 'items',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({ name: 'quote', type: 'text', rows: 3 }),
                    defineField({ name: 'name', type: 'string' }),
                    defineField({ name: 'role', type: 'string' }),
                    defineField({
                      name: 'avatar',
                      type: 'image',
                      options: { hotspot: true },
                    }),
                  ],
                  preview: {
                    select: { title: 'name', subtitle: 'role' },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: { title: 'heading' },
            prepare({ title }) {
              return { title: `Testimonials: ${title || 'Untitled'}` }
            },
          },
        }),
        defineArrayMember({
          type: 'object',
          name: 'richText',
          title: 'Rich Text Block',
          fields: [
            defineField({
              name: 'content',
              type: 'array',
              of: [defineArrayMember({ type: 'block' })],
            }),
          ],
          preview: {
            prepare() {
              return { title: 'Rich Text Block' }
            },
          },
        }),
        defineArrayMember({
          type: 'object',
          name: 'ctaBanner',
          title: 'CTA Banner',
          fields: [
            defineField({ name: 'heading', type: 'string' }),
            defineField({ name: 'description', type: 'text', rows: 2 }),
            defineField({
              name: 'buttonLabel',
              type: 'string',
            }),
            defineField({
              name: 'buttonUrl',
              type: 'url',
            }),
          ],
          preview: {
            select: { title: 'heading' },
            prepare({ title }) {
              return { title: `CTA: ${title || 'Untitled'}` }
            },
          },
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
    },
  },
})
