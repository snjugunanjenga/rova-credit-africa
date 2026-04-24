/**
 * GROQ query definitions for Sanity CMS content.
 *
 * These queries are used by the React frontend to fetch editorial content
 * from Sanity. Transactional data (pricing, availability) comes from
 * Cloud SQL via the FastAPI backend.
 */

export const PRODUCT_PAGE_QUERY = `*[_type == "productPage" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  cloudSqlProductId,
  brand,
  heroImage{ asset->{ url, metadata }, alt },
  shortDescription,
  body[]{
    _key,
    _type,
    ...,
    _type == "image" => { asset->{ url, metadata }, alt, caption }
  },
  features[]{ _key, title, description, icon },
  gallery[]{ _key, asset->{ url, metadata }, alt },
  seo{ metaTitle, metaDescription, ogImage{ asset->{ url } } }
}`

export const PRODUCT_PAGES_LIST_QUERY = `*[_type == "productPage"] | order(title asc){
  _id,
  title,
  slug,
  cloudSqlProductId,
  brand,
  heroImage{ asset->{ url }, alt },
  shortDescription
}`

export const LEGAL_DOCUMENT_QUERY = `*[_type == "legalDocument" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  documentType,
  version,
  effectiveDate,
  jurisdiction,
  body,
  summary
}`

export const LEGAL_DOCUMENTS_LIST_QUERY = `*[_type == "legalDocument"] | order(effectiveDate desc){
  _id,
  title,
  slug,
  documentType,
  version,
  effectiveDate,
  jurisdiction,
  summary
}`

export const FAQ_ITEMS_QUERY = `*[_type == "faqItem" && published == true] | order(sortOrder asc){
  _id,
  question,
  answer,
  category,
  sortOrder
}`

export const FAQ_BY_CATEGORY_QUERY = `*[_type == "faqItem" && published == true && category == $category] | order(sortOrder asc){
  _id,
  question,
  answer,
  category,
  sortOrder
}`

export const HELP_ARTICLE_QUERY = `*[_type == "helpArticle" && slug.current == $slug && published == true][0]{
  _id,
  title,
  slug,
  category,
  excerpt,
  body[]{
    _key,
    _type,
    ...,
    _type == "image" => { asset->{ url, metadata }, alt, caption }
  },
  relatedArticles[]->{ _id, title, slug, category, excerpt }
}`

export const HELP_ARTICLES_LIST_QUERY = `*[_type == "helpArticle" && published == true] | order(category asc, title asc){
  _id,
  title,
  slug,
  category,
  excerpt
}`

export const BLOG_POST_QUERY = `*[_type == "blogPost" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  author,
  publishedAt,
  coverImage{ asset->{ url, metadata }, alt },
  excerpt,
  body[]{
    _key,
    _type,
    ...,
    _type == "image" => { asset->{ url, metadata }, alt, caption }
  },
  tags,
  seo{ metaTitle, metaDescription, ogImage{ asset->{ url } } }
}`

export const BLOG_POSTS_LIST_QUERY = `*[_type == "blogPost" && defined(publishedAt)] | order(publishedAt desc){
  _id,
  title,
  slug,
  author,
  publishedAt,
  coverImage{ asset->{ url }, alt },
  excerpt,
  tags
}`

export const LANDING_PAGE_QUERY = `*[_type == "landingPage" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  pageBuilder[]{
    _key,
    _type,
    ...,
    _type == "hero" => {
      heading,
      subheading,
      backgroundImage{ asset->{ url, metadata } },
      cta{ label, url }
    },
    _type == "featuresGrid" => {
      heading,
      items[]{ _key, title, description, icon }
    },
    _type == "testimonials" => {
      heading,
      items[]{ _key, quote, name, role, avatar{ asset->{ url } } }
    }
  },
  seo{ metaTitle, metaDescription, ogImage{ asset->{ url } } }
}`

export const PARTNER_SPOTLIGHTS_QUERY = `*[_type == "partnerSpotlight"] | order(publishedAt desc){
  _id,
  partnerName,
  slug,
  location,
  photo{ asset->{ url }, alt },
  quote,
  stats[]{ _key, label, value },
  publishedAt
}`

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  siteName,
  tagline,
  logo{ asset->{ url } },
  contactEmail,
  contactPhone,
  socialLinks,
  navigation[]{ _key, label, href, children[]{ _key, label, href } },
  footer{ copyright, body }
}`

export const ACTIVE_ANNOUNCEMENTS_QUERY = `*[_type == "announcement" && active == true && (
  !defined(startsAt) || startsAt <= now()
) && (
  !defined(endsAt) || endsAt >= now()
)]{
  _id,
  message,
  linkLabel,
  linkUrl,
  variant
}`

export const PHONES_LIST_QUERY = `*[_type == "phone" && available == true] | order(sortOrder asc){
  _id,
  name,
  slug,
  brand,
  category,
  price,
  assetPrice,
  downPayment,
  assetModel,
  image,
  heroImage{ asset->{ url, metadata }, alt },
  alt,
  available,
  rating,
  specs,
  badges,
  sortOrder
}`

export const PHONES_BY_BRAND_QUERY = `*[_type == "phone" && brand == $brand && available == true] | order(sortOrder asc){
  _id,
  name,
  slug,
  brand,
  category,
  price,
  assetPrice,
  downPayment,
  assetModel,
  image,
  heroImage{ asset->{ url, metadata }, alt },
  alt,
  available,
  rating,
  specs,
  badges,
  sortOrder
}`

export const PHONES_BY_CATEGORY_QUERY = `*[_type == "phone" && category == $category && available == true] | order(sortOrder asc){
  _id,
  name,
  slug,
  brand,
  category,
  price,
  assetPrice,
  downPayment,
  assetModel,
  image,
  heroImage{ asset->{ url, metadata }, alt },
  alt,
  available,
  rating,
  specs,
  badges,
  sortOrder
}`

export const PHONE_DETAIL_QUERY = `*[_type == "phone" && slug.current == $slug][0]{
  _id,
  name,
  slug,
  brand,
  category,
  price,
  assetPrice,
  downPayment,
  assetModel,
  image,
  heroImage{ asset->{ url, metadata }, alt },
  alt,
  available,
  rating,
  specs,
  badges,
  sortOrder
}`

export const PHONE_BRANDS_QUERY = `array::unique(*[_type == "phone" && available == true].brand)`

export const PHONE_COUNT_QUERY = `count(*[_type == "phone"])`
