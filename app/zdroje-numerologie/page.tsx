import type { Metadata } from 'next'
import Link from 'next/link'
import { ARCHETYPE_SOURCES, BARNUM_DISCLOSURE } from '@/lib/archetypes'

const TITLE = 'Zdroje numerologie | Cosmatch'
const DESC = 'Cosmatch staví na 8 zdrojích moderní západní (Pythagorovské) numerologie: Pythagoras, Juno Jordan, Matthew Goodwin, Hans Decoz, Dan Millman, Michelle Buchanan, Gary Goldschneider, Jitka Kadlecová.'
const URL = 'https://cosmatch.cz/zdroje-numerologie'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL, languages: { 'cs-CZ': URL, 'x-default': URL } },
  openGraph: { title: TITLE, description: DESC, url: URL, type: 'article', siteName: 'Cosmatch', locale: 'cs_CZ' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
}

export default function ZdrojeNumerologie() {
  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">← Cosmatch</Link>
      </div>

      <article className="max-w-2xl mx-auto px-6 pt-16 pb-24">

        <header className="mb-16">
          <p className="eyebrow text-pink-500 mb-6">Zdroje</p>
          <h1 className="serif-display text-5xl sm:text-6xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-8">
            Z čeho<br/><em className="italic text-pink-500">Cosmatch vychází</em>.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-8" />
          <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
            Cosmatch nevymýšlí numerologii. Staví na 2 500 letech tradice — od Pythagora po současné autory.
            Tady je kompletní seznam zdrojů, na kterých algoritmus a archetypy stojí.
          </p>
        </header>

        <section className="mb-16 space-y-12">
          {ARCHETYPE_SOURCES.map((src, i) => (
            <div key={i} className="grid grid-cols-[auto,1fr] gap-x-6">
              <div className="text-right">
                <div className="roman text-2xl text-pink-500 leading-none">{['I','II','III','IV','V','VI','VII','VIII'][i]}</div>
              </div>
              <div>
                <h3 className="serif text-xl text-gray-900 font-medium leading-tight mb-1">{src.author}</h3>
                {src.work && <p className="text-sm text-gray-500 italic mb-2">{src.work}</p>}
                {src.era && <p className="text-sm text-gray-500 italic mb-2">{src.era}</p>}
                <p className="text-gray-700 leading-[1.75] text-[0.95rem]">{src.role}</p>
              </div>
            </div>
          ))}
        </section>

        <hr className="rule mb-16" />

        <section className="mb-16">
          <p className="eyebrow text-pink-500 mb-4">Co Cosmatch dělá s těmito zdroji</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            Syntéza, ne kopie.
          </h2>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
            Cosmatch nepřepisuje žádnou z těchto knih. České texty archetypů, partnership lines i metodologie jsou autorské Cosmatch — vycházejí ze studia těchto zdrojů, ale jsou napsané pro česky mluvícího uživatele 27–45 let s vlastním tónem.
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
            Pro výpočet životního čísla používáme <strong className="text-gray-900 font-medium">Decoz Three-Cycle Method</strong> — redukujeme měsíc, den a rok narození zvlášť, zachováváme master čísla 11/22/33 v komponentech, pak sečteme a redukujeme finální výsledek. Master 33 se zachová jen pokud aspoň jedna komponenta byla také master (Decoz strict rule).
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">
            Pro kompatibilitu vycházíme z 366 denních profilů z knihy Goldschneider &amp; Elffers (1994). Naše databáze obsahuje 5 kategorií vztahů pro každý pár dnů: Spřízněné duše, Láska &amp; přátelství, Prospěšné, Osudové přitažlivosti, Náročné.
          </p>
        </section>

        <hr className="rule mb-16" />

        <section className="bg-white border border-gray-200 rounded-3xl p-8 mb-16">
          <p className="eyebrow text-pink-500 mb-3">Honest disclaimer</p>
          <h2 className="serif text-xl text-gray-900 font-medium mb-3">Numerologie není věda.</h2>
          <p className="text-gray-700 leading-[1.75] text-[0.95rem]">
            {BARNUM_DISCLOSURE}
          </p>
        </section>

        <footer className="mt-16 pt-8 border-t border-gray-200">
          <Link href="/jak-funguje-cosmatch" className="text-sm text-pink-500 hover:underline">
            → Detail algoritmu Cosmatch
          </Link>
        </footer>

      </article>
    </main>
  )
}
