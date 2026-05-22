import type { Metadata } from 'next'
import Link from 'next/link'

const TITLE = 'Odstoupení od smlouvy — Cosmatch+ | Cosmatch'
const DESC = 'Jak odstoupit od předplatného Cosmatch+ — postup podle kanálu, kde proběhla platba (Apple App Store, Google Play, web). Vzorový formulář dle § 1829 OZ.'
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
          <p className="text-sm text-gray-500">Podle § 1829 a § 1820 odst. 1 písm. f) občanského zákoníku</p>
        </header>

        <div className="space-y-12 text-gray-800 leading-[1.75] text-[1.0625rem]">

          {/* TLDR */}
          <section className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8">
            <p className="eyebrow text-emerald-600 mb-3">Ve zkratce</p>
            <p>
              Máš právo odstoupit od předplatného Cosmatch+ <strong className="text-gray-900 font-medium">do 14 dnů</strong> od jeho uzavření. Konkrétní postup závisí na tom, <strong className="text-gray-900 font-medium">kde jsi platil/a</strong> — Apple App Store, Google Play nebo web. Níže najdeš tři cesty.
            </p>
          </section>

          {/* Apple App Store */}
          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">
              <span className="text-gray-400 mr-2">I.</span> Pokud jsi platil/a v Apple App Store
            </h2>
            <p className="mb-3">
              Platbu zpracoval <strong className="text-gray-900 font-medium">Apple Distribution International Ltd.</strong> (Irsko), ne Cosmatch. Refund vyřizuje Apple podle svých pravidel.
            </p>
            <ol className="list-decimal pl-6 space-y-2 mb-4">
              <li>Otevři na počítači nebo v Safari: <a href="https://reportaproblem.apple.com" target="_blank" rel="noopener" className="text-pink-500 underline">reportaproblem.apple.com</a></li>
              <li>Přihlas se Apple ID, kterým jsi předplatné koupil/a</li>
              <li>Najdi v seznamu „Cosmatch+" a klikni „Nahlásit problém"</li>
              <li>Vyber důvod (např. „Nedoporučená koupě" nebo „Účtováno nedopatřením") a popiš situaci</li>
              <li>Apple obvykle odpoví do 48 hodin. Při schválení vrátí peníze na původní platební metodu do 5–10 pracovních dní.</li>
            </ol>
            <p className="text-sm text-gray-600">
              Pokud Apple refund odmítne a domníváš se, že máš nárok podle § 1829 OZ (do 14 dnů), <Link href="/kontakt" className="text-pink-500 underline">napiš nám</Link> — pomůžeme s další komunikací s Apple a případně poskytneme náhradu z naší strany (např. prodloužení členství nebo voucher).
            </p>
          </section>

          {/* Google Play */}
          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">
              <span className="text-gray-400 mr-2">II.</span> Pokud jsi platil/a v Google Play
            </h2>
            <p className="mb-3">
              Platbu zpracoval <strong className="text-gray-900 font-medium">Google Commerce Ltd.</strong> (Irsko), ne Cosmatch. Google Play má vstřícnou refundovací politiku — do 48 hodin od koupě se peníze vracejí automaticky.
            </p>
            <ol className="list-decimal pl-6 space-y-2 mb-4">
              <li>Otevři <a href="https://play.google.com/store/account/orders" target="_blank" rel="noopener" className="text-pink-500 underline">play.google.com/store/account/orders</a> (nebo Play Store → Účet → Historie objednávek)</li>
              <li>Najdi položku „Cosmatch+" a klikni na trojtečku → „Nahlásit problém"</li>
              <li>Vyber „Chci požádat o refund" a vyplň důvod</li>
              <li>Pokud žádost dorazí do <strong className="text-gray-900 font-medium">48 hodin od platby</strong>, Google obvykle refund schválí automaticky. Po 48 hodinách je rozhodnutí na uvážení Google.</li>
              <li>Refund obvykle dorazí do 3–5 pracovních dní.</li>
            </ol>
            <p className="text-sm text-gray-600">
              Pokud Google refund odmítne a domníváš se, že máš nárok podle § 1829 OZ, <Link href="/kontakt" className="text-pink-500 underline">napiš nám</Link> — pomůžeme s komunikací s Google nebo nabídneme náhradu (prodloužení členství, voucher).
            </p>
          </section>

          {/* Web */}
          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">
              <span className="text-gray-400 mr-2">III.</span> Pokud jsi platil/a přímo na webu cosmatch.cz
            </h2>
            <p className="mb-3">
              Platba proběhla u nás přes platební bránu (např. Comgate). Odstoupení podle § 1829 OZ vyřizujeme my.
            </p>
            <p className="mb-3">
              <strong className="text-gray-900 font-medium">Stačí napsat e-mail nebo přes <Link href="/kontakt" className="text-pink-500 underline">kontaktní formulář</Link></strong> — krátce nám sděl, že odstupuješ od smlouvy o předplatném Cosmatch+ a uveď datum platby a e-mail, pod kterým jsi registrovaný/á.
            </p>
            <p className="mb-3">
              Volitelně můžeš použít vzorový formulář níže (§ 1820 odst. 1 písm. f) OZ). Refund proběhne do 14 dnů na původní platební prostředek.
            </p>
          </section>

          {/* Vzorový formulář — pro III. (web platby) */}
          <section className="bg-white border border-gray-200 rounded-3xl p-8 font-mono text-sm leading-relaxed">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Vzorový formulář — pro platby na webu cosmatch.cz</p>
            <p className="text-gray-900 whitespace-pre-line">
{`Adresát:
Mgr. Ing. Simona Cibulková
IČO: 08419531
Sídlo: Kurzova 2222/16, 155 00 Praha 5 - Stodůlky, Česká republika
Datová schránka: tttkfnk

Věc: Odstoupení od smlouvy

Oznamuji, že tímto odstupuji od smlouvy o poskytování digitálních služeb
Cosmatch+ uzavřené dne: ____________________

Datum objednávky:              ____________________
Jméno a příjmení spotřebitele: ____________________
E-mail registrovaný v Cosmatch: ____________________

Prosím o vrácení uhrazené částky na účet, ze kterého jsem platbu provedl/a
(případně na účet číslo: ____________________).

Datum:    ____________________
Podpis:   ____________________
          (jen pokud zasíláš listinně)
`}
            </p>
          </section>

          {/* Výjimka § 1837 písm. l */}
          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">Výjimka — souhlas s okamžitým plněním</h2>
            <p>
              Pokud jsi při platbě <strong className="text-gray-900 font-medium">výslovně souhlasil/a se započetím poskytování služby okamžitě</strong> (typicky tlačítkem „Začít používat ihned") a potvrdil/a, že tím <strong className="text-gray-900 font-medium">ztrácíš právo odstoupit do 14 dnů</strong>, právo na odstoupení dle § 1837 písm. l) občanského zákoníku zaniká. Apple App Store i Google Play tento souhlas typicky vyžadují při koupi předplatného.
            </p>
            <p className="mt-3 text-sm text-gray-600">
              I v takovém případě ti můžeme nabídnout vstřícné řešení — <Link href="/kontakt" className="text-pink-500 underline">napiš nám</Link>.
            </p>
          </section>

          {/* Co po odstoupení */}
          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">Co se stane po odstoupení</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Předplatné Cosmatch+ deaktivujeme — vrátíš se na Free tier.</li>
              <li>Tvůj <strong className="text-gray-900 font-medium">profil zůstává aktivní</strong> — můžeš ho dál používat zdarma nebo smazat v <Link href="/profile" className="text-pink-500 underline">nastavení profilu</Link>.</li>
              <li>Refund proběhne na původní platební prostředek. Termín závisí na kanálu: u Apple/Google obvykle 5–10 dní od schválení, u webových plateb do 14 dnů.</li>
              <li>Žádné penále, žádné storno poplatky.</li>
            </ul>
          </section>

        </div>
      </article>
    </main>
  )
}
