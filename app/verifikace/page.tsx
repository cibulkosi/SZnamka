import Link from 'next/link'
import type { Metadata } from 'next'

const TITLE = 'Jak Cosmatch ověřuje profily — Ochrana před scammery | Cosmatch'
const DESCRIPTION = 'Cloudflare Turnstile anti-bot, SSO přihlášení bez hesla a transparentní reportování. Česká republika je 6. nejzranitelnější země vůči romance scams. Cosmatch staví na vícevrstvé ochraně před scammery.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://cosmatch.cz/verifikace' },
  openGraph: {
    title: TITLE, description: DESCRIPTION, type: 'article',
    siteName: 'Cosmatch', locale: 'cs_CZ',
    url: 'https://cosmatch.cz/verifikace',
  },
}

export default function VerifikacePage() {
  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": 'Jak Cosmatch ověřuje uživatele?', "acceptedAnswer": { "@type": "Answer", "text": 'Dvě vrstvy: bot-shield při registraci (Cloudflare Turnstile, neviditelný anti-bot test) a SSO bez hesla (Google/Facebook s reálným telefonem). ID verifikace s občanským průkazem se připravuje a bude k dispozici později.' } },
          { "@type": "Question", "name": 'Je ID verifikace povinná?', "acceptedAnswer": { "@type": "Answer", "text": 'Ne. Cosmatch v současné fázi nepoužívá ID verifikaci s občanským průkazem. Ochrana stojí na Cloudflare Turnstile + SSO bez hesla. ID verifikace s ověřeným štítkem se připravuje a bude k dispozici později.' } },
          { "@type": "Question", "name": 'Co se stane když nahlásím podezřelý profil?', "acceptedAnswer": { "@type": "Answer", "text": 'V řádech minut profil dočasně skryjeme z feedu. Pokud potvrdíme scam, trvale ho mažeme a zapisujeme do interní blacklist databáze, aby se nemohl znovu zaregistrovat.' } },
          { "@type": "Question", "name": 'Kde najdu měsíční reporty bezpečnosti?', "acceptedAnswer": { "@type": "Answer", "text": 'Na této stránce. Aktualizujeme statistiky reportů, zablokovaných profilů a ověřených uživatelů každý měsíc po ostrém spuštění.' } }
        ]
      }) }} />
      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">← Cosmatch</Link>
      </div>

      <article className="max-w-2xl mx-auto px-6 pt-16 pb-24">

        <header className="mb-16">
          <p className="eyebrow text-pink-500 mb-6">Bezpečnost</p>
          <h1 className="serif-display text-5xl sm:text-6xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-8">
            Jak Cosmatch<br/><em className="italic text-pink-500">ověřuje</em> profily.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-8" />
          <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
            Česká republika je šestá nejzranitelnější země světa vůči romance scams.
            Cosmatch proto staví na dvou vrstvách ochrany, jejichž společným cílem
            je jediné: aby ses na cosmatch.cz nemusela bát.
          </p>
        </header>

        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Dvě vrstvy</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-12">
            Co děláme proti scammerům.
          </h2>

          <div className="space-y-12">
            <div className="grid grid-cols-[auto,1fr] gap-x-8">
              <div className="roman text-3xl text-pink-500 pt-1">I</div>
              <div>
                <h3 className="serif text-2xl text-gray-900 font-medium mb-3 leading-tight">Bot-shield při registraci</h3>
                <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-3">
                  Před vstupem do aplikace každý uživatel projde Cloudflare Turnstile —
                  neviditelný test, který odhaluje automatizované registrace. Boti se
                  k vám nedostanou.
                </p>
                <p className="text-sm text-gray-500 italic">Doplňkově: rate limiting na úrovni Cloudflare WAF, honeypot pole, IP throttling.</p>
              </div>
            </div>

            <div className="grid grid-cols-[auto,1fr] gap-x-8">
              <div className="roman text-3xl text-pink-500 pt-1">II</div>
              <div>
                <h3 className="serif text-2xl text-gray-900 font-medium mb-3 leading-tight">SSO bez hesla</h3>
                <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-3">
                  Přihlášení jen přes Google nebo Facebook — heslo u nás neexistuje,
                  takže ti ho nemůžeme ztratit. Tyto účty navíc vyžadují reálné
                  telefonní číslo, což je pro většinu botů příliš drahá překážka.
                </p>
                <p className="text-sm text-gray-500 italic">Žádné e-maily z mailinatoru, žádné fake registrace.</p>
              </div>
            </div>
          </div>
        </section>

        <hr className="rule mb-16" />

        <section className="mb-16">
          <p className="eyebrow text-pink-500 mb-4">Co děláme po nahlášení</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-8">
            Krizový plán.
          </h2>
          <div className="space-y-6 text-gray-700 leading-[1.75] text-[1.0625rem]">
            <p>
              Když nahlásíš podezřelý profil tlačítkem „Nahlásit“, spustí se okamžitě tři kroky:
            </p>
            <ol className="space-y-3 list-none ml-0">
              <li className="grid grid-cols-[auto,1fr] gap-4">
                <span className="serif text-pink-500 font-medium">01</span>
                <span>Profil je v řádech minut dočasně skrytý z feedu, dokud nezkontrolujeme nahlášení.</span>
              </li>
              <li className="grid grid-cols-[auto,1fr] gap-4">
                <span className="serif text-pink-500 font-medium">02</span>
                <span>Pokud potvrdíme scam, účet trvale mažeme a zápisem do interní blacklist databáze předejdeme opakované registraci.</span>
              </li>
              <li className="grid grid-cols-[auto,1fr] gap-4">
                <span className="serif text-pink-500 font-medium">03</span>
                <span>Jednou měsíčně zveřejníme veřejně dostupné statistiky reportů — kolik účtů zablokovaných, kolik vyřešených.</span>
              </li>
            </ol>
          </div>
        </section>

        <hr className="rule mb-16" />

        <section className="mb-16">
          <p className="eyebrow text-pink-500 mb-4">Statistiky reportů</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-8">
            Cosmatch v transparentních číslech.
          </h2>
          <div className="bg-white rounded-3xl border border-gray-100 p-10">
            <p className="eyebrow text-gray-500 mb-2">Květen 2026 · od spuštění</p>
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div>
                <p className="serif-display text-4xl text-gray-900 font-medium tabular-nums">0</p>
                <p className="text-xs text-gray-500 mt-1">přijatých reportů</p>
              </div>
              <div>
                <p className="serif-display text-4xl text-gray-900 font-medium tabular-nums">0</p>
                <p className="text-xs text-gray-500 mt-1">zablokovaných profilů</p>
              </div>
              <div>
                <p className="serif-display text-4xl text-emerald-600 font-medium tabular-nums">0</p>
                <p className="text-xs text-gray-500 mt-1">ověřených uživatelů</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed italic">
              Cosmatch ještě nezačal naostro — tato čísla aktualizujeme každý měsíc od ostrého spuštění.
            </p>
          </div>
        </section>

        <footer className="mt-20 pt-12 border-t border-gray-200">
          <p className="text-xs text-gray-400 leading-relaxed">
            Cosmatch · Mgr. Ing. Simona Cibulková · IČO 08419531 · Praha 5, 2026.
            Pokud se setkáš s podezřelým chováním, napiš na <a className="text-pink-500 underline" href="mailto:ahoj@cosmatch.cz">ahoj@cosmatch.cz</a>.
          </p>
        </footer>
      </article>
    </main>
  )
}
