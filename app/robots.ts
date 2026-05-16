import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/auth/',
          '/api/',
          '/discover/',
          '/matches/',
          '/profile/',
          '/premium/success/',
          '/_next/',
        ],
      },
      // Be explicit for SeznamBot (Czech-specific)
      {
        userAgent: 'SeznamBot',
        allow: '/',
        disallow: ['/admin/', '/auth/', '/api/', '/discover/', '/matches/', '/profile/'],
      },
      // AI crawlers — allow indexing of public marketing/SEO content
      // (they don't run JS, so private app pages aren't accessible to them anyway)
      {
        userAgent: ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'],
        allow: '/',
        disallow: ['/admin/', '/auth/', '/api/'],
      },
    ],
    sitemap: 'https://cosmatch.cz/sitemap.xml',
    host: 'https://cosmatch.cz',
  }
}
