/**
 * Cosmatch ARCHETYPES — sdílená data o životních číslech.
 *
 * Použití:
 *   - /test (kvíz pro sebepoznání)
 *   - /register (Magic Moment po zadání data narození)
 *   - /numerologie (per-archetype landing pages)
 *
 * METODA VÝPOČTU: Decoz Three-Cycle Method
 *   Redukuje měsíc, den a rok narození zvlášť, zachová master čísla
 *   (11, 22, 33) v komponentech, pak sečte a redukuje finální výsledek.
 *   Master 33 vyžaduje aspoň jednu další master komponentu (Decoz strict rule).
 *
 * ZDROJE (viz ARCHETYPE_SOURCES):
 *   Pythagoras, Juno Jordan, Matthew O. Goodwin, Hans Decoz,
 *   Dan Millman, Michelle Buchanan. České texty jsou syntézou
 *   těchto zdrojů aplikovanou na český kontext.
 *
 * DŮLEŽITÉ: Numerologie není vědecky validovaný prediktor vztahů.
 * Texty fungují jako nástroj sebereflexe — viz Barnum/Forer effect (1949).
 */

// ──────────────────────────────────────────────
// Pomocné funkce — Decoz Three-Cycle Method
// ──────────────────────────────────────────────

/**
 * Sečte všechny číslice čísla (např. 1992 → 1+9+9+2 = 21).
 */
function digitSum(n: number): number {
  return Math.abs(n).toString().split('').map(Number).reduce((a, b) => a + b, 0)
}

/**
 * Redukuje číslo opakovaně až do 1–9, ZACHOVÁVÁ master čísla 11/22/33.
 * Příklad: 21 → 3 (žádný master), 29 → 11 (zachová), 47 → 11 (zachová), 11 → 11.
 */
function reduceWithMasters(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = digitSum(n)
  }
  return n
}

/**
 * Decoz Three-Cycle Method — preferovaný výpočet životního čísla.
 *
 * 1. Redukuj měsíc (1–12) zvlášť, zachovej master.
 * 2. Redukuj den (1–31) zvlášť, zachovej master.
 * 3. Redukuj rok (např. 1992 → 21 → 3) — sečti všechny číslice, pak redukuj.
 * 4. Sečti komponenty a redukuj finální (zachovej master).
 * 5. Strict rule pro 33: zachová se JEN pokud aspoň 1 komponenta byla 11/22.
 *    Jinak 33 → 6 (Decoz/Goodwin classical).
 */
export function lifePathNumber(dateStr: string): number {
  // Expecting "YYYY-MM-DD"
  const parts = dateStr.split('-').map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) return 1  // fallback

  const [year, month, day] = parts

  // Krok 1–3: redukuj komponenty zvlášť, zachovej master
  const monthLP = reduceWithMasters(month)
  const dayLP   = reduceWithMasters(day)
  const yearLP  = reduceWithMasters(digitSum(year))

  // Krok 4: sečti a redukuj finální
  const total = monthLP + dayLP + yearLP
  let finalLP = reduceWithMasters(total)

  // Krok 5: Decoz strict rule pro 33
  if (finalLP === 33) {
    const hasOtherMaster = [monthLP, dayLP, yearLP].some(n => n === 11 || n === 22)
    if (!hasOtherMaster) finalLP = 6
  }

  return finalLP
}

// ──────────────────────────────────────────────
// Typ Archetype (zachová zpětnou kompatibilitu s /test starým UI)
// + nová pole pro 3-vrstvý content (Mirror + Shadow + InLove)
// ──────────────────────────────────────────────
export type Archetype = {
  name: string
  tagline: string
  description: string           // krátký popis (legacy + Magic Moment short)
  traits: string[]
  love: string                  // legacy field
  shadow: string                // legacy field
  compatible: number[]          // legacy compat suggestions

  // NEW — 3-layer content (Fáze 2 doplní)
  mirror?: string               // 300–500 slov, pozitivní identita
  shadowExtended?: string       // 200–300 slov, čestné výzvy
  inLove?: string               // 200–300 slov, dating-specific

  // NEW — Tier kompatibility (z research dossier 12×12 matrix)
  tier1?: number[]              // Naturally Harmonious
  tier2?: number[]              // Growth Partnerships
  tier3?: number[]              // High Friction

  accent: string
}

// ──────────────────────────────────────────────
// 12 archetypů — finální česká jména (Research recommendation B)
// ──────────────────────────────────────────────
export const ARCHETYPES: Record<number, Archetype> = {
  1: {
    name: 'Průkopník',
    tagline: 'Nezávislý, kreativní, ambiciózní.',
    description: 'Jsi přirozeně nezávislý, kreativní a ambiciózní. Miluješ výzvy a jdeš vlastní cestou. V lásce hledáš partnera, který tě bude respektovat, ne řídit.',
    traits: ['Sebejistý', 'Kreativní', 'Přímý', 'Ambiciózní'],
    love: 'Potřebuješ prostor a respekt. Nejlépe se párujete s někým, kdo má svůj vlastní svět — ne s tím, kdo bude závislý na tvé pozornosti.',
    shadow: 'Tendence k příliš velké nezávislosti může bránit skutečné blízkosti.',
    compatible: [3, 5, 6],
    tier1: [3, 5, 6, 9],
    tier2: [2, 7],
    tier3: [1, 8],
    accent: '#C2410C',
  },
  2: {
    name: 'Smiřitel',
    tagline: 'Empatický, intuitivní, partnerský.',
    description: 'Jsi empatický, intuitivní a orientovaný na vztahy. Cítíš ostatní hlouběji než oni sami sebe. V lásce hledáš skutečnou duševní spřízněnost.',
    traits: ['Empatický', 'Intuitivní', 'Laskavý', 'Harmonický'],
    love: 'Potřebuješ jistotu a hlubší spojení. Nejlépe se párujete s někým klidným a spolehlivým, kdo oceňuje tvou citlivost.',
    shadow: 'Přílišná potřeba harmonie může vést k potlačování vlastních potřeb.',
    compatible: [4, 6, 8],
    tier1: [4, 6, 8, 9],
    tier2: [11],
    tier3: [1, 5, 7],
    accent: '#6D28D9',
  },
  3: {
    name: 'Tvůrce',
    tagline: 'Charismatický, expresivní, plný energie.',
    description: 'Jsi charismatický, expresivní a plný energie. Máš dar zaujmout každou místnost. V lásce potřebuješ partnera, se kterým nikdy nezažiješ nudu.',
    traits: ['Charismatický', 'Kreativní', 'Optimistický', 'Komunikativní'],
    love: 'Potřebuješ vzrušení a svobodu sebevyjádření. Nejlépe fungujete s někým, kdo tě obdivuje a dává ti prostor zářit.',
    shadow: 'Rozptýlenost a vyhýbání se hlubší zodpovědnosti může komplikovat dlouhodobé vztahy.',
    compatible: [1, 5, 9],
    tier1: [1, 5, 6, 7, 9],
    tier2: [4],
    tier3: [3, 8],
    accent: '#DB2777',
  },
  4: {
    name: 'Stavitel',
    tagline: 'Spolehlivý, systematický, věrný.',
    description: 'Jsi spolehlivý, systematický a věrný. Stavíš na pevných základech — ve všem, co děláš. V lásce hledáš stabilitu a skutečný závazek.',
    traits: ['Spolehlivý', 'Disciplinovaný', 'Věrný', 'Praktický'],
    love: 'Potřebuješ bezpečí a předvídatelnost. Nejlépe se párujete s někým, kdo sdílí tvé hodnoty a nebojí se budovat budoucnost krok za krokem.',
    shadow: 'Přílišná rigidita může bránit spontaneitě a novým zkušenostem.',
    compatible: [2, 6, 8],
    tier1: [2, 6, 7, 8],
    tier2: [3, 9],
    tier3: [5],
    accent: '#0369A1',
  },
  5: {
    name: 'Dobrodruh',
    tagline: 'Svobodný duch, milovník změny.',
    description: 'Jsi svobodný duch, milovník změny a nových zkušeností. Nudíš se rutinou. V lásce potřebuješ partnera, který tě drží za ruku, ale ne za krk.',
    traits: ['Svobodný', 'Adaptabilní', 'Zvídavý', 'Energický'],
    love: 'Potřebuješ prostor a dobrodružství. Nejlépe fungujete s někým, kdo si tě dokáže uchovat — tím, že je sám zajímavý a nezávislý.',
    shadow: 'Strach ze závazku tě nutí opouštět lidi dříve, než vztah dostane šanci na hloubku.',
    compatible: [1, 3, 7],
    tier1: [1, 3, 7],
    tier2: [8],
    tier3: [4, 6, 11],
    accent: '#047857',
  },
  6: {
    name: 'Pečovatel',
    tagline: 'Láskyplný, zodpovědný, orientovaný na rodinu.',
    description: 'Jsi láskyplný, zodpovědný a orientovaný na rodinu. Tvůj domov je tvůj chrám. V lásce dáváš více, než bereš — ale zasloužíš si obojí.',
    traits: ['Laskavý', 'Zodpovědný', 'Loajální', 'Ochranitelský'],
    love: 'Potřebuješ oceňování a reciprocitu. Nejlépe se párujete s někým, kdo umí přijímat lásku stejně hluboce, jako ji dávat.',
    shadow: 'Přílišné pečování vede k sebeobětování a tiché zatrpklosti.',
    compatible: [2, 4, 9],
    tier1: [1, 2, 3, 8, 9],   // Decoz: 6 funguje s každým
    tier2: [8],
    tier3: [5, 7],
    accent: '#BE185D',
  },
  7: {
    name: 'Hledač',
    tagline: 'Analytický, introspektivní, hluboký.',
    description: 'Jsi analytický, introspektivní a hluboký. Hledáš pravdu pod povrchem věcí. V lásce potřebuješ partnera, který respektuje tvou potřebu hloubky a samoty.',
    traits: ['Analytický', 'Spirituální', 'Klidný', 'Soustředěný'],
    love: 'Potřebuješ partnera, který respektuje tvůj prostor a nesnaží se tě zachránit. Nejlépe fungujete s někým, kdo má vlastní vnitřní svět.',
    shadow: 'Sklon k izolaci a intelektuální nadřazenosti může bránit emocionální blízkosti.',
    compatible: [4, 5, 9],
    tier1: [3, 4, 5, 9],
    tier2: [1, 11],
    tier3: [2, 6],
    accent: '#1E40AF',
  },
  8: {
    name: 'Vladař',
    tagline: 'Strategický, autoritativní, výkonný.',
    description: 'Jsi strategický, autoritativní a výkonný. Vytváříš svět kolem sebe, ne v něm. V lásce potřebuješ partnera, který sdílí tvé ambice, ale není jimi pohlcen.',
    traits: ['Strategický', 'Autoritativní', 'Velkorysý', 'Disciplinovaný'],
    love: 'Potřebuješ partnera, který tě respektuje a má vlastní cíle. Nejlépe se párujete s někým, kdo umí ocenit tvou sílu i zranitelnost.',
    shadow: 'Workoholismus a vnímání lásky jako transakce může vyprázdnit vztah.',
    compatible: [2, 4, 6],
    tier1: [2, 4, 6],
    tier2: [5, 11],
    tier3: [1, 3, 5, 9, 11],
    accent: '#92400E',
  },
  9: {
    name: 'Humanista',
    tagline: 'Soucitný, vizionářský, moudrý.',
    description: 'Jsi soucitný, vizionářský a moudrý. Nesete v sobě všechny předchozí čísla — máš v sobě kus každého archetypu. V lásce hledáš někoho, s kým budeš sdílet větší smysl.',
    traits: ['Soucitný', 'Idealistický', 'Moudrý', 'Velkorysý'],
    love: 'Potřebuješ partnera, s kterým budeš sdílet smysl většího celku. Nejlépe se párujete s někým, kdo má hloubku, ale neztrácí se v sebelítosti.',
    shadow: 'Sklon k záchranářství a chronickému zklamání z reality vede k vyčerpání.',
    compatible: [3, 6, 9],
    tier1: [1, 2, 3, 6, 7, 9],
    tier2: [4, 11],
    tier3: [8],
    accent: '#7C3AED',
  },
  11: {
    name: 'Osvětitel',
    tagline: 'Intuitivní vizionář, spirituální posel.',
    description: 'Jsi intuitivní vizionář s neobyčejnou citlivostí. Cítíš věci, které ostatním unikají. V lásce hledáš partnera, který dokáže nést tvou intenzitu a zároveň ti pomáhá zůstat ukotvený/á.',
    traits: ['Intuitivní', 'Inspirativní', 'Citlivý', 'Spirituální'],
    love: 'Potřebuješ partnera, který tě pochopí v tichosti — slov je málo. Nejlépe fungujete s někým, kdo má pevné nohy a otevřené srdce.',
    shadow: 'Nervozita, perfekcionismus a útěk do fantazií tě brzdí v realizaci tvé vize.',
    compatible: [2, 6, 9],
    tier1: [2, 6, 9, 11, 22],
    tier2: [7, 8],
    tier3: [1, 5],
    accent: '#9333EA',
  },
  22: {
    name: 'Stavitel snů',
    tagline: 'Vizionář, který buduje skutečné věci.',
    description: 'Jsi master builder — vizionář s pevnýma nohama. Dokážeš proměnit sny v instituce, hnutí, nebo trvalá díla. V lásce hledáš někoho, kdo s tebou bude sdílet tvou schopnost realizovat velké vize.',
    traits: ['Vizionářský', 'Praktický', 'Disciplinovaný', 'Inspirativní'],
    love: 'Potřebuješ partnera, který sdílí tvou potřebu budovat něco většího. Nejlépe fungujete s někým, kdo rozumí, že tvá práce je tvůj způsob lásky.',
    shadow: 'Vyhoření z velikosti tvé mise — zanedbáváš zdraví a intimitu kvůli práci.',
    compatible: [4, 11, 33],
    tier1: [4, 6, 11, 33],
    tier2: [9],
    tier3: [3, 5],
    accent: '#1E3A8A',
  },
  33: {
    name: 'Léčitel',
    tagline: 'Master Teacher, kosmický rodič.',
    description: 'Jsi master teacher s darem bezpodmínečné laskavosti. Tvá přítomnost léčí. V lásce hledáš partnera, který ocení tvou bezpodmínečnou laskavost a nebude ji vyčerpávat.',
    traits: ['Soucitný', 'Léčivý', 'Inspirativní', 'Nesobecký'],
    love: 'Potřebuješ partnera, s kterým budeš sdílet tvou misi laskavosti — ne ho zachraňovat. Nejlépe fungujete s někým, kdo umí přijímat lásku stejně tak, jako ji rozdávat.',
    shadow: 'Martyrium na kosmické úrovni — ztrácíš se v službě a vyhoříš dokonale.',
    compatible: [6, 9, 11],
    tier1: [6, 9, 11, 22],
    tier2: [2, 3],
    tier3: [5, 8, 1],
    accent: '#BE1B5E',
  },
}

// ──────────────────────────────────────────────
// Magic Moment — partnership-focused věty pro /register reveal
// (zkrácené, optimalizované pro emocionální dopad)
// ──────────────────────────────────────────────
export const MAGIC_MOMENT_PARTNER_LINE: Record<number, string> = {
  1: 'Hledáme pro tebe partnera, který tě bude respektovat, ne řídit.',
  2: 'Hledáme pro tebe někoho klidného, kdo ocení tvou citlivost a hloubku.',
  3: 'Hledáme pro tebe partnera, který tě bude obdivovat a dá ti prostor zářit.',
  4: 'Hledáme pro tebe někoho, kdo sdílí tvé hodnoty a bude s tebou budovat budoucnost krok za krokem.',
  5: 'Hledáme pro tebe partnera, který tě drží za ruku, ale ne za krk.',
  6: 'Hledáme pro tebe někoho, kdo umí přijímat lásku stejně hluboce, jako ji dávat.',
  7: 'Hledáme pro tebe partnera, který respektuje tvou potřebu hloubky a samoty.',
  8: 'Hledáme pro tebe partnera, který sdílí tvé ambice, ale není jimi pohlcen.',
  9: 'Hledáme pro tebe někoho, s kým budeš sdílet svou vizi většího smyslu.',
  11: 'Hledáme pro tebe partnera, který dokáže nést tvou intenzitu a zároveň ti pomáhá zůstat ukotvený/á.',
  22: 'Hledáme pro tebe partnera, který sdílí tvou potřebu budovat něco trvalého — z pevné země.',
  33: 'Hledáme pro tebe partnera, který ocení tvou bezpodmínečnou laskavost a nebude ji vyčerpávat.',
}

// ──────────────────────────────────────────────
// Zdroje numerologie — citace pro /jak-funguje + /zdroje stránku
// ──────────────────────────────────────────────
export const ARCHETYPE_SOURCES = [
  {
    author: 'Pythagoras',
    era: '~500 př. n. l.',
    role: 'Původce západní (Pythagorovské) numerologie. Základní princip: čísla jako vyjádření kosmického řádu.',
  },
  {
    author: 'Juno Jordan',
    work: 'Numerology: The Romance in Your Name (1965)',
    role: 'Historický základ moderní západní numerologie. Definovala 9 základních archetypů.',
  },
  {
    author: 'Matthew Oliver Goodwin',
    work: 'Numerology: The Complete Guide (1981)',
    role: 'Klasická akademická reference. Tradiční systém (master 11 a 22), striktní Decoz Three-Cycle pro 33.',
  },
  {
    author: 'Hans Decoz',
    work: 'World Numerology, Numerology: Key to Your Inner Self',
    role: 'Moderní západní standard. Cosmatch používá jeho Three-Cycle calculation method s zachováním master čísel.',
  },
  {
    author: 'Dan Millman',
    work: 'The Life You Were Born to Live',
    role: 'Life-purpose framing. Cosmatch ho zmiňuje jako související framework, ale používá Decoz/Buchanan systém.',
  },
  {
    author: 'Michelle Buchanan',
    work: 'The Numerology Guidebook (Hay House)',
    role: 'Současný mainstream. Definuje archetypy včetně master 33.',
  },
  {
    author: 'Gary Goldschneider + Joost Elffers',
    work: 'The Power of Birthdays, Stars & Numbers (1994)',
    role: 'Hlavní zdroj kompatibility podle dne a měsíce narození. 366 unikátních profilů — Cosmatch core matching algorithm.',
  },
  {
    author: 'Jitka Kadlecová',
    work: 'Datum narození a jeho vliv na náš charakter (Eminent, 2006)',
    role: 'Česká numerologická tradice. Inspirace pro lokalizaci archetypů.',
  },
]

// ──────────────────────────────────────────────
// Barnum/Forer disclosure — citováno v Magic Moment a /jak-funguje
// ──────────────────────────────────────────────
export const BARNUM_DISCLOSURE = `Část pocitu „tohle sedí přesně!" je psychologický efekt zvaný Barnumův efekt (objevený Bertramem Forerem v roce 1949 — 39 studentů ohodnotilo identický popis 4.26 z 5.0 jako „přesně mě"). To neznamená, že je numerologie zbytečná — funguje jako nástroj sebereflexe a konverzace s partnerem, ne jako věštba.`
