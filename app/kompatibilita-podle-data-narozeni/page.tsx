
import Link from 'next/link'
import type { Metadata } from 'next'

const TITLE = 'Kompatibilita podle data narození — Numerologie a vztahy | Cosmatch'
const DESCRIPTION = 'Jak data narození ovlivňují kompatibilitu ve vztazích? Zjisti svůj numerologický profil a najdi lidi, kteří ti opravdu odpovídají. Životní číslo, master čísla a 46 949 párů kompatibility.'
const URL = 'https://cosmatch.cz/kompatibilita-podle-data-narozeni'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'kompatibilita data narození',
    'numerologie vztahy',
    'životní číslo kompatibilita',
    'datum narození láska',
    'numerologie partner',
    'numerologický profil',
    'numerologie kalkulačka',
    'master čísla',
    'čísla osudu',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    type: 'article',
    siteName: 'Cosmatch',
    locale: 'cs_CZ',
    images: [{ url: 'https://cosmatch.cz/icon-512.png', width: 512, height: 512, alt: 'Cosmatch' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
  authors: [{ name: 'Simona Cibulková', url: 'https://cosmatch.cz' }],
}

const NUMBERS = [
  ['1', 'Průkopník', '3, 5, 6', '4, 8'],
  ['2', 'Diplomat', '4, 6, 8', '5, 9'],
  ['3', 'Tvůrce', '1, 5, 9', '4, 7'],
  ['4', 'Stavitel', '2, 6, 8', '3, 5'],
  ['5', 'Dobrodruh', '1, 3, 7', '2, 4'],
  ['6', 'Pečovatel', '2, 4, 9', '1, 7'],
  ['7', 'Mudrc', '5, 9, 11', '3, 6'],
  ['8', 'Vůdce', '2, 4, 6', '1, 9'],
  ['9', 'Idealista', '3, 6, 9', '2, 8'],
] as const

const FAQ = [
  {
    q: 'Jak se počítá životní číslo z data narození?',
    a: 'Životní číslo (číslo cesty) získáš součtem všech číslic svého data narození, redukovaným na jednociferné číslo nebo master číslo 11, 22, 33. Příklad: 23. 7. 1992 → 2+3+7+1+9+9+2 = 33. Takový člověk má master číslo 33.',
  },
  {
    q: 'Jaká čísla jsou nejkompatibilnější?',
    a: 'Záleží na konkrétní kombinaci. Obecně: 1 ladí s 3, 5 a 6; 2 s 4, 6 a 8; 4 s 2, 6 a 8. Master čísla 11, 22, 33 mají nejsilnější spojení s 2, 6 a 9. Cosmatch toto počítá pro všech 46 949 párů.',
  },
  {
    q: 'Je numerologie vědecky prokázána?',
    a: 'Numerologie není empirická věda — je to systém interpretace čísel s tisíciletou tradicí. Cosmatch ji používá jako strukturovaný framework pro sebepoznání a matchmaking, ne jako absolutní pravdu.',
  },
  {
    q: 'Čím se Cosmatch liší od horoskopu?',
    a: 'Horoskopy jsou obecné — jeden text pro jednu dvanáctinu populace. Cosmatch počítá kompatibilitu pro 46 949 konkrétních kombinací dat narození. Navíc zohledňuje záměr vztahu, aktivitu a společné zájmy — nejde jen o datum.',
  },
  {
    q: 'Mohu najít svého partnera díky numerologii?',
    a: 'Numerologie pomáhá pochopit, s jakými typy lidí přirozeně rezonuješ — a kde jsou třecí plochy. Cosmatch tohle propojuje s reálnými profily skutečných lidí ve tvém okolí. Finální slovo má vždy tvoje srdce.',
  },
]

const TOC = [
  ['#zaklad', 'Co je životní číslo'],
  ['#prehled', 'Přehled čísel a shod'],
  ['#ceska-data', 'Co o nás Češích říkají data'],
  ['#faq', 'Časté otázky'],
] as const

const RELATED = [
  {
    href: '/numerologie-vztahy',
    eyebrow: 'Esej',
    title: 'Numerologie a vztahy — Jak čísla ovlivňují lásku',
    desc: 'Praktický průvodce tím, jak životní číslo ovlivňuje partnerský výběr, komunikaci a dlouhodobou kompatibilitu.',
  },
  {
    href: '/test',
    eyebrow: 'Nástroj',
    title: 'Numerologický kvíz',
    desc: 'Zadej datum narození a za 30 sekund zjistíš svůj archetyp.',
  },
  {
    href: '/manifest-duvery',
    eyebrow: 'Manifest',
    title: 'Sedm závazků Cosmatch',
    desc: 'Co Cosmatch nedělá a co naopak slibuje — žádné swipy pro swipy, žádné reklamy, žádné prodávání dat.',
  },
] as const

const READING_TIME_MIN = 6

export default function KompatibilitaPage() {
  // JSON-LD structured data for FAQ + Article
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: TITLE,
        description: DESCRIPTION,
        image: 'https://cosmatch.cz/icon-512.png',
        author: { '@type': 'Person', name: 'Simona Cibulková' },
        publisher: {
          '@type': 'Organization',
          name: 'Cosmatch',
          logo: { '@type': 'ImageObject', url: 'https://cosmatch.cz/icon-512.png' },
        },
        datePublished: '2026-05-16',
        dateModified: '2026-05-16',
        mainEntityOfPage: { '@type': 'WebPage', '@id': URL },
        inLanguage: 'cs-CZ',
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Cosmatch', item: 'https://cosmatch.cz' },
          { '@type': 'ListItem', position: 2, name: 'Kompatibilita podle data narození', item: URL },
        ],
      },
    ],
  }

  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">← Cosmatch</Link>
      </div>

      <article className="max-w-2xl mx-auto px-6 pt-16 pb-24">

        {/* Masthead */}
        <header className="mb-12">
          <p className="eyebrow text-pink-500 mb-6">Průvodce · {READING_TIME_MIN} min čtení</p>
          <h1 className="serif-display text-5xl sm:text-6xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-8">
            Kompatibilita<br/>podle <em className="italic text-pink-500">data narození</em>.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-8" />
          <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
            Numerologie tvrdí, že datum tvého narození není náhoda — a má svou roli v tom, s kým
            se přirozeně shodneš ve vztazích. Cosmatch tuto teorii aplikuje na všech 46 949 párů.
          </p>
          <p className="text-sm text-gray-500 mt-6">
            Autorka <span className="text-gray-900 italic serif">Simona Cibulková</span>
            <span className="text-gray-300 mx-2">·</span>
            <span>Praha, květen 2026</span>
          </p>
        </header>

        {/* TOC */}
        <nav className="mb-16 border-y border-gray-200 py-6" aria-label="Obsah článku">
          <p className="eyebrow text-gray-500 mb-3">Obsah</p>
          <ul className="space-y-1.5">
            {TOC.map(([href, label], i) => (
              <li key={href}>
                <a href={href} className="text-gray-700 hover:text-pink-500 transition flex items-baseline gap-3">
                  <span className="text-xs text-gray-400 tabular-nums w-6">{String(i+1).padStart(2,'0')}</span>
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Section 1: Co je životní číslo */}
        <section id="zaklad" className="mb-16 scroll-mt-8">
          <p className="eyebrow text-gray-500 mb-4">Základ</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-8">
            Co je životní číslo?
          </h2>
          <p className="text-gray-800 leading-[1.75] text-[1.0625rem] dropcap mb-6">
            Životní číslo (číslo životní cesty) je základem numerologie. Získáš ho součtem všech číslic
            svého data narození, opakovaně redukovaným na jednociferné číslo. Existuje devět základních
            čísel (1–9) a tři master čísla (11, 22, 33).
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-6">
            Každé číslo odpovídá určitému archetypu osobnosti — Průkopník, Diplomat, Tvůrce, Stavitel,
            Dobrodruh, Pečovatel, Mudrc, Vůdce, Idealista. Master čísla jsou Vizionář (11),
            Architekt (22) a Mistr lásky (33).
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">
            Kompatibilita se počítá z kombinace dvou životních čísel — spolu se záměrem vztahu,
            aktivitou a společnými zájmy.
          </p>
        </section>

        <hr className="rule mb-16" />

        {/* Section 2: Přehled */}
        <section id="prehled" className="mb-16 scroll-mt-8">
          <p className="eyebrow text-gray-500 mb-4">Přehled</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-10">
            Čísla a jejich shody.
          </h2>

          <div className="space-y-5">
            {NUMBERS.map(([n, name, good, hard]) => (
              <div key={n} className="grid grid-cols-[auto,1fr] gap-6 sm:gap-8 pb-5 border-b border-gray-200 last:border-b-0">
                <div className="serif-display text-4xl text-pink-500 font-medium leading-none tabular-nums">{n}</div>
                <div>
                  <h3 className="serif text-xl text-gray-900 font-medium mb-2">{name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    <span className="text-gray-900 font-medium">Silná shoda:</span> {good}
                    <span className="text-gray-300 mx-2">·</span>
                    <span className="text-gray-500">Náročná: {hard}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-6 leading-relaxed">
            Zjednodušený přehled. Cosmatch počítá vícevrstvý skór pro každou konkrétní kombinaci dat.
          </p>
        </section>

        {/* Section 2b: Co o nás Češích říkají data */}
        <section id="ceska-data" className="mb-16 scroll-mt-8">
          <p className="eyebrow text-gray-500 mb-4">Český kontext</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-10">
            Co o nás Češích říkají data.
          </h2>

          <div className="space-y-8">
            <div className="grid grid-cols-[auto,1fr] gap-6 sm:gap-8 pb-8 border-b border-gray-200">
              <div className="serif-display text-4xl text-pink-500 font-medium tabular-nums">96 %</div>
              <div>
                <p className="text-gray-800 leading-[1.75] text-[1.0625rem] font-medium mb-1">
                  českých žen 18–29 let považuje hledání partnera za obtížné.
                </p>
                <p className="text-xs text-gray-400">STEM/MARK, srpen 2025 · n = 504</p>
              </div>
            </div>

            <div className="grid grid-cols-[auto,1fr] gap-6 sm:gap-8 pb-8 border-b border-gray-200">
              <div className="serif-display text-4xl text-pink-500 font-medium tabular-nums">43 %</div>
              <div>
                <p className="text-gray-800 leading-[1.75] text-[1.0625rem] font-medium mb-1">
                  online Čechů věří horoskopům. Mezi ženami stoupá na 56 %.
                </p>
                <p className="text-xs text-gray-400">Nielsen Admosphere, 2017</p>
              </div>
            </div>

            <div className="grid grid-cols-[auto,1fr] gap-6 sm:gap-8 pb-8 border-b border-gray-200">
              <div className="serif-display text-4xl text-pink-500 font-medium tabular-nums">43 %</div>
              <div>
                <p className="text-gray-800 leading-[1.75] text-[1.0625rem] font-medium mb-1">
                  Čechů věří v osud. 44 % v existenci duše. Třetina v karmu.
                </p>
                <p className="text-xs text-gray-400">Pew Research Center, CEE 2017</p>
              </div>
            </div>

            <div className="grid grid-cols-[auto,1fr] gap-6 sm:gap-8">
              <div className="serif-display text-4xl text-pink-500 font-medium tabular-nums">66 %</div>
              <div>
                <p className="text-gray-800 leading-[1.75] text-[1.0625rem] font-medium mb-1">
                  Čechů ve věku 27–35 let už někdy použilo seznamovací aplikaci.
                  Jen čtvrtina za ni zaplatila.
                </p>
                <p className="text-xs text-gray-400">Visa &times; Instant Research, únor 2026</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mt-10 italic">
            Tahle čísla jsou český kontext — ne extrapolace z USA. Cosmatch staví na nich.
          </p>
        </section>

        <hr className="rule mb-16" />

        {/* Section 3: FAQ */}
        <section id="faq" className="mb-16 scroll-mt-8">
          <p className="eyebrow text-gray-500 mb-4">Časté otázky</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-10">
            Co se nejčastěji ptáte.
          </h2>

          <div className="space-y-10">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="border-b border-gray-200 pb-10 last:border-b-0 group" open>
                <summary className="serif text-xl text-gray-900 font-medium leading-tight mb-3 cursor-pointer list-none">
                  {q}
                </summary>
                <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white rounded-3xl border border-gray-100 p-10 mt-12">
          <p className="eyebrow text-pink-500 mb-4">Vyzkoušej</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">
            Zjisti svůj archetyp za 30 sekund.
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8 text-[1.0625rem]">
            Zadej datum narození a okamžitě uvidíš svůj numerologický profil a nejlepší shody.
            Bez registrace, zdarma.
          </p>
          <Link href="/test"
            className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-full text-base font-medium hover:bg-gray-800 transition-all">
            Spustit kvíz
          </Link>
        </section>

        {/* Related */}
        <section className="mt-20">
          <p className="eyebrow text-pink-500 mb-4">Pokračuj ve čtení</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-10">
            Co se k tomu váže.
          </h2>
          <div className="space-y-6">
            {RELATED.map(r => (
              <Link key={r.href} href={r.href}
                className="block bg-white border border-gray-100 hover:border-gray-300 rounded-3xl p-8 transition-all group">
                <p className="eyebrow text-gray-400 mb-3">{r.eyebrow}</p>
                <h3 className="serif text-xl text-gray-900 font-medium mb-2 group-hover:text-pink-500 transition">{r.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{r.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <footer className="mt-20 pt-12 border-t border-gray-200">
          <p className="text-xs text-gray-400 leading-relaxed">
            Mgr. Ing. Simona Cibulková · Cosmatch · IČO 08419531 · Praha 2026.
            Numerologie není empirická věda — výsledky používejte jako podporu rozhodování,
            ne jako absolutní pravdu.
          </p>
        </footer>
      </article>
    </main>
  )
}
