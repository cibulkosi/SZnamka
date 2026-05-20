'use client'
import Link from 'next/link'
import { getPremiumState } from '@/lib/usePremium'
import type { Profile } from '@/lib/supabase'

type Props = {
  profile: Profile | null | undefined
  children: React.ReactNode
  /** Co se zobrazí místo dětí, pokud user nemá premium. Default: paywall card. */
  fallback?: React.ReactNode
  /** Krátký popis featury — zobrazí se v paywall ("Soulmate Wheel", "Kdo tě lajkl"...) */
  featureName?: string
  /** Render mode: 'replace' nahradí obsah, 'blur' nechá obsah blurnutý pod paywall overlay. */
  mode?: 'replace' | 'blur'
}

export function PremiumGate({ profile, children, fallback, featureName, mode = 'replace' }: Props) {
  const { isPremium } = getPremiumState(profile)
  if (isPremium) return <>{children}</>

  if (fallback) return <>{fallback}</>

  if (mode === 'blur') {
    return (
      <div className="relative">
        <div className="blur-sm select-none pointer-events-none">{children}</div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <PaywallCard featureName={featureName} compact />
        </div>
      </div>
    )
  }
  return <PaywallCard featureName={featureName} />
}

export function PaywallCard({ featureName, compact = false }: { featureName?: string; compact?: boolean }) {
  return (
    <div className={`bg-white border border-pink-200 rounded-3xl ${compact ? 'p-6' : 'p-8'} pointer-events-auto`}>
      <p className="eyebrow text-pink-500 mb-3">Cosmatch+</p>
      <h3 className={`serif text-gray-900 font-medium leading-tight mb-2 ${compact ? 'text-xl' : 'text-2xl'}`}>
        {featureName ? `${featureName} je v Cosmatch+.` : 'Tato funkce je v Cosmatch+.'}
      </h3>
      <p className={`text-gray-600 leading-relaxed mb-6 ${compact ? 'text-sm' : ''}`}>
        Předplať si za 249 Kč/měs a otevři si všechno.
      </p>
      <Link href="/premium" className="inline-flex items-center justify-center bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition">
        Otevřít Cosmatch+
      </Link>
    </div>
  )
}

// Trial countdown banner — zobrazí se v hlavě stránky pro trial users
export function TrialBanner({ profile }: { profile: Profile | null | undefined }) {
  const state = getPremiumState(profile)
  if (!state.isTrial || !state.premiumUntil) return null
  const { daysLeft, hoursLeft, isExpiringSoon } = state
  const label = daysLeft && daysLeft > 0
    ? `Cosmatch+ trial: zbývá ${daysLeft} ${daysLeft === 1 ? 'den' : daysLeft < 5 ? 'dny' : 'dní'}`
    : `Cosmatch+ trial končí za ${hoursLeft} h`
  return (
    <div className={`rounded-2xl p-4 mb-4 flex items-center justify-between gap-4 ${isExpiringSoon ? 'bg-amber-50 border border-amber-200' : 'bg-pink-50 border border-pink-200'}`}>
      <div>
        <p className={`text-sm font-medium ${isExpiringSoon ? 'text-amber-900' : 'text-pink-900'}`}>{label}</p>
        <p className={`text-xs ${isExpiringSoon ? 'text-amber-700' : 'text-pink-700'}`}>
          Po skončení trialu se účet vrátí na free. Karta se nestrhává.
        </p>
      </div>
      <Link href="/premium" className="flex-shrink-0 bg-gray-900 text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-gray-800 transition">
        Předplatit
      </Link>
    </div>
  )
}
