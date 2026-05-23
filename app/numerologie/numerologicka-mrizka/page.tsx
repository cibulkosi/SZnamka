import type { Metadata } from 'next'
import Link from 'next/link'

const TITLE = 'Cosmatch karmická mapa — chybějící čísla v datu narození | Numerologie | Cosmatch'
const DESC = 'Cosmatch karmická mapa odhalí, která čísla ti v datu narození chybí — a tím i charakterové rysy, které musíš v životě vědomě budovat. Postavená na trojicích McCants (Independence / Stability / Creative) a konceptu Decoz Karmic Lessons.'
const URL = 'https://cosmatch.cz/numerologie/numerologicka-mrizka'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  alternates: { canonical: URL, languages: { 'cs-CZ': URL, 'x-default': URL } },
  openGraph: { title: TITLE, description: DESC, url: URL, type: 'article', siteName: 'Cosmatch', locale: 'cs_CZ', images: [{ url: 'https://cosmatch.cz/og-image.png', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: ['https://cosmatch.cz/og-image.png'] },
  keywords: ['karmická mapa', 'chybějící čísla numerologie', 'Decoz Karmic Lessons', 'McCants trinity', 'numerologie výpočet', 'datum narození čísla'],
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

const NUMBER_MEANINGS: Record<number, { title: string; missing: string }> = {
  1: { title: 'Iniciativa, vůdcovství, nezávislost', missing: 'Chybí Ti iniciativa a vlastní směr. Lekce: naučit se rozhodovat a vést sám sebe.' },
  2: { title: 'Citlivost, partnerství, harmonie', missing: 'Chybí Ti citlivost k druhým a schopnost spolupráce. Lekce: naučit se naslouchat a kompromis.' },
  3: { title: 'Tvořivost, sebevyjádření, optimismus', missing: 'Chybí Ti kreativní vyjádření a hravost. Lekce: nauč se mluvit, psát, tvořit.' },
  4: { title: 'Disciplína, struktura, vytrvalost', missing: 'Chybí Ti disciplína a pracovní vytrvalost. Lekce: vybudovat řád a dlouhodobé návyky.' },
  5: { title: 'Svoboda, změna, dobrodružství', missing: 'Chybí Ti otevřenost ke změně a adaptace. Lekce: dovolit si experimentovat a měnit směr.' },
  6: { title: 'Péče, zodpovědnost, rodina', missing: 'Chybí Ti starost o druhé a smysl pro povinnost. Lekce: naučit se přijímat zodpovědnost za blízké.' },
  7: { title: 'Hloubka, analýza, spiritualita', missing: 'Chybí Ti vnitřní reflexe a duchovní hledání. Lekce: nauč se zpomalit a jít do hloubky.' },
  8: { title: 'Moc, materiální mistrovství, leadership', missing: 'Chybí Ti vztah k moci, penězům, autoritě. Lekce: nauč se zacházet s materiálním světem.' },
  9: { title: 'Soucit, humanita, dokončení', missing: 'Chybí Ti nadhled a globální vidění. Lekce: naučit se cítit s celkem, ne jen se sebou.' },
}

const TRINITIES = [
  { name: 'Trojice nezávislosti', numbers: [1, 5, 7], desc: 'Vlastní směr, svoboda, mentální hloubka. Čísla, která jdou vlastní cestou.' },
  { name: 'Trojice stability', numbers: [2, 4, 8], desc: 'Citlivost, struktura, moc. Čísla, která budují trvalé hodnoty.' },
  { name: 'Trojice tvořivosti', numbers: [3, 6, 9], desc: 'Vyjádření, péče, soucit. Čísla, která tvoří a léčí svět kolem sebe.' },
] as const

export default function CosmatchKarmickaMapaPage() {
  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">← Cosmatch</Link>
      </div>

      <article className="max-w-2xl mx-auto px-6 pt-16 pb-24">

        {/* Hero */}
        <header className="mb-16">
          <p className="eyebrow text-pink-500 mb-6">Pokročilá numerologie</p>
          <h1 className="serif-display text-5xl sm:text-6xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-8">
            Cosmatch<br/><em className="italic text-pink-500">karmická mapa</em>.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-8" />
          <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
            Mapa odhalí, která čísla Ti v datu narození chybí — a tím i charakterové rysy, které musíš v životě vědomě budovat.
          </p>
        </header>

        {/* TLDR */}
        <section className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 mb-16">
          <p className="eyebrow text-emerald-600 mb-3">Ve zkratce</p>
          <p className="text-gray-800 leading-relaxed text-[1.0625rem]">
            Cosmatch karmická mapa stojí na dvou pilířích moderní numerologie: <strong className="text-gray-900 font-medium">Karmic Lessons</strong> konceptu Hanse Decoze (chybějící čísla = karmické lekce) a <strong className="text-gray-900 font-medium">trojicovém modelu</strong> Glynis McCants (Independence 1-5-7 / Stability 2-4-8 / Creative 3-6-9). Místo abstraktního 3×3 čtverce Ti ukáže, které <em className="italic">energetické trojice</em> v Tobě převažují a kterých Ti chybí.
          </p>
        </section>

        {/* Jak to funguje */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Jak to funguje</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            Tři energetické trojice.
          </h2>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-6">
            Devět základních čísel je v moderní západní numerologii rozděleno do <strong className="text-gray-900 font-medium">tří trojic</strong>, které sdílejí společnou „energetickou rodinu". Tento model popularizovala Glynis McCants v knize <em className="italic">Love by the Numbers</em> (Sourcebooks Casablanca, 2010), Cosmatch ho používá i v tabulce kompatibility.
          </p>

          <div className="space-y-4 mb-6">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <p className="eyebrow text-amber-700 mb-3">Trojice nezávislosti</p>
              <div className="flex gap-3 mb-3">
                {[1,5,7].map(n => (
                  <div key={n} className="serif-display text-3xl text-gray-900 font-medium w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center">{n}</div>
                ))}
              </div>
              <p className="text-gray-700 text-[0.95rem] leading-relaxed">Vlastní směr, svoboda, mentální hloubka. Čísla, která jdou vlastní cestou.</p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <p className="eyebrow text-emerald-700 mb-3">Trojice stability</p>
              <div className="flex gap-3 mb-3">
                {[2,4,8].map(n => (
                  <div key={n} className="serif-display text-3xl text-gray-900 font-medium w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center">{n}</div>
                ))}
              </div>
              <p className="text-gray-700 text-[0.95rem] leading-relaxed">Citlivost, struktura, moc. Čísla, která budují trvalé hodnoty.</p>
            </div>

            <div className="bg-pink-50 border border-pink-200 rounded-2xl p-6">
              <p className="eyebrow text-pink-700 mb-3">Trojice tvořivosti</p>
              <div className="flex gap-3 mb-3">
                {[3,6,9].map(n => (
                  <div key={n} className="serif-display text-3xl text-gray-900 font-medium w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center">{n}</div>
                ))}
              </div>
              <p className="text-gray-700 text-[0.95rem] leading-relaxed">Vyjádření, péče, soucit. Čísla, která tvoří a léčí svět kolem sebe.</p>
            </div>
          </div>

          <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">
            Když si do trojic zapíšeš všechny číslice ze svého data narození, uvidíš, která trojice u Tebe <strong className="text-gray-900 font-medium">vibruje silně</strong> (= přirozená energie) a která <strong className="text-gray-900 font-medium">chybí</strong> (= karmická lekce).
          </p>
        </section>

        <hr className="rule mb-16" />

        {/* Příklad */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Příklad výpočtu</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            Datum 23. 7. 1992.
          </h2>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
            Cifry: <strong className="text-gray-900 font-medium">2, 3, 7, 1, 9, 9, 2</strong>. Zapsáno do trojic:
          </p>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4 space-y-4">
            <div className="grid grid-cols-[140px,1fr] gap-4 items-center">
              <p className="eyebrow text-amber-700">Nezávislost</p>
              <div className="flex gap-3">
                <div className="serif-display text-2xl text-gray-900 font-medium w-12 h-12 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center">1<span className="text-xs text-gray-500 ml-0.5">×1</span></div>
                <div className="serif-display text-2xl text-gray-300 font-medium w-12 h-12 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center">—</div>
                <div className="serif-display text-2xl text-gray-900 font-medium w-12 h-12 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center">7<span className="text-xs text-gray-500 ml-0.5">×1</span></div>
              </div>
            </div>
            <div className="grid grid-cols-[140px,1fr] gap-4 items-center">
              <p className="eyebrow text-emerald-700">Stabilita</p>
              <div className="flex gap-3">
                <div className="serif-display text-2xl text-gray-900 font-medium w-12 h-12 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center">2<span className="text-xs text-gray-500 ml-0.5">×2</span></div>
                <div className="serif-display text-2xl text-gray-300 font-medium w-12 h-12 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center">—</div>
                <div className="serif-display text-2xl text-gray-300 font-medium w-12 h-12 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center">—</div>
              </div>
            </div>
            <div className="grid grid-cols-[140px,1fr] gap-4 items-center">
              <p className="eyebrow text-pink-700">Tvořivost</p>
              <div className="flex gap-3">
                <div className="serif-display text-2xl text-gray-900 font-medium w-12 h-12 bg-pink-50 border border-pink-200 rounded-full flex items-center justify-center">3<span className="text-xs text-gray-500 ml-0.5">×1</span></div>
                <div className="serif-display text-2xl text-gray-300 font-medium w-12 h-12 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center">—</div>
                <div className="serif-display text-2xl text-gray-900 font-medium w-12 h-12 bg-pink-50 border border-pink-200 rounded-full flex items-center justify-center">9<span className="text-xs text-gray-500 ml-0.5">×2</span></div>
              </div>
            </div>
          </div>

          <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">
            Tomuto datu chybí: <strong className="text-gray-900 font-medium">4, 5, 6, 8</strong>. Trojice <em className="italic">stability</em> je oslabená (chybí 4 a 8), v <em className="italic">tvořivosti</em> chybí 6. Karmické lekce: vědomě budovat disciplínu (4), adaptabilitu (5), zodpovědnost ke druhým (6), vztah k materiálnímu světu (8).
          </p>
        </section>

        <hr className="rule mb-16" />

        {/* Význam jednotlivých čísel */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Význam čísel</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-8">
            Co znamená, když Ti chybí.
          </h2>
          <div className="space-y-5">
            {Object.entries(NUMBER_MEANINGS).map(([n, info]) => (
              <div key={n} className="grid grid-cols-[auto,1fr] gap-6 pb-5 border-b border-gray-200 last:border-b-0">
                <div className="serif-display text-4xl text-pink-500 font-medium leading-none tabular-nums">{n}</div>
                <div>
                  <h3 className="serif text-lg text-gray-900 font-medium mb-1">{info.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{info.missing}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="rule mb-16" />

        {/* Zdroje */}
        <section className="bg-white border border-gray-200 rounded-3xl p-8 mb-16">
          <p className="eyebrow text-pink-500 mb-3">Zdroje konceptu</p>
          <h2 className="serif text-xl text-gray-900 font-medium mb-4">Na čem Cosmatch karmická mapa staví</h2>
          <ul className="space-y-3 text-gray-700 text-[0.95rem] leading-relaxed">
            <li><strong className="text-gray-900 font-medium">Hans Decoz</strong> — koncept <em className="italic">Karmic Lessons</em> (čísla, která chybí v jméně/datu narození, jsou karmické lekce, které je třeba se naučit). <em className="italic">Numerology: Key to Your Inner Self</em> (Perigee/Tarcher, 2001).</li>
            <li><strong className="text-gray-900 font-medium">Glynis McCants</strong> — trojicový model (1-5-7 / 2-4-8 / 3-6-9). <em className="italic">Love by the Numbers</em> (Sourcebooks Casablanca, 2010).</li>
            <li><strong className="text-gray-900 font-medium">Matthew Oliver Goodwin</strong> — dokumentace významu chybějících čísel. <em className="italic">Numerology: The Complete Guide</em>, Vol. 1 (Newcastle, 1981).</li>
          </ul>
          <p className="text-xs text-gray-500 italic mt-4">
            Cosmatch karmická mapa je <strong className="text-gray-700 font-medium">vlastní syntéza</strong> těchto tří zdrojů. Není to historická Pythagorova mřížka (David Phillips, Hettie Templeton) ani čínská Lo Shu Grid — ty jsou samostatné tradice se svým vlastním 3×3 rozložením.
          </p>
        </section>

        {/* Honest disclaimer */}
        <section className="bg-white border border-gray-200 rounded-3xl p-8 mb-16">
          <p className="eyebrow text-pink-500 mb-3">Měj na paměti</p>
          <h2 className="serif text-xl text-gray-900 font-medium mb-3">Numerologie není věda.</h2>
          <p className="text-gray-700 leading-[1.75] text-[0.95rem]">
            Cosmatch karmická mapa je <em className="italic">nástroj sebepoznání</em>, ne věštba. Chybějící čísla v datu narození není „osud" — je to invitation k tomu, kterou stranu sebe můžeš vědomě rozvíjet. Část pocitu „tohle sedí přesně!" je dokumentovaný <strong className="text-gray-900 font-medium">Barnumův/Forerův efekt</strong>: popisy jsou obecné natolik, aby v nich každý našel kus sebe. Hodnota je v rozhovoru, který si o sobě otevíráš, ne v predikci.
          </p>
        </section>

        {/* Související */}
        <section>
          <p className="eyebrow text-pink-500 mb-4">Pokračuj ve čtení</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-8">
            Související
          </h2>
          <div className="space-y-4">
            <Link href="/numerologie/jak-pocitame" className="block bg-white border border-gray-200 hover:border-gray-900 rounded-2xl p-6 transition group">
              <p className="eyebrow text-gray-400 mb-2">Numerologie</p>
              <h3 className="serif text-xl text-gray-900 font-medium mb-1 group-hover:text-pink-500 transition">Jak se počítá životní číslo →</h3>
              <p className="text-gray-600 text-[0.95rem] leading-relaxed">Decoz three-cycle metoda, master čísla 11/22/33, krok-za-krokem.</p>
            </Link>
            <Link href="/kompatibilita-podle-data-narozeni" className="block bg-white border border-gray-200 hover:border-gray-900 rounded-2xl p-6 transition group">
              <p className="eyebrow text-gray-400 mb-2">Kompatibilita</p>
              <h3 className="serif text-xl text-gray-900 font-medium mb-1 group-hover:text-pink-500 transition">Tabulka kompatibility 1-9 →</h3>
              <p className="text-gray-600 text-[0.95rem] leading-relaxed">Kdo se s kým hodí podle moderní pythagorejské tradice (Decoz).</p>
            </Link>
            <Link href="/zdroje-numerologie" className="block bg-white border border-gray-200 hover:border-gray-900 rounded-2xl p-6 transition group">
              <p className="eyebrow text-gray-400 mb-2">Zdroje</p>
              <h3 className="serif text-xl text-gray-900 font-medium mb-1 group-hover:text-pink-500 transition">14 klíčových zdrojů →</h3>
              <p className="text-gray-600 text-[0.95rem] leading-relaxed">Autoři a knihy, z nichž Cosmatch čerpá metodologii.</p>
            </Link>
          </div>
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
