import { defineType, defineField, defineArrayMember } from 'sanity'

export const phone = defineType({
  name: 'phone',
  title: 'Phone',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Phone Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'string',
      options: {
        list: [
          { title: 'Samsung', value: 'Samsung' },
          { title: 'Tecno', value: 'Tecno' },
          { title: 'Infinix', value: 'Infinix' },
          { title: 'Apple', value: 'Apple' },
          { title: 'Xiaomi', value: 'Xiaomi' },
          { title: 'OPPO', value: 'OPPO' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Budget', value: 'budget' },
          { title: 'Mid-Range', value: 'mid-range' },
          { title: 'Flagship', value: 'flagship' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (Display)',
      type: 'string',
      description: 'Formatted price string, e.g. "UGX 399,000"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'assetPrice',
      title: 'Asset Price',
      type: 'number',
      description: 'Numeric price in UGX for calculations',
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: 'downPayment',
      title: 'Down Payment',
      type: 'number',
      description: 'Required down payment in UGX',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'assetModel',
      title: 'Asset Model',
      type: 'string',
      description: 'Internal model identifier',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Product Image',
      type: 'url',
      description: 'External image URL',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image (Sanity)',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'alt',
      title: 'Image Alt Text',
      type: 'string',
    }),
    defineField({
      name: 'available',
      title: 'Available',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (rule) => rule.min(0).max(5),
    }),
    defineField({
      name: 'specs',
      title: 'Specifications',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'badges',
      title: 'Badges',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Sort Order',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
    {
      title: 'Price Low to High',
      name: 'priceAsc',
      by: [{ field: 'assetPrice', direction: 'asc' }],
    },
    {
      title: 'Price High to Low',
      name: 'priceDesc',
      by: [{ field: 'assetPrice', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'brand',
      media: 'heroImage',
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle ? `${subtitle}` : undefined,
      }
    },
  },
})
