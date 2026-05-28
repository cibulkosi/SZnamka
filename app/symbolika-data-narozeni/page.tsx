import type { Metadata } from 'next'
import Link from 'next/link'

const TITLE = 'Astrologie v Cosmatch — Sluneční znamení, dekanát, fixní hvězdy, planety | Cosmatch'
const DESC = 'Algoritmus Cosmatch vychází ze syntézy astrologie, numerologie a fixních hvězd. 5 astrologických komponent — 12 sluníčních znamení, 36 dekanátů, stupeň Slunce, fixní hvězdy a Royal Stars, dominantní planety s esenciálními dignitami. Tropický zodiak, Sabian symboly, anaretický stupeň.'
const URL = 'https://cosmatch.cz/symbolika-data-narozeni'

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL, languages: { 'cs-CZ': URL, 'x-default': URL } },
  openGraph: {
    title: TITLE, description: DESC, url: URL, type: 'article',
    siteName: 'Cosmatch', locale: 'cs_CZ',
    images: [{ url: 'https://cosmatch.cz/og-image.png', width: 1200, height: 630, alt: 'Cosmatch' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: ['https://cosmatch.cz/og-image.png'] },
  keywords: [
    'astrologie', 'sluneční znamení', 'dekanát', 'fixní hvězdy', 'dominantní planeta',
    'Sabian symboly', 'Royal Stars', 'Aldebaran', 'Regulus', 'Antares', 'Fomalhaut',
    'astrologická kompatibilita', 'horoskop podle data narození', 'anaretický stupeň',
    'esenciální dignity', 'tropický zodiak', 'siderální zodiak',
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
  ['Štír',      'Scorpio',     '23. 10. – 21. 11.','voda', '♏', 'Pluto',    'Mars',    'hloubka, transformace, intenzita, tajemství'],
  ['Střelec',   'Sagittarius', '22. 11. – 21. 12.','oheň', '♐', 'Jupiter',  'Jupiter', 'expanze, filosofie, svoboda, dobrodružství'],
  ['Kozoroh',   'Capricorn',   '22. 12. – 19. 1.','země',  '♑', 'Saturn',   'Saturn',  'disciplína, ambice, struktura, dlouhodobost'],
  ['Vodnář',    'Aquarius',    '20. 1. – 18. 2.','vzduch', '♒', 'Uran',     'Saturn',  'originalita, vize, vzpoura'],
  ['Ryby',      'Pisces',      '19. 2. – 20. 3.','voda',   '♓', 'Neptun',   'Jupiter', 'intuice, soucit, mystika, snění'],
] as const

const ROYAL_STARS = [
  ['Aldebaran',  '9°–10° Blíženců',    'Strážce východu (jarní rovnodennost)',  'integrita, odvaha, vůdcovství. Test cti — úspěch jen pokud nepodlehne pomstě.'],
  ['Regulus',    '29° Lva / 0° Panny', 'Strážce severu (letní slunovrat)', 'sláva, autorita, úspěch. Test pomsty — pokud podlehne, dramatický pád. Skok 28. 11. 2011 (precese).'],
  ['Antares',    '9°–10° Střelce', 'Strážce západu (podzimní rovnodennost)',  'transformace skrz konflikt, intenzita. Test posedlosti — kontrolovaná vášeň vede ke slávě.'],
  ['Fomalhaut',  '3°–4° Ryb',     'Strážce jihu (zimní slunovrat)',  'duchovní hledání, magie, umění. Test idealismu — věrnost ideálům přináší magii, jejich zrada zničení.'],
] as const

const OTHER_STARS = [
  ['Algol',     '26° Býka',         'intenzivní drama, schopnost vidět skryté. Arabsky „hlava démona"'],
  ['Sirius',    '14°–15° Raka',     'úspěch, ambice, „psí hvězda" antiky. Skok ~1993 (precese)'],
  ['Spica',     '24° Vah',          'talent, ochrana, umělecké dary'],
  ['Vega',      '15° Kozoroha',     'umění, charisma, magnetismus'],
  ['Capella',   '22° Blíženců',     'zvídavost, učení, mentalita objevitele'],
  ['Procyon',   '26° Raka',         'rychlost, dynamika, rychlý vzestup ale stejně rychlý pád'],
] as const

const DIGNITIES = [
  ['Domicile (Vláda)',    '+5', 'Vlastní znamení', 'Plná síla, planeta „doma"'],
  ['Exaltace',            '+4', 'Konkrétní znamení', 'Čestný host, idealizovaný projev'],
  ['Triplicita',          '+3', 'Sdílení živlu', 'Sympatická síla'],
  ['Term/Bound',          '+2', 'Specifický rozsah stupňů', 'Egyptský systém'],
  ['Face/Dekan',          '+1', 'Konkrétní dekanát', 'Slabá podpora'],
  ['Detriment (Exil)',    '−5', 'Naproti domicilu', 'Mimo svůj kontext'],
  ['Fall (Pád)',          '−4', 'Naproti exaltaci', 'Depresivní, oslabená pozice'],
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
          <p className="eyebrow text-pink-500 mb-6">Astrologie · 15 min čtení</p>
          <h1 className="serif-display text-5xl sm:text-6xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-6">
            Symbolika<br/><em className="italic text-pink-500">data narození</em>.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-8" />
          <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
            Algoritmus Cosmatch vychází také z astrologie. Co o Tobě říká poloha Slunce, dekanát a fixní hvězdy v den narození? Níže najdeš pět komponent klasické západní tradice, které Cosmatch zohledňuje ve výpočtu kompatibility.
          </p>
          <p className="text-sm text-gray-500 mt-6">
            Autorka <span className="text-gray-900 italic serif">Simona Cibulková</span>
            <span className="text-gray-400 mx-2">·</span>
            <span>Praha, květen 2026</span>
          </p>
        </header>

        {/* TLDR */}
        <section className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 mb-16">
          <p className="eyebrow text-emerald-600 mb-3">Ve zkratce</p>
          <p className="text-gray-800 leading-relaxed text-[1.0625rem]">
            Každý ze 366 dnů narození v sobě kombinuje 5 astrologických komponent: <strong className="text-gray-900 font-medium">sluneční znamení</strong> (12), <strong className="text-gray-900 font-medium">dekanát</strong> (36), <strong className="text-gray-900 font-medium">stupeň Slunce</strong> (0°–29°), <strong className="text-gray-900 font-medium">fixní hvězdy</strong> v aspektu a <strong className="text-gray-900 font-medium">dominantní planetu</strong> (vládce znamení + subvládce dekanátu). Cosmatch tyto komponenty interpretuje prostřednictvím svého algoritmu.
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
                Sluneční znamení ovlivňuje <strong className="text-gray-900 font-medium">základní temperament a identitu</strong>. To, jak instinktivně reaguješ na svět, co Tě motivuje nebo jaké jsou Tvé silné a slabé stránky.
              </p>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-6">
                Znamení se dělí podle <strong className="text-gray-900 font-medium">živlu</strong> (oheň/země/vzduch/voda, které značí kvalitu energie) a <strong className="text-gray-900 font-medium">modality</strong> (kardinální, fixní, proměnlivé, které ovlivňují způsob projevu).
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

              <p className="text-sm text-gray-500 italic mb-6">
                Cosmatch čte sluneční znamení ze dne a měsíce narození. Nepoužívá kompletní natální horoskop (vyžadoval by i čas a místo narození), takže ascendent a měsíční znamení v algoritmu nejsou.
              </p>

              <h3 className="serif text-lg text-gray-900 font-medium mb-3 mt-8">Tropický vs. siderální zodiak</h3>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-3">
                Existují dva systémy zodiaku, které dají různé výsledky:
              </p>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
                <p className="eyebrow text-gray-500 mb-2">Tropický (západní)</p>
                <p className="text-gray-700 text-[0.95rem] leading-relaxed">
                  0° Berana je ukotvené k <strong className="text-gray-900 font-medium">jarní rovnodennosti</strong> (cca 20. 3.). Je to sezónně zakotvený systém, nikdy se neposouvá vůči ročnímu cyklu. Používá ho moderní západní astrologie a Cosmatch.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
                <p className="eyebrow text-gray-500 mb-2">Siderální (védský / jyotish)</p>
                <p className="text-gray-700 text-[0.95rem] leading-relaxed">
                  0° Berana je ukotveno ke <strong className="text-gray-900 font-medium">skutečnému počátku souhvězdí Berana</strong>. Používá ho indická astrologie.
                </p>
              </div>
              <p className="text-sm text-gray-500 italic">
                Lidé, kteří jsou v tropickém systému Lvi, mohou být v siderálním Raci. Cosmatch volí tropický systém, který odpovídá moderní západní astrologické tradici i Sabian symbolům.
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
                Každé z 12 znamení je rozdělené na <strong className="text-gray-900 font-medium">3 dekanáty po 10°</strong>. Zodiakální pás má tedy celkem <strong className="text-gray-900 font-medium">36 dekanátů</strong>. Dekanát zjemňuje sluneční znamení, např. Lev v 1. dekanu (0°–10°) se chová jinak než Lev v 3. dekanu (20°–30°), i když patří pod stejné znamení.
              </p>

              <h3 className="serif text-lg text-gray-900 font-medium mb-3 mt-6">Egyptský původ</h3>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
                Slovo „dekan" pochází z řeckého <em className="italic">dekanós</em> („desátek"). Systém vznikl ve <strong className="text-gray-900 font-medium">starověkém Egyptě</strong> někdy od 10. dynastie (~2100 př. n. l.), kdy 36 hvězdných skupin sloužilo jako siderální hodiny, každá skupina vycházela ve 10-denním intervalu. Slavné zobrazení je na stropě hrobky <em className="italic">Senmuta</em> (~1470 př. n. l.) za vlády Hatšepsut. Helénistická astrologie pak v období 300–100 př. n. l. spojila egyptské dekany s babylonským zodiakem a přiřadila každému planetárního vládce.
              </p>

              <h3 className="serif text-lg text-gray-900 font-medium mb-3 mt-6">Dva systémy subvládců</h3>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
                Každý dekanát má vlastního <strong className="text-gray-900 font-medium">subvládce</strong>, který přidává druhou vrstvu motivace nad rámec hlavního vládce znamení. Existují dva systémy přiřazení:
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
                <p className="text-xs text-gray-500 mt-3 italic">Tento systém přiřazování dekanátů preferujeme.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
                <p className="eyebrow text-gray-500 mb-2">Chaldejský systém</p>
                <p className="text-gray-700 text-[0.95rem] leading-relaxed">
                  Sekvence 7 klasických planet (Saturn → Jupiter → Mars → Slunce → Venuše → Merkur → Měsíc) prochází cyklicky 36 dekanáty. Je to jednodušší systém.
                </p>
              </div>

              <h3 className="serif text-lg text-gray-900 font-medium mb-3 mt-6">Příklad — tři dekanáty Lva</h3>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
                <p className="text-gray-700 text-[0.95rem] leading-relaxed mb-3">
                  <strong className="text-gray-900 font-medium">Lev I (0°–10°, subvládce Slunce)</strong> — „nejčistší Lev". Královská, sebevědomá, hrdá energie. Cca 23. 7. – 1. 8.
                </p>
                <p className="text-gray-700 text-[0.95rem] leading-relaxed mb-3">
                  <strong className="text-gray-900 font-medium">Lev II (10°–20°, subvládce Jupiter)</strong> — filozofičtější, svobodnější Lev, s touhou po dobrodružství a vyšším vzdělání. Cca 2. 8. – 12. 8.
                </p>
                <p className="text-gray-700 text-[0.95rem] leading-relaxed">
                  <strong className="text-gray-900 font-medium">Lev III (20°–30°, subvládce Marsu)</strong> — nejambicióznější, nejprůbojnější Lev, „heart of gold" s rytířským étosem. Cca 13. 8. – 22. 8.
                </p>
              </div>

              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-3">
                Praktický důsledek: <strong className="text-gray-900 font-medium">dva lidé ve stejném znamení, ale jiném dekanu, můžou mít odlišný temperament.</strong> Subvládce zachovává živel a modus, ale přidává specifický planetární odstín.
              </p>
              <p className="text-sm text-gray-500 italic">
                Příklad — 23. 7. 1992 padá na 0°–1° Lva = 1. dekan = subvládce Slunce = energie znamení a sub-vládce se sčítají v „nejčistšího Lva".
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
              <h2 className="serif text-2xl sm:text-3xl text-gray-900 font-medium mb-5 leading-tight">Stupeň Slunce</h2>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
                Sluneční stupeň je <strong className="text-gray-900 font-medium">přesná poloha Slunce v rámci znamení</strong>: 0° až 29°. Slunce postupuje přibližně 0°59′ za den, takže každý den v roce má specifický stupeň. Dva lidé narození v sousedních dnech (např. 22. 7. a 23. 7.) mají sousední stupně — drobně odlišné profily.
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
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
                Pozice fixních hvězd se v tropickém zodiaku posouvá <strong className="text-gray-900 font-medium">~1° za 72 let</strong> kvůli precesi ekvinokcií. Aldebaran byl v roce 1900 na 8°23′ Blíženců, v roce 2000 na 9°47′ Blíženců, v roce 2026 zhruba na 10°07′ Blíženců. Pro <strong className="text-gray-900 font-medium">narozené v letech 1950–2026 jsou pozice níže prakticky stejné</strong> — pohybují se v rozmezí 0,5°–1°, což stále spadá do orbu konjunkce. Jediné dvě výjimky se skokem znamení jsou <strong className="text-gray-900 font-medium">Regulus</strong> (přesun z Lva do Panny 28. 11. 2011) a <strong className="text-gray-900 font-medium">Sirius</strong> (přesun z 14° na 15° Raka kolem roku 1993). Mnoho jmen hvězd pochází z arabštiny (Algol = „hlava démona", Fomalhaut = „ústa ryby", Aldebaran = „následovník").
              </p>

<h3 className="serif text-lg text-gray-900 font-medium mb-3 mt-6">Další významné fixní hvězdy</h3>
              <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden mb-4">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
                      <th className="px-4 py-3 font-medium">Hvězda</th>
                      <th className="px-4 py-3 font-medium">Pozice (1950–2026)</th>
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
                Cosmatch tyto údaje interpretuje, sám astrofyzické výpočty neprovádí.
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
                Každé znamení má svou <strong className="text-gray-900 font-medium">vládnoucí planetu</strong>, archetypální energii, která definuje základní motivaci a styl. Plus se k ní přidává <strong className="text-gray-900 font-medium">subvládce dekanátu</strong> jako druhá vrstva.
              </p>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
                Tradiční (klasická) astrologie před objevem Uranu (1781), Neptunu (1846) a Pluta (1930) přiřazovala jen 7 viditelných planet 12 znamením. Moderní astrologie přiřadila nově objevené planety třem znamením, jejichž energie jim nejvíc odpovídala. Cosmatch zmiňuje obě vrstvy.
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

              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-6">
                Co planetární archetyp říká: <strong className="text-gray-900 font-medium">Mars</strong> = akce, vůle. <strong className="text-gray-900 font-medium">Venuše</strong> = vztahy, krása. <strong className="text-gray-900 font-medium">Merkur</strong> = komunikace, myšlení. <strong className="text-gray-900 font-medium">Měsíc</strong> = emoce, paměť. <strong className="text-gray-900 font-medium">Slunce</strong> = vědomí, ego. <strong className="text-gray-900 font-medium">Jupiter</strong> = expanze, smysl. <strong className="text-gray-900 font-medium">Saturn</strong> = disciplína, struktura. <strong className="text-gray-900 font-medium">Uran</strong> = revoluce, vize. <strong className="text-gray-900 font-medium">Neptun</strong> = mystika, fantazie. <strong className="text-gray-900 font-medium">Pluto</strong> = transformace, hloubka.
              </p>


            </div>
          </div>
        </section>

        <hr className="rule mb-16" />

                {/* VI. Další aspekty ovlivňující člověka v den jeho narození */}
        <section className="mb-16">
          <div className="grid grid-cols-[auto,1fr] gap-x-8 sm:gap-x-12">
            <div className="roman text-3xl sm:text-4xl text-pink-500 leading-none pt-2 select-none">VI</div>
            <div>
              <h2 className="serif text-2xl sm:text-3xl text-gray-900 font-medium mb-5 leading-tight">Další aspekty ovlivňující člověka v den jeho narození</h2>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-8">
                Klasická astrologická tradice pracuje s ještě dalšími jemnějšími vrstvami nad rámec pěti hlavních komponent uvedených výše. Cosmatch je interpretuje jako kulturní a edukativní kontext, ale do výpočtu kompatibility přímo nevstupují.
              </p>

<p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
                <strong className="text-gray-900 font-medium">Sabian symboly:</strong> Pro každý ze 360 stupňů zodiaku existuje konkrétní obraz, který popisuje jeho energii. <a href="https://sabiansymbols.com/wp-content/uploads/2023/07/Revised-Birthday-Table.pdf" target="_blank" rel="noopener" className="text-pink-500 underline">Sabian symboly</a> byly přijaty v roce 1925, propagovala je <em className="italic">Elsie Wheeler</em> ve spolupráci s astrologem <em className="italic">Marc Edmund Jonesem</em>.
              </p>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
                <p className="eyebrow text-gray-500 mb-2">Příklad Sabian symbolu</p>
                <p className="text-gray-700 text-[0.95rem] leading-relaxed mb-2">
                  <strong className="text-gray-900 font-medium">1° Berana:</strong> „Žena právě vystoupila z moře, tuleň ji objímá." Symbol vzniku, prvního výstupu z nevědomí.
                </p>
                <p className="text-gray-700 text-[0.95rem] leading-relaxed mb-2">
                  <strong className="text-gray-900 font-medium">15° Lva:</strong> „Slavnostní průvod prochází ulicí plnou jásajících lidí." Symbol veřejného uznání a triumfu.
                </p>
                <p className="text-gray-700 text-[0.95rem] leading-relaxed">
                  <strong className="text-gray-900 font-medium">24° Štíra:</strong> „Po vyslechnutí inspirovaného člověka při Kázání na hoře se zástupy vracejí domů." Symbol transformace skrz duchovní impulz.
                </p>
                <p className="text-xs text-gray-500 mt-3 italic">
                  Pravidlo zaokrouhlení: minuta nad 0° → další stupeň. Slunce na 14°02′ Lva = symbol pro Lva 15° (ne 14°).
                </p>
              </div>

              <h3 className="serif text-lg text-gray-900 font-medium mb-3 mt-8">Anaretický stupeň 29°</h3>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-3">
                Z řeckého <em className="italic">anareta</em> („ničitel"). Jakákoli planeta nebo bod v rozsahu <strong className="text-gray-900 font-medium">29°00′ – 29°59′</strong> v kterémkoli znamení je „anaretický" poslední stupeň před přechodem do dalšího znamení. Symbolicky nese <strong className="text-gray-900 font-medium">pocit naléhavosti, krize, dokončování karmického cyklu</strong> nebo „mistrovskou zkušenost" tohoto znamení.
              </p>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-3">
                Btw. <em className="italic">Margaret Thatcher</em> ohlásila rezignaci 22. 11. 1990, když její Slunce a Ascendent byly na 29° Štíra.
              </p>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">
                <strong className="text-gray-900 font-medium">Avatar Degree má 15° pevných znamení</strong> (Býk, Lev, Štír, Vodnář): planeta zde dělá z jedince „go-to" osobnost se silnou manifestační schopností. Patnácté stupně pevných znamení jsou klasicky vnímány jako body koncentrované moci.
              </p>

<h3 className="serif text-lg text-gray-900 font-medium mb-3 mt-6">Royal Stars — 4 strážci nebes</h3>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-3">
                Persidská astrologie vyčlenila zhruba 3 000 př. n. l. čtyři nejdůležitější hvězdy, strážce čtyř světových stran. Každá zhruba odpovídá jedné rovnodennosti nebo slunovratu. Každá nese specifický „test" podle Bernadette Brady:
              </p>

              <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
                      <th className="px-4 py-3 font-medium">Hvězda</th>
                      <th className="px-4 py-3 font-medium">Pozice (1950–2026)</th>
                      <th className="px-4 py-3 font-medium">Strážce</th>
                      <th className="px-4 py-3 font-medium">Význam &amp; test</th>
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

              <p className="text-xs text-gray-500 italic mb-4">
                Jak číst rozsahy: hvězdy se kvůli precesi posouvají vůči tropickému zodiaku ~1° za 72 let. Pro narozené 1950–1980 vyhledávej spodní hranici rozsahu, pro narozené po roce 2000 horní hranici. <strong className="text-gray-700 font-medium not-italic">Regulus</strong> je unikátní v tom, že 28. 11. 2011 přešel ze Lva do Panny — pro narozené před tímto datem stojí na 29° Lva, pro narozené po něm na 0° Panny.
              </p>



<h3 className="serif text-lg text-gray-900 font-medium mb-3 mt-8">Esenciální dignity</h3>
              <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
                Klasická astrologie hodnotí, jak silně se planeta projevuje v dané pozici. Pětistupňová stupnice „dignit" pochází z helénistické tradice (Ptolemaios, Vettius Valens) a byla kodifikována Williamem Lillym v <em className="italic">Christian Astrology</em> (1647).
              </p>

              <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden mb-4">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
                      <th className="px-4 py-3 font-medium">Dignita</th>
                      <th className="px-4 py-3 font-medium">Body</th>
                      <th className="px-4 py-3 font-medium">Pozice</th>
                      <th className="px-4 py-3 font-medium">Význam</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {DIGNITIES.map(([name, pts, pos, meaning]) => (
                      <tr key={name}>
                        <td className="px-4 py-3 text-gray-900 font-medium">{name}</td>
                        <td className="px-4 py-3 text-gray-700 font-mono text-xs">{pts}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{pos}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{meaning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-gray-500 italic">
                Příklad: Mars v Beranu má Domicile (+5) — projevuje se nejsilněji. Mars ve Váhách má Detriment (−5) — chybí mu jeho přirozený kontext. Cosmatch tyto nuance bere v úvahu při hodnocení dominantní planety pro jednotlivá data narození.
              </p>
            </div>
          </div>
        </section>

        <hr className="rule mb-16" />

        {/* Honest disclaimer */}
        <section className="bg-white border border-gray-200 rounded-3xl p-8 mb-16">
          <p className="eyebrow text-pink-500 mb-3">Mějte na paměti</p>
          <h2 className="serif text-xl text-gray-900 font-medium mb-3">Astrologie není věda.</h2>
          <p className="text-gray-700 leading-[1.75] text-[0.95rem] mb-3">
            Astrologie, stejně jako numerologie, je <strong className="text-gray-900 font-medium">interpretační tradice</strong>, ne empirická věda. Žádná z popsaných komponent — sluneční znamení, dekanát, fixní hvězdy, planetární vládci — nebyla validována kontrolovanou studií. Cosmatch ji bere jako <em className="italic">jazyk pro sebepoznání a rozhovor</em>, ne jako predikci.
          </p>
          <p className="text-gray-700 leading-[1.75] text-[0.95rem]">
            Část pocitu „tohle jsem přesně já!" je dokumentovaný psychologický jev zvaný <strong className="text-gray-900 font-medium">Barnumův/Forerův efekt</strong>. Popisy astrologických typů mohou být obecné natolik, aby v nich většina lidí našla kus sebe. To neznamená, že tradice nemá hodnotu — má, ale jako nástroj reflexe a sebepoznání, ne jako věštba.
          </p>
        </section>

        {/* CTA */}
        <section className="bg-white rounded-3xl border border-gray-100 p-10 mb-16">
          <p className="eyebrow text-pink-500 mb-4">Vyzkoušej</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">
            Zjisti svůj numerologický archetyp.
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8 text-[1.0625rem]">
            Zadej datum narození a Cosmatch Ti za 30 sekund spočítá životní číslo a ukáže Tvůj archetyp. Plná astrologická kompatibilita podle pěti komponent (sluneční znamení, dekanát, fixní hvězdy, dominantní planeta, Sabian symboly) přijde až po registraci v aplikaci.
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
            <Link href="/zdroje" className="block bg-white border border-gray-200 hover:border-gray-900 rounded-2xl p-6 transition group">
              <p className="eyebrow text-gray-400 mb-2">Zdroje</p>
              <h3 className="serif text-xl text-gray-900 font-medium mb-1 group-hover:text-pink-500 transition">17 klíčových zdrojů →</h3>
              <p className="text-gray-600 text-[0.95rem] leading-relaxed">Knihy a autoři, na kterých Cosmatch staví — od Pythagora po Hay House.</p>
            </Link>
          </div>
        </section>

        <footer className="mt-16 pt-12 border-t border-gray-200">
          <p className="text-xs text-gray-500 leading-relaxed">
            Cosmatch · Mgr. Ing. Simona Cibulková · IČO 08419531 · Praha 2026.
            Astrologie není empirická věda — výsledky používejte jako podporu rozhodování, ne jako absolutní pravdu.
          </p>
        </footer>

      </article>
    </main>
  )
}
