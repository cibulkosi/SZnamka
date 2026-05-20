// usePremium — sjednocený check premium stavu.
// Vrací odvozené flagy: isPremium (aktivní teď), isTrial (jen ze sources='trial'),
// daysLeft, hoursLeft, isExpiringSoon (≤ 2 dny).
// Premium se rozpadne automaticky po půlnoci přes pg_cron expire_premium_trials(),
// ale hook navíc kontroluje premium_until in real time pro UX během dne.
import type { Profile } from './supabase'

export type PremiumState = {
  isPremium: boolean
  isTrial: boolean
  isFounding: boolean
  isPaid: boolean
  premiumSource: 'founding' | 'trial' | 'paid' | null
  premiumUntil: Date | null
  daysLeft: number | null
  hoursLeft: number | null
  isExpiringSoon: boolean
}

export function getPremiumState(profile: Profile | null | undefined): PremiumState {
  if (!profile) {
    return { isPremium: false, isTrial: false, isFounding: false, isPaid: false,
             premiumSource: null, premiumUntil: null, daysLeft: null, hoursLeft: null, isExpiringSoon: false }
  }
  const premiumUntil = profile.premium_until ? new Date(profile.premium_until) : null
  const now = new Date()
  const stillValid = premiumUntil ? premiumUntil.getTime() > now.getTime() : true
  const isPremium = !!profile.premium && stillValid
  const ms = premiumUntil ? premiumUntil.getTime() - now.getTime() : null
  const daysLeft = ms !== null ? Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24))) : null
  const hoursLeft = ms !== null ? Math.max(0, Math.floor(ms / (1000 * 60 * 60))) : null
  const source = (profile.premium_source ?? null) as PremiumState['premiumSource']
  return {
    isPremium,
    isTrial: isPremium && source === 'trial',
    isFounding: isPremium && source === 'founding',
    isPaid: isPremium && source === 'paid',
    premiumSource: source,
    premiumUntil,
    daysLeft,
    hoursLeft,
    isExpiringSoon: isPremium && daysLeft !== null && daysLeft <= 2,
  }
}
