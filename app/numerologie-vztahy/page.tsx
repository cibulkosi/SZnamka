import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Numerologie a vztahy — Jak čísla ovlivňují lásku | Cosmatch',
  description: 'Numerologie ve vztazích: jak životní číslo ovlivňuje partnerský výběr, komunikaci a dlouhodobou kompatibilitu. Praktický průvodce.',
  keywords: 'numerologie vztahy, numerologie láska, životní číslo partner, numerologie kompatibilita partnerů',
}

const SECTIONS = [
  {
    title: 'Proč se přitahujeme k určitým lidem?',
    content: `Psychologové hovoří o "familiarity effect" — tendenci preferovat lidi, kteří nám připomínají
    vzorce z dětství. Numerologie přidává jiný pohled: každé životní číslo nese specifické energetické
    kvality, které přirozeně rezonují s určitými čísly a tvoří třecí plochy s jinými.
    
    To neznamená determinismus. Znamená to, že pochopením svého čísla lépe pochopíš, 
    co od partnera přirozeně očekáváš — a kde mohou nastat konflikty dříve, než eskalují.`,
  },
  {
    title: 'Tři typy vztahových čísel',
    content: `Numerologie rozlišuje tři hlavní kategorie kompatibility: přirozenou rezonanci (čísla,
    která přirozeně rozumí tvé energii), komplementární shodu (čísla, která doplňují to, co ti chybí)
    a karmaická spojení (čísla, která přinášejí lekce — ne vždy pohodlné).
    
    Cosmatch označuje tyto kategorie jako "Oboustrannou shodu", "Spřízněné duše" a "Karmickou zkoušku".
    Žádná kategorie není špatná — karmaická spojení mohou být nejhlubší lekce v životě.`,
  },
  {
    title: 'Čísla v praxi: co funguje a co ne',
    content: `Číslo 4 (Stavitel) a číslo 6 (Pečovatel) sdílejí hodnoty stability a věrnosti — přirozeně
    si rozumí. Číslo 5 (Dobrodruh) a číslo 4 (Stavitel) mohou mít napjatou dynamiku: jeden chce změnu,
    druhý jistotu.
    
    Ale klíčové je vědomí — pár čísel 5 a 4, který tuto dynamiku chápe, může vytvořit
    rovnováhu, o které jiné páry jen sní. Numerologie je nástroj sebepoznání, ne osud.`,
  },
  {
    title: 'Master čísla ve vztazích',
    content: `Lidé s master číslem (11, 22, 33) bývají ve vztazích intenzivnější — v dobrém i zlém.
    Číslo 11 (Vizionář) potřebuje partnera, který zvládne jeho emocionální hloubku. Číslo 22 
    (Architekt) může být workoholik, který podceňuje vztahovou péči. Číslo 33 (Mistr lásky) 
    dává tak moc, že riskuje vyhoření.
    
    Všechna tři master čísla hledají intenzitu a smysl — a snadno se nudia povrchními vztahy.`,
  },
]

export default function NumerologieVztahyPage() {
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
          <h1 className="text-3xl font-black text-gray-900 mb-4">Numerologie a vztahy</h1>
          <p className="text-gray-500 text-lg leading-relaxed mb-6">
            Jak životní číslo ovlivňuje partnerský výběr, komunikaci a to,
            proč se pořád přitahuješ k určitému typu lidí.
          </p>
          <Link href="/test" className="btn-primary inline-block px-8 py-4">
            Zjistit své číslo
          </Link>
        </div>

        {/* Article sections */}
        <div className="space-y-6">
          {SECTIONS.map(s => (
            <div key={s.title} className="card p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{s.title}</h2>
              {s.content.trim().split('\n\n').map((para, i) => (
                <p key={i} className="text-gray-600 leading-relaxed mb-3 last:mb-0">
                  {para.trim()}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="card p-8 mt-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Zjisti svůj profil</h2>
          <p className="text-gray-500 mb-6">
            Zadej datum narození a okamžitě zjistíš svůj archetyp a nejlepší shody.
            Bez registrace, zdarma.
          </p>
          <Link href="/test" className="btn-primary inline-block px-10 py-4 text-lg">
            Spustit kvíz
          </Link>
        </div>

        {/* Internal links */}
        <div className="mt-10 flex flex-wrap gap-4 justify-center text-sm">
          <Link href="/kompatibilita-podle-data-narozeni" className="text-pink-500 underline">
            Kompatibilita podle data narození
          </Link>
          <Link href="/waitlist" className="text-gray-400 underline">Waitlist</Link>
          <Link href="/manifest-duvery" className="text-gray-400 underline">Manifest důvěry</Link>
        </div>

      </div>
    </div>
  )
}
