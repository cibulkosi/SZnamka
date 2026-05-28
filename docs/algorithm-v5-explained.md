# Cosmatch algoritmus v5 — co algoritmus dělá, co potřebuje, jak rekalibrovat

> Stav k 2026-05-28. Hlavní soubor: `lib/compat.ts`.
> Tabulka kompatibilit: `public.compatibility` (46 949 řádků, pre-computed pro všech 366×366 párů MM-DD).

## 1. Hlavní vstup: 7 vrstev s váhami

```
                     VÁHA   MAX BODŮ   ZDROJ DAT
─────────────────────────────────────────────────────────────
I. Crawford & Sullivan  30%    30      compatibility tabulka (DOB)
II. Hodnoty a vize     25%    25      4 otázky (rodina, vztah, víra, finance)
III. Psychologický     20%    20      9 sub-faktorů (MBTI + attachment + ES + …)
IV. Intimní soulad     10%    10      1 otázka (libido 1-5)
V. Lifestyle            7%     7      5 návyků (kouření, alkohol, …)
VI. Společné zájmy      5%     5      hobby seznam
VII. Aktivita           3%     3      last_seen decay
─────────────────────────────────────────────────────────────
                       100%   100

Násobič záměru: ×1.2 (oba serious nebo oba casual) / ×0.5 (konflikt)
                ×1.0 (neutrální)

Tvrdé filtry před skórováním (HARD VETO, profil se nezobrazí):
  - Vzdálenost > max_distance
  - Děti incompatible (want_kids × no_kids)
  - Kouření dealbreaker (never × regularly)
  - Alkohol dealbreaker
  - Marihuana dealbreaker
  - Mimo height/body type preferences
```

## 2. Vrstva I — Crawford & Sullivan (30 %)

**Zdroj:** kniha *The Power of Birthdays, Stars and Numbers* (1998) — Crawford & Sullivan napárovali každý den v roce s každým jiným dnem podle astrologie + numerologie do 5 kategorií.

**Mapping na skóre v Cosmatch:**

| Crawford kategorie | Cosmatch label | Bodů | Co to znamená |
|---|---|---|---|
| Soul Mates | Spřízněné duše | **100** | Harmonická vazba, klasický „love at first sight" |
| Love & Friendship | Láska a přátelství | **95** | Přirozená harmonie, dlouhodobé partnerství |
| Fatal Attraction | Magnetická tenze | **85** | Ambivalentní karmický pár, vášnivé ale složité |
| Beneficial | Beneficial | **65** | Mentor / praktická podpora |
| Challenging | Challenging | **45** | Růst přes konflikt |
| (kategorie chybí) | — | **50** | Default |

**Bidirectional asymetrie:** Pár (A, B) může být pro A „Soul Mate" ale pro B „Challenging" — Crawford to umožňuje. Cosmatch tedy počítá:
- `forwardScore` = Crawford z perspektivy A
- `reverseScore` = Crawford z perspektivy B
- **Finální `bookScore`** = průměr; pokud OBA ≥ 70 → bonus +5 % (mutual positive)
- Pokud rozdíl > 30 → flag `asymmetric: true` (zobrazujeme v UI)

**Příspěvek k finálnímu skóre:** `bookScore × 0.30`

## 3. Vrstva II — Hodnoty a vize (25 %)

**Co se ptáme** (otázky v registraci nebo v profilu):

| Pole | Co znamená | Možnosti |
|---|---|---|
| `family_plans` | Plány s dětmi | want_kids / have_kids_want_more / no_kids / open |
| `relationship_type` | Typ vztahu | serious / casual / open / unsure |
| `religion` | Vztah k víře | none / religious / spiritual / other |
| `finances` | Postoj k penězům | saver / spender / balanced |

**Jak se počítá:**

| Sub-faktor | Max bodů | Logika |
|---|---|---|
| Plány s dětmi | 40 | want_kids+want_kids = 40 ✓ · open+cokoli = 24 · want_kids+no_kids = 0 ✗ |
| Typ vztahu | 30 | Stejný = 30 · serious+casual = 0 ✗ |
| Víra | 20 | Stejná = 20 · jeden „none" + druhý jakýkoli = 5 · jinak = 10 |
| Finance | 10 | Stejné = 10 · oba ne-balanced = 0 · jeden balanced = 5 |

(Pokud uživatel nevyplnil žádné z těchto, layer vrací 50.)

**Výzkumná opora:** Gottman „Shared Meaning System" — páry, které sdílí životní vizi, mají 3× vyšší šanci přežít manželství.

## 4. Vrstva III — Psychologický profil (20 %)

**Co se ptáme** (9 polí, vše volitelné — chybějící se ignorují):

| Pole | Otázka v UI | Možnosti | Max bodů |
|---|---|---|---|
| `attachment_style` | „Jak reaguješ na blízkost?" | secure / anxious / avoidant / disorganized | **32** |
| `emotional_stability` | „Jak emocionálně stabilní jsi?" | stable / reactive / balanced | **20** |
| `personality_social` | MBTI E/I — „Jak nabíjíš energii?" | introvert / extrovert / ambivert | **10** |
| `personality_schedule` | „Ranní ptáče nebo noční sova?" | morning / night / flexible | **8** |
| `personality_role` | MBTI N/S — „Vidíš velký obrázek nebo detail?" | visionary / executor / both | **6** (preference KOMPLEMENTÁRNÍ) |
| `personality_decision` | MBTI T/F — „Logikou nebo srdcem?" | logic / heart / balanced | **6** |
| `personality_lifestyle` | MBTI J/P — „Plánuješ nebo improvizuješ?" | planned / spontaneous / flexible | **6** |
| `love_language_primary` + `secondary` | „Jak vyjadřuješ lásku?" | words / acts / gifts / time / touch | **6** |
| `personality_conflict` | „Jak řešíš konflikt?" | talk / cool_down / avoid | **6** |

**Jak se počítá nejdůležitější sub-faktor — Attachment Style** (Bowlby + Hazan-Shaver):

```
secure + secure         = 32  (ideal — oba stabilní)
secure + anxious        = 26  (secure pomáhá léčit)
secure + avoidant       = 26  (secure pomáhá léčit)
secure + disorganized   = 22
anxious + anxious       = 16  (oba potřebují ujištění)
avoidant + avoidant     = 12  (oba potřebují prostor, málo blízkosti)
anxious + avoidant      = 6   ⚠ klasický „chase-flee" cyklus (Kirkpatrick & Davis 1994)
disorganized + cokoli   = 8
```

**Výzkumná opora:**
- Heller 2004 meta-analýza: r = -0,26 mezi neuroticismem a stabilitou vztahu (replikované)
- Hazan-Shaver attachment: nejsilnější psychologický prediktor delky vztahu
- Sprajcer 2022: chronotypicky matched páry F(1,58) = 19,57 p < .001
- MBTI N/S kompementarita: vizionář + exekutor lépe spolupracují než dva vizionáři

## 5. Vrstva IV — Intimní soulad (10 %)

**Co se ptáme:**
- `libido`: škála 1–5 (1 = zřídka, 5 = každý den)

**Jak se počítá:** `100 - |me.libido - other.libido| × 25`

| Diff | Body |
|---|---|
| 0 (stejné libido) | 100 |
| 1 | 75 |
| 2 | 50 |
| 3 | 25 |
| 4 | 0 |

## 6. Vrstva V — Lifestyle (7 %)

**Co se ptáme:**
- `smoking`: never / sometimes / often
- `alcohol`: never / socially / regularly
- `marijuana`: never / rarely / sometimes / regularly
- `diet`: omnivore / vegetarian / vegan / other
- `exercise`: never / sometimes / regularly

**Jak se počítá:** Pro každou dvojici je matice. Stejné = 100, opačné extrémy = 5–30. Pak průměr přes vyplněné.

Příklad smoking matice:
```
                never   sometimes   often
never            100       50         5
sometimes         50       100       60
often              5        60       100
```

## 7. Vrstva VI — Společné zájmy (5 %)

**Co se ptáme:** `hobbies` array (min 3, max 8 z listu ~45 možností).

**Jak se počítá:** `shared_count / max(my_hobbies, their_hobbies) × 100 × 0.05`

⚠ **Pozor: Aron 2000** říká, že **novelty > similarity** v dlouhodobých vztazích. Sdílené zájmy jsou méně predikční než lidé čekají. Proto váha jen 5 %.

## 8. Vrstva VII — Aktivita (3 %)

`last_seen` decay — odměňujeme aktivní uživatele, aby user nezasypal zprávami někoho, kdo už appku 3 měsíce neotevřel.

| Last seen | Body |
|---|---|
| < 24 h | 100 |
| < 7 dní | 75 |
| < 30 dní | 50 |
| > 30 dní | 30 |

## 9. Intent multiplier (na konci)

```
final_score = clamp_to_100(raw_score × multiplier)

  oba "serious" nebo oba "casual"    ×1.2
  serious × casual (hard conflict)    ×0.5
  jeden "unsure" + cokoli             ×1.0
```

## 10. Co algoritmus NETROUBEKUJE

- **Fotky** — Cosmatch neaglomerizuje fyzickou atraktivitu. Photos slouží jen pro UI, nemají vliv na skóre. (ELO_score je separátní mechanismus pro „desirability tiebreaker".)
- **Bio / philosophy / prompts** — textové sekce profilu nepřispívají do skóre. Pouze pomáhají uživatelům rozhodnout se po zobrazení karty.
- **Vzdělání, povolání, výška, body type** — vstupují **jen do hard filtrů**, ne do skóre. Tj. uživatel může nastavit pref_height_min/max a profily mimo se nezobrazí, ale skóre se mezi vyhovujícími profily nemění.
- **Voice prompt** — UI only, neovlivňuje skóre.
- **Verifikační status** — UI signal (modrá fajfka), nezvyšuje skóre.

## 11. Reálná dosažitelnost 85% finálního skóre

Předchozí omyl: dotazoval jsem `score>=85` z `compatibility` table → ten sloupec je legacy heuristika, **algoritmus ho nepoužívá**.

Skutečná dosažitelnost finálního skóre 85 % nastává, pokud:

| Vrstva | Body | Co potřebujeme |
|---|---|---|
| I. Crawford | 28,5–31,5 / 30 | Soul Mates nebo Love & Friendship pár (10,7–53 % populace) |
| II. Vize | 20–25 / 25 | Rodina + vztah + víra většinou souhlasí |
| III. Psycho | 14–20 / 20 | Aspoň attachment + Big5 ES + MBTI E/I souhlasí |
| IV. Intim | 7,5–10 / 10 | Libido diff ≤ 1 |
| V. Lifestyle | 5–7 / 7 | 3–5 návyků souhlasí |
| VI. Hobbies | 2–5 / 5 | 30–50 % sdílených |
| VII. Aktivita | 2,25–3 / 3 | Partner online < 7 dní |
| **Subtotal** | **79–101** | |
| Intent ×1.2 | × | Oba serious nebo oba casual |
| **Final** | **95–100** | |

**Závěr:** s plně vyplněným profilem a Crawford ≥ 95 (= 53 % populace) lze rutinně dosáhnout finálního skóre **80–95 %**. Cílit na 85 % je zcela realistické — typicky 1 z 5–10 doporučených profilů.

## 12. Bugs v emailových thresholdech (oprava 28. 5. 2026)

Oba cronové emaily (`first-match-suggestions` + `weekly-compat-insight`) dotazují `compat.score >= X` — to je nesprávně, protože:
- `compat.score` je legacy heuristika
- Měli bychom dotazovat `soul_mates = true OR love_friendship = true`

**TODO:** přepsat oba Edge Functions, aby používaly Crawford boolean flags místo legacy score sloupce.

## 13. Co algoritmus nemůže — limity

1. **Nezná lidskou chemii** — Crawford je deterministická lookup table podle DOB. Realita je probabilistická.
2. **Algoritmus penalizuje neaktivní users** v Activity layer (3 %), ale to NEznamená, že přestávají být kompatibilní — jen je míň lidi ukazujeme.
3. **Hard filtry mohou skrýt 80 % uživatelů** — pokud má user striktní preference (vzdálenost 10 km, výška 175-190 cm, never smoke). To je správné, ale uživatel by měl vidět varování "máš nastavené přísné filtry".
4. **Neumí učení** — dnes je algoritmus deterministický. Learning loop přes `match_events` (real-life meetings) bude přidán v Q4 2026.

## 14. Otázky k vyplnění v aplikaci — kompletní list

**Povinné při registraci** (5 polí):
1. Email
2. Jméno
3. Pohlaví (woman / man / non-binary)
4. Hledám (men / women / all)
5. Datum narození (MM-DD format)

**Polo-povinné** (registrace + profil):
6. relationship_goal: serious / friendship / casual / unsure
7. hobbies (min 3, max 8)
8. Aspoň 1 fotka (po registraci, doporučené)

**Volitelné — psychologie:**
9-15. MBTI 4 dimenze + chronobiology + decision + conflict
16. attachment_style
17. emotional_stability
18-19. love_language_primary + secondary

**Volitelné — vztah:**
20. family_plans
21. relationship_type
22. religion
23. finances
24. libido (1-5)

**Volitelné — lifestyle:**
25-29. smoking / alcohol / marijuana / diet / exercise

**Volitelné — fyzické / lokační:**
30. height_cm
31. body_type
32. city + country
33. Geo-radius (max_distance)

**Volitelné — preference partnera (hard filtry):**
34. pref_height_min/max
35. pref_body_types
36. smoking_dealbreaker / alcohol_dealbreaker / marijuana_dealbreaker

**Volitelné — text:**
37. bio (500 znaků)
38. philosophy (200 znaků)
39. prompts (3× Hinge-style otázky)
40. voice_prompt
41. occupation
42. education

**Total:** ~25 vlivných polí na finální skóre. Profil může být skvělý už s 8–10 vyplněnými poli (Crawford + family_plans + relationship_type + attachment + MBTI E/I + libido + lifestyle základ + hobbies).

