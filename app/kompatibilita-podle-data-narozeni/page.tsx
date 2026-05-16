import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kompatibilita podle data narození — Numerologie a vztahy | Cosmatch',
  description: 'Jak data narození ovlivňují kompatibilitu ve vztazích? Zjisti svůj numerologický profil a najdi lidi, kteří ti opravdu odpovídají.',
  keywords: 'kompatibilita data narození, numerologie vztahy, životní číslo kompatibilita, datum narození láska',
}

const FAQ = [
  {
    q: 'Jak se počítá životní číslo z data narození?',
    a: 'Životní číslo (číslo cesty) získáš součtem všech číslic svého data narození, redukovaným na jednociferné číslo (nebo master číslo 11, 22, 33). Například 23. 7. 1992: 2+3+7+1+9+9+2 = 33. Takový člověk má master číslo 33.',
  },
  {
    q: 'Jaká čísla jsou nejkompatibilnější?',
    a: 'Nejlepší shody závisí na konkrétní kombinaci, ale obecně: 1 se shoduje s 3, 5 a 6; 2 s 4, 6 a 8; 4 s 2, 6 a 8. Master čísla (11, 22, 33) mají nejsilnější spojení s čísly 2, 6 a 9. Cosmatch toto počítá pro všech 133 000+ kombinací.',
  },
  {
    q: 'Je numerologie vědecky prokázána?',
    a: 'Numerologie není empirická věda — je to systém interpretace čísel s tisíciletou tradicí. Cosmatch ji používá jako strukturovaný framework pro sebepoznání a matchmaking, ne jako absolutní pravdu. Výsledky bereme jako inspiraci, ne diagnózu.',
  },
  {
    q: 'Čím se Cosmatch liší od horoskopu?',
    a: 'Horoskopy jsou velmi obecné — jeden text pro 1/12 populace. Cosmatch počítá kompatibilitu pro 133 000+ konkrétních kombinací dat narození, každá je unikátní. Navíc zohledňuje záměr vztahu, vzdálenost a společné zájmy — nejde jen o datum.',
  },
  {
    q: 'Mohu najít svého partnera díky numerologii?',
    a: 'Numerologie může pomoci pochopit, s jakými typy lidí přirozeně rezonuješ — a kde jsou třecí plochy. Cosmatch tohle propojuje s reálnými profily skutečných lidí ve tvém okolí. Finální slovo má ale vždy tvoje srdce.',
  },
]

export default function KompatibilitaPage() {
  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold text-gray-900">
            <span className="text-pink-500">✦</span> Cosmatch
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-4">
            Kompatibilita podle data narození
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed mb-6">
            Numerologie tvrdí, že datum tvého narození není náhoda — a má svou roli i v tom,
            s kým se přirozeně shodneš ve vztazích. Cosmatch tuto teorii aplikuje
            na 133 000+ párů kompatibility.
          </p>
          <Link href="/test" className="btn-primary inline-block px-8 py-4 text-lg">
            Zjistit svou kompatibilitu
          </Link>
        </div>

        {/* Intro article */}
        <div className="card p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Co je životní číslo?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Životní číslo (číslo životní cesty) je základem numerologie. Získáš ho součtem
            všech číslic svého data narození, opakovaně redukovaným na jednociferné číslo.
            Existuje 9 základních čísel (1–9) a tři master čísla (11, 22, 33).
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Každé číslo odpovídá určitému archetypu osobnosti — Průkopník (1), Diplomat (2),
            Tvůrce (3), Stavitel (4), Dobrodruh (5), Pečovatel (6), Mudrc (7), Vůdce (8),
            Idealista (9). Master čísla jsou Vizionář (11), Architekt (22) a Mistr lásky (33).
          </p>
          <p className="text-gray-600 leading-relaxed">
            Kompatibilita se pak počítá z kombinace dvou životních čísel — spolu s dalšími
            faktory jako záměr vztahu, vzdálenost a společné zájmy.
          </p>
        </div>

        {/* Numbers table */}
        <div className="card p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Přehled čísel a jejich kompatibilit</h2>
          <div className="space-y-3">
            {[
              ['1 — Průkopník', '3, 5, 6', 'Náročná s 4, 8'],
              ['2 — Diplomat', '4, 6, 8', 'Náročná s 5, 9'],
              ['3 — Tvůrce', '1, 5, 9', 'Náročná s 4, 7'],
              ['4 — Stavitel', '2, 6, 8', 'Náročná s 3, 5'],
              ['5 — Dobrodruh', '1, 3, 7', 'Náročná s 2, 4'],
              ['6 — Pečovatel', '2, 4, 9', 'Náročná s 1, 7'],
              ['7 — Mudrc', '5, 9, 11', 'Náročná s 3, 6'],
              ['8 — Vůdce', '2, 4, 6', 'Náročná s 1, 9'],
              ['9 — Idealista', '3, 6, 9', 'Náročná s 2, 8'],
            ].map(([num, good, hard]) => (
              <div key={num} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                <div className="w-32 font-semibold text-gray-900 text-sm">{num}</div>
                <div className="flex-1">
                  <span className="text-green-600 text-sm">Silná: {good}</span>
                  <span className="text-gray-300 mx-2">·</span>
                  <span className="text-orange-500 text-sm">{hard}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-xs mt-4">
            Toto je zjednodušený přehled. Cosmatch počítá vícevrstvý skór pro každou konkrétní kombinaci dat.
          </p>
        </div>

        {/* FAQ */}
        <div className="card p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Časté otázky</h2>
          <div className="space-y-6">
            {FAQ.map(({ q, a }) => (
              <div key={q}>
                <h3 className="font-semibold text-gray-900 mb-2">{q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Zjisti svůj archetyp</h2>
          <p className="text-gray-500 mb-6">
            Zadej datum narození a okamžitě uvidíš svůj numerologický profil a nejlepší shody.
          </p>
          <Link href="/test" className="btn-primary inline-block px-10 py-4 text-lg">
            Spustit kvíz zdarma
          </Link>
          <p className="text-gray-400 text-sm mt-3">Bez registrace, okamžitě.</p>
        </div>

        {/* Internal links */}
        <div className="mt-10 flex flex-wrap gap-4 justify-center text-sm">
          <Link href="/numerologie-vztahy" className="text-pink-500 underline">Numerologie a vztahy</Link>
          <Link href="/manifest-duvery" className="text-gray-400 underline">Manifest důvěry</Link>
          <Link href="/waitlist" className="text-gray-400 underline">Waitlist</Link>
        </div>

      </div>
    </div>
  )
}
