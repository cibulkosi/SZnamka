import type { Metadata } from 'next'

const TITLE = 'Předplatné Cosmatch — Free, Cosmatch+ a Serious | Cosmatch'
const DESC = 'Tři úrovně: Free (zdarma), Cosmatch+ za 149 Kč/měs (neomezené swipy + hloubková analýza), Serious za 349 Kč/měs s povinnou ID verifikací. Bez reklam, bez prodávání dat.'
const URL = 'https://cosmatch.cz/premium'

const FAQS = [
  {
    q: 'Mohu předplatné kdykoli zrušit?',
    a: 'Ano, zrušení je v profilu jedním klikem. Zbývající dny ti zůstanou aktivní.',
  },
  {
    q: 'Jak se platí Cosmatch+?',
    a: 'Platbu zpracovává Paddle — přijímá Visa, Mastercard, Apple Pay i Google Pay. EU faktura s DPH automaticky.',
  },
  {
    q: 'Co se stane když přejdu z Plus na Serious?',
    a: 'Doplatíš jen rozdíl za zbývající dny. Automaticky se zapne ID verifikace.',
  },
  {
    q: 'Vrátíte peníze pokud nebudu spokojen?',
    a: 'Do 14 dnů ano, bez vysvětlení. Po 14 dnech vyhodnocujeme případ od případu.',
  },
  {
    q: 'Je ID verifikace povinná pro Cosmatch Serious?',
    a: 'Ano. Pokud ji nedokončíš do 7 dnů od platby, peníze vrátíme zpět.',
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
      {children}
    </>
  )
}
