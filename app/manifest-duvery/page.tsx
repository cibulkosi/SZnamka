import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Manifest důvěry — Cosmatch',
  description: 'Sedm věcí, ke kterým se Cosmatch zavazuje vůči uživatelům. Žádné falešné zprávy, žádné reklamy, žádné prodávání dat.',
}

const principles = [
  {
    numeral: 'I',
    title: 'Žádné bezduché swipy',
    body: 'Většina stránek včetně seznamek vydělává na tom, jak dlouho na nich zůstaneš. My ale chceme, aby sis našel vhodný protějšek a opustil nás. Cosmatch je navržen tak, abys mohl svůj profil jednoduše odstranit sám ve chvíli, kdy najdeš člověka, se kterým ti život dává smysl.',
  },
  {
    numeral: 'II',
    title: 'Datum narození zůstává utajeno',
    body: 'Tvoje datum používáme jen k jediné věci, a to k výpočtu kompatibility. Neprodáváme ho. Nikomu ho nepředáváme. Neprofilujeme tě podle něj mimo aplikaci. Je to klíč k tvému profilu, ne komodita.',
  },
  {
    numeral: 'III',
    title: 'Žádné falešné zprávy',
    body: 'Neposíláme falešné notifikace. Když ti přijde zpráva, znamená to, že Ti někdo opravdu napsal.',
  },
  {
    numeral: 'III-B',
    title: 'Nulové fake profily',
    body: 'Cosmatch nikdy nepoužívá AI generované profily, seed profily ani „demo postavičky“, aby aplikace vypadala plnější. Každý profil v Cosmatch je skutečný člověk, který se sám zaregistroval a souhlasil s podmínkami. Na seznamce možná sice najdeš méně lidí než jinde, ale zato jsou reální.',
  },
  {
    numeral: 'III-C',
    title: 'Fyzickou přitažlivost hodnotíš jen ty',
    body: 'Cosmatch nepoužívá fotku, výšku, postavu ani fyzické rysy ve výpočtu kompatibility. Algoritmus zohledňuje pouze datum narození, hodnoty a životní styl. Fyzické preference jsou filtry, které si nastavíš jen ty sám, nikoho nepenalizují ve skóre.',
  },
  {
    numeral: 'IV',
    title: 'Algoritmus, který umíme vysvětlit',
    body: 'Součástí algoritmu je třeba kompatibilita podle data narození 35 %, hodnoty a záměry 35 %, aktivita 20 %, společné zájmy 5 %. Vzdálenost, věk a vztah k dětem je filtr v preferencích, ne součást skóre. Žádné pozice nejsou placené. Nepoužíváme žádné skryté penalizace.',
  },
  {
    numeral: 'V',
    title: 'Bezpečnost není nadstandard',
    body: 'Česko je šestá nejzranitelnější země světa vůči romance scams, 45 % uživatelů seznamek totiž pravidelně narazí na podezřelý profil. Cosmatch proto nabízí ID verifikaci, Cloudflare Turnstile proti botům a Google/Facebook SSO bez hesla. Servery běží ve Frankfurtu (EU). Smazání účtu vyřídíme co nejdříve.',
  },
  {
    numeral: 'VI',
    title: 'Žádné reklamy. Nikdy.',
    body: 'Cosmatch financují uživatelé, ne inzerenti. Tvoje pozornost není zboží. Pokud jednou uvidíš v aplikaci reklamu, znamená to, že jsme ji prodali, a tehdy bude na čase odejít.',
  },
  {
    numeral: 'VII',
    title: 'Záruky, ne sliby',
    body: 'Pokud nejsi spokojen s předplatným, do 14 dnů Ti vrátíme peníze bez vysvětlení. Pokud se potřebuješ na něco zeptat, napiš na ahoj@cosmatch.cz a odpovíme Ti do týdne. Většinou dříve.',
  },
  {
    numeral: 'VIII',
    title: 'Transparentní reportování',
    body: 'Každý měsíc zveřejníme, kolik podezřelých profilů jsme zablokovali a kolik účtů jsme verifikovali. Žádné skrývání. Pokud Cosmatch v něčem selže, dozvíš se o tom první.',
  },
]

export default function ManifestDuvery() {
  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": 'Co znamená Manifest důvěry Cosmatch?', "acceptedAnswer": { "@type": "Answer", "text": 'Manifest důvěry je veřejný závazek Cosmatch vůči uživatelům. Obsahuje 8 principů, kterými se Cosmatch zavazuje vést — od žádného swipování pro swipování, přes zákaz reklamy a prodeje dat, až po transparentní reportování bezpečnostních incidentů.' } },
          { "@type": "Question", "name": 'Prodává Cosmatch moje data?', "acceptedAnswer": { "@type": "Answer", "text": 'Ne. Cosmatch je financován výhradně předplatným uživatelů. Tvoje datum narození používáme jen k výpočtu kompatibility. Nikdy ho neprodáváme, nepředáváme reklamním sítím ani datovým brokerem.' } },
          { "@type": "Question", "name": 'Jak Cosmatch chrání proti scammerům?', "acceptedAnswer": { "@type": "Answer", "text": 'Tři pilíře: (1) Cloudflare Turnstile proti botům, (2) SSO bez hesla (Google/Facebook), (3) nulové fake profily — Cosmatch nikdy nepoužívá AI generované ani seed profily. Detailně popsáno na stránce Jak chráníme uživatele. ID verifikace s green badge se připravuje pro budoucí Serious tier.' } },
          { "@type": "Question", "name": 'Jsou u Cosmatch reklamy?', "acceptedAnswer": { "@type": "Answer", "text": 'Ne, a nikdy nebudou. Cosmatch financují uživatelé skrz předplatné Cosmatch+ (od 249 Kč/měs, ročně 2 088 Kč). Tvoje pozornost není zboží.' } },
          { "@type": "Question", "name": 'Co když Cosmatch v něčem selže?', "acceptedAnswer": { "@type": "Answer", "text": 'Měsíčně zveřejníme statistiky reportů a zablokovaných profilů. Pokud Cosmatch v něčem zhorší, dozvíš se to první. Refundace předplatného do 14 dnů bez vysvětlení.' } }
        ]
      }) }} />
      {/* Top nav */}
      <div className="max-w-2xl mx-auto px-6 pt-8">
        <Link href="/" className="inline-block text-gray-500 hover:text-gray-900 text-sm transition">
          ← Cosmatch
        </Link>
      </div>

      <article className="max-w-2xl mx-auto px-6 pt-16 pb-24">

        {/* Masthead */}
        <header className="mb-20">
          <p className="eyebrow mb-6 text-pink-500">Manifest důvěry</p>
          <h1 className="serif-display text-5xl sm:text-6xl text-gray-900 leading-[1.05] font-medium mb-8 tracking-tight">
            Sedm věcí,<br />ke kterým se<br /><em className="italic text-pink-500">zavazujeme</em>.
          </h1>
          <hr className="rule w-16 border-gray-900 mb-8" />
          <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
            Cosmatch není aplikace, která by Tě chtěla udržovat nalepeného u obrazovky. Naopak
            si klademe za cíl Tě dostat mimo Cosmatch, do skutečného života, ke skutečnému člověku.
            Pokud se v něčem z následujícího zmýlíme, dej nám vědět.
          </p>
        </header>

        {/* Principles */}
        <div className="space-y-16">
          {principles.map((p, idx) => (
            <section key={p.numeral} className="grid grid-cols-[auto,1fr] gap-x-8 sm:gap-x-12">
              <div className="roman text-3xl sm:text-4xl text-pink-500 leading-none pt-2 select-none">
                {p.numeral}
              </div>
              <div>
                <h2 className="serif text-2xl sm:text-3xl text-gray-900 font-medium mb-4 leading-tight">
                  {p.title}
                </h2>
                <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">
                  {p.body}
                </p>
              </div>
              {idx < principles.length - 1 && (
                <div className="col-span-2 pt-16">
                  <hr className="rule" />
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Verifikované profily — special callout */}
        <section className="mt-24 bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded-3xl p-10">
          <p className="eyebrow text-emerald-600 mb-6">Konkrétně k bezpečnosti</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-[1.1] tracking-tight mb-8">
            Verifikované profily.<br/>
            <em className="italic text-emerald-600">Nehrajeme na slepou bábu.</em>
          </h2>

          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-8">
            <strong className="text-gray-900 font-medium">45 % uživatelů českých seznamek pravidelně narazí na podezřelý profil.</strong>
            To se nestane, když víš, s kým mluvíš.
          </p>

          <div className="space-y-6 mb-8">
            <div className="grid grid-cols-[auto,1fr] gap-4">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white flex-shrink-0 mt-1">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              </span>
              <div>
                <p className="serif text-lg text-gray-900 font-medium mb-1">Vícevrstvá ochrana před scammery</p>
                  <p className="text-gray-600 text-sm leading-relaxed">Cloudflare Turnstile anti-bot, SSO bez hesla a transparentní reportování. Detaily na stránce <a href="/verifikace" className="text-pink-500 hover:underline">Bezpečnost</a>.</p>
                <p className="serif text-lg text-gray-900 font-medium mb-1">Nabízíme filtr „jen ověřené"</p>
                <p className="text-gray-700 leading-relaxed text-[0.95rem]">
                  V nastavení si zapneš, aby ti aplikace zobrazovala jen profily se zeleným štítkem,
                  což jsou ověřené profily, tedy reální lidé. Neděláme žádné kompromisy.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-[auto,1fr] gap-4">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white flex-shrink-0 mt-1">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              </span>
              <div>
                <p className="serif text-lg text-gray-900 font-medium mb-1">Nahlášení podezřelého profilu</p>
                <p className="text-gray-700 leading-relaxed text-[0.95rem]">
                  Po reportu zmizí profil z feedu do hodiny. Pokud potvrdíme scam, trvale ho mažeme
                  a zapisujeme do interní blacklist databáze.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/verifikace"
              className="inline-flex items-center justify-center bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition">
              Jak ověřujeme profily →
            </Link>
            <Link href="/verifikace"
              className="inline-flex items-center justify-center text-gray-700 border border-gray-300 hover:border-gray-900 px-6 py-3 rounded-full text-sm font-medium transition">
              Jak chráníme uživatele
            </Link>
          </div>
        </section>

        {/* Signature */}
        <footer className="mt-24 pt-12 border-t border-gray-200">
          <p className="eyebrow text-gray-400 mb-4">Podepsáno</p>
          <p className="serif text-2xl text-gray-900 italic mb-1">Simona Cibulková</p>
          <p className="text-sm text-gray-500">
            Zakladatelka Cosmatch — Praha, květen 2026
          </p>
          <p className="text-xs text-gray-400 mt-8 leading-relaxed">
            Mgr. Ing. Simona Cibulková · IČO 08419531 · ahoj@cosmatch.cz<br />
            Algoritmus se volně inspiruje numerologickou teorií Goldschneidera &amp; Elffers
            a Kadlecové. Výsledky slouží jako podpora rozhodování, ne jako absolutní pravda.
          </p>

          <div className="mt-12">
            <Link href="/" className="text-pink-500 font-medium hover:text-pink-600 transition text-sm tracking-wide">
              Zpět na úvod →
            </Link>
          </div>
        </footer>
      </article>
    </main>
  )
}
