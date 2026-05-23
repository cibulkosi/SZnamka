import type { Metadata } from 'next'
import Link from 'next/link'
import { LIFE_PATH_NUMBERS } from './zivotni-cislo-1/data'

const TITLE = 'Numerologie — Životní čísla, kompatibilita a master čísla | Cosmatch'
const DESC = 'Kompletní průvodce numerologií v češtině. 12 životních čísel, kompatibilita partnerů, master čísla, numerologická mřížka. Postaveno na knize The Power of Birthdays a české tradici Jitky Kadlecové.'
const URL = 'https://cosmatch.cz/numerologie'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL, languages: { 'cs-CZ': URL, 'x-default': URL } },
  openGraph: { title: TITLE, description: DESC, url: URL, type: 'website', siteName: 'Cosmatch', locale: 'cs_CZ' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
  keywords: ['numerologie', 'numerologie zdarma', 'numerologie výpočet', 'životní číslo', 'numerologie kompatibilita', 'numerologie partner', 'master čísla'],
  authors: [{ name: 'Simona Cibulková' }],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: TITLE,
      description: DESC,
      author: { '@type': 'Person', name: 'Simona Cibulková' },
      publisher: { '@type': 'Organization', name: 'Cosmatch', logo: { '@type': 'ImageObject', url: 'https://cosmatch.cz/icon-512.png' } },
      datePublished: '2026-05-16', dateModified: '2026-05-23',
      mainEntityOfPage: { '@type': 'WebPage', '@id': URL },
      inLanguage: 'cs-CZ',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Cosmatch', item: 'https://cosmatch.cz' },
        { '@type': 'ListItem', position: 2, name: 'Numerologie', item: URL },
      ],
    },
  ],
}

// Per-page custom taglines (override ARCHETYPES.tagline pro hub view)
const HUB_TAGLINES: Record<string, { name: string; tagline: string }> = {
  '1':  { name: 'Průkopník',   tagline: 'Nezávislý, ambiciózní, leader.' },
  '2':  { name: 'Diplomat',    tagline: 'Empatický, intuitivní, vyhledávající harmonii.' },
  '3':  { name: 'Tvůrce',      tagline: 'Charismatický a expresivní člověk, který je plný energie.' },
  '4':  { name: 'Stavitel',    tagline: 'Spolehlivý, systematický, věrný.' },
  '5':  { name: 'Dobrodruh',   tagline: 'Svobodný duch, milovník změny.' },
  '6':  { name: 'Pečovatel',   tagline: 'Láskyplný, zodpovědný, orientovaný na rodinu.' },
  '7':  { name: 'Hledač',      tagline: 'Analytický, hloubavý, spirituální.' },
  '8':  { name: 'Vůdce',       tagline: 'Ambiciózní, mocný, orientovaný na výsledky.' },
  '9':  { name: 'Idealista',   tagline: 'Velkorysý, soucitný, globálně orientovaný.' },
  '11': { name: 'Vizionář',    tagline: 'Mistrovské číslo — intuice a inspirace.' },
  '22': { name: 'Architekt',   tagline: 'Mistrovské číslo — stavitel světů.' },
  '33': { name: 'Léčitel', tagline: 'Mistrovské číslo — léčitel, který soucítí.' },
}

export default function NumerologiePillarPage() {
  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">← Cosmatch</Link>
      </div>

      <article className="max-w-2xl mx-auto px-6 pt-16 pb-24">

        <header className="mb-16">
          <p className="eyebrow text-pink-500 mb-6">Průvodce · 8 min čtení</p>
          <h1 className="serif-display text-5xl sm:text-6xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-8">
            Průvodce<br/><em className="italic text-pink-500">numerologie</em>.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-8" />
          <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
            Numerologie je systém interpretace čísel s tisíciletou tradicí. V Cosmatch ji používáme
            jako součást výpočtu kompatibility mezi dvěma daty narození.
          </p>
        </header>

        {/* Co je numerologie */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Základ</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            Co je numerologie?
          </h2>
          <p className="text-gray-800 leading-[1.75] text-[1.0625rem] dropcap mb-4">
            Numerologie je studium symbolického významu čísel a jejich vlivu na osobnost,
            vztahy a životní cestu. Její moderní podoba se připisuje Pythagorovi (6. století př. n. l.),
            který tvrdil, že vesmír funguje podle matematických principů.
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
            Cosmatch numerologii neprezentuje jako vědu, ale jako framework pro sebepoznání.
            Dává Ti strukturu, jak lépe rozumět vlastním vzorcům ve vztazích.
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">
            <strong className="text-gray-900 font-medium">43 % uživatelů internetu v Česku</strong> věří horoskopům, mezi uživatelkami internetu je to <strong className="text-gray-900 font-medium">56 %</strong> (Nielsen Admosphere).
            Numerologie má v Česku silný kulturní rámec a Cosmatch je první aplikace, která ho propojí s reálnou seznamkou.
          </p>
        </section>

        <hr className="rule mb-16" />

        {/* 12 životních čísel */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">12 archetypů</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-8">
            Životní čísla.
          </h2>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-8">
            Tvoje životní číslo získáš součtem všech číslic data narození, redukovaným na jedno číslo
            (nebo master číslo 11, 22, 33). Příklad: 23. 7. 1992 → 2+3+7+1+9+9+2 = 33.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {LIFE_PATH_NUMBERS.map(n => {
              const a = HUB_TAGLINES[n]
              return (
                <Link key={n} href={`/numerologie/zivotni-cislo-${n}`}
                  className="bg-white border border-gray-200 hover:border-gray-900 rounded-2xl p-5 transition group">
                  <div className="serif-display text-3xl text-pink-500 font-medium tabular-nums leading-none mb-2">{n}</div>
                  <p className="serif text-base text-gray-900 group-hover:text-pink-500 font-medium leading-tight transition">{a.name}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-tight">{a.tagline}</p>
                </Link>
              )
            })}
          </div>
        </section>

        <hr className="rule mb-16" />

        {/* Další pillar pages */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Hlubší témata</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-8">
            Zajímá Tě to? Čti dále…
          </h2>
          <div className="space-y-4">
            {[
              ['/numerologie/jak-pocitame', 'Jak se počítá životní číslo', 'Decoz metoda, historie od Balliett (1908), srovnání tří numerologických škol a výpočet krok za krokem.'],
              ['/numerologie/master-cisla-11-22-33', 'Master čísla 11, 22, 33', 'Mistrovská čísla, která mají jen ~4 % populace. Intenzivnější vibrace, hlubší lekce.'],
              ['/numerologie/numerologicka-mrizka', 'Numerologická mřížka', 'Co znamenají chybějící čísla v Tvém datu narození a jak je doplnit.'],
              ['/kompatibilita-podle-data-narozeni', 'Kompatibilita podle data narození', 'Jak se počítá vztahová kompatibilita ze dvou dat narození.'],
              ['/numerologie-vztahy', 'Numerologie a vztahy', 'Článek o tom, proč se přitahuješ ke stejnému typu lidí.'],
              ['/jak-funguje-cosmatch', 'Jak funguje Cosmatch', 'Algoritmus, zdroje, metodologie.'],
            ].map(([href, title, desc]) => (
              <Link key={href} href={href}
                className="block bg-white border border-gray-200 hover:border-gray-900 rounded-2xl p-6 transition group">
                <h3 className="serif text-xl text-gray-900 font-medium mb-1 group-hover:text-pink-500 transition">{title} →</h3>
                <p className="text-gray-600 text-[0.95rem] leading-relaxed">{desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white rounded-3xl border border-gray-100 p-10">
          <p className="eyebrow text-pink-500 mb-4">Začni u sebe</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">
            Zjisti své životní číslo za pár sekund.
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8 text-[1.0625rem]">
            Zadej datum narození a dozvíš se svůj numerologický archetyp.
          </p>
          <Link href="/test" className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-full text-base font-medium hover:bg-gray-800 transition">
            Spustit kvíz
          </Link>
        </section>

        <footer className="mt-16 pt-12 border-t border-gray-200">
          <p className="text-xs text-gray-400 leading-relaxed">
            Cosmatch · Mgr. Ing. Simona Cibulková · IČO 08419531 · Praha 5, 2026.
          </p>
        </footer>
      </article>
    </main>
  )
}
