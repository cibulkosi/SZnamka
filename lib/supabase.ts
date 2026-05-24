import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  email: string
  name: string
  birthday: string       // MM-DD
  birth_year: number
  gender: string
  looking_for: string
  city: string
  country: string
  country_code: string
  bio: string
  hobbies: string[]
  photos: string[]
  premium: boolean
  active: boolean
  created_at: string
  occupation?: string
  education?: string
  philosophy?: string
  relationship_goal?: string  // 'serious' | 'friendship' | 'casual' | 'unsure'

  // ── Geolokace + aktivita ──────────────────────
  latitude?: number
  longitude?: number
  last_seen?: string      // ISO timestamptz — kdy byl uživatel naposledy online
  elo_score?: number      // ELO / desirability score (default 1400)

  // ── Nová pole – algoritmus kompatibility ──────────
  // B) Životní vize
  family_plans?: string       // 'want_kids' | 'have_kids_want_more' | 'no_kids' | 'open'
  religion?: string           // 'none' | 'religious' | 'spiritual' | 'other'
  finances?: string           // 'saver' | 'spender' | 'balanced'
  relationship_type?: string  // 'serious' | 'casual' | 'open' | 'unsure'

  // C) Osobnost & týmovost
  personality_role?: string     // 'visionary' | 'executor' | 'both'    — MBTI N/S
  personality_social?: string   // 'introvert' | 'extrovert' | 'ambivert' — MBTI E/I
  personality_decision?: string // 'logic' | 'heart' | 'balanced'         — MBTI T/F
  personality_lifestyle?: string// 'planned' | 'spontaneous' | 'flexible' — MBTI J/P
  personality_schedule?: string // 'morning' | 'night' | 'flexible'       — chronobiology
  personality_conflict?: string // 'talk' | 'cool_down' | 'avoid'         — Thomas-Kilmann

  // D) Intimní kompatibilita
  libido?: number  // 1–5 (1=zřídka, 5=každý den)

  // E) Lifestyle
  smoking?: string   // 'never' | 'sometimes' | 'often'
  alcohol?: string   // 'never' | 'socially' | 'regularly'
  diet?: string      // 'omnivore' | 'vegetarian' | 'vegan' | 'other'
  exercise?: string  // 'never' | 'sometimes' | 'regularly'

  // ── Compatibility filter (uživatel si volí min %) ──────────
  min_compatibility?: number      // 0 / 25 / 50 / 75 — pod tuto hranici se profil nezobrazí

  // ── Premium filtry (Cosmatch+) ──────────
  filter_soul_mates_only?: boolean   // jen profily ze Soul Mates kategorie
  filter_mutual_only?: boolean       // jen profily s mutual ↔ kompatibilitou

  // ── Opt-in deal-breakers ──────────
  smoking_dealbreaker?: boolean   // pokud true: 'never' uživatel × 'regularly' partner → HARD FILTER
  alcohol_dealbreaker?: boolean   // pokud true: 'never' uživatel × 'regularly' partner → HARD FILTER
  marijuana?: string              // 'never' | 'rarely' | 'sometimes' | 'regularly'
  marijuana_dealbreaker?: boolean // pokud true: 'never' uživatel × 'regularly' partner → HARD FILTER

  // ── F) Fyzické preference (jen filtry, NIKDY skóre) ──────────
  height_cm?: number              // vlastní výška v cm (volitelné)
  body_type?: string              // 'slim' | 'athletic' | 'average' | 'curvy' | 'plus' | 'prefer_not_say'
  pref_height_min?: number        // preferovaná výška partnera min (cm) — filtr
  pref_height_max?: number        // preferovaná výška partnera max (cm) — filtr
  pref_body_types?: string[]      // preferované postavy partnera — filtr (array)

  // ── Trust & verifikace ──────────────────────────
  verified?: boolean        // TRUE pokud uživatel prošel ID verifikací (rezervováno pro budoucí Serious tier)
  verified_at?: string      // ISO timestamp ověření
  deleted_at?: string       // Soft-delete (GDPR výmaz, 30 dní pak hard delete)
  deletion_reason?: string  // 'user_initiated' / 'gdpr_request' / 'admin_action'
  // ── Voucher + Founding member (added 19. 5. 2026) ──
  voucher_code?: string | null
  voucher_redeemed_at?: string | null
  life_path?: number | null
  archetype?: string | null
  is_founding_member?: boolean
  founding_badge_visible?: boolean

  // ── Premium lifecycle (přidáno 20. 5. 2026) ───────
  premium_until?: string | null      // ISO timestamptz, kdy končí premium
  premium_source?: 'founding' | 'trial' | 'paid' | null
  trial_started_at?: string | null
  legal_consent_immediate_service_at?: string | null

}

export const EDUCATION_OPTIONS = [
  'Střední škola', 'Vyšší odborná škola', 'Bakalář', 'Magistr / Ing.', 'Doktorát', 'Jiné'
]

export function getZodiac(birthday: string): string {
  if (!birthday) return ''
  const [mm, dd] = birthday.split('-').map(Number)
  if (!mm || !dd) return ''
  const d = mm * 100 + dd
  if (d >= 321 && d <= 419) return '♈ Beran'
  if (d >= 420 && d <= 520) return '♉ Býk'
  if (d >= 521 && d <= 620) return '♊ Blíženci'
  if (d >= 621 && d <= 722) return '♋ Rak'
  if (d >= 723 && d <= 822) return '♌ Lev'
  if (d >= 823 && d <= 922) return '♍ Panna'
  if (d >= 923 && d <= 1022) return '♎ Váhy'
  if (d >= 1023 && d <= 1121) return '♏ Štír'
  if (d >= 1122 && d <= 1221) return '♐ Střelec'
  if (d >= 1222 || d <= 119) return '♑ Kozoroh'
  if (d >= 120 && d <= 218) return '♒ Vodnář'
  return '♓ Ryby'
}

export type Compatibility = {
  date_a: string
  date_b: string
  love_friendship: boolean
  beneficial: boolean
  fatal_attraction: boolean
  challenging: boolean
  soul_mates: boolean
  is_mutual: boolean
  score: number
}

export const HOBBIES = [
  // Aktivní pohyb (8)
  'Běhání', 'Cyklistika', 'Fitness', 'Jóga', 'Plavání', 'Lyžování', 'Tanec', 'Turistika',
  // Příroda & cestování (5)
  'Cestování', 'Příroda', 'Camping', 'Horolezectví', 'Zahradničení',
  // Kultura (8)
  'Filmy', 'Hudba', 'Koncerty', 'Divadlo', 'Čtení', 'Umění', 'Muzea', 'Fotografování',
  // Tvoření & jídlo (5)
  'Vaření', 'Pečení', 'Káva', 'Víno', 'Kreslení',
  // Spiritualita & sebepoznání (5)
  'Meditace', 'Numerologie', 'Astrologie', 'Psychologie', 'Filozofie',
  // Sociální & komunita (4)
  'Dobrovolnictví', 'Společenské akce', 'Festivaly', 'Rodina',
  // Domov & pohoda (5)
  'Domácí mazlíčci', 'Hry', 'Deskové hry', 'Vinyly', 'Bylinky',
  // Tech & moderní (5)
  'Technologie', 'Podnikání', 'Investování', 'Podcasty', 'Programování',
]

export const MIN_HOBBIES = 3
export const MAX_HOBBIES = 8

// ── Fyzické preference (jen filtry, nikdy součást skóre) ────────
export const BODY_TYPES = [
  { value: 'slim',            label: 'Štíhlá' },
  { value: 'athletic',        label: 'Sportovní' },
  { value: 'average',         label: 'Průměrná' },
  { value: 'curvy',           label: 'Křivky' },
  { value: 'plus',            label: 'Plus size' },
  { value: 'prefer_not_say',  label: 'Neuvedeno' },
]

export const COUNTRIES = [
  { code: 'CZ', name: 'Česká republika' },
  { code: 'SK', name: 'Slovensko' },
  { code: 'DE', name: 'Německo' },
  { code: 'AT', name: 'Rakousko' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'PL', name: 'Poland' },
  { code: 'HU', name: 'Hungary' },
  { code: 'HR', name: 'Croatia' },
  { code: 'OTHER', name: 'Other / Jiné' },
]

// ── Session-based profile loading (Auth refactor — May 2026) ──────
// 
// Use this instead of localStorage.getItem('cosmatch_user').
// localStorage is kept as cache for instant render, but Supabase Auth session
// is the source of truth. Profile is always re-fetched from DB.
//
// Returns one of:
//   { kind: 'no-session' } — user is not logged in → redirect to /login
//   { kind: 'no-profile', authId, email } — logged in but no profile yet → redirect to /register
//   { kind: 'ok', profile } — fully authenticated with profile
//
export type ProfileLoadResult =
  | { kind: 'no-session' }
  | { kind: 'no-profile'; authId: string; email: string; name: string }
  | { kind: 'ok'; profile: Profile }

export async function loadCurrentProfile(): Promise<ProfileLoadResult> {
  // 1. Get session (returns immediately from in-memory cache)
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return { kind: 'no-session' }
  
  const authId = session.user.id
  const email = session.user.email || ''
  const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || ''
  
  // 2. Fetch profile by auth user id (now that profiles.id == auth.users.id)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authId)
    .single()
  
  if (!profile) return { kind: 'no-profile', authId, email, name }
  
  // 3. Update localStorage cache for backwards-compat during transition
  try { localStorage.setItem('cosmatch_user', JSON.stringify(profile)) } catch {}
  
  return { kind: 'ok', profile: profile as Profile }
}

// Helper: clear all auth state (logout)
export async function signOutCompletely() {
  try { localStorage.removeItem('cosmatch_user') } catch {}
  try { localStorage.removeItem('cosmatch_magic_seen') } catch {}
  try { localStorage.removeItem('cosmatch_oauth') } catch {}
  await supabase.auth.signOut()
}
