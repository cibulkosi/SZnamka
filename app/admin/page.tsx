'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'cosmatch2026'

interface Stats {
  totalUsers: number; maleCount: number; femaleCount: number; otherCount: number
  premiumCount: number; waitlistCount: number; ambassadorCount: number
  activeToday: number; activeWeek: number
  likesTotal: number; matchesTotal: number
  newToday: number; newWeek: number
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) setAuthed(true)
    else alert('Špatné heslo')
  }

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
        supabase.from('waitlist').select('*', { count: 'exact', head: true }),
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
    if (authed) { loadStats(); const i = setInterval(loadStats, 60_000); return () => clearInterval(i) }
  }, [authed])

  if (!authed) {
    return (
      <main className="min-h-screen bg-[#FAF6F0] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <p className="eyebrow text-pink-500 mb-6 text-center">Admin</p>
          <h1 className="serif-display text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-8 text-center">
            Soukromý vstup.
          </h1>
          <form onSubmit={handleLogin} className="space-y-5">
            <input type="password" placeholder="Heslo" value={password} onChange={e => setPassword(e.target.value)} autoFocus
              className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-pink-500 px-0 py-3 text-lg text-gray-900 focus:outline-none transition-colors text-center" />
            <button type="submit" className="w-full bg-gray-900 text-white py-5 rounded-full text-base font-medium hover:bg-gray-800 transition">
              Pokračovat
            </button>
          </form>
        </div>
      </main>
    )
  }

  const maleRatio = stats && stats.totalUsers > 0 ? Math.round((stats.maleCount / stats.totalUsers) * 100) : 0
  const femaleRatio = stats && stats.totalUsers > 0 ? Math.round((stats.femaleCount / stats.totalUsers) * 100) : 0
  const premiumRate = stats && stats.totalUsers > 0 ? Math.round((stats.premiumCount / stats.totalUsers) * 100) : 0
  const matchRate = stats && stats.likesTotal > 0 ? Math.round((stats.matchesTotal / stats.likesTotal) * 100) : 0

  const fmt = (n: number) => n.toLocaleString('cs-CZ')

  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <div className="max-w-4xl mx-auto px-6 pt-6 flex items-center justify-between">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition">← Cosmatch</Link>
        {lastRefresh && (
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">Obnoveno {lastRefresh.toLocaleTimeString('cs-CZ')}</span>
            <button onClick={loadStats} disabled={loading}
              className="text-xs text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-900 px-4 py-1.5 rounded-full transition disabled:opacity-50">
              {loading ? 'Načítám…' : 'Obnovit'}
            </button>
          </div>
        )}
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
            {/* Top numbers */}
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

            {/* Gender ratio */}
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

            {/* Activity */}
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

            {/* Engagement */}
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

            {/* Quick links */}
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
