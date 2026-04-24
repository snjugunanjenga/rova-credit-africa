import { defineType, defineField, defineArrayMember } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact Phone',
      type: 'string',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({ name: 'facebook', type: 'url', title: 'Facebook' }),
        defineField({ name: 'twitter', type: 'url', title: 'Twitter / X' }),
        defineField({ name: 'instagram', type: 'url', title: 'Instagram' }),
        defineField({ name: 'linkedin', type: 'url', title: 'LinkedIn' }),
        defineField({ name: 'whatsapp', type: 'url', title: 'WhatsApp' }),
      ],
    }),
    defineField({
      name: 'navigation',
      title: 'Navigation Items',
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
              name: 'href',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'children',
              title: 'Dropdown Items',
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
                      name: 'href',
                      type: 'string',
                      validation: (rule) => rule.required(),
                    }),
                  ],
                  preview: { select: { title: 'label' } },
                }),
              ],
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        }),
      ],
    }),
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      fields: [
        defineField({ name: 'copyright', type: 'string', title: 'Copyright' }),
        defineField({
          name: 'body',
          title: 'Footer Content',
          type: 'array',
          of: [defineArrayMember({ type: 'block' })],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})
