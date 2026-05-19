import type { Metadata } from 'next'

const TITLE = 'Předplatné Cosmatch — Cosmatch+ od 249 Kč/měs, Serious od 399 Kč/měs | Cosmatch'
const DESC = 'Cosmatch+ od 249 Kč/měs (kvartálně 597 Kč · ročně 1 788 Kč). Cosmatch Serious od 399 Kč/měs s povinnou ID verifikací (kvartálně 987 Kč · ročně 2 988 Kč). Bez reklam, bez prodávání dat. Platby zpracovává GoPay.'
const URL = 'https://cosmatch.cz/premium'

const FAQS = [
  {
    q: 'Kolik stojí Cosmatch+?',
    a: 'Měsíčně 249 Kč, kvartálně 597 Kč (199 Kč/měs, sleva 20 %), nebo ročně 1 788 Kč (149 Kč/měs, sleva 40 %). Free verze je plně použitelná zdarma.',
  },
  {
    q: 'Kolik stojí Cosmatch Serious?',
    a: 'Měsíčně 399 Kč, kvartálně 987 Kč (329 Kč/měs, sleva 18 %), nebo ročně 2 988 Kč (249 Kč/měs, sleva 38 %). Serious obsahuje povinnou ID verifikaci a zelený štítek Ověřeno.',
  },
  {
    q: 'Mohu předplatné kdykoli zrušit?',
    a: 'Ano, zrušení je v profilu jedním klikem. Zbývající dny ti zůstanou aktivní.',
  },
  {
    q: 'Jak se platí Cosmatch?',
    a: 'Platbu zpracovává GoPay — česká platební instituce regulovaná ČNB. Přijímá Visa, Mastercard, Apple Pay i Google Pay. Faktura ti přijde automaticky e-mailem.',
  },
  {
    q: 'Co se stane když přejdu z Plus na Serious?',
    a: 'Doplatíš jen rozdíl za zbývající dny. Změna je okamžitá a automaticky se zapne ID verifikace.',
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
  name: 'Cosmatch — předplatné',
  description: 'Předplatné numerologické seznamky Cosmatch. Cosmatch+ (neomezené lajky, kdo mě lajknul, prioritní feed) nebo Cosmatch Serious (vše z + povinná ID verifikace + zelený štítek Ověřeno + prémiové filtry).',
  brand: { '@type': 'Brand', name: 'Cosmatch' },
  offers: [
    { '@type': 'Offer', name: 'Cosmatch+ měsíčně', price: '249', priceCurrency: 'CZK', availability: 'https://schema.org/InStock', url: URL, priceSpecification: { '@type': 'UnitPriceSpecification', billingDuration: 'P1M', price: '249', priceCurrency: 'CZK' } },
    { '@type': 'Offer', name: 'Cosmatch+ kvartálně', price: '597', priceCurrency: 'CZK', availability: 'https://schema.org/InStock', url: URL, priceSpecification: { '@type': 'UnitPriceSpecification', billingDuration: 'P3M', price: '597', priceCurrency: 'CZK' } },
    { '@type': 'Offer', name: 'Cosmatch+ ročně', price: '1788', priceCurrency: 'CZK', availability: 'https://schema.org/InStock', url: URL, priceSpecification: { '@type': 'UnitPriceSpecification', billingDuration: 'P1Y', price: '1788', priceCurrency: 'CZK' } },
    { '@type': 'Offer', name: 'Cosmatch Serious měsíčně', price: '399', priceCurrency: 'CZK', availability: 'https://schema.org/InStock', url: URL, priceSpecification: { '@type': 'UnitPriceSpecification', billingDuration: 'P1M', price: '399', priceCurrency: 'CZK' } },
    { '@type': 'Offer', name: 'Cosmatch Serious kvartálně', price: '987', priceCurrency: 'CZK', availability: 'https://schema.org/InStock', url: URL, priceSpecification: { '@type': 'UnitPriceSpecification', billingDuration: 'P3M', price: '987', priceCurrency: 'CZK' } },
    { '@type': 'Offer', name: 'Cosmatch Serious ročně', price: '2988', priceCurrency: 'CZK', availability: 'https://schema.org/InStock', url: URL, priceSpecification: { '@type': 'UnitPriceSpecification', billingDuration: 'P1Y', price: '2988', priceCurrency: 'CZK' } },
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
