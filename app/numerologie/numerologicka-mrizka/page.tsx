
import type { Metadata } from 'next'
import Link from 'next/link'

const TITLE = 'Numerologická mřížka — Co znamenají chybějící čísla v datu narození | Cosmatch'
const DESC = 'Numerologická mřížka (Pythagorova) odhalí, která čísla ti v datu narození chybí — a tím i charakterové rysy, které musíš v životě vědomě budovat. Praktický průvodce.'
const URL = 'https://cosmatch.cz/numerologie/numerologicka-mrizka'

export const metadata: Metadata = {
  title: TITLE, description: DESC,
  alternates: { canonical: URL, languages: { 'cs-CZ': URL, 'x-default': URL } },
  openGraph: { title: TITLE, description: DESC, url: URL, type: 'article', siteName: 'Cosmatch', locale: 'cs_CZ' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
  keywords: ['numerologická mřížka', 'pythagorova mřížka', 'chybějící čísla numerologie', 'numerologie výpočet', 'datum narození čísla'],
}

const NUMBER_MEANINGS = [
  ['1', 'Nezávislost a vůle', 'Pokud chybí: nedostatek průbojnosti. Pokud dominuje: tendence k egoismu.'],
  ['2', 'Empatie a partnerství', 'Pokud chybí: obtížné navazování blízkosti. Pokud dominuje: závislost na ostatních.'],
  ['3', 'Kreativita a komunikace', 'Pokud chybí: problém s vyjádřením. Pokud dominuje: povrchnost.'],
  ['4', 'Disciplína a stabilita', 'Pokud chybí: chaos v každodennosti. Pokud dominuje: rigidita.'],
  ['5', 'Adaptabilita a svoboda', 'Pokud chybí: strach ze změny. Pokud dominuje: neschopnost závazku.'],
  ['6', 'Zodpovědnost a péče', 'Pokud chybí: sobectví. Pokud dominuje: oběť pro druhé.'],
  ['7', 'Hloubka a analýza', 'Pokud chybí: povrchní myšlení. Pokud dominuje: izolace.'],
  ['8', 'Moc a materiální úspěch', 'Pokud chybí: finanční nestabilita. Pokud dominuje: workoholismus.'],
  ['9', 'Soucit a velkorysost', 'Pokud chybí: malicherství. Pokud dominuje: naivita.'],
]

export default function NumerologickaMrizkaPage() {
  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Article',
        headline: TITLE, description: DESC,
        author: { '@type': 'Person', name: 'Simona Cibulková' },
        publisher: { '@type': 'Organization', name: 'Cosmatch', logo: { '@type': 'ImageObject', url: 'https://cosmatch.cz/icon-512.png' } },
        datePublished: '2026-05-16', dateModified: '2026-05-16',
        inLanguage: 'cs-CZ',
      })}} />

      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link href="/numerologie" className="text-sm text-gray-500 hover:text-gray-900 transition">← Numerologie</Link>
      </div>

      <article className="max-w-2xl mx-auto px-6 pt-16 pb-24">
        <header className="mb-16">
          <p className="eyebrow text-pink-500 mb-6">Pokročilá numerologie</p>
          <h1 className="serif-display text-5xl sm:text-6xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-8">
            Numerologická<br/><em className="italic text-pink-500">mřížka</em>.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-8" />
          <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
            Mřížka odhalí, která čísla ti v datu narození chybí — a tím i charakterové rysy,
            které musíš v životě vědomě budovat.
          </p>
        </header>

        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Co to je</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            Pythagorova mřížka.
          </h2>
          <p className="text-gray-800 leading-[1.75] text-[1.0625rem] dropcap mb-4">
            Pythagorova mřížka je matice 3×3, do které zapíšeš všechny číslice svého data narození. Každé číslo (1–9) má svou specifickou pozici a znamená určitou charakterovou vlastnost.
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
            Příklad: datum narození <strong className="text-gray-900 font-medium">23. 7. 1992</strong>. Cifry: 2, 3, 7, 1, 9, 9, 2.
          </p>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
            <div className="grid grid-cols-3 gap-2 text-center serif-display text-2xl text-gray-900 font-medium">
              <div className="bg-gray-50 p-4 rounded">1<span className="block text-xs text-gray-500 mt-1">(1×)</span></div>
              <div className="bg-gray-50 p-4 rounded">2 2<span className="block text-xs text-gray-500 mt-1">(2×)</span></div>
              <div className="bg-gray-50 p-4 rounded">3<span className="block text-xs text-gray-500 mt-1">(1×)</span></div>
              <div className="bg-gray-100 p-4 rounded text-gray-400">—<span className="block text-xs mt-1">(chybí 4)</span></div>
              <div className="bg-gray-100 p-4 rounded text-gray-400">—<span className="block text-xs mt-1">(chybí 5)</span></div>
              <div className="bg-gray-100 p-4 rounded text-gray-400">—<span className="block text-xs mt-1">(chybí 6)</span></div>
              <div className="bg-gray-50 p-4 rounded">7<span className="block text-xs text-gray-500 mt-1">(1×)</span></div>
              <div className="bg-gray-100 p-4 rounded text-gray-400">—<span className="block text-xs mt-1">(chybí 8)</span></div>
              <div className="bg-gray-50 p-4 rounded">9 9<span className="block text-xs text-gray-500 mt-1">(2×)</span></div>
            </div>
          </div>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">
            Tomuto datu chybí čísla 4, 5, 6, 8 — což znamená, že daný člověk musí v životě vědomě budovat disciplínu (4), schopnost adaptace (5), zodpovědnost ke druhým (6) a materiální stabilitu (8).
          </p>
        </section>

        <hr className="rule mb-16" />

        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Význam čísel</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-8">
            Co každé číslo znamená.
          </h2>
          <div className="space-y-5">
            {NUMBER_MEANINGS.map(([n, title, body]) => (
              <div key={n} className="grid grid-cols-[auto,1fr] gap-6 pb-5 border-b border-gray-200 last:border-b-0">
                <div className="serif-display text-3xl text-pink-500 font-medium leading-none tabular-nums">{n}</div>
                <div>
                  <h3 className="serif text-lg text-gray-900 font-medium mb-1">{title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-gray-100 p-10">
          <p className="eyebrow text-pink-500 mb-4">Spočítej si</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">
            Jaké jsou tvoje chybějící čísla?
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8 text-[1.0625rem]">
            Zadej datum narození a Cosmatch ti vypočítá životní číslo + ukáže, která čísla ti v datu chybí.
          </p>
          <Link href="/test" className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-full text-base font-medium hover:bg-gray-800 transition">
            Spustit kvíz
          </Link>
        </section>
      </article>
    </main>
  )
}
