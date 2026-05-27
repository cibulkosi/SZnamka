'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { haptic } from '@/lib/haptic'

/**
 * Bottom tab bar — mobile only (skrytý nad sm: breakpoint).
 *
 * 4 položky: Objevuj / Shody / Profil / Manifest
 * (Zprávy přidáme, až bude chat. Teď „Manifest" jako 4. — privacy first signaling.)
 *
 * Badge na Shodách: počet nepřečtených/nových matchů (TODO: napojit na real-time).
 */

type Tab = {
  href: string
  label: string
  icon: (active: boolean) => JSX.Element
  badge?: number
}

const TABS: Omit<Tab, 'badge'>[] = [
  {
    href: '/discover',
    label: 'Objevuj',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(-20 12 12)" />
      </svg>
    ),
  },
  {
    href: '/matches',
    label: 'Shody',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    href: '/profile',
    label: 'Profil',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    href: '/manifest-duvery',
    label: 'Důvěra',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
]

export default function BottomTabBar() {
  const pathname = usePathname()
  const [unreadMatches, setUnreadMatches] = useState(0)
  const [signedIn, setSignedIn] = useState<boolean | null>(null)

  // Hide on routes where it doesn't make sense (landing, /register, /login, /test, /waitlist, /admin, marketing pages)
  const HIDE_ON = [
    '/', '/register', '/login', '/auth', '/test', '/waitlist',
    '/admin', '/numerologie', '/archetypy', '/demo', '/cenik',
    '/kompatibilita', '/symbolika', '/jak-funguje', '/o-projektu',
    '/about', '/zdroje', '/cookies', '/zasady', '/obchodni',
    '/odstoupeni', '/reklamacni', '/opakovane', '/pravidla',
    '/verifikace', '/kontakt', '/premium', '/ambasadorky',
  ]
  const shouldShow = !HIDE_ON.some(prefix => pathname === prefix || pathname.startsWith(prefix + '/'))

  useEffect(() => {
    if (!shouldShow) return
    let active = true
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return
      setSignedIn(!!data.user)
      if (data.user) {
        // Count new matches in last 7 days as „unread proxy" (TODO: replace s reálným read state)
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        supabase.from('matches')
          .select('id', { count: 'exact', head: true })
          .or(`user_a.eq.${data.user.id},user_b.eq.${data.user.id}`)
          .gte('created_at', oneWeekAgo)
          .then(({ count }) => { if (active) setUnreadMatches(count ?? 0) })
      }
    })
    return () => { active = false }
  }, [shouldShow])

  if (!shouldShow || signedIn === false) return null

  return (
    <>
      {/* Spacer aby content pod fixed nav nezakrýval */}
      <div className="sm:hidden h-20" aria-hidden="true" />

      <nav
        aria-label="Hlavní navigace"
        className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FAF6F0]/95 backdrop-blur border-t border-gray-200/60 pb-[env(safe-area-inset-bottom)]"
      >
        <div className="max-w-lg mx-auto px-4 grid grid-cols-4 gap-1">
          {TABS.map(t => {
            const active = pathname === t.href || pathname.startsWith(t.href + '/')
            const showBadge = t.href === '/matches' && unreadMatches > 0
            return (
              <Link
                key={t.href}
                href={t.href}
                onClick={() => haptic.light()}
                aria-label={t.label}
                aria-current={active ? 'page' : undefined}
                className={`relative flex flex-col items-center justify-center py-2.5 transition-colors ${
                  active ? 'text-pink-500' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {t.icon(active)}
                <span className={`text-[10px] mt-1 ${active ? 'font-semibold' : ''}`}>{t.label}</span>
                {showBadge && (
                  <span className="absolute top-1 right-3 min-w-[18px] h-[18px] px-1 rounded-full bg-pink-500 text-white text-[10px] font-semibold flex items-center justify-center">
                    {unreadMatches > 9 ? '9+' : unreadMatches}
                  </span>
                )}
                {active && (
                  <span className="absolute -bottom-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-pink-500 rounded-full" />
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
