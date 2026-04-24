import { test, expect } from '@playwright/test'
import { createClient } from '@sanity/client'

const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || 'dv03n90c'
const dataset = process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN || ''

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-04-24',
  token,
  useCdn: false,
})

test.describe('Sanity Phone Schema & Data Verification', () => {
  test('phone documents exist in Sanity', async () => {
    const count = await client.fetch<number>('count(*[_type == "phone"])')
    expect(count).toBeGreaterThan(0)
    console.log(`Total phone documents: ${count}`)
  })

  test('Samsung phones are present', async () => {
    const phones = await client.fetch<Array<{ name: string }>>(
      '*[_type == "phone" && brand == "Samsung"]{ name }'
    )
    expect(phones.length).toBe(30)
    console.log(`Samsung phones: ${phones.length}`)
  })

  test('Tecno phones are present', async () => {
    const phones = await client.fetch<Array<{ name: string }>>(
      '*[_type == "phone" && brand == "Tecno"]{ name }'
    )
    expect(phones.length).toBe(7)
    console.log(`Tecno phones: ${phones.length}`)
  })

  test('Infinix phones are present', async () => {
    const phones = await client.fetch<Array<{ name: string }>>(
      '*[_type == "phone" && brand == "Infinix"]{ name }'
    )
    expect(phones.length).toBe(6)
    console.log(`Infinix phones: ${phones.length}`)
  })

  test('Apple phones are present', async () => {
    const phones = await client.fetch<Array<{ name: string }>>(
      '*[_type == "phone" && brand == "Apple"]{ name }'
    )
    expect(phones.length).toBe(5)
    console.log(`Apple phones: ${phones.length}`)
  })

  test('Xiaomi phones are present', async () => {
    const phones = await client.fetch<Array<{ name: string }>>(
      '*[_type == "phone" && brand == "Xiaomi"]{ name }'
    )
    expect(phones.length).toBe(5)
    console.log(`Xiaomi phones: ${phones.length}`)
  })

  test('OPPO phones are present', async () => {
    const phones = await client.fetch<Array<{ name: string }>>(
      '*[_type == "phone" && brand == "OPPO"]{ name }'
    )
    expect(phones.length).toBe(5)
    console.log(`OPPO phones: ${phones.length}`)
  })

  test('all 6 brands are represented', async () => {
    const brands = await client.fetch<string[]>(
      'array::unique(*[_type == "phone"].brand)'
    )
    expect(brands).toContain('Samsung')
    expect(brands).toContain('Tecno')
    expect(brands).toContain('Infinix')
    expect(brands).toContain('Apple')
    expect(brands).toContain('Xiaomi')
    expect(brands).toContain('OPPO')
    expect(brands.length).toBe(6)
    console.log(`Brands found: ${brands.join(', ')}`)
  })

  test('phone documents have required fields', async () => {
    const phone = await client.fetch<Record<string, unknown>>(
      '*[_type == "phone"][0]{ name, brand, category, price, assetPrice, downPayment, assetModel, slug, available, rating, specs, badges, sortOrder }'
    )
    expect(phone).toBeDefined()
    expect(phone.name).toBeTruthy()
    expect(phone.brand).toBeTruthy()
    expect(phone.category).toBeTruthy()
    expect(phone.price).toBeTruthy()
    expect(phone.assetPrice).toBeGreaterThan(0)
    expect(phone.downPayment).toBeGreaterThanOrEqual(0)
    expect(phone.assetModel).toBeTruthy()
    expect(phone.slug).toBeDefined()
    expect(phone.available).toBe(true)
    expect(phone.rating).toBeGreaterThanOrEqual(0)
    expect(phone.rating).toBeLessThanOrEqual(5)
    expect(Array.isArray(phone.specs)).toBe(true)
    expect(Array.isArray(phone.badges)).toBe(true)
    expect(phone.sortOrder).toBeGreaterThan(0)
  })

  test('categories are valid', async () => {
    const categories = await client.fetch<string[]>(
      'array::unique(*[_type == "phone"].category)'
    )
    const validCategories = ['budget', 'mid-range', 'flagship']
    for (const cat of categories) {
      expect(validCategories).toContain(cat)
    }
    console.log(`Categories found: ${categories.join(', ')}`)
  })

  test('budget phones exist', async () => {
    const count = await client.fetch<number>(
      'count(*[_type == "phone" && category == "budget"])'
    )
    expect(count).toBeGreaterThan(0)
    console.log(`Budget phones: ${count}`)
  })

  test('mid-range phones exist', async () => {
    const count = await client.fetch<number>(
      'count(*[_type == "phone" && category == "mid-range"])'
    )
    expect(count).toBeGreaterThan(0)
    console.log(`Mid-range phones: ${count}`)
  })

  test('flagship phones exist', async () => {
    const count = await client.fetch<number>(
      'count(*[_type == "phone" && category == "flagship"])'
    )
    expect(count).toBeGreaterThan(0)
    console.log(`Flagship phones: ${count}`)
  })

  test('phones are ordered by sortOrder', async () => {
    const phones = await client.fetch<Array<{ sortOrder: number }>>(
      '*[_type == "phone"] | order(sortOrder asc){ sortOrder }'
    )
    for (let i = 1; i < phones.length; i++) {
      expect(phones[i].sortOrder).toBeGreaterThanOrEqual(phones[i - 1].sortOrder)
    }
  })

  test('Samsung A03 CORE has correct pricing', async () => {
    const phone = await client.fetch<{ assetPrice: number; downPayment: number; price: string }>(
      '*[_type == "phone" && name == "A03 CORE (A032FDS) 32GB/2GB"][0]{ assetPrice, downPayment, price }'
    )
    expect(phone).toBeDefined()
    expect(phone.assetPrice).toBe(399000)
    expect(phone.downPayment).toBe(57500)
    expect(phone.price).toBe('UGX 399,000')
  })

  test('GROQ queries return expected results', async () => {
    const allPhones = await client.fetch(
      '*[_type == "phone" && available == true] | order(sortOrder asc){ _id, name, brand, category, price, assetPrice }'
    )
    expect(allPhones.length).toBeGreaterThanOrEqual(58)

    const samsungPhones = await client.fetch(
      '*[_type == "phone" && brand == $brand && available == true] | order(sortOrder asc){ name }',
      { brand: 'Samsung' }
    )
    expect(samsungPhones.length).toBe(30)

    const budgetPhones = await client.fetch(
      '*[_type == "phone" && category == $category && available == true] | order(sortOrder asc){ name }',
      { category: 'budget' }
    )
    expect(budgetPhones.length).toBeGreaterThan(0)
  })

  test('total phone count matches expected', async () => {
    const count = await client.fetch<number>('count(*[_type == "phone"])')
    expect(count).toBe(58)
    console.log(`Total phones: ${count}`)
  })

  test('slugs are properly formatted', async () => {
    const slugs = await client.fetch<Array<{ slug: { current: string } }>>(
      '*[_type == "phone"]{ slug }'
    )
    for (const { slug } of slugs) {
      expect(slug.current).toMatch(/^[a-z0-9-]+$/)
    }
  })
})
