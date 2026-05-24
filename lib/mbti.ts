/**
 * Cosmatch MBTI typ computation
 *
 * Vrátí 4-písmenný MBTI typ (INFJ, ENTP, ...) z 4 osobnostních dimenzí.
 * Vrátí null pokud nějaká dimenze chybí nebo je "balanced/both/ambivert/flexible" (= nejasná).
 *
 * Pokud chceš tolerantnější mapping (vrátit typ i pro ambivalentní hodnoty),
 * použij computeMBTITolerant.
 */

import type { Profile } from './supabase'

export const MBTI_TYPES_CZ: Record<string, { name: string; tagline: string }> = {
  INTJ: { name: 'Architekt',     tagline: 'Strategický vizionář.' },
  INTP: { name: 'Logik',         tagline: 'Inovativní vynálezce.' },
  ENTJ: { name: 'Velitel',       tagline: 'Rozhodný leader.' },
  ENTP: { name: 'Polemik',       tagline: 'Vynalézavý debater.' },
  INFJ: { name: 'Advokát',       tagline: 'Tichý idealista.' },
  INFP: { name: 'Smiřitel',      tagline: 'Poetický romantik.' },
  ENFJ: { name: 'Protagonista',  tagline: 'Charismatický vůdce.' },
  ENFP: { name: 'Kampaňér',      tagline: 'Nadšený svobodomyslník.' },
  ISTJ: { name: 'Logistik',      tagline: 'Spolehlivý realista.' },
  ISFJ: { name: 'Obhájce',       tagline: 'Pečující ochránce.' },
  ESTJ: { name: 'Manažer',       tagline: 'Organizovaný správce.' },
  ESFJ: { name: 'Konzul',        tagline: 'Společenský pomocník.' },
  ISTP: { name: 'Virtuoso',      tagline: 'Praktický experimentátor.' },
  ISFP: { name: 'Dobrodruh',     tagline: 'Citlivý umělec.' },
  ESTP: { name: 'Podnikatel',    tagline: 'Energický akční typ.' },
  ESFP: { name: 'Bavič',         tagline: 'Spontánní zábavář.' },
}

/**
 * Strict MBTI — vrátí typ jen pokud všechny 4 dimenze jednoznačné.
 */
export function computeMBTI(p: Profile): string | null {
  const dimEI = p.personality_social === 'extrovert' ? 'E' :
                p.personality_social === 'introvert' ? 'I' : null
  const dimNS = p.personality_role === 'visionary' ? 'N' :
                p.personality_role === 'executor' ? 'S' : null
  const dimTF = p.personality_decision === 'logic' ? 'T' :
                p.personality_decision === 'heart' ? 'F' : null
  const dimJP = p.personality_lifestyle === 'planned' ? 'J' :
                p.personality_lifestyle === 'spontaneous' ? 'P' : null

  if (!dimEI || !dimNS || !dimTF || !dimJP) return null
  return dimEI + dimNS + dimTF + dimJP
}

/**
 * Tolerant MBTI — pro ambivalentní hodnoty zvolí defaultní variantu.
 * Použije: ambivert → I, both → N, balanced → F, flexible → P.
 * Vrátí null jen pokud dimenze úplně chybí (undefined).
 */
export function computeMBTITolerant(p: Profile): string | null {
  if (!p.personality_social || !p.personality_role ||
      !p.personality_decision || !p.personality_lifestyle) return null

  const dimEI = p.personality_social === 'extrovert' ? 'E' : 'I'        // ambivert → I
  const dimNS = p.personality_role === 'executor' ? 'S' : 'N'           // both → N
  const dimTF = p.personality_decision === 'logic' ? 'T' : 'F'          // balanced → F
  const dimJP = p.personality_lifestyle === 'planned' ? 'J' : 'P'       // flexible → P

  return dimEI + dimNS + dimTF + dimJP
}

/**
 * Vrátí čitelný popis MBTI typu pro UI.
 */
export function mbtiLabel(type: string | null): string {
  if (!type) return '—'
  const info = MBTI_TYPES_CZ[type]
  return info ? `${type} — ${info.name}` : type
}
