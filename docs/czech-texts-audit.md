# Czech text audit — všechny user-facing texty v aplikaci

> Cíl: najít czenglish, anglicismy, nešikovné formulace. Každá sekce = jedna stránka/komponenta.

> Označení v textu: 🚩 = automaticky flagged podezřelé. **Tučně** = mé doporučení k úpravě.

---


## Landing (`/`)

<sub>Soubor: `app/page.tsx` · 24 textů</sub>

| # | Řádek | Text | Flag |
| --- | --- | --- | --- |
| 1 | 31 | Seznamka podle data narození |  |
| 2 | 33 | se kterým |  |
| 3 | 33 | dává život smysl |  |
| 4 | 39 | 12 archetypů, 7 vrstev kompatibility, žádný horoskop. |  |
| 5 | 67 | Z Manifestu důvěry |  |
| 6 | 83 | Co o nás Češích říkají data |  |
| 7 | 88 | obtížné |  |
| 8 | 95 | Mezi ženami-uživatelkami internetu |  |
| 9 | 119 | Jak to funguje |  |
| 10 | 157 | Pět kategorií vztahu |  |
| 11 | 159 | vytváří jiný příběh |  |
| 12 | 198 | Co Cosmatch nedělá |  |
| 13 | 200 | Doručí Ti |  |
| 14 | 200 | kvalitní shody |  |
| 15 | 228 | Začni třeba hned teď |  |
| 16 | 252 | © 2026 · Mgr. Ing. Simona Cibulková · IČO 08419531 · Praha 5 |  |
| 17 | 265 | Kvíz |  |
| 18 | 267 | Manifest důvěry |  |
| 19 | 268 | Bezpečnost |  |
| 20 | 270 | Přihlásit |  |
| 21 | 276 | Právní |  |
| 22 | 279 | Obchodní podmínky |  |
| 23 | 280 | Opakované platby |  |
| 24 | 282 | Odstoupení |  |

## Přihlášení (`/login`)

<sub>Soubor: `app/login/page.tsx` · 2 textů</sub>

| # | Řádek | Text | Flag |
| --- | --- | --- | --- |
| 1 | 31 | Vítej zpátky |  |
| 2 | 33 | přestal/a |  |

## Objevuj (`/discover`)

<sub>Soubor: `app/discover/page.tsx` · 9 textů</sub>

| # | Řádek | Text | Flag |
| --- | --- | --- | --- |
| 1 | 439 | Načítám profily… |  |
| 2 | 449 | Magický moment |  |
| 3 | 451 | vesmír Tě zná |  |
| 4 | 462 | Pokračovat v hledání |  |
| 5 | 488 | Dnešní swipy | 🚩 czenglish "swipe" → "švihnout" |
| 6 | 500 | Odpovídej na otázky pro přesnější skóre |  |
| 7 | 505 | Na dnešek máš hotovo |  |
| 8 | 508 | 249 Kč/měs · Zrušení kdykoliv |  |
| 9 | 519 | Momentálně nic dalšího |  |

## Shody (`/matches`)

<sub>Soubor: `app/matches/page.tsx` · 5 textů</sub>

| # | Řádek | Text | Flag |
| --- | --- | --- | --- |
| 1 | 163 | Načítám… |  |
| 2 | 177 | Tvoje shody | 🚩 možná tykání bez velkého písmene (style: T/t) |
| 3 | 179 | čeká |  |
| 4 | 202 | Kosmické shody |  |
| 5 | 321 | Otevřít profil → |  |

## Profil (`/profile`) — Hinge-style editor

<sub>Soubor: `app/profile/page.tsx` · 53 textů</sub>

| # | Řádek | Text | Flag |
| --- | --- | --- | --- |
| 1 | 115 | Hlavní |  |
| 2 | 134 | JPG / PNG / WebP · max 10 MB · klikni Hlavní pro přesun na první místo |  |
| 3 | 231 | Zájmy |  |
| 4 | 253 | Přidej zájem (např. Jóga) |  |
| 5 | 280 | Žádné zájmy. Klikni Upravit a přidej co Tě baví. |  |
| 6 | 334 | Tvoje odpovědi | 🚩 možná tykání bez velkého písmene (style: T/t) |
| 7 | 352 | Tvoje odpověď… | 🚩 možná tykání bez velkého písmene (style: T/t) |
| 8 | 490 | Hlasová zpráva |  |
| 9 | 500 | Smazat hlasovou zprávu |  |
| 10 | 579 | Načítám profil… |  |
| 11 | 619 | Přidej svoji první fotku níže |  |
| 12 | 652 | O mně |  |
| 13 | 652 | Napiš o sobě pár vět — co Tě baví, co hledáš, jaký vztah Ti dává smysl. |  |
| 14 | 670 | Životní filozofie |  |
| 15 | 670 | Jednou větou Tvoje hlavní pravidlo nebo motto. | 🚩 možná tykání bez velkého písmene (style: T/t) |
| 16 | 676 | Tvůj otisk osudu |  |
| 17 | 684 | Tvůj MBTI typ |  |
| 18 | 690 | Vypočteno ze 4 dimenzí (E/I + N/S + T/F + J/P) podle Myers-Briggs Type Indicator. |  |
| 19 | 698 | Odemkni hloubku, neomezené lajky. |  |
| 20 | 699 | Cosmatch+ od 249 Kč/měs (kvartálně 597 Kč · ročně 2 088 Kč, sleva 30 %). |  |
| 21 | 700 | Prohlédnout plány → |  |
| 22 | 707 | Co Ti budeme ukazovat |  |
| 23 | 711 | Minimální kompatibilita |  |
| 24 | 712 | Profily pod tuto hranici se Ti nezobrazí. |  |
| 25 | 737 | Jen Spřízněné duše |  |
| 26 | 738 | Zobrazí se Ti jen profily Soul Mates kategorie. |  |
| 27 | 746 | Jen oboustranná kompatibilita ↔ |  |
| 28 | 747 | Jen profily, kde jste si vzájemně kompatibilní. |  |
| 29 | 756 | Vylučovací podmínky |  |
| 30 | 757 | Koho nechci vidět |  |
| 31 | 765 | Kouření je deal-breaker |  |
| 32 | 766 | Pravidelní kuřáci se nezobrazí. (Občasní ano.) |  |
| 33 | 777 | Lidé pijící pravidelně se nezobrazí. |  |
| 34 | 788 | Lidé užívající pravidelně se nezobrazí. |  |
| 35 | 798 | Fyzické preference |  |
| 36 | 799 | Co Tě zajímá |  |
| 37 | 801 | Výška partnera |  |
| 38 | 802 | Profily mimo rozsah se nezobrazí. |  |
| 39 | 819 | Nezaškrtnuté = kdokoli. |  |
| 40 | 840 | Manifest důvěry |  |
| 41 | 846 | Nastavení |  |
| 42 | 864 | Odhlášení |  |
| 43 | 865 | Odhlásit se? |  |
| 44 | 866 | Vrátíš se na přihlašovací obrazovku. Tvůj profil zůstává — můžeš se vrátit kdykoli. |  |
| 45 | 868 | Zůstat |  |
| 46 | 869 | Odhlásit |  |
| 47 | 879 | Trvalé smazání účtu |  |
| 48 | 880 | Opravdu chceš smazat svůj účet? |  |
| 49 | 881 | Účet bude okamžitě zneaktivněn a zmizí z aplikace. |  |
| 50 | 882 | Tvá data se trvale smažou za 30 dní. Do té doby můžeš poslat e-mail přes |  |
| 51 | 882 | kontaktní formulář |  |
| 52 | 882 | a účet obnovíme. Po 30 dnech je nevratné. |  |
| 53 | 884 | Zrušit |  |

## Kvíz archetyp (`/test`)

<sub>Soubor: `app/test/page.tsx` · 20 textů</sub>

| # | Řádek | Text | Flag |
| --- | --- | --- | --- |
| 1 | 373 | Numerologický kvíz |  |
| 2 | 375 | přitahuješ |  |
| 3 | 375 | stejný typ |  |
| 4 | 412 | Datum narození |  |
| 5 | 423 | Tvoje jméno | 🚩 možná tykání bez velkého písmene (style: T/t) |
| 6 | 423 | (volitelné) |  |
| 7 | 428 | Tak, jak chceš být oslovován |  |
| 8 | 502 | Mistrovské číslo — jedna z nejvzácnějších numerologických vibrací. |  |
| 9 | 505 | Společný rys s desetinou Čechů. |  |
| 10 | 543 | V lásce |  |
| 11 | 550 | Stín |  |
| 12 | 557 | Nejlépe Ti sedí čísla |  |
| 13 | 578 | Co Tě čeká v aplikaci |  |
| 14 | 583 | numerologický základ |  |
| 15 | 584 | kompletní profil podle dne narození |  |
| 16 | 642 | Město |  |
| 17 | 642 | (volitelné) |  |
| 18 | 685 | Tvoje pozice ve waitlistu | 🚩 možná tykání bez velkého písmene (style: T/t) |
| 19 | 697 | Posuň se v pořadí |  |
| 20 | 758 | Tvůj voucher |  |

## Verifikace (`/verifikace`)

<sub>Soubor: `app/verifikace/page.tsx` · 16 textů</sub>

| # | Řádek | Text | Flag |
| --- | --- | --- | --- |
| 1 | 38 | Bezpečnost |  |
| 2 | 40 | ověřuje |  |
| 3 | 51 | Dvě vrstvy |  |
| 4 | 60 | Bot-shield při registraci |  |
| 5 | 66 | Dále používáme další ochranu jako rate limiting na úrovni Cloudflare WAF, honeypot pole, IP throttling a další. |  |
| 6 | 79 | Žádné e-maily od botů, žádné fake registrace. |  |
| 7 | 88 | Co děláme po nahlášení |  |
| 8 | 99 | Profil je v řádech minut dočasně skrytý z feedu, dokud nezkontrolujeme platnost nahlášení. |  |
| 9 | 103 | Pokud potvrdíme scam, účet trvale smažeme a zápisem do interní blacklist databáze předejdeme opakované registraci. |  |
| 10 | 107 | Jednou měsíčně zveřejníme veřejně dostupné statistiky reportů — kolik účtů bylo zablokovaných. |  |
| 11 | 116 | Statistiky reportů |  |
| 12 | 121 | Květen 2026 · od spuštění |  |
| 13 | 125 | přijatých reportů |  |
| 14 | 129 | zablokovaných profilů |  |
| 15 | 133 | ověřených uživatelů |  |
| 16 | 145 | nahlas nám to přes kontaktní formulář |  |

## Manifest důvěry (`/manifest-duvery`)

<sub>Soubor: `app/manifest-duvery/page.tsx` · 11 textů</sub>

| # | Řádek | Text | Flag |
| --- | --- | --- | --- |
| 1 | 94 | Manifest důvěry |  |
| 2 | 96 | kterými se Ti |  |
| 3 | 152 | Konkrétně k bezpečnosti |  |
| 4 | 155 | Nehrajeme na slepou bábu. |  |
| 5 | 159 | 45 % uživatelů českých seznamek pravidelně narazí na podezřelý profil. |  |
| 6 | 169 | Vícevrstvá ochrana před scammery |  |
| 7 | 171 | Bezpečnost |  |
| 8 | 181 | Nabízíme filtr „jen ověřené“ |  |
| 9 | 194 | Nahlášení podezřelého profilu |  |
| 10 | 217 | Podepsáno |  |
| 11 | 218 | Simona Cibulková |  |

## Cookies (`/cookies`)

<sub>Soubor: `app/cookies/page.tsx` · 38 textů</sub>

| # | Řádek | Text | Flag |
| --- | --- | --- | --- |
| 1 | 23 | Soukromí |  |
| 2 | 25 | jen ty opravdu nutné |  |
| 3 | 28 | Účinné od 17. května 2026 · Verze 1.0 |  |
| 4 | 36 | nepoužívá Google Analytics, Facebook Pixel ani jiné sledovací nástroje třetích stran |  |
| 5 | 36 | . Žádné reklamní cookies. Žádné cross-site tracking. Používáme jen cookies, které jsou |  |
| 6 | 36 | technicky nezbytné |  |
| 7 | 41 | Co je cookie? |  |
| 8 | 48 | Jaké cookies Cosmatch používá |  |
| 9 | 52 | Nezbytné |  |
| 10 | 54 | Uchovává Tvoji přihlášenou session, abys nemusel/a být přihlášován/a při každém kliku. |  |
| 11 | 55 | Doba: 1 rok · Doména: cosmatch.cz · Lze odmítnout? Ne (jinak se nepřihlásíš) |  |
| 12 | 59 | Nezbytné |  |
| 13 | 61 | Anti-bot ochrana — potvrzuje, že nejsi automatizovaný program. |  |
| 14 | 62 | Doba: 30 dnů · Doména: cosmatch.cz · Lze odmítnout? Ne (jinak nepronikneš přes ochranu) |  |
| 15 | 66 | Funkční |  |
| 16 | 68 | Cache Tvého profilu pro rychlejší načítání. Přepisováno při každém přihlášení. |  |
| 17 | 69 | Doba: do odhlášení · Doména: cosmatch.cz · Lze odmítnout? Ano — odhlas se, pak smaž browser data |  |
| 18 | 73 | Nezbytné |  |
| 19 | 75 | Počítadlo denních lajků pro Free tier (limit 5/den). Slouží k vynucení smluvního limitu Free členství vůči placenému Cosmatch+ a jako anti-abuse opatření. |  |
| 20 | 76 | Doba: 1 den · Doména: cosmatch.cz · Lze odmítnout? Ne (jde o vynucení podmínek Free tieru a prevenci zneužití) |  |
| 21 | 80 | Funkční |  |
| 22 | 82 | Pamatuje si, že už jsi viděl/a magic moment uvítací zprávu (zobrazuje se jednou). |  |
| 23 | 83 | Doba: trvale (do reset browser data) · Doména: cosmatch.cz · Lze odmítnout? Ano |  |
| 24 | 89 | Co Cosmatch NEPOUŽÍVÁ |  |
| 25 | 91 | — sledování chování uživatelů přes Google. |  |
| 26 | 92 | — sledování pro Facebook reklamy. |  |
| 27 | 94 | Reklamní cookies |  |
| 28 | 94 | — žádné Doubleclick, Adsense, Criteo. |  |
| 29 | 95 | — Cosmatch neví, co děláš jinde na internetu. |  |
| 30 | 107 | Jak cookies smazat |  |
| 31 | 112 | Nastavení → Soukromí a zabezpečení → Smazat data prohlížení |  |
| 32 | 113 | Nastavení → Soukromí a zabezpečení → Cookies a data webových stránek → Vymazat data |  |
| 33 | 114 | Předvolby → Soukromí → Spravovat data webových stránek |  |
| 34 | 115 | Nastavení → Soukromí, vyhledávání a služby → Vymazat data prohlížení |  |
| 35 | 123 | Související dokumenty |  |
| 36 | 125 | Zásady ochrany osobních údajů (GDPR) |  |
| 37 | 126 | Manifest důvěry |  |
| 38 | 126 | — 8 závazků |  |

## Kontaktní formulář

<sub>Soubor: `app/kontakt/KontaktForm.tsx` · 3 textů</sub>

| # | Řádek | Text | Flag |
| --- | --- | --- | --- |
| 1 | 145 | Tvoje jméno | 🚩 možná tykání bez velkého písmene (style: T/t) |
| 2 | 201 | Stručně popiš, s čím Ti můžeme pomoct… |  |
| 3 | 251 | Zásadách ochrany osobních údajů |  |

## Kontakt (`/kontakt`)

<sub>Soubor: `app/kontakt/page.tsx` · 10 textů</sub>

| # | Řádek | Text | Flag |
| --- | --- | --- | --- |
| 1 | 28 | nám |  |
| 2 | 49 | Mgr. Ing. Simona Cibulková |  |
| 3 | 49 | · IČO 08419531 · Kurzova 2222/16, 155 00 Praha 5 - Stodůlky · Datová schránka |  |
| 4 | 54 | Právní dokumenty |  |
| 5 | 56 | Obchodní podmínky |  |
| 6 | 60 | Reklamační řád |  |
| 7 | 62 | Odstoupení od smlouvy |  |
| 8 | 64 | Opakované platby |  |
| 9 | 68 | Manifest důvěry |  |
| 10 | 75 | ← Zpět na Cosmatch |  |

## Waitlist (`/waitlist`)

<sub>Soubor: `app/waitlist/page.tsx` · 20 textů</sub>

| # | Řádek | Text | Flag |
| --- | --- | --- | --- |
| 1 | 163 | Krátká pauza |  |
| 2 | 176 | postavená na |  |
| 3 | 193 | Hustota podle města |  |
| 4 | 225 | Volná místa |  |
| 5 | 238 | Přidej se |  |
| 6 | 260 | (volitelné) |  |
| 7 | 264 | Jak Ti říkat |  |
| 8 | 270 | Město |  |
| 9 | 276 | Vyber město |  |
| 10 | 279 | Plzeň |  |
| 11 | 280 | České Budějovice |  |
| 12 | 284 | Jiné |  |
| 13 | 295 | (pomáhá nám vědět, kde začít) |  |
| 14 | 302 | Vyber čtvrť |  |
| 15 | 342 | Co dostaneš |  |
| 16 | 370 | Manifest důvěry → |  |
| 17 | 371 | Numerologický kvíz |  |
| 18 | 383 | Tvoje pozice ve waitlistu | 🚩 možná tykání bez velkého písmene (style: T/t) |
| 19 | 397 | Tvůj voucher |  |
| 20 | 425 | Posuň se v pořadí |  |

## OAuth callback

<sub>Soubor: `app/auth/callback/page.tsx` · 1 textů</sub>

| # | Řádek | Text | Flag |
| --- | --- | --- | --- |
| 1 | 69 | Přihlašujeme tě… |  |

## Cosmatch+ (`/premium`)

<sub>Soubor: `app/premium/page.tsx` · 25 textů</sub>

| # | Řádek | Text | Flag |
| --- | --- | --- | --- |
| 1 | 113 | ← Zpět na Discover |  |
| 2 | 120 | Aktivní předplatné |  |
| 3 | 121 | Jsi prémiový člen. |  |
| 4 | 122 | Děkujeme, že podporuješ český produkt. |  |
| 5 | 128 | Předplatné |  |
| 6 | 130 | Žádné triky |  |
| 7 | 142 | Ceník Cosmatch+ |  |
| 8 | 148 | Měsíčně |  |
| 9 | 149 | 249 Kč |  |
| 10 | 150 | obnovení každých 30 dní |  |
| 11 | 153 | 3 měsíce |  |
| 12 | 154 | 597 Kč |  |
| 13 | 158 | Ročně |  |
| 14 | 159 | 2 088 Kč |  |
| 15 | 165 | Opakované platby |  |
| 16 | 171 | Spouštěcí akce · pro waitlist |  |
| 17 | 178 | 3 měsíce zdarma |  |
| 18 | 179 | Zakládající členové — odznak |  |
| 19 | 179 | Zakládající |  |
| 20 | 183 | 7denní trial |  |
| 21 | 184 | Vyzkoušej Cosmatch+ na týden. Po expiraci pokračuješ na Free, jinak si můžeš předplatit. |  |
| 22 | 265 | Co Cosmatch nedělá |  |
| 23 | 290 | Časté otázky |  |
| 24 | 319 | Manifest důvěry → |  |
| 25 | 320 | Jak ověřujeme profily |  |

## Cosmatch+ success page

<sub>Soubor: `app/premium/success/page.tsx` · 1 textů</sub>

| # | Řádek | Text | Flag |
| --- | --- | --- | --- |
| 1 | 29 | Platba úspěšná |  |

## Profil karta v discover (HingeProfileV2)

<sub>Soubor: `components/HingeProfileV2.tsx` · 14 textů</sub>

| # | Řádek | Text | Flag |
| --- | --- | --- | --- |
| 1 | 87 | Líbí se mi |  |
| 2 | 172 | Tvoje kompatibilita | 🚩 možná tykání bez velkého písmene (style: T/t) |
| 3 | 175 | Oboustranná shoda — vidíte se oba navzájem. |  |
| 4 | 246 | Životní filozofie |  |
| 5 | 291 | Životní styl |  |
| 6 | 293 | Vážný vztah |  |
| 7 | 294 | Přátelství |  |
| 8 | 295 | Nezávazně |  |
| 9 | 296 | Nekouří |  |
| 10 | 299 | Vegetarián |  |
| 11 | 300 | Chce děti |  |
| 12 | 301 | Nechce děti |  |
| 13 | 318 | Přeskočit |  |
| 14 | 321 | Líbí se mi |  |

## Cookie banner

<sub>Soubor: `components/CookieBanner.tsx` · 4 textů</sub>

| # | Řádek | Text | Flag |
| --- | --- | --- | --- |
| 1 | 33 | Cookies oznámení |  |
| 2 | 37 | Krátké oznámení |  |
| 3 | 39 | jen technicky nezbytné cookies |  |
| 4 | 39 | (přihlášení, ochrana proti botům). Žádný Google Analytics, žádný Facebook Pixel, žádné prodávání dat. |  |

## Knihovna Hinge promptů (lib/prompts.ts)

<sub>Soubor: `lib/prompts.ts` · 37 promptů — zobrazují se v `/register` (krok 4) a `/profile` editoru</sub>

| # | Prompt | Flag |
| --- | --- | --- |
| 1 | Jedna věc o mně, kterou bys měl/a vědět |  |
| 2 | Mě v 3 slovech |  |
| 3 | V partě jsem ten/ta, kdo |  |
| 4 | Moje největší přednost |  |
| 5 | Co mě nejvíc rozesměje |  |
| 6 | Co mě uklidní |  |
| 7 | Tajný talent |  |
| 8 | Co kdybych Ti řekl/a, že |  |
| 9 | Hledám někoho, kdo |  |
| 10 | Zamilovala/a bych se do Tebe, kdybys |  |
| 11 | Jen Tě prosím, abys |  |
| 12 | Pokud bys mě měl/a poznat |  |
| 13 | Můj červený flag |  |
| 14 | Můj zelený flag |  |
| 15 | Co mě baví dělat samostatně |  |
| 16 | Moje malá radost |  |
| 17 | Co mě baví o víkendu |  |
| 18 | Typická neděle |  |
| 19 | Moje ranní rutina |  |
| 20 | Kde jsem nejvíc šťastný/á |  |
| 21 | Moje obsese tento měsíc |  |
| 22 | Můj life hack |  |
| 23 | Píseň, která mě vždy rozplyne |  |
| 24 | Dvě pravdy a jedna lež |  |
| 25 | Nejhorší dárek, který jsem dostal/a |  |
| 26 | Nikdy jsem nemohl/a uvěřit, že |  |
| 27 | Krátký film o mém životě by se jmenoval |  |
| 28 | Můj životní cíl |  |
| 29 | Letos opravdu chci |  |
| 30 | Příští dobrodružství |  |
| 31 | 3 věci na seznamu životních přání |  |
| 32 | Co se právě teď učím |  |
| 33 | Největší riziko, které jsem podstoupil/a |  |
| 34 | Cestoval/a jsem do |  |
| 35 | Nejlepší cestovatelský zážitek |  |
| 36 | Můj nejlepší tip pro Prahu |  |
| 37 | Nejcennější vzpomínka |  |

---


**Celkem:** 293 textů zkontrolováno, 10 automaticky flagged jako podezřelé.


## Jak na review

1. Projdi sekci po sekci.

2. Co Ti nesedne, napiš mi: "v `app/profile/page.tsx` text #14 chci jinak: ..."

3. Můžu změnit všechny vybrané najednou v jednom commitu.


*Auditovala se pouze in-app vrstva (login, registrace, discover, matches, profile, kvíz, verifikace, premium, kontakt, cookies, manifest, waitlist, prompts). Marketing/edukativní stránky (`/archetypy/*`, `/numerologie/*`, `/kompatibilita-podle-data-narozeni`, atd.) jsou v separátní vrstvě a auditovaly se v předchozích sessions — pokud chceš znovu projet i tyto, řekni.*
