'use client'
import Link from 'next/link'

export default function ManifestDuvery() {
  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-gray-900 mb-8">
            <span className="text-pink-500">✦</span> Cosmatch
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-4">Manifest důvěry</h1>
          <p className="text-gray-500 text-lg">Jak zacházíme s tebou, tvými daty a tvým srdcem.</p>
        </div>

        {/* Principles */}
        <div className="space-y-8">

          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="text-3xl mb-4">01</div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Žádné swipy pro swipy</h2>
            <p className="text-gray-600 leading-relaxed">
              Tinder vydělává na tom, čím déle ti záleží. My ne. Cosmatch je navržen tak, aby tě co nejrychleji spojil
              s lidmi, se kterými to opravdu může fungovat — a pak se z tvého životě ztratil. Náš obchodní model
              je postaven na kvalitě shod, ne na době, kterou strávíš scrollováním.
            </p>
          </section>

          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="text-3xl mb-4">02</div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Datum narození jako základ, ne jako data</h2>
            <p className="text-gray-600 leading-relaxed">
              Tvoje datum narození slouží výhradně k výpočtu numerologické kompatibility. Neprodáváme ho,
              nesdílíme ho s reklamními sítěmi, nepoužíváme ho k profilování mimo aplikaci. Je to klíč
              k tvému profilu — nic víc.
            </p>
          </section>

          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="text-3xl mb-4">03</div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Žádné tmavé vzory</h2>
            <p className="text-gray-600 leading-relaxed">
              Nenajdeš tu falešné notifikace, které tě lákají zpět. Nenajdeš tu záměrně skryté tlačítko
              pro zrušení předplatného. Nenajdeš tu profily, které byly vytvořeny jen proto, aby tě
              zaháčkovaly. Každý profil je reálný člověk. Každá notifikace je reálná událost.
            </p>
          </section>

          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="text-3xl mb-4">04</div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Algoritmus, který vysvětlíme</h2>
            <p className="text-gray-600 leading-relaxed">
              Kompatibilita se počítá z numerologie (35 %), společných hodnot a záměrů (30 %),
              vzdálenosti (15 %), aktivity (15 %) a společných zájmů (5 %). Výsledek je celkové procento —
              bez skrytých penalizací, bez placených výhod v řazení.
            </p>
          </section>

          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="text-3xl mb-4">05</div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Bezpečnost jako základ</h2>
            <p className="text-gray-600 leading-relaxed">
              Přihlašujeme tě přes Google nebo Facebook — žádná hesla u nás. Data jsou šifrována.
              Provoz běží v EU (Frankfurt). Fotky a osobní údaje nikdy neopouštějí evropské servery.
              Kdykoli můžeš svůj účet nenávratně smazat — a my to skutečně provedeme.
            </p>
          </section>

          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="text-3xl mb-4">06</div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Žádné reklamy. Nikdy.</h2>
            <p className="text-gray-600 leading-relaxed">
              Cosmatch je financován výhradně předplatným uživatelů. Nebereme peníze od inzerentů.
              Nesledujeme tě pro třetí strany. Náš zájem je sladěn s tvým — aby ti aplikace skutečně pomohla.
            </p>
          </section>

          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="text-3xl mb-4">07</div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Záruky, ne sliby</h2>
            <p className="text-gray-600 leading-relaxed">
              Kdykoli nás kontaktuj na{' '}
              <a href="mailto:ahoj@cosmatch.cz" className="text-pink-500 underline">ahoj@cosmatch.cz</a>.
              Odpovídáme do 48 hodin. Pokud nejsi spokojen s předplatným do 7 dnů, vrátíme ti peníze bez otázek.
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400 text-sm">
          <p className="mb-4">
            Cosmatch.cz — Mgr. Ing. Simona Cibulková, IČO: 08419531
          </p>
          <p className="mb-6">
            Algoritmus se volně inspiruje numerologickou teorií. Výsledky slouží jako podpora rozhodování,
            ne jako absolutní pravda.
          </p>
          <Link href="/" className="text-pink-500 font-semibold">Zpět na úvod</Link>
        </div>

      </div>
    </div>
  )
}
