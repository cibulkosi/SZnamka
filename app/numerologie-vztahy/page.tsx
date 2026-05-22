
import Link from 'next/link'
import type { Metadata } from 'next'

const TITLE = 'Numerologie a vztahy — Jak čísla ovlivňují lásku | Cosmatch'
const DESCRIPTION = 'Praktický průvodce numerologií ve vztazích: jak životní číslo ovlivňuje partnerský výběr, komunikaci a dlouhodobou kompatibilitu. Master čísla, karmická spojení, přirozená rezonance.'
const URL = 'https://cosmatch.cz/numerologie-vztahy'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'numerologie vztahy',
    'numerologie láska',
    'životní číslo partner',
    'numerologie kompatibilita partnerů',
    'master čísla vztahy',
    'numerologie a partner',
    'karmické spojení',
    'kompatibilita podle data narození',
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

const SECTIONS = [
  {
    id: 'pritahovani',
    num: 'I',
    title: 'Proč přitahujeme určité lidi?',
    paras: [
      'Psychologové hovoří o „familiarity effect“, tendenci preferovat lidi, kteří nám připomínají vzorce z dětství. Numerologie přidává další pohled, podle něhož každé životní číslo nese specifické energetické kvality, které s některými čísly přirozeně rezonují a s některými naopak ne.',
      'Znamená to, že pochopením svého čísla můžeš lépe pochopit, co od partnera přirozeně očekáváš, a kde mohou nastat potenciální konflikty dříve, než eskalují.',
    ],
  },
  {
    id: 'tri-typy',
    num: 'II',
    title: 'Tři typy vztahových čísel',
    paras: [
      'Numerologie rozlišuje tři hlavní kategorie kompatibility, a to přirozenou rezonanci (čísla, která si energeticky vyhovují), komplementární shodu (čísla, která doplňují to, co ti chybí) a karmická spojení (čísla, která přinášejí lekce, ne vždy pohodlné).',
      'Cosmatch tyto kategorie označuje jako Oboustrannou shodu, Spřízněné duše a Karmickou zkoušku. Žádná z nich není špatná — karmická spojení mohou být nejhlubší lekce v životě.',
    ],
  },
  {
    id: 'cisla-v-praxi',
    num: 'III',
    title: 'Čísla v praxi: co funguje a co ne',
    paras: [
      'Číslo 4 (Stavitel) a 6 (Pečovatel) sdílejí hodnoty stability a věrnosti — přirozeně si rozumí. Číslo 5 (Dobrodruh) a 4 (Stavitel) mívají napjatou dynamiku: jeden chce změnu, druhý jistotu.',
      'Klíčové je si tyto hodnoty uvědomovat. Pár pětky a čtyřky, který tuto dynamiku chápe, může vytvořit rovnováhu, o které jiné páry jen sní. Numerologie je nástroj sebepoznání, ne osud.',
    ],
  },
  {
    id: 'cesko-jine',
    num: 'IV',
    title: 'V čem je Česko jiné',
    paras: [
      'Numerologie a esoterika jsou v Česku poměrně oblíbenou záležitostí. Pew Research Center (CEE 2017) ukazuje, že 43 % Čechů věří v osud a 44 % v existenci duše — a to navzdory tomu, že se 72 % obyvatel naší země nehlásí k žádné církvi. Nielsen Admosphere přidává, že horoskopům věří 43 % online Čechů; mezi ženami je to dokonce 56 %.',
      'Cosmatch je jediná česká seznamka, která bere datum narození v úvahu. Protože po 56 % českých žen je datum narození smysluplný signál, ne pověra.',
    ],
  },
  {
    id: 'master-cisla',
    num: 'V',
    title: 'Master čísla ve vztazích',
    paras: [
      'Lidé s master číslem (11, 22, 33) bývají ve vztazích intenzivnější — v dobrém i špatném. Vizionář (11) potřebuje partnera, který zvládne jeho emocionální hloubku. Architekt (22) může být workoholik, který podceňuje vztahovou péči. Mistr lásky (33) dává tak moc, že riskuje vyhoření.',
      'Všechna tři master čísla hledají intenzitu a smysl a snadno je přestávají bavit povrchní vztahy.',
    ],
  },
] as const

const RELATED = [
  {
    href: '/kompatibilita-podle-data-narozeni',
    eyebrow: 'Průvodce',
    title: 'Kompatibilita podle data narození',
    desc: 'Co je životní číslo, jak ho spočítat a které kombinace přirozeně fungují.',
  },
  {
    href: '/test',
    eyebrow: 'Interaktivní',
    title: 'Numerologický kvíz',
    desc: 'Zadej datum narození a za 30 sekund zjistíš svůj archetyp.',
  },
  {
    href: '/manifest-duvery',
    eyebrow: 'Manifest',
    title: 'Sedm závazků Cosmatch',
    desc: 'Co Cosmatch nedělá a co naopak slibuje.',
  },
] as const

const READING_TIME_MIN = 4

export default function NumerologieVztahyPage() {
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
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Cosmatch', item: 'https://cosmatch.cz' },
          { '@type': 'ListItem', position: 2, name: 'Numerologie a vztahy', item: URL },
        ],
      },
    ],
  }

  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": 'Co je numerologie a jak souvisí se vztahy?', "acceptedAnswer": { "@type": "Answer", "text": 'Numerologie je systém interpretace čísel s tisíciletou tradicí. Vychází z předpokladu, že datum tvého narození nese specifické energetické kvality, které ovlivňují tvou osobnost a kompatibilitu s ostatními lidmi. Ve vztazích pomáhá pochopit, proč přitahuješ konkrétní typy partnerů.' } },
          { "@type": "Question", "name": 'Jak si vypočítám životní číslo?', "acceptedAnswer": { "@type": "Answer", "text": 'Sečti všechny číslice svého data narození. Příklad: 23. 7. 1992 → 2+3+7+1+9+9+2 = 33. Pokud výsledek je vyšší než 9, redukuj dál, pokud to není master číslo 11, 22 nebo 33. Cosmatch tě tímto procesem provede v kvízu zdarma.' } },
          { "@type": "Question", "name": 'Funguje numerologie ve vztazích vědecky?', "acceptedAnswer": { "@type": "Answer", "text": 'Numerologie není empirická věda. Je to interpretační framework s tisíciletou tradicí, který pomáhá strukturovat sebepoznání. Cosmatch ji používá jako jeden z faktorů při výpočtu kompatibility — spolu se záměrem vztahu, společnými zájmy a aktivitou.' } },
          { "@type": "Question", "name": 'Co jsou master čísla 11, 22 a 33?', "acceptedAnswer": { "@type": "Answer", "text": 'Master čísla jsou mistrovská čísla v numerologii — nejintenzivnější vibrace. Číslo 11 je Vizionář (intuice, citlivost), 22 je Architekt (vize plus praktičnost) a 33 je Mistr lásky (soucit a léčení). Lidé s master čísly tvoří jen ~4 % populace a ve vztazích jsou intenzivnější.' } },
          { "@type": "Question", "name": 'Mohu najít partnera díky numerologii?', "acceptedAnswer": { "@type": "Answer", "text": 'Numerologie pomáhá pochopit, s jakými typy lidí přirozeně rezonuješ. Cosmatch propojuje tyto poznatky s reálnými profily lidí ve tvém okolí — vidíš tedy nejen kompatibilní čísla, ale skutečné lidi. Finální rozhodnutí je vždy na tvém srdci.' } }
        ]
      }) }} />
      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">← Cosmatch</Link>
      </div>

      <article className="max-w-2xl mx-auto px-6 pt-16 pb-24">

        {/* Masthead */}
        <header className="mb-12">
          <p className="eyebrow text-pink-500 mb-6">Článek · {READING_TIME_MIN} min čtení</p>
          <h1 className="serif-display text-5xl sm:text-6xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-8">
            Numerologie<br/>a <em className="italic text-pink-500">vztahy</em>.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-8" />
          <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
            Jak životní číslo ovlivňuje výběr partnera a proč pořád přitahuješ určitý typ lidí?
          </p>
          <p className="text-sm text-gray-500 mt-6">
            Autorka <span className="text-gray-900 italic serif">Simona Cibulková</span>
            <span className="text-gray-300 mx-2">·</span>
            <span>Praha, květen 2026</span>
          </p>
        </header>

        {/* TOC */}
        <nav className="mb-16 border-y border-gray-200 py-6" aria-label="Obsah eseje">
          <p className="eyebrow text-gray-500 mb-3">Obsah</p>
          <ul className="space-y-1.5">
            {SECTIONS.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-gray-700 hover:text-pink-500 transition flex items-baseline gap-3">
                  <span className="roman text-base text-gray-400 w-6">{s.num}</span>
                  <span>{s.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sections */}
        <div className="space-y-16">
          {SECTIONS.map((s, idx) => (
            <section key={s.id} id={s.id} className="grid grid-cols-[auto,1fr] gap-x-8 sm:gap-x-12 scroll-mt-8">
              <div className="roman text-3xl sm:text-4xl text-pink-500 leading-none pt-2 select-none">{s.num}</div>
              <div>
                <h2 className="serif text-2xl sm:text-3xl text-gray-900 font-medium mb-5 leading-tight">{s.title}</h2>
                {s.paras.map((p, i) => (
                  <p key={i} className={`text-gray-700 leading-[1.75] text-[1.0625rem] ${i === 0 ? 'dropcap' : ''} ${i < s.paras.length - 1 ? 'mb-4' : ''}`}>
                    {p}
                  </p>
                ))}
              </div>
              {idx < SECTIONS.length - 1 && (
                <div className="col-span-2 pt-16">
                  <hr className="rule" />
                </div>
              )}
            </section>
          ))}
        </div>

        {/* CTA */}
        <section className="bg-white rounded-3xl border border-gray-100 p-10 mt-20">
          <p className="eyebrow text-pink-500 mb-4">Vyzkoušej</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">
            Zjisti své číslo.
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8 text-[1.0625rem]">
            Zadej datum narození a okamžitě zjistíš svůj archetyp a nejlepší shody.
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
