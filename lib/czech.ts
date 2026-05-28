/**
 * České skloňování pro UI komponenty (frontend).
 *
 * Stejná logika jako v supabase/functions/_shared/czech.ts (e-maily),
 * ať Cosmatch mluví konzistentně na webu i v notifikacích.
 *
 * vocative(): 5. pád — oslovení
 *   Klára → Kláro
 *   Jakub → Jakube
 *   Tomáš → Tomáši
 *   Petr → Petře
 *   Eva → Evo
 *   Marek → Marku
 *   Václav → Václave
 *   Cizí jména (Sarah, Andre) zůstávají bez změny.
 */

export function vocative(name: string): string {
  if (!name) return name
  // Beru jen první slovo (pokud Klára Nováková → Kláro)
  const n = name.trim().split(/\s+/)[0]
  if (n.length < 2) return n

  // ová na konci (české příjmení) — nepoužíváme jako oslovení
  if (/ová$/.test(n)) return n

  // Ženská na -a → -o (Klára → Kláro, Eva → Evo, Anna → Anno)
  if (/a$/.test(n)) return n.slice(0, -1) + 'o'

  // Cizí jména končící na -ie/-e/-i/-y/-u/-o zůstávají
  if (/ie$/.test(n)) return n
  if (/e$/.test(n)) return n
  if (/[iyuo]$/.test(n)) return n

  // -el → -le (Karel → Karle)
  if (/el$/.test(n)) return n.slice(0, -2) + 'le'

  // -ek → -ku (Marek → Marku, Vašek → Vašku)
  if (/ek$/.test(n)) return n.slice(0, -2) + 'ku'

  // -r → -ře (Petr → Petře)
  if (/r$/.test(n)) return n.slice(0, -1) + 'ře'

  // Sykavky → +i (Tomáš → Tomáši, Lukáš → Lukáši)
  if (/[šžčřťďňcj]$/.test(n)) return n + 'i'

  // -k → +u (Marek → Marku už řešeno; ostatní k jako jednoslabičná)
  if (/k$/.test(n)) return n + 'u'

  // -g/-h/-ch → +u
  if (/(g|h|ch)$/.test(n)) return n + 'u'

  // Tvrdé konsonanty → +e (Václav → Václave, Honza-ne, ne; Jan → Jane)
  if (/[bdfhlmnpstvxz]$/.test(n)) return n + 'e'

  return n
}

/**
 * Jen křestní jméno z případně celého jména.
 *   „Klára Nováková" → „Klára"
 *   „Klára" → „Klára"
 */
export function firstNameOnly(fullName: string | null | undefined): string {
  if (!fullName) return ''
  return fullName.trim().split(/\s+/)[0]
}

/**
 * Křestní jméno ve 5. pádu pro oslovení.
 *   „Klára Nováková" → „Kláro"
 *   null → ""
 */
export function vocativeFirstName(fullName: string | null | undefined): string {
  return vocative(firstNameOnly(fullName))
}
