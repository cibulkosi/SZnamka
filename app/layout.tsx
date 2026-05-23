import type { Metadata, Viewport } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import './globals.css'
import { CookieBanner } from '@/components/CookieBanner'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-serif',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Cosmatch — Kompatibilita podle data narození',
  description: 'Česká seznamka, která tě páruje podle data narození. Najdi svou skutečnou shodu — věda, ne náhoda.',
  keywords: 'numerologie, kompatibilita, datum narození, numerologický profil, datování, seznamka',
  openGraph: {
    title: 'Cosmatch — Kompatibilita podle data narození',
    description: 'Najdi svou skutečnou shodu díky numerologii a datům narození.',
    type: 'website',
    siteName: 'Cosmatch',
    locale: 'cs_CZ',
    url: 'https://cosmatch.cz',
    images: [
      {
        url: 'https://cosmatch.cz/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Cosmatch — Seznamka podle data narození',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cosmatch — Kompatibilita podle data narození',
    description: 'Najdi svou skutečnou shodu díky numerologii a datům narození.',
    images: ['https://cosmatch.cz/og-image.png'],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Cosmatch',
  },
  formatDetection: {
    telephone: false,
  },
  metadataBase: new URL('https://cosmatch.cz'),
  alternates: {
    canonical: '/',
    languages: {
      'cs-CZ': '/',
      'x-default': '/',
    },
  },
}

export const viewport: Viewport = {
  themeColor: '#ec4899',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className={`${inter.variable} ${fraunces.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://cosmatch.cz/#organization",
              "identifier": [
                { "@type": "PropertyValue", "propertyID": "IČO", "value": "08419531" },
              ],
              "name": "Cosmatch",
              "alternateName": "Cosmatch.cz",
              "url": "https://cosmatch.cz",
              "logo": "https://cosmatch.cz/icon-512.png",
              "description": "První česká seznamka, která tě páruje podle data narození.",
              "founder": {
                "@type": "Person",
                "name": "Simona Cibulková",
                "jobTitle": "Zakladatelka",
              },
              "foundingDate": "2026",
              "foundingLocation": {
                "@type": "Place",
                "name": "Praha, Česká republika",
              },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Kurzova 2222/16",
                "addressLocality": "Praha 5 - Stodůlky",
                "postalCode": "155 00",
                "addressCountry": "CZ",
              },
              "knowsAbout": [
                "numerologie",
                "seznamka",
                "kompatibilita partnerů",
                "životní číslo",
                "datum narození",
                "kompatibilita podle data narození",
              ],
              "sameAs": [
                "https://www.linkedin.com/company/122134659",
                "https://x.com/cosmatch_cz",
                "https://www.facebook.com/profile.php?id=61590109883991",
                "https://www.youtube.com/@cosmatch-cz",
                "https://www.crunchbase.com/organization/cosmatch",
                "https://www.instagram.com/cosmatch.cz",
                "https://www.tiktok.com/@cosmatch.cz",
                "https://www.producthunt.com/products/cosmatch",
                "https://alternativeto.net/software/cosmatch/",
              ],
            },
            {
              "@type": "WebSite",
              "@id": "https://cosmatch.cz/#website",
              "url": "https://cosmatch.cz",
              "name": "Cosmatch",
              "publisher": { "@id": "https://cosmatch.cz/#organization" },
              "inLanguage": "cs-CZ",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://cosmatch.cz/test?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            },
            {
              "@type": "SoftwareApplication",
              "name": "Cosmatch",
              "applicationCategory": "DatingApplication",
              "operatingSystem": "Web, iOS, Android (PWA)",
              "url": "https://cosmatch.cz",
              "description": "Česká seznamka, která tě páruje podle data narození. Vychází z 12 archetypů a 366 denních profilů kompatibility.",
              "offers": [
                { "@type": "Offer", "name": "Free", "price": "0", "priceCurrency": "CZK" },
                { "@type": "Offer", "name": "Cosmatch+ měsíčně", "price": "249", "priceCurrency": "CZK", "priceSpecification": { "@type": "UnitPriceSpecification", "billingDuration": "P1M" } },
                { "@type": "Offer", "name": "Cosmatch+ kvartálně", "price": "597", "priceCurrency": "CZK", "priceSpecification": { "@type": "UnitPriceSpecification", "billingDuration": "P3M" } },
                { "@type": "Offer", "name": "Cosmatch+ ročně", "price": "2088", "priceCurrency": "CZK", "priceSpecification": { "@type": "UnitPriceSpecification", "billingDuration": "P1Y" } },
              ],
              "publisher": { "@id": "https://cosmatch.cz/#organization" },
              "sameAs": [
                "https://www.linkedin.com/company/122134659",
                "https://www.crunchbase.com/organization/cosmatch",
                "https://x.com/cosmatch_cz",
                "https://www.youtube.com/@cosmatch-cz",
                "https://www.producthunt.com/products/cosmatch",
              ],
            },
          ],
        }) }} />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-180.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-152.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icon-120.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Cosmatch" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className}>{children}<CookieBanner /></body>
    </html>
  )
}
