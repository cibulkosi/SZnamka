# Data safety form — draft pro Play Console

> Tento dokument je 1:1 mapping na to, co se vyplňuje v Play Console
> → **App content → Data safety**. Pro každou položku máš tady přesný text
> + checkbox, který vybrat.

## 1. Data collection and security (úvodní otázky)

| Otázka | Odpověď | Proč |
| --- | --- | --- |
| Does your app collect or share any of the required user data types? | **Yes** | Sbíráme e-mail, datum narození, fotky, voice, location atd. |
| Is all of the user data collected by your app encrypted in transit? | **Yes** | Vše přes HTTPS/TLS (Supabase, R2, Cloudflare) |
| Do you provide a way for users to request that their data be deleted? | **Yes** | `/nastaveni` → smazat účet (CASCADE DELETE v Supabase) |

## 2. Data types collected — kompletní seznam

Pro každý data type v Play Console: **Collected**, **Shared**, **Required/Optional**,
**Why it's collected** (vybrat z předdefinovaných důvodů).

### Personal info

| Data type | Collected | Shared | Required/Optional | Purpose(s) |
| --- | --- | --- | --- | --- |
| **Name** | Yes | No | Required | Account management; App functionality |
| **Email address** | Yes | No | Required | Account management; Communications |
| **User IDs** | Yes | No | Required | Account management; App functionality |
| **Address** | No | — | — | — |
| **Phone number** | No | — | — | — |
| **Race or ethnicity** | No | — | — | — |
| **Political or religious beliefs** | No | — | — | — |
| **Sexual orientation** | Yes | No | Required | App functionality (gender + hledané pohlaví pro matching) |
| **Other personal info** | Yes | No | Required | App functionality (datum narození pro výpočet kompatibility, MBTI, povolání, vzdělání, výška, záliby) |

### Financial info

| Data type | Collected | Shared | Required/Optional | Purpose(s) |
| --- | --- | --- | --- | --- |
| **User payment info** | No (zpracovává Google Play Billing) | — | — | — |
| **Purchase history** | Yes | No | Required | App functionality (Cosmatch+ subscription status) |
| **Credit info / Other financial info** | No | — | — | — |

### Health and fitness — **None**

### Messages

| Data type | Collected | Shared | Required/Optional | Purpose(s) |
| --- | --- | --- | --- | --- |
| **Emails** | No (jen e-mailová adresa, ne obsah e-mailů) | — | — | — |
| **SMS or MMS** | No | — | — | — |
| **Other in-app messages** | Yes | No | Optional | App functionality (zprávy mezi matchnutými uživateli) |

### Photos and videos

| Data type | Collected | Shared | Required/Optional | Purpose(s) |
| --- | --- | --- | --- | --- |
| **Photos** | Yes | No | Optional (min 1 fotka doporučeno) | App functionality (profilové fotky) |
| **Videos** | No | — | — | — |

### Audio files

| Data type | Collected | Shared | Required/Optional | Purpose(s) |
| --- | --- | --- | --- | --- |
| **Voice or sound recordings** | Yes | No | Optional | App functionality (voice prompt v profilu) |
| **Music files / Other audio files** | No | — | — | — |

### Files and docs — **None**

### Calendar — **None**

### Contacts — **None**

### App activity

| Data type | Collected | Shared | Required/Optional | Purpose(s) |
| --- | --- | --- | --- | --- |
| **App interactions** | Yes | No | Required | Analytics; App functionality (které profily uživatel lajknul/passnul → algoritmus) |
| **In-app search history** | No | — | — | — |
| **Installed apps** | No | — | — | — |
| **Other user-generated content** | Yes | No | Optional | App functionality (bio, hobbies, prompts answers, filozofie) |
| **Other actions** | Yes | No | Required | App functionality (real-life meet confirmations, premium gates) |

### Web browsing — **None**

### App info and performance

| Data type | Collected | Shared | Required/Optional | Purpose(s) |
| --- | --- | --- | --- | --- |
| **Crash logs** | No (zatím; přidáme s Firebase Crashlytics) | — | — | — |
| **Diagnostics** | No | — | — | — |
| **Other app performance data** | No | — | — | — |

### Device or other IDs

| Data type | Collected | Shared | Required/Optional | Purpose(s) |
| --- | --- | --- | --- | --- |
| **Device or other IDs** | Yes (Play Integrity device attestation) | No | Required | Fraud prevention, security, and compliance |

### Location

| Data type | Collected | Shared | Required/Optional | Purpose(s) |
| --- | --- | --- | --- | --- |
| **Approximate location** | Yes (město z GPS reverzního geocodu, nebo ručně zadaný) | No | Optional | App functionality (zobrazit město; geo-blízkost ve scoringu) |
| **Precise location** | No (ani z GPS nesbíráme přesné souřadnice — jen je použijeme pro reverse geocode, samotné souřadnice neukládáme) | — | — | — |

## 3. Security practices (sekce v Play Console)

| Otázka | Odpověď | Detail |
| --- | --- | --- |
| Is all of the user data encrypted in transit? | **Yes** | HTTPS/TLS všude (Cloudflare, Supabase, R2) |
| Do you provide a way for users to request that their data be deleted? | **Yes** | `/nastaveni` → "Smazat účet" → CASCADE DELETE Supabase, R2 objekty se zruší přes Edge Function |
| Has your app been independently validated against a global security standard? | **No** | Při růstu zvážit SOC 2 / ISO 27001 |
| Do you follow Google Play's Families Policy? | **No** | App není pro děti (18+ dating) |

## 4. Data deletion (sekce App content → User data deletion)

- **Where to request deletion:** In-app account deletion (URL: <https://cosmatch.cz/nastaveni>)
- **Account deletion required?** Yes
- **Out-of-app account deletion URL:** <https://cosmatch.cz/smazat-ucet> (TODO: zveřejnit stránku s instrukcemi pro deletion bez loginu)

> ⚠️ **TODO před spuštěním data safety:** vytvořit `/smazat-ucet` veřejnou stránku
> s formulářem nebo aspoň e-mailovou adresou (`ahoj@cosmatch.cz`) pro deletion
> request bez loginu. Google to vyžaduje.

## 5. Third parties — kdo má přístup k datům

Pro data safety form se neuvádějí explicitně, ale pro tvoji evidenci:

| Třetí strana | Co vidí | Účel | DPA / Lokace |
| --- | --- | --- | --- |
| **Supabase Inc.** | Vše v DB (profily, matches, zprávy) | Hosting databáze a auth | EU Frankfurt (DPA podepsaná) |
| **Cloudflare Inc.** | Vše v R2 (fotky, voice) + traffic přes Pages | Hosting webu a object storage | EU region; signed DPA |
| **Google LLC** (OAuth) | Jen e-mail + jméno uživatele | Sign-in | Standard Google Terms |
| **Facebook (Meta)** (OAuth) | Jen e-mail + jméno uživatele | Sign-in | Standard Facebook Terms |
| **Google Play (in-future)** | Subscription purchase tokens | IAP billing | Standard Google Play Terms |
| **Cleerly / OpenStreetMap** (Nominatim) | Souřadnice pro reverse geocode | Najít město z GPS | API call, neukládají naši IP s daty (volá z client) |

## 6. Co NEdělat / častá pochybení

- **Nevykazovat "Personal info → Name"** jako collected, když jen vyplňujeme z OAuth a uživatel si může změnit — Google to považuje za personal info bez ohledu na zdroj.
- **Nevykazovat "Sensitive personal info"** jako "Sexual orientation", i když to gender + hledané pohlaví NENÍ sexuální orientace — algorhitmicky odvoditelné. Play Store **explicitně** požaduje vykazování, když to algoritmus může odvodit.
- **Nevypouštět "Other actions"** — Play Console v 2024 vyžaduje plné vykázání každého data collection eventu.

## 7. Privacy policy URL

**Required field:** <https://cosmatch.cz/zasady-ochrany-osobnich-udaju>

Ověř, že stránka:
- Je veřejně přístupná bez loginu ✓
- Obsahuje data deletion instrukce ✓
- Obsahuje kontakt na DPO / data controller (e-mail `ahoj@cosmatch.cz`) ✓
- Obsahuje seznam třetích stran výše ✓

## 8. Co se přidá v dalších verzích (NOT NOW)

- **Crash logs / Diagnostics** — když přidáme Firebase Crashlytics nebo Sentry
- **Advertising ID** — pokud někdy zavedeme ads (zatím ne, viz Cosmatch+)
- **Push notification token (FCM)** — když přidáme push notifications

Až přibyde, **Data safety form je nutné aktualizovat** (re-submit v Play Console).
