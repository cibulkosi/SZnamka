
import type { Metadata } from 'next'
import Link from 'next/link'

const TITLE = 'Jak funguje Cosmatch — Algoritmus, zdroje, metodologie | Cosmatch'
const DESC = 'Cosmatch počítá shodu transparentně — 40 % kompatibilita podle data narození (kniha Power of Birthdays + životní číslo), 35 % hodnoty, 20 % aktivita, 5 % zájmy. Bez magie, bez skrytých vzorců.'
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

        <header className="mb-16">
          <p className="eyebrow text-pink-500 mb-6">Methodology</p>
          <h1 className="serif-display text-5xl sm:text-6xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-8">
            Jak Cosmatch<br/><em className="italic text-pink-500">opravdu funguje</em>.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-8" />
          <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
            Čtyři vrstvy výpočtu, hlavní zdroj kniha The Power of Birthdays + životní číslo z numerologie, žádné magické tlačítko.
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
            vztahové dynamiky, numerologie a kompatibility podle data narození. Cosmatch staví na knize <em className="italic">The Power of Birthdays, Stars &amp; Numbers</em> od Garyho Goldschneidera a české numerologické tradici Jitky Kadlecové.
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">
            Cosmatch nevyvíjím proto, abych ti slibovala partnera. Vyvíjím ho proto, že jsem byla unavená
            z aplikací, které kradou pozornost a neposkytují důvod k setkání. Chceš mi něco napsat? <a href="mailto:ahoj@cosmatch.cz" className="text-pink-500 underline">ahoj@cosmatch.cz</a>.
          </p>
        </section>

        <hr className="rule mb-16" />

        {/* 5 vrstev algoritmu */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Algoritmus — top-level</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-10">
            Čtyři vrstvy výpočtu.
          </h2>

          <div className="space-y-12">
            {[
              ['I', 'Kompatibilita podle data narození', '40 %', 'Hlavní vrstva — viz detail níže. Skládá se ze dvou pod-vrstev: profil dne narození z knihy The Power of Birthdays (80 %) a kompatibilita životních čísel z klasické numerologie (20 %).'],
              ['II', 'Hodnoty a záměr', '35 %', 'Hledáte oba vážný vztah? Jen přátelství? Casual? Pokud máte stejný záměr, skóre se znásobí 1.2. Pokud máte protichůdný (jeden seriózní, druhý casual), skóre × 0.5.'],
              ['III', 'Aktivita', '20 %', 'Activity boost: kdo byl online v posledních 24 h, dostane +15 bodů. ELO tie-break: při stejném skóre se atraktivnější profily zobrazí novým uživatelům první. Žádný „pay to win".'],
              ['IV', 'Společné zájmy', '5 %', 'Plus tension factor pro asymetrické vztahy — když jeden vidí osudovou přitažlivost a druhý výzvu, dostaneš label „Magnetická tenze".'],
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

          <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-gray-900 font-medium">A co vzdálenost?</strong> Vzdálenost není součástí kompatibility skóre — používáš ji jako <strong className="text-gray-900 font-medium">filtr</strong> ve svých preferencích. V nastavení profilu si určíš maximální vzdálenost (např. „do 30 km"), a profily mimo tento okruh se ti vůbec nezobrazí. Lidé blíž tě neporazí v algoritmu, jen máš víc šancí se s nimi reálně setkat.
            </p>
          </div>
        </section>

        <hr className="rule mb-16" />

        {/* Deep dive: birth_date_score */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Detail vrstvy I — 40 %</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            Kompatibilita podle data narození — pod kapotou.
          </h2>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-10">
            Datum narození každého uživatele neseme dvěma cestami: <strong className="text-gray-900 font-medium">profil dne+měsíce</strong> (Goldschneider, kniha The Power of Birthdays) a <strong className="text-gray-900 font-medium">životní číslo</strong> (klasická numerologie, součet všech číslic data). Každý zachycuje něco jiného, dohromady dávají kompletní obraz.
          </p>

          <div className="space-y-12">
            <div className="grid grid-cols-[auto,1fr] gap-x-8">
              <div className="text-right">
                <div className="roman text-3xl text-pink-500 leading-none mb-2">A</div>
                <div className="text-xs text-gray-500 tracking-wider">80 %</div>
              </div>
              <div>
                <h3 className="serif text-xl text-gray-900 font-medium mb-2 leading-tight">Profil dne narození</h3>
                <p className="text-gray-700 leading-[1.75] text-[0.95rem] mb-3">
                  Pro každý ze 366 dnů v roce má kniha vlastní profil — sluneční znamení, dekanát, stupeň, fixní hvězdy, dominantní planeta, klíčové numerologické rezonance. Na konci každého profilu autoři uvádí seznam <strong className="text-gray-900 font-medium">5 vztahových kategorií</strong>:
                </p>
                <ul className="space-y-2 text-[0.95rem] text-gray-700 leading-relaxed mb-3">
                  <li><strong className="text-gray-900 font-medium">Spřízněné duše</strong> (Soul Mates) — nejhlubší karmické vazby, 100 bodů</li>
                  <li><strong className="text-gray-900 font-medium">Láska a přátelství</strong> (Love &amp; Friendship) — přirozená harmonie, 85 bodů</li>
                  <li><strong className="text-gray-900 font-medium">Prospěšný vztah</strong> (Beneficial) — vzájemná podpora, mentoring, 70 bodů</li>
                  <li><strong className="text-gray-900 font-medium">Osudová přitažlivost</strong> (Fatal Attractions) — intenzivní magnetismus, 60 bodů</li>
                  <li><strong className="text-gray-900 font-medium">Náročný vztah</strong> (Challenging) — růst přes konflikt, 40 bodů</li>
                  <li><em className="italic">Žádná kategorie</em> — neutrální, 50 bodů</li>
                </ul>
                <p className="text-gray-700 leading-[1.75] text-[0.95rem] mb-3">
                  Tyto kategorie už v sobě <em className="italic">obsahují</em> astrologickou logiku (trigon, sextil, opozice, čtverec, kvintil) i numerologickou harmonii — Goldschneider je všechny zohlednil při sestavování knihy. Cosmatch tu jejich práci jen vyhledává, ne ji znovu počítá.
                </p>
                <p className="text-gray-700 leading-[1.75] text-[0.95rem]">
                  Vyhledání je <strong className="text-gray-900 font-medium">vzájemné</strong>: hledáme, do jaké kategorie patří B v A's profilu, a obráceně. Výsledek je průměr obou směrů. Když oba mají v sobě navzájem pozitivní kategorii, dostávají bonus 1.15×.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-[auto,1fr] gap-x-8">
              <div className="text-right">
                <div className="roman text-3xl text-pink-500 leading-none mb-2">B</div>
                <div className="text-xs text-gray-500 tracking-wider">20 %</div>
              </div>
              <div>
                <h3 className="serif text-xl text-gray-900 font-medium mb-2 leading-tight">Životní číslo</h3>
                <p className="text-gray-700 leading-[1.75] text-[0.95rem] mb-3">
                  Životní číslo se počítá z <em className="italic">celého</em> data narození (den + měsíc + rok), takže rozliší dva lidi narozené ve stejný den, ale v jiném roce. To je něco, co kniha sama nedělá — pracuje jen s dnem a měsícem. Životní číslo doplňuje obraz o vrstvu životního účelu a archetypu.
                </p>
                <p className="text-gray-700 leading-[1.75] text-[0.95rem] mb-3">
                  Postup: sečteme všechny číslice data, redukujeme na 1–9 (s výjimkou mistrovských čísel 11, 22, 33, která ponecháváme). Páry životních čísel mají různé energetické dynamiky — některé se přirozeně doplňují (4+6, 2+8, 1+3), jiné srážejí.
                </p>
                <p className="text-gray-700 leading-[1.75] text-[0.95rem]">
                  Cosmatch má interní matici 9×9 (+master modifikátory), kde každá kombinace má skóre 0–100 podle klasické numerologické tradice (Pythagoras → moderní zpracování Kadlecová, Goldschneider).
                </p>
              </div>
            </div>
          </div>

          {/* Konkrétní příklad výpočtu */}
          <div className="mt-12 bg-white border border-gray-200 rounded-3xl p-8">
            <p className="eyebrow text-pink-500 mb-3">Konkrétní příklad</p>
            <h3 className="serif text-xl text-gray-900 font-medium mb-4 leading-tight">
              Anna (15. 4. 1992) × Petr (22. 10. 1990)
            </h3>
            <div className="space-y-3 text-[0.95rem] text-gray-700 leading-relaxed">
              <p><strong className="text-gray-900 font-medium">Profil dne (80 %):</strong> 22.10. je v Annině sekci „Osudová přitažlivost" (60 b.). 15.4. je v Petrově sekci „Láska a přátelství" (85 b.). Průměr = <strong>72.5 b.</strong></p>
              <p><strong className="text-gray-900 font-medium">Životní číslo (20 %):</strong> Anna 1+5+4+1+9+9+2 = 31 → 4 (Stavitel). Petr 2+2+1+0+1+9+9+0 = 24 → 6 (Pečovatel). 4+6 v matici = <strong>90 b.</strong> (klasická harmonie).</p>
              <p className="pt-2 border-t border-gray-200">
                <strong className="text-gray-900 font-medium">Výsledek vrstvy I:</strong> 0.80 × 72.5 + 0.20 × 90 = <strong className="serif-display text-2xl text-pink-500">76 %</strong> kompatibilita podle data narození. To je 30 procentních bodů z maximálních 40 % v Cosmatch score.
              </p>
            </div>
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
              <strong className="text-gray-900 font-medium">The Power of Birthdays, Stars &amp; Numbers</strong> (Goldschneider &amp; Elffers, 1994) — 832 stran profilů pro každý den v roce, plus kompletní matice kompatibility.
            </li>
            <li className="text-gray-700 leading-relaxed text-[1.0625rem]">
              <strong className="text-gray-900 font-medium">Datum narození a jeho vliv na náš charakter</strong> (Jitka Kadlecová, Eminent, 2006) — česká tradice numerologie podle data narození.
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
            Cosmatch používá numerologické a astrologické vzorce k odhadu strukturálního souznění mezi dvěma lidmi. <strong className="text-gray-900 font-medium">Numerologie a astrologie nejsou vědecky validované jako spolehlivé prediktory vztahových výsledků.</strong>
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
            Cosmatch shoda je interpretační nástroj, ne predikce. Žádná aplikace nedokáže garantovat úspěch vztahu — záleží na vás, jak ho dokážete vybudovat.
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
