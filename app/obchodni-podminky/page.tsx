
import type { Metadata } from 'next'
import Link from 'next/link'

const TITLE = 'Obchodní podmínky | Cosmatch'
const DESC = 'Smluvní podmínky používání Cosmatch.cz — práva a povinnosti uživatelů, předplatné, ukončení smlouvy, řešení sporů.'
const URL = 'https://cosmatch.cz/obchodni-podminky'

export const metadata: Metadata = {
  title: TITLE, description: DESC,
  alternates: { canonical: URL, languages: { 'cs-CZ': URL, 'x-default': URL } },
  openGraph: { title: TITLE, description: DESC, url: URL, type: 'article', siteName: 'Cosmatch', locale: 'cs_CZ' },
}

export default function ObchodniPodminkyPage() {
  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">← Cosmatch</Link>
      </div>

      <article className="max-w-2xl mx-auto px-6 pt-16 pb-24">

        <header className="mb-12">
          <p className="eyebrow text-pink-500 mb-6">Právní dokument</p>
          <h1 className="serif-display text-5xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-6">
            Obchodní<br/><em className="italic text-pink-500">podmínky</em>.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-6" />
          <p className="text-sm text-gray-500">
            Účinné od 17. května 2026 · Verze 1.0
          </p>
        </header>

        <div className="space-y-12 text-gray-800 leading-[1.75] text-[1.0625rem]">

          {/* 1. Úvodní ustanovení */}
          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">1. Úvodní ustanovení</h2>
            <p className="mb-3">
              <strong className="text-gray-900 font-medium">1.1</strong> Tyto obchodní podmínky (dále jen „<strong>Podmínky</strong>") upravují vztah mezi:
            </p>
            <p className="mb-3 pl-4">
              <strong className="text-gray-900 font-medium">Mgr. Ing. Simonou Cibulkovou</strong>, IČO 08419531, se sídlem Pnětluky, Česká republika, datová schránka tttkfnk, provozovatelkou webu cosmatch.cz a stejnojmenné webové aplikace (dále jen „<strong>Provozovatel</strong>" nebo „<strong>Cosmatch</strong>")
            </p>
            <p className="mb-3 pl-4">
              a osobou, která se zaregistruje a používá Cosmatch (dále jen „<strong>Uživatel</strong>").
            </p>
            <p className="mb-3">
              <strong className="text-gray-900 font-medium">1.2</strong> Cosmatch je online seznamovací služba postavená na principu numerologické kompatibility data narození.
            </p>
            <p>
              <strong className="text-gray-900 font-medium">1.3</strong> Vztahy mezi Provozovatelem a Uživatelem se řídí těmito Podmínkami a právním řádem České republiky, zejména zákonem č. 89/2012 Sb. (občanský zákoník).
            </p>
          </section>

          {/* 2. Uzavření smlouvy */}
          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">2. Uzavření smlouvy</h2>
            <p className="mb-3">
              <strong className="text-gray-900 font-medium">2.1</strong> Smlouva o poskytování služeb je uzavřena okamžikem, kdy se Uživatel úspěšně zaregistruje (vytvoří profil) a souhlasí s Podmínkami a Zásadami ochrany osobních údajů.
            </p>
            <p className="mb-3">
              <strong className="text-gray-900 font-medium">2.2</strong> Registraci může provést pouze osoba, která:
            </p>
            <ul className="list-disc pl-10 space-y-1 mb-3">
              <li>je starší 18 let,</li>
              <li>je plně způsobilá k právnímu jednání,</li>
              <li>poskytne pravdivé, úplné a aktuální údaje včetně skutečného data narození,</li>
              <li>nebyla v minulosti vyloučena z používání Cosmatch pro porušení Podmínek.</li>
            </ul>
            <p>
              <strong className="text-gray-900 font-medium">2.3</strong> Datum narození zadané při registraci je <strong className="text-gray-900 font-medium">nezměnitelné</strong> — slouží jako klíč pro výpočet numerologické kompatibility a jakákoli pozdější změna by narušila integritu systému.
            </p>
          </section>

          {/* 3. Tarify */}
          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">3. Tarify a předplatné</h2>
            <p className="mb-4">
              <strong className="text-gray-900 font-medium">3.1</strong> Cosmatch nabízí tři tarify:
            </p>
            <div className="space-y-4 pl-4 mb-4">
              <div>
                <p className="font-medium text-gray-900">Cosmatch Free — 0 Kč</p>
                <p className="text-gray-700 text-[0.95rem]">Neomezené prohlížení profilů, 5 lajků/zpráv denně, základní kompatibilita.</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Cosmatch+ — 249 Kč/měsíc · kvartálně 597 Kč (sleva 20 %) · ročně 2 088 Kč (sleva 30 %)</p>
                <p className="text-gray-700 text-[0.95rem]">Neomezené lajky, hloubková analýza podle data narození, zobrazení kdo Tě lajknul, prioritní zobrazení profilu.</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Cosmatch Serious — připravuje se (bude k dispozici později)</p>
                <p className="text-gray-700 text-[0.95rem]">Vše z Cosmatch+ plus povinná ID verifikace, štítek „Ověřeno", prémiové filtry, prioritní matchmaking.</p>
              </div>
            </div>
            <p className="mb-3">
              <strong className="text-gray-900 font-medium">3.2</strong> Ceny jsou uvedeny včetně DPH. Platí se měsíčně, automaticky se obnovují.
            </p>
            <p className="mb-3">
              <strong className="text-gray-900 font-medium">3.3</strong> Platby zpracovává společnost <strong className="text-gray-900 font-medium">GoPay s.r.o.</strong> (Česká republika, IČO 26046768), platební instituce regulovaná Českou národní bankou. Faktura je vystavena automaticky a zaslána na e-mail.
            </p>
            <p>
              <strong className="text-gray-900 font-medium">3.4</strong> Cosmatch může ceny upravit s minimálně 30denním předstihem. O změně je Uživatel informován e-mailem. Uživatel má právo do účinnosti změny předplatné zrušit.
            </p>
          </section>

          {/* 4. Odstoupení od smlouvy */}
          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">4. Odstoupení od smlouvy a refundace</h2>
            <p className="mb-3">
              <strong className="text-gray-900 font-medium">4.1</strong> Uživatel-spotřebitel má dle § 1829 občanského zákoníku právo odstoupit od smlouvy o předplatném do <strong className="text-gray-900 font-medium">14 dnů</strong> od jejího uzavření bez udání důvodu.
            </p>
            <p className="mb-3">
              <strong className="text-gray-900 font-medium">4.2</strong> Pro odstoupení stačí napsat na <a href="mailto:ahoj@cosmatch.cz" className="text-pink-500 underline">ahoj@cosmatch.cz</a>. Cosmatch refund provede do 14 dnů na stejný platební prostředek.
            </p>
            <p className="mb-3">
              <strong className="text-gray-900 font-medium">4.3</strong> Po uplynutí 14 dnů vyhodnocujeme refundace případ od případu. Pokud aplikace prokazatelně nefungovala (technický výpadek), refundujeme alikvotní část.
            </p>
            <p>
              <strong className="text-gray-900 font-medium">4.4</strong> Předplatné lze kdykoli zrušit přes profil. Zbývající dny aktivního období zůstanou Uživateli k dispozici.
            </p>
          </section>

          {/* 5. Práva a povinnosti Uživatele */}
          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">5. Práva a povinnosti Uživatele</h2>
            <p className="mb-3">
              <strong className="text-gray-900 font-medium">6.1 Uživatel se zavazuje:</strong>
            </p>
            <ul className="list-disc pl-10 space-y-2 mb-4">
              <li>používat Cosmatch v souladu s těmito Podmínkami a právním řádem ČR,</li>
              <li>uvádět pravdivé údaje o sobě (jméno, věk, datum narození, fotky),</li>
              <li>respektovat ostatní Uživatele — žádné obtěžování, šikana, nenávist, nebo sexuálně explicitní obsah bez souhlasu,</li>
              <li>nepoužívat aplikaci pro komerční účely (prodej zboží, prostituce, propagace produktů),</li>
              <li>neporušovat práva duševního vlastnictví třetích osob (fotky musí být tvoje vlastní nebo s licencí),</li>
              <li>chránit své přihlašovací údaje (Google/Facebook účet) před zneužitím.</li>
            </ul>
            <p>
              <strong className="text-gray-900 font-medium">6.2 Uživatel má právo:</strong> kdykoli ukončit používání Cosmatch, smazat svůj profil, požádat o export/výmaz dat, kontaktovat podporu, podat stížnost.
            </p>
          </section>

          {/* 6. Zakázané chování */}
          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">6. Zakázané chování a sankce</h2>
            <p className="mb-3">
              <strong className="text-gray-900 font-medium">6.1</strong> V aplikaci je zakázáno zejména:
            </p>
            <ul className="list-disc pl-10 space-y-1 mb-4">
              <li>vytvářet fake profily nebo profily s cizími fotkami,</li>
              <li>zadávat nepravdivé datum narození,</li>
              <li>obtěžovat, vyhrožovat, urážet jiné Uživatele,</li>
              <li>posílat sexuálně explicitní obsah bez souhlasu příjemce,</li>
              <li>provádět romance scams, podvody, finanční nátlak,</li>
              <li>nabízet placené sexuální služby (prostituce),</li>
              <li>propagovat třetí strany (MLM, kryptomeny, závadné weby),</li>
              <li>používat automatizované nástroje (boty, scrapery),</li>
              <li>obcházet bezpečnostní opatření (Turnstile, rate limiting).</li>
            </ul>
            <p className="mb-3">
              <strong className="text-gray-900 font-medium">6.2</strong> Porušení vede k <strong className="text-gray-900 font-medium">okamžitému zablokování účtu</strong> bez nároku na vrácení předplatného. V závažných případech (romance scams, dětská pornografie) Cosmatch nahlásí věc orgánům činným v trestním řízení.
            </p>
            <p>
              <strong className="text-gray-900 font-medium">6.3</strong> Cosmatch měsíčně zveřejňuje transparentní statistiky zablokovaných účtů na stránce <Link href="/verifikace" className="text-pink-500 underline">verifikace</Link>.
            </p>
          </section>

          {/* 7. Odpovědnost */}
          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">7. Vyloučení a omezení odpovědnosti</h2>
            <p className="mb-3">
              <strong className="text-gray-900 font-medium">7.1</strong> Cosmatch je technologická platforma. <strong className="text-gray-900 font-medium">Cosmatch negarantuje</strong>, že Uživatel najde partnera, že shoda povede k úspěšnému vztahu, ani správnost údajů poskytnutých jinými Uživateli.
            </p>
            <p className="mb-3">
              <strong className="text-gray-900 font-medium">7.2</strong> Cosmatch používá numerologické a astrologické vzorce k odhadu strukturálního souznění mezi dvěma lidmi. <strong className="text-gray-900 font-medium">Numerologie a astrologie nejsou vědecky validované jako spolehlivé prediktory vztahových výsledků.</strong> Cosmatch shoda je interpretační nástroj, ne predikce. Žádná aplikace nedokáže garantovat úspěch vztahu — záleží na vás, jak ho dokážete vybudovat.
            </p>
            <p className="mb-3">
              <strong className="text-gray-900 font-medium">7.3</strong> Cosmatch neodpovídá za chování Uživatelů v reálném světě po seznámení přes aplikaci. Uživatelům doporučujeme dodržovat základní bezpečnostní pravidla: první schůzku v veřejném prostoru, informovat blízké, neposílat peníze cizím lidem.
            </p>
            <p>
              <strong className="text-gray-900 font-medium">7.4</strong> Cosmatch usiluje o nepřetržitý provoz, ale neodpovídá za výpadky způsobené třetími stranami (Cloudflare, Supabase, internet provider).
            </p>
          </section>

          {/* 8. Ukončení smlouvy */}
          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">8. Ukončení smlouvy</h2>
            <p className="mb-3">
              <strong className="text-gray-900 font-medium">8.1</strong> Uživatel může smlouvu kdykoli vypovědět smazáním profilu v aplikaci. Data jsou nevratně smazána do 30 dnů.
            </p>
            <p className="mb-3">
              <strong className="text-gray-900 font-medium">8.2</strong> Cosmatch může smlouvu vypovědět při hrubém porušení Podmínek (viz čl. 7) bez výpovědní lhůty.
            </p>
            <p>
              <strong className="text-gray-900 font-medium">8.3</strong> Cosmatch může službu ukončit jako celek s minimálně 90denním předstihem. Uživatelé jsou informováni e-mailem a mají možnost export dat.
            </p>
          </section>

          {/* 9. Řešení sporů */}
          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">9. Řešení sporů</h2>
            <p className="mb-3">
              <strong className="text-gray-900 font-medium">9.1</strong> V případě sporu se Uživatel může obrátit na Cosmatch e-mailem na <a href="mailto:ahoj@cosmatch.cz" className="text-pink-500 underline">ahoj@cosmatch.cz</a>. Cosmatch se zavazuje k pokusu o mimosoudní řešení.
            </p>
            <p className="mb-3">
              <strong className="text-gray-900 font-medium">9.2</strong> K mimosoudnímu řešení spotřebitelských sporů je příslušná <strong className="text-gray-900 font-medium">Česká obchodní inspekce</strong> (<a href="https://www.coi.cz" target="_blank" rel="noopener" className="text-pink-500 underline">coi.cz</a>). Pro online spory lze využít platformu <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener" className="text-pink-500 underline">ec.europa.eu/consumers/odr</a>.
            </p>
            <p>
              <strong className="text-gray-900 font-medium">9.3</strong> Pokud spor nelze vyřešit mimosoudně, je příslušný obecný soud podle bydliště Uživatele-spotřebitele.
            </p>
          </section>

          {/* 10. Závěrečná */}
          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">10. Závěrečná ustanovení</h2>
            <p className="mb-3">
              <strong className="text-gray-900 font-medium">10.1</strong> Pokud se jakékoli ustanovení Podmínek stane neplatným, platnost ostatních ustanovení tím není dotčena.
            </p>
            <p className="mb-3">
              <strong className="text-gray-900 font-medium">10.2</strong> Cosmatch může Podmínky měnit. O změně je Uživatel informován e-mailem minimálně 30 dnů předem. Pokud se změnami nesouhlasí, může smlouvu vypovědět bez sankce.
            </p>
            <p>
              <strong className="text-gray-900 font-medium">10.3</strong> Tyto Podmínky nabývají účinnosti dnem zveřejnění na cosmatch.cz/obchodni-podminky.
            </p>
          </section>
        </div>

        <footer className="mt-16 pt-12 border-t border-gray-200">
          <p className="text-xs text-gray-400 leading-relaxed">
            Mgr. Ing. Simona Cibulková · IČO 08419531 · Pnětluky, Česká republika · Datová schránka: tttkfnk · <a href="mailto:ahoj@cosmatch.cz" className="text-pink-500 underline">ahoj@cosmatch.cz</a>
            <br /><br />
            <strong>Doporučujeme:</strong> Před spuštěním Cosmatch pro veřejnost doporučujeme nechat tyto Podmínky zkontrolovat advokátem se specializací na e-commerce a ochranu spotřebitele. Tato verze byla vytvořena na základě českého práva a GDPR best practices, ale není individuálním právním poradenstvím.
          </p>
        </footer>
      </article>
    </main>
  )
}
