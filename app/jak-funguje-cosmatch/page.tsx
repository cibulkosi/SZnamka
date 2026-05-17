
import type { Metadata } from 'next'
import Link from 'next/link'

const TITLE = 'Jak funguje Cosmatch — Algoritmus, zdroje, metodologie | Cosmatch'
const DESC = 'Cosmatch počítá kompatibilitu pomocí pětivrstvého algoritmu — numerologie 35%, hodnoty 30%, vzdálenost 15%, aktivita 15%, zájmy 5%. Postaveno na knize The Power of Birthdays.'
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
    knowsAbout: ['numerologie', 'personologie', 'seznamovací aplikace', 'kompatibilita partnerů'],
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

        <header className="mb-16">
          <p className="eyebrow text-pink-500 mb-6">Methodology</p>
          <h1 className="serif-display text-5xl sm:text-6xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-8">
            Jak Cosmatch<br/><em className="italic text-pink-500">opravdu funguje</em>.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-8" />
          <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
            Pět vrstev výpočtu, jeden zdroj (kniha The Power of Birthdays) a žádné magické tlačítko.
            Tady je přesný popis, jak Cosmatch dochází k procentu kompatibility.
          </p>
        </header>

        {/* Bio Simona — E-E-A-T trust signal */}
        <section className="mb-16 bg-white border border-gray-100 rounded-3xl p-10">
          <p className="eyebrow text-pink-500 mb-4">Kdo Cosmatch postavil</p>
          <h2 className="serif text-2xl text-gray-900 font-medium leading-tight mb-3">
            Simona Cibulková
          </h2>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
            Zakladatelka a jediná osoba za Cosmatch. Před Cosmatch jsem strávila roky studiem
            personologie, vztahové dynamiky a numerologie. Cosmatch staví na knize <em className="italic">The Power of Birthdays, Stars &amp; Numbers</em> od Garyho Goldschneidera a české numerologické tradici Jitky Kadlecové.
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">
            Cosmatch nevyvíjím proto, abych ti slibovala partnera. Vyvíjím ho proto, že jsem byla unavená
            z aplikací, které kradou pozornost a neposkytují důvod k setkání. Chceš mi něco napsat? <a href="mailto:ahoj@cosmatch.cz" className="text-pink-500 underline">ahoj@cosmatch.cz</a>.
          </p>
        </section>

        <hr className="rule mb-16" />

        {/* 5 vrstev algoritmu */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Algoritmus</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-10">
            Pět vrstev výpočtu.
          </h2>

          <div className="space-y-12">
            {[
              ['I', 'Numerologická kompatibilita', '35 %', 'Klíčová vrstva. Bere tvé a partnerovo datum narození, spočítá životní čísla a podívá se do matice 366 × 366 kompatibilit z knihy The Power of Birthdays. Výsledkem je báze skóre + kategorie vztahu (Spřízněná duše, Láska a přátelství, Osudová přitažlivost, Prospěšný, Náročný).'],
              ['II', 'Hodnoty a záměr', '30 %', 'Hledáte oba vážný vztah? Jen přátelství? Casual? Pokud máte stejný záměr, skóre se znásobí 1.2. Pokud máte protichůdný (jeden seriózní, druhý casual), skóre × 0.5.'],
              ['III', 'Vzdálenost', '15 %', 'Decay funkce, ne lineární. 0–5 km = plný bonus. 5–15 km = 66 %. 15–30 km = 33 %. Nad uživatelem stanovený limit = profil se nezobrazí.'],
              ['IV', 'Aktivita', '15 %', 'Activity boost: kdo byl online v posledních 24 h, dostane +15 bodů. ELO tie-break: při stejném skóre se atraktivnější profily zobrazí novým uživatelům první. Žádný „pay to win".'],
              ['V', 'Společné zájmy', '5 %', 'Plus tension factor pro asymetrické vztahy — když jeden vidí osudovou přitažlivost a druhý výzvu, dostaneš label „Magnetická tenze".'],
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
              <strong className="text-gray-900 font-medium">The Power of Birthdays, Stars &amp; Numbers</strong> (Goldschneider &amp; Elffers, 1994) — 832 stran personologických profilů pro každý den v roce, plus kompletní matice kompatibility.
            </li>
            <li className="text-gray-700 leading-relaxed text-[1.0625rem]">
              <strong className="text-gray-900 font-medium">Datum narození a jeho vliv na náš charakter</strong> (Jitka Kadlecová, Eminent, 2006) — česká personologická tradice.
            </li>
            <li className="text-gray-700 leading-relaxed text-[1.0625rem]">
              <strong className="text-gray-900 font-medium">Pew Research CEE 2017</strong> — 43 % Čechů věří v osud, 44 % v existenci duše.
            </li>
            <li className="text-gray-700 leading-relaxed text-[1.0625rem]">
              <strong className="text-gray-900 font-medium">Nielsen Admosphere 2017</strong> — 43 % online Čechů věří horoskopům (56 % u žen).
            </li>
            <li className="text-gray-700 leading-relaxed text-[1.0625rem]">
              <strong className="text-gray-900 font-medium">STEM/MARK 2025</strong> — 96 % českých žen 18–29 let považuje hledání partnera za obtížné.
            </li>
          </ul>
        </section>

        <hr className="rule mb-16" />

        {/* Co Cosmatch NEdělá */}
        <section className="mb-16">
          <p className="eyebrow text-pink-500 mb-4">Čestnost</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            Numerologie není věda.
          </h2>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
            Numerologie je interpretační framework s tisíciletou tradicí, ne empirická věda. Cosmatch
            ji prezentuje jako jednu vrstvu rozhodování, ne jako absolutní pravdu.
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">
            Tvoje srdce má vždy poslední slovo. Cosmatch je tu, aby ti dal lepší startovací podmínky — ne diagnózu.
          </p>
        </section>

        {/* CTA */}
        <section className="bg-white rounded-3xl border border-gray-100 p-10">
          <p className="eyebrow text-pink-500 mb-4">Vyzkoušej</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">
            Spusť kvíz.
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8 text-[1.0625rem]">
            Zadej datum narození — uvidíš výsledek za 30 sekund. Žádná registrace.
          </p>
          <Link href="/test" className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-full text-base font-medium hover:bg-gray-800 transition">
            Spustit kvíz
          </Link>
        </section>
      </article>
    </main>
  )
}
