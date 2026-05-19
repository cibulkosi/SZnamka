// Heuristic Czech declension for first names (covers ~90% of common Czech names)
// Foreign names default to nominative.

export function vocative(name: string): string {
  if (!name) return name
  const n = name.trim()
  if (n.length < 2) return n
  if (/ová$/.test(n)) return n
  if (/a$/.test(n)) return n.slice(0, -1) + 'o'
  if (/ie$/.test(n)) return n
  if (/e$/.test(n)) return n
  if (/[iyuo]$/.test(n)) return n
  if (/el$/.test(n)) return n.slice(0, -2) + 'le'
  if (/ek$/.test(n)) return n.slice(0, -2) + 'ku'
  if (/r$/.test(n)) return n.slice(0, -1) + 'ře'
  if (/[šžčřťďňcj]$/.test(n)) return n + 'i'
  if (/k$/.test(n)) return n + 'u'
  if (/(g|h|ch)$/.test(n)) return n + 'u'
  if (/[bdfhlmnpstvxz]$/.test(n)) return n + 'e'
  return n
}

export function instrumental(name: string): string {
  if (!name) return name
  const n = name.trim()
  if (n.length < 2) return n
  if (/ová$/.test(n)) return n.slice(0, -1) + 'ou'
  if (/a$/.test(n)) return n.slice(0, -1) + 'ou'
  if (/ie$/.test(n)) return n.slice(0, -1) + 'í'
  if (/e$/.test(n)) return n
  if (/[iyuo]$/.test(n)) return n
  if (/el$/.test(n)) return n.slice(0, -2) + 'lem'
  if (/ek$/.test(n)) return n.slice(0, -2) + 'kem'
  if (/[šžčřťďňcj]$/.test(n)) return n + 'em'
  if (/[bcdfghklmnprstvxz]$/.test(n)) return n + 'em'
  return n
}

// "s X" or "se X" by phonetic rule (se before s/z/š/ž)
export function sSe(name: string): string {
  const ins = instrumental(name)
  const first = ins.charAt(0).toLowerCase()
  return ('szšž'.includes(first) ? 'se ' : 's ') + ins
}

// Gender-aware past tense verb form
// past('napsal', 'woman') -> 'napsala'
// past('napsal', 'man') -> 'napsal'
// past('napsal', undefined) -> 'napsal/a'
export function past(maleForm: string, gender?: string | null): string {
  if (!maleForm) return maleForm
  const g = (gender ?? '').toLowerCase()
  if (g === 'woman' || g === 'female' || g === 'f' || g === 'ž') return maleForm + 'a'
  if (g === 'man' || g === 'male' || g === 'm') return maleForm
  return maleForm + '/a'
}
