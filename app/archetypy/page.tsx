import type { Metadata } from 'next'
import Link from 'next/link'
import { ARCHETYPES } from '@/app/numerologie/zivotni-cislo-1/data'

const ARCHETYPE_SLUGS: Array<[string, string]> = [
  ['1', 'prukopnik'], ['2', 'diplomat'], ['3', 'tvurce'], ['4', 'stavitel'],
  ['5', 'dobrodruh'], ['6', 'pecovatel'], ['7', 'hledac'], ['8', 'vudce'],
  ['9', 'idealista'], ['11', 'vizionar'], ['22', 'architekt'], ['33', 'lecitel'],
]

const TITLE = '12 numerologických archetypů | Cosmatch'
const DESC = 'Dvanáct numerologických archetypů podle životního čísla. Průkopník, Diplomat, Tvůrce a další — který jsi Ty?'
const URL = 'https://cosmatch.cz/archetypy/'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL, languages: { 'cs-CZ': URL, 'x-default': URL } },
  openGraph: { title: TITLE, description: DESC, url: URL, type: 'website', siteName: 'Cosmatch', locale: 'cs_CZ' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
  keywords: ['numerologické archetypy', 'životní číslo', 'numerologie', '12 archetypů', 'cosmatch'],
}

export default function ArchetypesIndex() {
  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <div className="max-w-3xl mx-auto px-6 pt-6 pb-24">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">
          ← Cosmatch
        </Link>

        <div className="pt-12 mb-12">
          <p className="eyebrow text-pink-500 mb-4">Numerologie</p>
          <h1 className="serif-display text-5xl sm:text-6xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            12 <em className="italic">archetypů</em>.
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            Každé datum narození vede k jednomu z dvanácti numerologických archetypů.
            Najdi ten svůj — a sdílej s kamarády.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ARCHETYPE_SLUGS.map(([num, slug]) => {
            const a = ARCHETYPES[num]
            if (!a) return null
            return (
              <Link
                key={slug}
                href={`/archetypy/${slug}/`}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-pink-500 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="serif-display text-5xl font-medium text-pink-500 leading-none">
                    {num}
                  </div>
                  <div className="flex-1">
                    <h3 className="serif-display text-2xl text-gray-900 font-medium leading-tight mb-1">
                      <em className="italic">{a.name}</em>
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {a.short}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <hr className="rule my-12" />

        <div className="bg-white rounded-3xl p-8 border border-gray-100 text-center">
          <p className="eyebrow text-pink-500 mb-3">Zjisti svůj archetyp</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight mb-3">
            Spočítáme Ti ho za 30 sekund.
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6 text-[1.0625rem]">
            Zadej datum narození a uvidíš svůj numerologický archetyp z 12 možných.
            Zdarma. Bez registrace.
          </p>
          <Link
            href="/test/"
            className="inline-block bg-gray-900 text-white px-10 py-5 rounded-full text-base font-medium hover:bg-gray-800 active:scale-[0.99] transition-all"
          >
            Spustit kvíz
          </Link>
        </div>
      </div>
    </main>
  )
}
