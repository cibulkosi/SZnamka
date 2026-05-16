
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Whitelist of admin e-mails. Add more here if needed.
// This list also exists in JS but only emails that match an ACTUAL signed-in
// Supabase session pass. Useless without genuine OAuth login.
const ADMIN_EMAILS = [
  'cibulkovasimona@gmail.com',
]

interface Stats {
  totalUsers: number; maleCount: number; femaleCount: number; otherCount: number
  premiumCount: number; waitlistCount: number; ambassadorCount: number
  activeToday: number; activeWeek: number
  likesTotal: number; matchesTotal: number
  newToday: number; newWeek: number
}

type AuthState =
  | { kind: 'loading' }
  | { kind: 'unauth' }
  | { kind: 'denied'; email: string }
  | { kind: 'ok'; email: string }

export default function AdminPage() {
  const [auth, setAuth] = useState<AuthState>({ kind: 'loading' })
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  // Watch auth state — handles both initial load and OAuth callback redirect
  useEffect(() => {
    let cancelled = false
    const update = (session: { user?: { email?: string | null } } | null) => {
      if (cancelled) return
      const email = session?.user?.email?.toLowerCase()
      if (!email) { setAuth({ kind: 'unauth' }); return }
      if (ADMIN_EMAILS.includes(email)) setAuth({ kind: 'ok', email })
      else setAuth({ kind: 'denied', email })
    }
    supabase.auth.getSession().then(({ data }) => update(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => update(session))
    return () => { cancelled = true; sub.subscription.unsubscribe() }
  }, [])

  async function loadStats() {
    setLoading(true)
    try {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
      const [
        { count: totalUsers }, { count: maleCount }, { count: femaleCount }, { count: otherCount },
        { count: premiumCount }, { count: waitlistCount }, { count: ambassadorCount },
        { count: activeToday }, { count: activeWeek },
        { count: likesTotal }, { count: matchesTotal },
        { count: newToday }, { count: newWeek },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).or('gender.eq.male,gender.eq.Muž'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).or('gender.eq.female,gender.eq.Žena'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).not('gender', 'in', '(male,female,Muž,Žena)'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('premium', true),
        supabase.from('waitlist_public').select('*', { count: 'exact', head: true }),
        supabase.from('ambassadors').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('last_seen', today),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('last_seen', weekAgo),
        supabase.from('likes').select('*', { count: 'exact', head: true }),
        supabase.from('matches').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', today),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo),
      ])
      setStats({
        totalUsers: totalUsers || 0, maleCount: maleCount || 0, femaleCount: femaleCount || 0,
        otherCount: otherCount || 0, premiumCount: premiumCount || 0, waitlistCount: waitlistCount || 0,
        ambassadorCount: ambassadorCount || 0,
        activeToday: activeToday || 0, activeWeek: activeWeek || 0,
        likesTotal: likesTotal || 0, matchesTotal: matchesTotal || 0,
        newToday: newToday || 0, newWeek: newWeek || 0,
      })
      setLastRefresh(new Date())
    } finally { setLoading(false) }
  }

  useEffect(() => {
    if (auth.kind === 'ok') {
      loadStats()
      const i = setInterval(loadStats, 60_000)
      return () => clearInterval(i)
    }
  }, [auth.kind])

  async function signIn() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/admin` },
    })
  }
  async function signOut() {
    await supabase.auth.signOut()
    setAuth({ kind: 'unauth' })
  }

  // ── LOADING ─────────────────
  if (auth.kind === 'loading') {
    return (
      <main className="min-h-screen bg-[#FAF6F0] flex items-center justify-center">
        <p className="text-gray-400 text-sm">Ověřuji přístup…</p>
      </main>
    )
  }

  // ── UNAUTH — show sign-in ──────
  if (auth.kind === 'unauth') {
    return (
      <main className="min-h-screen bg-[#FAF6F0] flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <p className="eyebrow text-pink-500 mb-6">Admin</p>
          <h1 className="serif-display text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-8">
            Soukromý vstup.
          </h1>
          <p className="text-gray-600 leading-relaxed mb-8 text-[1.0625rem]">
            Přístup ověřujeme přes Google. Otevře se pouze konkrétním e-mailům.
          </p>
          <button onClick={signIn}
            className="w-full flex items-center justify-center gap-3 py-5 px-6 bg-white border border-gray-200 hover:border-gray-900 rounded-full text-base font-medium text-gray-900 transition-all active:scale-[0.99]">
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Přihlásit přes Google
          </button>
          <Link href="/" className="block mt-8 text-sm text-gray-500 hover:text-gray-900 transition">
            ← Zpět na Cosmatch
          </Link>
        </div>
      </main>
    )
  }

  // ── DENIED — wrong account ─────
  if (auth.kind === 'denied') {
    return (
      <main className="min-h-screen bg-[#FAF6F0] flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <p className="eyebrow text-red-500 mb-6">Přístup zamítnut</p>
          <h1 className="serif-display text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
            Tento účet nemá oprávnění.
          </h1>
          <p className="text-gray-600 leading-relaxed mb-2 text-[1.0625rem]">
            Přihlášený jako <span className="font-mono text-sm">{auth.email}</span>
          </p>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Admin panel je dostupný jen vybraným e-mailům. Odhlas se a přihlas správným účtem.
          </p>
          <button onClick={signOut}
            className="w-full bg-gray-900 text-white py-5 rounded-full text-base font-medium hover:bg-gray-800 transition">
            Odhlásit a zkusit znovu
          </button>
          <Link href="/" className="block mt-8 text-sm text-gray-500 hover:text-gray-900 transition">
            ← Zpět na Cosmatch
          </Link>
        </div>
      </main>
    )
  }

  // ── OK — render dashboard ──────────
  const maleRatio = stats && stats.totalUsers > 0 ? Math.round((stats.maleCount / stats.totalUsers) * 100) : 0
  const femaleRatio = stats && stats.totalUsers > 0 ? Math.round((stats.femaleCount / stats.totalUsers) * 100) : 0
  const premiumRate = stats && stats.totalUsers > 0 ? Math.round((stats.premiumCount / stats.totalUsers) * 100) : 0
  const matchRate = stats && stats.likesTotal > 0 ? Math.round((stats.matchesTotal / stats.likesTotal) * 100) : 0
  const fmt = (n: number) => n.toLocaleString('cs-CZ')

  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <div className="max-w-4xl mx-auto px-6 pt-6 flex items-center justify-between">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">← Cosmatch</Link>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400">{auth.email}</span>
          {lastRefresh && <span className="text-xs text-gray-400">· obnoveno {lastRefresh.toLocaleTimeString('cs-CZ')}</span>}
          <button onClick={loadStats} disabled={loading}
            className="text-xs text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-900 px-4 py-1.5 rounded-full transition disabled:opacity-50">
            {loading ? 'Načítám…' : 'Obnovit'}
          </button>
          <button onClick={signOut}
            className="text-xs text-gray-500 hover:text-gray-900 transition">
            Odhlásit
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-12 pb-24">
        <header className="mb-16">
          <p className="eyebrow text-pink-500 mb-6">Dashboard</p>
          <h1 className="serif-display text-5xl text-gray-900 font-medium leading-[1.05] tracking-tight">
            Cosmatch v číslech.
          </h1>
        </header>

        {!stats ? (
          <p className="text-gray-400 py-20 text-center">Načítám data…</p>
        ) : (
          <>
            <section className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 mb-20">
              {[
                ['Uživatelů', fmt(stats.totalUsers), null],
                ['Waitlist', fmt(stats.waitlistCount), null],
                ['Premium', fmt(stats.premiumCount), `${premiumRate} %`],
                ['Ambasadorky', fmt(stats.ambassadorCount), null],
              ].map(([label, val, sub]) => (
                <div key={label as string}>
                  <p className="eyebrow text-gray-500 mb-2">{label}</p>
                  <p className="serif-display text-5xl text-gray-900 font-medium tracking-tight tabular-nums">{val}</p>
                  {sub && <p className="text-xs text-gray-400 mt-1">{sub} z celku</p>}
                </div>
              ))}
            </section>

            <hr className="rule mb-16" />

            <section className="mb-20">
              <p className="eyebrow text-pink-500 mb-4">Gender ratio</p>
              <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-8">
                Poměr pohlaví.
              </h2>
              <div className="bg-white rounded-3xl p-8 border border-gray-100">
                <div className="flex rounded-full overflow-hidden h-3 mb-6 bg-gray-100">
                  <div className={`h-full transition-all ${maleRatio > 65 ? 'bg-red-500' : 'bg-gray-700'}`} style={{ width: `${maleRatio}%` }} />
                  <div className="h-full bg-pink-500 transition-all" style={{ width: `${femaleRatio}%` }} />
                  <div className="h-full bg-gray-300 transition-all" style={{ width: `${100 - maleRatio - femaleRatio}%` }} />
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="eyebrow text-gray-500 mb-1">Muži</p>
                    <p className="serif text-3xl text-gray-900 font-medium">{maleRatio} <span className="text-base text-gray-500">%</span></p>
                    <p className="text-xs text-gray-400 mt-1">{fmt(stats.maleCount)}</p>
                  </div>
                  <div>
                    <p className="eyebrow text-gray-500 mb-1">Ženy</p>
                    <p className="serif text-3xl text-pink-500 font-medium">{femaleRatio} <span className="text-base text-gray-400">%</span></p>
                    <p className="text-xs text-gray-400 mt-1">{fmt(stats.femaleCount)}</p>
                  </div>
                  <div>
                    <p className="eyebrow text-gray-500 mb-1">Ostatní</p>
                    <p className="serif text-3xl text-gray-900 font-medium">{100 - maleRatio - femaleRatio} <span className="text-base text-gray-500">%</span></p>
                    <p className="text-xs text-gray-400 mt-1">{fmt(stats.otherCount)}</p>
                  </div>
                </div>
                <div className={`mt-6 pt-6 border-t border-gray-100 text-sm leading-relaxed ${maleRatio > 65 ? 'text-red-600' : 'text-emerald-700'}`}>
                  {maleRatio > 65
                    ? 'Cap aktivní — nové registrace mužů jsou přesměrovány na waitlist.'
                    : 'V pořádku — registrace otevřeny pro všechny.'}
                </div>
              </div>
            </section>

            <hr className="rule mb-16" />

            <section className="mb-20">
              <p className="eyebrow text-pink-500 mb-4">Aktivita</p>
              <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-10">
                Kdo se vrací a kdo přibývá.
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                {[
                  ['Aktivní dnes', stats.activeToday],
                  ['Aktivní tento týden', stats.activeWeek],
                  ['Noví dnes', stats.newToday],
                  ['Noví tento týden', stats.newWeek],
                ].map(([l, v]) => (
                  <div key={l as string}>
                    <p className="eyebrow text-gray-500 mb-2">{l}</p>
                    <p className="serif-display text-4xl text-gray-900 font-medium tracking-tight tabular-nums">{fmt(v as number)}</p>
                  </div>
                ))}
              </div>
            </section>

            <hr className="rule mb-16" />

            <section className="mb-20">
              <p className="eyebrow text-pink-500 mb-4">Engagement</p>
              <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-10">
                Lajky a shody.
              </h2>
              <div className="grid grid-cols-2 gap-x-8">
                <div>
                  <p className="eyebrow text-gray-500 mb-2">Lajky celkem</p>
                  <p className="serif-display text-5xl text-gray-900 font-medium tracking-tight tabular-nums">{fmt(stats.likesTotal)}</p>
                </div>
                <div>
                  <p className="eyebrow text-gray-500 mb-2">Shod · {matchRate} % match rate</p>
                  <p className="serif-display text-5xl text-pink-500 font-medium tracking-tight tabular-nums">{fmt(stats.matchesTotal)}</p>
                </div>
              </div>
            </section>

            <section>
              <p className="eyebrow text-pink-500 mb-4">Rychlé akce</p>
              <div className="flex flex-wrap gap-3">
                <a href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/project/default/editor`} target="_blank" rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-white border border-gray-300 hover:border-gray-900 text-sm text-gray-700 hover:text-gray-900 transition">
                  Supabase SQL Editor
                </a>
                <Link href="/waitlist" className="px-5 py-2.5 rounded-full bg-white border border-gray-300 hover:border-gray-900 text-sm text-gray-700 hover:text-gray-900 transition">Waitlist</Link>
                <Link href="/ambasadorky" className="px-5 py-2.5 rounded-full bg-white border border-gray-300 hover:border-gray-900 text-sm text-gray-700 hover:text-gray-900 transition">Ambasadorky</Link>
                <Link href="/discover" className="px-5 py-2.5 rounded-full bg-white border border-gray-300 hover:border-gray-900 text-sm text-gray-700 hover:text-gray-900 transition">Discover</Link>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  )
}
