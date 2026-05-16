import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Manifest důvěry — Cosmatch',
  description: 'Sedm závazků, kterými se Cosmatch zavazuje vůči svým uživatelům. Žádné tmavé vzory, žádné reklamy, žádné prodávání dat.',
}

const principles = [
  {
    numeral: 'I',
    title: 'Žádné swipy pro swipy',
    body: 'Tinder vydělává na tom, jak dlouho v něm zůstaneš. My vyděláváme na tom, jak rychle nás opustíš. Cosmatch je navržen tak, aby se odstranil sám — ve chvíli, kdy najdeš člověka, se kterým to dává smysl.',
  },
  {
    numeral: 'II',
    title: 'Datum narození není data',
    body: 'Tvoje datum používáme jen k jediné věci: výpočtu kompatibility. Neprodáváme ho. Nepředáváme ho. Neprofilujeme tě podle něj mimo aplikaci. Je to klíč k tvému profilu, ne komodita.',
  },
  {
    numeral: 'III',
    title: 'Žádné tmavé vzory',
    body: 'Falešné notifikace neexistují. Skryté tlačítko pro zrušení neexistuje. Profil, který napsal robot, neexistuje. Když ti přijde zpráva, někdo ti opravdu napsal.',
  },
  {
    numeral: 'IV',
    title: 'Algoritmus, který umíme vysvětlit',
    body: 'Numerologická kompatibilita 35\u202f%, hodnoty a záměry 30\u202f%, vzdálenost 15\u202f%, aktivita 15\u202f%, společné zájmy 5\u202f%. Žádné placené pozice. Žádné skryté penalizace. Vzorec si můžeš přepočítat.',
  },
  {
    numeral: 'V',
    title: 'Bezpečnost není nadstandard',
    body: 'Česko je šestá nejzranitelnější země světa vůči romance scams — 45\u202f% uživatelů seznamek tu pravidelně narazí na podezřelý profil. Cosmatch proto nabízí ID verifikaci, Cloudflare Turnstile proti botům a Google/Facebook SSO bez hesla. Servery běží ve Frankfurtu (EU). Smazání účtu vyřídíme do hodiny.',
  },
  {
    numeral: 'VI',
    title: 'Žádné reklamy. Nikdy.',
    body: 'Cosmatch financují uživatelé, ne inzerenti. Tvoje pozornost není zboží. Pokud jednou uvidíš v aplikaci reklamu, znamená to, že jsme ji prodali — a tehdy bude na čase odejít.',
  },
  {
    numeral: 'VII',
    title: 'Záruky, ne sliby',
    body: 'Pokud nejsi spokojen s předplatným do 14\u202fdnů, peníze vrátíme bez vysvětlení. Pokud nás potřebuješ, píšeš na ahoj@cosmatch.cz a odpovídáme do 48\u202fhodin. Občas dříve.',
  },
  {
    numeral: 'VIII',
    title: 'Transparentní reportování',
    body: 'Každý měsíc zveřejníme, kolik podezřelých profilů jsme zablokovali, kolik reportů jsme vyřešili a kolik účtů jsme verifikovali. Žádné skrývání. Pokud Cosmatch v něčem selže, dozvíš se o tom první.',
  },
]

export default function ManifestDuvery() {
  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      {/* Top nav */}
      <div className="max-w-2xl mx-auto px-6 pt-8">
        <Link href="/" className="inline-block text-gray-500 hover:text-gray-900 text-sm transition">
          ← Cosmatch
        </Link>
      </div>

      <article className="max-w-2xl mx-auto px-6 pt-16 pb-24">

        {/* Masthead */}
        <header className="mb-20">
          <p className="eyebrow mb-6 text-pink-500">Manifest důvěry</p>
          <h1 className="serif-display text-5xl sm:text-6xl text-gray-900 leading-[1.05] font-medium mb-8 tracking-tight">
            Sedm závazků,<br />kterými se zavazujeme<br /><em className="italic text-pink-500">vůči tobě</em>.
          </h1>
          <hr className="rule w-16 border-gray-900 mb-8" />
          <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
            Cosmatch není aplikace o tom, jak tě udržet uvnitř. Je o tom, jak tě dostat ven —
            do skutečného života, ke skutečnému člověku. Pokud se v něčem z následujícího
            zmýlíme, čekáme tvůj e-mail.
          </p>
        </header>

        {/* Principles */}
        <div className="space-y-16">
          {principles.map((p, idx) => (
            <section key={p.numeral} className="grid grid-cols-[auto,1fr] gap-x-8 sm:gap-x-12">
              <div className="roman text-3xl sm:text-4xl text-pink-500 leading-none pt-2 select-none">
                {p.numeral}
              </div>
              <div>
                <h2 className="serif text-2xl sm:text-3xl text-gray-900 font-medium mb-4 leading-tight">
                  {p.title}
                </h2>
                <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">
                  {p.body}
                </p>
              </div>
              {idx < principles.length - 1 && (
                <div className="col-span-2 pt-16">
                  <hr className="rule" />
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Signature */}
        <footer className="mt-24 pt-12 border-t border-gray-200">
          <p className="eyebrow text-gray-400 mb-4">Podepsáno</p>
          <p className="serif text-2xl text-gray-900 italic mb-1">Simona Cibulková</p>
          <p className="text-sm text-gray-500">
            Zakladatelka Cosmatch — Praha, květen 2026
          </p>
          <p className="text-xs text-gray-400 mt-8 leading-relaxed">
            Mgr. Ing. Simona Cibulková · IČO 08419531 · ahoj@cosmatch.cz<br />
            Algoritmus se volně inspiruje numerologickou teorií Goldschneidera &amp; Elffers
            a Kadlecové. Výsledky slouží jako podpora rozhodování, ne jako absolutní pravda.
          </p>

          <div className="mt-12">
            <Link href="/" className="text-pink-500 font-medium hover:text-pink-600 transition text-sm tracking-wide">
              Zpět na úvod →
            </Link>
          </div>
        </footer>
      </article>
    </main>
  )
}
