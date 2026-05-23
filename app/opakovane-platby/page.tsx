import type { Metadata } from 'next'
import Link from 'next/link'

const TITLE = 'Předplatné a platby | Cosmatch'
const DESC = 'Jak fungují platby a předplatné u Cosmatch+. Předplatné je dostupné v mobilní aplikaci Cosmatch pro iOS (App Store) a Android (Google Play). Měsíčně 249 Kč, kvartálně 597 Kč (sleva 20 %), ročně 2 088 Kč (sleva 30 %). Automatická obnova, zrušení kdykoli v nastavení Apple ID / Google účtu.'
const URL = 'https://cosmatch.cz/opakovane-platby'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL, languages: { 'cs-CZ': URL, 'x-default': URL } },
  openGraph: { title: TITLE, description: DESC, url: URL, type: 'article', siteName: 'Cosmatch', locale: 'cs_CZ' },
}

export default function OpakovanePlatbyPage() {
  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">← Cosmatch</Link>
      </div>

      <article className="max-w-2xl mx-auto px-6 pt-16 pb-24">

        <header className="mb-12">
          <p className="eyebrow text-pink-500 mb-6">Platby</p>
          <h1 className="serif-display text-5xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-6">
            Předplatné<br/>a <em className="italic text-pink-500">platby</em>.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-6" />
          <p className="text-sm text-gray-500">
            Účinné od 20. května 2026 · Verze 2.0
          </p>
        </header>

        <div className="space-y-12 text-gray-800 leading-[1.75] text-[1.0625rem]">

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">Kde Cosmatch+ koupíš</h2>
            <p className="mb-3">
              Předplatné Cosmatch+ je dostupné <strong className="text-gray-900 font-medium">výhradně v mobilní aplikaci Cosmatch</strong> pro iOS (Apple App Store) a Android (Google Play). Platba a fakturace probíhá přes Apple, respektive Google — ne přes Cosmatch.
            </p>
            <p className="mb-3">
              Mobilní aplikace se připravuje. Až bude k dispozici, dozvíš se to jako první, pokud jsi na <Link href="/waitlist" className="text-pink-500 hover:underline">waitlistu</Link>.
            </p>
            <p>
              Webová verze cosmatch.cz slouží k registraci, prohlížení profilů a chatu. Prémiové funkce (Cosmatch+) zatím web nenabízí — všechny platby probíhají přes Apple / Google v mobilní aplikaci.
            </p>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">Co se stane při nákupu</h2>
            <p className="mb-3"><strong className="text-gray-900 font-medium">1.</strong> V mobilní aplikaci Cosmatch otevřeš sekci <em>Cosmatch+</em> a vybereš plán (měsíční / kvartální / roční).</p>
            <p className="mb-3"><strong className="text-gray-900 font-medium">2.</strong> Zobrazí se Ti standardní platební dialog Apple App Store (iOS) nebo Google Play (Android). Platbu potvrdíš biometrií (Face ID, Touch ID, otisk prstu) nebo heslem ke svému Apple ID / Google účtu.</p>
            <p className="mb-3"><strong className="text-gray-900 font-medium">3.</strong> Platbu zúčtuje Apple, respektive Google. Cosmatch dostane pouze informaci o úspěšné transakci — žádné údaje o Tvé kartě.</p>
            <p className="mb-3"><strong className="text-gray-900 font-medium">4.</strong> Fakturu / doklad o platbě Ti vystaví Apple nebo Google ve své standardní podobě (zaslaná e-mailem na adresu Tvého Apple ID / Google účtu).</p>
            <p><strong className="text-gray-900 font-medium">5.</strong> Cosmatch+ se v aplikaci aktivuje okamžitě.</p>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">Parametry předplatného</h2>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <dl className="divide-y divide-gray-200">
                <div className="grid grid-cols-2 px-4 py-3"><dt className="text-gray-500">Služba</dt><dd className="font-medium text-gray-900">Cosmatch+</dd></div>
                <div className="grid grid-cols-2 px-4 py-3"><dt className="text-gray-500">Měsíčně</dt><dd className="font-medium text-gray-900">249 Kč / 30 dní</dd></div>
                <div className="grid grid-cols-2 px-4 py-3"><dt className="text-gray-500">Kvartálně</dt><dd className="font-medium text-gray-900">597 Kč / 90 dní <span className="text-emerald-600 text-sm">(sleva 20 %)</span></dd></div>
                <div className="grid grid-cols-2 px-4 py-3"><dt className="text-gray-500">Ročně</dt><dd className="font-medium text-gray-900">2 088 Kč / 365 dní <span className="text-emerald-600 text-sm">(sleva 30 %)</span></dd></div>
                <div className="grid grid-cols-2 px-4 py-3"><dt className="text-gray-500">Měna</dt><dd className="font-medium text-gray-900">CZK (Apple / Google může účtovat v lokální měně)</dd></div>
                <div className="grid grid-cols-2 px-4 py-3"><dt className="text-gray-500">Perioda obnovy</dt><dd className="font-medium text-gray-900">Dle zvoleného plánu (30 / 90 / 365 dní)</dd></div>
                <div className="grid grid-cols-2 px-4 py-3"><dt className="text-gray-500">Doba trvání</dt><dd className="font-medium text-gray-900">Na dobu neurčitou (do zrušení)</dd></div>
                <div className="grid grid-cols-2 px-4 py-3"><dt className="text-gray-500">Platební partner (iOS)</dt><dd className="font-medium text-gray-900">Apple Distribution International Ltd. (Irsko)</dd></div>
                <div className="grid grid-cols-2 px-4 py-3"><dt className="text-gray-500">Platební partner (Android)</dt><dd className="font-medium text-gray-900">Google Commerce Limited (Irsko)</dd></div>
                <div className="grid grid-cols-2 px-4 py-3"><dt className="text-gray-500">DPH</dt><dd className="font-medium text-gray-900">Vybírá a odvádí Apple / Google v zemi spotřebitele</dd></div>
              </dl>
            </div>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">Jak zrušit předplatné</h2>
            <p className="mb-3">
              Předplatné můžeš <strong className="text-gray-900 font-medium">kdykoli zrušit</strong>, a to bez udání důvodu, bez sankce a bez výpovědní lhůty. Zrušení se provádí v nastavení Tvého Apple ID, respektive Google účtu — ne v aplikaci Cosmatch.
            </p>
            <p className="mb-3"><strong className="text-gray-900 font-medium">iPhone / iPad (iOS)</strong></p>
            <p className="mb-3 pl-4">
              Nastavení → Tvoje jméno (Apple ID) → Předplatné → Cosmatch+ → Zrušit předplatné. Nebo přes <a href="https://apps.apple.com/account/subscriptions" target="_blank" rel="noopener" className="text-pink-500 hover:underline">apps.apple.com/account/subscriptions</a>.
            </p>
            <p className="mb-3"><strong className="text-gray-900 font-medium">Android (Google Play)</strong></p>
            <p className="mb-3 pl-4">
              Aplikace Google Play → Tvoje ikona → Platby a předplatné → Předplatné → Cosmatch+ → Zrušit. Nebo přes <a href="https://play.google.com/store/account/subscriptions" target="_blank" rel="noopener" className="text-pink-500 hover:underline">play.google.com/store/account/subscriptions</a>.
            </p>
            <p>
              <strong className="text-gray-900 font-medium">Co se stane po zrušení:</strong> Cosmatch+ Ti zůstane aktivní až do konce již zaplaceného období, poté se profil vrátí na bezplatný režim. Žádná další platba už nebude stržena.
            </p>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">Změna ceny</h2>
            <p>
              Pokud Cosmatch rozhodne o změně ceny, oznámí to e-mailem <strong className="text-gray-900 font-medium">minimálně 30 dní</strong> před účinností nové ceny. Apple / Google Ti navíc ze své strany pošlou samostatné oznámení o změně předplatného. Do účinnosti nové ceny máš právo předplatné zrušit bez sankce.
            </p>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">Neúspěšná platba</h2>
            <p className="mb-3">
              Pokud se automatické stržení nepodaří (např. expirovaná karta, nedostatek prostředků), Apple / Google se pokusí platbu zopakovat dle vlastních pravidel (obvykle 3× během 16 dní u Apple, podobně u Google) a budou Tě o tom informovat.
            </p>
            <p>
              Pokud ani opakované pokusy neprojdou, Cosmatch+ se automaticky deaktivuje a profil se vrátí na bezplatný režim. Předplatné můžeš znovu aktivovat s aktuální platební metodou v Apple App Store / Google Play.
            </p>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">Vrácení peněz (refundy)</h2>
            <p className="mb-3">
              Vrácení peněz za nákupy Cosmatch+ <strong className="text-gray-900 font-medium">zpracovává přímo Apple, respektive Google</strong> — ne Cosmatch. Žádost o refund vyřizují podle svých vlastních pravidel.
            </p>
            <p className="mb-3"><strong className="text-gray-900 font-medium">Apple App Store</strong></p>
            <p className="mb-3 pl-4">
              Vyplň formulář na <a href="https://reportaproblem.apple.com" target="_blank" rel="noopener" className="text-pink-500 hover:underline">reportaproblem.apple.com</a> (přihlásíš se svým Apple ID). Apple obvykle rozhodne do 48 hodin.
            </p>
            <p className="mb-3"><strong className="text-gray-900 font-medium">Google Play</strong></p>
            <p className="mb-3 pl-4">
              Otevři <a href="https://play.google.com/store/account/orderhistory" target="_blank" rel="noopener" className="text-pink-500 hover:underline">play.google.com/store/account/orderhistory</a> → najdi platbu Cosmatch+ → Požádat o vrácení peněz.
            </p>
            <p>
              Pokud Apple / Google refund schválí, peníze Ti vrátí na původní platební prostředek do 5–10 pracovních dní a Cosmatch+ se deaktivuje. V odůvodněných případech (technická porucha aplikace) využij <Link href="/kontakt" className="text-pink-500 hover:underline">kontaktní formulář</Link> — pomůžeme Ti při komunikaci s Apple / Google. Detail: <Link href="/reklamacni-rad" className="text-pink-500 hover:underline">Reklamační řád</Link> a <Link href="/odstoupeni-od-smlouvy" className="text-pink-500 hover:underline">Odstoupení od smlouvy</Link>.
            </p>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">Bezpečnost platby</h2>
            <p className="mb-3">
              Údaje o platební kartě (číslo karty, CVC, datum expirace) zadáváš <strong className="text-gray-900 font-medium">výhradně do svého Apple ID nebo Google účtu</strong> — Cosmatch je nikdy nevidí ani neukládá.
            </p>
            <p>
              Apple a Google jsou certifikovaní pro <strong className="text-gray-900 font-medium">PCI DSS Level 1</strong> (nejvyšší úroveň zabezpečení karetních dat) a používají tokenizaci — Cosmatch dostává jen šifrovaný identifikátor předplatného, ne samotné číslo karty.
            </p>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">Otázky?</h2>
            <p>
              Napiš nám přes <Link href="/kontakt" className="text-pink-500 hover:underline">kontaktní formulář</Link> — obvykle odpovídáme do 24 hodin. Více kontaktních cest najdeš na stránce <Link href="/kontakt" className="text-pink-500 hover:underline">Kontakt</Link>. Pro otázky týkající se Apple ID / Google účtu kontaktuj prosím podporu Apple, respektive Google.
            </p>
          </section>

        </div>

        <footer className="mt-16 pt-8 border-t border-gray-200">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">← Zpět na Cosmatch</Link>
        </footer>

      </article>
    </main>
  )
}
