
import type { Metadata } from 'next'
import Link from 'next/link'

const TITLE = 'Zásady ochrany osobních údajů (GDPR) | Cosmatch'
const DESC = 'Jak Cosmatch zpracovává tvoje osobní údaje podle GDPR. Co sbíráme, proč, jak dlouho uchováváme a jaká máš práva.'
const URL = 'https://cosmatch.cz/zasady-ochrany-osobnich-udaju'

export const metadata: Metadata = {
  title: TITLE, description: DESC,
  alternates: { canonical: URL, languages: { 'cs-CZ': URL, 'x-default': URL } },
  openGraph: { title: TITLE, description: DESC, url: URL, type: 'article', siteName: 'Cosmatch', locale: 'cs_CZ' },
}

export default function GdprPage() {
  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">← Cosmatch</Link>
      </div>

      <article className="max-w-2xl mx-auto px-6 pt-16 pb-24">

        <header className="mb-12">
          <p className="eyebrow text-pink-500 mb-6">Právní dokument</p>
          <h1 className="serif-display text-5xl text-gray-900 font-medium leading-[1.05] tracking-tight mb-6">
            Zásady<br/>ochrany <em className="italic text-pink-500">osobních údajů</em>.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-6" />
          <p className="text-sm text-gray-500">
            Účinné od 17. května 2026 · Verze 1.0
          </p>
        </header>

        <div className="space-y-12 text-gray-800 leading-[1.75] text-[1.0625rem]">

          {/* TLDR */}
          <section className="bg-pink-50 border border-pink-200 rounded-3xl p-8">
            <p className="eyebrow text-pink-500 mb-3">Ve zkratce</p>
            <p>
              Sbíráme jen to, co potřebujeme — e-mail, datum narození, fotky, preference. Nikdy neprodáváme tvoje data. Můžeš si je kdykoli stáhnout nebo požádat o jejich smazání. Provozujeme servery v EU (Frankfurt). Pokud máš otázku, napiš na <a href="mailto:ahoj@cosmatch.cz" className="text-pink-500 underline">ahoj@cosmatch.cz</a>.
            </p>
          </section>

          {/* 1. Správce */}
          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">1. Kdo zpracovává tvoje data</h2>
            <p className="mb-3">
              <strong className="text-gray-900 font-medium">Správcem osobních údajů</strong> ve smyslu Nařízení EU 2016/679 (GDPR) je:
            </p>
            <p className="mb-3">
              <strong className="text-gray-900 font-medium">Mgr. Ing. Simona Cibulková</strong><br/>
              IČO: 08419531<br/>
              Sídlo: Praha, Česká republika<br/>
              Datová schránka: <strong className="text-gray-900 font-medium">tttkfnk</strong><br/>
              E-mail: <a href="mailto:ahoj@cosmatch.cz" className="text-pink-500 underline">ahoj@cosmatch.cz</a>
            </p>
            <p>
              Provozovatel webu <strong className="text-gray-900 font-medium">cosmatch.cz</strong> a stejnojmenné webové aplikace.
            </p>
          </section>

          {/* 2. Jaká data sbíráme */}
          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">2. Jaká data sbíráme a proč</h2>

            <h3 className="serif text-xl text-gray-900 font-medium mb-2 mt-6">2.1 Identifikační údaje</h3>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li><strong className="text-gray-900 font-medium">E-mail</strong> — pro přihlášení a komunikaci. Získáváme z tvého Google nebo Facebook účtu (OAuth) nebo přímo od tebe.</li>
              <li><strong className="text-gray-900 font-medium">Jméno</strong> — jak chceš být oslovován/a.</li>
              <li><strong className="text-gray-900 font-medium">Datum narození</strong> — pro výpočet kompatibility podle data narození (klíčová funkce aplikace).</li>
            </ul>

            <h3 className="serif text-xl text-gray-900 font-medium mb-2 mt-6">2.2 Profilové údaje</h3>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Fotky (jedna povinná, max šest), bio, povolání, vzdělání, zájmy, pohlaví, preferované pohlaví, věkové rozmezí partnera, záměr vztahu.</li>
              <li>Volitelně: čas a místo narození, životní filozofie, rodinné plány, lifestyle (kouření, alkohol, dieta).</li>
            </ul>

            <h3 className="serif text-xl text-gray-900 font-medium mb-2 mt-6">2.3 Lokalizace</h3>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Město a země pro filtrování profilů ve tvém okolí.</li>
              <li>Pokud povolíš GPS, ukládáme přibližnou polohu (přesnost cca 1 km) pro výpočet vzdálenosti.</li>
            </ul>

            <h3 className="serif text-xl text-gray-900 font-medium mb-2 mt-6">2.4 Interakce</h3>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Lajky, shody (matches), zprávy mezi shodami, čas posledního přihlášení.</li>
            </ul>

            <h3 className="serif text-xl text-gray-900 font-medium mb-2 mt-6">2.5 Zvláštní právní základ pro datum narození (čl. 9 GDPR)</h3>
            <p className="mb-3">
              Datum narození používá Cosmatch nejen pro ověření plnoletosti (18+), ale také jako vstup do algoritmu kompatibility podle data narození. Tento výpočet vychází z numerologické tradice a může být interpretován jako zpracování údajů, které mohou nepřímo vypovídat o filozofickém přesvědčení uživatele ve smyslu <strong className="text-gray-900 font-medium">čl. 9 odst. 1 GDPR</strong> (zvláštní kategorie osobních údajů).
            </p>
            <p className="mb-3">
              Z opatrnosti proto Cosmatch zpracovává datum narození pro účely kompatibility na základě <strong className="text-gray-900 font-medium">výslovného souhlasu</strong> uživatele dle čl. 9 odst. 2 písm. a) GDPR. Tento souhlas uživatel uděluje aktivně při registraci samostatným zaškrtnutím („Souhlasím se zpracováním data narození pro výpočet kompatibility podle data narození“).
            </p>
            <p className="mb-3">
              Souhlas lze kdykoli odvolat — buď e‑mailem na <a href="mailto:ahoj@cosmatch.cz" className="text-pink-500 underline">ahoj@cosmatch.cz</a>, nebo smazáním účtu v profilu. Odvolání souhlasu nemá zpětnou účinnost na zpracování provedené před odvoláním. Odvoláním souhlasu skončí funkce kompatibility a profil se vrátí na základní režim (případně bude smazán dle volby uživatele).
            </p>
            <p className="mb-3">
              <strong className="text-gray-900 font-medium">Vědecký status:</strong> Numerologie a astrologie nejsou vědecky validované jako spolehlivé prediktory vztahových výsledků. Cosmatch je prezentuje jako interpretační framework, nikoli jako predikci. Detaily viz <a href="/jak-funguje-cosmatch" className="text-pink-500 underline">Jak funguje Cosmatch</a>.
            </p>


            <h3 className="serif text-xl text-gray-900 font-medium mb-2 mt-6">2.6 Platební údaje (Cosmatch+)</h3>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Předplatné Cosmatch+ je dostupné výhradně v mobilní aplikaci pro iOS a Android. Platby zpracovává <strong className="text-gray-900 font-medium">Apple Distribution International Ltd.</strong> (Irsko) pro iOS uživatele, respektive <strong className="text-gray-900 font-medium">Google Commerce Limited</strong> (Irsko) pro Android uživatele. Oba subjekty jsou samostatní správci osobních údajů.</li>
              <li>Cosmatch dostává od Apple / Google pouze identifikátor předplatného a stav (aktivní / neaktivní) — nikdy ne čísla platebních karet ani biometrické údaje použité k autorizaci platby.</li>
              <li>Pro detail zpracování dat ze strany Apple viz <a href="https://www.apple.com/legal/privacy/cz/" target="_blank" rel="noopener" className="text-pink-500 underline">Zásady ochrany soukromí Apple</a>. Pro Google viz <a href="https://policies.google.com/privacy?hl=cs" target="_blank" rel="noopener" className="text-pink-500 underline">Zásady ochrany soukromí Google</a>.</li>
            </ul>
            </section>

          {/* 3. Právní základ */}
          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">3. Právní základ zpracování</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-gray-900 font-medium">Plnění smlouvy</strong> (čl. 6 odst. 1 písm. b GDPR) — vytvoření a správa tvého profilu, párování, zprávy, platby.</li>
              <li><strong className="text-gray-900 font-medium">Souhlas</strong> (čl. 6 odst. 1 písm. a GDPR) — geolokace, marketingové e-maily.</li>
              <li><strong className="text-gray-900 font-medium">Oprávněný zájem</strong> (čl. 6 odst. 1 písm. f GDPR) — bezpečnostní logy (anti-bot, anti-scam), prevence podvodů.</li>
              <li><strong className="text-gray-900 font-medium">Právní povinnost</strong> (čl. 6 odst. 1 písm. c GDPR) — uchování fakturačních dokladů (zákon 235/2004 Sb. o DPH — 10 let).</li>
            </ul>
          </section>

          {/* 4. Sdílení dat */}
          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">4. Komu data předáváme</h2>
            <p className="mb-4">
              <strong className="text-gray-900 font-medium">Cosmatch nikdy neprodává tvoje data třetím stranám.</strong> Předáváme je výhradně zpracovatelům, kteří potřebují plnit konkrétní funkci:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-gray-900 font-medium">Supabase (USA, EU servery)</strong> — databáze a autentizace. Servery ve Frankfurtu (EU). <a href="https://supabase.com/privacy" target="_blank" rel="noopener" className="text-pink-500 underline">Zásady Supabase</a></li>
              <li><strong className="text-gray-900 font-medium">Cloudflare (USA, globální)</strong> — hosting webu, DDoS ochrana, CDN. <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener" className="text-pink-500 underline">Zásady Cloudflare</a></li>
              <li><strong className="text-gray-900 font-medium">Apple Distribution International Ltd. (Irsko)</strong> — zpracování plateb pro iOS uživatele přes Apple App Store. <a href="https://www.apple.com/legal/privacy/cz/" target="_blank" rel="noopener" className="text-pink-500 underline">Zásady Apple</a></li>
              <li><strong className="text-gray-900 font-medium">Google Commerce Limited (Irsko)</strong> — zpracování plateb pro Android uživatele přes Google Play. <a href="https://policies.google.com/privacy?hl=cs" target="_blank" rel="noopener" className="text-pink-500 underline">Zásady Google</a></li>
              <li><strong className="text-gray-900 font-medium">Google (Irsko)</strong> — Google OAuth pro přihlášení.</li>
              <li><strong className="text-gray-900 font-medium">Meta (Irsko)</strong> — Facebook OAuth pro přihlášení.</li>
              <li><strong className="text-gray-900 font-medium">Resend (USA)</strong> — odesílání transakčních e-mailů (potvrzení registrace, voucher).</li>
            </ul>
            <p className="mt-4">
              Pokud se některý zpracovatel nachází mimo EU/EHP, předání dat je zabezpečeno standardními smluvními doložkami schválenými Evropskou komisí.
            </p>
          </section>

          {/* 5. Doba uchování */}
          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">5. Jak dlouho data uchováváme</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-gray-900 font-medium">Profilové údaje</strong> — po dobu existence tvého účtu. Po smazání účtu jsou data nevratně smazána do 30 dnů.</li>
              <li><strong className="text-gray-900 font-medium">Zprávy</strong> — uchováváme po dobu trvání shody. Po smazání shody jsou zprávy obou stran smazány.</li>
              <li><strong className="text-gray-900 font-medium">Bezpečnostní logy</strong> — 90 dnů (nutné pro detekci podvodů).</li>
              <li><strong className="text-gray-900 font-medium">Fakturační údaje</strong> — 10 let (zákonná povinnost).</li>
              <li><strong className="text-gray-900 font-medium">E-mail po smazání účtu</strong> — uchováváme hash e-mailu (ne plain text) v interní blacklist databázi, abychom zabránili registraci osob, kteří porušili podmínky. Lze požádat o vymazání i z této databáze.</li>
            </ul>
          </section>

          {/* 6. Tvoje práva */}
          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">6. Tvoje práva podle GDPR</h2>
            <p className="mb-4">Můžeš kdykoli uplatnit tato práva tím, že napíšeš na <a href="mailto:ahoj@cosmatch.cz" className="text-pink-500 underline">ahoj@cosmatch.cz</a>:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-gray-900 font-medium">Právo na přístup</strong> — můžeš si vyžádat kopii všech tvých dat (do 30 dnů).</li>
              <li><strong className="text-gray-900 font-medium">Právo na opravu</strong> — pokud máš v profilu chybu, oprav ji (kromě data narození, které je z technických důvodů uzamčené po registraci).</li>
              <li><strong className="text-gray-900 font-medium">Právo na výmaz („právo být zapomenut“)</strong> — smazat účet a všechna data můžeš v profilu jedním klikem. Realizace do 30 dnů.</li>
              <li><strong className="text-gray-900 font-medium">Právo na omezení zpracování</strong> — můžeš požádat o pozastavení zpracování (např. během řešení sporu).</li>
              <li><strong className="text-gray-900 font-medium">Právo na přenositelnost dat</strong> — pošleme ti tvoje data ve strojově čitelném formátu (JSON).</li>
              <li><strong className="text-gray-900 font-medium">Právo vznést námitku</strong> — proti zpracování na základě oprávněného zájmu.</li>
              <li><strong className="text-gray-900 font-medium">Právo odvolat souhlas</strong> — kdykoli pro geolokaci a marketing.</li>
              <li><strong className="text-gray-900 font-medium">Právo podat stížnost</strong> — u <a href="https://www.uoou.cz" target="_blank" rel="noopener" className="text-pink-500 underline">Úřadu pro ochranu osobních údajů</a> (Pplk. Sochora 27, 170 00 Praha 7).</li>
            </ul>
          </section>

          {/* 7. Cookies */}
          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">7. Cookies a sledovací technologie</h2>
            <p className="mb-3">
              Cosmatch používá minimální cookies — jen ty technicky nezbytné pro fungování aplikace:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-gray-900 font-medium">Supabase auth cookie</strong> — pro tvoji přihlášenou session (povinné).</li>
              <li><strong className="text-gray-900 font-medium">Cloudflare cf-clearance</strong> — anti-bot ochrana (povinné).</li>
              <li><strong className="text-gray-900 font-medium">localStorage „cosmatch_user“</strong> — cache tvého profilu pro rychlejší načítání.</li>
              <li><strong className="text-gray-900 font-medium">localStorage „cosmatch_daily_swipes“</strong> — počítadlo denních lajků (pro Free tier).</li>
            </ul>
            <p className="mt-3">
              <strong className="text-gray-900 font-medium">Cosmatch nepoužívá</strong> Google Analytics, Facebook Pixel, Hotjar ani jiné sledovací nástroje třetích stran. Žádné reklamní cookies. Žádné cross-site tracking.
            </p>
          </section>

          {/* 8. Děti */}
          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">8. Děti</h2>
            <p>
              Cosmatch je určen výhradně osobám starším <strong className="text-gray-900 font-medium">18 let</strong>. Aktivně bráníme registraci nezletilým (kontrola data narození při registraci). Pokud zjistíš, že se na Cosmatch zaregistrovala nezletilá osoba, dej nám prosím okamžitě vědět na ahoj@cosmatch.cz — okamžitě její účet zablokujeme.
            </p>
          </section>

          {/* 9. Zabezpečení */}
          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">9. Zabezpečení dat</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Servery běží v EU (Frankfurt) v ISO/IEC 27001 certifikovaných datových centrech.</li>
              <li>Veškerá komunikace je šifrována přes HTTPS (TLS 1.3).</li>
              <li>Hesla u nás <strong className="text-gray-900 font-medium">neexistují</strong> — používáme jen Google/Facebook SSO, takže nemůžeme heslo ztratit.</li>
              <li>Row Level Security na úrovni databáze — nikdo nevidí cizí zprávy, lajky, ani profily mimo dating feed.</li>
              <li>V případě porušení zabezpečení (data breach) tě informujeme do 72 hodin podle čl. 33 GDPR.</li>
            </ul>
          </section>

          {/* 10. Změny */}
          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">10. Změny těchto zásad</h2>
            <p>
              Pokud změníme zásady, oznámíme to e-mailem všem aktivním uživatelům alespoň 30 dní předem. Pokud se změnami nesouhlasíš, můžeš ukončit používání aplikace a požádat o smazání účtu.
            </p>
          </section>

          {/* 11. Kontakt */}
          <section>
            <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-4">11. Kontakt</h2>
            <p>
              Pro otázky k ochraně osobních údajů piš na <a href="mailto:ahoj@cosmatch.cz" className="text-pink-500 underline">ahoj@cosmatch.cz</a>. Odpovídáme do 30 dnů, obvykle do 48 hodin.
            </p>
          </section>
        </div>

        {/* Disclaimer */}
        <footer className="mt-16 pt-12 border-t border-gray-200">
          <p className="text-xs text-gray-400 leading-relaxed">
            Tento dokument je vyhotoven v souladu s nařízením Evropského parlamentu a Rady (EU) 2016/679 (GDPR) a zákonem č. 110/2019 Sb. o zpracování osobních údajů.
            <br /><br />
            <strong>Doporučujeme:</strong> Před spuštěním Cosmatch pro veřejnost doporučujeme nechat tyto zásady zkontrolovat advokátem se specializací na ochranu osobních údajů. Tato verze byla vytvořena na základě GDPR best practices, ale není individuálním právním poradenstvím.
          </p>
        </footer>
      </article>
    </main>
  )
}
