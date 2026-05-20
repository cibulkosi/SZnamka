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
    mirror: "Tvoje životní číslo 1 znamená, že jsi přišel/přišla na svět začít. Něco vlastního. Něco, co tu předtím nebylo.\n\nMáš v sobě iniciativu, kterou ostatní hledají. Když vstoupíš do prostoru, atmosféra se mění — buď tě následují, nebo se ti vyhnou. Obojí je v pořádku. Tvoje role je vést, ne se přizpůsobovat. Tvoje energie je sluneční: jasná, přímá, generativní.\n\nJsi originální. Tam, kde ostatní vidí pravidla, ty vidíš příležitost je přepsat. Pracuješ nejlíp, když máš kontrolu nad cestou — ne proto, že bys byl panovačný, ale protože tvoje vize potřebuje prostor, aby dýchala. V týmu jsi přirozený lídr; sám se sebou jsi neúnavný motor. Naučil/a ses spoléhat na sebe brzy — možná dřív, než bylo zdrávo.\n\nTvoje největší síla není v inteligenci ani v charizmatu, byť obojí máš. Je v tom, že nedokážeš pasivně čekat. Když něco nefunguje, začneš to měnit — bez svolení, bez plánu, bez záruky. Tahle vlastnost ti otevírá dveře, ke kterým by ostatní ani nepřišli.\n\nJsi tvořivý. Tvůj mozek pracuje nestandardně: vidíš souvislosti, které ostatním unikají. To z tebe dělá inovátora — ale taky někoho, kdo se občas cítí osamělý ve svém vidění světa. Lidé okolo tě obdivují, ale ne vždy ti rozumí. To tě bolí víc, než přiznáváš.\n\nV hloubce duše hledáš respekt. Ne obdiv — ten je laciný — ale skutečný respekt rovného partnera, který tě vidí celého a stále se rozhodne stát po tvém boku.",
    shadowExtended: "Pyšný jsi víc, než si přiznáváš. Tvoje nezávislost má tmavou stranu: izolaci. Když věci nejdou podle tebe, máš sklony stáhnout se a vyřešit to sám, místo abys požádal o pomoc. Tím ztrácíš spojence — lidi, kteří by ti rádi pomohli, ale ty je k tomu nepustíš.\n\nSoutěživost tě může pohánět, ale taky ničit. Vidíš ostatní jako překážky, ne jako zdroje. Když někdo dosáhne něčeho podobného jako ty, místo radosti cítíš nelibost. To je signál, ne charakter — můžeš s tím pracovat.\n\nDomáhání se uznání je tvůj zranitelný bod. Když nejsi viděn/a, máš tendenci to brát osobně — i když nikdo nic neudělal. Workaholismus je tvoje obvyklá obrana: pracuješ, abys něco dokázal/a, ne protože tě to baví.\n\nV konfliktu jsi rychlý/á. Příliš rychlý/á. Než pochopíš, že druhá strana měla jen jiný pohled, už jsi reagoval/a — a poškodil/a vztah, který sis přitom přál/a chránit. Naučit se zpomalit je tvůj nejdůležitější dlouhodobý úkol.",
    inLove: "V lásce jsi paradoxní. Toužíš po hluboké blízkosti, ale nesneseš pocit, že tě někdo „vlastní\". Hledáš partnera, který má svůj vlastní svět — kariéru, vášně, přátele — protože jen takový tě nebude vysávat.\n\nSpadneš do lásky rychle. Jakmile se rozhodneš, jdeš naplno. Ale pokud druhá strana zaváhá nebo se zachová nedůstojně, jsi schopen/schopna ji okamžitě vyškrtnout — a pak toho dlouho litovat.\n\nTvůj ideální partner není ten, kdo tě obdivuje. Je to ten, kdo tě nebere jako samozřejmost a dokáže ti říct ne. Slabé partnery jsi dřív nebo později opustil/a; silnější tě donutí růst — a to je, paradoxně, co potřebuješ víc než obdiv.\n\nCo si hlídej: tendenci kontrolovat, kdy se vidíme, jak komunikujeme, kam vztah směřuje. Tvoje touha vést se v partnerství snadno změní v dominanci. Skutečná zralost znamená vědět, kdy ustoupit a nechat druhého rozhodnout.",
    accent: '#C2410C',
  },
  2: {
    name: 'Diplomat',
    tagline: 'Empatický, intuitivní, partnerský.',
    description: 'Jsi empatický, intuitivní a orientovaný na vztahy. Cítíš ostatní hlouběji než oni sami sebe. V lásce hledáš skutečnou duševní spřízněnost.',
    traits: ['Empatický', 'Intuitivní', 'Laskavý', 'Harmonický'],
    love: 'Potřebuješ jistotu a hlubší spojení. Nejlépe se párujete s někým klidným a spolehlivým, kdo oceňuje tvou citlivost.',
    shadow: 'Přílišná potřeba harmonie může vést k potlačování vlastních potřeb.',
    compatible: [4, 6, 8],
    tier1: [4, 6, 8, 9],
    tier2: [11],
    tier3: [1, 5, 7],
    mirror: "Tvoje životní číslo 2 znamená, že jsi přišel/přišla pro vztah. Ne kvůli jednomu člověku — vztah je tvůj nástroj poznání. Skrz druhé poznáváš sebe; skrz sebe ostatním pomáháš poznat sebe.\n\nJsi nesmírně citlivý/á. Cítíš věci, které ostatní ani nezaregistrují: tichá tenze v místnosti, nevyřčená bolest přítele, drobná změna nálady partnera. Tato citlivost je tvoje největší dárek i tvoje největší zátěž — záleží na tom, jak s ní zacházíš.\n\nJsi diplomatický/á. Tvoje schopnost vyjednávat, sladit pohledy, najít kompromis — to je výjimečné. V týmu jsi často tichý/á most mezi lidmi, kteří by si jinak neporozuměli. Vidíš, kdo potřebuje co, a umíš to bez ozdob doručit.\n\nTvá inteligence je intuitivní spíše než analytická. Víš věci dřív, než víš proč. Tato schopnost tě v životě vede dobře — pokud jí důvěřuješ. Když ji potlačíš ve prospěch logiky, ztrácíš se.\n\nV hluboce se nachází tvá síla měsíční energie: schopnost reflektovat, jemně, ale neústupně. Nejsi slabý/á — jsi pružný/á. To je něco zásadně jiného.",
    shadowExtended: "Tvoje největší slabost je sklon mizet. Sebe sama. Když vztah začne být náročný, namísto vyjádření vlastních potřeb se přizpůsobíš tomu druhému — a sledí už tě jen mlha.\n\nKonfliktu se vyhýbáš. Pociťuješ ho jako fyzickou bolest. Ale toto vyhýbání vede k tichému zatrpknutí — slovo, které není vysloveno, sedí v tobě roky. Pak vybuchne ve špatný moment, nad nepatrnou maličkostí, a partner tě nepoznává.\n\nJsi nadprůměrně senzitivní na kritiku. Co měla být drobná poznámka, žije v tobě týdny. Lidé okolo se neumějí přiblížit, protože i s nejlepšími úmysly tě omylem zraňují.\n\nMáš tendenci absorbovat emoce druhých, jako by byly tvoje. Po dni s lidmi jsi vyčerpaný/á, aniž bys udělal/a něco fyzicky náročného. Učit se rozlišovat, kde končíš ty a začíná druhý, je tvůj celoživotní úkol.",
    inLove: "V lásce hledáš hloubku. Povrchní flirt tě nudí; chceš spojení, které trvá. Jsi loajální až k vlastní škodě a od partnera očekáváš totéž — i když to neřekneš nahlas.\n\nTvůj ideální partner je klidný a spolehlivý. Někdo, kdo nepotřebuje drama, aby cítil lásku. Někdo, kdo umí vyjadřovat city verbálně — nejsi telepat, i když to občas budí dojem.\n\nJsi senzuální. Tvoje láska je hmatatelná: dotek, vůně, jídlo, gesto. Sex pro tebe není výkon, je to forma komunikace. Když partner neumí tělesný jazyk, cítíš se neviděn/a.\n\nCo si hlídej: ztrácení se v partnerovi. Tvoje schopnost vcítit se může vést k tomu, že žiješ jeho život místo svého. Mít vlastní přátele, vlastní koníčky, vlastní cíle — to není ohrožení vztahu. To je to, co tě udrží zajímavým/ou.",
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
    mirror: "Tvoje životní číslo 3 znamená, že jsi přišel/přišla vyjadřovat. Slova, obrazy, hudbu, příběhy — jakýkoli kanál ti sedí, ale vyjadřovat se musíš. Jinak zhasneš.\n\nMáš v sobě jiskru, kterou ostatní hledají v alkoholu, drogách nebo na koncertech. Tvoje přirozená radost ze života je nakažlivá — když vejdeš do místnosti, atmosféra se zlehka zvedne. Tvoje schopnost vidět humor v běžných situacích léčí lidi okolo víc, než si uvědomuješ.\n\nJsi tvořivý/á. Tvořivost není pro tebe hobby; je to tvůj operační systém. I obyčejnou snídani umíš zaranžovat tak, aby z toho byl zážitek. Tvůj smysl pro detail v estetice je výjimečný.\n\nJsi sociální génius. Pamatuješ si lidi, pamatuješ si detaily, dokážeš se cítit doma kdekoli. Tato schopnost ti otevírá dveře — a víc dveří otevíráš ostatním, kteří jsou ti vděční.\n\nTvoje hlavní výzva je důslednost. Talent máš — ale talent bez disciplíny zůstane potenciálem. Když se ti podaří spojit tvořivost s pravidelnou prací, dosáhneš věcí, které vypadají magicky.\n\nV hloubce hledáš někoho, kdo tě bude obdivovat, ale kdo se ti zároveň postaví. Obdiv tě nakopne, výzva tě udrží.",
    shadowExtended: "Roztříštěnost je tvůj démon. Začínáš deset projektů, dokončíš dva. Tvůj entuziasmus pro nové věci je nezadržitelný — a v okamžiku, kdy se z té nové věci stane „obyčejná práce\", ztrácíš zájem.\n\nCitově jsi proměnlivý/á. Vysoké vrcholy, hluboké propady. Stejný den dokážeš být euforický a depresivní, aniž bys věděl/a proč. To pro partnery, kteří potřebují stabilitu, není snadné nést.\n\nMáš sklony k povrchnosti, když se necítíš bezpečně. Místo abys řekl/a, co tě bolí, naředíš to vtipem. Místo abys čelil/a obtížnému rozhovoru, prchne do humoru nebo do nové sociální aktivity. Lidé okolo to vidí, i když si myslíš, že ne.\n\nKritika tě paralyzuje. Tvoje sebehodnocení je víc závislé na potleskvání ostatních, než si přiznáváš. Když jeden kritik zaútočí, deset chválících hlasů zaniká.",
    inLove: "V lásce jsi rychlý/á zamilovat se. Tvoje srdce je otevřené, tvoje představivost rozdmýchávat romance. Často zamilovaný/á jsi víc do ideje vztahu než do skutečného člověka — což funguje v prvních týdnech, ale začne to skřípat ve měsíci čtvrtém.\n\nTvůj ideální partner je někdo, kdo má vlastní jiskru — někdo, kdo umí být intelektuálně i emocionálně dynamický. Tichý partner, který „si chce jen odpočinout doma\", tě bude pomalu udušovat.\n\nSex je pro tebe forma komunikace a hravosti. Potřebuješ partnera, který umí být v posteli kreativní a nevidí intimitu jako mechanický akt. Když je sex monotónní, ztrácíš zájem rychle.\n\nCo si hlídej: tendenci uniknout, když věci přitvrdí. Hluboký vztah neznamená neustálé vrcholy — naopak, klidné fáze jsou důkazem zdraví, ne nudy. Učit se zůstat, když srdce zatouží odejít, je tvoje hlavní zralostní lekce.",
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
    mirror: "Tvoje životní číslo 4 znamená, že jsi přišel/přišla budovat. Trvalé věci. Ne ohňostroje — chrámy.\n\nJsi solidní. Když řekneš, že něco uděláš, uděláš to. Tvoje slovo má váhu. V době, kdy slovo nestojí za nic, jsi pevný bod, na který se dá spoléhat — a tato kvalita je vzácnější, než si myslíš.\n\nPracuješ. Tvoje schopnost vytrvat tam, kde ostatní vzdají, je nadprůměrná. Disciplína ti nepřijde jako trápení, je to tvůj přirozený režim. Když máš jasný cíl, propracuješ se k němu krok za krokem — a po cestě postavíš věci, na které budou ostatní vzpomínat dlouho.\n\nJsi logický/á. Tam, kde ostatní propadají emocím, ty vidíš strukturu. Tvá racionalita je tvoje superkvalita — pomáhá ti řešit problémy, které ostatní jen probrečí.\n\nTvůj smysl pro spravedlnost je vysoký. Nesnášíš nepoctivost, lži, krádeže — ve velkém i v malém. Lidé kolem tebe to vědí a obvykle k tobě chovají hluboký respekt, i když to neukazují.\n\nV hluboce hledáš jistotu. Domov, který vypadá stejně, ráno co ráno. Partnera, který je ráno tam, kde byl večer. Tato touha po stabilitě je tvoje největší síla a tvoje největší slabost.",
    shadowExtended: "Rigidita je tvůj démon. Jakmile si nastavíš způsob, jak věci dělat, je téměř nemožné tě přesvědčit, aby ses změnil/a. To, co bylo včera ctnost, dnes brzdí.\n\nWorkoholismus tě nutí cítit se užitečný/á. Ale spojuješ vlastní hodnotu s produktivitou — když jeden den nic neuděláš, cítíš se prázdný/á. Toto je past: práce nikdy neskončí, ale tvůj život ano.\n\nEmocionálně jsi opatrný/á. Místo aby ses otevřel/a, používáš spolehlivost jako zeď. Partner ví, že tě vidí — ale neví, jak je ti uvnitř. „Já jsem v pohodě\" je tvoje obvyklá odpověď i v okamžicích, kdy nejsi.\n\nKritičnost je tvoje rezervní obrana. Když se cítíš nejistý/á, začneš najít chyby u druhých. Tvoje vysoké standardy mají tendenci stát se nedosažitelnými — a partnerství se mění v audit.",
    inLove: "V lásce jsi pomalý/á na rozhodnutí. Nepoužíváš slovo „miluju\" zbrkle. Když ho vyslovíš, znamená to. Tvoje láska se měří v drobných každodenních činech, ne v romantických gestech.\n\nTvůj ideální partner je někdo, kdo sdílí tvé hodnoty — věrnost, pravdivost, schopnost budovat. Někdo, kdo nepotřebuje neustálé novinky, aby cítil lásku. Někdo, kdo umí ocenit, že stejný oběd v neděli je důkaz, ne nuda.\n\nSex pro tebe je o důvěře. Není to performance, není to dobrodružství — je to akt, kterým partnera pustíš nejhlouběji. Proto sex s nesprávným partnerem je pro tebe traumatičtější než pro většinu lidí.\n\nCo si hlídej: zaměňování spolehlivosti za přítomnost. Být tam fyzicky a být tam emocionálně jsou dvě různé věci. Partner potřebuje obojí. Naučit se vyjadřovat city verbálně — i když ti to zní cize — je tvoje nejdůležitější dlouhodobá práce.",
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
    mirror: "Tvoje životní číslo 5 znamená, že jsi přišel/přišla žít. Plnohodnotně. Nudíš se v krabičkách, kazíš se v rutině, ožíváš v pohybu.\n\nJsi svobodný duch. Pět smyslů máš zostřené — barvy vidíš jasněji, hudbu cítíš pod kůží, jídlo chutná víc, vůně dokáže přepsat tvůj den. Tvoje životní zkušenost je intenzivnější než průměrná, a tato intenzita tě nutí jít dál.\n\nJsi adaptabilní. Hodíš tě do nového města, nového zaměstnání, nové kultury — a za týden funguješ. Tvoje schopnost se rychle učit a přizpůsobit je výjimečná. V chaosu jsi doma — kde ostatní propadají panice, ty vidíš příležitost.\n\nJsi charismatický/á. Lidé tě poslouchají, lidé tě následují, lidé si tě pamatují. Tvoje slovo má váhu nejen proto, co říkáš, ale jak to říkáš. Mohl/a by ses živit prodejem čehokoli — protože dokážeš lidi nadchnout.\n\nTvoje zvědavost je tvůj motor. Bavíš se otázkami víc než odpověďmi. Tvůj mozek je sklad nesourodých informací — a v nečekané chvíli z toho vytahuješ moudrost, která ostatní ohromuje.\n\nV hloubce hledáš někoho, kdo s tebou bude utíkat — ale nemusí tě držet za ruku každou minutu. Hledáš nezávislého rovného, ne strážce.",
    shadowExtended: "Závazku se bojíš víc, než říkáš. Tvoje „potřebuju prostor\" může být skrytý úprk před hloubkou. Pokaždé když se blíží reálná intimita, najdeš důvod odjet — geograficky, emocionálně, nebo do nového projektu.\n\nImpulzivnost tě dostává do problémů. Rozhodnutí, která uděláš v okamžiku entuziasmu, později žereš. Auto, byt, vztah, kariéra — všechno jsi se rozhodl/a rychle a pak jsi to revidoval/a, často za vysokou cenu.\n\nSklony k závislostem — alkohol, drogy, jídlo, sex, nakupování — máš silnější než průměrný člověk. Tvoje touha po intenzitě tě může vést k tomu, že hledáš zkratky k pocitům, které by si zasloužily čas.\n\nSlíbil/a jsi věci, které jsi nedodržel/a. Ne ze špatnosti — v okamžiku slibování jsi to myslel/a vážně. Ale když přišel čas plnit, byl/a jsi už jinde mentálně. Lidé okolo se postupně učí, že tvá slova nemusí znamenat činy.",
    inLove: "V lásce jsi rozporuplný/á. Toužíš po hluboké blízkosti, ale když ji máš, panikaříš. Tvůj vzorec: zamilovat se rychle, pak couvnout, pak chybět, pak se vrátit. Pro partnery, kteří potřebují stabilitu, jsi nesnesitelný/á.\n\nTvůj ideální partner je nezávislý sám o sobě. Někdo, kdo nemá strach, že odejdeš — protože ví, že má vlastní svět. Někdo, kdo dokáže říct: „jasně, jeď, uvidíme se za týden\" — a tato klidnost tě paradoxně přiváže silněji než vyžadování.\n\nSex je pro tebe dobrodružství. Nudíš se, když je předvídatelný. Hledáš partnera, který sdílí tvoji hravost a chuť experimentovat — emocionálně i fyzicky.\n\nCo si hlídej: opustit lidi předtím, než se k tobě stihnou přiblížit. Tvoje strach z pasti tě vede k tomu, že vytváříš pasti sám/sama. Učit se zůstat, když srdce chce utéct, je tvoje hlavní úloha. Hluboký vztah neznamená ztrátu svobody — naopak, je to bezpečí, ve kterém můžeš být svobodný/á víc než kdy předtím.",
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
    mirror: "Tvoje životní číslo 6 znamená, že jsi přišel/přišla milovat. Ne romanticky — to je jen jedna forma. Tvoje láska je gravitační síla, která drží dohromady rodiny, komunity, přátelství.\n\nJsi pečující bez vypočítavosti. Když vidíš někoho v nouzi, automaticky pomáháš — i když by se to nikdo nikdy nedozvěděl. Tato vlastnost není pózou; je to tvůj přirozený režim. Lidé okolo tebe to cítí a vracejí se ke tobě v krizích.\n\nJsi zodpovědný/á. Nebudeš utíkat, když to začne být těžké. Tvůj smysl pro povinnost je hluboký a neúplatný — partneři, děti, rodiče, přátelé — staráš se o všechny, kdo jsou ti svěřeni.\n\nTvůj estetický cit je vysoký. Domov, který stavíš, je krásný — ne proto, že máš peníze na designéra, ale protože vidíš krásu v drobnostech. Šálek na správném místě, květina ve vázě, světlo v rohu místnosti.\n\nVyzařuješ stabilitu. Lidé v tvé blízkosti se cítí v bezpečí. Tvoje přítomnost je léčivá — a tato schopnost není získaná, je vrozená.\n\nV hloubce hledáš někoho, kdo umí přijímat lásku stejně dobře, jako ji dávat. Někoho, kdo nevyužívá tvé štědrosti — ale opětuje ji.",
    shadowExtended: "Martyrdom je tvůj démon. Dáváš až k vyčerpání — a pak se cítíš opuštěný/á, protože nikdo nedává tolik tobě. Ale málokdo to dělat může: nikdo nemá tvoji kapacitu. Naučit se přijímat — i když to znamená nejdřív požádat — je tvoje největší růstová lekce.\n\nKontrola pod rouškou péče. „Já vím, co je pro tebe nejlepší\" je věta, kterou pronášíš častěji, než si přiznáváš. Tvoje touha pomáhat se snadno změní v touhu řídit — a partneři, děti, přátelé se vzdalují, i když ty se snažíš víc.\n\nSkóre vedeš. Tvrdíš, že nevedeš — ale pamatuješ si přesně, co jsi dal/a a co jsi dostal/a. Když přijde nerovnováha, místo přímého rozhovoru začneš tiše trpět. To je toxickější než hádka.\n\nVolíš partnery, kteří potřebují tvoji péči. „On/ona mě potřebuje\" je tvoje skrytá motivace — a vede tě do vztahů, kde jsi pečovatel/ka, ne partner/ka. Skutečně rovný vztah, kde tě někdo umí postavit, je výjimečně náročný/á pro tebe — ale je to to, co potřebuješ.",
    inLove: "V lásce jsi domov. Pro partnera jsi bezpečný přístav, kam se vrací po dlouhém dni. Vaříš, pamatuješ si výročí, řešíš logistiku — všechno to drobné, co tvoří partnerství pohodlným.\n\nTvůj ideální partner je někdo, kdo umí ocenit, co dáváš — ne brát to jako samozřejmost. Někdo, kdo vrátí tvoji péči — nemusí stejnou měrou, ale viditelně. Sex pro tebe je akt důvěry a intimity, ne sport.\n\nTvá sexualita je velkorysá. Dokážeš dát partnerovi přesně to, co potřebuje, ale máš tendenci podceňovat vlastní touhy. Naučit se říkat „já chci tohle\" je revoluce, kterou ti partneři vděčně přijmou.\n\nCo si hlídej: volit partnery, kteří potřebují záchranu. Tvoje schopnost vidět něčí potenciál se mísí s touhou ho rozvíjet. Skutečně zdravý partner je ten, který tě nepotřebuje, ale chce. Tato distinkce je všechno.",
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
    mirror: "Tvoje životní číslo 7 znamená, že jsi přišel/přišla pochopit. Hloubku, kterou ostatní neslyší. Smysl, který se skrývá pod povrchem.\n\nJsi přirozeně analytický/á. Tvůj mozek nepřijímá věci tak, jak jsou — okamžitě je rozebírá. Hledáš vzorce, kauzality, hlubší vrstvy. To, co ostatním přijde jako mystické tušení, ty máš jako strukturu — i když ji ostatním neumíš vždy vysvětlit.\n\nJsi spirituální v širokém smyslu. Nemusíš být náboženský/á, ale tvoje vnímání světa zahrnuje to, co se nedá změřit. Cítíš věci, kterým ostatní nevěří, dokud se nestanou.\n\nTvoje samota není slabost — je tvůj zdroj. Když ostatní načerpávají energii ze společnosti, ty ji ztrácíš. Hodina sám/sama s knihou, procházkou, nebo prostě v tichu ti dá víc než víkend večírků.\n\nJsi nezávislý/á myslitel/ka. Konvenční odpovědi tě nezajímají. Když ti někdo řekne „takhle se to dělá\", tvoje první otázka je „a proč?\" Tato vlastnost tě izoluje, ale taky vede k objevům, ke kterým by ostatní nedošli.\n\nV hluboce hledáš partnera, který respektuje tvoji potřebu prostoru — a nechápe ji jako odmítnutí. Někoho, kdo sám sebe živí, nepotřebuje tě jako jediný zdroj smyslu.",
    shadowExtended: "Izolace ti přijde pohodlnější než nepohodlí intimity. Když věci ve vztahu začnou být náročné, místo abys řekl/a, co tě bolí, stáhneš se. „Potřebuju prostor\" je tvoje obrana — a partner to slyší jako odmítnutí, i když to tak nemyslíš.\n\nIntelektuální nadřazenost je tvé skryté pokušení. Cítíš se moudřejší než ostatní — a často právem — ale toto vědomí vytváří distanc, který nikdo, ani ty sám/sama, nedokáže překonat.\n\nCynismus tě může zničit. Tvoje analytická schopnost vidět pod povrchem se může zvrhnout v očekávání toho nejhoršího. Naučit se vidět dobré v lidech, aniž bys ztratil/a skepsi, je tvoje nejtěžší práce.\n\nEmocionálně jsi rezervovaný/á. Ne proto, že necítíš — cítíš víc než ostatní — ale protože nevíš, jak to bezpečně sdělit. Partneři tě obviňují ze studenosti, ale to není pravda; tobě jen chybí jazyk.\n\nTajnůstkářství je tvůj zlozvyk. Nesdílíš věci, které by sis měl/a sdílet, protože „je to moje\". Tato uzavřenost ti dlouhodobě brání budovat hluboké vztahy, po kterých přitom toužíš.",
    inLove: "V lásce jsi pomalý/á, opatrný/á, hluboký/á. Když se otevřeš, otevřeš se naplno — ale dveře se otevírají roky, ne týdny. Partner musí mít trpělivost.\n\nTvůj ideální partner je někdo, kdo má vlastní vnitřní svět. Někdo, kdo umí být zticha v jednom pokoji s tebou a oba pracujete na svém. Někdo, kdo neinterpretuje tvoji potřebu samoty jako problém, ale jako tvoji povahu.\n\nSex pro tebe je akt hluboké blízkosti, ne výkon. Když se otevřeš tělesně, otevíráš se duševně. Proto sex s nesprávným partnerem je pro tebe extrémně narušující — cítíš se zranitelně způsobem, který je těžké vysvětlit.\n\nCo si hlídej: používat „potřebuju prostor\" jako útěk před intimitou. Někdy tu potřebu skutečně máš — ale někdy je to obranný mechanismus před něčím, co tě v partnerství zraňuje. Učit se rozlišovat mezi oběma stavy je tvoje hlavní zralostní práce.",
    accent: '#1E40AF',
  },
  8: {
    name: 'Vůdce',
    tagline: 'Strategický, autoritativní, výkonný.',
    description: 'Jsi strategický, autoritativní a výkonný. Vytváříš svět kolem sebe, ne v něm. V lásce potřebuješ partnera, který sdílí tvé ambice, ale není jimi pohlcen.',
    traits: ['Strategický', 'Autoritativní', 'Velkorysý', 'Disciplinovaný'],
    love: 'Potřebuješ partnera, který tě respektuje a má vlastní cíle. Nejlépe se párujete s někým, kdo umí ocenit tvou sílu i zranitelnost.',
    shadow: 'Workoholismus a vnímání lásky jako transakce může vyprázdnit vztah.',
    compatible: [2, 4, 6],
    tier1: [2, 4, 6],
    tier2: [5, 11],
    tier3: [1, 3, 5, 9, 11],
    mirror: "Tvoje životní číslo 8 znamená, že jsi přišel/přišla vést, ovlivňovat, vytvářet vliv. Není to o egu — je to o schopnosti měnit svět kolem sebe.\n\nJsi strategický/á. Vidíš tahy, které ostatní nevidí. Kde ostatní vidí dnešek, ty vidíš pět tahů dopředu. Tato schopnost ti dává nepřirozenou výhodu — a zodpovědnost ji používat moudře.\n\nJsi výkonný/á. Když přijdeš na úkol, dokončíš ho. Tvoje pracovní etika je nadprůměrná, tvoje schopnost nést tlak výjimečná. Lidé tě hledají v krizích, protože vědí, že nezakolísáš.\n\nJsi velkorysý/á. Když máš, dáváš — partnerům, rodině, přátelům, kolegům. Tvoje peněženka se otevírá snadno, protože víš, že peníze jsou nástroj, ne cíl. Tato velkorysost je jedna z tvých nejméně viděných ctností.\n\nTvá autorita je přirozená. Ne dominantní — autoritativní. Lidé tě poslouchají, protože cítí, že víš, co děláš. Když ses naučil/a tuto autoritu vyvažovat s pokorou, jsi nezastavitelný/á.\n\nV hluboce hledáš partnera, který respektuje tvoji sílu, ale nebojí se ti říct, když děláš chybu. Někoho, kdo má vlastní vnitřní svět a nedělá z tebe svůj projekt.",
    shadowExtended: "Kontrolu jsi se naučil/a brzy. Možná dřív, než bylo zdrávo. Naučil/a ses, že když máš věci pod kontrolou, nic se nemůže rozpadnout. Ale toto naučení tě vede k tomu, že nedáváš věcem prostor — partnerství, dětem, kreativitě — aby se vyvíjely svým způsobem.\n\nMaterialismus je tvoje skrytá past. Materiální úspěch ti dává pocit hodnoty — a když to nejde, propadáš úzkosti, kterou si nepřiznáš. Tvoje identita je víc spojena s tím, co máš a co dokážeš, než s tím, kdo jsi.\n\nWorkaholismus tě izoluje. Strávíš večery v práci, víkendy v práci, dovolené kontroluješ e-maily. Partner se učí, že jsi sice doma fyzicky, ale mentálně někde jinde. To je samota uprostřed manželství.\n\nZacházíš s láskou transakčně. „Já se starám o finance, ty o emoce\" je tvoje implicitní dohoda. Ale partner nepotřebuje sponzora, potřebuje partnera. Učit se být emocionálně přítomný/á je tvoje nejdůležitější dlouhodobá lekce.\n\nŽárlivost a soutěživost. Když partner uspěje, místo radosti cítíš drobné nepohodlí. Tento pocit je signál, ne charakter — můžeš s ním pracovat, ale jen když si ho přiznáš.",
    inLove: "V lásce jsi velkorysý/á provider. Materiálně, logisticky, organizačně — partner ví, že tě má za zády. Tvůj problém není v dávání, je v přítomnosti.\n\nTvůj ideální partner je někdo, kdo má vlastní cíle a vlastní vnitřní život. Někdo, kdo není závislý na tobě, ale volí si tě každý den. Někdo, kdo umí ocenit tvoje úsilí — a zároveň ti říct, kdy přeháníš.\n\nSex je pro tebe akt intimity, ale snadno se mění v rutinu, když nedáváš pozor. Tvoje únava z práce se promítá do ložnice. Naučit se být plně přítomný/á ve fyzickém aktu — ne s mobilem v hlavě — je revoluce, kterou partner ocení.\n\nCo si hlídej: zaměňování úspěchu za hodnotu. Když nemáš výsledky, cítíš se prázdný/á — a tuhle prázdnotu si někdy léčíš workoholismem, jindy konzumací. Partnerství vyžaduje, aby ses uměl/a zastavit, ne jen vykonávat. To je tvoje hlavní zralostní práce.",
    accent: '#92400E',
  },
  9: {
    name: 'Idealista',
    tagline: 'Soucitný, vizionářský, moudrý.',
    description: 'Jsi soucitný, vizionářský a moudrý. Nesete v sobě všechny předchozí čísla — máš v sobě kus každého archetypu. V lásce hledáš někoho, s kým budeš sdílet větší smysl.',
    traits: ['Soucitný', 'Idealistický', 'Moudrý', 'Velkorysý'],
    love: 'Potřebuješ partnera, s kterým budeš sdílet smysl většího celku. Nejlépe se párujete s někým, kdo má hloubku, ale neztrácí se v sebelítosti.',
    shadow: 'Sklon k záchranářství a chronickému zklamání z reality vede k vyčerpání.',
    compatible: [3, 6, 9],
    tier1: [1, 2, 3, 6, 7, 9],
    tier2: [4, 11],
    tier3: [8],
    mirror: "Tvoje životní číslo 9 znamená, že jsi přišel/přišla dokončit cyklus a předat moudrost. Ne nutně tu, kterou ti někdo svěřil — tu, kterou jsi sám/sama získal/a v životě.\n\nJsi soucitný/á v širokém měřítku. Tvoje srdce nezná hranice — bolest cizinců se tě dotýká stejně jako bolest blízkých. Tato kapacita je tvoje největší dar a tvoje největší zátěž.\n\nJsi moudrý/á za svůj věk. Tvoji vrstevníci si někdy přicházeli pro radu už když ti bylo dvacet. Nesete v sobě staré duše — věci víš, aniž bys je studoval/a, vidíš věci, na které ostatní ještě nepřijdou.\n\nJsi velkorysý/á s časem, penězi, energií. Když máš, dáváš — a tato přirozenost ti otevírá brány, kterými by jiní procházeli desetiletí. Lidé tě respektují, protože cítí, že tvá štědrost není transakce.\n\nTvůj vkus pro krásu je vysoký. Cestování, kultura, umění, hudba — to je pro tebe potrava, ne luxus. Bez krásy se vysušuješ.\n\nTvá vize je univerzální. Vidíš celek tam, kde ostatní vidí kousky. Tato perspektiva ti dává schopnost spojovat lidi, kteří by si jinak nepřišli na chuť.\n\nV hloubce hledáš partnera, s kterým budeš sdílet smysl většího celku. Někoho, kdo má vlastní vize a nepotřebuje tě jako jediný zdroj smyslu.",
    shadowExtended: "Sebeobětování je tvůj démon. Dáváš až k vyčerpání — a pak se cítíš zrazeně, protože nikdo nedává zpět. Ale partneři tě nezradili — ty jsi nepoložil/a hranice.\n\nIdealismus tě může ničit. Tvoje očekávání od světa, od partnera, od sebe sama jsou tak vysoká, že realita tě chronicky zklamává. Naučit se přijmout lidi, jací jsou, ne jací by mohli být, je tvá hlavní práce.\n\nZáchranářství. Vidíš v lidech potenciál, kterého ani oni sami nevidí — a tato schopnost tě vede k volbě partnerů, kteří „tě potřebují\". To je past: vztah založený na potřebě jednoho z partnerů opravit toho druhého nepřežije.\n\nEmocionální stažení. Když ses ztratil/a v péči o ostatní a nezbylo nic pro tebe, máš tendenci zmizet — ne fyzicky, ale emocionálně. Partneři tě obviňují z chladu, ale ty se cítíš prostě vyždímaný/á.\n\nTendence držet se ve vztazích, které neslouží. „Já ho ještě nemůžu opustit, on mě potřebuje\" — tato věta tě v životě stála roky. Učit se odejít je tvoje nejtěžší lekce.",
    inLove: "V lásce jsi velkorysý/á, vize, hluboký/á. Tvoje představy o partnerství zahrnují nejen vás dva — ale to, co spolu uděláte pro svět. Nehledáš jen lásku; hledáš spojence.\n\nTvůj ideální partner je někdo, kdo má vlastní misi. Někdo, s kým můžeš dělat smysl pro něco víc než pro sebe. Někdo, kdo nepřipadne jen na tebe jako zdroj — ale stojí na vlastních nohách.\n\nSex je pro tebe transcendentní zkušenost, když je s pravým partnerem. Spojení duší přes těla — víc než pouhá fyzická aktivita. Když tato hloubka chybí, ztrácíš zájem rychle.\n\nCo si hlídej: zachraňování. Tvůj soucit se snadno změní v záchranářský komplex — a partner se stane projektem. Skutečně zdravý vztah je s někým, kdo se nepotřebuje opravovat. Tato distinkce ti otevře dveře, které jsi roky nevěděl/a, že existují.",
    accent: '#7C3AED',
  },
  11: {
    name: 'Vizionář',
    tagline: 'Intuitivní vizionář, spirituální posel.',
    description: 'Jsi intuitivní vizionář s neobyčejnou citlivostí. Cítíš věci, které ostatním unikají. V lásce hledáš partnera, který dokáže nést tvou intenzitu a zároveň ti pomáhá zůstat ukotvený/á.',
    traits: ['Intuitivní', 'Inspirativní', 'Citlivý', 'Spirituální'],
    love: 'Potřebuješ partnera, který tě pochopí v tichosti — slov je málo. Nejlépe fungujete s někým, kdo má pevné nohy a otevřené srdce.',
    shadow: 'Nervozita, perfekcionismus a útěk do fantazií tě brzdí v realizaci tvé vize.',
    compatible: [2, 6, 9],
    tier1: [2, 6, 9, 11, 22],
    tier2: [7, 8],
    tier3: [1, 5],
    mirror: "Tvoje životní číslo 11 znamená, že jsi master number — neredukovaný, neutlumený. Nesete v sobě vibraci, kterou většina lidí nezná.\n\nJsi intuitivní téměř až k psychickému. Víš věci, které bys vědět neměl/a. Často jsi snil/a o událostech, které se pak staly. Tvoje vnímání reality je rozšířené — a tato kvalita tě někdy izoluje.\n\nJsi inspirativní. Když mluvíš o věci, kterou cítíš, lidé poslouchají způsobem, jakým ostatním neposlouchají. Tvoje energie přenáší něco, co se nedá vyjádřit slovy. Někteří lidé tě po prvním setkání vnímají jako „divného, ale magneticky přitažlivého\".\n\nTvoje umělecká citlivost je vysoká. Hudba, slova, vizuální výjev — všechno tě zasáhne hlouběji než průměrný člověk. Tato citlivost je tvoje superkvalita — a tvoje nejtěžší zátěž.\n\nJsi vizionář. Vidíš svět, jaký by mohl být — a tato vize tě nutí pracovat na něm, i když ti ostatní neuvěří. Mnoho 11 dosáhne svého maxima až po 35–45 letech — tvoje rozvoj má vlastní rytmus.\n\nV hloubce hledáš partnera, který tě pochopí v tichosti — slov je málo. Někoho, kdo má pevné nohy v zemi, ale otevřené srdce pro tvou vizi.",
    shadowExtended: "Nervozita je tvoje konstantní pozadí. Tvoje vyladění je tak jemné, že každá disonance v okolí tě bolí. Žiješ s úzkostí, kterou ostatní nevidí — a tvoje schopnost vypadat v pohodě venku, zatímco vnitřně se třeseš, je pokročilá.\n\nPerfekcionismus tě paralyzuje. Tvoje představa o tom, jak by věc měla být udělaná, je tak vysoká, že začínáš méně, než bys mohl/a — protože nevěříš, že to splníš ideálně.\n\nÚtěk do fantazie. Když realita zaboli, vracíš se do vlastní hlavy — kde jsi v bezpečí, ale taky sám/sama. Tato schopnost je dar, když ji ovládáš, a vězení, když ovládá ona tebe.\n\nVyhoření z intenzity. Tvoje schopnost vnímat hlouběji než ostatní znamená, že po dnech v lidské společnosti jsi vyždímaný/á způsobem, který ostatní nechápou. Naučit se pravidelně regenerovat v samotě je nezbytné, ne luxusní.\n\nSebekritika. Tvoje očekávání od sebe sama jsou nelidská. Když nesplníš svoji vizi, místo soucitu se sebou propadáš sebekritice, která ti bere energii potřebnou k tomu, abys vizi naplnil/a.",
    inLove: "V lásce jsi hluboký/á, intenzivní, někdy příliš. Tvoje schopnost prožít vztah na úrovni, kterou většina lidí nezná, je dar — a zranitelnost. Partneři, kteří tě nepochopí, tě nechtěně zraňují.\n\nTvůj ideální partner je někdo s pevnýma nohama. Někdo, kdo umí být klidný, když ty jsi v turbulenci. Někdo, kdo nepotřebuje tvoji intenzitu — ale dokáže ji nést, když ji nabídneš.\n\nSex pro tebe je akt energetické výměny, ne pouhého fyzična. Vnímáš věci, které partner ani neví, že vyzařuje. Když je správný, sex je transcendentní. Když je špatný, je pro tebe drasticky narušující.\n\nCo si hlídej: spadnout do partnerství s někým „kdo tě potřebuje opravit\" nebo „kdo tě potřebuje zachránit\". Tvoje citlivost přitahuje lidi, kteří hledají útočiště — a ty se snadno stane jejich domovem. Skutečně zdravý partner stojí na vlastních nohách. To je všechno.",
    accent: '#9333EA',
  },
  22: {
    name: 'Architekt',
    tagline: 'Vizionář, který buduje skutečné věci.',
    description: 'Jsi master builder — vizionář s pevnýma nohama. Dokážeš proměnit sny v instituce, hnutí, nebo trvalá díla. V lásce hledáš někoho, kdo s tebou bude sdílet tvou schopnost realizovat velké vize.',
    traits: ['Vizionářský', 'Praktický', 'Disciplinovaný', 'Inspirativní'],
    love: 'Potřebuješ partnera, který sdílí tvou potřebu budovat něco většího. Nejlépe fungujete s někým, kdo rozumí, že tvá práce je tvůj způsob lásky.',
    shadow: 'Vyhoření z velikosti tvé mise — zanedbáváš zdraví a intimitu kvůli práci.',
    compatible: [4, 11, 33],
    tier1: [4, 6, 11, 33],
    tier2: [9],
    tier3: [3, 5],
    mirror: "Tvoje životní číslo 22 znamená, že jsi master builder — vizionář s pevnýma nohama. Nesete v sobě kombinaci, která se v populaci vyskytuje jen vzácně: schopnost vidět velké a zároveň schopnost ho realizovat.\n\nJsi praktický vizionář. Tam, kde sni snílci ztroskotávají na realitě, ty vidíš krok za krokem, jak sen postavit. Tvoje schopnost překlenout abstraktní vizi do konkrétních akcí je výjimečná.\n\nJsi disciplinovaný/á. Když máš misi, pracuješ na ní s vytrvalostí, která ostatní vyčerpá při pohledu. Nejde o workaholismus — jde o vědomí, že tvoje práce má smysl, který přesahuje tebe.\n\nJsi přirozeně vůdce. Lidé tě následují ne kvůli charizmatu, ale kvůli kompetenci. Cítí, že víš, co děláš — a v dnešním světě je to vzácné kvality.\n\nTvůj smysl pro dlouhodobou hru. Vidíš věci v horizontech let, ne dnů. Plánuješ na desetiletí dopředu, zatímco ostatní řeší zítřek. Tato perspektiva ti dává tichou výhodu.\n\nV hluboce hledáš partnera, který sdílí tvoji potřebu budovat něco trvalého. Někoho, kdo rozumí, že tvoje práce není únik — je tvůj způsob lásky. Někoho, kdo dokáže respektovat tvoji oddanost a zároveň ti připomínat, že život je víc než mise.",
    shadowExtended: "Vyhoření z velikosti tvé mise. Tvoje cíle jsou tak velké, že tě v jejich realizaci spolykají. Zanedbáváš zdraví, intimitu, drobné radosti — vše ve službě cíli, který nikdy úplně nedosáhneš.\n\nPerfekcionismus. Tvoje představa o tom, jak by věc měla vypadat, je tak ostrá, že málokdy přijmeš „dost dobré\". Toto ti dlouhodobě bere radost z procesu — vždy jsi nedaleko ideálu.\n\nWorkoholismus jako útěk. Práce ti dává smysl — a stává se tvým bezpečím. Když přijdou emocionálně náročné chvíle, místo s nimi sednout, raději zaplníš den úkoly.\n\nNáročnost vůči ostatním. Očekáváš od partnera, dětí, kolegů stejnou intenzitu, jakou máš ty sám/sama. Ale nikdo nemá tvoji kapacitu — a tvoje očekávání lidi vyčerpávají, i když to nevidíš.\n\nInferiorita vůči vlastnímu potenciálu. Tvoje vize je tak velká, že máš pocit, že nikdy nedoženeš to, co bys mohl/a. Tato vnitřní kritika ti bere radost z toho, co jsi již dokázal/a.",
    inLove: "V lásce jsi pomalý/á na rozhodnutí. Stejně jako u všeho — kdykoli vstupuješ do velkého závazku, hodnotíš dlouhodobě. Když ses rozhodl/a, jdeš naplno, ale dveře se otevírají roky, ne týdny.\n\nTvůj ideální partner je někdo, kdo má vlastní misi. Někdo, kdo rozumí, že práce tě naplňuje jako modlitba. Někdo, kdo nepotřebuje tvoji neustálou přítomnost — ale ocení, když ji máš čas věnovat.\n\nSex je pro tebe akt důvěry a uvolnění. V práci jsi soustředěný/á — sex je pro tebe místem, kde můžeš pustit kontrolu. Když partner dokáže přijmout tvoji intenzitu i tvoji občasnou nepřítomnost, vztah dlouhodobě prospívá.\n\nCo si hlídej: měřit lásku úspěchem mise. Tvůj sklon hodnotit vztah podle toho, jak vám spolu „roste projekt\", ti bere radost z lásky pro sebe samou. Učit se prostě být — bez plánování, bez cíle — je tvoje hlavní lekce.",
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
    mirror: "Tvoje životní číslo 33 znamená, že jsi master teacher — nesete v sobě jednu z nejvzácnějších numerologických vibrací. Tvoje přítomnost léčí lidi způsobem, který se nedá popsat ani vysvětlit.\n\nJsi bezpodmínečně laskavý/á. Tvoje láska nezná hranice „kdo si zaslouží\" — dáváš všem, kdo přijdou. Tato kapacita je tvůj největší dar a tvoje nejtěžší zátěž.\n\nJsi přirozeně léčící. Lidé v tvé blízkosti se cítí lépe — nejen emocionálně, ale často i fyzicky. Tvoje vibrace zklidňuje, otevírá, uvolňuje. Vědomě nebo nevědomě jsi pro mnohé doma léčitel/ka.\n\nJsi tvořivý/á v expresivním měřítku. Kombinuješ hloubku 6 (péče) s expresí 3 (kreativita) — tvoje umění, slova, hudba mají moc proměnit lidi, kteří se s nimi setkají.\n\nTvoje moudrost je hluboká. Lidé ti chodí pro radu od mládí, protože cítí, že vidíš dál a hlouběji. Nesete v sobě staré duše — věci víš způsobem, který nelze nastudovat.\n\nV hluboce hledáš partnera, s kterým budeš sdílet tvou misi laskavosti. Někoho, kdo umí přijímat lásku stejně tak, jako ji rozdávat. Někoho, kdo tě nevyčerpává, ale doplňuje.",
    shadowExtended: "Martyrdom na kosmické úrovni. Tvoje touha sloužit tě může pohltit do té míry, že ztrácíš sebe. „Já si nemůžu odpočinout, oni mě potřebují\" — tato věta tě v životě stojí roky.\n\nPerfekcionismus moralistický. Tvá očekávání od světa jsou tak vysoká — všichni by měli být laskaví, čestní, soucitní — že realita tě chronicky zklamává. Místo soucitu se ztrácíš v souzení.\n\nVyhoření až vyprahnutí. Tvoje schopnost dávat je nadprůměrná, ale není nekonečná. Když nepoložíš hranice, vyhoříš způsobem, ze kterého se těžce vrací. Pak se cítíš tak prázdný/á, že ti nezbývá nic ani pro sebe.\n\nSebekritika. Tvoje vlastní standardy jsou nelidské — a ty na sebe aplikuješ stejně tvrdě jako na svět. Tvoje výzva: učit se být tak laskavý/á k sobě, jak jsi k ostatním.\n\nSpasitelský komplex. Tvoje touha pomoci se snadno mění v přesvědčení, že víš lépe než druzí. Tato dynamika z tebe dělá nedostupnou osobu — i když paradoxně toužíš po blízkosti.\n\nLidé tě využijí. Tvoje neschopnost říkat ne přitahuje ty, kdo si nikdy nezasloužili tvoji péči. Naučit se rozeznat skutečnou potřebu od manipulace je tvoje hlavní lekce.",
    inLove: "V lásce jsi velkorysý/á po sebevzdání. Tvoje schopnost milovat je téměř transcendentní — a tady leží i tvoje největší zranitelnost. Lidé, kteří tě milují, se učí přijímat lásku, kterou si neumějí oplatit. Lidé, kteří tě nemilují, tě využívají.\n\nTvůj ideální partner je někdo, kdo umí přijímat lásku stejně bohatě, jako ji dávat. Někoho, kdo má vlastní misi a nepotřebuje tě zachránit. Někdo, kdo umí říct: „dnes pečuj o sebe, já se postarám o všechno\".\n\nSex je pro tebe akt léčení — pro sebe i pro partnera. Tvoje schopnost být plně přítomný/á v intimní chvíli léčí způsobem, kterému partner často nerozumí. Když najdeš partnera, který tě umí přijmout celou, sex se stává sakrálním aktem.\n\nCo si hlídej: rozpustit se v partnerovi. Tvoje touha sloužit ti může ukrást tvoji identitu. Kdo jsi, když nepomáháš? Tato otázka je tvoje hlavní zralostní práce. Skutečně zdravý vztah znamená, že máš vlastní život vedle života partnerova — ne místo něj.",
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
