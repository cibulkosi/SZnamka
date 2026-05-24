
import type { Metadata } from 'next'
import Link from 'next/link'

const TITLE = 'Jak funguje Cosmatch — Algoritmus, zdroje, metodologie | Cosmatch'
const DESC = 'Cosmatch počítá shodu transparentně — 30 % kompatibilita podle data narození, 25 % životní hodnoty a vize (Gottman), 20 % psychologický profil (citová vazba, Big5 Neuroticism, MBTI, chronobiologie), 10 % intimní soulad, 7 % životní styl, 5 % společné zájmy, 3 % aktivita. Žádný horoskop, žádné skryté vzorce.'
const URL = 'https://cosmatch.cz/jak-funguje-cosmatch'

export const metadata: Metadata = {
  title: TITLE, description: DESC,
  alternates: { canonical: URL, languages: { 'cs-CZ': URL, 'x-default': URL } },
  openGraph: { title: TITLE, description: DESC, url: URL, type: 'article', siteName: 'Cosmatch', locale: 'cs_CZ' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
  keywords: ['jak funguje cosmatch', 'algoritmus kompatibility', 'kompatibilita podle data narození', 'cosmatch metodika'],
  authors: [{ name: 'Simona Cibulková' }],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: TITLE, description: DESC,
  author: {
    '@type': 'Person',
    name: 'Simona Cibulková',
    jobTitle: 'Zakladatelka Cosmatch',
    description: 'Zakladatelka cosmatch.cz, první české seznamky postavené na kompatibilitě podle data narození.',
    knowsAbout: ['kompatibilita podle data narození', 'psychologie vztahů', 'seznamovací aplikace', 'kompatibilita partnerů'],
  },
  publisher: { '@type': 'Organization', name: 'Cosmatch', logo: { '@type': 'ImageObject', url: 'https://cosmatch.cz/icon-512.png' } },
  datePublished: '2026-05-16', dateModified: '2026-05-16',
  mainEntityOfPage: { '@type': 'WebPage', '@id': URL },
  inLanguage: 'cs-CZ',
}

export default function JakFungujeCosmatchPage() {
  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">← Cosmatch</Link>
      </div>

      <article className="max-w-2xl mx-auto px-6 pt-16 pb-24">

        <header className="mb-8">
          <p className="eyebrow text-pink-500 mb-6">Metodika</p>
          <h1 className="serif-display text-5xl sm:text-6xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-6">
            Jak Cosmatch<br/><em className="italic text-pink-500">opravdu funguje a kdo za ním stojí</em>?
          </h1>
          <hr className="rule w-12 border-gray-900" />
        </header>

        {/* Bio Simona — E-E-A-T trust signal */}
        <section className="mb-16 bg-white border border-gray-100 rounded-3xl p-10">
          <p className="eyebrow text-pink-500 mb-4">Kdo vybudoval Cosmatch?</p>
          <h2 className="serif text-2xl text-gray-900 font-medium leading-tight mb-3">
            Simona Cibulková, zakladatelka Cosmatch
          </h2>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
            Před Cosmatch jsem strávila roky studiem vztahové dynamiky, psychologie osobnosti a kompatibility podle data narození. Cosmatch staví na několika <Link href="/zdroje-numerologie" className="text-pink-500 underline">klíčových zdrojích</Link> — od moderní psychologie po astrologické rozbory datumů narození.
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">
            Cosmatch jsem vyvinula proto, že jsem byla nespokojená s aplikacemi, které okrádají o pozornost a čas, ale nedají lidem důvod se opravdu potkat.
          </p>
        </section>

        <hr className="rule mb-16" />

        {/* 7 vrstev algoritmu */}
        <section className="mb-16">
          <p className="eyebrow text-pink-500 mb-4">Propracovaný algoritmus</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-10">
            V algoritmu je zapracováno sedm vrstev výpočtu.
          </h2>

          <div className="space-y-12">
            {[
              ['I', 'Kompatibilita podle data narození', '30 %', 'Hlavní vrstva. Databáze 46 949 párů den+měsíc, kde pro každou kombinaci je určena jedna z pěti kategorií vztahu: spřízněné duše, láska a přátelství, magnetická tenze, prospěšný vztah, náročný vztah. Databáze syntetizuje klasickou tradici (Crawford & Sullivan, Goldschneider, McCants, Decoz, Kadlecová), která pracuje s celou symbolikou data narození — sluneční znamení, dekanát, stupeň, fixní hvězda i numerologické životní číslo. Algoritmus tedy nepočítá komponenty zvlášť — jeden lookup do tabulky vrátí výslednou kategorii.'],
              ['II', 'Životní hodnoty a vize', '25 %', 'Pět sub-faktorů: rodinné plány (chcete děti?), typ vztahu (vážný / nezávazný / přátelství), náboženské či duchovní zaměření, přístup k financím (šetřivý / utrácivý / vyvážený) a celková životní vize. Sdílené hodnoty a životní cíle jsou podle čtyřicetiletého výzkumu psychologa Johna Gottmana <em>nejsilnějším prediktorem</em> dlouhodobého vztahu — silnějším než vášeň prvních týdnů.'],
              ['III', 'Psychologický profil', '20 %', 'Devět dimenzí osobnosti — žádná jiná česká seznamka nemá takovou hloubku. Kompletní typologie podle Myers-Briggs (MBTI; šestnáct typů z kombinací introvert/extrovert, vizionář/realizátor, logika/srdce, plánování/spontánnost), styl citové vazby (bezpečný, úzkostný nebo vyhýbavý — vychází z teorie attachmentu Johna Bowlbyho), pětice jazyků lásky (slova ujištění, skutky, dárky, společný čas, doteky — primární a sekundární podle modelu Garyho Chapmana), emoční stabilita (klidný versus reaktivní typ z modelu Velké pětky osobnostních rysů), chronobiologie (ranní ptáče nebo noční sova) a styl řešení konfliktů (podle modelu Thomas-Kilmann). Vidíš sebe i partnera hloubkově, ne jen na povrchu.'],
              ['IV', 'Intimní soulad', '10 %', 'Nesmí chybět ani velikost libida. Soulad v sexu v dlouhodobém vztahu je důležitý pro vyhnutí se tiché frustraci.'],
              ['V', 'Životní styl a návyky', '7 %', 'Kouření, marihuana, alkohol, strava nebo pohyb každodenní soužití také ovlivňují. Ve filtrech si můžeš zvolit např. kouření jako vylučovací podmínku (anglicky deal-breaker, tedy něco, co nedokážeš tolerovat) — pak Ti kuřáci nezobrazí vůbec. Tuhle volbu dělá hlavní práci za jemné bodování.'],
              ['VI', 'Společné zájmy', '5 %', 'Procentní překryv tagů (záliby je možné vybírat z 45 možností). Mohou sloužit jako společná řeč pro první rande, ale ne jako hlavní faktor dlouhodobé kompatibility.'],
              ['VII', 'Aktivita', '3 %', 'Být online v posledních 24 h přináší členům 100 bodů, v posledním týdnu 75 b., za poslední měsíc 50 b., déle než jeden měsíc 30 b. Sebelepší shoda totiž nepovede nikam, pokud druhý člověk aplikaci vůbec nepoužívá.'],
            ].map(([num, title, weight, body]) => (
              <div key={num} className="grid grid-cols-[auto,1fr] gap-x-8">
                <div className="text-right">
                  <div className="roman text-3xl text-pink-500 leading-none mb-2">{num}</div>
                  <div className="text-xs text-gray-500 tracking-wider">{weight}</div>
                </div>
                <div>
                  <h3 className="serif text-xl text-gray-900 font-medium mb-2 leading-tight">{title}</h3>
                  <p className="text-gray-700 leading-[1.75] text-[0.95rem]">{body}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-gray-500 leading-relaxed italic">
            Detaily každé vrstvy, finálního násobiče a vylučovacích podmínek najdeš v dalších sekcích níže.
          </p>
        </section>

        <hr className="rule mb-16" />

        {/* Detail vrstvy I — Kompatibilita podle data narození */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Detail vrstvy I — 30 %</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            Kompatibilita podle data narození.
          </h2>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-6">
            Cosmatch má databázi <strong className="text-gray-900 font-medium">46 949 párů den+měsíc</strong>, kde je pro každou kombinaci určena jedna z pěti kategorií vztahu. Databáze syntetizuje klasickou tradici (Crawford &amp; Sullivan, Goldschneider, McCants, Decoz, Kadlecová), která pracuje s celou symbolikou data narození — sluneční znamení, dekanát, stupeň, fixní hvězda i numerologické životní číslo. Algoritmus tedy nepočítá komponenty zvlášť — jeden lookup do tabulky vrátí výslednou kategorii.
          </p>

          <h3 className="serif text-xl text-gray-900 font-medium mb-3 mt-10">Pět kategorií + jejich bodování</h3>
          <ul className="space-y-3 text-[0.95rem] text-gray-700 leading-relaxed mb-8">
            <li>
              <strong className="text-gray-900 font-medium">Spřízněné duše — 100 b.</strong>
              <span className="block text-gray-600 mt-0.5">Nejhlubší karmická vazba. Harmonická čísla i elementy, dlouhodobě udržitelný vztah s minimem tření.</span>
            </li>
            <li>
              <strong className="text-gray-900 font-medium">Láska a přátelství — 95 b.</strong>
              <span className="block text-gray-600 mt-0.5">Přirozená harmonie napříč elementy. Prakticky stejně silné jako Spřízněné duše, jen méně „osudové".</span>
            </li>
            <li>
              <strong className="text-gray-900 font-medium">Magnetická tenze — 85 b.</strong>
              <span className="block text-gray-600 mt-0.5">Karmický nebo destruktivní pár. Silná přitažlivost s ambivalentním nábojem — může vést k transformaci nebo vyhoření, záleží na zralosti obou.</span>
            </li>
            <li>
              <strong className="text-gray-900 font-medium">Prospěšný vztah — 65 b.</strong>
              <span className="block text-gray-600 mt-0.5">Mentor / praktická podpora. Méně romantická jiskra, ale jeden druhého funkčně doplňuje.</span>
            </li>
            <li>
              <strong className="text-gray-900 font-medium">Náročný vztah — 45 b.</strong>
              <span className="block text-gray-600 mt-0.5">Růst přes konflikt. Vyžaduje vědomou práci obou stran.</span>
            </li>
            <li>
              <em className="italic">Žádná kategorie — 50 b.</em>
              <span className="block text-gray-600 mt-0.5">Neutrální fallback, když pár v tabulce není.</span>
            </li>
          </ul>

          <h3 className="serif text-xl text-gray-900 font-medium mb-3 mt-10">Jednostranná láska — obousměrný lookup</h3>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
            Databáze není symetrická. Pro 15. května může být 22. červenec <em className="italic">Spřízněná duše</em>, ale ten 22. červenec ve své vlastní sekci může mít 15. května jen jako <em className="italic">Prospěšný vztah</em> nebo dokonce <em className="italic">Náročný</em>. To je „jednostranná láska" v knižním smyslu.
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
            Algoritmus to řeší takto:
          </p>
          <ul className="space-y-2 text-[0.95rem] text-gray-700 leading-relaxed mb-4 ml-4">
            <li>1. Lookup co vidí osoba A v osobě B → skóre A→B</li>
            <li>2. Lookup co vidí osoba B v osobě A → skóre B→A</li>
            <li>3. Výsledné Crawford skóre = průměr obou směrů</li>
            <li>4. Pokud oba vidí druhého pozitivně (skóre ≥ 70), pár získá <strong className="text-gray-900 font-medium">bonus +5 %</strong> za vzájemnou rezonanci</li>
          </ul>
          <p className="text-gray-700 leading-[1.75] text-[0.95rem] italic text-gray-600">
            Příklad: Spřízněná duše × Prospěšný vztah = (100 + 65) / 2 = <strong className="not-italic text-gray-900 font-medium">82,5 b.</strong> Vysoké skóre, ale ne maximum — asymetrie ho stahuje. V profilu druhého člověka uvidíš obě perspektivy, abys věděl, kdo k tobě cítí silnější tah.
          </p>

          <div className="mt-10 bg-pink-50 border border-pink-200 rounded-2xl p-6">
            <p className="eyebrow text-pink-500 mb-3">Proč 30 %?</p>
            <p className="text-gray-700 leading-[1.75] text-[0.95rem] mb-3">
              Vrstva I není akademicky peer-review validovaná — Crawford &amp; Sullivan jsou expert-systém dvou praktikujících astroložek, ne psychometricky testovaný model. Cosmatch to <Link href="#nedela" className="text-pink-500 underline">v sekci „Co Cosmatch nedělá"</Link> přiznává.
            </p>
            <p className="text-gray-700 leading-[1.75] text-[0.95rem]">
              Proč ji tedy držíme jako největší vrstvu? Podle <strong className="text-gray-900 font-medium">Harris Poll 2024 (N=2 069 US dospělých) věří v astrologii 83 % Millennials a 62 % Gen Z</strong>. Pro cílovou generaci Cosmatch (~25–38) je kompatibilita podle data narození jazyk, kterým o vztazích přirozeně přemýšlí. Není to o tom, jestli „funguje" v laboratorním smyslu — je to o tom, že rezonuje s tím, jak se uživatelé sami chápou.
            </p>
          </div>
        </section>

        <hr className="rule mb-16" />

        {/* Detail vrstvy II — Životní hodnoty a vize */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Detail vrstvy II — 25 %</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            Životní hodnoty a vize.
          </h2>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-6">
            Sdílené hodnoty udržují vztah dlouhodobě víc než vášeň prvních týdnů. Tahle vrstva je podle čtyřicetiletého výzkumu psychologa <strong className="text-gray-900 font-medium">Johna Gottmana</strong> nejsilnější prediktor toho, jestli vztah překoná desetiletí. Skládá se z pěti sub-faktorů:
          </p>
          <ul className="space-y-3 text-[0.95rem] text-gray-700 leading-relaxed mb-6">
            <li><strong className="text-gray-900 font-medium">Rodinné plány</strong> — chcete děti, máte děti a chcete další, nechcete děti, nebo zatím nevíte. Pokud jeden z vás chce děti a druhý je striktně nechce, profil se vůbec nezobrazí (vylučovací podmínka).</li>
            <li><strong className="text-gray-900 font-medium">Typ vztahu</strong> — vážný vztah, nezávazné, otevřený vztah, ještě nevíš. Shoda zde má největší váhu — viz finální násobič níže.</li>
            <li><strong className="text-gray-900 font-medium">Náboženské a duchovní zaměření</strong> — nevěřící, věřící, spirituální (mimo organizovaná náboženství), jiné. Shodné nebo příbuzné zaměření zlepšuje porozumění při velkých životních otázkách.</li>
            <li><strong className="text-gray-900 font-medium">Přístup k financím</strong> — šetřivý, utrácivý, vyvážený. Finance jsou statisticky druhým nejčastějším důvodem hádek v párech (po komunikaci).</li>
            <li><strong className="text-gray-900 font-medium">Celková životní vize</strong> — co od života očekáváš a kam jdeš.</li>
          </ul>
          <p className="text-gray-700 leading-[1.75] text-[0.95rem] italic">
            Bodování: shodná odpověď = plný počet bodů, kompatibilní (např. spirituální + věřící) = částečné, opačné (chce/nechce děti) = 0.
          </p>

          <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6">
            <p className="eyebrow text-pink-500 mb-2">Magic ratio 5:1</p>
            <p className="text-gray-700 leading-[1.75] text-[0.95rem]">
              Gottmanův výzkum přinesl jednu konkrétní memorable věc: <strong className="text-gray-900 font-medium">stabilní páry mají v komunikaci 5 pozitivních interakcí na 1 negativní</strong>. Cosmatch to neměří v algoritmu (algoritmus nemá přístup do Tvojí ložnice), ale je dobré to vědět — vztah, ve kterém chybí běžné drobnosti laskavosti, není v krizi proto, že padne velký hřebíček, ale proto, že chybí ten tichý poměr 5 k 1.
            </p>
          </div>
        </section>

        <hr className="rule mb-16" />

        {/* Detail vrstvy III — Psychologický profil */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Detail vrstvy III — 20 %</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            Psychologický profil.
          </h2>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-8">
            Devět dimenzí osobnosti. Žádná jiná česká seznamka nemá tuhle hloubku. Skládá se z šesti psychologických modelů, z nichž každý měří něco jiného — společně dávají kompletní obraz toho, jak Ty a Tvůj partner fungujete jako lidi a jak budete fungovat spolu.
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="serif text-xl text-gray-900 font-medium mb-2">1. Typologie Myers-Briggs (MBTI) — 4 dimenze, 16 typů</h3>
              <p className="text-gray-700 leading-[1.7] text-[0.95rem] mb-2">
                Nejrozšířenější osobnostní typologie na světě (od 1944, vychází z teorie švýcarského psychiatra <strong className="text-gray-900 font-medium">Carla Gustava Junga</strong> z roku 1921). Měří čtyři dimenze:
              </p>
              <ul className="space-y-1 text-[0.95rem] text-gray-700 leading-relaxed ml-4">
                <li><strong className="text-gray-900 font-medium">E/I</strong> (extrovert/introvert) — kde čerpáš energii: mezi lidmi, nebo o samotě</li>
                <li><strong className="text-gray-900 font-medium">N/S</strong> (vizionář/realizátor) — jak vnímáš svět: vize a možnosti, nebo fakta a detail</li>
                <li><strong className="text-gray-900 font-medium">T/F</strong> (logika/srdce) — jak se rozhoduješ: rozumem, nebo emocí</li>
                <li><strong className="text-gray-900 font-medium">J/P</strong> (plánování/spontánnost) — jak žiješ: strukturovaně, nebo otevřeně</li>
              </ul>
              <p className="text-gray-600 leading-[1.7] text-[0.9rem] mt-2 italic">
                Kombinací dimenzí vznikne jeden z šestnácti typů (INFJ Advokát, ENTP Polemik, ESFP Bavič a další). Cosmatch ho vypočítá a zobrazí v Tvém profilu.
              </p>
            </div>

            <div>
              <h3 className="serif text-xl text-gray-900 font-medium mb-2">2. Styl citové vazby (Attachment Theory)</h3>
              <p className="text-gray-700 leading-[1.7] text-[0.95rem] mb-2">
                Teorie britského psychiatra <strong className="text-gray-900 font-medium">Johna Bowlbyho</strong> (1969) a americké psycholožky <strong className="text-gray-900 font-medium">Mary Ainsworth</strong> (1970). Podle moderního výzkumu predikuje úspěch vztahu lépe než MBTI. Tři hlavní styly:
              </p>
              <ul className="space-y-1 text-[0.95rem] text-gray-700 leading-relaxed ml-4">
                <li><strong className="text-gray-900 font-medium">Bezpečný</strong> (asi 55 % populace) — pohodlný s blízkostí i nezávislostí</li>
                <li><strong className="text-gray-900 font-medium">Úzkostný</strong> (asi 20 %) — touha po blízkosti, strach z opuštění</li>
                <li><strong className="text-gray-900 font-medium">Vyhýbavý</strong> (asi 20 %) — cení si nezávislosti, blízkost dusí</li>
              </ul>
              <p className="text-gray-600 leading-[1.7] text-[0.9rem] mt-2 italic">
                Bezpečný + bezpečný = ideál. Úzkostný + vyhýbavý = klasický „chase-flee" cyklus, který bývá destruktivní (ale magnetický). Cosmatch tyto dynamiky zohledňuje.
              </p>
            </div>

            <div>
              <h3 className="serif text-xl text-gray-900 font-medium mb-2">3. Pět jazyků lásky (5 Love Languages)</h3>
              <p className="text-gray-700 leading-[1.7] text-[0.95rem] mb-2">
                Model amerického vztahového poradce <strong className="text-gray-900 font-medium">Garyho Chapmana</strong> (1992, celosvětově přes 20 milionů prodaných knih). Definuje pět způsobů, jakými lidé přijímají a vyjadřují lásku:
              </p>
              <ul className="space-y-1 text-[0.95rem] text-gray-700 leading-relaxed ml-4">
                <li><strong className="text-gray-900 font-medium">Slova ujištění</strong> — komplimenty, „mám tě rád/a"</li>
                <li><strong className="text-gray-900 font-medium">Skutky</strong> — praktická pomoc, vaření, oprava</li>
                <li><strong className="text-gray-900 font-medium">Dárky</strong> — drobnosti jako symbol pozornosti</li>
                <li><strong className="text-gray-900 font-medium">Společný čas</strong> — kvalitní pozornost bez rozptýlení</li>
                <li><strong className="text-gray-900 font-medium">Doteky</strong> — fyzický kontakt</li>
              </ul>
              <p className="text-gray-600 leading-[1.7] text-[0.9rem] mt-2 italic">
                V Cosmatch si vybereš primární a sekundární jazyk. Shodné jazyky lásky znamenají méně nedorozumění (kdy jeden dává dárky a druhý čeká objetí).
              </p>
            </div>

            <div>
              <h3 className="serif text-xl text-gray-900 font-medium mb-2">4. Emoční stabilita (Velká pětka — Neuroticism)</h3>
              <p className="text-gray-700 leading-[1.7] text-[0.95rem]">
                Dimenze z akademického osobnostního modelu Velké pětky (<strong className="text-gray-900 font-medium">Costa &amp; McCrae, 1985</strong>). Měří, jak silně reaguješ na stres a emoce: klidně (stable), reaktivně (reactive), nebo vyváženě. Dvě stabilní osoby tvoří klidnější vztah, dvě reaktivní — bouřlivější, ale upřímnější.
              </p>
            </div>

            <div>
              <h3 className="serif text-xl text-gray-900 font-medium mb-2">5. Chronobiologie (ranní ptáče / noční sova)</h3>
              <p className="text-gray-700 leading-[1.7] text-[0.95rem]">
                Cirkadiánní rytmus — biologicky daný čas, kdy jsi nejvíc aktivní. Vychází z výzkumu německého chronobiologa <strong className="text-gray-900 font-medium">Tilla Roenneberga</strong> (Munich Chronotype Questionnaire, 2003). Skřivani + sovy mívají málo společných hodin — partneři se míjejí.
              </p>
            </div>

            <div>
              <h3 className="serif text-xl text-gray-900 font-medium mb-2">6. Styl řešení konfliktů (Thomas-Kilmann)</h3>
              <p className="text-gray-700 leading-[1.7] text-[0.95rem]">
                Model amerických psychologů <strong className="text-gray-900 font-medium">Kennetha Thomase a Ralpha Kilmanna</strong> (1974). V Cosmatch zjednodušeně tři přístupy: hned to vyříkám / nejdřív se uklidním / konflikty nemám rád/a. Avoidant + avoidant kombinace je rizikem — neřešené konflikty kumulují.
              </p>
            </div>
          </div>
        </section>

        <hr className="rule mb-16" />

        {/* Detail vrstvy IV — Intimní soulad */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Detail vrstvy IV — 10 %</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            Intimní soulad.
          </h2>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
            Velikost libida na pětistupňové škále (od „velmi nízké" po „velmi vysoké"). Cosmatch porovnává Tvoji škálu s partnerovou a kompatibilitu počítá podle vzdálenosti: shoda = 100 bodů, rozdíl o 1 = 75, o 2 = 50, o 3 = 25, o 4 = 0.
          </p>
          <p className="text-gray-700 leading-[1.75] text-[0.95rem] italic">
            Inspirace: belgicko-americká psychoterapeutka Esther Perel (<em>Mating in Captivity</em>, 2006) a americká sexuoložka Emily Nagoski (<em>Come As You Are</em>, 2015). Sexuální soulad v dlouhodobém vztahu je důležitý pro vyhnutí se tiché frustraci, která je jedním z nejčastějších důvodů rozpadu manželství.
          </p>
        </section>

        <hr className="rule mb-16" />

        {/* Detail vrstvy V — Životní styl */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Detail vrstvy V — 7 %</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            Životní styl a návyky.
          </h2>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
            Pět faktorů: kouření, marihuana, alkohol, strava, pohyb. Cosmatch porovnává Tvoje návyky s partnerovými — shodné = vysoké skóre, opačné (např. nepiju vs piju pravidelně) = nízké.
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem]">
            <strong className="text-gray-900 font-medium">Důležité:</strong> tahle vrstva má jen 5 % váhy, protože hlavní práci dělají <em>vylučovací podmínky</em> (viz níže). Pokud kouření je pro Tebe absolutní deal-breaker, profil se Ti vůbec nezobrazí. Drobné rozdíly (občasné pivo vs. abstinent) řeší tahle vrstva jemně.
          </p>
        </section>

        <hr className="rule mb-16" />

        {/* Detail vrstvy VI — Společné zájmy */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Detail vrstvy VI — 5 %</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            Společné zájmy.
          </h2>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
            Z 45 zálib si v profilu vybereš 3 až 8 (sport, hudba, čtení, vaření, cestování, …). Algoritmus spočítá procentní překryv Tvých zálib s partnerovými.
          </p>
          <p className="text-gray-700 leading-[1.75] text-[0.95rem] italic">
            Společné zájmy slouží jako přirozená společná řeč pro první rande, ale podle výzkumu amerického psychologa Arthura Arona (2000) <strong className="text-gray-900 not-italic font-medium">nejsou hlavním prediktorem dlouhodobé kompatibility</strong> — důležitější je <em>společně dělat věci nové a vzrušující</em> než mít stejné koníčky. Proto má tahle vrstva jen 5 %.
          </p>
        </section>

        <hr className="rule mb-16" />

        {/* Detail vrstvy VII — Aktivita */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Detail vrstvy VII — 3 %</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            Aktivita v aplikaci.
          </h2>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
            Sebelepší shoda nepomůže, pokud druhý člověk Cosmatch vůbec nepoužívá. Tahle vrstva bodově odráží, jak nedávno byl partner online:
          </p>
          <ul className="space-y-2 text-[0.95rem] text-gray-700 leading-relaxed mb-4">
            <li>online v posledních <strong className="text-gray-900 font-medium">24 hodinách</strong> → 100 bodů</li>
            <li>online v posledním <strong className="text-gray-900 font-medium">týdnu</strong> → 75 bodů</li>
            <li>online v posledním <strong className="text-gray-900 font-medium">měsíci</strong> → 50 bodů</li>
            <li>déle než měsíc → 30 bodů</li>
          </ul>
          <p className="text-gray-700 leading-[1.75] text-[0.95rem] italic">
            Není to prediktor úspěchu vztahu, jen reálné šance, že Ti partner odpoví na zprávu. Proto 5 % — důležité, ale nikdy ne určující.
          </p>
        </section>

        <hr className="rule mb-16" />

        {/* Detail finálního násobiče + vylučovací podmínky */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Finální násobič a vylučovací podmínky</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            Co stojí mimo procenta.
          </h2>

          <h3 className="serif text-xl text-gray-900 font-medium mb-3">Sladění záměru vztahu (finální násobič)</h3>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-3">
            Po součtu sedmi vrstev se výsledek ještě upraví podle toho, jestli oba hledáte to samé:
          </p>
          <ul className="space-y-2 text-[0.95rem] text-gray-700 leading-relaxed mb-6">
            <li>Oba chcete <strong className="text-gray-900 font-medium">to samé</strong> (oba vážný vztah, nebo oba nezávazné) → skóre <strong className="text-gray-900 font-medium">×&nbsp;1,2</strong> (bonus 20 %)</li>
            <li>Oba <strong className="text-gray-900 font-medium">tolerantní</strong> nebo neutrální → ×&nbsp;1,0 (žádná změna)</li>
            <li><strong className="text-gray-900 font-medium">Hard konflikt</strong> (jeden vážný, druhý nezávazné) → ×&nbsp;0,5 (penalizace na polovinu)</li>
          </ul>
          <p className="text-gray-700 leading-[1.75] text-[0.95rem] italic mb-8">
            Tahle korekce odráží, že kompatibilita znamená i shodná očekávání. Sebelepší shoda ve vrstvách nepomůže, pokud jeden hledá manželství a druhý jen letní romantiku.
          </p>

          <h3 className="serif text-xl text-gray-900 font-medium mb-3">Vylučovací podmínky (filtry)</h3>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-3">
            Některé věci nejsou součástí skóre — jsou to filtry, které úplně skryjí profil z Tvé nabídky. Tyto profily se Ti vůbec nezobrazí:
          </p>
          <ul className="space-y-2 text-[0.95rem] text-gray-700 leading-relaxed mb-6">
            <li><strong className="text-gray-900 font-medium">Vzdálenost</strong> nad Tvoji preferenci (např. nad 30 km)</li>
            <li><strong className="text-gray-900 font-medium">Věk</strong> mimo Tvůj zvolený rozsah</li>
            <li><strong className="text-gray-900 font-medium">Výška a postava</strong> mimo Tvoje preference (volitelné)</li>
            <li><strong className="text-gray-900 font-medium">Vztah k dětem</strong> — pokud jeden chce děti a druhý ne, profil se vždy skryje</li>
            <li><strong className="text-gray-900 font-medium">Kouření, alkohol nebo marihuana</strong> — pokud si některou volbu označíš jako vylučovací podmínku (anglicky deal-breaker, něco, co nedokážeš tolerovat), profily, které danému návyku holdují, se Ti neukáží</li>
            <li><strong className="text-gray-900 font-medium">Minimální kompatibilita</strong> — v nastavení můžeš zvolit, že chceš vidět jen profily nad 25 / 50 / 75 % shody (defaultně 0 %, vidíš všechny)</li>
          </ul>
          <p className="text-gray-700 leading-[1.75] text-[0.95rem] italic">
            Algoritmus tedy nepenalizuje za výšku ani věk — buď profil zobrazí, nebo ne. Filtry slouží Tobě, ne ostatním.
          </p>
        </section>

        <hr className="rule mb-16" />

        {/* Co Cosmatch nedělá — transparency / Joel et al. 2017 disclaimer */}
        <section id="nedela" className="mb-16 bg-white border border-gray-100 rounded-3xl p-10 scroll-mt-8">
          <p className="eyebrow text-pink-500 mb-4">Co Cosmatch nedělá</p>
          <h2 className="serif-display text-2xl sm:text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            Žádný algoritmus nepředpoví chemii. Cosmatch <em className="italic">zvyšuje pravděpodobnost</em>, negarantuje vztah.
          </h2>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
            V roce 2017 publikovali američtí psychologové Samantha Joel, Paul Eastwick a Eli Finkel ve&nbsp;<em>Psychological Science</em> studii, ve které trénovali sofistikovaný strojový model na více než 100 osobnostních a preferenčních proměnných u 350 účastníků speed-datingů. Cíl: predikovat jedinečnou chemii konkrétního páru. Výsledek: model byl <strong className="text-gray-900 font-medium">horší než náhoda</strong> (vysvětlená variance −4,55 % až +1,30 %).
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
            Eastwick to shrnul: <em className="italic">„Romantická touha může být spíš jako zemětřesení — dynamický a chaotický proces — než chemická reakce s pevným vzorcem."</em>
          </p>
          <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-4">
            Cosmatch tuto realitu přiznává. Náš algoritmus:
          </p>
          <ul className="space-y-2 text-[0.95rem] text-gray-700 leading-relaxed mb-4">
            <li><strong className="text-gray-900 font-medium">Dokáže:</strong> filtrovat hard nekompatibility (děti, vzdálenost, kouření), nabízet páry se sdílenými hodnotami a kompatibilní psychologií, zvyšovat pravděpodobnost smysluplného prvního kontaktu</li>
            <li><strong className="text-gray-900 font-medium">Nedokáže:</strong> předpovědět, jestli vznikne jiskra při prvním rande, predikovat délku vztahu nebo zaručit šťastný konec</li>
          </ul>
          <p className="text-gray-700 leading-[1.75] text-[0.95rem] italic">
            Chemii Cosmatch nezahrnuje do skóre, ale dává jí prostor v profilu — přes fotky, hlasové zprávy a textové prompty, které posuzuješ sám/sama svým citem.
          </p>
        </section>

        <hr className="rule mb-16" />

        {/* Chceš se ponořit hlouběji? — 3 link karty (přesunuté z Detailu vrstvy I) */}
        <section className="mb-16">
          <p className="eyebrow text-pink-500 mb-4">Pro hloubavé</p>
          <h2 className="serif-display text-3xl sm:text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-3">
            Chceš se ponořit hlouběji?
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8 text-[1.0625rem]">
            Pokud Tě baví, co stojí za Vrstvou I (kompatibilita podle data narození), tři podrobné průvodce:
          </p>

          <div className="space-y-3">
            <Link
              href="/kompatibilita-podle-data-narozeni"
              className="block bg-white border border-gray-200 hover:border-pink-500 rounded-2xl p-6 transition group"
            >
              <p className="eyebrow text-pink-500 mb-2">Numerologie</p>
              <h3 className="serif text-lg text-gray-900 font-medium group-hover:text-pink-500 transition mb-1">
                Kompatibilita podle data narození →
              </h3>
              <p className="text-gray-600 text-[0.95rem] leading-relaxed">
                12 archetypů, jak se počítá životní číslo, tabulka shod.
              </p>
            </Link>

            <Link
              href="/numerologie-vztahy"
              className="block bg-white border border-gray-200 hover:border-pink-500 rounded-2xl p-6 transition group"
            >
              <p className="eyebrow text-pink-500 mb-2">Numerologie ve vztazích</p>
              <h3 className="serif text-lg text-gray-900 font-medium group-hover:text-pink-500 transition mb-1">
                Jak životní číslo ovlivňuje partnerství →
              </h3>
              <p className="text-gray-600 text-[0.95rem] leading-relaxed">
                Partnerský výběr, komunikace, dlouhodobá kompatibilita. Master čísla, karmická spojení, přirozená rezonance.
              </p>
            </Link>

            <Link
              href="/symbolika-data-narozeni"
              className="block bg-white border border-gray-200 hover:border-pink-500 rounded-2xl p-6 transition group"
            >
              <p className="eyebrow text-pink-500 mb-2">Symbolika data narození · 12 min čtení</p>
              <h3 className="serif text-lg text-gray-900 font-medium group-hover:text-pink-500 transition mb-1">
                Astrologické komponenty pod kapotou →
              </h3>
              <p className="text-gray-600 text-[0.95rem] leading-relaxed">
                Tabulky 12 znamení, 36 dekanátů, 4 Royal Stars, 10 dalších fixních hvězd, srovnání klasické vs. moderní vládce.
              </p>
            </Link>
          </div>
        </section>

        <hr className="rule mb-16" />

        {/* Zdroje */}
        <section className="mb-16">
          <p className="eyebrow text-gray-500 mb-4">Zdroje</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-8">
            Na čem Cosmatch stojí.
          </h2>
          <ul className="space-y-4">
            <li className="text-gray-700 leading-relaxed text-[1.0625rem]">
              <strong className="text-gray-900 font-medium">The Secret Language of Birthdays</strong> (Gary Goldschneider &amp; Joost Elffers, Penguin Studio, 1994) — pop-culture personology framework založený na pozorování 14 000 osob.
            </li>
            <li className="text-gray-700 leading-relaxed text-[1.0625rem]">
              <strong className="text-gray-900 font-medium">The Power of Birthdays, Stars &amp; Numbers</strong> (Saffi Crawford &amp; Geraldine Sullivan, Ballantine, 1998) — encyklopedický 366-denní referenční průvodce kombinující astrologii, fixní hvězdy a numerologii.
            </li>
            <li className="text-gray-700 leading-relaxed text-[1.0625rem]">
              <strong className="text-gray-900 font-medium">Love by the Numbers</strong> (Glynis McCants, Sourcebooks, 2010) — současný mainstream love-by-the-numbers standard, tři tiery kompatibility.
            </li>
            <li className="text-gray-700 leading-relaxed text-[1.0625rem]">
              <strong className="text-gray-900 font-medium">Numerology: Key to Your Inner Self</strong> (Hans Decoz, Perigee/Tarcher, 2001) — moderní standardní textbook. Cosmatch používá jeho Three-Cycle Method pro výpočet životního čísla.
            </li>
            <li className="text-gray-700 leading-relaxed text-[1.0625rem]">
              <strong className="text-gray-900 font-medium">Partnerství a numerologie</strong> (Helmut-Whitey Kritzinger, Pragma, 1999) — kniha věnovaná partnerské numerologii.
            </li>
            <li className="text-gray-700 leading-relaxed text-[1.0625rem]">
              <strong className="text-gray-900 font-medium">Datum narození a jeho vliv na náš charakter</strong> (Jitka Kadlecová, Eminent, 2006) — česká numerologická tradice 21. století.
            </li>
          </ul>

          <h3 className="serif text-2xl text-gray-900 font-medium leading-tight mb-3 mt-12">Akademické zdroje (peer-reviewed)</h3>
          <p className="text-gray-700 leading-[1.75] text-[0.95rem] mb-6">
            Vrstvy II–VI algoritmu stojí na recenzovaných psychologických studiích. Klíčové publikace, na které se Cosmatch odkazuje:
          </p>
          <ul className="space-y-4">
            <li className="text-gray-700 leading-relaxed text-[1.0625rem]">
              <strong className="text-gray-900 font-medium">Bowlby, J. (1969).</strong> <em>Attachment.</em> Vol. 1 of <em>Attachment and Loss.</em> London: Hogarth Press — základní text teorie citové vazby, fundament Vrstvy III sub-modelu Attachment.
            </li>
            <li className="text-gray-700 leading-relaxed text-[1.0625rem]">
              <strong className="text-gray-900 font-medium">Hazan, C. &amp; Shaver, P. (1987).</strong> Romantic love conceptualized as an attachment process. <em>Journal of Personality and Social Psychology,</em> 52(3), 511–524 — přenos Bowlbyho teorie z dětství do dospělých romantických vztahů. Definuje tři adultní attachment styly (secure / anxious / avoidant) a jejich kompatibilitu.
            </li>
            <li className="text-gray-700 leading-relaxed text-[1.0625rem]">
              <strong className="text-gray-900 font-medium">Heller, D., Watson, D. &amp; Ilies, R. (2004).</strong> Meta-analýza osobnosti a vztahové spokojenosti, <em>Psychological Bulletin</em> — všech pět dimenzí Velké pětky má signifikantní korelaci, <strong className="text-gray-900 font-medium">Neuroticism je nejsilnější (r = −0,26)</strong>. Empirický základ Vrstvy III sub-modelu Big5 Neuroticism.
            </li>
            <li className="text-gray-700 leading-relaxed text-[1.0625rem]">
              <strong className="text-gray-900 font-medium">Aron, A., Norman, C. C., Aron, E. N., McKenna, C. &amp; Heyman, R. E. (2000).</strong> Couples&apos; shared participation in novel and arousing activities and experienced relationship quality. <em>Journal of Personality and Social Psychology,</em> 78(2), 273–284 — pět studií, n~250 párů. Klíčové zjištění pro Vrstvu VI: novelty + arousal &gt; similarity (sdílené koníčky samy o sobě nejsou prediktor; společně dělat nové a stimulující věci je).
            </li>
          </ul>

          <p className="text-gray-600 leading-[1.75] text-[0.9rem] mt-8 italic">
            Plný akademický aparát (Gottman, Roenneberg, Costa &amp; McCrae, Thomas-Kilmann, Chapman, Perel, Nagoski, Joel-Eastwick-Finkel, Pittenger, Bunt) je v interní dokumentaci.
          </p>
        </section>

        {/* CTA */}
        <section className="bg-white rounded-3xl border border-gray-100 p-10">
          <p className="eyebrow text-pink-500 mb-4">Vyzkoušej</p>
          <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">
            Spusť kvíz.
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8 text-[1.0625rem]">
            Zadej datum narození a uvidíš výsledek za 30 sekund. Bez registrace.
          </p>
          <Link href="/test" className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-full text-base font-medium hover:bg-gray-800 transition">
            Spustit kvíz
          </Link>
        </section>
      </article>
    </main>
  )
}
