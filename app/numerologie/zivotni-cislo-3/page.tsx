
import type { Metadata } from 'next'
import Link from 'next/link'
import KarmicDebtCard from '@/components/KarmicDebtCard'
import { notFound } from 'next/navigation'
import { ARCHETYPES, type Archetype } from '../zivotni-cislo-1/data'

const LIFE_PATH_NUMBERS: string[] = ['1','2','3','4','5','6','7','8','9','11','22','33']





// Per-page metadata + canonical
export async function generateMetadata(): Promise<Metadata> {
  const number = '3'
  const a = ARCHETYPES[number]
  if (!a) return { title: 'Životní číslo — Cosmatch' }
  const TITLE = `Životní číslo ${number} — ${a.name} | Numerologie | Cosmatch`
  const DESC = `${a.short} Vlastnosti, kompatibilita, slavné osobnosti, význam v lásce a kariéře. Vypočítej si svoje životní číslo zdarma.`
  const URL = `https://cosmatch.cz/numerologie/zivotni-cislo-${number}`
  return {
    title: TITLE,
    description: DESC,
    alternates: { canonical: URL, languages: { 'cs-CZ': URL, 'x-default': URL } },
    openGraph: { title: TITLE, description: DESC, url: URL, type: 'article', siteName: 'Cosmatch', locale: 'cs_CZ' },
    twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
    keywords: [`životní číslo ${number}`, `číslo ${number} numerologie`, `${a.name.toLowerCase()} numerologie`, 'numerologie kompatibilita', 'životní cesta'],
    authors: [{ name: 'Simona Cibulková', url: 'https://cosmatch.cz' }],
  }
}

export default function LifePathPage() {
  const number = '3'
  const a: Archetype = ARCHETYPES[number]

  const URL = `https://cosmatch.cz/numerologie/zivotni-cislo-${number}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: `Životní číslo ${number} — ${a.name}`,
        description: a.short,
        author: { '@type': 'Person', name: 'Simona Cibulková', url: 'https://cosmatch.cz' },
        publisher: { '@type': 'Organization', name: 'Cosmatch', logo: { '@type': 'ImageObject', url: 'https://cosmatch.cz/icon-512.png' } },
        datePublished: '2026-05-16',
        dateModified: '2026-05-16',
        mainEntityOfPage: { '@type': 'WebPage', '@id': URL },
        inLanguage: 'cs-CZ',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Cosmatch', item: 'https://cosmatch.cz' },
          { '@type': 'ListItem', position: 2, name: 'Numerologie', item: 'https://cosmatch.cz/numerologie' },
          { '@type': 'ListItem', position: 3, name: `Životní číslo ${number} — ${a.name}`, item: URL },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `Co znamená životní číslo ${number}?`,
            acceptedAnswer: { '@type': 'Answer', text: a.short },
          },
          {
            '@type': 'Question',
            name: `S jakým číslem je ${number} nejvíce kompatibilní?`,
            acceptedAnswer: { '@type': 'Answer', text: `Životní číslo ${number} je nejvíce kompatibilní s čísly ${a.compatible.join(', ')}.` },
          },
          {
            '@type': 'Question',
            name: `Jaké jsou silné stránky životního čísla ${number}?`,
            acceptedAnswer: { '@type': 'Answer', text: a.traits_pos.join('. ') + '.' },
          },
          {
            '@type': 'Question',
            name: `Jak vypočítám svoje životní číslo?`,
            acceptedAnswer: { '@type': 'Answer', text: 'Sečti všechny číslice svého data narození. Pokud výsledek je vyšší než 9, redukuj dál, pokud to není master číslo 11, 22 nebo 33. Cosmatch má kalkulačku zdarma.' },
          },
        ],
      },
    ],
  }

  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link href="/numerologie" className="text-sm text-gray-500 hover:text-gray-900 transition">← Numerologie</Link>
      </div>

      <article className="max-w-2xl mx-auto px-6 pt-12 pb-24">

        {/* Hero */}
        <header className="mb-12">
          <p className="eyebrow text-pink-500 mb-6">Životní číslo {number}</p>
          <div className="flex items-baseline gap-6 mb-6">
            <div className="serif-display text-[6rem] sm:text-[8rem] text-pink-500 font-medium leading-none tabular-nums">{number}</div>
            <div>
              <h1 className="serif-display text-4xl sm:text-5xl text-gray-900 font-medium leading-tight tracking-tight">
                {a.name}
              </h1>
              <p className="text-gray-500 italic mt-2 text-[1.0625rem]">{a.tagline}</p>
            </div>
          </div>
          <hr className="rule w-12 border-gray-900 mb-8" />
          <p className="text-lg text-gray-800 leading-relaxed serif italic dropcap">
            {a.short}
          </p>
        </header>

        <KarmicDebtCard />

        {/* Vlastnosti */}
        <section className="mb-16">
          <p className="eyebrow text-pink-500 mb-4">Vlastnosti</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-8">
            Silné a slabé stránky čísla {number}.
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <p className="eyebrow text-emerald-600 mb-3">Silné stránky</p>
              <ul className="space-y-2">
                {a.traits_pos.map((t, i) => (
                  <li key={i} className="text-gray-800 leading-relaxed text-[1.0625rem]">— {t}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow text-gray-500 mb-3">Slabé stránky</p>
              <ul className="space-y-2">
                {a.traits_neg.map((t, i) => (
                  <li key={i} className="text-gray-600 leading-relaxed text-[1.0625rem]">— {t}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <hr className="rule mb-20" />

        {/* V lásce */}
        <section className="mb-16">
          <p className="eyebrow text-pink-500 mb-4">V lásce</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-8">
            S kým ti to bude fungovat.
          </h2>
          <p className="text-gray-800 leading-[1.75] text-[1.0625rem] mb-8">{a.love}</p>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="eyebrow text-emerald-600 mb-3">Nejlepší shoda</p>
              <div className="flex flex-wrap gap-2">
                {a.compatible.map(n => (
                  <Link key={n} href={`/numerologie/zivotni-cislo-${n}`}
                    className="serif-display text-3xl text-pink-500 border border-pink-200 hover:border-pink-500 rounded-2xl w-14 h-14 flex items-center justify-center font-medium transition">
                    {n}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="eyebrow text-gray-500 mb-3">Náročná dynamika</p>
              <div className="flex flex-wrap gap-2">
                {a.challenging.map(n => (
                  <Link key={n} href={`/numerologie/zivotni-cislo-${n}`}
                    className="serif-display text-3xl text-gray-500 border border-gray-300 hover:border-gray-700 rounded-2xl w-14 h-14 flex items-center justify-center font-medium transition">
                    {n}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <hr className="rule mb-20" />

        {/* Stín */}
        <section className="mb-16">
          <p className="eyebrow text-pink-500 mb-4">Stín</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">
            Lekce, kterou máš pochopit.
          </h2>
          <p className="text-gray-800 leading-[1.75] text-[1.0625rem]">{a.shadow}</p>
        </section>

        <hr className="rule mb-20" />

        {/* Kariéra */}
        <section className="mb-16">
          <p className="eyebrow text-pink-500 mb-4">Kariéra</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">
            V čem ti to půjde.
          </h2>
          <p className="text-gray-800 leading-[1.75] text-[1.0625rem]">{a.career}</p>
        </section>

        <hr className="rule mb-20" />

        {/* Slavné osobnosti */}
        <section className="mb-16">
          <p className="eyebrow text-pink-500 mb-4">Slavné osobnosti</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-8">
            Lidé s číslem {number}.
          </h2>
          <ul className="space-y-3">
            {a.celebrities.map((c, i) => (
              <li key={i} className="text-gray-800 leading-relaxed text-[1.0625rem] flex gap-4">
                <span className="serif text-pink-500 text-xl font-medium leading-none tabular-nums w-6">{(i+1).toString().padStart(2,'0')}</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section className="bg-white rounded-3xl border border-gray-100 p-10 mt-12">
          <p className="eyebrow text-pink-500 mb-4">Najdi svou shodu</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">
            Číslo {number} hledá svou {a.compatible[0]}, {a.compatible[1]} nebo {a.compatible[2]}.
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8 text-[1.0625rem]">
            Cosmatch je první česká seznamka, která tě s nimi propojí podle skutečné kompatibility.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/test" className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-full text-base font-medium hover:bg-gray-800 transition">
              Chci vypočítat mé životní číslo
            </Link>
            <Link href="/waitlist" className="inline-flex items-center justify-center text-gray-900 border border-gray-300 hover:border-gray-900 px-8 py-4 rounded-full text-base font-medium transition">
              Přidat se na waitlist
            </Link>
          </div>
        </section>

        {/* Related — other life numbers */}
        <section className="mt-20">
          <p className="eyebrow text-pink-500 mb-4">Další životní čísla</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-8">
            Prozkoumej zbylých 11 čísel.
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {LIFE_PATH_NUMBERS.filter(n => n !== number).map(n => (
              <Link key={n} href={`/numerologie/zivotni-cislo-${n}`}
                className="aspect-square flex flex-col items-center justify-center bg-white border border-gray-200 hover:border-gray-900 rounded-2xl transition group">
                <span className="serif-display text-2xl text-gray-700 group-hover:text-pink-500 transition font-medium tabular-nums">{n}</span>
                <span className="text-[10px] text-gray-400 mt-1 tracking-wider uppercase">{ARCHETYPES[n].name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 pt-12 border-t border-gray-200">
          <p className="text-xs text-gray-400 leading-relaxed">
            Cosmatch · Mgr. Ing. Simona Cibulková · IČO 08419531 · Praha 5, 2026.
            Numerologie není empirická věda — výsledky používejte jako podporu rozhodování, ne jako absolutní pravdu.
          </p>
        </footer>
      </article>
    </main>
  )
}
