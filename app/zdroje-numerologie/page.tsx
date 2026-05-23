import type { Metadata } from 'next'
import Link from 'next/link'

const TITLE = 'Zdroje numerologie — 14 knih a autorů, na kterých Cosmatch staví | Cosmatch'
const DESC = 'Cosmatch v numerologii čerpá ze 14 klíčových zdrojů moderní západní i české tradice — od Pythagora po současné autory (Goodwin, Decoz, McCants, Buchanan, Kadlecová, Davidová). Knihy, autoři, metodologie.'
const URL = 'https://cosmatch.cz/zdroje-numerologie'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL, languages: { 'cs-CZ': URL, 'x-default': URL } },
  openGraph: {
    title: TITLE, description: DESC, url: URL, type: 'article',
    siteName: 'Cosmatch', locale: 'cs_CZ',
    images: [{ url: 'https://cosmatch.cz/og-image.png', width: 1200, height: 630, alt: 'Cosmatch' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: ['https://cosmatch.cz/og-image.png'] },
  keywords: [
    'numerologie zdroje', 'numerologie knihy', 'Decoz', 'McCants', 'Goodwin',
    'Kadlecová', 'Davidová', 'Buchanan', 'Cheiro', 'Pythagoras', 'numerologie čeština',
    'three-cycle method', 'chaldejská numerologie', 'pythagorejská numerologie',
  ],
  authors: [{ name: 'Simona Cibulková' }],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: TITLE,
  description: DESC,
  author: { '@type': 'Person', name: 'Simona Cibulková', jobTitle: 'Zakladatelka Cosmatch' },
  publisher: { '@type': 'Organization', name: 'Cosmatch', logo: { '@type': 'ImageObject', url: 'https://cosmatch.cz/icon-512.png' } },
  datePublished: '2026-05-23',
  dateModified: '2026-05-23',
  mainEntityOfPage: { '@type': 'WebPage', '@id': URL },
  inLanguage: 'cs-CZ',
}

const SOURCES = [
  {
    roman: 'I',
    author: 'Pythagoras',
    work: '~500 př. n. l.',
    role: 'Původce západní (pythagorovské) numerologie. Základní princip: čísla jako vyjádření kosmického řádu. (Současná „pythagorovská" numerologie je rekonstrukce z 19.–20. století; viz Burkert, Lore and Science in Ancient Pythagoreanism, Harvard 1972.)',
  },
  {
    roman: 'II',
    author: 'Cheiro (William J. Warner)',
    work: 'Cheiro\'s Book of Numbers (Herbert Jenkins, 1926)',
    role: 'Definoval chaldejský systém přiřazení čísel písmenům a první pravidla shody/neshody mezi čísly — historický kořen kompatibilní numerologie.',
  },
  {
    roman: 'III',
    author: 'Florence Campbell',
    work: 'Your Days Are Numbered (1931, reedice DeVorss)',
    role: 'První moderní kniha západní numerologie. Žačka L. Dow Balliett, propojila New Thought s číselným systémem 20. století.',
  },
  {
    roman: 'IV',
    author: 'Juno Jordan',
    work: 'Numerology: The Romance in Your Name (DeVorss, 1965)',
    role: 'Historická klasika numerologie, aplikovaná specificky na vztahy a romantiku. Dcera Julie Seton, žačka L. Dow Balliett.',
  },
  {
    roman: 'V',
    author: 'Matthew Oliver Goodwin',
    work: 'Numerology: The Complete Guide, Vol. 1 + 2 (Newcastle, 1981)',
    role: 'Nejslavnější kniha americké numerologie poloviny století. Používá tradiční systém (spolu s master čísly 11 a 22 a 33).',
  },
  {
    roman: 'VI',
    author: 'Dan Millman',
    work: 'The Life You Were Born to Live (HJ Kramer, 1993; CZ: Čísla života, Eminent 2003, reissue Martinus 2017)',
    role: 'Spojuje „životní číslo" se skrytou dynamikou vztahů.',
  },
  {
    roman: 'VII',
    author: 'Gary Goldschneider + Joost Elffers',
    work: 'The Secret Language of Birthdays (Penguin Studio, 1994)',
    role: 'Kniha založená na pozorování 14 000 osob. Inspirace pro celkové pojetí archetypu v Cosmatch.',
  },
  {
    roman: 'VIII',
    author: 'Saffi Crawford + Geraldine Sullivan',
    work: 'The Power of Birthdays, Stars & Numbers (Ballantine, 1998; CZ: Magická hra čísel a hvězd, Ikar 2002)',
    role: 'Encyklopedický 366denní referenční průvodce kombinující astrologii, fixní hvězdy a numerologii. Jedna z klíčových amerických referenčních prací pro osobnostní profil podle dne narození.',
  },
  {
    roman: 'IX',
    author: 'Helmut-Whitey Kritzinger',
    work: 'Partnerství a numerologie (Pragma, 1999, český překlad)',
    role: 'Německy psaná kniha hermetické numerologie, vydaná jako jeden z česky dostupných titulů o partnerské numerologii. Používá data narození obou partnerů.',
  },
  {
    roman: 'X',
    author: 'Hans Decoz',
    work: 'Numerology: Key to Your Inner Self (Perigee/Tarcher, 2001)',
    role: 'Moderní západní standard. Cosmatch používá jeho Three-Cycle Method pro výpočet životního čísla — redukujeme měsíc, den, rok zvlášť, master čísla 11/22/33 zachováváme v mezikroku.',
  },
  {
    roman: 'XI',
    author: 'Jitka Kadlecová',
    work: 'Datum narození a jeho vliv na náš charakter (Eminent, 2006)',
    role: 'Česká numerologická kniha z 21. století. Inspirace pro lokalizaci archetypů do české kultury a jazyka.',
  },
  {
    roman: 'XII',
    author: 'Glynis McCants',
    work: 'Love by the Numbers (Sourcebooks Casablanca, 2010)',
    role: 'Současný mainstream partnerské numerologie. Tři vrstvy vztahové kompatibility Cosmatch adaptoval do českých kategorií Spřízněné duše, Prospěšný vztah a Magnetická tenze.',
  },
  {
    roman: 'XIII',
    author: 'Ester Davidová',
    work: 'Partnerská osudová čísla — Jak na vztahy? (self-published, 2020)',
    role: 'Současný český autorský počin v partnerské numerologii. Definuje 9 „partnerských osudových čísel" jako součet životních čísel obou partnerů — model blízký Cosmatch kategoriím kompatibility.',
  },
  {
    roman: 'XIV',
    author: 'Michelle Buchanan',
    work: 'The Numerology Guidebook (Hay House, 2013)',
    role: 'Současný mainstream s kapitolami o výběru partnera, načasování vztahů a master číslech 11/22/33.',
  },
] as const

export default function ZdrojeNumerologiePage() {
  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">← Cosmatch</Link>
      </div>

      <article className="max-w-2xl mx-auto px-6 pt-16 pb-24">

        {/* Hero */}
        <header className="mb-12">
          <p className="eyebrow text-pink-500 mb-6">Zdroje</p>
          <h1 className="serif-display text-5xl sm:text-6xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-6">
            Z čeho<br/><em className="italic text-pink-500">Cosmatch vychází</em>.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-8" />
          <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
            V numerologii Cosmatch staví na 14 klíčových zdrojích moderní západní i české numerologické tradice — od antiky po současné autory. Níže je seznam knih a autorů, ze kterých čerpá metodologie.
          </p>
        </header>

        {/* 14 zdrojů */}
        <section className="mb-20">
          <div className="space-y-10">
            {SOURCES.map((src) => (
              <div key={src.roman} className="grid grid-cols-[auto,1fr] gap-x-6 sm:gap-x-8">
                <div className="roman text-2xl sm:text-3xl text-pink-500 leading-none pt-1 select-none">{src.roman}</div>
                <div>
                  <h3 className="serif text-xl text-gray-900 font-medium mb-1 leading-tight">{src.author}</h3>
                  <p className="text-sm text-gray-500 italic mb-3 leading-relaxed">{src.work}</p>
                  <p className="text-gray-700 leading-[1.7] text-[1.0625rem]">{src.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="rule mb-20" />

        {/* Co Cosmatch dělá se zdroji */}
        <section className="mb-20">
          <p className="eyebrow text-pink-500 mb-4">Co Cosmatch dělá s těmito zdroji</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-8">
            Syntéza.
          </h2>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-5">
            Cosmatch nepřepisuje žádnou z těchto knih. Texty archetypů, partnerské vztahy i metodologie jsou autorské texty Cosmatch, vycházejí ze studia těchto zdrojů, ale jsou napsané pro česky mluvícího uživatele 27–45 let.
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-5">
            Pro výpočet životního čísla používáme <strong className="text-gray-900 font-medium">Decoz Three-Cycle Method</strong>, kdy redukujeme měsíc, den a rok narození zvlášť, přičemž zachováváme master čísla 11/22/33 v komponentech, pak sečteme a redukujeme finální výsledek. Master 33 se zachová jen pokud aspoň jedna komponenta byla také master (Decoz strict rule).
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">
            Pro kompatibilitu kombinujeme více zdrojů tradičních knih — denní profily jsou inspirované Goldschneiderem a Elffersem a referenčními průvodci Crawfordovou a Sullivanovou, doplněné o tříúrovňový model kompatibility z anglo-americké literatury. Cosmatch rozřazuje lidi do pěti kategorií: <strong className="text-gray-900 font-medium">Spřízněné duše, Láska &amp; přátelství, Prospěšné, Osudové přitažlivosti, Náročné vztahy</strong>.
          </p>
        </section>

        <hr className="rule mb-20" />

        {/* Tři metodické školy */}
        <section className="mb-20">
          <p className="eyebrow text-pink-500 mb-4">Tři metodické školy</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-8">
            Proč existuje 14 zdrojů.
          </h2>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-6">
            Numerologie není jednotný systém — pro stejné datum narození vám dají různé školy různá životní čísla. 14 autorů, ze kterých Cosmatch čerpá, se dělí do tří metodických rodin (plus jedna alternativní).
          </p>

          <div className="space-y-5">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <p className="eyebrow text-gray-500 mb-2">Škola A — Chaldejská</p>
              <h3 className="serif text-lg text-gray-900 font-medium mb-2">Cheiro (1926)</h3>
              <p className="text-gray-700 text-[0.95rem] leading-relaxed">
                Používá pouze den narození („birth number") + jméno podle Chaldean abecedy 1–8. Nejsou tu žádná master čísla.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <p className="eyebrow text-gray-500 mb-2">Škola B — Pythagorejská single-sum</p>
              <h3 className="serif text-lg text-gray-900 font-medium mb-2">Phillips, Crawford &amp; Sullivan, většina českých příruček</h3>
              <p className="text-gray-700 text-[0.95rem] leading-relaxed">
                Sečte všech 8 číslic data najednou, výsledek redukuje. Master čísla zachovává nebo redukuje podle autora.
              </p>
            </div>

            <div className="bg-pink-50 border border-pink-200 rounded-2xl p-6">
              <p className="eyebrow text-pink-500 mb-2">Škola C — Pythagorejská three-cycle · <span className="text-gray-900 font-medium not-italic">Cosmatch</span></p>
              <h3 className="serif text-lg text-gray-900 font-medium mb-2">Balliett (1908) → Campbell → Jordan → Goodwin → Decoz → McCants → Buchanan</h3>
              <p className="text-gray-700 text-[0.95rem] leading-relaxed">
                Redukuje měsíc, den a rok zvlášť, master čísla 11/22/33 zachovává v mezikroku. Jediná metoda, která umí rozlišit „skutečné" master číslo od náhodného součtu. <strong className="text-gray-900 font-medium">Moderní standard západní numerologie</strong>.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <p className="eyebrow text-gray-500 mb-2">Škola D — Dvou-cifrový kód</p>
              <h3 className="serif text-lg text-gray-900 font-medium mb-2">Dan Millman (1993)</h3>
              <p className="text-gray-700 text-[0.95rem] leading-relaxed">
                Radikální zlom bez redukce. Popisuje 45 dvojčíslí (např. 33/6, 25/7). Cosmatch tuto metodu neimplementuje, ale Millmana cituje jako důležitý alternativní pohled.
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-500 italic mt-8">
            Detailní postup výpočtu, srovnání všech metod a krok za krokem příklad najdeš na stránce <Link href="/numerologie/jak-pocitame" className="text-pink-500 underline">Jak se počítá životní číslo</Link>.
          </p>
        </section>

        <hr className="rule mb-20" />

        {/* Měj na paměti */}
        <section className="bg-white border border-gray-200 rounded-3xl p-8 mb-16">
          <p className="eyebrow text-pink-500 mb-3">Měj na paměti</p>
          <h2 className="serif text-xl text-gray-900 font-medium mb-3">Numerologie není věda.</h2>
          <p className="text-gray-700 leading-[1.75] text-[0.95rem]">
            Část pocitu „tohle sedí přesně!" je dokumentovaný psychologický jev zvaný <strong className="text-gray-900 font-medium">Barnumův/Forerův efekt</strong>. V roce 1949 dal psycholog Bertram Forer 39 studentům identický popis osobnosti a oni ho ohodnotili průměrnou známkou <strong className="text-gray-900 font-medium">4,26 z 5,0</strong> jako „to jsem přesně já". To samé může fungovat s numerologií a astrologií — popisy mohou být obecné natolik, že v nich každý najde kus sebe. To neznamená, že je numerologie zbytečná — funguje jako <em className="italic">nástroj sebereflexe a konverzace s partnerem</em>, ne jako věštba.
          </p>
        </section>

        {/* CTA na detail algoritmu */}
        <section>
          <Link href="/jak-funguje-cosmatch" className="block bg-white border border-gray-200 hover:border-gray-900 rounded-2xl p-6 transition group">
            <p className="eyebrow text-gray-400 mb-2">Metodika</p>
            <h3 className="serif text-xl text-gray-900 font-medium mb-1 group-hover:text-pink-500 transition">Detail algoritmu Cosmatch →</h3>
            <p className="text-gray-600 text-[0.95rem] leading-relaxed">Sedm vrstev kompatibility, od astrologie po aktivitu profilu.</p>
          </Link>
        </section>

        <footer className="mt-16 pt-12 border-t border-gray-200">
          <p className="text-xs text-gray-400 leading-relaxed">
            Cosmatch · Mgr. Ing. Simona Cibulková · IČO 08419531 · Praha 2026.
          </p>
        </footer>

      </article>
    </main>
  )
}
