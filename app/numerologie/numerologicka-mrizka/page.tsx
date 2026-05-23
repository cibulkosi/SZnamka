import type { Metadata } from 'next'
import Link from 'next/link'

const TITLE = 'Karmické lekce — chybějící čísla v datu narození podle Decoze | Numerologie | Cosmatch'
const DESC = 'Karmické lekce odhalí, která čísla ti v datu narození chybí — a tím i charakterové rysy, které musíš v životě vědomě budovat. Postaveno na konceptu Karmic Lessons Hanse Decoze (Numerology: Key to Your Inner Self, 2001).'
const URL = 'https://cosmatch.cz/numerologie/numerologicka-mrizka'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL, languages: { 'cs-CZ': URL, 'x-default': URL } },
  openGraph: { title: TITLE, description: DESC, url: URL, type: 'article', siteName: 'Cosmatch', locale: 'cs_CZ', images: [{ url: 'https://cosmatch.cz/og-image.png', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: ['https://cosmatch.cz/og-image.png'] },
  keywords: ['karmické lekce', 'chybějící čísla numerologie', 'Decoz Karmic Lessons', 'numerologie výpočet', 'datum narození čísla'],
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

const KARMIC_LESSONS: Record<number, { title: string; lesson: string }> = {
  1: { title: 'Iniciativa, vůdcovství, nezávislost', lesson: 'Chybí ti iniciativa a vlastní směr. Karmická lekce: naučit se rozhodovat sám za sebe, převzít vůdčí roli, nevyhýbat se odpovědnosti.' },
  2: { title: 'Citlivost, partnerství, harmonie', lesson: 'Chybí ti citlivost k druhým a schopnost spolupráce. Karmická lekce: naučit se naslouchat, dělat kompromisy a být citlivý k potřebám druhých.' },
  3: { title: 'Tvořivost, sebevyjádření, optimismus', lesson: 'Chybí ti kreativní vyjádření a hravost. Karmická lekce: nauč se mluvit, psát, tvořit, dovolit si radost a lehkost.' },
  4: { title: 'Disciplína, struktura, vytrvalost', lesson: 'Chybí ti disciplína a pracovní vytrvalost. Karmická lekce: vybudovat řád, dlouhodobé návyky a dotáhnout věci do konce.' },
  5: { title: 'Svoboda, změna, dobrodružství', lesson: 'Chybí ti otevřenost ke změně a adaptace. Karmická lekce: dovolit si experimentovat, měnit směr, neulpívat na jistotě.' },
  6: { title: 'Péče, zodpovědnost, rodina', lesson: 'Chybí ti starost o druhé a smysl pro povinnost. Karmická lekce: naučit se přijímat zodpovědnost za blízké, sloužit rodině a komunitě.' },
  7: { title: 'Hloubka, analýza, spiritualita', lesson: 'Chybí ti vnitřní reflexe a duchovní hledání. Karmická lekce: nauč se zpomalit, jít do hloubky, hledat smysl mimo materiální svět.' },
  8: { title: 'Moc, materiální mistrovství, leadership', lesson: 'Chybí ti zdravý vztah k moci, penězům a autoritě. Karmická lekce: nauč se zacházet s materiálním světem, vést a budovat hodnotu.' },
  9: { title: 'Soucit, humanita, dokončení', lesson: 'Chybí ti nadhled a globální vidění. Karmická lekce: naučit se cítit s celkem, jednat ve službě většího dobra, dotahovat věci do konce.' },
}

export default function KarmickeLekcePage() {
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
            Karmické<br/><em className="italic text-pink-500">lekce</em>.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-8" />
          <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
            Čísla, která ti v datu narození chybí, jsou podle Hanse Decoze tvoje karmické lekce — vlastnosti, které musíš v životě vědomě budovat.
          </p>
        </header>

        {/* TLDR */}
        <section className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 mb-16">
          <p className="eyebrow text-emerald-600 mb-3">Ve zkratce</p>
          <p className="text-gray-800 leading-relaxed text-[1.0625rem]">
            <strong className="text-gray-900 font-medium">Karmic Lessons</strong> je koncept Hanse Decoze, popsaný v knize <em className="italic">Numerology: Key to Your Inner Self</em> (Perigee/Tarcher, 2001). Princip: čísla 1–9, která <strong className="text-gray-900 font-medium">chybí v tvém datu narození</strong>, indikují aspekty osobnosti, na kterých máš v tomto životě pracovat. Není to osud — je to mapa růstu.
          </p>
        </section>

        {/* Jak to funguje */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Jak to funguje</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            Krok za krokem.
          </h2>
          <ol className="space-y-4 text-gray-700 leading-[1.75] text-[1.0625rem] list-none">
            <li className="grid grid-cols-[auto,1fr] gap-4">
              <span className="serif-display text-2xl text-pink-500 font-medium tabular-nums">1.</span>
              <span>Vezmi své datum narození a vypiš všechny číslice (např. 23. 7. 1992 → <strong className="text-gray-900 font-medium">2, 3, 7, 1, 9, 9, 2</strong>).</span>
            </li>
            <li className="grid grid-cols-[auto,1fr] gap-4">
              <span className="serif-display text-2xl text-pink-500 font-medium tabular-nums">2.</span>
              <span>Projdi čísla 1–9 a označ, která v tvém datu jsou (přítomná) a která nejsou (chybějící).</span>
            </li>
            <li className="grid grid-cols-[auto,1fr] gap-4">
              <span className="serif-display text-2xl text-pink-500 font-medium tabular-nums">3.</span>
              <span><strong className="text-gray-900 font-medium">Chybějící čísla = karmické lekce.</strong> Vlastnosti, které stojí za to vědomě budovat.</span>
            </li>
            <li className="grid grid-cols-[auto,1fr] gap-4">
              <span className="serif-display text-2xl text-pink-500 font-medium tabular-nums">4.</span>
              <span>Číslice 0 se obvykle nepočítá (Decoz: „0 nemá vlastní vibrační kvalitu, je modifikátor").</span>
            </li>
          </ol>
        </section>

        <hr className="rule mb-16" />

        {/* Příklad */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Příklad</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            Datum 23. 7. 1992.
          </h2>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
            Cifry: <strong className="text-gray-900 font-medium">2, 3, 7, 1, 9, 9, 2</strong>. Které z čísel 1–9 jsou přítomné, které chybí?
          </p>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
            <div className="flex flex-wrap gap-3 justify-center">
              {[1,2,3,4,5,6,7,8,9].map(n => {
                const cifry = [2,3,7,1,9,9,2]
                const count = cifry.filter(c => c === n).length
                const present = count > 0
                return (
                  <div key={n} className={`serif-display text-2xl font-medium w-14 h-14 rounded-full flex items-center justify-center border-2 ${present ? 'bg-pink-50 border-pink-300 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-300'}`}>
                    {n}
                    {present && <span className="text-xs ml-0.5 text-gray-500">×{count}</span>}
                  </div>
                )
              })}
            </div>
          </div>

          <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">
            <strong className="text-gray-900 font-medium">Přítomná čísla:</strong> 1, 2, 3, 7, 9 (přirozené dary). <strong className="text-gray-900 font-medium">Chybějící čísla:</strong> 4, 5, 6, 8 — karmické lekce, na kterých má tato osoba v životě pracovat.
          </p>
        </section>

        <hr className="rule mb-16" />

        {/* Význam jednotlivých čísel */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Význam čísel</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-8">
            Co znamená, když ti chybí.
          </h2>
          <div className="space-y-5">
            {Object.entries(KARMIC_LESSONS).map(([n, info]) => (
              <div key={n} className="grid grid-cols-[auto,1fr] gap-6 pb-5 border-b border-gray-200 last:border-b-0">
                <div className="serif-display text-4xl text-pink-500 font-medium leading-none tabular-nums">{n}</div>
                <div>
                  <h3 className="serif text-lg text-gray-900 font-medium mb-1">{info.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{info.lesson}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="rule mb-16" />

        {/* Zdroj */}
        <section className="bg-white border border-gray-200 rounded-3xl p-8 mb-16">
          <p className="eyebrow text-pink-500 mb-3">Zdroj konceptu</p>
          <h2 className="serif text-xl text-gray-900 font-medium mb-4">Hans Decoz</h2>
          <p className="text-gray-700 leading-[1.75] text-[0.95rem] mb-3">
            <em className="italic">Numerology: Key to Your Inner Self</em> (Perigee / Tarcher, 2001) — moderní západní standard. Decoz je nejcitovanější autor v současné numerologii, jeho metoda Three-Cycle Method a koncept Karmic Lessons jsou základem Hay House lineage (McCants, Buchanan, Bender). Cosmatch používá Decozovo pojetí Karmic Lessons aplikované přímo na číslice data narození.
          </p>
          <p className="text-xs text-gray-500 italic">
            Karmické lekce <strong className="text-gray-700 font-medium not-italic">nejsou</strong> Pythagorova mřížka (David Phillips, Hay House 2005) ani čínská Lo Shu Grid (J. C. Chaudhry) — ty jsou samostatné systémy s vlastním 3×3 rozložením a odlišnou interpretací.
          </p>
        </section>

        {/* Honest disclaimer */}
        <section className="bg-white border border-gray-200 rounded-3xl p-8 mb-16">
          <p className="eyebrow text-pink-500 mb-3">Měj na paměti</p>
          <h2 className="serif text-xl text-gray-900 font-medium mb-3">Numerologie není věda.</h2>
          <p className="text-gray-700 leading-[1.75] text-[0.95rem]">
            Karmické lekce jsou <em className="italic">nástroj sebepoznání</em>, ne věštba. Chybějící čísla v datu narození není „osud" — je to invitation k tomu, kterou stranu sebe můžeš vědomě rozvíjet. Část pocitu „tohle sedí přesně!" je dokumentovaný <strong className="text-gray-900 font-medium">Barnumův/Forerův efekt</strong>: popisy jsou obecné natolik, aby v nich každý našel kus sebe. Hodnota je v rozhovoru, který si o sobě otevíráš, ne v predikci.
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
              <p className="text-gray-600 text-[0.95rem] leading-relaxed">Decoz Three-Cycle Method, master čísla 11/22/33, krok za krokem.</p>
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
