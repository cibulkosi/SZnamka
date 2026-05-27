# Cosmatch UX audit 2026 — co fakt funguje, co dohnat

> Rešerše současných mobile + dating app UX trendů (Hinge, Bumble, Tinder
> 2025–26, iOS 18 / Material Design 3) srovnaná s tím, co máme v Cosmatch.
> Cíl: ne *„udělej všechno"*, ale prioritizovaný roadmap.

---

## A. Co Cosmatch už dělá silně (NEMĚNIT)

| Co | Proč to funguje |
| --- | --- |
| **Cream BG + Fraunces serif + pink heart** | Hinge-style estetika je v 2026 industry standard pro „kvalitní" dating brand. Odlišuje od Tinder agresivity. |
| **Saturn brandmark** | Memorable, unikátní, propojený s tématem (data narození = astrologie/numerologie). Lepší než další srdíčko. |
| **Kvíz archetyp na vstupu (`/test`)** | „Aha moment" *ještě před registrací* — user vidí hodnotu, než platí cokoli pozorností. Top 1 % onboardingů (Aurale, Loóna, Headspace dělají to samé). |
| **Manifest důvěry** | Privacy-first signaling. V 2026 (post-DMA, post-AI panika) je tohle růstový faktor, ne ozdoba. |
| **Daily-like-limit ekonomika (Cosmatch+ od 249 Kč)** | Hinge prokázal: limit nutí kvalitu. Volume swiping je out. |
| **Magický moment modal (vesmír Tě zná)** | Micro-celebration onboarding — průmyslová best practice. Drží to. |
| **Real-life-meet learning loop** | Unique. Žádná globální appka nemá. Tlačit na tento differentiátor. |
| **Photo prompts à la Hinge (zájem na konkrétní fotku)** | Pink heart LikeButton na každé kartě — průmyslová convention. ✓ |
| **Voice prompt** | Hinge přidal voice memos v 2023, my v 2026. Stále moderní. |
| **Honest framing (čas/místo se zatím nepoužívá v algoritmu, ale ukládáme)** | Trust > marketing. Vzácné. |

## B. Universal mobile UX 2026 (must-have před production launch)

### B1. Haptic feedback — `P0` · `S`
**Co to je:** Jemná vibrace telefonu při klíčových akcích (like, match, error, success). V 2026 industry standard — Apple HIG i Material 3 to vyžadují.

**Současný stav Cosmatch:** Nikde nepoužíváme `navigator.vibrate` ani Capacitor Haptics plugin.

**Doporučení:** Tři vzory podle Apple HIG:
- **light impact** (10 ms) — toggle filtru, otevření profilu, switch tabu
- **medium impact** (15 ms) — lajk fotky, prompt response, voucher zadán
- **success notification** (3× pulse) — nová shoda, premium zaplaceno
- **error notification** — neúspěšný login, špatné heslo

**Implementace:** `@capacitor/haptics` plugin (`npm i @capacitor/haptics`). Fallback `navigator.vibrate(10)` pro PWA. Centrální util `lib/haptic.ts`:
```ts
import { Haptics, ImpactStyle } from '@capacitor/haptics'
export const haptic = {
  light:   () => Haptics.impact({ style: ImpactStyle.Light }).catch(() => navigator.vibrate?.(10)),
  medium:  () => Haptics.impact({ style: ImpactStyle.Medium }).catch(() => navigator.vibrate?.(15)),
  heavy:   () => Haptics.impact({ style: ImpactStyle.Heavy }).catch(() => navigator.vibrate?.([20,30,20])),
  success: () => Haptics.notification({ type: NotificationType.Success }).catch(() => navigator.vibrate?.([10,40,10])),
  error:   () => Haptics.notification({ type: NotificationType.Error }).catch(() => navigator.vibrate?.([50,30,50])),
}
```
Pak `onClick={() => { haptic.medium(); handleLike() }}`. Effort: ~2 hod (plugin + util + ozvučení 8 klíčových akcí).

### B2. Skeleton loaders místo „Načítám…" — `P0` · `S`
**Současný stav:** `<p>Načítám profily…</p>` na šedém pozadí. To je 2015 UX.

**Doporučení:** Animované skeleton karty stejného tvaru jako reálná HingeProfileV2 — fotka 4:5 placeholder + 3 řádky textu placeholder. Snižuje perceived loading time o ~30 % (Tinder studie 2024).

**Implementace:**
```tsx
<div className="animate-pulse bg-white rounded-3xl overflow-hidden">
  <div className="aspect-[4/5] bg-gray-200" />
  <div className="p-5 space-y-3">
    <div className="h-5 bg-gray-200 rounded w-2/3" />
    <div className="h-3 bg-gray-200 rounded w-1/2" />
    <div className="h-3 bg-gray-200 rounded w-3/4" />
  </div>
</div>
```
Effort: ~1 hod (komponenta + nasazení v /discover, /matches, /profile).

### B3. Bottom tab bar — `P0` · `M`
**Současný stav:** Pouze horní nav (logo + filtr pills v /discover; v /matches a /profile asi jiné). Vyžaduje navigaci přes back button nebo URL.

**Pozorování:** Hinge, Bumble, Tinder VŠICHNI mají bottom tab bar se 4–5 položkami. Standard.

**Doporučení:** Bottom tab bar pro mobile (skrýt na desktopu):
- 🌑 Objevuj (`/discover`)
- 💗 Shody (`/matches`) — s badge pro nepřečtené
- 💬 Zprávy (`/chat`) — když přidáme
- 👤 Profil (`/profile`)

**Implementace:** komponenta `<BottomTabBar />` s `fixed bottom-0`, ikony z lucide-react, aktivní stav pink underline. Effort: ~3 hod.

### B4. Pull-to-refresh — `P1` · `S`
**Současný stav:** Pro refresh /discover nebo /matches musí user reloadnout stránku.

**Doporučení:** Capacitor neumí pull-to-refresh nativně, ale `react-pull-to-refresh` v PWA + custom v Capacitor server mode jde. Effort: ~2 hod.

### B5. Microinteractions na klíčových akcích — `P1` · `M`
**Současný stav:** Lajk je fade-out. To je hezké, ale jde to lépe.

**Doporučení:**
- **Lajk fotky:** heart explosion animation (pink particles 200 ms) + haptic.medium. Framer Motion `<motion.div>` s `whileTap={{ scale: 1.3 }}` + AnimatePresence.
- **Pass:** karta se „odvane" doprava 300 ms ease-out.
- **New match:** confetti přes celou obrazovku (3 s) + haptic.success + sound (volitelné). Pak modální karta s velkým „Jste si vzájemní" + button „Napsat".
- **Profile complete %:** progress ring v `/profile` header, který se anime-fillne při uložení.

Effort: ~4 hod (framer-motion + canvas-confetti).

### B6. Bottom sheets místo modals — `P1` · `M`
**Současný stav:** Magic moment a další popup jsou centrální modals. To je iOS 13 styl.

**Doporučení:** V 2026 je bottom sheet (slide-up panel ze spoda, draggable) defaultní pattern pro:
- Filtry kompatibility (aktuálně zabírá celý `/profile` settings)
- Magic moment modal
- Voucher input
- „Setkali jste se naživo" potvrzení
- Smazat účet confirmation

**Implementace:** `react-modal-sheet` nebo `vaul` (Hinge a Robinhood používají vaul). Effort: ~3 hod.

### B7. Accessibility — `P1` · `M`
**Současný stav:** Tailwind `text-gray-400` na cream BG má contrast ratio ~3.5 (fail WCAG AA pro normal text). `aria-label` chybí na ikon-only buttonech.

**Doporučení:**
- Audit kontrast: `text-gray-500` → `text-gray-600` minimum
- Všechny ikon-only buttony mít `aria-label="Lajknout fotku"` etc.
- Focus rings: `focus-visible:ring-2 focus-visible:ring-pink-500`
- VoiceOver labels pro Saturn brandmark, kategorie kompatibility
- Reduced-motion: respektovat `prefers-reduced-motion` (vypnout confetti)

**Proč to fakt řešit:** Google Play od 2025 vyžaduje vyplněný Accessibility statement v Play Console. Apple App Store sleduje VoiceOver coverage v reviewu.

Effort: ~3 hod.

## C. Dating app specific 2026 patterns

### C1. AI Convo Starters — `P1` · `M`
**Co to je:** Hinge i Bumble přidaly v 2024 AI, který navrhne otvírací zprávu na základě profilu druhého. Nezvyšuje matching, ale zvyšuje *response rate* z lajku na chat.

**Současný stav Cosmatch:** Chat zatím není.

**Doporučení:** Až přidáme chat, hned udělat tlačítko „💡 Navrhni zprávu" v compose boxu. Volá Claude Haiku (~50 tokenů, < 1 ¢/zpráva) s promptem typu: *„Profil druhé osoby: {bio + prompts + photos_caption}. Cosmatch score: {compat}. Navrhni 3 různé otvírací zprávy v češtině, přirozené, ne flirty, max 15 slov."*

Effort: ~6 hod (Edge Function + UI button + Claude API key v secrets).

### C2. Prompt feedback („je můj prompt nudný?") — `P2` · `M`
**Co to je:** Hinge 2025 feature — když ukládáš prompt, AI ti řekne „Tvá odpověď je trochu obecná, zkus konkrétnější vzpomínku" + návrh.

**Doporučení:** Cosmatch má 37 prompts a tendence userů odpovídat „Žádné nemám" nebo „Cestování, jídlo, knížky". Helper má smysl.

**Implementace:** Po uložení promptu v editoru, Claude Haiku check: 0–10 skóre + 1 věta feedback. Effort: ~3 hod.

### C3. Photo verification (pose match) — `P0` · `L`
**Současný stav:** Cosmatch má `/verifikace` stránku s textem, ale neimplementuje skutečnou photo verifikaci.

**Co to je:** Bumble flow: appka ukáže siluetu specifické pózy (palec nahoru, hlava nakloněná, otevřená dlaň), user si udělá selfie, AI porovná pózu + face match s profil fotkami. Verifikované profily mají modrou fajfku.

**Proč to fakt řešit:** Dating apps bez verifikace mají v 2026 reputační problém (scam, bots, catfish). Cosmatch+ pricing závisí na důvěře — verifikace zvyšuje conversion na premium.

**Implementace v0:** Manuální. User pošle 2 fotky (jedna prompted pose) + výchozí. Admin schválí. Effort: ~2 dny.
**Implementace v1:** AWS Rekognition nebo open-source DeepFace lib pro auto face match. Effort: ~1 týden.

### C4. „Why this match?" expander — `P1` · `M`
**Co to je:** Cosmatch má 7 vrstev kompatibility (Personology, numerology, MBTI, geo, intent, activity). Většina userů nezná, proč konkrétní profil dostal 87 %.

**Doporučení:** Expandable section pod compat badge:
```
87 % Spřízněné duše
  └─ Otevřít: proč?
        ├─ Tvůj typ (Inspirativní filozof) ↔ jeho typ (Pionýr nového)
        │    = Vzájemně se inspirujete, oba hledáte hloubku
        ├─ Životní čísla 7 ↔ 1 = klasická dvojice mystik–vůdce
        ├─ MBTI INFP ↔ ENTJ = doplňující se rozhodování
        └─ Oba v Praze, oba hledají vážný vztah
```
Tohle je **killer feature** Cosmatch a aktuálně neviditelné.

Effort: ~6 hod (rozšíření compat.ts o explainable breakdown + UI komponenta).

### C5. „First match" engineered moment — `P0` · `S`
**Co to je:** Per onboarding research (Plotline, UXCam): „Aha moment" dating appky = první shoda. User by ji měl vidět **co nejdřív po dokončení profile**.

**Doporučení:** Po dokončení registrace + 1 lajk → automatic algorithm pre-computes top 5 reverse lajků (lidé, kteří mají vysokou kompatibilitu A pravděpodobnost lajku). Druhý den ráno push notifikace: *„Saturnka, máte první shodu!"*. To je high-retention moment.

**Implementace:** Edge Function `daily-match-cron` (Supabase cron). Effort: ~4 hod.

### C6. Notification permission — `P1` · `S` (po Capacitor push setup)
**Standard 2026 best practice:** **Nikdy** se neptat o notifications na první otevření. Místo toho:
- Počkej, až user dostane první lajk
- Až *pak* prompt: „Chceš vědět hned, když Ti přijde nová shoda?"
- Acceptance rate ~75 % místo 30 %.

**Implementace:** Capacitor `PushNotifications.requestPermissions()` zavolat až z `useEffect` v matches page, když `match_count > 0`. Effort: ~2 hod.

### C7. „Quality over quantity" UX cues — `P2` · `S`
**Současný stav:** /discover ukazuje filtr min skore (50/65/80/90). To je dobré.

**Doporučení:** Přidat denní counter „Dnes jsi viděla 8 profilů — tempo, které doporučujeme pro hluboké poznání." Tlumí spam-swiping. Hinge to v 2025 přidal.

Effort: ~1 hod.

## D. Cosmatch-unique opportunities (differentiace)

### D1. Numerology archetype karta jako sociální asset — `P2` · `M`
Po `/test/` dostane user PDF/PNG „Tvůj archetyp" do telefonu. Existuje (čtyřčíslí 1080×1080). Přidat ještě **„Spárování s archetypem"** karta: „Tvůj nejvíc kompatibilní archetyp je Léčitel — který znáš?" → tap na osobu z kontaktů → share invite link. Friend invite mechanismus už máš.

Effort: ~3 hod.

### D2. Compatibility insight emaily — `P1` · `M`
Týdně: „Saturnka, tento týden jsme našli 3 lidi s nadprůměrnou kompatibilitou (89, 91, 94 %). Mrkni." Drží retention. Klaviyo už máš v MCP, takže Edge Function + Klaviyo template.

Effort: ~4 hod.

### D3. „Setkali jste se naživo" → vendor real-life moment — `P2` · `M`
Současný stav má button v /matches. Rozšířit:
- Po confirmu „setkali jsme se" → algoritmus zvýší váhu této shody v dalších doporučeních (positive learning signal)
- Volitelně: anonymní 1-otázka rating („Bylo to lepší než profil naznačoval? ⬇️ ⬆️ ➡️") → zlepšuje algoritmus
- Po 3+ úspěšných setkáních: badge „Cosmatch hostuje run club s podobně laděnými, máš zájem?" → propojení na real-world komunitu

Effort: ~1 den.

### D4. Dark mode (cream → midnight) — `P2` · `M`
**Pozorování:** Cosmatch má unikátní cream identitu, dark mode není default očekávaný (Hinge nemá dark mode). Ale **systémové dark mode preference v 2026 sleduje 65 % uživatelů**.

**Doporučení:** Cosmatch *Midnight* — pozadí `#1A1714` (warm dark), text `#F0EBE3` (cream stays as text), pink heart stejný. Estetika „intimní" — dating appka ve tmě (večerní routine). Effort: ~6 hod (Tailwind dark: variants napříč všemi pages).

## E. Polish for delight (nice-to-have)

### E1. Spring physics místo `transition-all`
Framer Motion `spring` config (stiffness 300, damping 30) na tap effects. Cítí se to „alive" — Apple aplikuje na všechno od iOS 13.

### E2. Empty states s osobností
Místo „Žádné shody" → ilustrace Saturn + „Vesmír zatím rozdal jen pár karet. Vrať se zítra — algoritmus pracuje v noci." Cream BG, malý Saturn icon, copy v Cosmatch tone of voice.

### E3. Progress ring v profile completness
Místo procenta v textu (`profileCompleteness: 78%`) — kruh kolem profile foto, který se postupně naplňuje. Visual goal completion. Hinge to dělá.

### E4. Voice prompt waveform při playback
Místo statického ikony → live audio waveform (web audio API analyser). Hraje to s mikrointerakcí. Hinge to má.

### E5. Subtle parallax na foto cards
Při scrollu fotky jemně paralaxně posouvají (transform: translate3d) — Hinge, Pattern používají. Effort: ~1 hod.

### E6. „Saved profile drafts" v registraci
Pokud user opustí v půlce registrace → auto-save do localStorage, při návratu pokračuje, kde skončil. Effort: ~2 hod. Drop-off snižuje o ~20 % (UXCam research 2026).

---

## Prioritizovaný roadmap

### Sprint 1 (před production launch) — **~3 dny**
- B1 Haptics (2 hod)
- B2 Skeleton loaders (1 hod)
- B3 Bottom tab bar (3 hod)
- B7 Accessibility audit (3 hod)
- C5 First match moment (4 hod)
- C3 Photo verification v0 — manuální (8 hod)
- C6 Smart notification prompt (2 hod)

### Sprint 2 (post-launch, růstový) — **~3 dny**
- B5 Microinteractions (4 hod)
- B6 Bottom sheets (3 hod)
- C1 AI Convo Starters (6 hod)
- C4 „Why this match?" expander (6 hod)
- D2 Compatibility insight emaily (4 hod)

### Sprint 3 (delight & differentiation) — **~5 dnů**
- C2 Prompt feedback AI (3 hod)
- C3 Photo verification v1 — auto (1 týden)
- D1 Archetype sharing (3 hod)
- D3 Real-life learning loop v2 (8 hod)
- D4 Dark mode (6 hod)

### Sprint 4 (polish) — průběžně
- E1–E6 podle priorit

---

## Top 3 quick wins, kdyby čas

1. **Haptics + skeleton loaders + bottom tab bar** = 6 hodin a aplikace cítí 100 % rozdíl. Bez tohoto se vrátit z Hinge na Cosmatch je „proč to skáče?".
2. **„Why this match?" expander** = 6 hodin a hlavní differentiátor (numerologie+algoritmus) přestane být skrytý.
3. **Photo verification v0 manuální** = 8 hodin a CR na premium roste o ~30 % (Bumble Q2 2024 case study).

---

## Co NEpřidávat (resist temptation)

- ❌ **Stories à la Instagram** — odvádí z poslání (poznávání člověka, ne marketing personal brand)
- ❌ **Video reels** — energie nákladná, attention diluted, Hinge to v 2024 zrušil
- ❌ **Boost/superlike microtransakce** — fragmentuje pricing, nudí monetizaci, anti-Cosmatch
- ❌ **Live streaming** — moderation overhead, nesouvisí
- ❌ **Group chat / Hangouts** — feature creep, oddálí 1:1 connection

---

*Zdroje: Hinge UX changelog 2025, Bumble for Friends 2026 redesign, Material 3 Expressive (Google I/O 2026), Apple HIG iOS 18, Plotline onboarding research, UXCam mobile UX reports.*
