import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kompatibilita podle data narození — Numerologie a vztahy | Cosmatch',
  description: 'Jak data narození ovlivňují kompatibilitu ve vztazích? Zjisti svůj numerologický profil a najdi lidi, kteří ti opravdu odpovídají.',
  keywords: 'kompatibilita data narození, numerologie vztahy, životní číslo kompatibilita, datum narození láska',
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
]

const FAQ = [
  {
    q: 'Jak se počítá životní číslo z data narození?',
    a: 'Životní číslo (číslo cesty) získáš součtem všech číslic svého data narození, redukovaným na jednociferné číslo nebo master číslo 11, 22, 33. Příklad: 23. 7. 1992 → 2+3+7+1+9+9+2 = 33. Takový člověk má master číslo 33.',
  },
  {
    q: 'Jaká čísla jsou nejkompatibilnější?',
    a: 'Záleží na konkrétní kombinaci. Obecně: 1 ladí s 3, 5 a 6; 2 s 4, 6 a 8; 4 s 2, 6 a 8. Master čísla 11, 22, 33 mají nejsilnější spojení s 2, 6 a 9. Cosmatch toto počítá pro všech 46\u202f949 párů.',
  },
  {
    q: 'Je numerologie vědecky prokázána?',
    a: 'Numerologie není empirická věda — je to systém interpretace čísel s tisíciletou tradicí. Cosmatch ji používá jako strukturovaný framework pro sebepoznání a matchmaking, ne jako absolutní pravdu.',
  },
  {
    q: 'Čím se Cosmatch liší od horoskopu?',
    a: 'Horoskopy jsou obecné — jeden text pro 1/12 populace. Cosmatch počítá kompatibilitu pro 46\u202f949 konkrétních kombinací dat narození. Navíc zohledňuje záměr vztahu, vzdálenost a společné zájmy — nejde jen o datum.',
  },
  {
    q: 'Mohu najít svého partnera díky numerologii?',
    a: 'Numerologie pomáhá pochopit, s jakými typy lidí přirozeně rezonuješ — a kde jsou třecí plochy. Cosmatch tohle propojuje s reálnými profily skutečných lidí ve tvém okolí. Finální slovo má vždy tvoje srdce.',
  },
]

export default function KompatibilitaPage() {
  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">← Cosmatch</Link>
      </div>

      <article className="max-w-2xl mx-auto px-6 pt-16 pb-24">
        {/* Masthead */}
        <header className="mb-16">
          <p className="eyebrow text-pink-500 mb-6">Průvodce</p>
          <h1 className="serif-display text-5xl sm:text-6xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-8">
            Kompatibilita<br/>podle <em className="italic text-pink-500">data narození</em>.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-8" />
          <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
            Numerologie tvrdí, že datum tvého narození není náhoda — a má svou roli v tom, s kým
            se přirozeně shodneš ve vztazích. Cosmatch tuto teorii aplikuje na všech 46\u202f949 párů.
          </p>
        </header>

        {/* Body */}
        <section className="mb-16">
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
            vzdáleností, aktivitou a společnými zájmy.
          </p>
        </section>

        <hr className="rule mb-16" />

        {/* Table */}
        <section className="mb-16">
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

        <hr className="rule mb-16" />

        {/* FAQ */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Časté otázky</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-10">
            Co se nejčastěji ptáte.
          </h2>

          <div className="space-y-10">
            {FAQ.map(({ q, a }) => (
              <div key={q} className="border-b border-gray-200 pb-10 last:border-b-0">
                <h3 className="serif text-xl text-gray-900 font-medium leading-tight mb-3">{q}</h3>
                <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">{a}</p>
              </div>
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

        {/* Internal links */}
        <footer className="mt-16 pt-12 border-t border-gray-200 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/numerologie-vztahy" className="text-pink-500 hover:text-pink-600 transition">Numerologie a vztahy →</Link>
          <Link href="/manifest-duvery" className="text-gray-500 hover:text-gray-900 transition">Manifest důvěry</Link>
          <Link href="/waitlist" className="text-gray-500 hover:text-gray-900 transition">Waitlist</Link>
        </footer>
      </article>
    </main>
  )
}
