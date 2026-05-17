
import type { Metadata } from 'next'
import Link from 'next/link'

const TITLE = 'Master čísla 11, 22, 33 — Mistrovská čísla v numerologii | Cosmatch'
const DESC = 'Master čísla 11 (Vizionář), 22 (Architekt) a 33 (Mistr lásky) jsou nejintenzivnější vibrace v numerologii. Tvoří jen 4 % populace. Vlastnosti, kompatibilita, lekce.'
const URL = 'https://cosmatch.cz/numerologie/master-cisla-11-22-33'

export const metadata: Metadata = {
  title: TITLE, description: DESC,
  alternates: { canonical: URL, languages: { 'cs-CZ': URL, 'x-default': URL } },
  openGraph: { title: TITLE, description: DESC, url: URL, type: 'article', siteName: 'Cosmatch', locale: 'cs_CZ' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
  keywords: ['master čísla', 'mistrovská čísla', 'číslo 11 numerologie', 'číslo 22 numerologie', 'číslo 33 numerologie', 'vizionář', 'architekt', 'mistr lásky'],
}

export default function MasterCislaPage() {
  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Article',
        headline: TITLE, description: DESC,
        author: { '@type': 'Person', name: 'Simona Cibulková' },
        publisher: { '@type': 'Organization', name: 'Cosmatch', logo: { '@type': 'ImageObject', url: 'https://cosmatch.cz/icon-512.png' } },
        datePublished: '2026-05-16', dateModified: '2026-05-16',
        inLanguage: 'cs-CZ',
      })}} />

      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link href="/numerologie" className="text-sm text-gray-500 hover:text-gray-900 transition">← Numerologie</Link>
      </div>

      <article className="max-w-2xl mx-auto px-6 pt-16 pb-24">
        <header className="mb-16">
          <p className="eyebrow text-pink-500 mb-6">Mistrovská čísla</p>
          <h1 className="serif-display text-5xl sm:text-6xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-8">
            Master čísla<br/><em className="italic text-pink-500">11 · 22 · 33</em>.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-8" />
          <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
            Master čísla — neboli mistrovská — jsou v numerologii nejintenzivnější vibrace.
            Lidé s nimi tvoří jen ~4 % populace. Cítí víc, vědí víc, žijí intenzivněji.
          </p>
        </header>

        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Co to znamená</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            Proč jsou „master".
          </h2>
          <p className="text-gray-800 leading-[1.75] text-[1.0625rem] dropcap mb-4">
            V tradiční numerologii redukujeme každý součet číslic data narození na jednu cifru (1–9). Jediné výjimky jsou 11, 22 a 33 — ta zůstávají nezredukovaná, protože nesou specifickou „mistrovskou" vibraci.
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">
            Pokud máš 11, 22 nebo 33, nemusíš nutně být „lepší" — ale tvoje životní zkušenost bude pravděpodobně intenzivnější. Hlubší vrcholy, hlubší dna, vyšší citlivost.
          </p>
        </section>

        <hr className="rule mb-12" />

        {/* 11 */}
        <section className="mb-12">
          <Link href="/numerologie/zivotni-cislo-11" className="block hover:opacity-80 transition">
            <p className="eyebrow text-purple-600 mb-3">11 · Vizionář</p>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-3">Vizionář.</h2>
            <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-3">
              Číslo 11 je intuitivní portál. Lidé s 11 vidí věci, které ostatní přehlédnou. Telepatie, prorocké sny, mimořádná emoční citlivost. Jejich úkolem je inspirovat k duchovnímu růstu.
            </p>
            <p className="text-sm text-pink-500 font-medium">Číst více o čísle 11 →</p>
          </Link>
        </section>

        <hr className="rule mb-12" />

        {/* 22 */}
        <section className="mb-12">
          <Link href="/numerologie/zivotni-cislo-22" className="block hover:opacity-80 transition">
            <p className="eyebrow text-amber-600 mb-3">22 · Architekt</p>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-3">Architekt.</h2>
            <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-3">
              Číslo 22 je vize plus exekuce. Lidé s 22 dokáží stavět ze snů reality — školy, firmy, světy. Workoholismus je jejich největším rizikem. Vlivné osobnosti často mají 22.
            </p>
            <p className="text-sm text-pink-500 font-medium">Číst více o čísle 22 →</p>
          </Link>
        </section>

        <hr className="rule mb-12" />

        {/* 33 */}
        <section className="mb-12">
          <Link href="/numerologie/zivotni-cislo-33" className="block hover:opacity-80 transition">
            <p className="eyebrow text-rose-600 mb-3">33 · Mistr lásky</p>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-3">Mistr lásky.</h2>
            <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-3">
              Číslo 33 je nejvzácnější — jen 0,3 % populace. Bezpodmínečná láska a soucit. Léčí svou přítomností. Riziko: dávání bez hranic vede k vyhoření.
            </p>
            <p className="text-sm text-pink-500 font-medium">Číst více o čísle 33 →</p>
          </Link>
        </section>

        <hr className="rule mb-16" />

        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Vztahy</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            Master čísla ve vztazích.
          </h2>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
            Master čísla potřebují partnera, který zvládne jejich hloubku a intenzitu. Nejlepší shody jsou typicky další master čísla nebo silná 2 (Diplomat), 6 (Pečovatel) a 9 (Idealista).
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">
            Povrchní vztahy je vyčerpávají. Hledají transcendentní spojení — což může znít esotericky, ale prakticky znamená partnera, který dokáže být přítomný a otevřený.
          </p>
        </section>

        <section className="bg-white rounded-3xl border border-gray-100 p-10">
          <p className="eyebrow text-pink-500 mb-4">Spočítej si</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">
            Jsi master číslo?
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8 text-[1.0625rem]">
            Zadej datum narození — Cosmatch ti spočítá životní číslo + ukáže, jestli patříš mezi 4 % master.
          </p>
          <Link href="/test" className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-full text-base font-medium hover:bg-gray-800 transition">
            Spustit kvíz
          </Link>
        </section>
      </article>
    </main>
  )
}
