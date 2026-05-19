/**
 * Cosmatch ARCHETYPES — sdílená data o životních číslech.
 * 
 * Použití:
 *   - /test (kvíz pro sebepoznání)
 *   - /register (Magic Moment po zadání data narození)
 *   - /discover (zobrazení archetypu uživatele na kartě)
 * 
 * Datová východiska: klasická numerologie (Pythagoras → moderní interpretace
 * Goldschneider, Kadlecová). 9 základních + 3 master čísla = 12 archetypů.
 * 
 * VLASTNÍ ČESKÝ TEXT — NEKOPÍROVÁNO Z KNIHY.
 */

// ──────────────────────────────────────────────
// Životní číslo z data narození
// ──────────────────────────────────────────────
// Sečte všechny číslice data narození (YYYY-MM-DD nebo YYYY-M-D), redukuje na 1-9.
// Výjimka: master čísla 11, 22, 33 se NEredukují.
export function lifePathNumber(dateStr: string): number {
  const digits = dateStr.replace(/-/g, '').split('').map(Number)
  let sum = digits.reduce((a, b) => a + b, 0)
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0)
  }
  return sum
}

// ──────────────────────────────────────────────
// Typy
// ──────────────────────────────────────────────
export type Archetype = {
  name: string
  tagline: string
  description: string
  traits: string[]
  love: string
  shadow: string
  compatible: number[]
  accent: string
}

// ──────────────────────────────────────────────
// 12 archetypů (9 základních + 3 master)
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
    accent: '#C2410C',
  },
  2: {
    name: 'Diplomat',
    tagline: 'Empatický, intuitivní, orientovaný na vztahy.',
    description: 'Jsi empatický, intuitivní a orientovaný na vztahy. Cítíš ostatní hlouběji než oni sami sebe. V lásce hledáš skutečnou duševní spřízněnost.',
    traits: ['Empatický', 'Intuitivní', 'Laskavý', 'Harmonický'],
    love: 'Potřebuješ jistotu a hlubší spojení. Nejlépe se párujete s někým klidným a spolehlivým, kdo oceňuje tvou citlivost.',
    shadow: 'Přílišná potřeba harmonie může vést k potlačování vlastních potřeb.',
    compatible: [4, 6, 8],
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
    accent: '#B45309',
  },
  7: {
    name: 'Mudrc',
    tagline: 'Analytický, hloubavý, spirituální.',
    description: 'Jsi analytický, hloubavý a spirituální. Vidíš pod povrch věcí. V lásce hledáš intelektuální a duševní spojení — povrchní vztahy tě vyčerpávají.',
    traits: ['Analytický', 'Intuitivní', 'Hledající', 'Nezávislý'],
    love: 'Potřebuješ prostor a hloubku. Nejlépe fungujete s někým, kdo respektuje tvou potřebu ticha a dokáže vést smysluplné rozhovory.',
    shadow: 'Izolace a přílišná sebeanalýza brání skutečné emocionální blízkosti.',
    compatible: [5, 9, 11],
    accent: '#4338CA',
  },
  8: {
    name: 'Vůdce',
    tagline: 'Ambiciózní, mocný, orientovaný na výsledky.',
    description: 'Jsi ambiciózní, mocný a orientovaný na výsledky. Umíš přeměnit vizi ve skutečnost. V lásce hledáš rovnocenného partnera — ne obdivovatele.',
    traits: ['Ambiciózní', 'Silný', 'Sebevědomý', 'Strategický'],
    love: 'Potřebuješ respekt a rovnocennost. Nejlépe se párujete s někým, kdo má svůj vlastní úspěch a nebojí se stát po tvém boku.',
    shadow: 'Workoholismus a potřeba kontroly odsouvají vztahy na druhou kolej.',
    compatible: [2, 4, 6],
    accent: '#B91C1C',
  },
  9: {
    name: 'Idealista',
    tagline: 'Velkorysý, soucitný, globálně orientovaný.',
    description: 'Jsi velkorysý, soucitný a globálně orientovaný. Cítíš utrpení světa a chceš ho měnit. V lásce hledáš partnera, který sdílí tvé hodnoty.',
    traits: ['Velkorysý', 'Idealistický', 'Soucitný', 'Moudrý'],
    love: 'Potřebuješ sdílené hodnoty a smysl. Nejlépe fungujete s někým, kdo se chce posouvat — ne jen existovat.',
    shadow: 'Přílišný idealismus vede ke zklamání z reálných partnerů, kteří nejsou dokonalí.',
    compatible: [3, 6, 9],
    accent: '#0F766E',
  },
  11: {
    name: 'Vizionář',
    tagline: 'Mistrovské číslo — intuitivní a inspirativní.',
    description: 'Jsi mimořádně intuitivní, citlivý a inspirativní. Máš dar vidět věci, které ostatní přehlédnou. V lásce hledáš transcendentní spojení.',
    traits: ['Vizionářský', 'Intuitivní', 'Citlivý', 'Inspirativní'],
    love: 'Potřebuješ hluboké duševní a duchovní spojení. Povrchní vztahy tě vyčerpávají. Hledáš svou druhou polovinu v nejhlubším slova smyslu.',
    shadow: 'Příliš vysoká citlivost způsobuje přetížení a ústup ze vztahů.',
    compatible: [2, 6, 7],
    accent: '#9333EA',
  },
  22: {
    name: 'Architekt',
    tagline: 'Mistrovské číslo — stavitel světů.',
    description: 'Jsi mistrovský stavitel — lidí, systémů, světů. Tvůj potenciál je obrovský. V lásce hledáš partnera, který rozumí tvé misi.',
    traits: ['Vizionářský', 'Praktický', 'Disciplinovaný', 'Inspirativní'],
    love: 'Potřebuješ partnera, který stojí pevně na zemi, ale dokáže snít s tebou. Nechceš kohokoliv — chceš svého člověka.',
    shadow: 'Obsese s dokonalostí a velikostí zanechává osobní vztahy v ústraní.',
    compatible: [4, 8, 6],
    accent: '#92400E',
  },
  33: {
    name: 'Mistr lásky',
    tagline: 'Mistrovské číslo — léčitel a soucit.',
    description: 'Jsi ztělesnění soucitu, léčení a bezpodmínečné lásky. Tvořích jen 0,3 % populace. V lásce dáváš dary, které si mnozí ani neumí představit.',
    traits: ['Láskyplný', 'Léčivý', 'Moudrý', 'Soucitný'],
    love: 'Potřebuješ partnera, který je schopen přijmout hloubku tvé lásky a opětovat ji. Mnozí se tvé intenzity bojí — ale ten pravý ji pozná.',
    shadow: 'Dávání bez hranic vede k úplnému vyčerpání.',
    compatible: [6, 9, 3],
    accent: '#BE185D',
  },
}

// ──────────────────────────────────────────────
// Magic Moment text — partnership-focused tagline pro /register
// (přidává budoucí orientaci k základnímu archetype description)
// ──────────────────────────────────────────────
export const MAGIC_MOMENT_PARTNER_LINE: Record<number, string> = {
  1: 'Hledáme pro tebe partnera, který tě bude respektovat, ne řídit.',
  2: 'Hledáme pro tebe někoho klidného, kdo ocení tvou citlivost a hloubku.',
  3: 'Hledáme pro tebe partnera, který tě bude obdivovat a dá ti prostor zářit.',
  4: 'Hledáme pro tebe někoho, kdo sdílí tvé hodnoty a budoucnost s tebou bude budovat krok za krokem.',
  5: 'Hledáme pro tebe partnera, který tě drží za ruku, ale ne za krk.',
  6: 'Hledáme pro tebe někoho, kdo umí přijímat lásku stejně hluboce, jako ji dávat.',
  7: 'Hledáme pro tebe partnera, který respektuje tvou potřebu hloubky a samoty.',
  8: 'Hledáme pro tebe partnera, který sdílí tvé ambice, ale není jimi pohlcen.',
  9: 'Hledáme pro tebe někoho, kdo s tebou bude sdílet tvou vizi většího smyslu.',
  11: 'Hledáme pro tebe partnera, který dokáže nést tvou intenzitu a zároveň ti pomáhá zůstat ukotven/a.',
  22: 'Hledáme pro tebe partnera, který sdílí tvou schopnost realizovat velké vize z pevné zemity.',
  33: 'Hledáme pro tebe partnera, který ocení tvou bezpodmínečnou laskavost a nebude ji vyčerpávat.',
}
