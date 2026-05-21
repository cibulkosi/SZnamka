
import type { Metadata } from 'next'
import Link from 'next/link'

const TITLE = 'Cookies a sledovací technologie | Cosmatch'
const DESC = 'Cosmatch používá minimum cookies — jen technicky nezbytné. Žádný Google Analytics, žádný Facebook Pixel, žádné cross-site tracking.'
const URL = 'https://cosmatch.cz/cookies'

export const metadata: Metadata = {
  title: TITLE, description: DESC,
  alternates: { canonical: URL, languages: { 'cs-CZ': URL, 'x-default': URL } },
}

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">← Cosmatch</Link>
      </div>

      <article className="max-w-2xl mx-auto px-6 pt-16 pb-24">
        <header className="mb-12">
          <p className="eyebrow text-pink-500 mb-6">Soukromí</p>
          <h1 className="serif-display text-5xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-6">
            Cookies.<br/><em className="italic text-pink-500">Méně, než si myslíš</em>.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-6" />
          <p className="text-sm text-gray-500">Účinné od 17. května 2026 · Verze 1.0</p>
        </header>

        <div className="space-y-12 text-gray-800 leading-[1.75] text-[1.0625rem]">

          <section className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8">
            <p className="eyebrow text-emerald-600 mb-3">Ve zkratce</p>
            <p>
              Cosmatch <strong className="text-gray-900 font-medium">nepoužívá Google Analytics, Facebook Pixel ani jiné sledovací nástroje třetích stran</strong>. Žádné reklamní cookies. Žádné cross-site tracking. Používáme jen cookies, které jsou <em className="italic">technicky nezbytné</em> pro fungování aplikace.
            </p>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">Co je cookie?</h2>
            <p>
              Cookie je malý textový soubor, který web uloží do tvého prohlížeče. Slouží k zapamatování informací mezi návštěvami stránek — například že jsi přihlášený.
            </p>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">Jaké cookies Cosmatch používá</h2>

            <div className="space-y-6 mt-6">
              <div className="border border-gray-200 rounded-2xl p-6">
                <p className="eyebrow text-emerald-600 mb-2">Nezbytné</p>
                <h3 className="serif text-xl text-gray-900 font-medium mb-2">Supabase auth cookie</h3>
                <p className="text-gray-700 text-[0.95rem] mb-2">Uchovává tvoji přihlášenou session, abys nemusel/a být přihlášován/a při každém kliku.</p>
                <p className="text-xs text-gray-500">Doba: 1 rok · Doména: cosmatch.cz · Lze odmítnout? Ne (jinak se nepřihlásíš)</p>
              </div>

              <div className="border border-gray-200 rounded-2xl p-6">
                <p className="eyebrow text-emerald-600 mb-2">Nezbytné</p>
                <h3 className="serif text-xl text-gray-900 font-medium mb-2">Cloudflare cf-clearance</h3>
                <p className="text-gray-700 text-[0.95rem] mb-2">Anti-bot ochrana — potvrzuje, že nejsi automatizovaný program.</p>
                <p className="text-xs text-gray-500">Doba: 30 dnů · Doména: cosmatch.cz · Lze odmítnout? Ne (jinak nepronikneš přes ochranu)</p>
              </div>

              <div className="border border-gray-200 rounded-2xl p-6">
                <p className="eyebrow text-gray-500 mb-2">Funkční</p>
                <h3 className="serif text-xl text-gray-900 font-medium mb-2">localStorage „cosmatch_user“</h3>
                <p className="text-gray-700 text-[0.95rem] mb-2">Cache tvého profilu pro rychlejší načítání. Přepisováno při každém přihlášení.</p>
                <p className="text-xs text-gray-500">Doba: do odhlášení · Doména: cosmatch.cz · Lze odmítnout? Ano — odhlas se, pak smaž browser data</p>
              </div>

              <div className="border border-gray-200 rounded-2xl p-6">
                <p className="eyebrow text-gray-500 mb-2">Funkční</p>
                <h3 className="serif text-xl text-gray-900 font-medium mb-2">localStorage „cosmatch_daily_swipes“</h3>
                <p className="text-gray-700 text-[0.95rem] mb-2">Počítadlo denních lajků pro Free tier (limit 5/den).</p>
                <p className="text-xs text-gray-500">Doba: 1 den · Doména: cosmatch.cz · Lze odmítnout? Ano (počitadlo se neuloží)</p>
              </div>

              <div className="border border-gray-200 rounded-2xl p-6">
                <p className="eyebrow text-gray-500 mb-2">Funkční</p>
                <h3 className="serif text-xl text-gray-900 font-medium mb-2">localStorage „cosmatch_magic_seen“</h3>
                <p className="text-gray-700 text-[0.95rem] mb-2">Pamatuje si, že už jsi viděl/a magic moment uvítací zprávu (zobrazuje se jednou).</p>
                <p className="text-xs text-gray-500">Doba: trvale (do reset browser data) · Doména: cosmatch.cz · Lze odmítnout? Ano</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">Co Cosmatch NEPOUŽÍVÁ</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-gray-900 font-medium">Google Analytics</strong> — sledování chování uživatelů přes Google.</li>
              <li><strong className="text-gray-900 font-medium">Facebook Pixel</strong> — sledování pro Facebook reklamy.</li>
              <li><strong className="text-gray-900 font-medium">Hotjar / Microsoft Clarity</strong> — heatmaps a session replays.</li>
              <li><strong className="text-gray-900 font-medium">Reklamní cookies</strong> — žádné Doubleclick, Adsense, Criteo.</li>
              <li><strong className="text-gray-900 font-medium">Cross-site tracking</strong> — Cosmatch neví, co děláš jinde na internetu.</li>
            </ul>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">Platby a cookies</h2>
            <p>
              Předplatné Cosmatch+ se kupuje výhradně v mobilní aplikaci pro iOS (Apple App Store) nebo Android (Google Play) — ne na webu cosmatch.cz. Tyto platformy mají vlastní mechanismy ukládání dat ve své aplikaci, ne v tvém prohlížeči. Detail viz <a href="https://www.apple.com/legal/privacy/cz/cookies/" target="_blank" rel="noopener" className="text-pink-500 underline">Apple cookies</a> a <a href="https://policies.google.com/technologies/cookies?hl=cs" target="_blank" rel="noopener" className="text-pink-500 underline">Google cookies</a>.
            </p>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">Jak cookies smazat</h2>
            <p className="mb-3">
              V nastavení prohlížeče:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-gray-900 font-medium">Chrome:</strong> Nastavení → Soukromí a zabezpečení → Smazat data prohlížení</li>
              <li><strong className="text-gray-900 font-medium">Firefox:</strong> Nastavení → Soukromí a zabezpečení → Cookies a data webových stránek → Vymazat data</li>
              <li><strong className="text-gray-900 font-medium">Safari:</strong> Předvolby → Soukromí → Spravovat data webových stránek</li>
              <li><strong className="text-gray-900 font-medium">Edge:</strong> Nastavení → Soukromí, vyhledávání a služby → Vymazat data prohlížení</li>
            </ul>
            <p className="mt-3 text-sm text-gray-500 italic">
              Pozor: smazání auth cookie tě odhlásí z Cosmatch. Smazání ostatních cookies neovlivní fungování.
            </p>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">Související dokumenty</h2>
            <ul className="space-y-2">
              <li>→ <Link href="/zasady-ochrany-osobnich-udaju" className="text-pink-500 underline">Zásady ochrany osobních údajů (GDPR)</Link></li>
              <li>→ <Link href="/manifest-duvery" className="text-pink-500 underline">Manifest důvěry</Link> — 8 závazků</li>
            </ul>
          </section>
        </div>
      </article>
    </main>
  )
}
