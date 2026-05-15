/**
 * Cosmatch – Enhanced Compatibility Algorithm
 *
 * Váhový model:
 *   A) Datová rezonance (kniha)     35 %
 *   B) Životní vize & hodnoty       20 %
 *   C) Osobnost & týmovost          15 %
 *   D) Intimní kompatibilita        10 %
 *   E) Lifestyle & návyky           10 %
 *   F) Zájmy (hobbies)              10 %
 *
 * Intent multiplier (relationship_goal):
 *   Shodný záměr (oba Vážný / oba Přátelství / oba Nezávazně) → ×1.2
 *   Kompatibilní záměr (jeden nebo oba "Zatím nevím")          → ×1.0
 *   Protichůdný záměr (Vážný vs. Nezávazně)                   → ×0.5
 */

import type { Profile } from './supabase'

// ──────────────────────────────────────────────
// Typy pro nová profilová pole
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
export type Diet           = 'omnivore' | 'vegetarian' | 'vegan' | 'other'
export type Exercise       = 'never' | 'sometimes' | 'regularly'

/**
 * Hlavní funkce – vypočítá celkové skóre kompatibility (0–100)
 *
 * @param me          Přihlášený uživatel
 * @param other       Zobrazovaný profil
 * @param bookScore   Skóre z tabulky compatibility (0–100), nebo null pokud neexistuje
 */
export function computeCompatibility(
  me: Profile,
  other: Profile,
  bookScore: number | null
): number {
  // ── A) Datová rezonance (35 %) ───────────────
  // bookScore může být null pokud pro tento pár nebyla nalezena žádná vazba v knize
  const bookRaw = bookScore ?? 0
  const aScore  = bookRaw * 0.35

  // ── B) Životní vize (20 %) ────────────────────
  const bScore = scoreLifeVision(me, other) * 0.20

  // ── C) Osobnost & týmovost (15 %) ────────────
  const cScore = scorePersonality(me, other) * 0.15

  // ── D) Intimní kompatibilita (10 %) ──────────
  const dScore = scoreIntimate(me, other) * 0.10

  // ── E) Lifestyle & návyky (10 %) ─────────────
  const eScore = scoreLifestyle(me, other) * 0.10

  // ── F) Zájmy (10 %) ──────────────────────────
  const fScore = scoreInterests(me, other) * 0.10

  const rawScore = aScore + bScore + cScore + dScore + eScore + fScore

  // ── Intent multiplier (relationship_goal) ────
  const multiplier = intentMultiplier(me.relationship_goal, other.relationship_goal)

  return Math.min(100, Math.round(rawScore * multiplier))
}

/**
 * Intent multiplier — záměr vztahu ovlivňuje celkové skóre
 *
 * serious   = Vážný vztah
 * friendship = Přátelství
 * casual    = Nezávazně
 * unsure    = Zatím nevím
 */
function intentMultiplier(a?: string, b?: string): number {
  if (!a || !b) return 1.0        // chybí data → neutrální

  if (a === b) return 1.2         // přesná shoda záměru → boost

  // Protichůdné záměry (dealbreaker páry)
  const hardConflict = (
    (a === 'serious' && b === 'casual') ||
    (a === 'casual' && b === 'serious')
  )
  if (hardConflict) return 0.5    // závažný nesoulad → penalizace

  // Jeden nebo oba "unsure" → neutrální
  if (a === 'unsure' || b === 'unsure') return 1.0

  // Přátelství vs. cokoliv jiného (není přímo konflikt)
  return 1.0
}

// ──────────────────────────────────────────────
// B) Životní vize – 20 %
// ──────────────────────────────────────────────
function scoreLifeVision(a: Profile, b: Profile): number {
  let points = 0
  let max    = 0

  // Děti (velmi důležité – deal-breaker)
  if (a.family_plans && b.family_plans) {
    max += 40
    const fp = childrenMatch(a.family_plans as FamilyPlans, b.family_plans as FamilyPlans)
    points += fp * 40
  }

  // Typ vztahu
  if (a.relationship_type && b.relationship_type) {
    max += 30
    if (a.relationship_type === b.relationship_type) points += 30
    else if (
      (a.relationship_type === 'serious' && b.relationship_type === 'casual') ||
      (a.relationship_type === 'casual' && b.relationship_type === 'serious')
    ) points += 0 // hard mismatch
    else points += 10
  }

  // Víra / spiritualita
  if (a.religion && b.religion) {
    max += 20
    if (a.religion === b.religion) points += 20
    else if (a.religion === 'none' || b.religion === 'none') points += 5
    else points += 10
  }

  // Finance
  if (a.finances && b.finances) {
    max += 10
    if (a.finances === b.finances) points += 10
    else if (a.finances !== 'balanced' && b.finances !== 'balanced' && a.finances !== b.finances) points += 0
    else points += 5
  }

  if (max === 0) return 50 // žádná data → neutrální
  return Math.min(100, Math.round((points / max) * 100))
}

/** Míra shody v otázce dětí (0–1) */
function childrenMatch(a: FamilyPlans, b: FamilyPlans): number {
  if (a === b) return 1
  if (
    (a === 'want_kids' && b === 'have_kids_want_more') ||
    (a === 'have_kids_want_more' && b === 'want_kids')
  ) return 0.8
  if (a === 'open' || b === 'open') return 0.6
  if (
    (a === 'want_kids' && b === 'no_kids') ||
    (a === 'no_kids' && b === 'want_kids')
  ) return 0  // deal-breaker
  return 0.3
}

// ──────────────────────────────────────────────
// C) Osobnost & týmovost – 15 %
// ──────────────────────────────────────────────
function scorePersonality(a: Profile, b: Profile): number {
  let points = 0
  let max    = 0

  // Role (vizionář vs realizátor) – komplementarita je lepší než shoda
  if (a.personality_role && b.personality_role) {
    max += 35
    if (a.personality_role !== b.personality_role && a.personality_role !== 'both' && b.personality_role !== 'both') {
      points += 35 // dokonalý tým
    } else if (a.personality_role === 'both' || b.personality_role === 'both') {
      points += 25
    } else {
      points += 15 // stejná role – méně synergie
    }
  }

  // Sociální energie – shoda nebo ambivert = flexibilní
  if (a.personality_social && b.personality_social) {
    max += 30
    if (a.personality_social === b.personality_social) points += 30
    else if (a.personality_social === 'ambivert' || b.personality_social === 'ambivert') points += 20
    else points += 10 // introvert + extrovert – funguje, ale s výzvami
  }

  // Denní rytmus (sova vs skřivan)
  if (a.personality_schedule && b.personality_schedule) {
    max += 20
    if (a.personality_schedule === b.personality_schedule) points += 20
    else if (a.personality_schedule === 'flexible' || b.personality_schedule === 'flexible') points += 15
    else points += 0 // sova + skřivan = chronický problém
  }

  // Řešení konfliktů – shoda
  if (a.personality_conflict && b.personality_conflict) {
    max += 15
    if (a.personality_conflict === b.personality_conflict) points += 15
    else if (a.personality_conflict === 'avoid' && b.personality_conflict !== 'talk') points += 5
    else points += 8
  }

  if (max === 0) return 50
  return Math.min(100, Math.round((points / max) * 100))
}

// ──────────────────────────────────────────────
// D) Intimní kompatibilita – 10 %
// ──────────────────────────────────────────────
function scoreIntimate(a: Profile, b: Profile): number {
  if (a.libido === undefined || a.libido === null || b.libido === undefined || b.libido === null) {
    return 50 // neutrální – chybí data
  }
  const diff = Math.abs((a.libido as number) - (b.libido as number))
  // diff 0 → 100, diff 1 → 80, diff 2 → 50, diff 3 → 20, diff 4 → 0
  return Math.max(0, 100 - diff * 25)
}

// ──────────────────────────────────────────────
// E) Lifestyle & návyky – 10 %
// ──────────────────────────────────────────────
function scoreLifestyle(a: Profile, b: Profile): number {
  const factors: number[] = []

  if (a.smoking && b.smoking) {
    factors.push(smokingMatch(a.smoking as Smoking, b.smoking as Smoking))
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
    if (a.exercise === b.exercise) factors.push(100)
    else if (Math.abs(exerciseLevel(a.exercise as Exercise) - exerciseLevel(b.exercise as Exercise)) <= 1) factors.push(70)
    else factors.push(30)
  }

  if (factors.length === 0) return 50
  return Math.round(factors.reduce((s, v) => s + v, 0) / factors.length)
}

function smokingMatch(a: Smoking, b: Smoking): number {
  if (a === b) return 100
  if (a === 'never' && b === 'often') return 5
  if (a === 'often' && b === 'never') return 5
  return 50
}

function exerciseLevel(e: Exercise): number {
  return e === 'never' ? 0 : e === 'sometimes' ? 1 : 2
}

// ──────────────────────────────────────────────
// F) Zájmy – 10 %
// ──────────────────────────────────────────────
function scoreInterests(a: Profile, b: Profile): number {
  const ah = a.hobbies ?? []
  const bh = b.hobbies ?? []
  if (!ah.length || !bh.length) return 50

  const aSet   = new Set(ah)
  const overlap = bh.filter(h => aSet.has(h)).length
  const union   = new Set([...ah, ...bh]).size
  return Math.round((overlap / union) * 100)
}

// ──────────────────────────────────────────────
// Kolik % profilu je vyplněno (0–100)
// ──────────────────────────────────────────────
export function profileCompleteness(p: Profile): number {
  const fields = [
    p.family_plans, p.relationship_type, p.religion, p.finances,
    p.personality_role, p.personality_schedule, p.personality_social, p.personality_conflict,
    p.libido,
    p.smoking, p.alcohol, p.diet, p.exercise,
    p.hobbies?.length,
  ]
  const filled = fields.filter(f => f !== undefined && f !== null && f !== '').length
  return Math.round((filled / fields.length) * 100)
}
