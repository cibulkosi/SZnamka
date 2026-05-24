import type { Metadata } from 'next'
import Link from 'next/link'

const TITLE = 'Jak se počítá životní číslo — Decoz three-cycle metoda | Cosmatch'
const DESC = 'Kompletní průvodce výpočtem životního čísla podle moderního standardu (Decoz three-cycle). Historie metody od Pythagora po současnost, srovnání čtyř numerologických škol, master čísla 11/22/33, karmické dluhy a krok-za-krokem výpočet s příkladem.'
const URL = 'https://cosmatch.cz/numerologie/jak-pocitame'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL, languages: { 'cs-CZ': URL, 'x-default': URL } },
  openGraph: {
    title: TITLE, description: DESC, url: URL, type: 'article',
    siteName: 'Cosmatch', locale: 'cs_CZ',
    images: [{ url: 'https://cosmatch.cz/icon-512.png', width: 512, height: 512, alt: 'Cosmatch' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
  keywords: [
    'jak vypočítat životní číslo',
    'výpočet životního čísla',
    'Decoz three-cycle',
    'numerologie metoda',
    'master číslo 11 22 33',
    'Pythagorejská numerologie',
    'Chaldejská numerologie',
    'Cheiro',
    'Balliett',
    'Hans Decoz',
  ],
  authors: [{ name: 'Simona Cibulková' }],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: TITLE,
      description: DESC,
      author: { '@type': 'Person', name: 'Simona Cibulková', jobTitle: 'Zakladatelka Cosmatch' },
      publisher: { '@type': 'Organization', name: 'Cosmatch', logo: { '@type': 'ImageObject', url: 'https://cosmatch.cz/icon-512.png' } },
      datePublished: '2026-05-22',
      dateModified: '2026-05-23',
      mainEntityOfPage: { '@type': 'WebPage', '@id': URL },
      inLanguage: 'cs-CZ',
    },
    {
      '@type': 'HowTo',
      name: 'Jak vypočítat životní číslo (Decoz three-cycle metoda)',
      description: 'Postup výpočtu životního čísla z data narození podle Decoz three-cycle metody. Zachovává master čísla 11, 22, 33.',
      step: [
        { '@type': 'HowToStep', name: 'Redukuj měsíc', text: 'Sečti číslice měsíce, pokud výsledek není 1–9, 11, 22 nebo 33, redukuj dál.' },
        { '@type': 'HowToStep', name: 'Redukuj den', text: 'Sečti číslice dne narození, postup redukce zachová master čísla 11, 22, 33.' },
        { '@type': 'HowToStep', name: 'Redukuj rok', text: 'Sečti číslice roku, redukuj dál stejným postupem.' },
        { '@type': 'HowToStep', name: 'Sečti tři výsledky', text: 'Sečti redukované hodnoty měsíce, dne a roku.' },
        { '@type': 'HowToStep', name: 'Finální redukce', text: 'Pokud součet není 1–9, 11, 22, redukuj na finální životní číslo. Master 33 se redukuje na 6, pokud nebyl v jedné z komponent.' },
      ],
    },
  ],
}

export default function JakPocitamePage() {
  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link href="/numerologie" className="text-sm text-gray-500 hover:text-gray-900 transition">← Numerologie</Link>
      </div>

      <article className="max-w-2xl mx-auto px-6 pt-16 pb-24">

        {/* Masthead */}
        <header className="mb-12">
          <p className="eyebrow text-pink-500 mb-6">Metodika · 8 min čtení</p>
          <h1 className="serif-display text-5xl sm:text-6xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-8">
            Jak se počítá<br/><em className="italic text-pink-500">životní číslo</em>.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-8" />
          <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
            Cosmatch používá Decoz metodu, moderní standard západní numerologie, používaný v pracích od Balliett (1908) po Hay House (2013). Tady je celý postup, historický kontext a srovnání se třemi dalšími metodickými školami.
          </p>
          <p className="text-sm text-gray-500 mt-6">
            Autorka <span className="text-gray-900 italic serif">Simona Cibulková</span>
            <span className="text-gray-300 mx-2">·</span>
            <span>Praha, květen 2026</span>
          </p>
        </header>

        {/* TLDR */}
        <section className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 mb-16">
          <p className="eyebrow text-emerald-600 mb-3">Ve zkratce</p>
          <p className="text-gray-800 leading-relaxed text-[1.0625rem]">
            Existují tři neslučitelné metody výpočtu životního čísla. Cosmatch používá <strong className="text-gray-900 font-medium">Decoz three-cycle</strong> — redukujeme měsíc, den a rok zvlášť, master čísla 11/22/33 zachováváme. Pro datum <em className="italic">23. 7. 1992</em> je výsledek <strong className="text-gray-900 font-medium">životní číslo 6</strong>. Stejné datum by podle jiných systémů dalo 5 (Cheiro 1926) nebo 33/6 (Millman 1993) — proto je důležité vědět, který systém kdo používá.
          </p>
        </section>

        {/* I. Historie — Pythagoras → Decoz */}
        <section className="mb-16">
          <div className="grid grid-cols-[auto,1fr] gap-x-8 sm:gap-x-12">
            <div className="roman text-3xl sm:text-4xl text-pink-500 leading-none pt-2 select-none">I</div>
            <div>
              <h2 className="serif text-2xl sm:text-3xl text-gray-900 font-medium mb-5 leading-tight">Stručná historie metody</h2>
              <p className="dropcap text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
                Numerologie, tedy přiřazování čísel k osobnosti, má kořeny v <strong className="text-gray-900 font-medium">pythagorejské filozofii čísel</strong> (cca 500 př. n. l.). To, co dnes nazýváme „životní číslo", je ale výsledek 120-ti letého vývoje.
              </p>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
                Moderní západní numerologii zakládá <strong className="text-gray-900 font-medium">L. Dow Balliett</strong> svojí knihou <em className="italic">The Philosophy of Numbers: Their Tone and Colors</em> (1908). Balliett zavedla doktrínu <strong className="text-gray-900 font-medium">master čísel 11 a 22</strong> — vibrací, které se při výpočtu nemají redukovat.
              </p>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
                <strong className="text-gray-900 font-medium">Florence Campbell</strong> v knize <em className="italic">Your Days Are Numbered</em> (1931) jako první systematizovala Balliettové metodu do učebnice (Life Path, Soul Urge, Personal Year, Pinnacles, Challenges).
              </p>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
                <strong className="text-gray-900 font-medium">Juno Jordan</strong> v <em className="italic">Numerology: The Romance in Your Name</em> (1965) přidala aplikaci na vztahy.
              </p>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
                <strong className="text-gray-900 font-medium">Matthew O. Goodwin</strong> v dvoudílné <em className="italic">Numerology: The Complete Guide</em> (1981) přidal třetí master číslo <strong className="text-gray-900 font-medium">33</strong>.
              </p>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
                <strong className="text-gray-900 font-medium">Hans Decoz</strong> v <em className="italic">Numerology: Key to Your Inner Self</em> (Perigee/Tarcher, 2001) standardizoval celou metodu. Decoz pravidlo pro master 33 je dnes consensus: 33 zachováváme jen pokud je v jedné z komponent výpočtu (měsíc, den, rok). Ne z finálního součtu. Za zmínku stojí, že software DecozChart prodal přes 3 miliony reportů.
              </p>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">
                <strong className="text-gray-900 font-medium">Glynis McCants</strong> v <em className="italic">Love by the Numbers</em> (Sourcebooks, 2010) a <strong className="text-gray-900 font-medium">Michelle Buchanan</strong> v <em className="italic">The Numerology Guidebook</em> (Hay House, 2013) potvrdily Decozovu metodu jako moderní standard mainstreamové numerologie.
              </p>
            </div>
          </div>
        </section>

        <hr className="rule mb-16" />

        {/* II. Tři metodické školy */}
        <section className="mb-16">
          <div className="grid grid-cols-[auto,1fr] gap-x-8 sm:gap-x-12">
            <div className="roman text-3xl sm:text-4xl text-pink-500 leading-none pt-2 select-none">II</div>
            <div>
              <h2 className="serif text-2xl sm:text-3xl text-gray-900 font-medium mb-5 leading-tight">Tři neslučitelné metody</h2>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-6">
                Pro stejné datum <em className="italic">23. 7. 1992</em> dají různé numerologické školy jiné výsledky. Není jeden „správný", a záleží na tom, kterou tradici autor následuje.
              </p>

              {/* Method A — Chaldean */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6 mb-4">
                <p className="eyebrow text-gray-500 mb-2">Škola A — Chaldejská</p>
                <h3 className="serif text-xl text-gray-900 font-medium mb-2">Cheiro (1926)</h3>
                <p className="text-gray-700 text-[0.95rem] leading-relaxed mb-3">
                  Bere pouze <strong className="text-gray-900 font-medium">den narození</strong>. Jméno se počítá samostatně podle Chaldean abecedy (1–8, číslice 9 je vynechaná jako „posvátná"). Žádná master čísla tu nejsou.
                </p>
                <p className="text-sm text-gray-500"><strong className="text-gray-900 font-medium">Pro 23. 7. 1992:</strong> životní číslo 5 (23 → 2+3).</p>
              </div>

              {/* Method B — Single-sum */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6 mb-4">
                <p className="eyebrow text-gray-500 mb-2">Škola B — Pythagorejský součet všeho dohromady</p>
                <h3 className="serif text-xl text-gray-900 font-medium mb-2">David A. Phillips, Crawford &amp; Sullivan, většina českých příruček</h3>
                <p className="text-gray-700 text-[0.95rem] leading-relaxed mb-3">
                  Sečte se <strong className="text-gray-900 font-medium">všech 8 číslic data</strong> najednou, výsledek se redukuje.
                </p>
                <p className="text-sm text-gray-500"><strong className="text-gray-900 font-medium">Pro 23. 7. 1992:</strong> 2+3+0+7+1+9+9+2 = 33 → 6.</p>
              </div>

              {/* Method C — Three-cycle */}
              <div className="bg-pink-50 border border-pink-200 rounded-3xl p-6 mb-4">
                <p className="eyebrow text-pink-700 mb-2">Škola C — Pythagorejská three-cycle <span className="ml-2 inline-block bg-pink-500 text-white px-2 py-0.5 rounded-full text-[10px]">Cosmatch</span></p>
                <h3 className="serif text-xl text-gray-900 font-medium mb-2">Decoz, McCants, Buchanan — moderní standard</h3>
                <p className="text-gray-700 text-[0.95rem] leading-relaxed mb-3">
                  Měsíc, den a rok se redukují <strong className="text-gray-900 font-medium">odděleně</strong>. Master čísla 11/22/33 se v mezikroku zachovají. Pak se tři komponenty sečtou a finálně zredukují. Jen tato metoda umí rozlišit master číslo od náhodného součtu.
                </p>
                <p className="text-sm text-gray-500"><strong className="text-gray-900 font-medium">Pro 23. 7. 1992:</strong> 7 + 5 + 3 = 15 → 6.</p>
              </div>

              {/* Method D — Millman */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6">
                <p className="eyebrow text-gray-500 mb-2">Škola D — Dvou-ciferný kód</p>
                <h3 className="serif text-xl text-gray-900 font-medium mb-2">Dan Millman (1993)</h3>
                <p className="text-gray-700 text-[0.95rem] leading-relaxed mb-3">
                  Tady nastal radikální zlom, není tu žádná redukce. Místo 9 životních čísel má Millman <strong className="text-gray-900 font-medium">45 unikátních cest</strong> zapsaných jako dvojčíslí (např. 25/7, 34/7, 33/6 — všechna končí stejnou cifrou, ale liší se cestou).
                </p>
                <p className="text-sm text-gray-500"><strong className="text-gray-900 font-medium">Pro 23. 7. 1992:</strong> 33/6.</p>
              </div>
            </div>
          </div>
        </section>

        <hr className="rule mb-16" />

        {/* III. Krok-za-krokem výpočet */}
        <section className="mb-16">
          <div className="grid grid-cols-[auto,1fr] gap-x-8 sm:gap-x-12">
            <div className="roman text-3xl sm:text-4xl text-pink-500 leading-none pt-2 select-none">III</div>
            <div>
              <h2 className="serif text-2xl sm:text-3xl text-gray-900 font-medium mb-5 leading-tight">Decoz three-cycle krok za krokem</h2>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-6">
                Tady je přesný postup, který Cosmatch implementuje. Pro ilustraci použijeme datum <strong className="text-gray-900 font-medium">23. 7. 1992</strong>.
              </p>

              <div className="bg-white border border-gray-200 rounded-3xl p-8 mb-6 font-mono text-sm leading-relaxed">
                <div className="space-y-5">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Krok 1 — Měsíc</p>
                    <p className="text-gray-900">červenec = <strong>7</strong></p>
                    <p className="text-xs text-gray-500 mt-1">Měsíc 7 je už jednociferný, žádná redukce.</p>
                  </div>
                  <div className="border-t border-gray-100 pt-5">
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Krok 2 — Den</p>
                    <p className="text-gray-900">23 → 2 + 3 = <strong>5</strong></p>
                    <p className="text-xs text-gray-500 mt-1">Den 23 není master číslo (11/22), takže redukujeme.</p>
                  </div>
                  <div className="border-t border-gray-100 pt-5">
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Krok 3 — Rok</p>
                    <p className="text-gray-900">1992 → 1 + 9 + 9 + 2 = 21 → 2 + 1 = <strong>3</strong></p>
                    <p className="text-xs text-gray-500 mt-1">První mezisoučet 21 není master, redukujeme dál na 3.</p>
                  </div>
                  <div className="border-t border-gray-100 pt-5">
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Krok 4 — Součet tří komponent</p>
                    <p className="text-gray-900">7 + 5 + 3 = <strong>15</strong></p>
                  </div>
                  <div className="border-t border-gray-100 pt-5">
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Krok 5 — Finální redukce</p>
                    <p className="text-gray-900">15 → 1 + 5 = <strong className="text-pink-600 text-base">6</strong></p>
                    <p className="text-xs text-gray-500 mt-1">Životní číslo 6 — archetyp Pečovatel/ka.</p>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">
                Kdyby byla jakákoli z komponent (7, 5, 3) sama o sobě 11, 22 nebo 33, zachovali bychom ji jako master číslo v mezikroku. To je rozdíl mezi „skutečným" master 33 (např. narozen 29. listopadu — den 29→11, měsíc 11, rok zredukován) a 33, které jen náhodou vznikne sečtením. Tomu se říká „Decoz strict rule" a Cosmatch ho dodržuje. Mírnější autoři (Buchanan, McCants) zachovávají 33 i z finálního součtu — proto se s nimi může výsledek lišit.
              </p>
            </div>
          </div>
        </section>

        <hr className="rule mb-16" />

        {/* IV. Master čísla */}
        <section className="mb-16">
          <div className="grid grid-cols-[auto,1fr] gap-x-8 sm:gap-x-12">
            <div className="roman text-3xl sm:text-4xl text-pink-500 leading-none pt-2 select-none">IV</div>
            <div>
              <h2 className="serif text-2xl sm:text-3xl text-gray-900 font-medium mb-5 leading-tight">Master čísla 11, 22, 33</h2>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
                Master čísla jsou koncept, který do moderní numerologie zavedla <strong className="text-gray-900 font-medium">L. Dow Balliett v roce 1908</strong>. Reprezentují „nezredukovanou" vibraci, která nese intenzivnější potenciál — i intenzivnější výzvy.
              </p>

              <div className="bg-white border border-gray-200 rounded-3xl divide-y divide-gray-100 mb-6">
                <div className="px-6 py-5">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="serif-display text-3xl text-pink-500 font-medium tabular-nums">11</span>
                    <span className="serif text-lg text-gray-900 font-medium">Vizionář/ka — Duchovní posel</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">Hluboká intuice, citlivost, schopnost inspirovat. Stín: úzkost, hypersenzitivita, nesnesitelná energie pro okolí.</p>
                </div>
                <div className="px-6 py-5">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="serif-display text-3xl text-pink-500 font-medium tabular-nums">22</span>
                    <span className="serif text-lg text-gray-900 font-medium">Mistr/yně stavitel/ka</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">Vize plus praktičnost = schopnost realizovat velké projekty. Stín: workoholismus, podcenění blízkých vztahů.</p>
                </div>
                <div className="px-6 py-5">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="serif-display text-3xl text-pink-500 font-medium tabular-nums">33</span>
                    <span className="serif text-lg text-gray-900 font-medium">Mistr/yně lásky — Učitel/ka</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">Soucit, léčivá energie, schopnost milovat bezpodmínečně. Stín: dává tak moc, že riskuje vyhoření.</p>
                </div>
              </div>

              <p className="text-sm text-gray-500">
                Detailní rozbor master čísel je na samostatné stránce <Link href="/numerologie/master-cisla-11-22-33" className="text-pink-500 hover:underline">Master čísla 11, 22, 33</Link>.
              </p>
            </div>
          </div>
        </section>

        <hr className="rule mb-16" />

        {/* V. Spor o master 33 a další kontroverze */}
        <section className="mb-16">
          <div className="grid grid-cols-[auto,1fr] gap-x-8 sm:gap-x-12">
            <div className="roman text-3xl sm:text-4xl text-pink-500 leading-none pt-2 select-none">V</div>
            <div>
              <h2 className="serif text-2xl sm:text-3xl text-gray-900 font-medium mb-5 leading-tight">Kolik master čísel vlastně existuje?</h2>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-6">
                Tady je největší rozpor ve světě numerologie. Záleží, koho se zeptáš:
              </p>

              <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
                      <th className="px-5 py-3 font-medium">Autor</th>
                      <th className="px-5 py-3 font-medium text-center">Počet master čísel</th>
                      <th className="px-5 py-3 font-medium">Která</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr><td className="px-5 py-3 text-gray-900">Cheiro (1926)</td><td className="px-5 py-3 text-center font-medium">0</td><td className="px-5 py-3 text-gray-600">žádná — kompozitní čísla 10–52 mají vlastní význam</td></tr>
                    <tr><td className="px-5 py-3 text-gray-900">Balliett, Campbell, Jordan</td><td className="px-5 py-3 text-center font-medium">2</td><td className="px-5 py-3 text-gray-600">11, 22</td></tr>
                    <tr><td className="px-5 py-3 text-gray-900 font-medium bg-pink-50">Decoz, Cosmatch</td><td className="px-5 py-3 text-center font-medium bg-pink-50">3 (33 pokud ne finální součet)</td><td className="px-5 py-3 text-gray-600 bg-pink-50">11, 22, 33</td></tr>
                    <tr><td className="px-5 py-3 text-gray-900">Buchanan (2013)</td><td className="px-5 py-3 text-center font-medium">3</td><td className="px-5 py-3 text-gray-600">11, 22, 33 (vždy)</td></tr>
                    <tr><td className="px-5 py-3 text-gray-900">Javane &amp; Bunker (1979)</td><td className="px-5 py-3 text-center font-medium">4</td><td className="px-5 py-3 text-gray-600">11, 22, 33, 44</td></tr>
                    <tr><td className="px-5 py-3 text-gray-900">Goodwin (1981)</td><td className="px-5 py-3 text-center font-medium">5+</td><td className="px-5 py-3 text-gray-600">11, 22, 33, 44, 55, 66 (doubled numbers)</td></tr>
                    <tr><td className="px-5 py-3 text-gray-900">Millman (1993)</td><td className="px-5 py-3 text-center font-medium">n/a</td><td className="px-5 py-3 text-gray-600">žádná — 45 dvouciferných cest</td></tr>
                  </tbody>
                </table>
              </div>

              <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">
                Cosmatch zvolil <strong className="text-gray-900 font-medium">Decoz pozici se 3 master čísly</strong>. Je to dominantní moderní standard a kompatibilní s tím, co najdeš na worldnumerology.com, v Hay House knihách a ve většině numerologického softwaru.
              </p>
            </div>
          </div>
        </section>

        <hr className="rule mb-16" />

        {/* VI. Proč Decoz, ne ostatní */}
        <section className="mb-16">
          <div className="grid grid-cols-[auto,1fr] gap-x-8 sm:gap-x-12">
            <div className="roman text-3xl sm:text-4xl text-pink-500 leading-none pt-2 select-none">VI</div>
            <div>
              <h2 className="serif text-2xl sm:text-3xl text-gray-900 font-medium mb-5 leading-tight">Proč jsme zvolili Decoz</h2>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
                <strong className="text-gray-900 font-medium">Konzistence s tím, co lidé najdou jinde.</strong> Pokud si uživatel vyhledá „jaké je moje životní číslo" na jiné stránce, dostane v 80 % případů Decozův výsledek.
              </p>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">
                <strong className="text-gray-900 font-medium">Sčítání každého čísla zvlášť</strong> jako jediná metoda umí rozlišit „skutečné" master číslo od čísla, které jen náhodou vznikne sečtením.
              </p>
            </div>
          </div>
        </section>

        <hr className="rule mb-16" />

        {/* VII Karmické dluhy */}
        <section className="mb-16">
          <div className="grid grid-cols-[auto,1fr] gap-x-8 sm:gap-x-12">
            <div className="roman text-3xl sm:text-4xl text-pink-500 leading-none pt-2 select-none">VII</div>
            <div>
              <h2 className="serif text-2xl sm:text-3xl text-gray-900 font-medium mb-5 leading-tight">Karmické dluhy</h2>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
                <strong className="text-gray-900 font-medium">Karmické dluhy</strong> jsou specifické hodnoty před sčítáním (13, 14, 16, 19), které se mohou objevit při výpočtu životního čísla. Reprezentují „lekce z minulých životů", které vrhají stín na finální archetyp.
              </p>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
                Goodwin (1981), Decoz i Numerology.com je dokumentují jako důležitý modifikátor osobnosti. Přibližně <strong className="text-gray-900 font-medium">20–30 % populace</strong> má alespoň jeden karmický dluh v některé z core čísel.
              </p>

              <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden mb-4">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
                      <th className="px-4 py-3 font-medium">Dluh</th>
                      <th className="px-4 py-3 font-medium">Redukce</th>
                      <th className="px-4 py-3 font-medium">Lekce</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-3 text-gray-900 font-medium">13</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">→ 4 (Stavitel)</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">Lekce o lenosti, vyhýbání se práci, povrchnosti</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-900 font-medium">14</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">→ 5 (Dobrodruh)</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">Lekce o nadměrné svobodě, excesech, neukotvenosti</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-900 font-medium">16</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">→ 7 (Hledač)</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">Lekce o egu, pýše, zneužití intimity</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-900 font-medium">19</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">→ 1 (Průkopník)</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">Lekce o zneužití moci, manipulaci</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-gray-500">
                Cosmatch detekuje karmické dluhy z Tvého data narození. Pokud máš dluh, zobrazí se na profilové stránce Tvého životního čísla jako další vrstva sebepoznání.
              </p>
            </div>
          </div>
        </section>

        <hr className="rule mb-16" />

        {/* VIII. Co říká věda */}
        <section className="mb-16">
          <div className="grid grid-cols-[auto,1fr] gap-x-8 sm:gap-x-12">
            <div className="roman text-3xl sm:text-4xl text-pink-500 leading-none pt-2 select-none">VIII</div>
            <div>
              <h2 className="serif text-2xl sm:text-3xl text-gray-900 font-medium mb-5 leading-tight">Co o tom říká věda</h2>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
                Žádná z popsaných metod nebyla validována kontrolovanou studií. Ale existuje jeden výzkum z oblasti psychologie, který stojí za zmínku, protože se váže k tématu.
              </p>

              <div className="bg-white border border-gray-200 rounded-3xl p-6 mb-6">
                <p className="eyebrow text-gray-500 mb-2">Peer-reviewed studie</p>
                <h3 className="serif text-lg text-gray-900 font-medium mb-2">Jones, Pelham, Carvallo &amp; Mirenberg (2004) — Implicit egotism</h3>
                <p className="text-gray-700 text-[0.95rem] leading-relaxed mb-3">
                  Studie publikovaná v <em className="italic">Journal of Personality and Social Psychology</em> 87(5), 665–683 (PMID 15535778), provedla 7 studií zkoumajících tendenci preferovat osoby, které se nám podobají.
                </p>
                <p className="text-gray-700 text-[0.95rem] leading-relaxed mb-3">
                  Studie ukázala, že lidé mají větší pravděpodobnost být manželé těch, jejichž jméno se podobá jejich vlastnímu. A existuje mírná tendence k atraktivitě podle podobných číselných kódů.
                </p>
                <p className="text-sm text-gray-500 italic">
                  Není to sice validace numerologické kompatibility, protože se týká podobnosti jmen, ne kompatibility podle data narození. Ale validuje jakýsi obecný princip, že „lidi přitahují osoby, které jsou jim podobné".
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-3xl p-6 mb-6">
                <p className="eyebrow text-gray-500 mb-2">Skeptická literatura</p>
                <h3 className="serif text-lg text-gray-900 font-medium mb-2">Numerologie jako „paranormal belief"</h3>
                <p className="text-gray-700 text-[0.95rem] leading-relaxed mb-3">
                  Lindeman &amp; Aarnio (2007) v <em className="italic">Journal of Research in Personality</em> 41(4) klasifikují numerologii a astrologii jako kategorie paranormálních přesvědčení. Robert T. Carroll v <em className="italic">The Skeptic's Dictionary</em> (Wiley, 2003) charakterizuje numerologii jako pseudovědu, protože její tvrzení „nelze testovat — jsou tak vágní a tvárné, že cokoli relevantního lze do této teorie nacpat."
                </p>
                <p className="text-gray-700 text-[0.95rem] leading-relaxed">
                  Cosmatch tyto kritiky neignoruje — souhlasíme, že popisy archetypů jsou natolik obecné, aby v nich každý našel kus sebe (Barnumův efekt). Hodnota není v predikci, ale v tom, k jakému rozhovoru Ti tradice otevírá dveře.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-3xl p-6">
                <p className="eyebrow text-gray-500 mb-2">Historický corrective</p>
                <h3 className="serif text-lg text-gray-900 font-medium mb-2">Pythagoras vs. „pythagorovská numerologie"</h3>
                <p className="text-gray-700 text-[0.95rem] leading-relaxed">
                  Walter Burkert v <em className="italic">Lore and Science in Ancient Pythagoreanism</em> (Harvard University Press, 1972), což je standardní akademický text k tématu, ukazuje, že Pythagoras a jeho škola byli matematičtí filozofové, ne numerologičtí věštci. „Pythagorovská numerologie" používaná dnes je ale rekonstrukce z 19.–20. století (Theosophie, Balliett, Cheiro), ne přímá linie z antiky. Pythagoras je historický inspirační bod, ne přímý zdroj výpočetní metody.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white rounded-3xl border border-gray-100 p-10 mb-16">
          <p className="eyebrow text-pink-500 mb-4">Vyzkoušej</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">
            Zjisti své životní číslo.
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8 text-[1.0625rem]">
            Zadej datum narození a Cosmatch Ti spočítá životní číslo přesně podle Decoz three-cycle metody, i s archetypem a nejlepšími shodami.
          </p>
          <Link href="/test" className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-full text-base font-medium hover:bg-gray-800 transition">
            Spustit kvíz
          </Link>
        </section>

        {/* Související */}
        <section>
          <p className="eyebrow text-pink-500 mb-4">Pokračuj ve čtení</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-10">
            Související
          </h2>
          <div className="space-y-4">
            <Link href="/numerologie/master-cisla-11-22-33" className="block bg-white border border-gray-200 hover:border-gray-900 rounded-2xl p-6 transition group">
              <p className="eyebrow text-gray-400 mb-2">Hloubka</p>
              <h3 className="serif text-xl text-gray-900 font-medium mb-1 group-hover:text-pink-500 transition">Master čísla 11, 22, 33 →</h3>
              <p className="text-gray-600 text-[0.95rem] leading-relaxed">Co znamená narodit se s master číslem — intenzivnější potenciál, intenzivnější výzvy.</p>
            </Link>
            <Link href="/zdroje" className="block bg-white border border-gray-200 hover:border-gray-900 rounded-2xl p-6 transition group">
              <p className="eyebrow text-gray-400 mb-2">Zdroje</p>
              <h3 className="serif text-xl text-gray-900 font-medium mb-1 group-hover:text-pink-500 transition">17 zdrojů numerologie a astrologie →</h3>
              <p className="text-gray-600 text-[0.95rem] leading-relaxed">Kompletní seznam autorů, na kterých Cosmatch staví — od Pythagora po Hay House.</p>
            </Link>
            <Link href="/jak-funguje-cosmatch" className="block bg-white border border-gray-200 hover:border-gray-900 rounded-2xl p-6 transition group">
              <p className="eyebrow text-gray-400 mb-2">Metodika</p>
              <h3 className="serif text-xl text-gray-900 font-medium mb-1 group-hover:text-pink-500 transition">Jak Cosmatch opravdu funguje →</h3>
              <p className="text-gray-600 text-[0.95rem] leading-relaxed">Sedm vrstev kompatibilitního algoritmu — od životního čísla po aktivitu.</p>
            </Link>
          </div>
        </section>

        <footer className="mt-16 pt-12 border-t border-gray-200">
          <p className="text-xs text-gray-400 leading-relaxed">
            Cosmatch · Mgr. Ing. Simona Cibulková · IČO 08419531 · Praha 2026.
            Numerologie není empirická věda — výsledky používejte jako podporu rozhodování, ne jako absolutní pravdu.
          </p>
        </footer>

      </article>
    </main>
  )
}
