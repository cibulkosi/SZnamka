
import type { Metadata } from 'next'
import Link from 'next/link'

const TITLE = 'Jak funguje Cosmatch — Algoritmus, zdroje, metodologie | Cosmatch'
const DESC = 'Cosmatch počítá shodu transparentně — 35 % kompatibilita podle data narození (vychází ze 17 zdrojů numerologie, astrologie a české tradice), 20 % životní hodnoty, 15 % osobnost, 10 % intimní soulad, 10 % životní styl, 5 % zájmy, 5 % aktivita. Bez magie, bez skrytých vzorců.'
const URL = 'https://cosmatch.cz/jak-funguje-cosmatch'

export const metadata: Metadata = {
  title: TITLE, description: DESC,
  alternates: { canonical: URL, languages: { 'cs-CZ': URL, 'x-default': URL } },
  openGraph: { title: TITLE, description: DESC, url: URL, type: 'article', siteName: 'Cosmatch', locale: 'cs_CZ' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
  keywords: ['jak funguje cosmatch', 'numerologický algoritmus', 'kompatibilita výpočet', 'cosmatch metodika'],
  authors: [{ name: 'Simona Cibulková' }],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: TITLE, description: DESC,
  author: {
    '@type': 'Person',
    name: 'Simona Cibulková',
    jobTitle: 'Zakladatelka Cosmatch',
    description: 'Zakladatelka cosmatch.cz, první české seznamky postavené na numerologické kompatibilitě dat narození.',
    knowsAbout: ['numerologie', 'kompatibilita podle data narození', 'seznamovací aplikace', 'kompatibilita partnerů'],
  },
  publisher: { '@type': 'Organization', name: 'Cosmatch', logo: { '@type': 'ImageObject', url: 'https://cosmatch.cz/icon-512.png' } },
  datePublished: '2026-05-16', dateModified: '2026-05-16',
  mainEntityOfPage: { '@type': 'WebPage', '@id': URL },
  inLanguage: 'cs-CZ',
}

export default function JakFungujeCosmatchPage() {
  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">← Cosmatch</Link>
      </div>

      <article className="max-w-2xl mx-auto px-6 pt-16 pb-24">

        <header className="mb-8">
          <p className="eyebrow text-pink-500 mb-6">Metodika</p>
          <h1 className="serif-display text-5xl sm:text-6xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-6">
            Jak Cosmatch<br/><em className="italic text-pink-500">opravdu funguje a kdo za ním stojí</em>?
          </h1>
          <hr className="rule w-12 border-gray-900" />
        </header>

        {/* Bio Simona — E-E-A-T trust signal */}
        <section className="mb-16 bg-white border border-gray-100 rounded-3xl p-10">
          <p className="eyebrow text-pink-500 mb-4">Kdo vybudoval Cosmatch?</p>
          <h2 className="serif text-2xl text-gray-900 font-medium leading-tight mb-3">
            Simona Cibulková, zakladatelka Cosmatch
          </h2>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
            Před Cosmatch jsem strávila roky studiem vztahové dynamiky, numerologie a kompatibility podle data narození. Cosmatch staví na <Link href="/zdroje-numerologie" className="text-pink-500 underline">17 klíčových zdrojích</Link> pythagorovské numerologické tradice — od antiky po současné autory jako Hans Decoz, Glynis McCants, Helmuta Kritzingera nebo Michelle Buchanan, doplněné o českou linii Jitky Kadlecové.
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">
            Cosmatch jsem vyvinula proto, že jsem byla nespokojená s aplikacemi, které okrádají o pozornost čas a ve výsledku lidem nedají důvod k setkání.
          </p>
        </section>

        <hr className="rule mb-16" />

        {/* 7 vrstev algoritmu */}
        <section className="mb-16">
          <p className="eyebrow text-pink-500 mb-4">Propracovaný algoritmus</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-10">
            V algoritmu je zapracováno sedm vrstev výpočtu.
          </h2>

          <div className="space-y-12">
            {[
              ['I', 'Kompatibilita podle data narození', '35 %', 'Hlavní vrstva se odvíjí od toho, jak se k sobě hodí konkrétní den a měsíc dvou lidí. Cosmatch matching engine používá vlastní databázi 46 949 specifických kombinací dat narození, vyvinutou syntézou klasické západní tradice kompatibility — inspirovali jsme se více než 17 referenčními pracemi (Decoz, McCants, Goldschneider, Kadlecová a další; viz Zdroje). Datumy jsou syntetizovány do několika kategorií, mezi něž patří spřízněné duše, láska, přátelství, prospěšné vztahy, magnetické přitažlivosti nebo náročné vztahy.'],
              ['II', 'Životní hodnoty a vize', '20 %', 'Rodinné plány (typu chcete děti?), typ vztahu (vážný/casual/přátelství), náboženství nebo přístup k financím. Sdílené hodnoty udržují dlouhodobě vztah víc než vášeň prvních týdnů.'],
              ['III', 'Osobnost a týmovost', '15 %', 'Vizionář nebo realizátor? Introvert nebo extrovert? Skřivan nebo sova? Jak řešíš konflikty? V čem se doplňujete a v čem jste naopak rozdílní?'],
              ['IV', 'Intimní soulad', '10 %', 'Nesmí chybět ani velikost libida. Soulad v sexu v dlouhodobém vztahu je důležitý pro vyhnutí se tiché frustraci.'],
              ['V', 'Životní styl a návyky', '10 %', 'Kouření, alkohol, strava nebo pohyb každodenní soužití také ovlivňují. Ve filtrech si můžeš zvolit např. kouření jako tvrdý deal-breaker, a poté se Ti kuřáci neukáží.'],
              ['VI', 'Společné zájmy', '5 %', 'Procentní překryv tagů (záliby je možné vybírat z 45 možností). Mohou sloužit jako společná řeč pro první rande, ale ne jako hlavní faktor dlouhodobé kompatibility.'],
              ['VII', 'Aktivita', '5 %', 'Být online v posledních 24 h přináší členům 100 bodů, v posledním týdnu 75 b., za poslední měsíc 50 b., déle než jeden měsíc 30 b. Sebelepší shoda totiž nepovede nikam, pokud druhý člověk aplikaci vůbec nepoužívá.'],
            ].map(([num, title, weight, body]) => (
              <div key={num} className="grid grid-cols-[auto,1fr] gap-x-8">
                <div className="text-right">
                  <div className="roman text-3xl text-pink-500 leading-none mb-2">{num}</div>
                  <div className="text-xs text-gray-500 tracking-wider">{weight}</div>
                </div>
                <div>
                  <h3 className="serif text-xl text-gray-900 font-medium mb-2 leading-tight">{title}</h3>
                  <p className="text-gray-700 leading-[1.75] text-[0.95rem]">{body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6 space-y-3">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-gray-900 font-medium">A co vzdálenost, věk a fyzické preference?</strong> Tyto věci NEJSOU součástí kompatibility skóre. Jsou to <strong className="text-gray-900 font-medium">filtry</strong>, které si nastavíš sám/sama. V profilu si určíš maximální vzdálenost (např. do 30 km), věkový rozsah, případně výšku a profily mimo Tvoje preference se Ti vůbec neukážou. Algoritmus tak nikoho nepenalizuje za výšku ani věk; ale můžeš si požadované vlastnosti vyfiltrovat, pokud chceš.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-gray-900 font-medium">Deal-breakers:</strong> Pokud jeden z vás chce děti a druhý ne, profil se Ti neukáže (vždy). Kouření můžeš také označit jako deal-breaker a pak Ti zmizí i náruživí kuřáci a lidé holdující alkoholu nebo marihuaně.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-gray-900 font-medium">Minimální kompatibilita:</strong> V nastavení si můžeš zvolit, že chceš vidět jen profily nad 25 / 50 / 75 % shody. Defaultně je nastaveno na 0 %, kdy vidíš všechny.
            </p>
          </div>
        </section>

        <hr className="rule mb-16" />

        {/* Deep dive: birth_date_score */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Detail vrstvy I — 35 %</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            Kompatibilita podle data narození.
          </h2>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-6">
            Každý ze 366 dnů v roce má své numerologické rezonance, sluneční znamení, dekanát, stupeň, fixní hvězdy a dominantní planetu. Každý den má také určité dny, které se k němu hodí, a to v různých kategoriích:
          </p>
          <ul className="space-y-2 text-[0.95rem] text-gray-700 leading-relaxed mb-6">
            <li><strong className="text-gray-900 font-medium">Spřízněné duše</strong> — nejhlubší karmické vazby, 100 bodů</li>
            <li><strong className="text-gray-900 font-medium">Láska a přátelství</strong> — přirozená harmonie, 85 bodů</li>
            <li><strong className="text-gray-900 font-medium">Prospěšný vztah</strong> — vzájemná podpora, mentoring, 70 bodů</li>
            <li><strong className="text-gray-900 font-medium">Osudová přitažlivost</strong> — intenzivní magnetismus, 60 bodů</li>
            <li><strong className="text-gray-900 font-medium">Náročný vztah</strong> — růst přes konflikt, 45 bodů</li>
            <li><em className="italic">Žádná kategorie</em> — neutrální default, 50 bodů</li>
          </ul>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-12">
            Algoritmus vyhledá, jaký vztah má osoba A vzhledem k osobě B, a obráceně. Výsledek je průměr obou směrů. Když mají v sobě oba navzájem pozitivní kategorii, dostávají bonus 5 %.
          </p>

          <hr className="rule mb-10" />

          {/* Co jsou jednotlivé astrologické komponenty */}
          <h3 className="serif text-2xl text-gray-900 font-medium leading-tight mb-3">Co znamenají ty jednotlivé komponenty.</h3>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-6">
            Profil každého ze 366 dnů kombinuje pět vrstev numerologického a astrologického popisu. Vysvětlení každé z nich najdeš na <Link href="/kompatibilita-podle-data-narozeni" className="text-pink-500 underline">Numerologie</Link> a <Link href="/symbolika-data-narozeni" className="text-pink-500 underline">Astrologie</Link>.
          </p>

          <div className="space-y-3">
            <Link
              href="/kompatibilita-podle-data-narozeni"
              className="block bg-pink-50 border border-pink-200 hover:border-pink-500 rounded-2xl p-6 transition group"
            >
              <p className="eyebrow text-pink-500 mb-2">Pokračovat ve čtení · numerologie</p>
              <h3 className="serif text-lg text-gray-900 font-medium group-hover:text-pink-500 transition">
                Detail viz Kompatibilita podle data narození →
              </h3>
              <p className="text-gray-600 text-[0.95rem] leading-relaxed mt-1">
                12 archetypů, jak se počítá životní číslo, tabulka shod.
              </p>
            </Link>

            <Link
              href="/numerologie-vztahy"
              className="block bg-pink-50 border border-pink-200 hover:border-pink-500 rounded-2xl p-6 transition group"
            >
              <p className="eyebrow text-pink-500 mb-2">Pokračovat ve čtení · numerologie ve vztazích</p>
              <h3 className="serif text-lg text-gray-900 font-medium group-hover:text-pink-500 transition">
                Detail viz Numerologie ve vztazích →
              </h3>
              <p className="text-gray-600 text-[0.95rem] leading-relaxed mt-1">
                Jak životní číslo ovlivňuje partnerský výběr, komunikaci a dlouhodobou kompatibilitu. Master čísla, karmická spojení, přirozená rezonance.
              </p>
            </Link>

            <Link
              href="/symbolika-data-narozeni"
              className="block bg-pink-50 border border-pink-200 hover:border-pink-500 rounded-2xl p-6 transition group"
            >
              <p className="eyebrow text-pink-500 mb-2">Pokračovat ve čtení · symbolika data narození · 12 min</p>
              <h3 className="serif text-lg text-gray-900 font-medium group-hover:text-pink-500 transition">
                Detail viz Symbolika data narození →
              </h3>
              <p className="text-gray-600 text-[0.95rem] leading-relaxed mt-1">
                Tabulky 12 znamení, 36 dekanátů, 4 Royal Stars, 10 dalších fixních hvězd, srovnání klasické vs. moderní vládce.
              </p>
            </Link>
          </div>

        </section>

        <hr className="rule mb-16" />

        {/* Zdroje */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Zdroje</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-8">
            Na čem Cosmatch stojí.
          </h2>
          <ul className="space-y-4">
            <li className="text-gray-700 leading-relaxed text-[1.0625rem]">
              <strong className="text-gray-900 font-medium">The Secret Language of Birthdays</strong> (Gary Goldschneider &amp; Joost Elffers, Penguin Studio, 1994) — pop-culture personology framework založený na pozorování 14 000 osob.
            </li>
            <li className="text-gray-700 leading-relaxed text-[1.0625rem]">
              <strong className="text-gray-900 font-medium">The Power of Birthdays, Stars &amp; Numbers</strong> (Saffi Crawford &amp; Geraldine Sullivan, Ballantine, 1998) — encyklopedický 366-denní referenční průvodce kombinující astrologii, fixní hvězdy a numerologii.
            </li>
            <li className="text-gray-700 leading-relaxed text-[1.0625rem]">
              <strong className="text-gray-900 font-medium">Love by the Numbers</strong> (Glynis McCants, Sourcebooks, 2010) — současný mainstream love-by-the-numbers standard, tři tiery kompatibility.
            </li>
            <li className="text-gray-700 leading-relaxed text-[1.0625rem]">
              <strong className="text-gray-900 font-medium">Numerology: Key to Your Inner Self</strong> (Hans Decoz, Perigee/Tarcher, 2001) — moderní standardní textbook. Cosmatch používá jeho Three-Cycle Method pro výpočet životního čísla.
            </li>
            <li className="text-gray-700 leading-relaxed text-[1.0625rem]">
              <strong className="text-gray-900 font-medium">Partnerství a numerologie</strong> (Helmut-Whitey Kritzinger, Pragma, 1999) — kniha věnovaná partnerské numerologii.
            </li>
            <li className="text-gray-700 leading-relaxed text-[1.0625rem]">
              <strong className="text-gray-900 font-medium">Datum narození a jeho vliv na náš charakter</strong> (Jitka Kadlecová, Eminent, 2006) — česká numerologická tradice 21. století.
            </li>
          </ul>
        </section>

        <hr className="rule mb-16" />

        {/* Co Cosmatch NEdělá */}
        <section className="mb-16">
          <p className="eyebrow text-pink-500 mb-4">Čestnost</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            Numerologie není věda. A nevadí to.
          </h2>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
            Cosmatch používá numerologické a astrologické vzorce k odhadu strukturálního souznění mezi dvěma lidmi. <strong className="text-gray-900 font-medium">Numerologie a astrologie nejsou vědecky validované jako spolehlivé prediktory vztahových výsledků</strong> — bereme je jako <strong className="text-gray-900 font-medium">tradici sebepoznání a mapování osobnosti</strong> s kořeny v pythagorejské a chaldejské filozofii čísel, ne jako empirickou predikci.
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
            Část pocitu „tohle sedí přesně!“ je dokumentovaný psychologický jev zvaný <strong className="text-gray-900 font-medium">Barnumův/Forerův efekt</strong>. V roce 1949 dal psycholog Bertram Forer 39 studentům identický popis osobnosti a oni ho ohodnotili průměrnou známkou <strong className="text-gray-900 font-medium">4,26 z 5,0</strong> jako „to jsem přesně já“. To samé může fungovat s numerologií a astrologií — popisy mohou být obecné natolik, že v nich každý najde kus sebe.
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
            <strong className="text-gray-900 font-medium">Proč to nevadí?</strong> Protože hodnota nástroje není v jeho prediktivní přesnosti — je v tom, k jakému rozhovoru Ti otevírá dveře. Numerologický archetyp je <strong className="text-gray-900 font-medium">zrcadlo</strong>, ne diagnóza. „Tohle jsem já?“ je první otázka. „Jak s tím naložím?“ je druhá. „Jak říkám partnerovi, co potřebuju?“ je třetí. Cosmatch Ti dává podněty k přemýšlení o vztahu a jeho aspektech a o tom, kde může být třeba na něm zapracovat.
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
            Cosmatch shoda je interpretační nástroj, ne predikce. Žádná aplikace nedokáže garantovat úspěch vztahu — záleží jen na vás, jak ho dokážete vybudovat.
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">
            Tvoje srdce má vždy poslední slovo. Cosmatch je tu, aby Ti dal lepší startovací podmínky, ne diagnózu.
          </p>
        </section>

        {/* CTA */}
        <section className="bg-white rounded-3xl border border-gray-100 p-10">
          <p className="eyebrow text-pink-500 mb-4">Vyzkoušej</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">
            Spusť kvíz.
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8 text-[1.0625rem]">
            Zadej datum narození a uvidíš výsledek za 30 sekund. Bez registrace.
          </p>
          <Link href="/test" className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-full text-base font-medium hover:bg-gray-800 transition">
            Spustit kvíz
          </Link>
        </section>
      </article>
    </main>
  )
}
