import type { Metadata } from 'next'
import Link from 'next/link'
import { ARCHETYPE_SOURCES, BARNUM_DISCLOSURE } from '@/lib/archetypes'

const TITLE = 'Zdroje numerologie | Cosmatch'
const DESC = 'Cosmatch staví na 14 klíčových zdrojích numerologie a personology — od Pythagora přes Cheira, Florence Campbell, Juno Jordan a Matthewa Goodwina, k současným autorům jako Hans Decoz, Glynis McCants nebo Michelle Buchanan. Z české tradice cituje Jitku Kadlecovou a Helmuta Kritzingera.'
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
            Cosmatch nevymýšlí numerologii. Staví na 14 klíčových zdrojích moderní západní (pythagorovské) i české numerologické tradice — od antiky po současné autory.
            Tady je seznam knih a autorů, ze kterých čerpá metodologie i copywriting.
          </p>
        </header>

        <section className="mb-16 space-y-12">
          {ARCHETYPE_SOURCES.map((src, i) => (
            <div key={i} className="grid grid-cols-[auto,1fr] gap-x-6">
              <div className="text-right">
                <div className="roman text-2xl text-pink-500 leading-none">{['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV'][i]}</div>
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
            Pro kompatibilitu kombinujeme více zdrojů personology tradice — denní profily inspirované pop-culture frameworky Goldschneidera &amp; Elfferse a referenčními průvodci Crawfordové &amp; Sullivanové, doplněné o tříúrovňový model kompatibility z anglo-americké love-by-the-numbers literatury. Cosmatch vlastní pětici kategorií: Spřízněné duše, Láska &amp; přátelství, Prospěšné, Osudové přitažlivosti, Náročné.
          </p>
        </section>

        <hr className="rule mb-16" />

        {/* Tři metodické školy */}
        <section className="mb-16">
          <p className="eyebrow text-pink-500 mb-4">Tři metodické školy</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            Proč existuje 14 zdrojů.
          </h2>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-6">
            Numerologie není jednotný systém — pro stejné datum narození dají různé školy různá životní čísla. 13 autorů, ze kterých Cosmatch čerpá, se dělí do tří metodických rodin.
          </p>

          <div className="space-y-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <p className="eyebrow text-gray-500 mb-2">Škola A — Chaldejská</p>
              <h3 className="serif text-lg text-gray-900 font-medium mb-2">Cheiro (1926)</h3>
              <p className="text-gray-700 text-[0.95rem] leading-relaxed">
                Pouze den narození („birth number") + jméno podle Chaldean abecedy 1–8. Žádná master čísla. Kompozitní čísla 10–52 mají vlastní význam.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <p className="eyebrow text-gray-500 mb-2">Škola B — Pythagorejská single-sum</p>
              <h3 className="serif text-lg text-gray-900 font-medium mb-2">Phillips, Crawford & Sullivan, většina českých příruček</h3>
              <p className="text-gray-700 text-[0.95rem] leading-relaxed">
                Sečte všech 8 číslic data najednou, výsledek redukuje. Master čísla zachovává nebo redukuje podle autora.
              </p>
            </div>
            <div className="bg-pink-50 border border-pink-200 rounded-2xl p-6">
              <p className="eyebrow text-pink-700 mb-2">Škola C — Pythagorejská three-cycle <span className="ml-2 inline-block bg-pink-500 text-white px-2 py-0.5 rounded-full text-[10px]">Cosmatch</span></p>
              <h3 className="serif text-lg text-gray-900 font-medium mb-2">Balliett (1908) → Campbell → Jordan → Goodwin → Decoz → McCants → Buchanan</h3>
              <p className="text-gray-700 text-[0.95rem] leading-relaxed">
                Redukuje měsíc, den a rok zvlášť, master čísla 11/22/33 zachovává v mezikroku. Jediná metoda, která umí rozlišit „skutečné" master číslo od náhodného součtu. <strong className="text-gray-900 font-medium">Moderní standard západní numerologie.</strong>
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <p className="eyebrow text-gray-500 mb-2">Škola D — Dvou-cifrový kód</p>
              <h3 className="serif text-lg text-gray-900 font-medium mb-2">Dan Millman (1993)</h3>
              <p className="text-gray-700 text-[0.95rem] leading-relaxed">
                Radikální zlom — žádná redukce. 45 unikátních cest zapsaných jako dvojčíslí (např. 33/6, 25/7). Cosmatch tuto metodu neimplementuje, ale Millmana cituje jako důležitý alternativní pohled.
              </p>
            </div>
          </div>

          <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">
            Detailní postup výpočtu, srovnání všech metod a krok-za-krokem příklad najdeš na stránce <Link href="/numerologie/jak-pocitame" className="text-pink-500 hover:underline">Jak se počítá životní číslo</Link>.
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
