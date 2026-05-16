import Link from 'next/link'
import type { Metadata } from 'next'

const TITLE = 'Jak Cosmatch ověřuje profily — Ochrana před scammery | Cosmatch'
const DESCRIPTION = 'ID verifikace, kontrola fotek a transparentní reportování. Česká republika je 6. nejzranitelnější země vůči romance scams. Cosmatch nabízí ověřené profily se zeleným štítkem.'

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
            Cosmatch proto staví na třech vrstvách ochrany, jejichž společným cílem
            je jediné: aby ses na cosmatch.cz nemusela bát.
          </p>
        </header>

        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Tři vrstvy</p>
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

            <div className="grid grid-cols-[auto,1fr] gap-x-8">
              <div className="roman text-3xl text-pink-500 pt-1">III</div>
              <div>
                <h3 className="serif text-2xl text-gray-900 font-medium mb-3 leading-tight">Povinná ID verifikace pro Cosmatch Serious</h3>
                <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-3">
                  Každý uživatel tarifu Cosmatch Serious projde kontrolou totožnosti
                  přes renomovanou EU službu (občanský průkaz + selfie, zabere 2 minuty).
                  Po ověření získá profil zelený štítek <span className="inline-flex items-center gap-1 align-middle text-emerald-600 font-medium"><svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>Ověřeno</span> a uvidí jen ostatní ověřené.
                </p>
                <p className="text-sm text-gray-500 italic">
                  Bez ověření Serious nefunguje. Pokud verifikaci nedokončíš do 7 dnů od platby, vracíme peníze zpět.
                </p>
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
              Když nahlásíš podezřelý profil tlačítkem „Nahlásit", spustí se okamžitě tři kroky:
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

        <section className="bg-white rounded-3xl border border-gray-100 p-10 mt-12">
          <p className="eyebrow text-pink-500 mb-4">Chceš ověřit svůj profil?</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">
            ID verifikace je v tarifu Cosmatch Serious.
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8 text-[1.0625rem]">
            Ověřením získáš zelený štítek <span className="inline-flex items-center gap-1 align-middle text-emerald-600 font-medium"><svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>Ověřeno</span>, prémiové filtry
            a možnost vidět jen ověřené profily.
          </p>
          <Link href="/premium" className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-full text-base font-medium hover:bg-gray-800 transition-all">
            Přejít na předplatné
          </Link>
        </section>

        <footer className="mt-20 pt-12 border-t border-gray-200">
          <p className="text-xs text-gray-400 leading-relaxed">
            Cosmatch · Mgr. Ing. Simona Cibulková · IČO 08419531 · Praha 2026.
            Pokud se setkáš s podezřelým chováním, napiš na <a className="text-pink-500 underline" href="mailto:ahoj@cosmatch.cz">ahoj@cosmatch.cz</a>.
          </p>
        </footer>
      </article>
    </main>
  )
}
