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
  personality_role?: string     // 'visionary' | 'executor' | 'both'
  personality_schedule?: string // 'morning' | 'night' | 'flexible'
  personality_social?: string   // 'introvert' | 'extrovert' | 'ambivert'
  personality_conflict?: string // 'talk' | 'cool_down' | 'avoid'

  // D) Intimní kompatibilita
  libido?: number  // 1–5 (1=zřídka, 5=každý den)

  // E) Lifestyle
  smoking?: string   // 'never' | 'sometimes' | 'often'
  alcohol?: string   // 'never' | 'socially' | 'regularly'
  diet?: string      // 'omnivore' | 'vegetarian' | 'vegan' | 'other'
  exercise?: string  // 'never' | 'sometimes' | 'regularly'

  // ── Trust & verifikace ──────────────────────────
  verified?: boolean        // TRUE pokud uživatel prošel ID verifikací (Serious tier)
  verified_at?: string      // ISO timestamp ověření
  deleted_at?: string       // Soft-delete (GDPR výmaz, 30 dní pak hard delete)
  deletion_reason?: string  // 'user_initiated' / 'gdpr_request' / 'admin_action'
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
  'Cestování', 'Hudba', 'Sport', 'Příroda', 'Vaření', 'Umění',
  'Čtení', 'Filmy', 'Tanec', 'Fitness', 'Fotografování', 'Jóga',
  'Hry', 'Zahradničení', 'Meditace', 'Dobrovolnictví',
  'Travel', 'Music', 'Hiking', 'Cooking', 'Art', 'Dancing'
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
