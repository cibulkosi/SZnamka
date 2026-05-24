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

/**
 * Karmické dluhy — pre-reduction hodnoty 13, 14, 16, 19, které vrhají stín na finální životní číslo.
 * Goodwin (1981), Decoz, Numerology.com. Detekují se z jednotlivých komponent (month, day, year před redukcí)
 * a z mezisoučtu před finální redukcí.
 *
 * Vrací array karmických dluhů přítomných v datu narození (může být 0–4).
 */
export function detectKarmicDebts(dateStr: string): number[] {
  const parts = dateStr.split('-').map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) return []
  const [year, month, day] = parts
  const KARMIC = [13, 14, 16, 19]
  const debts: number[] = []

  // Check day (most common source — day 13, 14, 16, 19, 28 reduce to KARMIC)
  if (KARMIC.includes(day)) debts.push(day)

  // Check month + day intermediate (less common)
  const yearSum = digitSum(year)
  if (KARMIC.includes(yearSum)) debts.push(yearSum)

  // Check final pre-reduction total
  const monthLP = reduceWithMasters(month)
  const dayLP = reduceWithMasters(day)
  const yearLP = reduceWithMasters(yearSum)
  const totalBeforeReduce = monthLP + dayLP + yearLP
  if (KARMIC.includes(totalBeforeReduce)) debts.push(totalBeforeReduce)

  return Array.from(new Set(debts))  // dedupe
}

/**
 * Texty karmických dluhů (Goodwin/Decoz interpretace).
 */
export const KARMIC_DEBT_MEANINGS: Record<number, { title: string; redukce: number; meaning: string; lesson: string }> = {
  13: {
    title: 'Karmický dluh 13',
    redukce: 4,
    meaning: 'Lekce o lenosti a vyhýbání se práci. V minulém životě jsi pravděpodobně očekával výsledky bez úsilí.',
    lesson: 'Tvou cestou je naučit se trpělivosti, disciplíně a pracovat s lehkostí, ne s odporem. Pokud něco nezvládáš, není to selhání — je to test vytrvalosti.',
  },
  14: {
    title: 'Karmický dluh 14',
    redukce: 5,
    meaning: 'Lekce o nadměrné svobodě, excesech a impulzivitě. V minulosti jsi zneužil dar volnosti k závislostem nebo neukotvenosti.',
    lesson: 'Tvou cestou je naučit se umírněnosti, sebeovládání a najít smysl ve struktuře — bez ztráty radosti z objevování.',
  },
  16: {
    title: 'Karmický dluh 16',
    redukce: 7,
    meaning: 'Lekce o egu, pýše a zneužití intimity či autority. V minulosti jsi pravděpodobně manipuloval druhými skrze osobní šarm nebo intelekt.',
    lesson: 'Tvou cestou je rozpustit pýchu, otevřít se zranitelnosti a vést srdcem, ne jen rozumem.',
  },
  19: {
    title: 'Karmický dluh 19',
    redukce: 1,
    meaning: 'Lekce o zneužití moci a kontrole druhých. V minulosti jsi pravděpodobně sloužil sobě na úkor druhých.',
    lesson: 'Tvou cestou je naučit se vést s pokorou, dělit se o úspěch a používat moc ve službě většího celku.',
  },
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
    tagline: 'Nezávislý, ambiciózní, leader.',
    description: 'Jsi archetyp Průkopníka — vůdce, který si razí vlastní cestu. Charakterizuje Tě nezávislost, kreativita a ambice.',
    traits: ['Sebejistý', 'Přirozený lídr', 'Originální', 'Cílevědomý'],
    love: 'Potřebuješ partnera, který respektuje Tvou nezávislost a dokáže být také nezávislý — závislí lidé Tě dusí. Ideální shoda: 3 (Tvůrce), 5 (Dobrodruh), 6 (Pečovatel) díky kombinaci energie a podpory.',
    shadow: 'Tendence k přílišné nezávislosti může bránit hluboké blízkosti. Naučit se přijímat pomoc je Tvou klíčovou lekcí.',
    compatible: [3, 5, 6],
    tier1: [3, 5, 6, 9],
    tier2: [2, 7],
    tier3: [1, 8],
    mirror: "Tvoje životní číslo 1 znamená, že jsi přišel/přišla na svět začít. Něco vlastního. Něco, co tu předtím nebylo.\n\nMáš v sobě iniciativu, kterou ostatní hledají. Když vstoupíš do prostoru, atmosféra se mění — buď Tě následují, nebo se Ti vyhnou. Obojí je v pořádku. Tvoje role je vést, ne se přizpůsobovat. Tvoje energie je sluneční: jasná, přímá, generativní.\n\nJsi originální. Tam, kde ostatní vidí pravidla, Ty vidíš příležitost je přepsat. Pracuješ nejlíp, když máš kontrolu nad cestou — ne proto, že bys byl panovačný, ale protože Tvoje vize potřebuje prostor, aby dýchala. V týmu jsi přirozený lídr; sám se sebou jsi neúnavný motor. Naučil/a ses spoléhat na sebe brzy — možná dřív, než bylo zdrávo.\n\nTvoje největší síla není v inteligenci ani v charizmatu, byť obojí máš. Je v tom, že nedokážeš pasivně čekat. Když něco nefunguje, začneš to měnit — bez svolení, bez plánu, bez záruky. Tahle vlastnost Ti otevírá dveře, ke kterým by ostatní ani nepřišli.\n\nJsi tvořivý. Tvůj mozek pracuje nestandardně: vidíš souvislosti, které ostatním unikají. To z Tebe dělá inovátora — ale taky někoho, kdo se občas cítí osamělý ve svém vidění světa. Lidé okolo Tě obdivují, ale ne vždy Ti rozumí. To Tě bolí víc, než přiznáváš.\n\nV hloubce duše hledáš respekt. Ne obdiv — ten je laciný — ale skutečný respekt rovného partnera, který Tě vidí celého a stále se rozhodne stát po tvém boku.",
    shadowExtended: "Pyšný jsi víc, než si přiznáváš. Tvoje nezávislost má tmavou stranu: izolaci. Když věci nejdou podle Tebe, máš sklony stáhnout se a vyřešit to sám, místo abys požádal o pomoc. Tím ztrácíš spojence — lidi, kteří by Ti rádi pomohli, ale Ty je k tomu nepustíš.\n\nSoutěživost Tě může pohánět, ale taky ničit. Vidíš ostatní jako překážky, ne jako zdroje. Když někdo dosáhne něčeho podobného jako Ty, místo radosti cítíš nelibost. To je signál, ne charakter — můžeš s tím pracovat.\n\nDomáhání se uznání je Tvůj zranitelný bod. Když nejsi viděn/a, máš tendenci to brát osobně — i když nikdo nic neudělal. Workaholismus je Tvoje obvyklá obrana: pracuješ, abys něco dokázal/a, ne protože Tě to baví.\n\nV konfliktu jsi rychlý/á. Příliš rychlý/á. Než pochopíš, že druhá strana měla jen jiný pohled, už jsi reagoval/a — a poškodil/a vztah, který sis přitom přál/a chránit. Naučit se zpomalit je Tvůj nejdůležitější dlouhodobý úkol.",
    inLove: "V lásce jsi paradoxní. Toužíš po hluboké blízkosti, ale nesneseš pocit, že Tě někdo „vlastní\“. Hledáš partnera, který má svůj vlastní svět — kariéru, vášně, přátele — protože jen takový Tě nebude vysávat.\n\nSpadneš do lásky rychle. Jakmile se rozhodneš, jdeš naplno. Ale pokud druhá strana zaváhá nebo se zachová nedůstojně, jsi schopen/schopna ji okamžitě vyškrtnout — a pak toho dlouho litovat.\n\nTvůj ideální partner není ten, kdo Tě obdivuje. Je to ten, kdo Tě nebere jako samozřejmost a dokáže Ti říct ne. Slabé partnery jsi dřív nebo později opustil/a; silnější Tě donutí růst — a to je, paradoxně, co potřebuješ víc než obdiv.\n\nCo si hlídej: tendenci kontrolovat, kdy se vidíme, jak komunikujeme, kam vztah směřuje. Tvoje touha vést se v partnerství snadno změní v dominanci. Skutečná zralost znamená vědět, kdy ustoupit a nechat druhého rozhodnout.",
    accent: '#C2410C',
  },
  2: {
    name: 'Diplomat',
    tagline: 'Empatický, intuitivní, vyhledávající harmonii.',
    description: 'Jsi Diplomat — citlivý mediátor, který vnímá lidi víc do hloubky než ostatní. Jsi empatický/á, intuitivní a orientovaný/á na vztahy.',
    traits: ['Empatický', 'Skvělý posluchač', 'Intuitivní', 'Trpělivý'],
    love: 'Potřebuješ stabilního, milujícího partnera, který oceňuje Tvou citlivost. Nejlépe si rozumíš se 4 (Stavitel), 6 (Pečovatel), 9 (Idealista) díky kombinaci stability a hloubky.',
    shadow: 'Máš tendenci potlačovat vlastní potřeby pro blaho ostatních. Tvou lekcí je naučit se říkat „ne".',
    compatible: [4, 6, 9],
    tier1: [4, 6, 8, 9],
    tier2: [11],
    tier3: [1, 5, 7],
    mirror: "Tvoje životní číslo 2 znamená, že jsi přišel/přišla pro vztah. Ne kvůli jednomu člověku — vztah je Tvůj nástroj poznání. Skrz druhé poznáváš sebe; skrz sebe ostatním pomáháš poznat sebe.\n\nJsi nesmírně citlivý/á. Cítíš věci, které ostatní ani nezaregistrují: tichá tenze v místnosti, nevyřčená bolest přítele, drobná změna nálady partnera. Tato citlivost je Tvoje největší dárek i Tvoje největší zátěž — záleží na tom, jak s ní zacházíš.\n\nJsi diplomatický/á. Tvoje schopnost vyjednávat, sladit pohledy, najít kompromis — to je výjimečné. V týmu jsi často tichý/á most mezi lidmi, kteří by si jinak neporozuměli. Vidíš, kdo potřebuje co, a umíš to bez ozdob doručit.\n\nTvá inteligence je intuitivní spíše než analytická. Víš věci dřív, než víš proč. Tato schopnost Tě v životě vede dobře — pokud jí důvěřuješ. Když ji potlačíš ve prospěch logiky, ztrácíš se.\n\nV hluboce se nachází Tvá síla měsíční energie: schopnost reflektovat, jemně, ale neústupně. Nejsi slabý/á — jsi pružný/á. To je něco zásadně jiného.",
    shadowExtended: "Tvoje největší slabost je sklon mizet. Sebe sama. Když vztah začne být náročný, namísto vyjádření vlastních potřeb se přizpůsobíš tomu druhému — a sledí už Tě jen mlha.\n\nKonfliktu se vyhýbáš. Pociťuješ ho jako fyzickou bolest. Ale toto vyhýbání vede k tichému zatrpknutí — slovo, které není vysloveno, sedí v Tobě roky. Pak vybuchne ve špatný moment, nad nepatrnou maličkostí, a partner Tě nepoznává.\n\nJsi nadprůměrně senzitivní na kritiku. Co měla být drobná poznámka, žije v Tobě týdny. Lidé okolo se neumějí přiblížit, protože i s nejlepšími úmysly Tě omylem zraňují.\n\nMáš tendenci absorbovat emoce druhých, jako by byly Tvoje. Po dni s lidmi jsi vyčerpaný/á, aniž bys udělal/a něco fyzicky náročného. Učit se rozlišovat, kde končíš Ty a začíná druhý, je Tvůj celoživotní úkol.",
    inLove: "V lásce hledáš hloubku. Povrchní flirt Tě nudí; chceš spojení, které trvá. Jsi loajální až k vlastní škodě a od partnera očekáváš totéž — i když to neřekneš nahlas.\n\nTvůj ideální partner je klidný a spolehlivý. Někdo, kdo nepotřebuje drama, aby cítil lásku. Někdo, kdo umí vyjadřovat city verbálně — nejsi telepat, i když to občas budí dojem.\n\nJsi senzuální. Tvoje láska je hmatatelná: dotek, vůně, jídlo, gesto. Sex pro Tebe není výkon, je to forma komunikace. Když partner neumí tělesný jazyk, cítíš se neviděn/a.\n\nCo si hlídej: ztrácení se v partnerovi. Tvoje schopnost vcítit se může vést k tomu, že žiješ jeho život místo svého. Mít vlastní přátele, vlastní koníčky, vlastní cíle — to není ohrožení vztahu. To je to, co Tě udrží zajímavým/ou.",
    accent: '#6D28D9',
  },
  3: {
    name: 'Tvůrce',
    tagline: 'Charismatický a expresivní člověk, který je plný energie.',
    description: 'Jsi Tvůrce — kreativní vypravěč, který přitahuje pozornost. Charismatický, expresivní a optimistický člověk.',
    traits: ['Kreativní', 'Skvělý komunikátor', 'Optimistický', 'Inspirativní'],
    love: 'Potřebuješ partnera, který oceňuje Tvou energii a dává Ti prostor zářit. Nejlépe se hodíš k 1 (Průkopník), 5 (Dobrodruh), 7 (Hledač), s nimiž vytváříš energetická souznění.',
    shadow: 'Tendence vyhýbat se hlubší zodpovědnosti komplikuje dlouhodobé vztahy. Tvou lekcí je naučit se dělat věci víc do hloubky a méně povrchně.',
    compatible: [1, 5, 7],
    tier1: [1, 5, 6, 7, 9],
    tier2: [4],
    tier3: [3, 8],
    mirror: "Tvoje životní číslo 3 znamená, že jsi přišel/přišla vyjadřovat. Slova, obrazy, hudbu, příběhy — jakýkoli kanál Ti sedí, ale vyjadřovat se musíš. Jinak zhasneš.\n\nMáš v sobě jiskru, kterou ostatní hledají v alkoholu, drogách nebo na koncertech. Tvoje přirozená radost ze života je nakažlivá — když vejdeš do místnosti, atmosféra se zlehka zvedne. Tvoje schopnost vidět humor v běžných situacích léčí lidi okolo víc, než si uvědomuješ.\n\nJsi tvořivý/á. Tvořivost není pro Tebe hobby; je to Tvůj operační systém. I obyčejnou snídani umíš zaranžovat tak, aby z toho byl zážitek. Tvůj smysl pro detail v estetice je výjimečný.\n\nJsi sociální génius. Pamatuješ si lidi, pamatuješ si detaily, dokážeš se cítit doma kdekoli. Tato schopnost Ti otevírá dveře — a víc dveří otevíráš ostatním, kteří jsou Ti vděční.\n\nTvoje hlavní výzva je důslednost. Talent máš — ale talent bez disciplíny zůstane potenciálem. Když se Ti podaří spojit tvořivost s pravidelnou prací, dosáhneš věcí, které vypadají magicky.\n\nV hloubce hledáš někoho, kdo Tě bude obdivovat, ale kdo se Ti zároveň postaví. Obdiv Tě nakopne, výzva Tě udrží.",
    shadowExtended: "Roztříštěnost je Tvůj démon. Začínáš deset projektů, dokončíš dva. Tvůj entuziasmus pro nové věci je nezadržitelný — a v okamžiku, kdy se z té nové věci stane „obyčejná práce\“, ztrácíš zájem.\n\nCitově jsi proměnlivý/á. Vysoké vrcholy, hluboké propady. Stejný den dokážeš být euforický a depresivní, aniž bys věděl/a proč. To pro partnery, kteří potřebují stabilitu, není snadné nést.\n\nMáš sklony k povrchnosti, když se necítíš bezpečně. Místo abys řekl/a, co Tě bolí, naředíš to vtipem. Místo abys čelil/a obtížnému rozhovoru, prchne do humoru nebo do nové sociální aktivity. Lidé okolo to vidí, i když si myslíš, že ne.\n\nKritika Tě paralyzuje. Tvoje sebehodnocení je víc závislé na potleskvání ostatních, než si přiznáváš. Když jeden kritik zaútočí, deset chválících hlasů zaniká.",
    inLove: "V lásce jsi rychlý/á zamilovat se. Tvoje srdce je otevřené, Tvoje představivost rozdmýchávat romance. Často zamilovaný/á jsi víc do ideje vztahu než do skutečného člověka — což funguje v prvních týdnech, ale začne to skřípat ve měsíci čtvrtém.\n\nTvůj ideální partner je někdo, kdo má vlastní jiskru — někdo, kdo umí být intelektuálně i emocionálně dynamický. Tichý partner, který „si chce jen odpočinout doma\“, Tě bude pomalu udušovat.\n\nSex je pro Tebe forma komunikace a hravosti. Potřebuješ partnera, který umí být v posteli kreativní a nevidí intimitu jako mechanický akt. Když je sex monotónní, ztrácíš zájem rychle.\n\nCo si hlídej: tendenci uniknout, když věci přitvrdí. Hluboký vztah neznamená neustálé vrcholy — naopak, klidné fáze jsou důkazem zdraví, ne nudy. Učit se zůstat, když srdce zatouží odejít, je Tvoje hlavní zralostní lekce.",
    accent: '#DB2777',
  },
  4: {
    name: 'Stavitel',
    tagline: 'Spolehlivý, systematický, věrný.',
    description: 'Jsi Stavitel — pragmatický stratég, který staví trvalé věci. Spolehlivý/á a věrný/á milovník stability.',
    traits: ['Disciplinovaný', 'Loajální', 'Praktický', 'Tvůrce systémů'],
    love: 'Potřebuješ bezpečí a předvídatelnost. Nejlépe se hodíš k 2 (Diplomat), 6 (Pečovatel), 8 (Vůdce), s nimiž sdílíš hodnoty stability.',
    shadow: 'Rigidita brání spontaneitě a novým zkušenostem. Tvou lekcí je naučit se být flexibilní.',
    compatible: [2, 6, 8],
    tier1: [2, 6, 7, 8],
    tier2: [3, 9],
    tier3: [5],
    mirror: "Tvoje životní číslo 4 znamená, že jsi přišel/přišla budovat. Trvalé věci. Ne ohňostroje — chrámy.\n\nJsi solidní. Když řekneš, že něco uděláš, uděláš to. Tvoje slovo má váhu. V době, kdy slovo nestojí za nic, jsi pevný bod, na který se dá spoléhat — a tato kvalita je vzácnější, než si myslíš.\n\nPracuješ. Tvoje schopnost vytrvat tam, kde ostatní vzdají, je nadprůměrná. Disciplína Ti nepřijde jako trápení, je to Tvůj přirozený režim. Když máš jasný cíl, propracuješ se k němu krok za krokem — a po cestě postavíš věci, na které budou ostatní vzpomínat dlouho.\n\nJsi logický/á. Tam, kde ostatní propadají emocím, Ty vidíš strukturu. Tvá racionalita je Tvoje superkvalita — pomáhá Ti řešit problémy, které ostatní jen probrečí.\n\nTvůj smysl pro spravedlnost je vysoký. Nesnášíš nepoctivost, lži, krádeže — ve velkém i v malém. Lidé kolem Tebe to vědí a obvykle k Tobě chovají hluboký respekt, i když to neukazují.\n\nV hluboce hledáš jistotu. Domov, který vypadá stejně, ráno co ráno. Partnera, který je ráno tam, kde byl večer. Tato touha po stabilitě je Tvoje největší síla a Tvoje největší slabost.",
    shadowExtended: "Rigidita je Tvůj démon. Jakmile si nastavíš způsob, jak věci dělat, je téměř nemožné Tě přesvědčit, aby ses změnil/a. To, co bylo včera ctnost, dnes brzdí.\n\nWorkoholismus Tě nutí cítit se užitečný/á. Ale spojuješ vlastní hodnotu s produktivitou — když jeden den nic neuděláš, cítíš se prázdný/á. Toto je past: práce nikdy neskončí, ale Tvůj život ano.\n\nEmocionálně jsi opatrný/á. Místo aby ses otevřel/a, používáš spolehlivost jako zeď. Partner ví, že Tě vidí — ale neví, jak je Ti uvnitř. „Já jsem v pohodě\“ je Tvoje obvyklá odpověď i v okamžicích, kdy nejsi.\n\nKritičnost je Tvoje rezervní obrana. Když se cítíš nejistý/á, začneš najít chyby u druhých. Tvoje vysoké standardy mají tendenci stát se nedosažitelnými — a partnerství se mění v audit.",
    inLove: "V lásce jsi pomalý/á na rozhodnutí. Nepoužíváš slovo „miluju\“ zbrkle. Když ho vyslovíš, znamená to. Tvoje láska se měří v drobných každodenních činech, ne v romantických gestech.\n\nTvůj ideální partner je někdo, kdo sdílí Tvé hodnoty — věrnost, pravdivost, schopnost budovat. Někdo, kdo nepotřebuje neustálé novinky, aby cítil lásku. Někdo, kdo umí ocenit, že stejný oběd v neděli je důkaz, ne nuda.\n\nSex pro Tebe je o důvěře. Není to performance, není to dobrodružství — je to akt, kterým partnera pustíš nejhlouběji. Proto sex s nesprávným partnerem je pro Tebe traumatičtější než pro většinu lidí.\n\nCo si hlídej: zaměňování spolehlivosti za přítomnost. Být tam fyzicky a být tam emocionálně jsou dvě různé věci. Partner potřebuje obojí. Naučit se vyjadřovat city verbálně — i když Ti to zní cize — je Tvoje nejdůležitější dlouhodobá práce.",
    accent: '#0369A1',
  },
  5: {
    name: 'Dobrodruh',
    tagline: 'Svobodný duch, milovník změny.',
    description: 'Jsi Dobrodruh — svobodný duch, který se nudí rutinou. Adaptivní, zvídavý/á, plný/á energie.',
    traits: ['Adaptabilní', 'Komunikativní', 'Nadšený', 'Otevřená mysl'],
    love: 'Potřebuješ prostor a dobrodružství. Ideální shoda: 1 (Průkopník), 3 (Tvůrce), 7 (Hledač) — partneři s vlastním světem.',
    shadow: 'Strach ze závazku Tě nutí opouštět lidi dříve, než vztah dostane šanci na hloubku.',
    compatible: [1, 3, 7],
    tier1: [1, 3, 7],
    tier2: [8],
    tier3: [4, 6, 11],
    mirror: "Tvoje životní číslo 5 znamená, že jsi přišel/přišla žít. Plnohodnotně. Nudíš se v krabičkách, kazíš se v rutině, ožíváš v pohybu.\n\nJsi svobodný duch. Pět smyslů máš zostřené — barvy vidíš jasněji, hudbu cítíš pod kůží, jídlo chutná víc, vůně dokáže přepsat Tvůj den. Tvoje životní zkušenost je intenzivnější než průměrná, a tato intenzita Tě nutí jít dál.\n\nJsi adaptabilní. Hodíš Tě do nového města, nového zaměstnání, nové kultury — a za týden funguješ. Tvoje schopnost se rychle učit a přizpůsobit je výjimečná. V chaosu jsi doma — kde ostatní propadají panice, Ty vidíš příležitost.\n\nJsi charismatický/á. Lidé Tě poslouchají, lidé Tě následují, lidé si Tě pamatují. Tvoje slovo má váhu nejen proto, co říkáš, ale jak to říkáš. Mohl/a by ses živit prodejem čehokoli — protože dokážeš lidi nadchnout.\n\nTvoje zvědavost je Tvůj motor. Bavíš se otázkami víc než odpověďmi. Tvůj mozek je sklad nesourodých informací — a v nečekané chvíli z toho vytahuješ moudrost, která ostatní ohromuje.\n\nV hloubce hledáš někoho, kdo s tebou bude utíkat — ale nemusí Tě držet za ruku každou minutu. Hledáš nezávislého rovného, ne strážce.",
    shadowExtended: "Závazku se bojíš víc, než říkáš. Tvoje „potřebuju prostor\“ může být skrytý úprk před hloubkou. Pokaždé když se blíží reálná intimita, najdeš důvod odjet — geograficky, emocionálně, nebo do nového projektu.\n\nImpulzivnost Tě dostává do problémů. Rozhodnutí, která uděláš v okamžiku entuziasmu, později žereš. Auto, byt, vztah, kariéra — všechno jsi se rozhodl/a rychle a pak jsi to revidoval/a, často za vysokou cenu.\n\nSklony k závislostem — alkohol, drogy, jídlo, sex, nakupování — máš silnější než průměrný člověk. Tvoje touha po intenzitě Tě může vést k tomu, že hledáš zkratky k pocitům, které by si zasloužily čas.\n\nSlíbil/a jsi věci, které jsi nedodržel/a. Ne ze špatnosti — v okamžiku slibování jsi to myslel/a vážně. Ale když přišel čas plnit, byl/a jsi už jinde mentálně. Lidé okolo se postupně učí, že Tvá slova nemusí znamenat činy.",
    inLove: "V lásce jsi rozporuplný/á. Toužíš po hluboké blízkosti, ale když ji máš, panikaříš. Tvůj vzorec: zamilovat se rychle, pak couvnout, pak chybět, pak se vrátit. Pro partnery, kteří potřebují stabilitu, jsi nesnesitelný/á.\n\nTvůj ideální partner je nezávislý sám o sobě. Někdo, kdo nemá strach, že odejdeš — protože ví, že má vlastní svět. Někdo, kdo dokáže říct: „jasně, jeď, uvidíme se za týden\“ — a tato klidnost Tě paradoxně přiváže silněji než vyžadování.\n\nSex je pro Tebe dobrodružství. Nudíš se, když je předvídatelný. Hledáš partnera, který sdílí Tvoji hravost a chuť experimentovat — emocionálně i fyzicky.\n\nCo si hlídej: opustit lidi předtím, než se k Tobě stihnou přiblížit. Tvoje strach z pasti Tě vede k tomu, že vytváříš pasti sám/sama. Učit se zůstat, když srdce chce utéct, je Tvoje hlavní úloha. Hluboký vztah neznamená ztrátu svobody — naopak, je to bezpečí, ve kterém můžeš být svobodný/á víc než kdy předtím.",
    accent: '#047857',
  },
  6: {
    name: 'Pečovatel',
    tagline: 'Láskyplný, zodpovědný, orientovaný na rodinu.',
    description: 'Jsi Pečovatel — láskyplný ochránce rodiny a přátel. Zodpovědný/á, věrný/á a dáváš víc, než bereš.',
    traits: ['Empatický', 'Zodpovědný', 'Loajální', 'Harmonický'],
    love: 'Potřebuješ partnera, který umí přijímat lásku stejně hluboce, jako ji dáváš. Ideální shoda: 1 (Průkopník), 2 (Diplomat), 9 (Idealista) — kombinace lásky, sdíleného soucitu a porozumění.',
    shadow: 'Přílišné pečování vede k sebeobětování a tiché zatrpklosti. Lekce: nauč se pečovat nejdřív o sebe.',
    compatible: [1, 2, 9],
    tier1: [1, 2, 3, 8, 9],   // Decoz: 6 funguje s každým
    tier2: [8],
    tier3: [5, 7],
    mirror: "Tvoje životní číslo 6 znamená, že jsi přišel/přišla milovat. Ne romanticky — to je jen jedna forma. Tvoje láska je gravitační síla, která drží dohromady rodiny, komunity, přátelství.\n\nJsi pečující bez vypočítavosti. Když vidíš někoho v nouzi, automaticky pomáháš — i když by se to nikdo nikdy nedozvěděl. Tato vlastnost není pózou; je to Tvůj přirozený režim. Lidé okolo Tebe to cítí a vracejí se ke Tobě v krizích.\n\nJsi zodpovědný/á. Nebudeš utíkat, když to začne být těžké. Tvůj smysl pro povinnost je hluboký a neúplatný — partneři, děti, rodiče, přátelé — staráš se o všechny, kdo jsou Ti svěřeni.\n\nTvůj estetický cit je vysoký. Domov, který stavíš, je krásný — ne proto, že máš peníze na designéra, ale protože vidíš krásu v drobnostech. Šálek na správném místě, květina ve vázě, světlo v rohu místnosti.\n\nVyzařuješ stabilitu. Lidé v Tvé blízkosti se cítí v bezpečí. Tvoje přítomnost je léčivá — a tato schopnost není získaná, je vrozená.\n\nV hloubce hledáš někoho, kdo umí přijímat lásku stejně dobře, jako ji dávat. Někoho, kdo nevyužívá Tvé štědrosti — ale opětuje ji.",
    shadowExtended: "Martyrdom je Tvůj démon. Dáváš až k vyčerpání — a pak se cítíš opuštěný/á, protože nikdo nedává tolik Tobě. Ale málokdo to dělat může: nikdo nemá Tvoji kapacitu. Naučit se přijímat — i když to znamená nejdřív požádat — je Tvoje největší růstová lekce.\n\nKontrola pod rouškou péče. „Já vím, co je pro Tebe nejlepší\“ je věta, kterou pronášíš častěji, než si přiznáváš. Tvoje touha pomáhat se snadno změní v touhu řídit — a partneři, děti, přátelé se vzdalují, i když Ty se snažíš víc.\n\nSkóre vedeš. Tvrdíš, že nevedeš — ale pamatuješ si přesně, co jsi dal/a a co jsi dostal/a. Když přijde nerovnováha, místo přímého rozhovoru začneš tiše trpět. To je toxickější než hádka.\n\nVolíš partnery, kteří potřebují Tvoji péči. „On/ona mě potřebuje\“ je Tvoje skrytá motivace — a vede Tě do vztahů, kde jsi pečovatel/ka, ne partner/ka. Skutečně rovný vztah, kde Tě někdo umí postavit, je výjimečně náročný/á pro Tebe — ale je to to, co potřebuješ.",
    inLove: "V lásce jsi domov. Pro partnera jsi bezpečný přístav, kam se vrací po dlouhém dni. Vaříš, pamatuješ si výročí, řešíš logistiku — všechno to drobné, co tvoří partnerství pohodlným.\n\nTvůj ideální partner je někdo, kdo umí ocenit, co dáváš — ne brát to jako samozřejmost. Někdo, kdo vrátí Tvoji péči — nemusí stejnou měrou, ale viditelně. Sex pro Tebe je akt důvěry a intimity, ne sport.\n\nTvá sexualita je velkorysá. Dokážeš dát partnerovi přesně to, co potřebuje, ale máš tendenci podceňovat vlastní touhy. Naučit se říkat „já chci tohle\“ je revoluce, kterou Ti partneři vděčně přijmou.\n\nCo si hlídej: volit partnery, kteří potřebují záchranu. Tvoje schopnost vidět něčí potenciál se mísí s touhou ho rozvíjet. Skutečně zdravý partner je ten, který Tě nepotřebuje, ale chce. Tato distinkce je všechno.",
    accent: '#BE185D',
  },
  7: {
    name: 'Hledač',
    tagline: 'Analytický, hloubavý, spirituální.',
    description: 'Jsi Hledač (někdy nazývaný Mudrc) — introspektivní hledač pravdy. Analytický/á, intuitivní, vidíš pod povrch věcí.',
    traits: ['Analytický', 'Spirituální', 'Nezávislý myslitel', 'Hledá moudrost'],
    love: 'Potřebuješ partnera, který respektuje Tvou potřebu ticha a dokáže vést smysluplné rozhovory. Ideální shoda: 3 (Tvůrce), 5 (Dobrodruh), 11 (Vizionář).',
    shadow: 'Izolace a přílišná sebeanalýza brání skutečné emocionální blízkosti. Životní lekcí je naučit se pouštět si lidi blíž.',
    compatible: [3, 5, 11],
    tier1: [3, 4, 5, 9],
    tier2: [1, 11],
    tier3: [2, 6],
    mirror: "Tvoje životní číslo 7 znamená, že jsi přišel/přišla pochopit. Hloubku, kterou ostatní neslyší. Smysl, který se skrývá pod povrchem.\n\nJsi přirozeně analytický/á. Tvůj mozek nepřijímá věci tak, jak jsou — okamžitě je rozebírá. Hledáš vzorce, kauzality, hlubší vrstvy. To, co ostatním přijde jako mystické tušení, Ty máš jako strukturu — i když ji ostatním neumíš vždy vysvětlit.\n\nJsi spirituální v širokém smyslu. Nemusíš být náboženský/á, ale Tvoje vnímání světa zahrnuje to, co se nedá změřit. Cítíš věci, kterým ostatní nevěří, dokud se nestanou.\n\nTvoje samota není slabost — je Tvůj zdroj. Když ostatní načerpávají energii ze společnosti, Ty ji ztrácíš. Hodina sám/sama s knihou, procházkou, nebo prostě v tichu Ti dá víc než víkend večírků.\n\nJsi nezávislý/á myslitel/ka. Konvenční odpovědi Tě nezajímají. Když Ti někdo řekne „takhle se to dělá\“, Tvoje první otázka je „a proč?\“ Tato vlastnost Tě izoluje, ale taky vede k objevům, ke kterým by ostatní nedošli.\n\nV hluboce hledáš partnera, který respektuje Tvoji potřebu prostoru — a nechápe ji jako odmítnutí. Někoho, kdo sám sebe živí, nepotřebuje Tě jako jediný zdroj smyslu.",
    shadowExtended: "Izolace Ti přijde pohodlnější než nepohodlí intimity. Když věci ve vztahu začnou být náročné, místo abys řekl/a, co Tě bolí, stáhneš se. „Potřebuju prostor\“ je Tvoje obrana — a partner to slyší jako odmítnutí, i když to tak nemyslíš.\n\nIntelektuální nadřazenost je Tvé skryté pokušení. Cítíš se moudřejší než ostatní — a často právem — ale toto vědomí vytváří distanc, který nikdo, ani Ty sám/sama, nedokáže překonat.\n\nCynismus Tě může zničit. Tvoje analytická schopnost vidět pod povrchem se může zvrhnout v očekávání toho nejhoršího. Naučit se vidět dobré v lidech, aniž bys ztratil/a skepsi, je Tvoje nejtěžší práce.\n\nEmocionálně jsi rezervovaný/á. Ne proto, že necítíš — cítíš víc než ostatní — ale protože nevíš, jak to bezpečně sdělit. Partneři Tě obviňují ze studenosti, ale to není pravda; Tobě jen chybí jazyk.\n\nTajnůstkářství je Tvůj zlozvyk. Nesdílíš věci, které by sis měl/a sdílet, protože „je to moje\“. Tato uzavřenost Ti dlouhodobě brání budovat hluboké vztahy, po kterých přitom toužíš.",
    inLove: "V lásce jsi pomalý/á, opatrný/á, hluboký/á. Když se otevřeš, otevřeš se naplno — ale dveře se otevírají roky, ne týdny. Partner musí mít trpělivost.\n\nTvůj ideální partner je někdo, kdo má vlastní vnitřní svět. Někdo, kdo umí být zticha v jednom pokoji s tebou a oba pracujete na svém. Někdo, kdo neinterpretuje Tvoji potřebu samoty jako problém, ale jako Tvoji povahu.\n\nSex pro Tebe je akt hluboké blízkosti, ne výkon. Když se otevřeš tělesně, otevíráš se duševně. Proto sex s nesprávným partnerem je pro Tebe extrémně narušující — cítíš se zranitelně způsobem, který je těžké vysvětlit.\n\nCo si hlídej: používat „potřebuju prostor\“ jako útěk před intimitou. Někdy tu potřebu skutečně máš — ale někdy je to obranný mechanismus před něčím, co Tě v partnerství zraňuje. Učit se rozlišovat mezi oběma stavy je Tvoje hlavní zralostní práce.",
    accent: '#1E40AF',
  },
  8: {
    name: 'Vůdce',
    tagline: 'Ambiciózní, mocný, orientovaný na výsledky.',
    description: 'Jsi Vůdce — ambiciózní stratég, který umí přeměnit vizi ve skutečnost. Mocný/á, sebevědomý/á a orientovaný/á na výsledky.',
    traits: ['Silný lídr', 'Strategický', 'Tvůrce hodnot', 'Disciplinovaný'],
    love: 'Potřebuješ rovnocenného partnera, ne obdivovatele. Ideální shoda: 2 (Diplomat), 4 (Stavitel), 6 (Pečovatel).',
    shadow: 'Workoholismus a potřeba kontroly odsouvají vztahy na druhou kolej. Životní lekcí je naučit se balancovat mezi prací a láskou.',
    compatible: [2, 4, 6],
    tier1: [2, 4, 6],
    tier2: [5, 11],
    tier3: [1, 3, 5, 9, 11],
    mirror: "Tvoje životní číslo 8 znamená, že jsi přišel/přišla vést, ovlivňovat, vytvářet vliv. Není to o egu — je to o schopnosti měnit svět kolem sebe.\n\nJsi strategický/á. Vidíš tahy, které ostatní nevidí. Kde ostatní vidí dnešek, Ty vidíš pět tahů dopředu. Tato schopnost Ti dává nepřirozenou výhodu — a zodpovědnost ji používat moudře.\n\nJsi výkonný/á. Když přijdeš na úkol, dokončíš ho. Tvoje pracovní etika je nadprůměrná, Tvoje schopnost nést tlak výjimečná. Lidé Tě hledají v krizích, protože vědí, že nezakolísáš.\n\nJsi velkorysý/á. Když máš, dáváš — partnerům, rodině, přátelům, kolegům. Tvoje peněženka se otevírá snadno, protože víš, že peníze jsou nástroj, ne cíl. Tato velkorysost je jedna z Tvých nejméně viděných ctností.\n\nTvá autorita je přirozená. Ne dominantní — autoritativní. Lidé Tě poslouchají, protože cítí, že víš, co děláš. Když ses naučil/a tuto autoritu vyvažovat s pokorou, jsi nezastavitelný/á.\n\nV hluboce hledáš partnera, který respektuje Tvoji sílu, ale nebojí se Ti říct, když děláš chybu. Někoho, kdo má vlastní vnitřní svět a nedělá z Tebe svůj projekt.",
    shadowExtended: "Kontrolu jsi se naučil/a brzy. Možná dřív, než bylo zdrávo. Naučil/a ses, že když máš věci pod kontrolou, nic se nemůže rozpadnout. Ale toto naučení Tě vede k tomu, že nedáváš věcem prostor — partnerství, dětem, kreativitě — aby se vyvíjely svým způsobem.\n\nMaterialismus je Tvoje skrytá past. Materiální úspěch Ti dává pocit hodnoty — a když to nejde, propadáš úzkosti, kterou si nepřiznáš. Tvoje identita je víc spojena s tím, co máš a co dokážeš, než s tím, kdo jsi.\n\nWorkaholismus Tě izoluje. Strávíš večery v práci, víkendy v práci, dovolené kontroluješ e-maily. Partner se učí, že jsi sice doma fyzicky, ale mentálně někde jinde. To je samota uprostřed manželství.\n\nZacházíš s láskou transakčně. „Já se starám o finance, Ty o emoce\“ je Tvoje implicitní dohoda. Ale partner nepotřebuje sponzora, potřebuje partnera. Učit se být emocionálně přítomný/á je Tvoje nejdůležitější dlouhodobá lekce.\n\nŽárlivost a soutěživost. Když partner uspěje, místo radosti cítíš drobné nepohodlí. Tento pocit je signál, ne charakter — můžeš s ním pracovat, ale jen když si ho přiznáš.",
    inLove: "V lásce jsi velkorysý/á provider. Materiálně, logisticky, organizačně — partner ví, že Tě má za zády. Tvůj problém není v dávání, je v přítomnosti.\n\nTvůj ideální partner je někdo, kdo má vlastní cíle a vlastní vnitřní život. Někdo, kdo není závislý na Tobě, ale volí si Tě každý den. Někdo, kdo umí ocenit Tvoje úsilí — a zároveň Ti říct, kdy přeháníš.\n\nSex je pro Tebe akt intimity, ale snadno se mění v rutinu, když nedáváš pozor. Tvoje únava z práce se promítá do ložnice. Naučit se být plně přítomný/á ve fyzickém aktu — ne s mobilem v hlavě — je revoluce, kterou partner ocení.\n\nCo si hlídej: zaměňování úspěchu za hodnotu. Když nemáš výsledky, cítíš se prázdný/á — a tuhle prázdnotu si někdy léčíš workoholismem, jindy konzumací. Partnerství vyžaduje, aby ses uměl/a zastavit, ne jen vykonávat. To je Tvoje hlavní zralostní práce.",
    accent: '#92400E',
  },
  9: {
    name: 'Idealista',
    tagline: 'Velkorysý, soucitný, globálně orientovaný.',
    description: 'Jsi Idealista — velkorysý vizionář, který cítí utrpení světa a chce ho měnit. Soucitný/á a moudrý/á.',
    traits: ['Hluboce empatický', 'Globální vidění', 'Velkorysý', 'Inspirativní'],
    love: 'Potřebuješ partnera, který sdílí Tvé hodnoty. Ideální shoda: 1 (Průkopník), 2 (Diplomat), 3 (Tvůrce) — souznění hodnot a vzájemný respekt.',
    shadow: 'Přílišný idealismus vede ke zklamání z reálných partnerů, kteří nejsou dokonalí.',
    compatible: [1, 2, 3],
    tier1: [1, 2, 3, 6, 7, 9],
    tier2: [4, 11],
    tier3: [8],
    mirror: "Tvoje životní číslo 9 znamená, že jsi přišel/přišla dokončit cyklus a předat moudrost. Ne nutně tu, kterou Ti někdo svěřil — tu, kterou jsi sám/sama získal/a v životě.\n\nJsi soucitný/á v širokém měřítku. Tvoje srdce nezná hranice — bolest cizinců se Tě dotýká stejně jako bolest blízkých. Tato kapacita je Tvoje největší dar a Tvoje největší zátěž.\n\nJsi moudrý/á za svůj věk. Tvoji vrstevníci si někdy přicházeli pro radu už když Ti bylo dvacet. Neseš v sobě staré duše — věci víš, aniž bys je studoval/a, vidíš věci, na které ostatní ještě nepřijdou.\n\nJsi velkorysý/á s časem, penězi, energií. Když máš, dáváš — a tato přirozenost Ti otevírá brány, kterými by jiní procházeli desetiletí. Lidé Tě respektují, protože cítí, že Tvá štědrost není transakce.\n\nTvůj vkus pro krásu je vysoký. Cestování, kultura, umění, hudba — to je pro Tebe potrava, ne luxus. Bez krásy se vysušuješ.\n\nTvá vize je univerzální. Vidíš celek tam, kde ostatní vidí kousky. Tato perspektiva Ti dává schopnost spojovat lidi, kteří by si jinak nepřišli na chuť.\n\nV hloubce hledáš partnera, s kterým budeš sdílet smysl většího celku. Někoho, kdo má vlastní vize a nepotřebuje Tě jako jediný zdroj smyslu.",
    shadowExtended: "Sebeobětování je Tvůj démon. Dáváš až k vyčerpání — a pak se cítíš zrazeně, protože nikdo nedává zpět. Ale partneři Tě nezradili — Ty jsi nepoložil/a hranice.\n\nIdealismus Tě může ničit. Tvoje očekávání od světa, od partnera, od sebe sama jsou tak vysoká, že realita Tě chronicky zklamává. Naučit se přijmout lidi, jací jsou, ne jací by mohli být, je Tvá hlavní práce.\n\nZáchranářství. Vidíš v lidech potenciál, kterého ani oni sami nevidí — a tato schopnost Tě vede k volbě partnerů, kteří „Tě potřebují\“. To je past: vztah založený na potřebě jednoho z partnerů opravit toho druhého nepřežije.\n\nEmocionální stažení. Když ses ztratil/a v péči o ostatní a nezbylo nic pro Tebe, máš tendenci zmizet — ne fyzicky, ale emocionálně. Partneři Tě obviňují z chladu, ale Ty se cítíš prostě vyždímaný/á.\n\nTendence držet se ve vztazích, které neslouží. „Já ho ještě nemůžu opustit, on mě potřebuje\“ — tato věta Tě v životě stála roky. Učit se odejít je Tvoje nejtěžší lekce.",
    inLove: "V lásce jsi velkorysý/á, vize, hluboký/á. Tvoje představy o partnerství zahrnují nejen vás dva — ale to, co spolu uděláte pro svět. Nehledáš jen lásku; hledáš spojence.\n\nTvůj ideální partner je někdo, kdo má vlastní misi. Někdo, s kým můžeš dělat smysl pro něco víc než pro sebe. Někdo, kdo nepřipadne jen na Tebe jako zdroj — ale stojí na vlastních nohách.\n\nSex je pro Tebe transcendentní zkušenost, když je s pravým partnerem. Spojení duší přes těla — víc než pouhá fyzická aktivita. Když tato hloubka chybí, ztrácíš zájem rychle.\n\nCo si hlídej: zachraňování. Tvůj soucit se snadno změní v záchranářský komplex — a partner se stane projektem. Skutečně zdravý vztah je s někým, kdo se nepotřebuje opravovat. Tato distinkce Ti otevře dveře, které jsi roky nevěděl/a, že existují.",
    accent: '#7C3AED',
  },
  11: {
    name: 'Vizionář',
    tagline: 'Mistrovské číslo — intuice a inspirace.',
    description: 'Jsi Vizionář (master číslo 11) — mimořádně intuitivní, citlivý/á a inspirativní. Vidíš věci, které ostatní přehlédnou.',
    traits: ['Intuitivní', 'Inspirativní', 'Telepatický', 'Léčivá energie'],
    love: 'Potřebuješ hluboké duchovní spojení. Povrchní vztahy Tě vyčerpávají. Ideální shoda: 2 (Diplomat), 6 (Pečovatel), 9 (Idealista).',
    shadow: 'Příliš vysoká citlivost způsobuje přetížení a zklamání ve vztazích.',
    compatible: [2, 6, 9],
    tier1: [2, 6, 9, 11, 22],
    tier2: [7, 8],
    tier3: [1, 5],
    mirror: "Tvoje životní číslo 11 znamená, že jsi master number — neredukovaný, neutlumený. Neseš v sobě vibraci, kterou většina lidí nezná.\n\nJsi intuitivní téměř až k psychickému. Víš věci, které bys vědět neměl/a. Často jsi snil/a o událostech, které se pak staly. Tvoje vnímání reality je rozšířené — a tato kvalita Tě někdy izoluje.\n\nJsi inspirativní. Když mluvíš o věci, kterou cítíš, lidé poslouchají způsobem, jakým ostatním neposlouchají. Tvoje energie přenáší něco, co se nedá vyjádřit slovy. Někteří lidé Tě po prvním setkání vnímají jako „divného, ale magneticky přitažlivého\“.\n\nTvoje umělecká citlivost je vysoká. Hudba, slova, vizuální výjev — všechno Tě zasáhne hlouběji než průměrný člověk. Tato citlivost je Tvoje superkvalita — a Tvoje nejtěžší zátěž.\n\nJsi vizionář. Vidíš svět, jaký by mohl být — a tato vize Tě nutí pracovat na něm, i když Ti ostatní neuvěří. Mnoho 11 dosáhne svého maxima až po 35–45 letech — Tvoje rozvoj má vlastní rytmus.\n\nV hloubce hledáš partnera, který Tě pochopí v tichosti — slov je málo. Někoho, kdo má pevné nohy v zemi, ale otevřené srdce pro Tvou vizi.",
    shadowExtended: "Nervozita je Tvoje konstantní pozadí. Tvoje vyladění je tak jemné, že každá disonance v okolí Tě bolí. Žiješ s úzkostí, kterou ostatní nevidí — a Tvoje schopnost vypadat v pohodě venku, zatímco vnitřně se třeseš, je pokročilá.\n\nPerfekcionismus Tě paralyzuje. Tvoje představa o tom, jak by věc měla být udělaná, je tak vysoká, že začínáš méně, než bys mohl/a — protože nevěříš, že to splníš ideálně.\n\nÚtěk do fantazie. Když realita zaboli, vracíš se do vlastní hlavy — kde jsi v bezpečí, ale taky sám/sama. Tato schopnost je dar, když ji ovládáš, a vězení, když ovládá ona Tebe.\n\nVyhoření z intenzity. Tvoje schopnost vnímat hlouběji než ostatní znamená, že po dnech v lidské společnosti jsi vyždímaný/á způsobem, který ostatní nechápou. Naučit se pravidelně regenerovat v samotě je nezbytné, ne luxusní.\n\nSebekritika. Tvoje očekávání od sebe sama jsou nelidská. Když nesplníš svoji vizi, místo soucitu se sebou propadáš sebekritice, která Ti bere energii potřebnou k tomu, abys vizi naplnil/a.",
    inLove: "V lásce jsi hluboký/á, intenzivní, někdy příliš. Tvoje schopnost prožít vztah na úrovni, kterou většina lidí nezná, je dar — a zranitelnost. Partneři, kteří Tě nepochopí, Tě nechtěně zraňují.\n\nTvůj ideální partner je někdo s pevnýma nohama. Někdo, kdo umí být klidný, když Ty jsi v turbulenci. Někdo, kdo nepotřebuje Tvoji intenzitu — ale dokáže ji nést, když ji nabídneš.\n\nSex pro Tebe je akt energetické výměny, ne pouhého fyzična. Vnímáš věci, které partner ani neví, že vyzařuje. Když je správný, sex je transcendentní. Když je špatný, je pro Tebe drasticky narušující.\n\nCo si hlídej: spadnout do partnerství s někým „kdo Tě potřebuje opravit\“ nebo „kdo Tě potřebuje zachránit\“. Tvoje citlivost přitahuje lidi, kteří hledají útočiště — a Ty se snadno stane jejich domovem. Skutečně zdravý partner stojí na vlastních nohách. To je všechno.",
    accent: '#9333EA',
  },
  22: {
    name: 'Architekt',
    tagline: 'Mistrovské číslo — stavitel světů.',
    description: 'Jsi Architekt (master číslo 22) — mistrovský stavitel systémů a světů. Máš velké vize a jsi praktický/á.',
    traits: ['Vize plus exekuce', 'Stavitel snů', 'Disciplinovaný lídr', 'Inspirativní'],
    love: 'Potřebuješ partnera, který stojí pevně na zemi, ale dokáže snít s Tebou. Ideální shoda: 4 (Stavitel), 6 (Pečovatel), 8 (Vůdce).',
    shadow: 'Obsese s dokonalostí zanechává osobní vztahy v ústraní. Lekce: dovol sobě i ostatním být nedokonalí.',
    compatible: [4, 6, 8],
    tier1: [4, 6, 11, 33],
    tier2: [9],
    tier3: [3, 5],
    mirror: "Tvoje životní číslo 22 znamená, že jsi master builder — vizionář s pevnýma nohama. Neseš v sobě kombinaci, která se v populaci vyskytuje jen vzácně: schopnost vidět velké a zároveň schopnost ho realizovat.\n\nJsi praktický vizionář. Tam, kde sni snílci ztroskotávají na realitě, Ty vidíš krok za krokem, jak sen postavit. Tvoje schopnost překlenout abstraktní vizi do konkrétních akcí je výjimečná.\n\nJsi disciplinovaný/á. Když máš misi, pracuješ na ní s vytrvalostí, která ostatní vyčerpá při pohledu. Nejde o workaholismus — jde o vědomí, že Tvoje práce má smysl, který přesahuje Tebe.\n\nJsi přirozeně vůdce. Lidé Tě následují ne kvůli charizmatu, ale kvůli kompetenci. Cítí, že víš, co děláš — a v dnešním světě je to vzácné kvality.\n\nTvůj smysl pro dlouhodobou hru. Vidíš věci v horizontech let, ne dnů. Plánuješ na desetiletí dopředu, zatímco ostatní řeší zítřek. Tato perspektiva Ti dává tichou výhodu.\n\nV hluboce hledáš partnera, který sdílí Tvoji potřebu budovat něco trvalého. Někoho, kdo rozumí, že Tvoje práce není únik — je Tvůj způsob lásky. Někoho, kdo dokáže respektovat Tvoji oddanost a zároveň Ti připomínat, že život je víc než mise.",
    shadowExtended: "Vyhoření z velikosti Tvé mise. Tvoje cíle jsou tak velké, že Tě v jejich realizaci spolykají. Zanedbáváš zdraví, intimitu, drobné radosti — vše ve službě cíli, který nikdy úplně nedosáhneš.\n\nPerfekcionismus. Tvoje představa o tom, jak by věc měla vypadat, je tak ostrá, že málokdy přijmeš „dost dobré\“. Toto Ti dlouhodobě bere radost z procesu — vždy jsi nedaleko ideálu.\n\nWorkoholismus jako útěk. Práce Ti dává smysl — a stává se Tvým bezpečím. Když přijdou emocionálně náročné chvíle, místo s nimi sednout, raději zaplníš den úkoly.\n\nNáročnost vůči ostatním. Očekáváš od partnera, dětí, kolegů stejnou intenzitu, jakou máš Ty sám/sama. Ale nikdo nemá Tvoji kapacitu — a Tvoje očekávání lidi vyčerpávají, i když to nevidíš.\n\nInferiorita vůči vlastnímu potenciálu. Tvoje vize je tak velká, že máš pocit, že nikdy nedoženeš to, co bys mohl/a. Tato vnitřní kritika Ti bere radost z toho, co jsi již dokázal/a.",
    inLove: "V lásce jsi pomalý/á na rozhodnutí. Stejně jako u všeho — kdykoli vstupuješ do velkého závazku, hodnotíš dlouhodobě. Když ses rozhodl/a, jdeš naplno, ale dveře se otevírají roky, ne týdny.\n\nTvůj ideální partner je někdo, kdo má vlastní misi. Někdo, kdo rozumí, že práce Tě naplňuje jako modlitba. Někdo, kdo nepotřebuje Tvoji neustálou přítomnost — ale ocení, když ji máš čas věnovat.\n\nSex je pro Tebe akt důvěry a uvolnění. V práci jsi soustředěný/á — sex je pro Tebe místem, kde můžeš pustit kontrolu. Když partner dokáže přijmout Tvoji intenzitu i Tvoji občasnou nepřítomnost, vztah dlouhodobě prospívá.\n\nCo si hlídej: měřit lásku úspěchem mise. Tvůj sklon hodnotit vztah podle toho, jak vám spolu „roste projekt\“, Ti bere radost z lásky pro sebe samou. Učit se prostě být — bez plánování, bez cíle — je Tvoje hlavní lekce.",
    accent: '#1E3A8A',
  },
  33: {
    name: 'Léčitel',
    tagline: 'Mistrovské číslo — léčitel, který soucítí.',
    description: 'Jsi Léčitel (master číslo 33) — ztělesnění soucitu a bezpodmínečné lásky. Tento archetyp má jen 0,3 % populace.',
    traits: ['Bezpodmínečná láska', 'Léčivá přítomnost', 'Hluboká moudrost', 'Inspirativní'],
    love: 'Potřebuješ partnera, který je schopen přijmout hloubku Tvé lásky a opětovat ji. Ideální shoda: 6 (Pečovatel), 9 (Idealista), 11 (Vizionář).',
    shadow: 'Dávání bez hranic vede k úplnému vyčerpání. Životní lekcí je, že pečovat o sebe je také akt lásky.',
    compatible: [6, 9, 11],
    tier1: [6, 9, 11, 22],
    tier2: [2, 3],
    tier3: [5, 8, 1],
    mirror: "Tvoje životní číslo 33 znamená, že jsi master teacher — nesete v sobě jednu z nejvzácnějších numerologických vibrací. Tvoje přítomnost léčí lidi způsobem, který se nedá popsat ani vysvětlit.\n\nJsi bezpodmínečně laskavý/á. Tvoje láska nezná hranice „kdo si zaslouží\“ — dáváš všem, kdo přijdou. Tato kapacita je Tvůj největší dar a Tvoje nejtěžší zátěž.\n\nJsi přirozeně léčící. Lidé v Tvé blízkosti se cítí lépe — nejen emocionálně, ale často i fyzicky. Tvoje vibrace zklidňuje, otevírá, uvolňuje. Vědomě nebo nevědomě jsi pro mnohé doma léčitel/ka.\n\nJsi tvořivý/á v expresivním měřítku. Kombinuješ hloubku 6 (péče) s expresí 3 (kreativita) — Tvoje umění, slova, hudba mají moc proměnit lidi, kteří se s nimi setkají.\n\nTvoje moudrost je hluboká. Lidé Ti chodí pro radu od mládí, protože cítí, že vidíš dál a hlouběji. Neseš v sobě staré duše — věci víš způsobem, který nelze nastudovat.\n\nV hluboce hledáš partnera, s kterým budeš sdílet svou misi laskavosti. Někoho, kdo umí přijímat lásku stejně tak, jako ji rozdávat. Někoho, kdo Tě nevyčerpává, ale doplňuje.",
    shadowExtended: "Martyrdom na kosmické úrovni. Tvoje touha sloužit Tě může pohltit do té míry, že ztrácíš sebe. „Já si nemůžu odpočinout, oni mě potřebují\“ — tato věta Tě v životě stojí roky.\n\nPerfekcionismus moralistický. Tvá očekávání od světa jsou tak vysoká — všichni by měli být laskaví, čestní, soucitní — že realita Tě chronicky zklamává. Místo soucitu se ztrácíš v souzení.\n\nVyhoření až vyprahnutí. Tvoje schopnost dávat je nadprůměrná, ale není nekonečná. Když nepoložíš hranice, vyhoříš způsobem, ze kterého se těžce vrací. Pak se cítíš tak prázdný/á, že Ti nezbývá nic ani pro sebe.\n\nSebekritika. Tvoje vlastní standardy jsou nelidské — a Ty na sebe aplikuješ stejně tvrdě jako na svět. Tvoje výzva: učit se být tak laskavý/á k sobě, jak jsi k ostatním.\n\nSpasitelský komplex. Tvoje touha pomoci se snadno mění v přesvědčení, že víš lépe než druzí. Tato dynamika z Tebe dělá nedostupnou osobu — i když paradoxně toužíš po blízkosti.\n\nLidé Tě využijí. Tvoje neschopnost říkat ne přitahuje Ty, kdo si nikdy nezasloužili Tvoji péči. Naučit se rozeznat skutečnou potřebu od manipulace je Tvoje hlavní lekce.",
    inLove: "V lásce jsi velkorysý/á po sebevzdání. Tvoje schopnost milovat je téměř transcendentní — a tady leží i Tvoje největší zranitelnost. Lidé, kteří Tě milují, se učí přijímat lásku, kterou si neumějí oplatit. Lidé, kteří Tě nemilují, Tě využívají.\n\nTvůj ideální partner je někdo, kdo umí přijímat lásku stejně bohatě, jako ji dávat. Někoho, kdo má vlastní misi a nepotřebuje Tě zachránit. Někdo, kdo umí říct: „dnes pečuj o sebe, já se postarám o všechno\“.\n\nSex je pro Tebe akt léčení — pro sebe i pro partnera. Tvoje schopnost být plně přítomný/á v intimní chvíli léčí způsobem, kterému partner často nerozumí. Když najdeš partnera, který Tě umí přijmout celou, sex se stává sakrálním aktem.\n\nCo si hlídej: rozpustit se v partnerovi. Tvoje touha sloužit Ti může ukrást Tvoji identitu. Kdo jsi, když nepomáháš? Tato otázka je Tvoje hlavní zralostní práce. Skutečně zdravý vztah znamená, že máš vlastní život vedle života partnerova — ne místo něj.",
    accent: '#BE1B5E',
  },
}

// ──────────────────────────────────────────────
// Magic Moment — partnership-focused věty pro /register reveal
// (zkrácené, optimalizované pro emocionální dopad)
// ──────────────────────────────────────────────
export const MAGIC_MOMENT_PARTNER_LINE: Record<number, string> = {
  1: 'Hledáme pro Tebe partnera, který Tě bude respektovat, ne řídit.',
  2: 'Hledáme pro Tebe někoho klidného, kdo ocení Tvou citlivost a hloubku.',
  3: 'Hledáme pro Tebe partnera, který Tě bude obdivovat a dá Ti prostor zářit.',
  4: 'Hledáme pro Tebe někoho, kdo sdílí Tvé hodnoty a bude s tebou budovat budoucnost krok za krokem.',
  5: 'Hledáme pro Tebe partnera, který Tě drží za ruku, ale ne za krk.',
  6: 'Hledáme pro Tebe někoho, kdo umí přijímat lásku stejně hluboce, jako ji dávat.',
  7: 'Hledáme pro Tebe partnera, který respektuje Tvou potřebu hloubky a samoty.',
  8: 'Hledáme pro Tebe partnera, který sdílí Tvé ambice, ale není jimi pohlcen.',
  9: 'Hledáme pro Tebe někoho, s kým budeš sdílet svou vizi většího smyslu.',
  11: 'Hledáme pro Tebe partnera, který dokáže nést Tvou intenzitu a zároveň Ti pomáhá zůstat ukotvený/á.',
  22: 'Hledáme pro Tebe partnera, který sdílí Tvou potřebu budovat něco trvalého — z pevné země.',
  33: 'Hledáme pro Tebe partnera, který ocení Tvou bezpodmínečnou laskavost a nebude ji vyčerpávat.',
}

// ──────────────────────────────────────────────
// Zdroje numerologie — citace pro /jak-funguje + /zdroje stránku
// ──────────────────────────────────────────────
export const ARCHETYPE_SOURCES = [
  {
    author: 'Pythagoras',
    era: '~500 př. n. l.',
    role: 'Původce západní (pythagorovské) numerologie. Základní princip: čísla jako vyjádření kosmického řádu. (Současná „pythagorovská" numerologie je rekonstrukce 19.–20. století; viz Burkert, Lore and Science in Ancient Pythagoreanism, Harvard 1972.)',
  },
  {
    author: 'Cheiro (William J. Warner)',
    work: 'Cheiro\'s Book of Numbers (Herbert Jenkins, 1926)',
    role: 'Definoval chaldejský systém přiřazení čísel písmenům a první pravidla shody/neshody mezi čísly — historický kořen kompatibilní numerologie.',
  },
  {
    author: 'Florence Campbell',
    work: 'Your Days Are Numbered (1931, reedice DeVorss)',
    role: 'První moderní textbook západní numerologie. Žačka L. Dow Balliett, propojila New Thought s číselným systémem 20. století.',
  },
  {
    author: 'Juno Jordan',
    work: 'Numerology: The Romance in Your Name (DeVorss, 1965)',
    role: 'Historická klasika numerologie aplikované specificky na vztahy a romantiku. Dcera Julie Seton, žačka L. Dow Balliett — přímý lineage od raného 20. století.',
  },
  {
    author: 'Matthew Oliver Goodwin',
    work: 'Numerology: The Complete Guide, Vol. 1 + 2 (Newcastle, 1981)',
    role: 'Nejrigoróznější textbook americké numerologie poloviny století. Tradiční systém (master 11 a 22), striktní Three-Cycle pro 33.',
  },
  {
    author: 'Dan Millman',
    work: 'The Life You Were Born to Live (HJ Kramer, 1993; CZ: Čísla života, Eminent 2003, reissue Martinus 2017)',
    role: 'Life-purpose framing. Definuje populární „životní číslo" framework se sekcemi o skryté dynamice vztahů pro každou cestu.',
  },
  {
    author: 'Gary Goldschneider + Joost Elffers',
    work: 'The Secret Language of Birthdays (Penguin Studio, 1994)',
    role: 'Pop-culture „personology" framework založený na pozorování 14 000 osob. Inspirace pro celkové pojetí archetypu v Cosmatch.',
  },
  {
    author: 'Saffi Crawford + Geraldine Sullivan',
    work: 'The Power of Birthdays, Stars & Numbers (Ballantine, 1998; CZ: Magická hra čísel a hvězd, Ikar 2002)',
    role: 'Encyklopedický 366-denní referenční průvodce kombinující astrologii, fixní hvězdy a numerologii. Jedna z klíčových amerických referenčních prací pro osobnostní profil podle dne narození.',
  },
  {
    author: 'Helmut-Whitey Kritzinger',
    work: 'Partnerství a numerologie (Pragma, 1999, český překlad)',
    role: 'Německy psaná kniha hermetické numerologie, vydaná v Pragma jako jeden z hlavních česky dostupných titulů o partnerské numerologii. „Numeroskop" založený na datech narození obou partnerů.',
  },
  {
    author: 'Hans Decoz',
    work: 'Numerology: Key to Your Inner Self (Perigee/Tarcher, 2001)',
    role: 'Moderní západní standard. Cosmatch používá jeho Three-Cycle Method pro výpočet životního čísla — redukujeme měsíc, den, rok zvlášť, master čísla 11/22/33 zachováváme v mezikroku.',
  },
  {
    author: 'Jitka Kadlecová',
    work: 'Datum narození a jeho vliv na náš charakter (Eminent, 2006)',
    role: 'Hlavní česká numerologická tradice 21. století. Inspirace pro lokalizaci archetypů do české kultury a jazyka.',
  },
  {
    author: 'Glynis McCants',
    work: 'Love by the Numbers (Sourcebooks Casablanca, 2010)',
    role: 'Současný mainstream love-by-the-numbers standard. Tři tiery vztahové kompatibility (Natural Match / Compatible / Toxic) — Cosmatch je adaptoval do českých kategorií Spřízněné duše, Prospěšný vztah a Magnetická tenze.',
  },
  {
    author: 'Ester Davidová',
    work: 'Partnerská osudová čísla — Jak na vztahy? (self-published, 2020)',
    role: 'Současný český autorský hlas v partnerské numerologii. Definuje 9 „partnerských osudových čísel" jako součet životních čísel obou partnerů — model blízký Cosmatch kategoriím kompatibility.',
  },
  {
    author: 'Michelle Buchanan',
    work: 'The Numerology Guidebook (Hay House, 2013)',
    role: 'Současný mainstream. Explicitní kapitoly o výběru partnera, timingu vztahů a master číslech 11/22/33.',
  },
]

// ──────────────────────────────────────────────
// Barnum/Forer disclosure — citováno v Magic Moment a /jak-funguje
// ──────────────────────────────────────────────
export const BARNUM_DISCLOSURE = `Část pocitu „tohle sedí přesně!“ je psychologický efekt zvaný Barnumův efekt (objevený Bertramem Forerem v roce 1949 — 39 studentů ohodnotilo identický popis 4.26 z 5.0 jako „přesně mě“). To neznamená, že je numerologie zbytečná — funguje jako nástroj sebereflexe a konverzace s partnerem, ne jako věštba.`
