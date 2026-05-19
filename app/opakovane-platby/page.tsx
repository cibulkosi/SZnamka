import type { Metadata } from 'next'
import Link from 'next/link'

const TITLE = 'Opakované platby | Cosmatch'
const DESC = 'Jak fungují opakované platby u Cosmatch+. Cosmatch+ 249 Kč/měs (597/3 měs · 1 788/rok), Cosmatch Serious 399 Kč/měs (987/3 měs · 2 988/rok). Automatická obnova, zrušení kdykoli z profilu, žádná smlouva na dobu určitou.'
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
            Opakované<br/><em className="italic text-pink-500">platby</em>.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-6" />
          <p className="text-sm text-gray-500">
            Účinné od 18. května 2026 · Verze 1.0
          </p>
        </header>

        <div className="space-y-12 text-gray-800 leading-[1.75] text-[1.0625rem]">

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">Co jsou opakované platby</h2>
            <p className="mb-3">
              Opakovaná platba (anglicky <em>recurring payment</em>) je automatické stržení předem dohodnuté částky z vaší platební karty v pravidelném intervalu — u Cosmatch+ <strong className="text-gray-900 font-medium">249 Kč / měsíc</strong>, <strong className="text-gray-900 font-medium">597 Kč / 3 měsíce</strong> nebo <strong className="text-gray-900 font-medium">1 788 Kč / rok</strong> dle plánu (Cosmatch Serious: 399 / 987 / 2 988 Kč).
            </p>
            <p className="mb-3">
              Slouží k tomu, abyste si nemuseli každý měsíc znovu zadávat údaje karty a aby vám služba Cosmatch+ běžela bez přerušení.
            </p>
            <p>
              Opakované platby zpracovává <strong className="text-gray-900 font-medium">GoPay s.r.o.</strong>, česká platební instituce regulovaná Českou národní bankou. Cosmatch nemá přímý přístup k vaší kartě — vidí pouze poslední 4 číslice a měsíc expirace.
            </p>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">Jak vznikne souhlas s opakovanou platbou</h2>
            <p className="mb-3"><strong className="text-gray-900 font-medium">1.</strong> V sekci <Link href="/premium" className="text-pink-500 hover:underline">Premium</Link> kliknete na tlačítko „Aktivovat Cosmatch+".</p>
            <p className="mb-3"><strong className="text-gray-900 font-medium">2.</strong> Otevře se vám zabezpečená platební brána GoPay, kde zadáte údaje své platební karty.</p>
            <p className="mb-3"><strong className="text-gray-900 font-medium">3.</strong> Před potvrzením platby vám brána GoPay <strong className="text-gray-900 font-medium">výslovně oznámí</strong>, že potvrzením této platby souhlasíte s automatickým strháváním zvolené částky dle vybraného plánu (Cosmatch+ 249 / 597 / 1 788 Kč; Cosmatch Serious 399 / 987 / 2 988 Kč).</p>
            <p className="mb-3"><strong className="text-gray-900 font-medium">4.</strong> Po úspěšné první platbě obdržíte na váš e-mail potvrzení s detaily: výše částky, perioda, datum příští platby a odkaz pro zrušení.</p>
            <p><strong className="text-gray-900 font-medium">5.</strong> Cosmatch+ se aktivuje okamžitě.</p>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">Parametry opakované platby</h2>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <dl className="divide-y divide-gray-200">
                <div className="grid grid-cols-2 px-4 py-3"><dt className="text-gray-500">Služba</dt><dd className="font-medium text-gray-900">Cosmatch+</dd></div>
                <div className="grid grid-cols-2 px-4 py-3"><dt className="text-gray-500">Cosmatch+ měsíčně</dt><dd className="font-medium text-gray-900">249 Kč / 30 dní</dd></div>
                <div className="grid grid-cols-2 px-4 py-3"><dt className="text-gray-500">Cosmatch+ kvartálně</dt><dd className="font-medium text-gray-900">597 Kč / 90 dní <span className="text-emerald-600 text-sm">(sleva 20 %)</span></dd></div>
                <div className="grid grid-cols-2 px-4 py-3"><dt className="text-gray-500">Cosmatch+ ročně</dt><dd className="font-medium text-gray-900">1 788 Kč / 365 dní <span className="text-emerald-600 text-sm">(sleva 40 %)</span></dd></div>
                <div className="grid grid-cols-2 px-4 py-3"><dt className="text-gray-500">Cosmatch Serious měsíčně</dt><dd className="font-medium text-gray-900">399 Kč / 30 dní</dd></div>
                <div className="grid grid-cols-2 px-4 py-3"><dt className="text-gray-500">Cosmatch Serious kvartálně</dt><dd className="font-medium text-gray-900">987 Kč / 90 dní <span className="text-emerald-600 text-sm">(sleva 18 %)</span></dd></div>
                <div className="grid grid-cols-2 px-4 py-3"><dt className="text-gray-500">Cosmatch Serious ročně</dt><dd className="font-medium text-gray-900">2 988 Kč / 365 dní <span className="text-emerald-600 text-sm">(sleva 38 %)</span></dd></div>
                <div className="grid grid-cols-2 px-4 py-3"><dt className="text-gray-500">Měna</dt><dd className="font-medium text-gray-900">CZK</dd></div>
                <div className="grid grid-cols-2 px-4 py-3"><dt className="text-gray-500">Perioda obnovy</dt><dd className="font-medium text-gray-900">Dle zvoleného plánu (30 / 90 / 365 dní)</dd></div>
                <div className="grid grid-cols-2 px-4 py-3"><dt className="text-gray-500">Doba trvání</dt><dd className="font-medium text-gray-900">Na dobu neurčitou (do zrušení)</dd></div>
                <div className="grid grid-cols-2 px-4 py-3"><dt className="text-gray-500">Datum první platby</dt><dd className="font-medium text-gray-900">Den aktivace</dd></div>
                <div className="grid grid-cols-2 px-4 py-3"><dt className="text-gray-500">Datum další platby</dt><dd className="font-medium text-gray-900">Vždy po 30 dnech</dd></div>
                <div className="grid grid-cols-2 px-4 py-3"><dt className="text-gray-500">Platební brána</dt><dd className="font-medium text-gray-900">GoPay s.r.o.</dd></div>
              </dl>
            </div>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">Jak zrušit opakovanou platbu</h2>
            <p className="mb-3">
              Opakovanou platbu můžete <strong className="text-gray-900 font-medium">kdykoli zrušit</strong>, a to bez udání důvodu, bez sankce a bez výpovědní lhůty.
            </p>
            <p className="mb-3"><strong className="text-gray-900 font-medium">Způsob 1 — v aplikaci (doporučeno)</strong></p>
            <p className="mb-3 pl-4">
              Přihlaste se do svého profilu na <Link href="/profile" className="text-pink-500 hover:underline">cosmatch.cz/profile</Link> → sekce „Předplatné" → tlačítko „Zrušit opakovanou platbu". Zrušení se projeví okamžitě.
            </p>
            <p className="mb-3"><strong className="text-gray-900 font-medium">Způsob 2 — e-mailem</strong></p>
            <p className="mb-3 pl-4">
              Napište na <a href="mailto:ahoj@cosmatch.cz" className="text-pink-500 hover:underline">ahoj@cosmatch.cz</a> z e-mailové adresy, kterou používáte v Cosmatch. Zrušení potvrdíme do 2 pracovních dní.
            </p>
            <p>
              <strong className="text-gray-900 font-medium">Co se stane po zrušení:</strong> Cosmatch+ vám zůstane aktivní až do konce již zaplaceného období (do 30 dní od poslední platby), poté se profil vrátí na bezplatný režim. Žádná další platba už nebude stržena.
            </p>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">Změna ceny</h2>
            <p>
              Pokud Provozovatel rozhodne o změně ceny Cosmatch+, oznámí to e-mailem <strong className="text-gray-900 font-medium">minimálně 30 dní</strong> před účinností nové ceny. Do té doby máte právo opakovanou platbu zrušit bez sankce. Pokračováním v používání po datu účinnosti nové ceny vyjadřujete se změnou souhlas.
            </p>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">Neúspěšná platba</h2>
            <p className="mb-3">
              Pokud se automatické stržení nepodaří (např. expirovaná karta, nedostatek prostředků, banka platbu zamítla), pokus se opakuje <strong className="text-gray-900 font-medium">3× během 7 dní</strong>. O každém neúspěšném pokusu vás informujeme e-mailem.
            </p>
            <p>
              Pokud ani 3. pokus neprojde, Cosmatch+ se automaticky deaktivuje a profil se vrátí na bezplatný režim. Můžete kdykoli znovu aktivovat s novou kartou.
            </p>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">Vrácení peněz</h2>
            <p className="mb-3">
              Cosmatch+ je <strong className="text-gray-900 font-medium">digitální obsah dodaný okamžitě po zaplacení</strong>, čímž dle § 1837 písm. l) občanského zákoníku zaniká právo na odstoupení od smlouvy ve 14denní lhůtě (potvrzené souhlasem při aktivaci).
            </p>
            <p>
              V odůvodněných případech (např. technická porucha na naší straně znemožňující používání) vám částku za nevyužité období vrátíme. Žádost o vrácení posílejte na <a href="mailto:ahoj@cosmatch.cz" className="text-pink-500 hover:underline">ahoj@cosmatch.cz</a>. Podrobnosti viz <Link href="/reklamacni-rad" className="text-pink-500 hover:underline">Reklamační řád</Link> a <Link href="/odstoupeni-od-smlouvy" className="text-pink-500 hover:underline">Odstoupení od smlouvy</Link>.
            </p>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">Bezpečnost platby</h2>
            <p className="mb-3">
              Údaje o kartě zadáváte výhradně do zabezpečené platební brány GoPay — Cosmatch je nikdy nevidí ani neukládá. GoPay je certifikovaný pro standard <strong className="text-gray-900 font-medium">PCI DSS Level 1</strong> (nejvyšší úroveň zabezpečení karetních dat).
            </p>
            <p>
              Pro opakované platby GoPay používá tokenizaci — uloží si zašifrovaný „token" reprezentující vaši kartu, ne samotné číslo karty. Pokud někdy GoPay opustí trh nebo přestaneme být jeho klientem, žádný subjekt nemůže s tímto tokenem nic provést u jiného obchodníka.
            </p>
          </section>

          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">Otázky?</h2>
            <p>
              Napište nám na <a href="mailto:ahoj@cosmatch.cz" className="text-pink-500 hover:underline">ahoj@cosmatch.cz</a> — obvykle odpovídáme do 24 hodin. Více kontaktních cest najdete na stránce <Link href="/kontakt" className="text-pink-500 hover:underline">Kontakt</Link>.
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
