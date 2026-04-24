import { defineType, defineField } from 'sanity'

export const announcement = defineType({
  name: 'announcement',
  title: 'Announcement',
  type: 'document',
  fields: [
    defineField({
      name: 'message',
      title: 'Message',
      type: 'string',
      validation: (rule) =>
        rule
          .required()
          .max(150)
          .warning('Keep banners under 150 characters'),
    }),
    defineField({
      name: 'linkLabel',
      title: 'Link Label',
      type: 'string',
    }),
    defineField({
      name: 'linkUrl',
      title: 'Link URL',
      type: 'url',
    }),
    defineField({
      name: 'variant',
      title: 'Style Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Info', value: 'info' },
          { title: 'Warning', value: 'warning' },
          { title: 'Success', value: 'success' },
          { title: 'Promotion', value: 'promotion' },
        ],
        layout: 'radio',
      },
      initialValue: 'info',
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'startsAt',
      title: 'Starts At',
      type: 'datetime',
    }),
    defineField({
      name: 'endsAt',
      title: 'Ends At',
      type: 'datetime',
      validation: (rule) =>
        rule.custom((endDate, context) => {
          const startDate = context.document?.startsAt as string | undefined
          if (
            startDate &&
            endDate &&
            new Date(endDate) < new Date(startDate)
          ) {
            return 'End date must be after start date'
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {
      title: 'message',
      subtitle: 'variant',
    },
  },
})
