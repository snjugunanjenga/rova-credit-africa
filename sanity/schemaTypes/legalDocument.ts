import { defineType, defineField, defineArrayMember } from 'sanity'

export const legalDocument = defineType({
  name: 'legalDocument',
  title: 'Legal Document',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Document Title',
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
      name: 'documentType',
      title: 'Document Type',
      type: 'string',
      options: {
        list: [
          { title: 'Terms of Service', value: 'terms_of_service' },
          { title: 'Privacy Policy', value: 'privacy_policy' },
          { title: 'DPPA Notice', value: 'dppa_notice' },
          { title: 'Partner Agreement', value: 'partner_agreement' },
          { title: 'Client Agreement', value: 'client_agreement' },
          { title: 'Cookie Policy', value: 'cookie_policy' },
          { title: 'Acceptable Use', value: 'acceptable_use' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'version',
      title: 'Version',
      type: 'string',
      description: 'Semantic version (e.g. 1.0.0)',
      validation: (rule) =>
        rule.required().custom((val) => {
          if (!val) return 'Required'
          if (!/^\d+\.\d+\.\d+$/.test(val)) {
            return 'Must follow semver format (e.g. 1.0.0)'
          }
          return true
        }),
    }),
    defineField({
      name: 'effectiveDate',
      title: 'Effective Date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'jurisdiction',
      title: 'Jurisdiction',
      type: 'string',
      options: {
        list: [
          { title: 'Uganda', value: 'UG' },
          { title: 'Kenya', value: 'KE' },
          { title: 'Both', value: 'UG_KE' },
        ],
      },
    }),
    defineField({
      name: 'body',
      title: 'Document Body',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Plain-Language Summary',
      type: 'text',
      rows: 4,
      description: 'Brief plain-language summary for non-legal readers',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'version',
    },
    prepare({ title, subtitle }) {
      return { title, subtitle: `v${subtitle}` }
    },
  },
  orderings: [
    {
      title: 'Effective Date (newest)',
      name: 'effectiveDateDesc',
      by: [{ field: 'effectiveDate', direction: 'desc' }],
    },
  ],
})
