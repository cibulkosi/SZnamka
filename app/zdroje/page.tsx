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
    role: 'Skutečný Pythagoras a jeho škola byli filozofové s čísly, tato moderní „pythagorejská numerologie" je rekonstrukce z 19.–20. století, primárně přes Theosofii a L. Dow Balliett.',
  },
] as const

const NUMEROLOGY_ROMANS = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV']
const ASTROLOGY_ROMANS = ['XV','XVI','XVII']

const PSYCHOLOGY_SOURCES = [
  {
    roman: 'P1',
    author: 'John Gottman & Nan Silver',
    work: 'The Seven Principles for Making Marriage Work (Crown, 1999)',
    role: 'John Gottman patří k nejcitovanějším výzkumníkům párových vztahů poslední generace — ve své seattleské „Love Lab" pozoroval páry více než čtyřicet let. V této knize, kterou napsal společně s novinářkou Nan Silverovou, shrnul model zdravého vztahu nazvaný Sound Relationship House (Dům zdravého vztahu) a popsal čtyři komunikační vzorce, jež nazval čtyřmi jezdci apokalypsy: kritiku, pohrdání, obranu a uzavírání se do mlčení. Z jeho výzkumu vychází také známé pravidlo magic ratio — stabilní páry mají v běžné komunikaci přibližně pět pozitivních interakcí na jednu negativní. Cosmatch z této knihy čerpá pro Vrstvu II algoritmu, která hodnotí sdílené hodnoty a životní vizi.',
  },
  {
    roman: 'P2',
    author: 'Sue Johnson',
    work: 'Hold Me Tight (Little, Brown Spark, 2008)',
    role: 'Kanadská psycholožka Sue Johnson přenesla teorii citové vazby Johna Bowlbyho — původně vyvinutou pro vztah dítěte a rodiče — do světa dospělých partnerských vztahů. Vyvinula terapeutický přístup Terapie zaměřené na emoce (EFT — Emotionally Focused Therapy), který se dnes řadí mezi nejúspěšnější metody párové terapie vůbec. V knize vysvětluje, proč je emocionální bezpečí ve vztahu důležitější než kvalita komunikace nebo společné hodnoty: bez pocitu, že se mohu na partnera spolehnout v okamžiku zranitelnosti, ostatní vrstvy vztahu nedrží. Cosmatch z její práce čerpá pro Vrstvu III algoritmu — sub-model citové vazby.',
  },
  {
    roman: 'P3',
    author: 'Gary Chapman',
    work: 'The 5 Love Languages (Northfield, 1992)',
    role: 'Americký pastor a párový poradce Gary Chapman v této knize popsal pět způsobů, jakými lidé přijímají a projevují lásku — slova ujištění, drobné skutky, dárky, společný čas a fyzický kontakt. Po vydání se z knihy stal kulturní fenomén — dosud se prodalo přes dvacet milionů výtisků v padesáti jazycích a koncept jazyků lásky vstoupil do mainstreamu vztahového poradenství. Cosmatch jej zohledňuje v Vrstvě III algoritmu, ale dává mu menší interní váhu — psychometrická studie Buntové a Hazelwoodové z roku 2017 (viz níže) totiž ukázala, že Chapmanova pětifaktorová struktura není ve velkých vzorcích statisticky robustní.',
  },
  {
    roman: 'P4',
    author: 'Esther Perel',
    work: 'Mating in Captivity (HarperCollins, 2006)',
    role: 'Belgicko-americká psychoterapeutka Esther Perel popsala v této knize centrální paradox dlouhodobých vztahů: touha potřebuje vzdálenost, ale láska potřebuje blízkost. Její věta „Je těžké chtít to, co už máš" (originál „It\'s hard to want what you already have") se stala kulturním memem. Perel zkoumá, proč v dlouhodobých vztazích postupně mizí erotická touha, i když intimita a důvěra rostou — a co s tím lze dělat. Cosmatch z její práce čerpá pro Vrstvu IV algoritmu, která hodnotí intimní a sexuální soulad partnerů.',
  },
  {
    roman: 'P5',
    author: 'Emily Nagoski',
    work: 'Come As You Are (Simon & Schuster, 2015)',
    role: 'Americká sexuoložka Emily Nagoski v této knize popularizovala duální model sexuální odezvy (Dual Control Model), vyvinutý v Kinseyho institutu. Model říká, že libido nefunguje jako jednoduchý plynový pedál — ve skutečnosti má současně dva nezávislé systémy: jeden pro vzrušení (Sexual Excitation System) a druhý pro útlum (Sexual Inhibition System). Citlivost obou systémů se u různých lidí výrazně liší a vysvětluje, proč v jedné situaci jeden člověk reaguje vzrušením a jiný spíš stažením. Cosmatch z této knihy čerpá pro Vrstvu IV algoritmu — sub-model intimního souladu.',
  },
  {
    roman: 'P6',
    author: 'Helen Fisher',
    work: 'Why We Love (Henry Holt, 2004)',
    role: 'Americká antropoložka Helen Fisher (mnoho let působila jako vědecká poradkyně dating služby Match.com) zkoumá v této knize neurobiologii romantické přitažlivosti. Kombinuje výzkumy zobrazování mozku metodou fMRI s evoluční psychologií a navrhuje, že romantická láska je samostatný motivační systém v mozku — odlišný od sexuální touhy i od dlouhodobé partnerské vazby. Fisherové práce je jednou z mála, která propojuje akademickou neurovědu s reálnými daty z milionů uživatelů dating aplikací. Cosmatch z její perspektivy čerpá při celkovém pojetí algoritmu.',
  },
] as const

const ACADEMIC_SOURCES = [
  {
    roman: 'A1',
    author: 'Carl Gustav Jung (1921)',
    work: 'Psychologische Typen (Zürich: Rascher; anglicky Psychological Types, Routledge 1923)',
    role: 'Švýcarský psychiatr a psychoanalytik Carl Gustav Jung v této průkopnické knize představil systém čtyř psychologických funkcí (myšlení, cítění, intuice, smysly) a dvou základních postojů (extraverze a introverze). Jeho typologie se stala filozofickým a teoretickým základem, na kterém Katharine Cook Briggs a její dcera Isabel Briggs Myers ve čtyřicátých letech 20. století vybudovaly MBTI — dnes nejrozšířenější osobnostní typologii na světě. Cosmatch Jungovy dimenze (extraverze/introverze, intuice/smysly, myšlení/cítění) využívá ve Vrstvě III algoritmu — psychologickém profilu.',
  },
  {
    roman: 'A2',
    author: 'John Bowlby (1969)',
    work: 'Citová vazba (originál „Attachment", díl 1 z trilogie „Attachment and Loss", Hogarth Press, Londýn)',
    role: 'Britský psychiatr a psychoanalytik John Bowlby v této knize, první ze tří dílů své monumentální trilogie Attachment and Loss, položil základy teorie citové vazby. Ukázal, že kvalita rané vazby mezi dítětem a pečovatelem zásadně ovlivňuje, jak člověk po zbytek života vstupuje do blízkých vztahů. Bowlbyho teorie se postupně rozšířila i na vztahy dospělých (viz Hazan a Shaver níže) a dnes patří k nejlépe empiricky podloženým modelům vztahové dynamiky vůbec. Cosmatch z této práce vychází pro Vrstvu III algoritmu — sub-model citové vazby.',
  },
  {
    roman: 'A3',
    author: 'Kenneth W. Thomas & Ralph H. Kilmann (1974)',
    work: 'Thomas-Kilmann Conflict Mode Instrument — TKI, dotazník stylů řešení konfliktu (Xicom, dnes vlastní Myers-Briggs Company)',
    role: 'Američtí psychologové Kenneth Thomas a Ralph Kilmann v tomto dotazníku popsali pět typických způsobů, jakými lidé řeší konflikty — soupeření (Competing), spolupráci (Collaborating), kompromis (Compromising), vyhýbání se (Avoiding) a přizpůsobení (Accommodating). TKI se dnes používá v párových terapiích i v korporátním koučinku po celém světě a má dobrou test-retest reliabilitu kolem 0,65. Cosmatch z tohoto modelu čerpá pro Vrstvu III algoritmu — sub-model stylu řešení konfliktu.',
  },
  {
    roman: 'A4',
    author: 'Cindy Hazan & Phillip Shaver (1987)',
    work: 'Romantická láska jako proces citové vazby (originál „Romantic love conceptualized as an attachment process"), Journal of Personality and Social Psychology, 52(3), str. 511–524',
    role: 'Cindy Hazan a Phillip Shaver v této klíčové studii poprvé empiricky doložili, že Bowlbyho teorie citové vazby — původně vyvinutá pro vztah dítěte a rodiče — funguje analogicky i u dospělých v partnerských vztazích. Definovali tři základní attachment styly: bezpečný (secure, přibližně 55 % populace), úzkostný (anxious) a vyhýbavý (avoidant). Tato práce odstartovala celý nový směr výzkumu, který dnes patří k nejlépe empiricky podloženým v psychologii vztahů. Cosmatch ze studie vychází přímo — Vrstva III interně skóruje jednotlivé kombinace attachment stylů mezi partnery (kombinace bezpečný-bezpečný má nejvyšší skóre, úzkostný-vyhýbavý nejnižší).',
  },
  {
    roman: 'A5',
    author: 'Paul T. Costa & Robert R. McCrae (1992)',
    work: 'Revidovaný osobnostní inventář NEO-PI-R (originál „Revised NEO Personality Inventory", Psychological Assessment Resources)',
    role: 'Američtí psychologové Paul Costa a Robert McCrae v tomto revidovaném osobnostním inventáři vytvořili nejrozšířenější standardizovaný nástroj pro měření Velké pětky osobnostních rysů — otevřenosti vůči zkušenosti, svědomitosti, extraverze, přívětivosti a neuroticismu (akronym OCEAN). NEO-PI-R se dnes používá v desítkách tisíc akademických studií ročně a jeho psychometrické vlastnosti patří k nejlépe ověřeným v celé psychologii. Cosmatch z této operacionalizace vychází pro Vrstvu III algoritmu — sub-model emoční stability, který je inverzí dimenze neuroticismu.',
  },
  {
    roman: 'A6',
    author: 'John M. Gottman & Robert W. Levenson (1992)',
    work: 'Manželské procesy předpovídající pozdější rozpad vztahu (originál „Marital processes predictive of later dissolution"), Journal of Personality and Social Psychology, 63(2), str. 221–233',
    role: 'John Gottman a Robert Levenson v této studii sledovali manželské páry po dobu několika let a analyzovali, jak fyziologická regulace v konfliktu (tep, vodivost kůže, krevní tlak) předpovídá, zda pár zůstane spolu, nebo se rozejde. Z této práce vychází jak slavný koncept čtyř jezdců apokalypsy (kritika, pohrdání, obrana, mlčení), tak Gottmanův pozdější Sound Relationship House model. Tato studie je empirickým základem všeho, co Gottman a Silverová popsali později v populárnější podobě v knize Seven Principles. Cosmatch z výzkumu čerpá pro Vrstvu II algoritmu — sdílené hodnoty a životní vize.',
  },
  {
    roman: 'A7',
    author: 'Arthur Aron et al. (2000)',
    work: 'Společné zapojení párů do nových a vzrušujících aktivit a jejich vliv na kvalitu vztahu (originál „Couples\' shared participation in novel and arousing activities and experienced relationship quality"), Journal of Personality and Social Psychology, 78(2), str. 273–284',
    role: 'Arthur Aron a kolegové v této sérii pěti studií (celkem zhruba 250 párů) testovali, co skutečně zvyšuje kvalitu dlouhodobých vztahů. Výsledek změnil pohled na společné koníčky: pouhá shoda v zájmech není dobrým prediktorem partnerské spokojenosti. Co skutečně funguje, je společné zažívání nových a stimulujících aktivit — to, co Aron nazývá self-expansion (rozšiřování sebe sama skrze sdílenou zkušenost). Tento poznatek Cosmatch zohledňuje ve Vrstvě VI algoritmu, která pracuje se společnými zájmy — proto má jen 5 % celkové váhy a slouží spíš jako iniciátor rozhovoru než jako prediktor dlouhodobé kompatibility.',
  },
  {
    roman: 'A8',
    author: 'Till Roenneberg, Anna Wirz-Justice & Martha Merrow (2003)',
    work: 'Život mezi hodinami: denní vzorce lidských chronotypů (originál „Life between clocks: daily temporal patterns of human chronotypes"), Journal of Biological Rhythms, 18(1), str. 80–90',
    role: 'Německý chronobiolog Till Roenneberg s kolegyněmi Annou Wirz-Justiceovou a Marthou Merrowovou v této studii představili Munich Chronotype Questionnaire (MCTQ) — dotazník, který se stal psychometrickým standardem pro určování individuálního chronotypu (rané ptáče vs. noční sova). Roennebergova práce ukázala, že chronotyp je z velké části geneticky daný a že rozdíl mezi přirozeným rytmem člověka a sociálně vynuceným rozvrhem (tzv. „social jet lag") má dlouhodobé zdravotní následky. Cosmatch z tohoto výzkumu vychází pro Vrstvu III algoritmu — sub-model chronobiologie, který hodnotí, zda mají partneři kompatibilní denní rytmus.',
  },
  {
    roman: 'A9',
    author: 'Daniel Heller, David Watson & Remus Ilies (2004)',
    work: 'Meta-analýza osobnosti a vztahové spokojenosti, Psychological Bulletin',
    role: 'Daniel Heller, David Watson a Remus Ilies v této meta-analýze (tj. ve studii, která syntetizuje data z mnoha menších studií) prokázali, že všech pět dimenzí Velké pětky osobnosti významně souvisí se vztahovou spokojeností. Z nich má nejsilnější vliv emoční stabilita, přesněji její opak — neuroticismus. Korelace r = −0,26 znamená, že vyšší míra úzkostnosti a emoční reaktivity systematicky souvisí s nižší spokojeností v partnerství, ať už hodnotí kohokoli z páru. Tento výsledek Cosmatch zohledňuje ve Vrstvě III algoritmu, kde emoční stabilita má proto vyšší interní váhu než ostatní psychologické sub-modely.',
  },
  {
    roman: 'A10',
    author: 'David J. Pittenger (2005)',
    work: 'Varovné poznámky k Myers-Briggsovu typologickému indikátoru (originál „Cautionary comments regarding the Myers-Briggs Type Indicator"), Consulting Psychology Journal, 57(3), str. 210–221',
    role: 'David Pittenger ve své kritické studii ukázal, že MBTI (Myers-Briggs Type Indicator) má vážné psychometrické slabiny — především velmi nízkou test-retest reliabilitu. Mezi 39 a 76 procenty testovaných dostane jiný čtyřpísmenný typ, když test absolvují podruhé po pouhých pěti týdnech. Pittengerova kritika nezpochybňuje, že MBTI uživatele baví a otevírá užitečné konverzace o osobnosti — jen ukazuje, že jako prediktivní nástroj má jasná omezení. Z tohoto důvodu dává Cosmatch MBTI ve Vrstvě III nižší interní váhu než empiricky robustnějším modelům, jako jsou Bowlbyho teorie citové vazby nebo Velká pětka osobnostních rysů.',
  },
  {
    roman: 'A11',
    author: 'Stuart Bunt & Zoe J. Hazelwood (2017)',
    work: 'Skutky a slova: jazyky lásky, seberegulace a spokojenost ve vztahu (originál „Walking the walk, talking the talk: Love languages, self-regulation, and relationship satisfaction"), Personal Relationships, 24(2), str. 280–290',
    role: 'Stuart Bunt a Zoe Hazelwood na vzorku 740 respondentů testovali, jestli Chapmanova teorie pěti jazyků lásky vůbec funguje jako koherentní psychologický konstrukt. Výsledek byl spíš negativní — faktorová analýza dat neukázala očekávaných pět nezávislých faktorů, ale jen dvě nebo tři navzájem se překrývající dimenze. Z této kritiky vychází rozhodnutí Cosmatch dávat jazykům lásky ve Vrstvě III menší interní váhu, než kterou by si Chapmanův model nominálně zasloužil. Koncept zůstává užitečnou heuristikou pro páry — ale ne robustním psychometrickým nástrojem.',
  },
  {
    roman: 'A12',
    author: 'Samantha Joel, Paul W. Eastwick & Eli J. Finkel (2017)',
    work: 'Lze předpovědět romantickou touhu? Strojové učení aplikované na počáteční romantickou přitažlivost (originál „Is romantic desire predictable? Machine learning applied to initial romantic attraction"), Psychological Science, 28(10), str. 1478–1489',
    role: 'Samantha Joel, Paul Eastwick a Eli Finkel v této přelomové studii použili strojové učení (random forest model na více než stovce self-report metrik u 350 účastníků speed-datingu) a pokusili se předpovědět, kdo se zalíbí komu. Výsledek byl pro celou oblast párovacích algoritmů zničující — variance explained pro jedinečnou chemii konkrétního páru se pohybovala mezi −4,55 % a +1,30 %, tedy v podstatě na úrovni náhody. Tato studie podpírá Cosmatch transparentní postoj: žádný algoritmus nemůže předpovědět romantickou jiskru — může pouze zvýšit šanci, že se potkají lidé, kterým spolu bude dobře. Cosmatch z této studie cituje v sekci „Co Cosmatch nedělá" na stránce o algoritmu.',
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





        {/* Sekce 1 — Psychologie vztahů (6 knih) */}
        <section className="mb-16">
          <p className="eyebrow text-pink-500 mb-4">Část 1</p>
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

        {/* Sekce 2 — Akademické zdroje (peer-reviewed) */}
        <section className="mb-20">
          <p className="eyebrow text-pink-500 mb-4">Část 2</p>
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

        {/* Sekce 3 — Numerologická tradice + Astrologie (spojeno) (I–XIV) */}
        <section className="mb-16">
          <p className="eyebrow text-pink-500 mb-4">Část 3</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-8">
            Numerologická a astrologická tradice
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

          <h3 className="serif text-2xl text-gray-900 font-medium leading-tight mb-3 mt-12">Astrologie a fixní hvězdy</h3>
          <p className="text-gray-700 leading-[1.75] text-[0.95rem] mb-6">
            Vrstva I (30 %) syntetizuje také klasickou astrologickou tradici — zejména fixní hvězdy a jejich konjunkce se Sluncem v denním profilu:
          </p>
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

        {/* Tři metodické školy — přesunuto na /numerologie/jak-pocitame */}
        <section className="mb-20">
          <Link href="/numerologie/jak-pocitame#metodicke-skoly" className="block bg-white border border-gray-200 hover:border-pink-500 rounded-2xl p-6 transition group">
            <p className="eyebrow text-pink-500 mb-2">Tři metodické školy numerologie</p>
            <h3 className="serif text-lg text-gray-900 font-medium group-hover:text-pink-500 transition mb-1">
              Detailní rozbor metodik výpočtu životního čísla →
            </h3>
            <p className="text-gray-600 text-[0.95rem] leading-relaxed">
              Chaldejská (Cheiro), Pythagorejská single-sum (Phillips, Crawford &amp; Sullivan, většina českých příruček), Pythagorejská three-cycle (Decoz — používá Cosmatch), Millmanův dvou-cifrový kód.
            </p>
          </Link>
        </section>

        <hr className="rule mb-20" />

        {/* Co Cosmatch dělá se zdroji */}
        <section className="mb-20">
          <p className="eyebrow text-pink-500 mb-4">Co Cosmatch dělá s těmito zdroji</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-8">
            Syntéza.
          </h2>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-5">
            Texty archetypů, partnerské vztahy i metodologie jsou autorské texty Cosmatch, vycházející ze studia těchto zdrojů, napsané pro česky mluvícího uživatele 27–45 let.
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-5">
            Pro výpočet životního čísla používáme <strong className="text-gray-900 font-medium">Decoz Three-Cycle Method</strong>, kdy redukujeme měsíc, den a rok narození zvlášť, přičemž zachováváme master čísla 11/22/33 v komponentech, pak sečteme a redukujeme finální výsledek. Master 33 se zachová jen pokud aspoň jedna komponenta byla také master (Decoz strict rule).
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">
            Pro kompatibilitu kombinujeme více zdrojů tradičních knih — denní profily jsou inspirované Goldschneiderem a Elffersem a referenčními průvodci Crawfordovou a Sullivanovou.
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
