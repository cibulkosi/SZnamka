'use client'
import dynamic from 'next/dynamic'

// Lazy-load the cookie banner so it doesn't ship in the initial JS payload
// (improves mobile LCP — the banner appears 800ms after load anyway).
const CookieBanner = dynamic(
  () => import('@/components/CookieBanner').then(m => m.CookieBanner),
  { ssr: false, loading: () => null }
)

export function CookieBannerLazy() {
  return <CookieBanner />
}
