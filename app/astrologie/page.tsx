import type { Metadata } from 'next'
import Link from 'next/link'

const TITLE = 'Astrologie v Cosmatch — Sluneční znamení, dekanát, fixní hvězdy a planety | Cosmatch'
const DESC = 'Kompletní průvodce astrologickými komponentami, které Cosmatch používá v algoritmu kompatibility: 12 slunečních znamení, 36 dekanátů, stupně a Sabian symboly, fixní hvězdy (včetně Royal Stars), 12 dominantních planet. Co znamenají, jak se počítají, jak se liší.'
const URL = 'https://cosmatch.cz/astrologie'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL, languages: { 'cs-CZ': URL, 'x-default': URL } },
  openGraph: {
    title: TITLE, description: DESC, url: URL, type: 'article',
    siteName: 'Cosmatch', locale: 'cs_CZ',
    images: [{ url: 'https://cosmatch.cz/icon-512.png', width: 512, height: 512, alt: 'Cosmatch' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
  keywords: [
    'astrologie', 'sluneční znamení', 'dekanát', 'fixní hvězdy', 'dominantní planeta',
    'Sabian symboly', 'Royal Stars', 'Aldebaran', 'Regulus', 'Antares', 'Fomalhaut',
    'astrologická kompatibilita', 'horoskop podle data narození',
  ],
  authors: [{ name: 'Simona Cibulková' }],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: TITLE,
  description: DESC,
  author: { '@type': 'Person', name: 'Simona Cibulková', jobTitle: 'Zakladatelka Cosmatch' },
  publisher: { '@type': 'Organization', name: 'Cosmatch', logo: { '@type': 'ImageObject', url: 'https://cosmatch.cz/icon-512.png' } },
  datePublished: '2026-05-23',
  dateModified: '2026-05-23',
  mainEntityOfPage: { '@type': 'WebPage', '@id': URL },
  inLanguage: 'cs-CZ',
}

const ZODIAC = [
  ['Beran',     'Aries',       '21. 3. – 19. 4.', 'oheň',  '♈', 'Mars',     'Mars',    'začátek, akce, odvaha, instinkt'],
  ['Býk',       'Taurus',      '20. 4. – 20. 5.', 'země',  '♉', 'Venuše',   'Venuše',  'stabilita, smyslnost, hodnoty, trpělivost'],
  ['Blíženci',  'Gemini',      '21. 5. – 20. 6.', 'vzduch','♊', 'Merkur',   'Merkur',  'zvědavost, komunikace, mnohostrannost'],
  ['Rak',       'Cancer',      '21. 6. – 22. 7.', 'voda',  '♋', 'Měsíc',    'Měsíc',   'rodina, intuice, péče, paměť'],
  ['Lev',       'Leo',         '23. 7. – 22. 8.', 'oheň',  '♌', 'Slunce',   'Slunce',  'kreativita, hrdost, vyjádření, ego'],
  ['Panna',     'Virgo',       '23. 8. – 22. 9.', 'země',  '♍', 'Merkur',   'Merkur',  'analytika, perfekcionismus, služba, řád'],
  ['Váhy',      'Libra',       '23. 9. – 22. 10.','vzduch','♎', 'Venuše',   'Venuše',  'harmonie, vztahy, estetika, spravedlnost'],
  ['Štír',      'Scorpio',     '23. 10. – 21. 11.','voda',  '♏', 'Pluto',    'Mars',    'hloubka, transformace, intenzita, tajemství'],
  ['Střelec',   'Sagittarius', '22. 11. – 21. 12.','oheň',  '♐', 'Jupiter',  'Jupiter', 'expanze, filosofie, svoboda, dobrodružství'],
  ['Kozoroh',   'Capricorn',   '22. 12. – 19. 1.','země',   '♑', 'Saturn',   'Saturn',  'disciplína, ambice, struktura, dlouhodobost'],
  ['Vodnář',    'Aquarius',    '20. 1. – 18. 2.','vzduch',  '♒', 'Uran',     'Saturn',  'originalita, kolektivismus, vize, vzpoura'],
  ['Ryby',      'Pisces',      '19. 2. – 20. 3.','voda',    '♓', 'Neptun',   'Jupiter', 'intuice, soucit, mystika, snění'],
] as const

const ROYAL_STARS = [
  ['Aldebaran',  '9°47\' Býka',    'Watcher of the East',  'integrita, odvaha, vůdcovství — riziko: pýcha a tvrdohlavost'],
  ['Regulus',    '0°00\' Lva',     'Watcher of the North', 'sláva, autorita, úspěch — riziko: pád z výšin, pokud chybí poctivost'],
  ['Antares',    '9°46\' Střelce', 'Watcher of the West',  'transformace skrz konflikt, intenzita — riziko: násilná zkušenost'],
  ['Fomalhaut',  '3°52\' Ryb',     'Watcher of the South', 'duchovní hledání, magie, umění — riziko: ztráta sebe ve fantazii'],
] as const

const OTHER_STARS = [
  ['Algol',     '26°10\' Býka',  'intenzivní drama, schopnost vidět skryté'],
  ['Sirius',    '14°05\' Raka',  'úspěch, ambice, „psí hvězda" antiky'],
  ['Spica',     '23°50\' Vah',   'talent, ochrana, umělecké dary'],
  ['Vega',      '15°19\' Kozoroha','umění, charisma, magnetismus'],
  ['Capella',   '21°51\' Blíženců','zvídavost, učení, mentalita objevitele'],
  ['Procyon',   '25°47\' Raka',  'rychlost, dynamika, rychlý vzestup ale stejně rychlý pád'],
] as const

export default function AstrologiePage() {
  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">← Cosmatch</Link>
      </div>

      <article className="max-w-2xl mx-auto px-6 pt-16 pb-24">

        {/* Hero */}
        <header className="mb-12">
          <p className="eyebrow text-pink-500 mb-6">Astrologie · 12 min čtení</p>
          <h1 className="serif-display text-5xl sm:text-6xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-6">
            Astrologie,<br/><em className="italic text-pink-500">kterou Cosmatch používá</em>.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-8" />
          <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
            Cosmatch matching algoritmus vychází z personology — syntézy astrologie, numerologie a fixních hvězd v knize <em className="italic">The Power of Birthdays, Stars &amp; Numbers</em> (česky <em className="italic">Magická hra čísel a hvězd</em>). Tady je detail pěti astrologických komponent, které denní profil tvoří.
          </p>
          <p className="text-sm text-gray-500 mt-6">
            Autorka <span className="text-gray-900 italic serif">Simona Cibulková</span>
            <span className="text-gray-300 mx-2">·</span>
            <span>Praha, květen 2026</span>
          </p>
        </header>

        {/* TLDR */}
        <section className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 mb-16">
          <p className="eyebrow text-emerald-600 mb-3">Ve zkratce</p>
          <p className="text-gray-800 leading-relaxed text-[1.0625rem]">
            Každý ze 366 dnů má v personology systému 5 astrologických komponent: <strong className="text-gray-900 font-medium">sluneční znamení</strong> (kterých je 12), <strong className="text-gray-900 font-medium">dekanát</strong> (36 v zodiaku, po 10°), <strong className="text-gray-900 font-medium">stupeň</strong> (0°–29° v rámci znamení), <strong className="text-gray-900 font-medium">fixní hvězdy</strong> v aspektu, a <strong className="text-gray-900 font-medium">dominantní planetu</strong> (vládce znamení + sub-vládce dekanátu). Cosmatch tyto komponenty nepočítá sám — vyhledává je z hotových denních profilů knihy.
          </p>
        </section>

        {/* I. Sluneční znamení */}
        <section className="mb-16">
          <div className="grid grid-cols-[auto,1fr] gap-x-8 sm:gap-x-12">
            <div className="roman text-3xl sm:text-4xl text-pink-500 leading-none pt-2 select-none">I</div>
            <div>
              <h2 className="serif text-2xl sm:text-3xl text-gray-900 font-medium mb-5 leading-tight">Sluneční znamení (12)</h2>
              <p className="dropcap text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
                Sluneční znamení je určeno polohou Slunce v zodiaku v okamžiku narození. Zodiakální pás (360°) je rozdělený na 12 stejných úseků po 30°, každý úsek je jedno znamení. Slunce projde celým zodiakem za jeden rok, tedy v každém znamení stráví zhruba 30 dní.
              </p>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
                Co sluneční znamení říká: <strong className="text-gray-900 font-medium">základní temperament a ego identitu</strong>. Jak instinktivně reaguješ na svět, co tě motivuje, jaké jsou tvé instinktivní silné a slabé stránky.
              </p>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-6">
                Znamení se dělí podle <strong className="text-gray-900 font-medium">živlu</strong> (oheň/země/vzduch/voda — kvalita energie) a <strong className="text-gray-900 font-medium">modality</strong> (kardinální, fixní, proměnlivé — způsob projevu).
              </p>

              <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden mb-4">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
                      <th className="px-4 py-3 font-medium">Znamení</th>
                      <th className="px-4 py-3 font-medium">Období</th>
                      <th className="px-4 py-3 font-medium">Živel</th>
                      <th className="px-4 py-3 font-medium">Klíčová slova</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {ZODIAC.map(([cz, , period, element, symbol, , , keywords]) => (
                      <tr key={cz}>
                        <td className="px-4 py-3 text-gray-900 font-medium">
                          <span className="mr-2 text-gray-400">{symbol}</span>{cz}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{period}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{element}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{keywords}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-gray-500 italic">
                Cosmatch sluneční znamení čte z denního a měsíčního čísla narození. Cosmatch nepoužívá kompletní natální horoskop (vyžadoval by čas a místo narození), takže ascendent a měsíční znamení v algoritmu nejsou.
              </p>
            </div>
          </div>
        </section>

        <hr className="rule mb-16" />

        {/* II. Dekanát */}
        <section className="mb-16">
          <div className="grid grid-cols-[auto,1fr] gap-x-8 sm:gap-x-12">
            <div className="roman text-3xl sm:text-4xl text-pink-500 leading-none pt-2 select-none">II</div>
            <div>
              <h2 className="serif text-2xl sm:text-3xl text-gray-900 font-medium mb-5 leading-tight">Dekanát (36)</h2>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
                Každé z 12 znamení je rozdělené na <strong className="text-gray-900 font-medium">3 dekanáty po 10°</strong>. Zodiakální pás má tedy celkem <strong className="text-gray-900 font-medium">36 dekanátů</strong>. Dekanát zjemňuje sluneční znamení — Lev v 1. dekanu (0°–10°) se chová jinak než Lev v 3. dekanu (20°–30°), i když patří pod stejné znamení.
              </p>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
                Každý dekanát má vlastního <strong className="text-gray-900 font-medium">sub-vládce</strong>, který přidává druhou vrstvu motivace nad rámec hlavního vládce znamení. Existují dva systémy přiřazení:
              </p>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
                <p className="eyebrow text-gray-500 mb-2">Triplicity systém</p>
                <p className="text-gray-700 text-[0.95rem] leading-relaxed">
                  Tři znamení stejného živlu sdílejí planetární sekvenci. Např. pro ohnivá znamení (Beran, Lev, Střelec) jsou dekanáty:
                </p>
                <ul className="text-sm text-gray-600 leading-relaxed mt-2 space-y-1">
                  <li>1. dekan = vládce samotného znamení (Mars/Slunce/Jupiter)</li>
                  <li>2. dekan = vládce následujícího ohnivého znamení v pořadí</li>
                  <li>3. dekan = vládce třetího ohnivého znamení</li>
                </ul>
                <p className="text-xs text-gray-500 mt-3 italic">Crawford &amp; Sullivan používá tento systém.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
                <p className="eyebrow text-gray-500 mb-2">Chaldejský systém</p>
                <p className="text-gray-700 text-[0.95rem] leading-relaxed">
                  Sekvence 7 klasických planet (Saturn → Jupiter → Mars → Slunce → Venuše → Merkur → Měsíc) prochází 36 dekanáty cyklicky. Jednodušší, ale méně tematicky čistý než triplicity.
                </p>
              </div>

              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-3">
                Praktický důsledek: <strong className="text-gray-900 font-medium">dva lidé narození ve stejném znamení, ale jiném dekanu, můžou mít odlišný temperament.</strong> Lev v 1. dekanu (sub-vládce Slunce) je „nejčistší Lev" — silně sebestředný, kreativní, dramatic. Lev v 2. dekanu (sub-vládce Jupiter podle triplicity systému) má víc filosofie, smyslu pro spravedlnost. Lev ve 3. dekanu (sub-vládce Mars) má víc bojovnosti a fyzické energie.
              </p>
              <p className="text-sm text-gray-500 italic">
                Příklad — 23. 7. 1992 padá na 0°–1° Lva = 1. dekan = sub-vládce Slunce = energie znamení a sub-vládce se sčítají.
              </p>
            </div>
          </div>
        </section>

        <hr className="rule mb-16" />

        {/* III. Stupeň */}
        <section className="mb-16">
          <div className="grid grid-cols-[auto,1fr] gap-x-8 sm:gap-x-12">
            <div className="roman text-3xl sm:text-4xl text-pink-500 leading-none pt-2 select-none">III</div>
            <div>
              <h2 className="serif text-2xl sm:text-3xl text-gray-900 font-medium mb-5 leading-tight">Stupeň a Sabian symboly</h2>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
                Sluneční stupeň je <strong className="text-gray-900 font-medium">přesná poloha Slunce v rámci znamení</strong>: 0° až 29°. Slunce postupuje ~1° za den, takže každý den v roce má specifický stupeň. Dva lidé narození v sousedních dnech (např. 22. 7. a 23. 7.) mají sousední stupně — drobně odlišné profily.
              </p>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
                <strong className="text-gray-900 font-medium">Sabian symboly:</strong> Pro každý ze 360 stupňů zodiaku existuje konkrétní obraz, který popisuje jeho energii. Sabian symboly byly přijaty v roce 1925 — channeloval je médium <em className="italic">Elsie Wheeler</em> ve spolupráci s astrologem <em className="italic">Marc Edmund Jonesem</em>.
              </p>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
                <p className="eyebrow text-gray-500 mb-2">Příklad Sabian symbolu</p>
                <p className="text-gray-700 text-[0.95rem] leading-relaxed mb-2">
                  <strong className="text-gray-900 font-medium">1° Lva:</strong> „Krev se vrací do hlavy zdravým dítětem." Symbol vitality, mladé energie, čistého životního proudu.
                </p>
                <p className="text-gray-700 text-[0.95rem] leading-relaxed">
                  <strong className="text-gray-900 font-medium">15° Vah:</strong> „Kruh tanečníků v moonlight." Symbol sociální harmonie a rituálu.
                </p>
                <p className="text-xs text-gray-500 mt-3 italic">Cosmatch nezachází na úroveň Sabian symbolů přímo, ale denní profil knihy je implicitně zahrnuje.</p>
              </div>

              <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">
                Klíčový důsledek pro Cosmatch: i lidé ve stejném znamení (i stejném dekanu) mají různé denní profily, pokud se narodili v jiný den. <strong className="text-gray-900 font-medium">23. 7. ≠ 24. 7.</strong> kompatibilita, i když oba jsou Lvi v 1. dekanu.
              </p>
            </div>
          </div>
        </section>

        <hr className="rule mb-16" />

        {/* IV. Fixní hvězdy */}
        <section className="mb-16">
          <div className="grid grid-cols-[auto,1fr] gap-x-8 sm:gap-x-12">
            <div className="roman text-3xl sm:text-4xl text-pink-500 leading-none pt-2 select-none">IV</div>
            <div>
              <h2 className="serif text-2xl sm:text-3xl text-gray-900 font-medium mb-5 leading-tight">Fixní hvězdy</h2>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
                Fixní hvězdy jsou stálé hvězdy v souhvězdích — na rozdíl od planet, které se ve zvěrokruhu pohybují. Klasická astrologie pracuje s cca <strong className="text-gray-900 font-medium">60 hlavními fixními hvězdami</strong>. Pokud denní stupeň narození padne do ±1° od fixní hvězdy, ta hvězda <strong className="text-gray-900 font-medium">ovlivňuje denní profil</strong> přidanou archetypální vibrací.
              </p>

              <h3 className="serif text-lg text-gray-900 font-medium mb-3 mt-6">Royal Stars — 4 strážci nebes</h3>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-3">
                Persidská astrologie 3 000 př. n. l. vyčlenila čtyři nejdůležitější hvězdy — strážce čtyř světových stran. Každá zhruba odpovídá jedné rovnodennosti nebo slunovratu.
              </p>

              <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
                      <th className="px-4 py-3 font-medium">Hvězda</th>
                      <th className="px-4 py-3 font-medium">Pozice</th>
                      <th className="px-4 py-3 font-medium">Strážce</th>
                      <th className="px-4 py-3 font-medium">Význam</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {ROYAL_STARS.map(([name, pos, watcher, meaning]) => (
                      <tr key={name}>
                        <td className="px-4 py-3 text-gray-900 font-medium">{name}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{pos}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{watcher}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{meaning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="serif text-lg text-gray-900 font-medium mb-3 mt-6">Další významné fixní hvězdy</h3>
              <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden mb-4">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
                      <th className="px-4 py-3 font-medium">Hvězda</th>
                      <th className="px-4 py-3 font-medium">Pozice</th>
                      <th className="px-4 py-3 font-medium">Význam</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {OTHER_STARS.map(([name, pos, meaning]) => (
                      <tr key={name}>
                        <td className="px-4 py-3 text-gray-900 font-medium">{name}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{pos}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{meaning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-gray-500 italic">
                Crawford &amp; Sullivan explicitně uvádí fixní hvězdy v každém z 366 denních profilů. Cosmatch tyto údaje čte ze své zdrojové DB tabulky, sám astrofyzické výpočty neprovádí.
              </p>
            </div>
          </div>
        </section>

        <hr className="rule mb-16" />

        {/* V. Dominantní planeta */}
        <section className="mb-16">
          <div className="grid grid-cols-[auto,1fr] gap-x-8 sm:gap-x-12">
            <div className="roman text-3xl sm:text-4xl text-pink-500 leading-none pt-2 select-none">V</div>
            <div>
              <h2 className="serif text-2xl sm:text-3xl text-gray-900 font-medium mb-5 leading-tight">Dominantní planeta</h2>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
                Každé znamení má svou <strong className="text-gray-900 font-medium">vládnoucí planetu</strong> — archetypální energii, která definuje základní motivaci a styl. Plus se přidává <strong className="text-gray-900 font-medium">sub-vládce dekanátu</strong> jako druhá vrstva.
              </p>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
                Tradiční (klasická) astrologie před objevem Urana (1781), Neptuna (1846) a Pluta (1930) přiřazovala jen 7 viditelných planet 12 znamením. Moderní astrologie přiřadila nově objevené planety třem znamením, jejichž energie nejvíc odpovídala. Cosmatch zmiňuje obě vrstvy.
              </p>

              <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden mb-4">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
                      <th className="px-4 py-3 font-medium">Znamení</th>
                      <th className="px-4 py-3 font-medium">Moderní vládce</th>
                      <th className="px-4 py-3 font-medium">Klasický vládce</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {ZODIAC.map(([cz, , , , symbol, modern, classical]) => (
                      <tr key={cz}>
                        <td className="px-4 py-3 text-gray-900 font-medium">
                          <span className="mr-2 text-gray-400">{symbol}</span>{cz}
                        </td>
                        <td className="px-4 py-3 text-gray-700">{modern}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{classical}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">
                Co planetární archetyp říká: <strong className="text-gray-900 font-medium">Mars</strong> = akce, vůle. <strong className="text-gray-900 font-medium">Venuše</strong> = vztahy, krása. <strong className="text-gray-900 font-medium">Merkur</strong> = komunikace, myšlení. <strong className="text-gray-900 font-medium">Měsíc</strong> = emoce, paměť. <strong className="text-gray-900 font-medium">Slunce</strong> = vědomí, ego. <strong className="text-gray-900 font-medium">Jupiter</strong> = expanze, smysl. <strong className="text-gray-900 font-medium">Saturn</strong> = disciplína, struktura. <strong className="text-gray-900 font-medium">Uran</strong> = revoluce, vize. <strong className="text-gray-900 font-medium">Neptun</strong> = mystika, fantazie. <strong className="text-gray-900 font-medium">Pluto</strong> = transformace, hloubka.
              </p>
            </div>
          </div>
        </section>

        <hr className="rule mb-16" />

        {/* Honest disclaimer */}
        <section className="bg-white border border-gray-200 rounded-3xl p-8 mb-16">
          <p className="eyebrow text-pink-500 mb-3">Honest disclaimer</p>
          <h2 className="serif text-xl text-gray-900 font-medium mb-3">Astrologie není věda.</h2>
          <p className="text-gray-700 leading-[1.75] text-[0.95rem] mb-3">
            Astrologie, stejně jako numerologie, je <strong className="text-gray-900 font-medium">interpretační tradice</strong>, ne empirická věda. Žádná z popsaných komponent — sluneční znamení, dekanát, fixní hvězdy, planetární vládci — nebyla validována kontrolovanou studií. Cosmatch ji bere jako <em className="italic">jazyk pro sebepoznání a rozhovor</em>, ne jako predikci.
          </p>
          <p className="text-gray-700 leading-[1.75] text-[0.95rem]">
            Část pocitu „tohle sedí přesně!" je dokumentovaný psychologický jev zvaný <strong className="text-gray-900 font-medium">Barnumův/Forerův efekt</strong> — popisy astrologických typů jsou obecné natolik, aby v nich většina lidí našla kus sebe. To neznamená, že tradice nemá hodnotu — má, ale jako nástroj reflexe a sebepoznání, ne jako věštba.
          </p>
        </section>

        {/* CTA */}
        <section className="bg-white rounded-3xl border border-gray-100 p-10 mb-16">
          <p className="eyebrow text-pink-500 mb-4">Vyzkoušej</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">
            Najdi svou astrologickou shodu.
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8 text-[1.0625rem]">
            Zadej datum narození a Cosmatch ti za 30 sekund spočítá kompatibilitu z 5 astrologických komponent + numerologického životního čísla.
          </p>
          <Link href="/test" className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-full text-base font-medium hover:bg-gray-800 transition">
            Spustit kvíz
          </Link>
        </section>

        {/* Související */}
        <section>
          <p className="eyebrow text-pink-500 mb-4">Pokračuj ve čtení</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-10">
            Související
          </h2>
          <div className="space-y-4">
            <Link href="/numerologie/jak-pocitame" className="block bg-white border border-gray-200 hover:border-gray-900 rounded-2xl p-6 transition group">
              <p className="eyebrow text-gray-400 mb-2">Numerologie</p>
              <h3 className="serif text-xl text-gray-900 font-medium mb-1 group-hover:text-pink-500 transition">Jak se počítá životní číslo →</h3>
              <p className="text-gray-600 text-[0.95rem] leading-relaxed">Decoz three-cycle metoda, historie 1908–2020, 3 metodické školy, krok-za-krokem výpočet.</p>
            </Link>
            <Link href="/jak-funguje-cosmatch" className="block bg-white border border-gray-200 hover:border-gray-900 rounded-2xl p-6 transition group">
              <p className="eyebrow text-gray-400 mb-2">Metodika</p>
              <h3 className="serif text-xl text-gray-900 font-medium mb-1 group-hover:text-pink-500 transition">Jak Cosmatch opravdu funguje →</h3>
              <p className="text-gray-600 text-[0.95rem] leading-relaxed">Sedm vrstev kompatibility — od astrologie po aktivitu profilu.</p>
            </Link>
            <Link href="/zdroje-numerologie" className="block bg-white border border-gray-200 hover:border-gray-900 rounded-2xl p-6 transition group">
              <p className="eyebrow text-gray-400 mb-2">Zdroje</p>
              <h3 className="serif text-xl text-gray-900 font-medium mb-1 group-hover:text-pink-500 transition">14 klíčových zdrojů →</h3>
              <p className="text-gray-600 text-[0.95rem] leading-relaxed">Knihy a autoři, na kterých Cosmatch staví — od Pythagora po Hay House.</p>
            </Link>
          </div>
        </section>

        <footer className="mt-16 pt-12 border-t border-gray-200">
          <p className="text-xs text-gray-400 leading-relaxed">
            Cosmatch · Mgr. Ing. Simona Cibulková · IČO 08419531 · Praha 2026.
            Astrologie není empirická věda — výsledky používejte jako podporu rozhodování, ne jako absolutní pravdu.
          </p>
        </footer>

      </article>
    </main>
  )
}
