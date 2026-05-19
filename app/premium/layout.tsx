import type { Metadata } from 'next'

const TITLE = 'Předplatné Cosmatch — Cosmatch+ od 249 Kč/měs | Cosmatch'
const DESC = 'Cosmatch+ za 249 Kč/měs, 597 Kč za 3 měsíce (sleva 20 %), nebo 2 088 Kč ročně (sleva 30 %). Neomezené lajky, hloubková analýza podle data narození, vidíš kdo tě lajknul. Bez reklam, bez prodávání dat.'
const URL = 'https://cosmatch.cz/premium'

const FAQS = [
  {
    q: 'Kolik stojí Cosmatch+?',
    a: 'Měsíčně 249 Kč, kvartálně 597 Kč (sleva 20 %), nebo ročně 2 088 Kč (sleva 30 %). Free verze je plně použitelná zdarma.',
  },
  {
    q: 'Mohu předplatné kdykoli zrušit?',
    a: 'Ano, zrušení je v profilu jedním klikem. Zbývající dny ti zůstanou aktivní.',
  },
  {
    q: 'Jak se platí Cosmatch+?',
    a: 'Platbu zpracovává zabezpečená platební brána. Přijímá Visa, Mastercard, Apple Pay i Google Pay. Faktura ti přijde automaticky e-mailem.',
  },
  {
    q: 'Vrátíte peníze pokud nebudu spokojen?',
    a: 'Do 14 dnů ano, bez vysvětlení (dle § 1829 OZ). Po 14 dnech vyhodnocujeme případ od případu — viz Reklamační řád.',
  },
  {
    q: 'Je Cosmatch určen pouze pro dospělé?',
    a: 'Ano. Cosmatch je seznamovací služba určená výhradně osobám starším 18 let. Registrace vyžaduje potvrzení věku.',
  },
]

const FAQ_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

const OFFER_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Cosmatch+',
  description: 'Předplatné numerologické seznamky Cosmatch — neomezené lajky, hloubková analýza podle data narození, vidíš kdo tě lajknul, prioritní zobrazení ve feedu.',
  brand: { '@type': 'Brand', name: 'Cosmatch' },
  offers: [
    { '@type': 'Offer', name: 'Cosmatch+ měsíčně', price: '249', priceCurrency: 'CZK', availability: 'https://schema.org/InStock', url: URL, priceSpecification: { '@type': 'UnitPriceSpecification', billingDuration: 'P1M', price: '249', priceCurrency: 'CZK' } },
    { '@type': 'Offer', name: 'Cosmatch+ kvartálně', price: '597', priceCurrency: 'CZK', availability: 'https://schema.org/InStock', url: URL, priceSpecification: { '@type': 'UnitPriceSpecification', billingDuration: 'P3M', price: '597', priceCurrency: 'CZK' } },
    { '@type': 'Offer', name: 'Cosmatch+ ročně', price: '2088', priceCurrency: 'CZK', availability: 'https://schema.org/InStock', url: URL, priceSpecification: { '@type': 'UnitPriceSpecification', billingDuration: 'P1Y', price: '2088', priceCurrency: 'CZK' } },
  ],
}

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL, languages: { 'cs-CZ': URL, 'x-default': URL } },
  openGraph: { title: TITLE, description: DESC, url: URL, type: 'website', siteName: 'Cosmatch', locale: 'cs_CZ' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
}

export default function PremiumLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(OFFER_JSONLD) }} />
      {children}
    </>
  )
}
