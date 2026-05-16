import type { Metadata } from 'next'

const TITLE = 'Waitlist — Buď u toho jako první | Cosmatch'
const DESC = 'První 1 000 členů Cosmatch waitlistu dostane voucher na 3 měsíce Cosmatch+ zdarma. Spouštíme v Praze, pak Brno a Bratislava.'
const URL = 'https://cosmatch.cz/waitlist'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL, languages: { 'cs-CZ': URL, 'x-default': URL } },
  openGraph: { title: TITLE, description: DESC, url: URL, type: 'website', siteName: 'Cosmatch', locale: 'cs_CZ' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
  keywords: ['cosmatch waitlist', 'seznamka praha', 'numerologická seznamka', 'česká seznamka'],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
