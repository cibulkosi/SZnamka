import type { Metadata } from 'next'
import Link from 'next/link'

const TITLE = 'Kontakt | Cosmatch'
const DESC = 'Kontaktní údaje provozovatele Cosmatch.cz — Mgr. Ing. Simona Cibulková, IČO 08419531, sídlo Praha, datová schránka tttkfnk, e-mail ahoj@cosmatch.cz.'
const URL = 'https://cosmatch.cz/kontakt'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL, languages: { 'cs-CZ': URL, 'x-default': URL } },
  openGraph: { title: TITLE, description: DESC, url: URL, type: 'website', siteName: 'Cosmatch', locale: 'cs_CZ' },
}

export default function KontaktPage() {
  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">← Cosmatch</Link>
      </div>

      <article className="max-w-2xl mx-auto px-6 pt-16 pb-24">

        <header className="mb-12">
          <p className="eyebrow text-pink-500 mb-6">Kontakt</p>
          <h1 className="serif-display text-5xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-6">
            Jak nás<br/><em className="italic text-pink-500">zastihnout</em>.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-6" />
          <p className="text-sm text-gray-500">
            Aktualizováno 18. května 2026
          </p>
        </header>

        <div className="space-y-12 text-gray-800 leading-[1.75] text-[1.0625rem]">

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-6">Provozovatel</h2>
            <div className="space-y-3">
              <p><strong className="text-gray-900 font-medium">Mgr. Ing. Simona Cibulková</strong></p>
              <p><span className="text-gray-500">IČO:</span> 08419531</p>
              <p><span className="text-gray-500">Sídlo:</span> Praha, Česká republika</p>
              <p><span className="text-gray-500">Datová schránka:</span> <span className="font-mono">tttkfnk</span></p>
              <p className="text-sm text-gray-500 pt-2">
                Fyzická osoba podnikající dle živnostenského zákona. Zapsána v živnostenském rejstříku.
              </p>
            </div>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-6">Komunikace</h2>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Obecné dotazy, podpora pro uživatele, dotazy ke způsobu platby</p>
                <p><a href="mailto:ahoj@cosmatch.cz" className="text-pink-500 hover:underline font-medium">ahoj@cosmatch.cz</a></p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">GDPR žádosti (přístup k datům, výmaz, oprava)</p>
                <p><a href="mailto:ahoj@cosmatch.cz" className="text-pink-500 hover:underline font-medium">ahoj@cosmatch.cz</a></p>
                <p className="text-xs text-gray-500 mt-1">
                  Zákonný limit pro vyřízení: 30 dní. Podrobnosti viz <Link href="/zasady-ochrany-osobnich-udaju" className="underline hover:text-gray-900">Zásady ochrany osobních údajů</Link>.
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Reklamace a odstoupení od smlouvy</p>
                <p><a href="mailto:ahoj@cosmatch.cz" className="text-pink-500 hover:underline font-medium">ahoj@cosmatch.cz</a></p>
                <p className="text-xs text-gray-500 mt-1">
                  Postup viz <Link href="/reklamacni-rad" className="underline hover:text-gray-900">Reklamační řád</Link> a <Link href="/odstoupeni-od-smlouvy" className="underline hover:text-gray-900">Odstoupení od smlouvy</Link>.
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Úřední podání (orgány státní správy)</p>
                <p>Datová schránka <span className="font-mono">tttkfnk</span></p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-6">Právní dokumenty</h2>
            <ul className="space-y-2">
              <li><Link href="/obchodni-podminky" className="text-pink-500 hover:underline">Obchodní podmínky</Link></li>
              <li><Link href="/opakovane-platby" className="text-pink-500 hover:underline">Opakované platby</Link></li>
              <li><Link href="/zasady-ochrany-osobnich-udaju" className="text-pink-500 hover:underline">Zásady ochrany osobních údajů (GDPR)</Link></li>
              <li><Link href="/reklamacni-rad" className="text-pink-500 hover:underline">Reklamační řád</Link></li>
              <li><Link href="/odstoupeni-od-smlouvy" className="text-pink-500 hover:underline">Odstoupení od smlouvy</Link></li>
              <li><Link href="/cookies" className="text-pink-500 hover:underline">Zásady používání cookies</Link></li>
              <li><Link href="/manifest-duvery" className="text-pink-500 hover:underline">Manifest důvěry</Link></li>
            </ul>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-6">Mimosoudní řešení sporů</h2>
            <p className="mb-3">
              K mimosoudnímu řešení spotřebitelských sporů je příslušná <strong className="text-gray-900 font-medium">Česká obchodní inspekce</strong> (Štěpánská 567/15, 120 00 Praha 2, <a href="https://www.coi.cz" className="text-pink-500 hover:underline" rel="noopener">coi.cz</a>).
            </p>
            <p>
              Spotřebitel může také využít platformu pro <strong className="text-gray-900 font-medium">řešení sporů online</strong> Evropské komise dostupnou na <a href="https://ec.europa.eu/consumers/odr" className="text-pink-500 hover:underline" rel="noopener">ec.europa.eu/consumers/odr</a>.
            </p>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-6">Orgány dozoru</h2>
            <ul className="space-y-2">
              <li><strong className="text-gray-900 font-medium">Živnostenský úřad:</strong> Úřad městské části dle sídla provozovatele (Praha)</li>
              <li><strong className="text-gray-900 font-medium">Ochrana osobních údajů:</strong> Úřad pro ochranu osobních údajů, Pplk. Sochora 27, 170 00 Praha 7, <a href="https://www.uoou.cz" className="text-pink-500 hover:underline" rel="noopener">uoou.cz</a></li>
              <li><strong className="text-gray-900 font-medium">Ochrana spotřebitele:</strong> Česká obchodní inspekce, <a href="https://www.coi.cz" className="text-pink-500 hover:underline" rel="noopener">coi.cz</a></li>
            </ul>
          </section>

        </div>

        <footer className="mt-16 pt-8 border-t border-gray-200">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">← Zpět na Cosmatch</Link>
        </footer>

      </article>
    </main>
  )
}
