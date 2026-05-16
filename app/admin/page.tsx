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
  totalUsers: number
  maleCount: number
  femaleCount: number
  otherCount: number
  premiumCount: number
  waitlistCount: number
  ambassadorCount: number
  activeToday: number
  activeWeek: number
  likesTotal: number
  matchesTotal: number
  newToday: number
  newWeek: number
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
        { count: totalUsers },
        { count: maleCount },
        { count: femaleCount },
        { count: otherCount },
        { count: premiumCount },
        { count: waitlistCount },
        { count: ambassadorCount },
        { count: activeToday },
        { count: activeWeek },
        { count: likesTotal },
        { count: matchesTotal },
        { count: newToday },
        { count: newWeek },
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
        totalUsers: totalUsers || 0,
        maleCount: maleCount || 0,
        femaleCount: femaleCount || 0,
        otherCount: otherCount || 0,
        premiumCount: premiumCount || 0,
        waitlistCount: waitlistCount || 0,
        ambassadorCount: ambassadorCount || 0,
        activeToday: activeToday || 0,
        activeWeek: activeWeek || 0,
        likesTotal: likesTotal || 0,
        matchesTotal: matchesTotal || 0,
        newToday: newToday || 0,
        newWeek: newWeek || 0,
      })
      setLastRefresh(new Date())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authed) {
      loadStats()
      const interval = setInterval(loadStats, 60_000) // refresh every minute
      return () => clearInterval(interval)
    }
  }, [authed])

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center px-6">
        <div className="card p-8 w-full max-w-sm text-center">
          <span className="text-2xl text-pink-500">✦</span>
          <h1 className="text-xl font-bold text-gray-900 mt-3 mb-6">Admin přístup</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              className="input w-full"
              placeholder="Heslo"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn-primary w-full py-3">Přihlásit se</button>
          </form>
        </div>
      </div>
    )
  }

  const maleRatio = stats && stats.totalUsers > 0
    ? Math.round((stats.maleCount / stats.totalUsers) * 100) : 0
  const femaleRatio = stats && stats.totalUsers > 0
    ? Math.round((stats.femaleCount / stats.totalUsers) * 100) : 0
  const premiumRate = stats && stats.totalUsers > 0
    ? Math.round((stats.premiumCount / stats.totalUsers) * 100) : 0
  const matchRate = stats && stats.likesTotal > 0
    ? Math.round((stats.matchesTotal / stats.likesTotal) * 100) : 0

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-pink-500 text-xl font-bold">✦</Link>
            <h1 className="text-xl font-bold text-gray-900">Cosmatch Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            {lastRefresh && (
              <span className="text-gray-400 text-xs">
                Obnoveno: {lastRefresh.toLocaleTimeString('cs-CZ')}
              </span>
            )}
            <button
              onClick={loadStats}
              disabled={loading}
              className="btn-secondary px-4 py-2 text-sm"
            >
              {loading ? 'Načítám...' : 'Obnovit'}
            </button>
          </div>
        </div>

        {stats && (
          <>
            {/* Key numbers */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Celkem uživatelů', value: stats.totalUsers, color: 'text-gray-900' },
                { label: 'Waitlist', value: stats.waitlistCount, color: 'text-pink-500' },
                { label: 'Premium', value: stats.premiumCount, sub: `${premiumRate}%`, color: 'text-purple-600' },
                { label: 'Ambasadorky', value: stats.ambassadorCount, color: 'text-indigo-500' },
              ].map(m => (
                <div key={m.label} className="card p-5">
                  <div className={`text-3xl font-black ${m.color}`}>{m.value.toLocaleString('cs-CZ')}</div>
                  {m.sub && <div className="text-xs text-gray-400">{m.sub} z celku</div>}
                  <div className="text-gray-500 text-sm mt-1">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Gender ratio */}
            <div className="card p-6 mb-6">
              <h2 className="font-bold text-gray-900 mb-4">Gender ratio</h2>
              <div className="flex rounded-full overflow-hidden h-8 mb-3">
                <div
                  className={`h-full flex items-center justify-center text-white text-xs font-bold transition-all ${maleRatio > 65 ? 'bg-red-500' : 'bg-blue-400'}`}
                  style={{ width: `${maleRatio}%` }}
                >
                  {maleRatio > 15 ? `Muži ${maleRatio}%` : ''}
                </div>
                <div
                  className="h-full bg-pink-400 flex items-center justify-center text-white text-xs font-bold"
                  style={{ width: `${femaleRatio}%` }}
                >
                  {femaleRatio > 15 ? `Ženy ${femaleRatio}%` : ''}
                </div>
                <div
                  className="h-full bg-purple-300 flex items-center justify-center text-white text-xs"
                  style={{ width: `${100 - maleRatio - femaleRatio}%` }}
                >
                </div>
              </div>
              <div className="flex gap-6 text-sm">
                <span><strong className="text-blue-500">{stats.maleCount}</strong> mužů</span>
                <span><strong className="text-pink-500">{stats.femaleCount}</strong> žen</span>
                <span><strong className="text-purple-500">{stats.otherCount}</strong> ostatní</span>
              </div>
              {maleRatio > 65 && (
                <div className="mt-3 bg-red-50 text-red-600 rounded-xl p-3 text-sm">
                  Gender cap aktivní — registrace mužů přesměrovány na waitlist.
                </div>
              )}
              {maleRatio <= 65 && (
                <div className="mt-3 bg-green-50 text-green-600 rounded-xl p-3 text-sm">
                  Gender ratio v pořádku — registrace otevřeny.
                </div>
              )}
            </div>

            {/* Activity */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Aktivní dnes', value: stats.activeToday },
                { label: 'Aktivní tento týden', value: stats.activeWeek },
                { label: 'Noví dnes', value: stats.newToday },
                { label: 'Noví tento týden', value: stats.newWeek },
              ].map(m => (
                <div key={m.label} className="card p-5">
                  <div className="text-2xl font-black text-gray-900">{m.value}</div>
                  <div className="text-gray-500 text-sm mt-1">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Engagement */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="card p-5">
                <div className="text-2xl font-black text-gray-900">{stats.likesTotal.toLocaleString('cs-CZ')}</div>
                <div className="text-gray-500 text-sm mt-1">Celkem swipů (likes)</div>
              </div>
              <div className="card p-5">
                <div className="text-2xl font-black text-pink-500">{stats.matchesTotal.toLocaleString('cs-CZ')}</div>
                <div className="text-gray-500 text-sm mt-1">Shod ({matchRate}% match rate)</div>
              </div>
            </div>

            {/* Quick links */}
            <div className="card p-5">
              <h2 className="font-bold text-gray-900 mb-3">Rychlé akce</h2>
              <div className="flex flex-wrap gap-3">
                <a href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/project/default/editor`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn-secondary text-sm px-4 py-2">
                  Supabase SQL Editor
                </a>
                <Link href="/waitlist" className="btn-secondary text-sm px-4 py-2">Waitlist stránka</Link>
                <Link href="/ambasadorky" className="btn-secondary text-sm px-4 py-2">Ambasadorky</Link>
                <Link href="/discover" className="btn-secondary text-sm px-4 py-2">Discover (jako uživatel)</Link>
              </div>
            </div>
          </>
        )}

        {loading && !stats && (
          <div className="text-center py-20 text-gray-400">Načítám data...</div>
        )}
      </div>
    </div>
  )
}
