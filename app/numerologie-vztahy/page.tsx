import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Numerologie a vztahy — Jak čísla ovlivňují lásku | Cosmatch',
  description: 'Numerologie ve vztazích: jak životní číslo ovlivňuje partnerský výběr, komunikaci a dlouhodobou kompatibilitu. Praktický průvodce.',
  keywords: 'numerologie vztahy, numerologie láska, životní číslo partner, numerologie kompatibilita partnerů',
}

const SECTIONS = [
  {
    num: 'I',
    title: 'Proč se přitahujeme k určitým lidem?',
    paras: [
      'Psychologové hovoří o „familiarity effect" — tendenci preferovat lidi, kteří nám připomínají vzorce z dětství. Numerologie přidává jiný pohled: každé životní číslo nese specifické energetické kvality, které přirozeně rezonují s některými čísly a tvoří třecí plochy s jinými.',
      'To neznamená determinismus. Znamená to, že pochopením svého čísla lépe pochopíš, co od partnera přirozeně očekáváš — a kde mohou nastat konflikty dříve, než eskalují.',
    ],
  },
  {
    num: 'II',
    title: 'Tři typy vztahových čísel',
    paras: [
      'Numerologie rozlišuje tři hlavní kategorie kompatibility: přirozenou rezonanci (čísla, která rozumí tvé energii), komplementární shodu (čísla, která doplňují to, co ti chybí) a karmická spojení (čísla, která přinášejí lekce — ne vždy pohodlné).',
      'Cosmatch tyto kategorie označuje jako Oboustrannou shodu, Spřízněné duše a Karmickou zkoušku. Žádná z nich není špatná — karmická spojení mohou být nejhlubší lekce v životě.',
    ],
  },
  {
    num: 'III',
    title: 'Čísla v praxi: co funguje a co ne',
    paras: [
      'Číslo 4 (Stavitel) a 6 (Pečovatel) sdílejí hodnoty stability a věrnosti — přirozeně si rozumí. Číslo 5 (Dobrodruh) a 4 (Stavitel) mívají napjatou dynamiku: jeden chce změnu, druhý jistotu.',
      'Klíčové je vědomí. Pár pětky a čtyřky, který tuto dynamiku chápe, může vytvořit rovnováhu, o které jiné páry jen sní. Numerologie je nástroj sebepoznání, ne osud.',
    ],
  },
  {
    num: 'IV',
    title: 'Master čísla ve vztazích',
    paras: [
      'Lidé s master číslem (11, 22, 33) bývají ve vztazích intenzivnější — v dobrém i špatném. Vizionář (11) potřebuje partnera, který zvládne jeho emocionální hloubku. Architekt (22) může být workoholik, který podceňuje vztahovou péči. Mistr lásky (33) dává tak moc, že riskuje vyhoření.',
      'Všechna tři master čísla hledají intenzitu a smysl — a snadno se nudia povrchními vztahy.',
    ],
  },
]

export default function NumerologieVztahyPage() {
  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">← Cosmatch</Link>
      </div>

      <article className="max-w-2xl mx-auto px-6 pt-16 pb-24">
        {/* Masthead */}
        <header className="mb-20">
          <p className="eyebrow text-pink-500 mb-6">Esej</p>
          <h1 className="serif-display text-5xl sm:text-6xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-8">
            Numerologie<br/>a <em className="italic text-pink-500">vztahy</em>.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-8" />
          <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
            Jak životní číslo ovlivňuje partnerský výběr, komunikaci a to,
            proč se pořád přitahuješ k určitému typu lidí.
          </p>
        </header>

        {/* Sections — editorial */}
        <div className="space-y-16">
          {SECTIONS.map((s, idx) => (
            <section key={s.num} className="grid grid-cols-[auto,1fr] gap-x-8 sm:gap-x-12">
              <div className="roman text-3xl sm:text-4xl text-pink-500 leading-none pt-2 select-none">{s.num}</div>
              <div>
                <h2 className="serif text-2xl sm:text-3xl text-gray-900 font-medium mb-5 leading-tight">{s.title}</h2>
                {s.paras.map((p, i) => (
                  <p key={i} className={`text-gray-700 leading-[1.75] text-[1.0625rem] ${i === 0 ? 'dropcap' : ''} ${i < s.paras.length - 1 ? 'mb-4' : ''}`}>
                    {p}
                  </p>
                ))}
              </div>
              {idx < SECTIONS.length - 1 && <div className="col-span-2 pt-16"><hr className="rule" /></div>}
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

        {/* Internal links */}
        <footer className="mt-16 pt-12 border-t border-gray-200 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/kompatibilita-podle-data-narozeni" className="text-pink-500 hover:text-pink-600 transition">Kompatibilita podle data narození →</Link>
          <Link href="/manifest-duvery" className="text-gray-500 hover:text-gray-900 transition">Manifest důvěry</Link>
          <Link href="/waitlist" className="text-gray-500 hover:text-gray-900 transition">Waitlist</Link>
        </footer>
      </article>
    </main>
  )
}
