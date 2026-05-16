import type { Metadata } from 'next'

const TITLE = 'Program ambasadorek — Buď tváří numerologické seznamky | Cosmatch'
const DESC = 'Hledáme 20 žen v Praze, Brně a Bratislavě, které věří, že správné spojení není algoritmus, ale data. Doživotní premium + odznak + privátní komunita.'
const URL = 'https://cosmatch.cz/ambasadorky'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL, languages: { 'cs-CZ': URL, 'x-default': URL } },
  openGraph: { title: TITLE, description: DESC, url: URL, type: 'website', siteName: 'Cosmatch', locale: 'cs_CZ' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
