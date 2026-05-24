import type { Metadata } from 'next'
import Link from 'next/link'

const TITLE = 'Zdroje — knihy, autoři a peer-reviewed publikace, na kterých Cosmatch staví | Cosmatch'
const DESC = 'Cosmatch staví na 35 zdrojích ve čtyřech oblastech: numerologie (Goodwin, Decoz, McCants, Buchanan, Kadlecová), astrologie a fixní hvězdy (Robson, Brady, Burkert), psychologie vztahů (Gottman, Sue Johnson, Chapman, Perel, Nagoski) a peer-reviewed akademické publikace (Jung 1921 až Joel 2017).'
const URL = 'https://cosmatch.cz/zdroje'

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
    'numerologie zdroje', 'numerologie knihy', 'Decoz', 'McCants', 'Goodwin',
    'Kadlecová', 'Davidová', 'Buchanan', 'Cheiro', 'Pythagoras', 'numerologie čeština',
    'three-cycle method', 'chaldejská numerologie', 'pythagorejská numerologie',
    'fixní hvězdy', 'Robson', 'Brady', 'Burkert', 'Royal Stars',
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

const SOURCES = [
  {
    roman: 'I',
    author: 'Pythagoras',
    work: '~500 př. n. l.',
    role: 'Původce západní (pythagorovské) numerologie. Základní princip: čísla jako vyjádření kosmického řádu. (Současná „pythagorovská" numerologie je rekonstrukce z 19.–20. století; viz Burkert, Lore and Science in Ancient Pythagoreanism, Harvard 1972.)',
  },
  {
    roman: 'II',
    author: 'Cheiro (William J. Warner)',
    work: 'Cheiro\'s Book of Numbers (Herbert Jenkins, 1926)',
    role: 'Definoval chaldejský systém přiřazení čísel písmenům a první pravidla shody/neshody mezi čísly — historický kořen kompatibilní numerologie.',
  },
  {
    roman: 'III',
    author: 'Florence Campbell',
    work: 'Your Days Are Numbered (1931, reedice DeVorss)',
    role: 'První moderní kniha západní numerologie. Žačka L. Dow Balliett, propojila New Thought s číselným systémem 20. století.',
  },
  {
    roman: 'IV',
    author: 'Juno Jordan',
    work: 'Numerology: The Romance in Your Name (DeVorss, 1965)',
    role: 'Historická klasika numerologie, aplikovaná specificky na vztahy a romantiku. Dcera Julie Seton, žačka L. Dow Balliett.',
  },
  {
    roman: 'V',
    author: 'Matthew Oliver Goodwin',
    work: 'Numerology: The Complete Guide, Vol. 1 + 2 (Newcastle, 1981)',
    role: 'Nejslavnější kniha americké numerologie poloviny století. Používá tradiční systém (spolu s master čísly 11 a 22 a 33).',
  },
  {
    roman: 'VI',
    author: 'Dan Millman',
    work: 'The Life You Were Born to Live (HJ Kramer, 1993; CZ: Čísla života, Eminent 2003, reissue Martinus 2017)',
    role: 'Spojuje „životní číslo" se skrytou dynamikou vztahů.',
  },
  {
    roman: 'VII',
    author: 'Gary Goldschneider + Joost Elffers',
    work: 'The Secret Language of Birthdays (Penguin Studio, 1994)',
    role: 'Kniha založená na pozorování 14 000 osob. Inspirace pro celkové pojetí archetypu v Cosmatch.',
  },
  {
    roman: 'VIII',
    author: 'Saffi Crawford + Geraldine Sullivan',
    work: 'The Power of Birthdays, Stars & Numbers (Ballantine, 1998; CZ: Magická hra čísel a hvězd, Ikar 2002)',
    role: 'Encyklopedický 366denní referenční průvodce kombinující astrologii, fixní hvězdy a numerologii. Jedna z klíčových amerických referenčních prací pro osobnostní profil podle dne narození.',
  },
  {
    roman: 'IX',
    author: 'Helmut-Whitey Kritzinger',
    work: 'Partnerství a numerologie (Pragma, 1999, český překlad)',
    role: 'Německy psaná kniha hermetické numerologie, vydaná jako jeden z česky dostupných titulů o partnerské numerologii. Používá data narození obou partnerů.',
  },
  {
    roman: 'X',
    author: 'Hans Decoz',
    work: 'Numerology: Key to Your Inner Self (Perigee/Tarcher, 2001)',
    role: 'Moderní západní standard. Cosmatch používá jeho Three-Cycle Method pro výpočet životního čísla — redukujeme měsíc, den, rok zvlášť, master čísla 11/22/33 zachováváme v mezikroku.',
  },
  {
    roman: 'XI',
    author: 'Jitka Kadlecová',
    work: 'Datum narození a jeho vliv na náš charakter (Eminent, 2006)',
    role: 'Česká numerologická kniha z 21. století. Inspirace pro lokalizaci archetypů do české kultury a jazyka.',
  },
  {
    roman: 'XII',
    author: 'Glynis McCants',
    work: 'Love by the Numbers (Sourcebooks Casablanca, 2010)',
    role: 'Současný mainstream partnerské numerologie. Tři vrstvy vztahové kompatibility Cosmatch adaptoval do českých kategorií Spřízněné duše, Prospěšný vztah a Magnetická tenze.',
  },
  {
    roman: 'XIII',
    author: 'Ester Davidová',
    work: 'Partnerská osudová čísla — Jak na vztahy? (self-published, 2020)',
    role: 'Současný český autorský počin v partnerské numerologii. Definuje 9 „partnerských osudových čísel" jako součet životních čísel obou partnerů — model blízký Cosmatch kategoriím kompatibility.',
  },
  {
    roman: 'XIV',
    author: 'Michelle Buchanan',
    work: 'The Numerology Guidebook (Hay House, 2013)',
    role: 'Současný mainstream s kapitolami o výběru partnera, načasování vztahů a master číslech 11/22/33.',
  },
  {
    roman: 'XV',
    author: 'Vivian E. Robson',
    work: 'The Fixed Stars and Constellations in Astrology (Cecil Palmer, 1923)',
    role: 'Moderní klasika fixních hvězd. Syntéza ~2 000 let astrologické tradice se zhruba 110 pojmenovanými hvězdami. Cosmatch z této tradice čerpá při interpretaci konjunkcí Slunce s fixními hvězdami v denním profilu.',
  },
  {
    roman: 'XVI',
    author: 'Bernadette Brady',
    work: 'Brady\'s Book of Fixed Stars (Weiser, 1998)',
    role: 'Současná autoritativní práce o fixních hvězdách. Definuje koncept čtyř Royal Stars (Aldebaran, Regulus, Antares, Fomalhaut) jako čtyř strážců, model, který Cosmatch používá.',
  },
  {
    roman: 'XVII',
    author: 'Walter Burkert',
    work: 'Lore and Science in Ancient Pythagoreanism (Harvard University Press, 1972)',
    role: 'Skutečný Pythagoras a jeho škola byli číselní filozofové, tato moderní „pythagorejská numerologie" je rekonstrukce z 19.–20. století, primárně přes Theosofii a L. Dow Balliett.',
  },
] as const

const NUMEROLOGY_ROMANS = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV']
const ASTROLOGY_ROMANS = ['XV','XVI','XVII']

const PSYCHOLOGY_SOURCES = [
  {
    roman: 'P1',
    author: 'John Gottman & Nan Silver',
    work: 'The Seven Principles for Making Marriage Work (Crown, 1999)',
    role: 'Fundament Vrstvy II (Shared Meaning). Sound Relationship House framework, Four Horsemen (Criticism, Contempt, Defensiveness, Stonewalling), magic ratio 5:1 pozitivních k negativním interakcím v komunikaci stabilních párů.',
  },
  {
    roman: 'P2',
    author: 'Sue Johnson',
    work: 'Hold Me Tight (Little, Brown Spark, 2008)',
    role: 'Emotionally Focused Therapy (EFT), význam emocionální bezpečnosti ve vztahu. Rozšiřuje Attachment teorii pro dospělé páry. Klinický doplněk Vrstvy III (Attachment).',
  },
  {
    roman: 'P3',
    author: 'Gary Chapman',
    work: 'The 5 Love Languages (Northfield, 1992)',
    role: 'Pět jazyků lásky — slova ujištění, skutky, dárky, společný čas, doteky. 20+ milionů prodaných kopií. Zdroj Vrstvy III sub-modelu Love Languages (Cosmatch dává menší interní váhu kvůli Bunt 2017 kritice).',
  },
  {
    roman: 'P4',
    author: 'Esther Perel',
    work: 'Mating in Captivity (HarperCollins, 2006)',
    role: 'Paradox bezpečí a vášně v dlouhodobém vztahu. „It\'s hard to want what you already have." Zdroj Vrstvy IV (Intimní soulad).',
  },
  {
    roman: 'P5',
    author: 'Emily Nagoski',
    work: 'Come As You Are (Simon & Schuster, 2015)',
    role: 'Dual control model libida (Sexual Excitation System vs. Sexual Inhibition System z Kinsey Institute). Druhý zdroj Vrstvy IV.',
  },
  {
    roman: 'P6',
    author: 'Helen Fisher',
    work: 'Why We Love (Henry Holt, 2004)',
    role: 'Biologie přitažlivosti a romantické lásky. Fisher byla chief scientific advisor Match.com, propojuje neurovědu s dating realitou.',
  },
] as const

const ACADEMIC_SOURCES = [
  {
    roman: 'A1',
    author: 'Carl Gustav Jung (1921)',
    work: 'Psychologische Typen (Zürich: Rascher; anglicky Psychological Types, Routledge 1923)',
    role: 'Fundament typologie, ze kterého Katharine Cook Briggs a Isabel Briggs Myers v roce 1944 vyvinuly MBTI. Cosmatch používá Jungovy dimenze (extraverze/introverze, intuice/smysly, myšlení/cítění) ve Vrstvě III.',
  },
  {
    roman: 'A2',
    author: 'John Bowlby (1969)',
    work: 'Attachment. Vol. 1 of Attachment and Loss (London: Hogarth Press)',
    role: 'Základní text teorie citové vazby, fundament Vrstvy III sub-modelu Attachment.',
  },
  {
    roman: 'A3',
    author: 'Kenneth W. Thomas & Ralph H. Kilmann (1974)',
    work: 'Thomas-Kilmann Conflict Mode Instrument (Xicom, dnes Myers-Briggs Company)',
    role: 'Model pěti konfliktních stylů (Competing / Collaborating / Compromising / Avoiding / Accommodating). Vrstva III sub-model konfliktního stylu.',
  },
  {
    roman: 'A4',
    author: 'Cindy Hazan & Phillip Shaver (1987)',
    work: 'Romantic love conceptualized as an attachment process. Journal of Personality and Social Psychology, 52(3), 511–524',
    role: 'Přenos Bowlbyho teorie z dětství do dospělých romantických vztahů. Definuje tři adultní attachment styly (secure / anxious / avoidant) a jejich kompatibilitu.',
  },
  {
    roman: 'A5',
    author: 'Paul T. Costa & Robert R. McCrae (1992)',
    work: 'Revised NEO Personality Inventory (NEO-PI-R) (Psychological Assessment Resources)',
    role: 'Zlatý standard Velké pětky osobnostních rysů (OCEAN). Vrstva III sub-model Big5 Neuroticism vychází z této operacionalizace.',
  },
  {
    roman: 'A6',
    author: 'John M. Gottman & Robert W. Levenson (1992)',
    work: 'Marital processes predictive of later dissolution. Journal of Personality and Social Psychology, 63(2), 221–233',
    role: 'Gottmanův longitudinální výzkum párů, Four Horsemen, fyziologická regulace v konfliktu. Empirický základ Vrstvy II.',
  },
  {
    roman: 'A7',
    author: 'Arthur Aron et al. (2000)',
    work: 'Couples\' shared participation in novel and arousing activities and experienced relationship quality. Journal of Personality and Social Psychology, 78(2), 273–284',
    role: 'Pět studií, n~250 párů. Klíčové zjištění pro Vrstvu VI: novelty + arousal > similarity (sdílené koníčky samy o sobě nejsou prediktor; společně dělat nové a stimulující věci je).',
  },
  {
    roman: 'A8',
    author: 'Till Roenneberg, Anna Wirz-Justice & Martha Merrow (2003)',
    work: 'Life between clocks: daily temporal patterns of human chronotypes. Journal of Biological Rhythms, 18(1), 80–90',
    role: 'Munich Chronotype Questionnaire (MCTQ), psychometrický standard pro měření chronotypu. Vrstva III sub-model Chronobiology.',
  },
  {
    roman: 'A9',
    author: 'Daniel Heller, David Watson & Remus Ilies (2004)',
    work: 'Meta-analýza osobnosti a vztahové spokojenosti, Psychological Bulletin',
    role: 'Všech pět dimenzí Velké pětky má signifikantní korelaci, Neuroticism je nejsilnější (r = −0,26). Empirický základ váhy Big5 Neuroticism ve Vrstvě III.',
  },
  {
    roman: 'A10',
    author: 'David J. Pittenger (2005)',
    work: 'Cautionary comments regarding the Myers-Briggs Type Indicator. Consulting Psychology Journal, 57(3), 210–221',
    role: 'Kritika MBTI test-retest reliability (39–76 % uživatelů dostane jiný typ při re-testu během 5 týdnů). Důvod, proč Cosmatch interně dává MBTI nižší váhu než Attachment a Big5.',
  },
  {
    roman: 'A11',
    author: 'Stuart Bunt & Zoe J. Hazelwood (2017)',
    work: 'Walking the walk, talking the talk: Love languages, self-regulation, and relationship satisfaction. Personal Relationships, 24(2), 280–290',
    role: 'N=740, 5-faktorová struktura Chapmanových love languages psychometricky nefittuje. Důvod, proč Cosmatch dává Love Languages nižší interní váhu.',
  },
  {
    roman: 'A12',
    author: 'Samantha Joel, Paul W. Eastwick & Eli J. Finkel (2017)',
    work: 'Is romantic desire predictable? Machine learning applied to initial romantic attraction. Psychological Science, 28(10), 1478–1489',
    role: 'Random forest na 100+ self-report metrikách u 350 účastníků speed-datingu. Variance explained pro relationship variance: −4,55 % až +1,30 %. Klíčový zdroj transparentnosti („Co Cosmatch nedělá").',
  },
] as const

export default function ZdrojePage() {
  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">← Cosmatch</Link>
      </div>

      <article className="max-w-2xl mx-auto px-6 pt-16 pb-24">

        {/* Hero */}
        <header className="mb-12">
          <p className="eyebrow text-pink-500 mb-6">Zdroje</p>
          <h1 className="serif-display text-5xl sm:text-6xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-6">
            Z čeho<br/><em className="italic text-pink-500">Cosmatch vychází</em>.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-8" />
          <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
            Cosmatch staví na třech vrstvách zdrojů: numerologická a astrologická tradice (od Pythagora po současné autory), psychologie vztahů (mainstream knihy posledních 30 let) a peer-reviewed akademické publikace (Jung 1921 až Joel 2017). Celkem 35 knih, autorů a recenzovaných studií.
          </p>
        </header>

        {/* Sekce 1 — Numerologická tradice (I–XIV) */}
        <section className="mb-16">
          <p className="eyebrow text-pink-500 mb-4">Část 1</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-8">
            Numerologická tradice
          </h2>
          <div className="space-y-10">
            {SOURCES.filter(s => NUMEROLOGY_ROMANS.includes(s.roman)).map((src) => (
              <div key={src.roman} className="grid grid-cols-[auto,1fr] gap-x-6 sm:gap-x-8">
                <div className="roman text-2xl sm:text-3xl text-pink-500 leading-none pt-1 select-none">{src.roman}</div>
                <div>
                  <h3 className="serif text-xl text-gray-900 font-medium mb-1 leading-tight">{src.author}</h3>
                  <p className="text-sm text-gray-500 italic mb-3 leading-relaxed">{src.work}</p>
                  <p className="text-gray-700 leading-[1.7] text-[1.0625rem]">{src.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="rule mb-16" />

        {/* Sekce 2 — Astrologie a fixní hvězdy (XV–XVII) */}
        <section className="mb-16">
          <p className="eyebrow text-pink-500 mb-4">Část 2</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-8">
            Astrologie a fixní hvězdy
          </h2>
          <div className="space-y-10">
            {SOURCES.filter(s => ASTROLOGY_ROMANS.includes(s.roman)).map((src) => (
              <div key={src.roman} className="grid grid-cols-[auto,1fr] gap-x-6 sm:gap-x-8">
                <div className="roman text-2xl sm:text-3xl text-pink-500 leading-none pt-1 select-none">{src.roman}</div>
                <div>
                  <h3 className="serif text-xl text-gray-900 font-medium mb-1 leading-tight">{src.author}</h3>
                  <p className="text-sm text-gray-500 italic mb-3 leading-relaxed">{src.work}</p>
                  <p className="text-gray-700 leading-[1.7] text-[1.0625rem]">{src.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="rule mb-16" />

        {/* Sekce 3 — Psychologie vztahů (6 knih) */}
        <section className="mb-16">
          <p className="eyebrow text-pink-500 mb-4">Část 3</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-3">
            Psychologie vztahů
          </h2>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-8">
            Vrstvy II–IV algoritmu (hodnoty, psychologický profil, intimní soulad) stojí na mainstreamových knihách klinické a vztahové psychologie posledních 30 let.
          </p>
          <div className="space-y-10">
            {PSYCHOLOGY_SOURCES.map((src) => (
              <div key={src.roman} className="grid grid-cols-[auto,1fr] gap-x-6 sm:gap-x-8">
                <div className="roman text-2xl sm:text-3xl text-pink-500 leading-none pt-1 select-none">{src.roman}</div>
                <div>
                  <h3 className="serif text-xl text-gray-900 font-medium mb-1 leading-tight">{src.author}</h3>
                  <p className="text-sm text-gray-500 italic mb-3 leading-relaxed">{src.work}</p>
                  <p className="text-gray-700 leading-[1.7] text-[1.0625rem]">{src.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="rule mb-16" />

        {/* Sekce 4 — Akademické zdroje (peer-reviewed) */}
        <section className="mb-20">
          <p className="eyebrow text-pink-500 mb-4">Část 4</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-3">
            Akademické zdroje (peer-reviewed)
          </h2>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-8">
            Psychologické vrstvy algoritmu stojí na recenzovaných studiích a klasických akademických textech. Chronologicky od Junga (1921) po současnost.
          </p>
          <div className="space-y-10">
            {ACADEMIC_SOURCES.map((src) => (
              <div key={src.roman} className="grid grid-cols-[auto,1fr] gap-x-6 sm:gap-x-8">
                <div className="roman text-2xl sm:text-3xl text-pink-500 leading-none pt-1 select-none">{src.roman}</div>
                <div>
                  <h3 className="serif text-xl text-gray-900 font-medium mb-1 leading-tight">{src.author}</h3>
                  <p className="text-sm text-gray-500 italic mb-3 leading-relaxed">{src.work}</p>
                  <p className="text-gray-700 leading-[1.7] text-[1.0625rem]">{src.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="rule mb-20" />

        {/* Co Cosmatch dělá se zdroji */}
        <section className="mb-20">
          <p className="eyebrow text-pink-500 mb-4">Co Cosmatch dělá s těmito zdroji</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-8">
            Syntéza.
          </h2>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-5">
            Cosmatch nepřepisuje žádnou z těchto knih. Texty archetypů, partnerské vztahy i metodologie jsou autorské texty Cosmatch, vycházejí ze studia těchto zdrojů, ale jsou napsané pro česky mluvícího uživatele 27–45 let.
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-5">
            Pro výpočet životního čísla používáme <strong className="text-gray-900 font-medium">Decoz Three-Cycle Method</strong>, kdy redukujeme měsíc, den a rok narození zvlášť, přičemž zachováváme master čísla 11/22/33 v komponentech, pak sečteme a redukujeme finální výsledek. Master 33 se zachová jen pokud aspoň jedna komponenta byla také master (Decoz strict rule).
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">
            Pro kompatibilitu kombinujeme více zdrojů tradičních knih — denní profily jsou inspirované Goldschneiderem a Elffersem a referenčními průvodci Crawfordovou a Sullivanovou, doplněné o tříúrovňový model kompatibility z anglo-americké literatury. Cosmatch rozřazuje lidi do pěti kategorií: <strong className="text-gray-900 font-medium">Spřízněné duše, Láska &amp; přátelství, Prospěšné, Osudové přitažlivosti, Náročné vztahy</strong>.
          </p>
        </section>

        <hr className="rule mb-20" />

        {/* Tři metodické školy */}
        <section className="mb-20">
          <p className="eyebrow text-pink-500 mb-4">Tři metodické školy</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-8">
            Tři metodické školy numerologie.
          </h2>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-6">
            Numerologie není jednotný systém — pro stejné datum narození vám dají různé školy různá životní čísla. Autoři uvedení v sekci Numerologická tradice se dělí do tří metodických rodin (plus jedna alternativní).
          </p>

          <div className="space-y-5">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <p className="eyebrow text-gray-500 mb-2">Škola A — Chaldejská</p>
              <h3 className="serif text-lg text-gray-900 font-medium mb-2">Cheiro (1926)</h3>
              <p className="text-gray-700 text-[0.95rem] leading-relaxed">
                Používá pouze den narození („birth number") + jméno podle Chaldean abecedy 1–8. Nejsou tu žádná master čísla.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <p className="eyebrow text-gray-500 mb-2">Škola B — Pythagorejská single-sum</p>
              <h3 className="serif text-lg text-gray-900 font-medium mb-2">Phillips, Crawford &amp; Sullivan, většina českých příruček</h3>
              <p className="text-gray-700 text-[0.95rem] leading-relaxed">
                Sečte všech 8 číslic data najednou, výsledek redukuje. Master čísla zachovává nebo redukuje podle autora.
              </p>
            </div>

            <div className="bg-pink-50 border border-pink-200 rounded-2xl p-6">
              <p className="eyebrow text-pink-500 mb-2">Škola C — Pythagorejská three-cycle · <span className="text-gray-900 font-medium not-italic">Cosmatch</span></p>
              <h3 className="serif text-lg text-gray-900 font-medium mb-2">Balliett (1908) → Campbell → Jordan → Goodwin → Decoz → McCants → Buchanan</h3>
              <p className="text-gray-700 text-[0.95rem] leading-relaxed">
                Redukuje měsíc, den a rok zvlášť, master čísla 11/22/33 zachovává v mezikroku. Jediná metoda, která umí rozlišit „skutečné" master číslo od náhodného součtu. <strong className="text-gray-900 font-medium">Moderní standard západní numerologie</strong>.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <p className="eyebrow text-gray-500 mb-2">Škola D — Dvou-cifrový kód</p>
              <h3 className="serif text-lg text-gray-900 font-medium mb-2">Dan Millman (1993)</h3>
              <p className="text-gray-700 text-[0.95rem] leading-relaxed">
                Radikální zlom bez redukce. Popisuje 45 dvojčíslí (např. 33/6, 25/7). Cosmatch tuto metodu neimplementuje, ale Millmana cituje jako důležitý alternativní pohled.
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-500 italic mt-8">
            Detailní postup výpočtu, srovnání všech metod a krok za krokem příklad najdeš na stránce <Link href="/numerologie/jak-pocitame" className="text-pink-500 underline">Jak se počítá životní číslo</Link>.
          </p>
        </section>

        <hr className="rule mb-20" />

        {/* Měj na paměti */}
        <section className="bg-white border border-gray-200 rounded-3xl p-8 mb-16">
          <p className="eyebrow text-pink-500 mb-3">Měj na paměti</p>
          <h2 className="serif text-xl text-gray-900 font-medium mb-3">Numerologie není věda.</h2>
          <p className="text-gray-700 leading-[1.75] text-[0.95rem]">
            Část pocitu „tohle sedí přesně!" je dokumentovaný psychologický jev zvaný <strong className="text-gray-900 font-medium">Barnumův/Forerův efekt</strong>. V roce 1949 dal psycholog Bertram Forer 39 studentům identický popis osobnosti a oni ho ohodnotili průměrnou známkou <strong className="text-gray-900 font-medium">4,26 z 5,0</strong> jako „to jsem přesně já". To samé může fungovat s numerologií a astrologií — popisy mohou být obecné natolik, že v nich každý najde kus sebe. To neznamená, že je numerologie zbytečná — funguje jako <em className="italic">nástroj sebereflexe a konverzace s partnerem</em>, ne jako věštba.
          </p>
        </section>

        {/* CTA na detail algoritmu */}
        <section>
          <Link href="/jak-funguje-cosmatch" className="block bg-white border border-gray-200 hover:border-gray-900 rounded-2xl p-6 transition group">
            <p className="eyebrow text-gray-400 mb-2">Metodika</p>
            <h3 className="serif text-xl text-gray-900 font-medium mb-1 group-hover:text-pink-500 transition">Detail algoritmu Cosmatch →</h3>
            <p className="text-gray-600 text-[0.95rem] leading-relaxed">Sedm vrstev kompatibility, od astrologie po aktivitu profilu.</p>
          </Link>
        </section>

        <footer className="mt-16 pt-12 border-t border-gray-200">
          <p className="text-xs text-gray-400 leading-relaxed">
            Cosmatch · Mgr. Ing. Simona Cibulková · IČO 08419531 · Praha 2026.
          </p>
        </footer>

      </article>
    </main>
  )
}
