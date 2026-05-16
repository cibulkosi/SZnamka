import type { Metadata } from 'next'

const TITLE = 'Demo profily — Jak vypadá Cosmatch | Cosmatch'
const DESC = 'Šest ukázkových profilů Cosmatch. Skutečné profily přibývají s otevřením bety v Praze.'
const URL = 'https://cosmatch.cz/demo'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL, languages: { 'cs-CZ': URL, 'x-default': URL } },
  openGraph: { title: TITLE, description: DESC, url: URL, type: 'website', siteName: 'Cosmatch', locale: 'cs_CZ' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
