/**
 * Cosmatch – Compatibility Algorithm v3 (květen 2026)
 * 
 * CCS = (
 *    35 % × birth_date_score (book lookup ONLY — life path je teď jen v Magic Moment, ne v matchingu)
 *  + 20 % × life_vision_score (family/relationship_type/religion/finances)
 *  + 15 % × personality_score (role/social/schedule/conflict)
 *  + 10 % × intimate_score (libido 1–5)
 *  + 10 % × lifestyle_score (smoking/alcohol/diet/exercise)
 *  +  5 % × interests_score (záliby procentně, sharedCount/max × 100)
 *  +  5 % × activity_score (0–100 podle last_seen, ne absolutní bonus)
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
export type PersonRole     = 'visionary' | 'executor' | 'both'
export type PersonSchedule = 'morning' | 'night' | 'flexible'
export type PersonSocial   = 'introvert' | 'extrovert' | 'ambivert'
export type PersonConflict = 'talk' | 'cool_down' | 'avoid'
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
// Hlavní funkce
// ──────────────────────────────────────────────
export function computeCompatibility(
  me: Profile,
  other: Profile,
  bookScore: number | null
): number {
  // Vrstva A – Birth date score (35 %)
  // ONLY book lookup as main signal — life path je jen pro Magic Moment, ne pro matching.
  // 3-tier life-path fallback boost je aplikován v /discover (kde máme přístup k archetypes lib)
  // takže sem už chodí buď reálné book score nebo tier-adjusted score.
  const bookRaw = bookScore ?? 50
  const aScore  = bookRaw * 0.35

  // Vrstva B – Životní vize (20 %)
  const bScore = scoreLifeVision(me, other) * 0.20

  // Vrstva C – Osobnost (15 %)
  const cScore = scorePersonality(me, other) * 0.15

  // Vrstva D – Intimní (10 %) — libido
  const dScore = scoreIntimate(me, other) * 0.10

  // Vrstva E – Lifestyle (10 %)
  const eScore = scoreLifestyle(me, other) * 0.10

  // Vrstva F – Společné zájmy (5 %)
  const ah = me.hobbies ?? []
  const bh = other.hobbies ?? []
  const sharedCount = bh.filter(h => ah.includes(h)).length
  const maxTags = Math.max(ah.length, bh.length)
  const interestPercent = maxTags > 0 ? (sharedCount / maxTags) * 100 : 0
  const fScore = Math.min(100, interestPercent) * 0.05

  // Vrstva G – Activity (5 %)
  const gScore = activityScore(other) * 0.05

  // Total weighted: 100 % (clean math, žádné absolutní bonusy)
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
// C) Osobnost & týmovost – 15 %
// ──────────────────────────────────────────────
function scorePersonality(a: Profile, b: Profile): number {
  let points = 0, max = 0

  if (a.personality_role && b.personality_role) {
    max += 35
    if (a.personality_role !== b.personality_role &&
        a.personality_role !== 'both' && b.personality_role !== 'both') points += 35
    else if (a.personality_role === 'both' || b.personality_role === 'both') points += 25
    else points += 15
  }
  if (a.personality_social && b.personality_social) {
    max += 30
    if (a.personality_social === b.personality_social) points += 30
    else if (a.personality_social === 'ambivert' || b.personality_social === 'ambivert') points += 20
    else points += 10
  }
  if (a.personality_schedule && b.personality_schedule) {
    max += 20
    if (a.personality_schedule === b.personality_schedule) points += 20
    else if (a.personality_schedule === 'flexible' || b.personality_schedule === 'flexible') points += 15
    else points += 0
  }
  if (a.personality_conflict && b.personality_conflict) {
    max += 15
    if (a.personality_conflict === b.personality_conflict) points += 15
    else if (a.personality_conflict === 'avoid') points += 5
    else points += 8
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
