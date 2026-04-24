import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || '',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2026-04-24',
  useCdn: process.env.NODE_ENV === 'production',
})

export const previewClient = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || '',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2026-04-24',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})
