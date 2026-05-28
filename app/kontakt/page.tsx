import type { Metadata } from 'next'
import Link from 'next/link'
import KontaktForm from './KontaktForm'

const TITLE = 'Kontakt | Cosmatch'
const DESC = 'Kontaktní formulář Cosmatch — napiš nám otázku, reklamaci nebo GDPR žádost. Odpovídáme do 48 hodin. Provozovatel: Mgr. Ing. Simona Cibulková, IČO 08419531, Praha 5.'
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
            Napiš<br/><em className="italic text-pink-500">nám</em>.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-6" />
          <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
            Chceš nahlásit podezřelý profil, máš nějakou otázku, GDPR žádost nebo reklamaci? Napiš nám, obvykle odpovídáme do 48 hodin.
          </p>
        </header>

        {/* Formulář */}
        <section className="bg-white border border-gray-100 rounded-3xl p-8 sm:p-10 mb-16">
          <KontaktForm />
        </section>

        <hr className="rule mb-12" />

        {/* Legal footer — kompaktní, drobný font, vše povinné info zachované */}
        <section className="text-sm text-gray-600 leading-[1.75] space-y-5">

          <div>
            <p className="eyebrow text-gray-400 mb-2">Provozovatel</p>
            <address className="not-italic">
              <strong className="text-gray-900 font-medium">Mgr. Ing. Simona Cibulková</strong> · IČO 08419531 · Kurzova 2222/16, 155 00 Praha 5 - Stodůlky · Datová schránka <span className="font-mono text-gray-700">tttkfnk</span>
            </address>
          </div>

          <div>
            <p className="eyebrow text-gray-400 mb-2">Právní dokumenty</p>
            <p>
              <Link href="/obchodni-podminky" className="text-pink-500 hover:underline">Obchodní podmínky</Link>
              <span className="text-gray-400"> · </span>
              <Link href="/zasady-ochrany-osobnich-udaju" className="text-pink-500 hover:underline">GDPR</Link>
              <span className="text-gray-400"> · </span>
              <Link href="/reklamacni-rad" className="text-pink-500 hover:underline">Reklamační řád</Link>
              <span className="text-gray-400"> · </span>
              <Link href="/odstoupeni-od-smlouvy" className="text-pink-500 hover:underline">Odstoupení od smlouvy</Link>
              <span className="text-gray-400"> · </span>
              <Link href="/opakovane-platby" className="text-pink-500 hover:underline">Opakované platby</Link>
              <span className="text-gray-400"> · </span>
              <Link href="/cookies" className="text-pink-500 hover:underline">Cookies</Link>
              <span className="text-gray-400"> · </span>
              <Link href="/manifest-duvery" className="text-pink-500 hover:underline">Manifest důvěry</Link>
            </p>
          </div>

        </section>

        <footer className="mt-16 pt-8 border-t border-gray-200">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">← Zpět na Cosmatch</Link>
        </footer>

      </article>
    </main>
  )
}
