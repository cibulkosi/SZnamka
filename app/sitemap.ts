import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const BASE = 'https://cosmatch.cz'

// Life-path numbers for programmatic pages (Phase 3)
const LIFE_PATH_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/about/`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/test/`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/waitlist/`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    // ── Pillar SEO pages ──
    { url: `${BASE}/numerologie/`, lastModified: now, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${BASE}/numerologie/master-cisla-11-22-33/`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/numerologie/numerologicka-mrizka/`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/jak-funguje-cosmatch/`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/kompatibilita-podle-data-narozeni/`, lastModified: lastMonth, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/numerologie-vztahy/`, lastModified: lastMonth, changeFrequency: 'monthly', priority: 0.85 },
    // ── Trust pages ──
    { url: `${BASE}/manifest-duvery/`, lastModified: lastMonth, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/verifikace/`, lastModified: lastMonth, changeFrequency: 'monthly', priority: 0.7 },
    // ── Other ──
    { url: `${BASE}/ambasadorky/`, lastModified: lastMonth, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/demo/`, lastModified: lastMonth, changeFrequency: 'monthly', priority: 0.5 },
  ]

  // Programatic life-path pages (will exist once Phase 3 lands)
  const lifePathPages: MetadataRoute.Sitemap = LIFE_PATH_NUMBERS.map(n => ({
    url: `${BASE}/numerologie/zivotni-cislo-${n}/`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.85,
  }))

  return [...staticPages, ...lifePathPages]
}
