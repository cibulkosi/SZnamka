
import type { Metadata } from 'next'
import Link from 'next/link'

const TITLE = 'Odstoupení od smlouvy — Formulář | Cosmatch'
const DESC = 'Vzorový formulář pro odstoupení od smlouvy o předplatném Cosmatch do 14 dnů od jejího uzavření podle § 1829 občanského zákoníku.'
const URL = 'https://cosmatch.cz/odstoupeni-od-smlouvy'

export const metadata: Metadata = {
  title: TITLE, description: DESC,
  alternates: { canonical: URL, languages: { 'cs-CZ': URL, 'x-default': URL } },
}

export default function OdstoupeniPage() {
  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">← Cosmatch</Link>
      </div>

      <article className="max-w-2xl mx-auto px-6 pt-16 pb-24">
        <header className="mb-12">
          <p className="eyebrow text-pink-500 mb-6">Spotřebitelské právo</p>
          <h1 className="serif-display text-5xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-6">
            Odstoupení<br/>od <em className="italic text-pink-500">smlouvy</em>.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-6" />
          <p className="text-sm text-gray-500">Vzorový formulář dle § 1820 odst. 1 písm. f) občanského zákoníku</p>
        </header>

        <div className="space-y-12 text-gray-800 leading-[1.75] text-[1.0625rem]">

          {/* Tldr */}
          <section className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8">
            <p className="eyebrow text-emerald-600 mb-3">Ve zkratce</p>
            <p>
              Máš právo odstoupit od smlouvy o předplatném <strong className="text-gray-900 font-medium">do 14 dnů</strong> od jejího uzavření bez udání důvodu. Stačí poslat e-mail. Refund proběhne do 14 dnů.
            </p>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">Jak postupovat</h2>
            <p className="mb-3">
              <strong className="text-gray-900 font-medium">Možnost 1 — jednoduchý e-mail:</strong> Pošli e-mail na <a href="mailto:ahoj@cosmatch.cz" className="text-pink-500 underline">ahoj@cosmatch.cz</a> s textem „Tímto odstupuji od smlouvy o předplatném [tarif] uzavřené [datum].“ a uveď svůj e-mail registrovaný v Cosmatch.
            </p>
            <p className="mb-3">
              <strong className="text-gray-900 font-medium">Možnost 2 — strukturovaný formulář:</strong> Použij vzor níže. Stačí ho zkopírovat do e-mailu a vyplnit.
            </p>
          </section>

          {/* The form */}
          <section className="bg-white border border-gray-200 rounded-3xl p-8 font-mono text-sm leading-relaxed">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Vzorový formulář</p>
            <p className="text-gray-900 whitespace-pre-line">
{`Adresát:
Mgr. Ing. Simona Cibulková
IČO: 08419531
Sídlo: Kurzova 2222/16, 155 00 Praha 5 - Stodůlky, Česká republika
Datová schránka: tttkfnk
ahoj@cosmatch.cz

Věc: Odstoupení od smlouvy

Oznamuji, že tímto odstupuji od smlouvy o poskytování digitálních služeb
Cosmatch+ uzavřené dne: ____________________

Datum objednávky:            ____________________
Datum obdržení potvrzení:    ____________________
Jméno a příjmení spotřebitele: ____________________
Adresa spotřebitele:         ____________________
E-mail registrovaný v Cosmatch: ____________________

Prosím o vrácení uhrazené částky na účet, ze kterého jsem platbu provedl/a
(nebo na účet číslo: ____________________).

Datum:    ____________________
Podpis:   ____________________
          (pouze pokud se tento formulář zasílá v listinné podobě)
`}
            </p>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">Výjimka — okamžité poskytnutí služby</h2>
            <p>
              Pokud jsi výslovně souhlasil/a s tím, že Cosmatch začne plnit digitální službu okamžitě (čímž jsi se vzdal/a práva odstoupit do 14 dnů), právo odstoupení dle § 1837 písm. l) občanského zákoníku zaniká. Cosmatch tě o této možnosti informuje při platbě.
            </p>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">Co se stane po odstoupení</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Předplatné okamžitě deaktivujeme.</li>
              <li>Pokud platba proběhla v Apple App Store nebo Google Play, vrácení peněz zpracovává Apple, respektive Google podle svých pravidel. Cosmatch ti pomůže s komunikací směrem k Apple / Google. Peníze se vrací na původní platební prostředek do 5–10 pracovních dní od schválení refundu.</li>
              <li>Tvůj profil zůstává aktivní jako Free tier — můžeš ho dál používat nebo smazat.</li>
            </ul>
          </section>
        </div>
      </article>
    </main>
  )
}
