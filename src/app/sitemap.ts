import type { MetadataRoute } from 'next'

const siteUrl = 'https://bnbshoes.online'

const staticRoutes = [
  '/',
  '/about',
  '/contact',
  '/collections',
  '/new-arrivals',
  '/sales',
  '/men',
  '/women',
  '/running',
  '/sneakers',
  '/formal',
  '/slippers',
  '/kids',
  '/accessories',
  '/bag',
  '/wishlist',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return staticRoutes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: path === '/' ? 'daily' : 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }))
}import type { MetadataRoute } from 'next'

const siteUrl = 'https://bnbshoes.online'

const staticRoutes = [
  '/',
  '/about',
  '/contact',
  '/collections',
  '/new-arrivals',
  '/sales',
  '/men',
  '/women',
  '/running',
  '/sneakers',
  '/formal',
  '/slippers',
  '/kids',
  '/accessories',
  '/bag',
  '/wishlist',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return staticRoutes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: path === '/' ? 'daily' : 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }))
}