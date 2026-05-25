import type { Metadata } from 'next'
import Link from 'next/link'
import { ARCHETYPES } from '@/app/numerologie/zivotni-cislo-1/data'

const NUMBER = '9'
const SLUG = 'idealista'

export async function generateMetadata(): Promise<Metadata> {
  const a = ARCHETYPES[NUMBER]
  const TITLE = `${a.name} — numerologický archetyp ${NUMBER} | Cosmatch`
  const DESC = `${a.short} Sdílej svůj archetyp s kamarády.`
  const URL = `https://cosmatch.cz/archetypy/${SLUG}/`
  const OG = `https://cosmatch.cz/og/archetypy/${SLUG}.png`
  return {
    title: TITLE,
    description: DESC,
    alternates: { canonical: URL, languages: { 'cs-CZ': URL, 'x-default': URL } },
    openGraph: {
      title: TITLE,
      description: DESC,
      url: URL,
      type: 'article',
      siteName: 'Cosmatch',
      locale: 'cs_CZ',
      images: [{ url: OG, width: 1200, height: 630, alt: `${a.name} — Cosmatch numerologický archetyp` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: TITLE,
      description: DESC,
      images: [OG],
    },
    keywords: [`${a.name.toLowerCase()} archetyp`, `numerologie ${NUMBER}`, 'životní číslo', 'numerologický archetyp', 'cosmatch'],
    authors: [{ name: 'Simona Cibulková', url: 'https://cosmatch.cz' }],
  }
}

export default function ArchetypePermalink() {
  const a = ARCHETYPES[NUMBER]

  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <div className="max-w-2xl mx-auto px-6 pt-6 pb-24">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">
          ← Cosmatch
        </Link>

        <div className="pt-12">
          <p className="eyebrow text-pink-500 mb-4">Numerologický archetyp {NUMBER}</p>
          <div className="serif-display text-[7rem] sm:text-[9rem] font-medium leading-none mb-2"
               style={{ color: '#ec4899' }}>
            {NUMBER}
          </div>
          <h1 className="serif-display text-5xl sm:text-6xl text-gray-900 font-medium leading-tight tracking-tight mb-4">
            <em className="italic">{a.name}</em>
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">{a.short}</p>
        </div>

        <hr className="rule my-12" />

        <section className="mb-10">
          <p className="eyebrow text-gray-500 mb-3">Kdo je {a.name}</p>
          <p className="text-gray-800 leading-[1.75] text-[1.0625rem] dropcap">
            {a.description}
          </p>
        </section>

        <section className="mb-10">
          <p className="eyebrow text-gray-500 mb-3">V lásce</p>
          <p className="text-gray-800 leading-[1.75] text-[1.0625rem]">
            {a.love}
          </p>
        </section>

        <section className="mb-10">
          <p className="eyebrow text-gray-500 mb-3">Stín</p>
          <p className="text-gray-800 leading-[1.75] text-[1.0625rem]">
            {a.shadow}
          </p>
        </section>

        {a.compatible && a.compatible.length > 0 && (
          <section className="mb-10">
            <p className="eyebrow text-gray-500 mb-3">Kompatibilní archetypy</p>
            <div className="flex gap-3">
              {a.compatible.map(n => (
                <div
                  key={n}
                  className="serif-display text-3xl font-medium text-gray-900 border border-gray-300 rounded-2xl w-14 h-14 flex items-center justify-center"
                >
                  {n}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="bg-white rounded-3xl p-8 border border-gray-100 mt-10">
          <p className="eyebrow text-pink-500 mb-3">Zjisti svůj vlastní archetyp</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight mb-3">
            Spočítáme Ti ho za 30 sekund.
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6 text-[1.0625rem]">
            Zadej datum narození a uvidíš svůj numerologický archetyp z 12 možných.
            Zdarma. Bez registrace.
          </p>
          <Link
            href="/test/"
            className="block w-full bg-gray-900 text-white py-5 rounded-full text-base font-medium hover:bg-gray-800 active:scale-[0.99] transition-all text-center"
          >
            Spustit kvíz
          </Link>
        </div>

        <hr className="rule my-12" />

        <div className="text-center">
          <Link
            href={`/numerologie/zivotni-cislo-${NUMBER}/`}
            className="text-sm text-gray-500 hover:text-gray-900 transition"
          >
            Detailní průvodce životním číslem {NUMBER} →
          </Link>
        </div>
      </div>
    </main>
  )
}
