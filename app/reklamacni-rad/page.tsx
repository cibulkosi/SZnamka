
import type { Metadata } from 'next'
import Link from 'next/link'

const TITLE = 'Reklamační řád | Cosmatch'
const DESC = 'Postup řešení reklamací předplatného Cosmatch+ podle českého občanského zákoníku.'
const URL = 'https://cosmatch.cz/reklamacni-rad'

export const metadata: Metadata = {
  title: TITLE, description: DESC,
  alternates: { canonical: URL, languages: { 'cs-CZ': URL, 'x-default': URL } },
}

export default function ReklamacniRadPage() {
  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">← Cosmatch</Link>
      </div>

      <article className="max-w-2xl mx-auto px-6 pt-16 pb-24">
        <header className="mb-12">
          <p className="eyebrow text-pink-500 mb-6">Právní dokument</p>
          <h1 className="serif-display text-5xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-6">
            Reklamační<br/><em className="italic text-pink-500">řád</em>.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-6" />
          <p className="text-sm text-gray-500">Účinné od 17. května 2026 · Verze 1.0</p>
        </header>

        <div className="space-y-12 text-gray-800 leading-[1.75] text-[1.0625rem]">

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">1. Úvodní ustanovení</h2>
            <p className="mb-3">
              <strong className="text-gray-900 font-medium">1.1</strong> Tento reklamační řád upravuje způsob a podmínky uplatňování reklamací digitálních služeb poskytovaných na Cosmatch.cz provozovaných Mgr. Ing. Simonou Cibulkovou, IČO 08419531, datová schránka tttkfnk (dále jen „<strong>Provozovatel</strong>“).
            </p>
            <p>
              <strong className="text-gray-900 font-medium">1.2</strong> Reklamační řád je vypracován v souladu se zákonem č. 89/2012 Sb. (občanský zákoník) a zákonem č. 634/1992 Sb. (zákon o ochraně spotřebitele).
            </p>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">2. Předmět reklamace</h2>
            <p className="mb-3">
              <strong className="text-gray-900 font-medium">2.1</strong> Reklamovat lze:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-gray-900 font-medium">Vadné poskytnutí placené služby</strong> — např. nefunkční prémiová funkce Cosmatch+, ke které máš zaplacený přístup.</li>
              <li><strong className="text-gray-900 font-medium">Neoprávněné zúčtování</strong> — opakovaná platba, chybná částka, dvojitá platba.</li>
              <li><strong className="text-gray-900 font-medium">Nedoručení voucheru</strong> — pokud ses přidal/a na waitlist a slíbený voucher na 3 měsíce Cosmatch+ ti nedorazil.</li>
              <li><strong className="text-gray-900 font-medium">Dlouhodobý výpadek aplikace</strong> — pokud Cosmatch nefunguje déle než 24 hodin v měsíci po dobu placeného předplatného.</li>
            </ul>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">3. Postup uplatnění reklamace</h2>
            <p className="mb-3">
              <strong className="text-gray-900 font-medium">3.1</strong> Reklamaci uplatníš e-mailem na <a href="mailto:ahoj@cosmatch.cz" className="text-pink-500 underline">ahoj@cosmatch.cz</a> s předmětem „Reklamace [tvůj e-mail]“.
            </p>
            <p className="mb-3">
              <strong className="text-gray-900 font-medium">3.2</strong> V reklamaci uveď:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-3">
              <li>tvoje jméno a e-mail registrovaný v Cosmatch,</li>
              <li>datum vzniku problému,</li>
              <li>popis vady (co nefunguje, co očekáváš),</li>
              <li>screenshot pokud relevantní,</li>
              <li>preferovaný způsob řešení (refundace, oprava, sleva).</li>
            </ul>
            <p>
              <strong className="text-gray-900 font-medium">3.3</strong> Reklamace je přijata okamžikem doručení e-mailu. O přijetí pošleme potvrzení do 48 hodin.
            </p>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">4. Lhůty pro vyřízení</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-gray-900 font-medium">Maximálně 30 dnů</strong> od přijetí reklamace ze zákona.</li>
              <li><strong className="text-gray-900 font-medium">Cosmatch cíl: 7 dnů</strong> — snažíme se vyřídit většinu reklamací do týdne.</li>
              <li>Pokud je reklamace složitější (vyžaduje technickou analýzu), informujeme tě o prodloužení do 30 dnů od přijetí.</li>
            </ul>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">5. Způsoby vyřízení</h2>
            <p className="mb-3">Cosmatch reklamaci vyřeší jedním z těchto způsobů:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-gray-900 font-medium">Oprava chyby</strong> — pokud jde o technickou závadu, opravíme ji a obnovíme funkčnost.</li>
              <li><strong className="text-gray-900 font-medium">Sleva z předplatného</strong> — alikvotní část za dobu, kdy služba nefungovala.</li>
              <li><strong className="text-gray-900 font-medium">Plná refundace</strong> — pokud vada brání používání služby a oprava není možná v rozumné lhůtě.</li>
              <li><strong className="text-gray-900 font-medium">Prodloužení předplatného</strong> — alternativa k refundaci, pokud souhlasíš.</li>
            </ul>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">6. Mimosoudní řešení sporů</h2>
            <p className="mb-3">
              Pokud nesouhlasíš s vyřízením reklamace, máš právo obrátit se na:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-gray-900 font-medium">Českou obchodní inspekci</strong> jako orgán mimosoudního řešení spotřebitelských sporů. Web: <a href="https://www.coi.cz" target="_blank" rel="noopener" className="text-pink-500 underline">coi.cz</a></li>
              <li><strong className="text-gray-900 font-medium">EU platformu ODR</strong> pro online spory: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener" className="text-pink-500 underline">ec.europa.eu/consumers/odr</a></li>
              <li>Obecný soud v místě tvého bydliště.</li>
            </ul>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">7. Kontakt</h2>
            <p>
              Reklamace, dotazy, stížnosti: <a href="mailto:ahoj@cosmatch.cz" className="text-pink-500 underline">ahoj@cosmatch.cz</a>
              <br/>
              Provozovatel: Mgr. Ing. Simona Cibulková, IČO 08419531, datová schránka tttkfnk, Praha, Česká republika.
            </p>
          </section>
        </div>
      </article>
    </main>
  )
}
