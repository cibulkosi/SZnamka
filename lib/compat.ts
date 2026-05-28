/**
 * Cosmatch – Compatibility Algorithm v4 (květen 2026)
 * 
 * CCS = (
 *    30 % × birth_date_score    Vrstva I    (book lookup; LP jen v Magic Moment)
 *  + 15 % × life_vision_score   Vrstva II   (family/relationship_type/religion/finances)
 *  + 30 % × psychological_score Vrstva III  (MBTI 4 dim + Attachment + Love Langs + Emotional + chronobiology + conflict)
 *  + 10 % × intimate_score      Vrstva IV   (libido 1–5)
 *  +  5 % × lifestyle_score     Vrstva V    (smoking/alcohol/marijuana/diet/exercise — dealbreakers dělají hlavní práci)
 *  +  5 % × interests_score     Vrstva VI   (záliby procentně)
 *  +  5 % × activity_score      Vrstva VII  (0–100 podle last_seen)
 * ) × intent_multiplier (0.5 / 1.0 / 1.2)
 * 
 * Total: 100 % weighted + multiplier ±. Žádné absolutní bonusy.
 * 
 * HARD FILTRY (skryjí profil, nevstupují do skóre):
 *   - distance > max_distance
 *   - age outside age_min/age_max
 *   - height/body_type outside pref_*
 *   - children incompatible (want_kids × no_kids = vždy hard)
 *   - smoking incompatible (jen pokud user označí smoking_dealbreaker)
 *   - alcohol incompatible (jen pokud user označí alcohol_dealbreaker)
 *   - marijuana incompatible (jen pokud user označí marijuana_dealbreaker)
 *   - CCS < min_compatibility
 */

import type { Profile } from './supabase'

// ──────────────────────────────────────────────
// Typy
// ──────────────────────────────────────────────
export type FamilyPlans    = 'want_kids' | 'have_kids_want_more' | 'no_kids' | 'open'
export type Religion       = 'none' | 'religious' | 'spiritual' | 'other'
export type Finances       = 'saver' | 'spender' | 'balanced'
export type RelType        = 'serious' | 'casual' | 'open' | 'unsure'
export type PersonRole      = 'visionary' | 'executor' | 'both'         // MBTI N/S
export type PersonSocial    = 'introvert' | 'extrovert' | 'ambivert'    // MBTI E/I
export type PersonDecision  = 'logic' | 'heart' | 'balanced'            // MBTI T/F
export type PersonLifestyle = 'planned' | 'spontaneous' | 'flexible'    // MBTI J/P
export type PersonSchedule  = 'morning' | 'night' | 'flexible'          // chronobiology
export type PersonConflict  = 'talk' | 'cool_down' | 'avoid'            // Thomas-Kilmann
export type AttachmentStyle = 'secure' | 'anxious' | 'avoidant' | 'disorganized'  // Bowlby/Ainsworth
export type LoveLanguage    = 'words' | 'acts' | 'gifts' | 'time' | 'touch'       // Chapman 5LL
export type EmotionalStab   = 'stable' | 'reactive' | 'balanced'        // Big Five Neuroticism
export type Smoking        = 'never' | 'sometimes' | 'often'
export type Alcohol        = 'never' | 'socially' | 'regularly'
export type Marijuana      = 'never' | 'sometimes' | 'often'
export type Diet           = 'omnivore' | 'vegetarian' | 'vegan' | 'other'
export type Exercise       = 'never' | 'sometimes' | 'regularly'

// ──────────────────────────────────────────────
// Haversine distance (km)
// ──────────────────────────────────────────────
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/**
 * Vypočítá vzdálenost mezi dvěma profily (km), nebo null pokud chybí data.
 */
export function distanceKm(me: Profile, other: Profile): number | null {
  if (
    me.latitude == null || me.longitude == null ||
    other.latitude == null || other.longitude == null
  ) return null
  return haversineKm(me.latitude, me.longitude, other.latitude, other.longitude)
}

/**
 * Vrací true pokud profil překračuje uživatelův hard limit vzdálenosti.
 * Pokud vzdálenost nelze zjistit, vrací false (nezablokovat).
 */
export function isOutsideDistanceLimit(me: Profile, other: Profile, maxKm: number): boolean {
  const d = distanceKm(me, other)
  if (d === null) return false   // neznámá poloha → nezablokovat
  return d > maxKm
}

/**
 * Vrací true pokud A=want_kids × B=no_kids (nebo opačně) = HARD INCOMPATIBLE.
 * Toto je vždy aktivní deal-breaker — neuvedeno = nezablokovat.
 */
export function isChildrenIncompatible(me: Profile, other: Profile): boolean {
  if (!me.family_plans || !other.family_plans) return false
  const hardPairs: Array<[string, string]> = [
    ['want_kids', 'no_kids'],
    ['no_kids', 'want_kids'],
    ['have_kids_want_more', 'no_kids'],
    ['no_kids', 'have_kids_want_more'],
  ]
  return hardPairs.some(([a, b]) => me.family_plans === a && other.family_plans === b)
}

/**
 * Vrací true pokud uživatel označil smoking jako deal-breaker A je neshoda.
 * Opt-in — pokud user nemá smoking_dealbreaker=true, vrací false.
 */
export function isSmokingIncompatible(me: Profile, other: Profile): boolean {
  if (!(me as Profile & { smoking_dealbreaker?: boolean }).smoking_dealbreaker) return false
  if (!me.smoking || !other.smoking) return false
  // Pokud user je 'never' a partner 'often', → hard incompatible
  if (me.smoking === 'never' && other.smoking === 'often') return true
  return false
}

/**
 * Vrací true pokud uživatel označil alkohol jako deal-breaker A je neshoda.
 * Opt-in — pokud user nemá alcohol_dealbreaker=true, vrací false.
 */
export function isAlcoholIncompatible(me: Profile, other: Profile): boolean {
  if (!(me as Profile & { alcohol_dealbreaker?: boolean }).alcohol_dealbreaker) return false
  if (!me.alcohol || !other.alcohol) return false
  // Pokud user je 'never' a partner 'regularly', → hard incompatible
  if (me.alcohol === 'never' && other.alcohol === 'regularly') return true
  return false
}

/**
 * Vrací true pokud uživatel označil marihuanu jako deal-breaker A je neshoda.
 * Opt-in — pokud user nemá marijuana_dealbreaker=true, vrací false.
 */
export function isMarijuanaIncompatible(me: Profile, other: Profile): boolean {
  const meM = (me as Profile & { marijuana?: string; marijuana_dealbreaker?: boolean })
  const otherM = (other as Profile & { marijuana?: string })
  if (!meM.marijuana_dealbreaker) return false
  if (!meM.marijuana || !otherM.marijuana) return false
  // Pokud user je 'never' a partner 'often', → hard incompatible
  if (meM.marijuana === 'never' && otherM.marijuana === 'often') return true
  return false
}

/**
 * Tier fallback pro book_score — když je book lookup 'neutral' (žádná kategorie),
 * použijeme 3-tier life path matrix (z research dossier) pro mírný adjustment.
 *
 * Tier 1 (přirozená harmonie): 50 → 75 (+25)
 * Tier 2 (růstové partnerství): 50 → 60 (+10)
 * Tier 3 (vysoké napětí): 50 → 40 (-10)
 * Žádný tier match: 50 (default neutral)
 *
 * Pouze pro životní čísla — book lookup zůstává hlavní vrstva.
 */
export function tierFallbackBoost(myLP: number, otherLP: number, archetypes: Record<number, { tier1?: number[]; tier2?: number[]; tier3?: number[] }>): number {
  const me = archetypes[myLP]
  if (!me) return 50
  if (me.tier1?.includes(otherLP)) return 75
  if (me.tier2?.includes(otherLP)) return 60
  if (me.tier3?.includes(otherLP)) return 40
  return 50
}

/**
 * Vrací true pokud kandidát NESPLŇUJE uživatelovy fyzické preference.
 * Hard filter — profil se nezobrazí v Discover. NEpoužívá se ve scoringu.
 * Pokud uživatel preference nemá nastaveny nebo kandidát neuvedl údaj, vrací false (nezablokovat).
 */
export function isOutsidePhysicalPrefs(me: Profile, other: Profile): boolean {
  // Výška — pokud má uživatel nastavený rozsah a kandidát uvedl výšku
  if (me.pref_height_min != null && other.height_cm != null) {
    if (other.height_cm < me.pref_height_min) return true
  }
  if (me.pref_height_max != null && other.height_cm != null) {
    if (other.height_cm > me.pref_height_max) return true
  }
  // Postava — pokud má uživatel preferované typy a kandidát uvedl
  if (me.pref_body_types && me.pref_body_types.length > 0 && other.body_type) {
    // 'prefer_not_say' nikdy nefiltruj — user nesdílí, je v pohodě
    if (other.body_type !== 'prefer_not_say' && !me.pref_body_types.includes(other.body_type)) {
      return true
    }
  }
  return false
}

// ──────────────────────────────────────────────
// Geolokační bonus – DEPRECATED (květen 2026)
// Důvod: vzdálenost je preference, ne kompatibilita. Lidi si volí sami.
// Nyní: max_distance je HARD FILTER v /discover (profile mimo limit se nezobrazí).
// Funkce ponechaná pro případnou referenci, ale NIKDE se nevolá ve scoringu.
// ──────────────────────────────────────────────
function geoBonus(me: Profile, other: Profile): number {
  const d = distanceKm(me, other)
  if (d === null) return 0      // neznámá poloha → bez bonusu
  if (d <= 5)  return 15
  if (d <= 15) return 10
  if (d <= 30) return 5
  return 0
}

// ──────────────────────────────────────────────
// Věkový bonus – střed preferovaného rozsahu (Vrstva 2b)
// ──────────────────────────────────────────────
function ageBonus(me: Profile, other: Profile): number {
  const ageMin = (me as Profile & { age_min?: number }).age_min ?? 18
  const ageMax = (me as Profile & { age_max?: number }).age_max ?? 99
  const otherAge = other.birth_year
    ? new Date().getFullYear() - other.birth_year
    : null
  if (!otherAge) return 0
  if (otherAge < ageMin || otherAge > ageMax) return 0  // mimo rozsah
  const mid = (ageMin + ageMax) / 2
  const range = (ageMax - ageMin) / 2 || 1
  const dist = Math.abs(otherAge - mid)
  return Math.round(10 * Math.max(0, 1 - dist / range))  // 0–10 bodů
}

// ──────────────────────────────────────────────
// Activity score 0–100 (Vrstva G)
// 100 if ≤ 24h, 75 if ≤ 7d, 50 if ≤ 30d, 30 older
// Použito jako 5 % váhy v CCS — ne absolutní bonus
// ──────────────────────────────────────────────
function activityScore(other: Profile): number {
  if (!other.last_seen) return 30
  const diffMs = Date.now() - new Date(other.last_seen).getTime()
  const diffH = diffMs / (1000 * 60 * 60)
  if (diffH < 24) return 100
  if (diffH < 24 * 7) return 75
  if (diffH < 24 * 30) return 50
  return 30
}

// ──────────────────────────────────────────────
// Intent multiplier (Vrstva 3)
// ──────────────────────────────────────────────
/**
 * Intent multiplier — sladění záměru vztahu.
 *  ×1.2  = oba chtějí to samé (oba "vážný" nebo oba "casual") — bonus
 *  ×1.0  = neutrální / kompatibilní (např. "nevím" + cokoli)
 *  ×0.5  = hard konflikt ("serious" vs "casual") — penalizace na polovinu
 *
 * Hard veto (×0.0 = profil vůbec neviditelný) řešíme samostatně přes
 * `isChildrenIncompatible` a dealbreaker filtry, NE přes intent multiplier.
 */
function intentMultiplier(a?: string, b?: string): number {
  if (!a || !b) return 1.0
  if (a === b) return 1.2
  const hardConflict =
    (a === 'serious' && b === 'casual') ||
    (a === 'casual' && b === 'serious')
  if (hardConflict) return 0.5
  return 1.0
}


// ──────────────────────────────────────────────
// Crawford & Sullivan kategorizace — atomická vrstva I
// ──────────────────────────────────────────────

/** Compatibility row z DB má boolean flags pro 5 kategorií. */
type CompatibilityRow = {
  soul_mates?: boolean
  love_friendship?: boolean
  fatal_attraction?: boolean
  beneficial?: boolean
  challenging?: boolean
}

/**
 * Mapuje Crawford kategorie na skóre 0-100.
 *  Soul Mates ......... 100  (Spřízněné duše, harmonická vazba)
 *  Love & Friendship ..  95  (Láska a přátelství, přirozená harmonie)
 *  Magnetická tenze ...  85  (Fatal Attraction, ambivalentní karmický pár)
 *  (default)               ..  50  (neutrální, kategorie chybí)
 *  Beneficial .........  65  (mentor / praktická podpora)
 *  Challenging ........  45  (růst přes konflikt)
 */
export function crawfordScore(c: CompatibilityRow | null | undefined): number {
  if (!c) return 50
  if (c.soul_mates) return 100
  if (c.love_friendship) return 95
  if (c.fatal_attraction) return 85
  if (c.beneficial) return 65
  if (c.challenging) return 45
  return 50
}

/** Lidský label pro UI. */
export function crawfordLabel(c: CompatibilityRow | null | undefined): string {
  if (!c) return 'Neutrální'
  if (c.soul_mates) return 'Spřízněné duše'
  if (c.love_friendship) return 'Láska a přátelství'
  if (c.fatal_attraction) return 'Magnetická tenze'
  if (c.beneficial) return 'Prospěšný vztah'
  if (c.challenging) return 'Náročný vztah'
  return 'Neutrální'
}

/**
 * Asymetrický Crawford lookup — vrátí skóre obou perspektiv + flag,
 * jestli je rozdíl významný (>= 30 b mezi A→B a B→A).
 *
 * Pro main matching score používáme `mean` (vážený 50/50).
 * Plus +5 % bonus pokud oba vidí druhého pozitivně (oba >= 70).
 *
 * UI v profilu může zobrazit asymetrii s Crawford & Sullivan vysvětlením,
 * proč je vazba jednostranná.
 */
export function crawfordBidirectional(
  forward: CompatibilityRow | null | undefined,
  reverse: CompatibilityRow | null | undefined,
): { score: number; forwardScore: number; reverseScore: number; forwardLabel: string; reverseLabel: string; asymmetric: boolean; mutualPositiveBonus: boolean } {
  const fwd = crawfordScore(forward)
  const rev = crawfordScore(reverse)
  // Harmonický průměr — bottleneck rule: vztah je tak silný, jako míň zainteresovaná strana.
  // Penalizuje asymetrické páry automaticky (např. SM 100 + Challenging 45 = 62, ne 72.5).
  const harmonic = (fwd === 0 || rev === 0) ? 0 : (2 * fwd * rev) / (fwd + rev)
  // Bonus jen pro skutečně high-quality oboustranné (SM nebo L&F = oba ≥ 90).
  // Mutual Magnetic Tension (oba 85) bonus nedostává — vášnivé ale nestabilní.
  const mutualHighQuality = fwd >= 90 && rev >= 90
  const score = Math.round(Math.min(100, harmonic * (mutualHighQuality ? 1.05 : 1.0)))
  const asymmetric = Math.abs(fwd - rev) >= 25
  return {
    score,
    forwardScore: fwd,
    reverseScore: rev,
    forwardLabel: crawfordLabel(forward),
    reverseLabel: crawfordLabel(reverse),
    asymmetric,
    mutualPositiveBonus: mutualHighQuality,
  }
}

// ──────────────────────────────────────────────
// Hlavní funkce
// ──────────────────────────────────────────────
export function computeCompatibility(
  me: Profile,
  other: Profile,
  bookScore: number | null
): number {
  // ─────────────────────────────────────────────
  //  Cosmatch algoritmus v5 (Variant D'') — 24. 5. 2026
  //  Váhy seřazené podle síly evidence (Gottman, Hazan-Shaver,
  //  Heller meta r=-0.26, Sprajcer 2022, Aron 2000) + tvoje
  //  observace o Crawford & Sullivan tabulce.
  // ─────────────────────────────────────────────

  // Vrstva I – Crawford & Sullivan tabulka (30 %)
  //   Atomický lookup → 5 kategorií → skóre 100/95/85/65/45 (default 50)
  //   bookScore přichází z discover/page.tsx jako vážený průměr
  //   forward/reverse perspektivy (zachycuje asymetrii)
  const bookRaw = bookScore ?? 50
  const aScore  = bookRaw * 0.30

  // Vrstva II – Hodnoty a vize (25 %) — Gottman Shared Meaning
  const bScore = scoreLifeVision(me, other) * 0.25

  // Vrstva III – Psychologický profil (20 %)
  //   Interní rebalance: Attachment 32 + Big5N 20 + MBTI 28 + Chrono 8 + LL 6 + TKI 6 = 100 b
  const cScore = scorePsychological(me, other) * 0.20

  // Vrstva IV – Intimní soulad (10 %) — libido + chronologie sexu
  const dScore = scoreIntimate(me, other) * 0.10

  // Vrstva V – Životní styl (7 %) — Pew dealbreakers (hard veto řešeno filtry)
  const eScore = scoreLifestyle(me, other) * 0.07

  // Vrstva VI – Společné zájmy (5 %) — Aron 2000 novelty > similarity
  const ah = me.hobbies ?? []
  const bh = other.hobbies ?? []
  const sharedCount = bh.filter(h => ah.includes(h)).length
  const maxTags = Math.max(ah.length, bh.length)
  const interestPercent = maxTags > 0 ? (sharedCount / maxTags) * 100 : 0
  const fScore = Math.min(100, interestPercent) * 0.05

  // Vrstva VII – Aktivita (3 %) — last_seen decay
  const gScore = activityScore(other) * 0.03

  // Total: 30+25+20+10+7+5+3 = 100 % (clean math, žádné absolutní bonusy)
  const rawScore = aScore + bScore + cScore + dScore + eScore + fScore + gScore

  // Intent multiplier
  const multiplier = intentMultiplier(me.relationship_goal, other.relationship_goal)

  return Math.min(100, Math.round(rawScore * multiplier))
}

// ──────────────────────────────────────────────
// B) Životní vize – 20 %
// ──────────────────────────────────────────────
function scoreLifeVision(a: Profile, b: Profile): number {
  let points = 0, max = 0

  if (a.family_plans && b.family_plans) {
    max += 40
    points += childrenMatch(a.family_plans as FamilyPlans, b.family_plans as FamilyPlans) * 40
  }
  if (a.relationship_type && b.relationship_type) {
    max += 30
    if (a.relationship_type === b.relationship_type) points += 30
    else if (
      (a.relationship_type === 'serious' && b.relationship_type === 'casual') ||
      (a.relationship_type === 'casual' && b.relationship_type === 'serious')
    ) points += 0
    else points += 10
  }
  if (a.religion && b.religion) {
    max += 20
    if (a.religion === b.religion) points += 20
    else if (a.religion === 'none' || b.religion === 'none') points += 5
    else points += 10
  }
  if (a.finances && b.finances) {
    max += 10
    if (a.finances === b.finances) points += 10
    else if (a.finances !== 'balanced' && b.finances !== 'balanced') points += 0
    else points += 5
  }

  if (max === 0) return 50
  return Math.min(100, Math.round((points / max) * 100))
}

function childrenMatch(a: FamilyPlans, b: FamilyPlans): number {
  if (a === b) return 1
  if ((a === 'want_kids' && b === 'have_kids_want_more') ||
      (a === 'have_kids_want_more' && b === 'want_kids')) return 0.8
  if (a === 'open' || b === 'open') return 0.6
  if ((a === 'want_kids' && b === 'no_kids') ||
      (a === 'no_kids' && b === 'want_kids')) return 0
  return 0.3
}

// ──────────────────────────────────────────────
// C) Psychologický profil – 20 % (interní rebalance D'')
// ──────────────────────────────────────────────
function scorePsychological(a: Profile, b: Profile): number {
  // 9 sub-faktorů, body podle síly evidence (Heller 2004, Hazan-Shaver,
  // Sprajcer 2022, Bunt 2017 nefittuje 5 Love Lang):
  //   Attachment style        — 32 max — Hazan-Shaver: nejsilnější psych prediktor
  //   Big5 Neuroticism (ES)   — 20 max — Heller meta r=-0.26 (replikovaný)
  //   MBTI E/I (social)       — 10 max — koreluje s Big5 Extraversion (Costa 1989)
  //   Chronobiology           —  8 max — Sprajcer 2022 matched páry F=19.57 p<.001
  //   MBTI N/S (role)         —  6 max — slabší dimenze (test-retest fail)
  //   MBTI T/F (decision)     —  6 max — slabší dimenze
  //   MBTI J/P (lifestyle)    —  6 max — slabší dimenze
  //   Love Languages (1+2)    —  6 max — Bunt 2017 n=740 nefittuje 5-faktor
  //   Conflict style (TKI)    —  6 max — test-retest 0.61-0.68 + Gottman Horsemen vazba
  //   ─────────────────────────────────
  //   Total max               — 100

  let points = 0, max = 0

  // MBTI N/S — komplementarita lepší (6 b)
  if (a.personality_role && b.personality_role) {
    max += 6
    if (a.personality_role !== b.personality_role &&
        a.personality_role !== 'both' && b.personality_role !== 'both') points += 6
    else if (a.personality_role === 'both' || b.personality_role === 'both') points += 4
    else points += 3
  }

  // MBTI E/I — stejné lehce lepší (10 b) — koreluje s Big5 Extraversion (Watson 2000 r≈0.15-0.20).
  // Aktualizováno 28. 5. 2026: opozity nejsou silně trestány — research říká, že rozdíl je malý
  //   a mnoho šťastných E+I párů existuje. Změna 10/7/3 → 10/8/6.
  if (a.personality_social && b.personality_social) {
    max += 10
    if (a.personality_social === b.personality_social) points += 10
    else if (a.personality_social === 'ambivert' || b.personality_social === 'ambivert') points += 8
    else points += 6  // E+I — mírná penalizace, ne destruktivní
  }

  // MBTI T/F — stejné lepší (6 b)
  if (a.personality_decision && b.personality_decision) {
    max += 6
    if (a.personality_decision === b.personality_decision) points += 6
    else if (a.personality_decision === 'balanced' || b.personality_decision === 'balanced') points += 4
    else points += 2
  }

  // MBTI J/P — stejné lepší (6 b)
  if (a.personality_lifestyle && b.personality_lifestyle) {
    max += 6
    if (a.personality_lifestyle === b.personality_lifestyle) points += 6
    else if (a.personality_lifestyle === 'flexible' || b.personality_lifestyle === 'flexible') points += 4
    else points += 2
  }

  // Attachment Style (Bowlby/Hazan-Shaver) — nejsilnější psych prediktor (32 b)
  if (a.attachment_style && b.attachment_style) {
    max += 32
    const pair = [a.attachment_style, b.attachment_style].sort().join('+')
    const attachScores: Record<string, number> = {
      'secure+secure':       32,  // ideal
      'anxious+secure':      26,  // secure pomáhá léčit
      'avoidant+secure':     26,  // secure pomáhá léčit
      'disorganized+secure': 22,  // secure stabilizuje
      'anxious+anxious':     16,  // oba potřebují ujištění
      'avoidant+avoidant':   12,  // oba potřebují prostor, málo blízkosti
      'anxious+avoidant':     6,  // klasický 'chase-flee' cyklus (Kirkpatrick & Davis 1994)
      'anxious+disorganized': 8,
      'avoidant+disorganized':8,
      'disorganized+disorganized': 8,
    }
    points += attachScores[pair] ?? 14
  }

  // Love Languages — primary + secondary (6 b) — Bunt 2017 zpochybňuje 5-faktor
  if (a.love_language_primary && b.love_language_primary) {
    max += 6
    let llPoints = 0
    if (a.love_language_primary === b.love_language_primary) llPoints += 4
    else if (a.love_language_secondary === b.love_language_primary ||
             b.love_language_secondary === a.love_language_primary) llPoints += 3
    else llPoints += 1
    if (a.love_language_secondary && b.love_language_secondary) {
      if (a.love_language_secondary === b.love_language_secondary) llPoints += 2
      else llPoints += 1
    }
    points += Math.min(6, llPoints)
  }

  // Big5 Neuroticism / Emotional Stability (20 b) — Heller 2004 meta r=-0.26
  if (a.emotional_stability && b.emotional_stability) {
    max += 20
    if (a.emotional_stability === b.emotional_stability && a.emotional_stability === 'stable') points += 20
    else if (a.emotional_stability === b.emotional_stability && a.emotional_stability === 'balanced') points += 16
    else if (a.emotional_stability === b.emotional_stability && a.emotional_stability === 'reactive') points += 12 // bouřlivé ale upřímné
    else if (a.emotional_stability === 'balanced' || b.emotional_stability === 'balanced') points += 14
    else points += 8 // stable + reactive = pull
  }

  // Chronobiology (8 b) — Sprajcer 2022 matched chronotype páry F(1,58)=19.57 p<.001
  if (a.personality_schedule && b.personality_schedule) {
    max += 8
    if (a.personality_schedule === b.personality_schedule) points += 8
    else if (a.personality_schedule === 'flexible' || b.personality_schedule === 'flexible') points += 5
    else points += 1
  }

  // Conflict style (TKI) — 6 b, test-retest 0.61-0.68 + vazba na Gottman Horsemen
  if (a.personality_conflict && b.personality_conflict) {
    max += 6
    if (a.personality_conflict === b.personality_conflict && a.personality_conflict !== 'avoid') points += 6
    else if (a.personality_conflict === b.personality_conflict && a.personality_conflict === 'avoid') points += 2 // avoid+avoid problém
    else if (a.personality_conflict === 'avoid' || b.personality_conflict === 'avoid') points += 3
    else points += 4
  }

  if (max === 0) return 50
  return Math.min(100, Math.round((points / max) * 100))
}

// ──────────────────────────────────────────────
// D) Intimní kompatibilita – 10 %
// ──────────────────────────────────────────────
function scoreIntimate(a: Profile, b: Profile): number {
  if (a.libido == null || b.libido == null) return 50
  const diff = Math.abs((a.libido as number) - (b.libido as number))
  return Math.max(0, 100 - diff * 25)
}

// ──────────────────────────────────────────────
// E) Lifestyle – 10 %
// ──────────────────────────────────────────────
function scoreLifestyle(a: Profile, b: Profile): number {
  const factors: number[] = []

  if (a.smoking && b.smoking) {
    const sm: Record<string, Record<string, number>> = {
      never: { never: 100, sometimes: 50, often: 5 },
      sometimes: { never: 50, sometimes: 100, often: 60 },
      often: { never: 5, sometimes: 60, often: 100 },
    }
    factors.push(sm[a.smoking]?.[b.smoking] ?? 50)
  }
  if (a.marijuana && b.marijuana) {
    const mj: Record<string, Record<string, number>> = {
      never: { never: 100, sometimes: 50, often: 5 },
      sometimes: { never: 50, sometimes: 100, often: 60 },
      often: { never: 5, sometimes: 60, often: 100 },
    }
    factors.push(mj[a.marijuana]?.[b.marijuana] ?? 50)
  }
  if (a.alcohol && b.alcohol) {
    if (a.alcohol === b.alcohol) factors.push(100)
    else if (a.alcohol === 'never' && b.alcohol === 'regularly') factors.push(10)
    else factors.push(55)
  }
  if (a.diet && b.diet) {
    if (a.diet === b.diet) factors.push(100)
    else if (a.diet === 'vegan' && b.diet === 'omnivore') factors.push(30)
    else factors.push(65)
  }
  if (a.exercise && b.exercise) {
    const level = (e: string) => e === 'never' ? 0 : e === 'sometimes' ? 1 : 2
    const diff = Math.abs(level(a.exercise) - level(b.exercise))
    factors.push(diff === 0 ? 100 : diff === 1 ? 70 : 30)
  }

  if (!factors.length) return 50
  return Math.round(factors.reduce((s, v) => s + v, 0) / factors.length)
}

// ──────────────────────────────────────────────
// Kolik % profilu je vyplněno (0–100)
// ──────────────────────────────────────────────
export function profileCompleteness(p: Profile): number {
  const fields = [
    p.family_plans, p.relationship_type, p.religion, p.finances,
    p.personality_role, p.personality_schedule, p.personality_social, p.personality_conflict,
    p.libido, p.smoking, p.alcohol, p.diet, p.exercise,
    p.hobbies?.length,
  ]
  const filled = fields.filter(f => f !== undefined && f !== null && f !== '').length
  return Math.round((filled / fields.length) * 100)
}

// ──────────────────────────────────────────────
// Why this match? — 7-layer breakdown pro UI explanation
// ──────────────────────────────────────────────
export type LayerBreakdown = {
  key: 'crawford' | 'vision' | 'psycho' | 'intimate' | 'lifestyle' | 'hobby' | 'activity'
  label: string
  emoji: string
  score: number       // 0-100
  weight: number      // % váha
  weighted: number    // score * (weight/100)
  explanation: string
}

export function getCompatibilityBreakdown(
  me: Profile,
  other: Profile,
  bookScore: number | null,
): { layers: LayerBreakdown[]; intentMultiplier: number; finalScore: number } {
  const book = bookScore ?? 50
  const vision = scoreLifeVision(me, other)
  const psycho = scorePsychological(me, other)
  const intim = scoreIntimate(me, other)
  const lifest = scoreLifestyle(me, other)

  const ah = me.hobbies ?? []
  const bh = other.hobbies ?? []
  const sharedCount = bh.filter(h => ah.includes(h)).length
  const maxTags = Math.max(ah.length, bh.length)
  const hobbyScore = maxTags > 0 ? Math.round((sharedCount / maxTags) * 100) : 0

  const activ = activityScore(other)
  const mult = intentMultiplier(me.relationship_goal, other.relationship_goal)

  const layers: LayerBreakdown[] = [
    {
      key: 'crawford',
      label: 'Numerologie',
      emoji: '🌑',
      score: Math.round(book),
      weight: 30,
      weighted: Math.round(book * 0.30 * 10) / 10,
      explanation: book >= 95 ? 'Spřízněné duše podle Crawford tabulky'
        : book >= 85 ? 'Silné numerologické spojení'
        : book >= 65 ? 'Užitečné spojení'
        : 'Mírné numerologické tření',
    },
    {
      key: 'vision',
      label: 'Hodnoty a vize',
      emoji: '💭',
      score: vision,
      weight: 25,
      weighted: Math.round(vision * 0.25 * 10) / 10,
      explanation: vision >= 85 ? 'Stejné představy o životě (děti, vztah, víra, finance)'
        : vision >= 65 ? 'Většina hodnot souhlasí'
        : vision === 50 ? 'Jeden z vás zatím nevyplnil tuto sekci'
        : 'Některé klíčové hodnoty se rozcházejí',
    },
    {
      key: 'psycho',
      label: 'Psychologie',
      emoji: '🧠',
      score: psycho,
      weight: 20,
      weighted: Math.round(psycho * 0.20 * 10) / 10,
      explanation: psycho >= 85 ? 'Attachment, MBTI, love languages se shodují'
        : psycho >= 65 ? 'Psychologicky kompatibilní'
        : psycho === 50 ? 'Jeden z vás nevyplnil psychologický profil'
        : 'Psychologické rozdíly k překonání',
    },
    {
      key: 'intimate',
      label: 'Intimita',
      emoji: '🌹',
      score: intim,
      weight: 10,
      weighted: Math.round(intim * 0.10 * 10) / 10,
      explanation: intim >= 75 ? 'Podobné libido'
        : intim === 50 ? 'Libido zatím nevyplněno'
        : 'Libido se liší',
    },
    {
      key: 'lifestyle',
      label: 'Lifestyle',
      emoji: '🏃',
      score: lifest,
      weight: 7,
      weighted: Math.round(lifest * 0.07 * 10) / 10,
      explanation: lifest >= 80 ? 'Stejné návyky (kouření, alkohol, dieta, pohyb)'
        : lifest >= 60 ? 'Podobný životní styl'
        : 'Některé návyky se liší',
    },
    {
      key: 'hobby',
      label: 'Společné zájmy',
      emoji: '🎨',
      score: hobbyScore,
      weight: 5,
      weighted: Math.round(hobbyScore * 0.05 * 10) / 10,
      explanation: sharedCount > 0
        ? `${sharedCount} sdílených zájmů z ${maxTags}`
        : 'Žádné sdílené hobby — ale to je často šance na novou zkušenost',
    },
    {
      key: 'activity',
      label: 'Aktivita',
      emoji: '✨',
      score: activ,
      weight: 3,
      weighted: Math.round(activ * 0.03 * 10) / 10,
      explanation: activ >= 100 ? 'Online dnes'
        : activ >= 75 ? 'Online tento týden'
        : activ >= 50 ? 'Naposledy online tento měsíc'
        : 'Dlouho neaktivní',
    },
  ]

  const raw = layers.reduce((s, l) => s + l.weighted, 0)
  const finalScore = Math.min(100, Math.round(raw * mult))

  return { layers, intentMultiplier: mult, finalScore }
}

