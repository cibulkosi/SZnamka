import type { Metadata } from 'next'

const TITLE = 'Numerologický kvíz — Zjisti svůj archetyp za 30 sekund | Cosmatch'
const DESC = 'Zadej datum narození a okamžitě zjistíš svůj numerologický archetyp z 12 možných. Zdarma, bez registrace, výsledek za 30 sekund. Postaveno na knize The Power of Birthdays.'
const URL = 'https://cosmatch.cz/test'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL, languages: { 'cs-CZ': URL, 'x-default': URL } },
  openGraph: { title: TITLE, description: DESC, url: URL, type: 'website', siteName: 'Cosmatch', locale: 'cs_CZ' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
  keywords: ['numerologický kvíz', 'životní číslo kvíz', 'numerologie zdarma', 'datum narození kalkulačka', 'numerologický profil'],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
