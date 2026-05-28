/**
 * Cosmatch algoritmus v5.1 — port z lib/compat.ts pro Edge Functions (Deno).
 * Aktualizováno 28. 5. 2026:
 *   - Harmonický průměr v crawfordBidirectional
 *   - MBTI E/I 10/8/6 (jemnější)
 *
 * Synchronizovat ručně s lib/compat.ts při změnách (žádný build step).
 */

type AnyProfile = Record<string, any>

type CompatibilityRow = {
  soul_mates?: boolean
  love_friendship?: boolean
  fatal_attraction?: boolean
  beneficial?: boolean
  challenging?: boolean
}

export function crawfordScore(c: CompatibilityRow | null | undefined): number {
  if (!c) return 50
  if (c.soul_mates) return 100
  if (c.love_friendship) return 95
  if (c.fatal_attraction) return 85
  if (c.beneficial) return 65
  if (c.challenging) return 45
  return 50
}

export function crawfordBidirectional(
  forward: CompatibilityRow | null | undefined,
  reverse: CompatibilityRow | null | undefined,
): { score: number; forwardScore: number; reverseScore: number; asymmetric: boolean; mutualHighQuality: boolean } {
  const fwd = crawfordScore(forward)
  const rev = crawfordScore(reverse)
  // Harmonický průměr — bottleneck rule
  const harmonic = (fwd === 0 || rev === 0) ? 0 : (2 * fwd * rev) / (fwd + rev)
  const mutualHighQuality = fwd >= 90 && rev >= 90
  const score = Math.round(Math.min(100, harmonic * (mutualHighQuality ? 1.05 : 1.0)))
  const asymmetric = Math.abs(fwd - rev) >= 25
  return { score, forwardScore: fwd, reverseScore: rev, asymmetric, mutualHighQuality }
}

// ─── Life Vision (25 %) ──────────────────────────────
function childrenMatch(a: string, b: string): number {
  if (a === b) return 1
  if ((a === 'want_kids' && b === 'have_kids_want_more') ||
      (a === 'have_kids_want_more' && b === 'want_kids')) return 0.8
  if (a === 'open' || b === 'open') return 0.6
  if ((a === 'want_kids' && b === 'no_kids') ||
      (a === 'no_kids' && b === 'want_kids')) return 0
  return 0.3
}

export function scoreLifeVision(a: AnyProfile, b: AnyProfile): number {
  let points = 0, max = 0
  if (a.family_plans && b.family_plans) {
    max += 40
    points += childrenMatch(a.family_plans, b.family_plans) * 40
  }
  if (a.relationship_type && b.relationship_type) {
    max += 30
    if (a.relationship_type === b.relationship_type) points += 30
    else if ((a.relationship_type === 'serious' && b.relationship_type === 'casual') ||
             (a.relationship_type === 'casual' && b.relationship_type === 'serious')) points += 0
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

// ─── Psychological (20 %) ─────────────────────────────
export function scorePsychological(a: AnyProfile, b: AnyProfile): number {
  let points = 0, max = 0
  if (a.personality_role && b.personality_role) {
    max += 6
    if (a.personality_role !== b.personality_role &&
        a.personality_role !== 'both' && b.personality_role !== 'both') points += 6
    else if (a.personality_role === 'both' || b.personality_role === 'both') points += 4
    else points += 3
  }
  // MBTI E/I — 10/8/6 (zjemněno 28.5.2026)
  if (a.personality_social && b.personality_social) {
    max += 10
    if (a.personality_social === b.personality_social) points += 10
    else if (a.personality_social === 'ambivert' || b.personality_social === 'ambivert') points += 8
    else points += 6
  }
  if (a.personality_decision && b.personality_decision) {
    max += 6
    if (a.personality_decision === b.personality_decision) points += 6
    else if (a.personality_decision === 'balanced' || b.personality_decision === 'balanced') points += 4
    else points += 2
  }
  if (a.personality_lifestyle && b.personality_lifestyle) {
    max += 6
    if (a.personality_lifestyle === b.personality_lifestyle) points += 6
    else if (a.personality_lifestyle === 'flexible' || b.personality_lifestyle === 'flexible') points += 4
    else points += 2
  }
  if (a.attachment_style && b.attachment_style) {
    max += 32
    const pair = [a.attachment_style, b.attachment_style].sort().join('+')
    const attachScores: Record<string, number> = {
      'secure+secure': 32, 'anxious+secure': 26, 'avoidant+secure': 26, 'disorganized+secure': 22,
      'anxious+anxious': 16, 'avoidant+avoidant': 12, 'anxious+avoidant': 6,
      'anxious+disorganized': 8, 'avoidant+disorganized': 8, 'disorganized+disorganized': 8,
    }
    points += attachScores[pair] ?? 14
  }
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
  if (a.emotional_stability && b.emotional_stability) {
    max += 20
    if (a.emotional_stability === b.emotional_stability && a.emotional_stability === 'stable') points += 20
    else if (a.emotional_stability === b.emotional_stability && a.emotional_stability === 'balanced') points += 16
    else if (a.emotional_stability === b.emotional_stability && a.emotional_stability === 'reactive') points += 12
    else if (a.emotional_stability === 'balanced' || b.emotional_stability === 'balanced') points += 14
    else points += 8
  }
  if (a.personality_schedule && b.personality_schedule) {
    max += 8
    if (a.personality_schedule === b.personality_schedule) points += 8
    else if (a.personality_schedule === 'flexible' || b.personality_schedule === 'flexible') points += 5
    else points += 1
  }
  if (a.personality_conflict && b.personality_conflict) {
    max += 6
    if (a.personality_conflict === b.personality_conflict && a.personality_conflict !== 'avoid') points += 6
    else if (a.personality_conflict === b.personality_conflict && a.personality_conflict === 'avoid') points += 2
    else if (a.personality_conflict === 'avoid' || b.personality_conflict === 'avoid') points += 3
    else points += 4
  }
  if (max === 0) return 50
  return Math.min(100, Math.round((points / max) * 100))
}

// ─── Intimate (10 %) ──────────────────────────────────
export function scoreIntimate(a: AnyProfile, b: AnyProfile): number {
  if (a.libido == null || b.libido == null) return 50
  const diff = Math.abs(Number(a.libido) - Number(b.libido))
  return Math.max(0, 100 - diff * 25)
}

// ─── Lifestyle (7 %) ──────────────────────────────────
export function scoreLifestyle(a: AnyProfile, b: AnyProfile): number {
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

// ─── Activity (3 %) ──────────────────────────────────
export function activityScore(other: AnyProfile): number {
  if (!other.last_seen) return 30
  const diffMs = Date.now() - new Date(other.last_seen).getTime()
  const diffH = diffMs / (1000 * 60 * 60)
  if (diffH < 24) return 100
  if (diffH < 24 * 7) return 75
  if (diffH < 24 * 30) return 50
  return 30
}

// ─── Intent multiplier ────────────────────────────────
export function intentMultiplier(a?: string, b?: string): number {
  if (!a || !b) return 1.0
  if (a === b) return 1.2
  const hardConflict = (a === 'serious' && b === 'casual') || (a === 'casual' && b === 'serious')
  if (hardConflict) return 0.5
  return 1.0
}

// ─── Full composite (the 7-layer algorithm) ──────────
export function computeCompatibility(me: AnyProfile, other: AnyProfile, bookScore: number | null): number {
  const bookRaw = bookScore ?? 50
  const a = bookRaw * 0.30
  const b = scoreLifeVision(me, other) * 0.25
  const c = scorePsychological(me, other) * 0.20
  const d = scoreIntimate(me, other) * 0.10
  const e = scoreLifestyle(me, other) * 0.07
  const ah = me.hobbies ?? []
  const bh = other.hobbies ?? []
  const sharedCount = bh.filter((h: string) => ah.includes(h)).length
  const maxTags = Math.max(ah.length, bh.length)
  const interestPercent = maxTags > 0 ? (sharedCount / maxTags) * 100 : 0
  const f = Math.min(100, interestPercent) * 0.05
  const g = activityScore(other) * 0.03
  const raw = a + b + c + d + e + f + g
  const mult = intentMultiplier(me.relationship_goal, other.relationship_goal)
  return Math.min(100, Math.round(raw * mult))
}
