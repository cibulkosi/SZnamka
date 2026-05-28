'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ADMIN_EMAILS = ['cibulkovasimona@gmail.com']

type Metrics = {
  total_users: number
  women: number
  men: number
  other_gender: number
  signups_24h: number
  signups_7d: number
  signups_30d: number
  active_24h: number
  active_7d: number
  active_30d: number
  premium_active: number
  verified: number
  likes_24h: number
  matches_24h: number
  matches_7d: number
  messages_24h: number
  waitlist_total: number
  waitlist_redeemed: number
  verif_pending: number
}

type DailySignup = { day: string; signups: number; women: number; men: number }

function StatCard({ label, value, secondary, accent }: { label: string; value: number | string; secondary?: string; accent?: 'pink' | 'emerald' | 'amber' | 'gray' }) {
  const colors = {
    pink: 'border-pink-200 bg-pink-50',
    emerald: 'border-emerald-200 bg-emerald-50',
    amber: 'border-amber-200 bg-amber-50',
    gray: 'border-gray-200 bg-white',
  }
  return (
    <div className={`rounded-2xl border p-5 ${colors[accent || 'gray']}`}>
      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{label}</p>
      <p className="serif-display text-3xl text-gray-900 font-medium tabular-nums">{value}</p>
      {secondary && <p className="text-xs text-gray-500 mt-1">{secondary}</p>}
    </div>
  )
}

export default function AdminGrowthPage() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [daily, setDaily] = useState<DailySignup[]>([])

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user || !ADMIN_EMAILS.includes(data.user.email || '')) {
        setAuthed(false); return
      }
      setAuthed(true)

      const [m, d] = await Promise.all([
        supabase.from('admin_growth_metrics').select('*').single(),
        supabase.from('admin_daily_signups').select('*').order('day', { ascending: true }),
      ])

      if (m.data) setMetrics(m.data as Metrics)
      if (d.data) setDaily(d.data as DailySignup[])
    })
  }, [])

  if (authed === null) return <main className="min-h-screen bg-[#F0EBE3] flex items-center justify-center"><p className="text-gray-400 text-sm">Načítám…</p></main>
  if (authed === false) return <main className="min-h-screen bg-[#F0EBE3] flex items-center justify-center"><p className="text-gray-400 text-sm">Není povoleno.</p></main>
  if (!metrics) return <main className="min-h-screen bg-[#F0EBE3] flex items-center justify-center"><p className="text-gray-400 text-sm">Loading metrics…</p></main>

  const womenPct = metrics.total_users > 0 ? Math.round((metrics.women / metrics.total_users) * 100) : 0
  const menPct = metrics.total_users > 0 ? Math.round((metrics.men / metrics.total_users) * 100) : 0
  const dailyMax = Math.max(1, ...daily.map(d => d.signups))

  return (
    <main className="min-h-screen bg-[#F0EBE3] pb-24">
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900 transition">← Admin</Link>

        <header className="mt-8 mb-10">
          <p className="eyebrow text-pink-500 mb-2">Růst</p>
          <h1 className="serif-display text-4xl text-gray-900 font-medium leading-tight tracking-tight">
            Cosmatch growth dashboard
          </h1>
          <hr className="rule w-12 border-gray-900 mt-6" />
        </header>

        {/* Total users */}
        <section className="mb-8">
          <h2 className="eyebrow text-gray-500 mb-3">Uživatelé</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Total users" value={metrics.total_users} accent="pink" secondary={`${metrics.women} žen · ${metrics.men} mužů`} />
            <StatCard label="Premium aktivní" value={metrics.premium_active} accent="amber" />
            <StatCard label="Ověřené (modrá fajfka)" value={metrics.verified} accent="emerald" />
            <StatCard label="Verifikace čekají" value={metrics.verif_pending} />
          </div>

          {/* Gender bar */}
          {metrics.total_users > 0 && (
            <div className="mt-4 bg-white rounded-2xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-2">Rozložení pohlaví</p>
              <div className="flex h-3 rounded-full overflow-hidden">
                <div className="bg-pink-500" style={{ width: `${womenPct}%` }} title={`${womenPct}% žen`} />
                <div className="bg-blue-400" style={{ width: `${menPct}%` }} title={`${menPct}% mužů`} />
                <div className="bg-gray-300 flex-1" />
              </div>
              <div className="flex gap-4 mt-2 text-xs text-gray-600">
                <span><span className="inline-block w-2 h-2 bg-pink-500 rounded mr-1 align-middle" />Ženy {womenPct}% ({metrics.women})</span>
                <span><span className="inline-block w-2 h-2 bg-blue-400 rounded mr-1 align-middle" />Muži {menPct}% ({metrics.men})</span>
                <span><span className="inline-block w-2 h-2 bg-gray-300 rounded mr-1 align-middle" />Ostatní {metrics.other_gender}</span>
              </div>
            </div>
          )}
        </section>

        {/* Signups */}
        <section className="mb-8">
          <h2 className="eyebrow text-gray-500 mb-3">Registrace</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <StatCard label="Posledních 24 h" value={metrics.signups_24h} />
            <StatCard label="Posledních 7 dnů" value={metrics.signups_7d} secondary={metrics.signups_24h > 0 ? `${(metrics.signups_7d / 7).toFixed(1)}/den` : ''} />
            <StatCard label="Posledních 30 dnů" value={metrics.signups_30d} secondary={metrics.signups_30d > 0 ? `${(metrics.signups_30d / 30).toFixed(1)}/den` : ''} />
          </div>

          {/* Daily signups chart */}
          {daily.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <p className="text-xs text-gray-500 mb-3">Denní registrace (30 dní)</p>
              <div className="flex items-end gap-1 h-32">
                {daily.map(d => {
                  const h = (d.signups / dailyMax) * 100
                  return (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-1 group">
                      <div className="w-full bg-pink-500 rounded-t" style={{ height: `${Math.max(2, h)}%` }} title={`${d.day}: ${d.signups}`} />
                      <span className="text-[10px] text-gray-400 invisible group-hover:visible">{d.signups}</span>
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-gray-400">
                <span>{daily[0]?.day}</span>
                <span>{daily[daily.length - 1]?.day}</span>
              </div>
            </div>
          )}
        </section>

        {/* Engagement */}
        <section className="mb-8">
          <h2 className="eyebrow text-gray-500 mb-3">Engagement (posl. 24 h)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Aktivní 24 h" value={metrics.active_24h} accent="emerald" />
            <StatCard label="Lajky" value={metrics.likes_24h} />
            <StatCard label="Nové shody" value={metrics.matches_24h} accent="pink" />
            <StatCard label="Zprávy" value={metrics.messages_24h} />
          </div>

          <div className="grid grid-cols-3 gap-3 mt-3">
            <StatCard label="Aktivní 7 d" value={metrics.active_7d} />
            <StatCard label="Aktivní 30 d" value={metrics.active_30d} />
            <StatCard label="Shody 7 d" value={metrics.matches_7d} />
          </div>
        </section>

        {/* Retention rates */}
        <section className="mb-8">
          <h2 className="eyebrow text-gray-500 mb-3">Retention</h2>
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              label="DAU / Total"
              value={metrics.total_users > 0 ? `${Math.round(metrics.active_24h / metrics.total_users * 100)} %` : '—'}
              secondary={`${metrics.active_24h} z ${metrics.total_users}`}
            />
            <StatCard
              label="WAU / Total"
              value={metrics.total_users > 0 ? `${Math.round(metrics.active_7d / metrics.total_users * 100)} %` : '—'}
              secondary={`${metrics.active_7d} z ${metrics.total_users}`}
            />
            <StatCard
              label="MAU / Total"
              value={metrics.total_users > 0 ? `${Math.round(metrics.active_30d / metrics.total_users * 100)} %` : '—'}
              secondary={`${metrics.active_30d} z ${metrics.total_users}`}
            />
          </div>
        </section>

        {/* Waitlist */}
        <section className="mb-8">
          <h2 className="eyebrow text-gray-500 mb-3">Waitlist</h2>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Total na waitlistu" value={metrics.waitlist_total} />
            <StatCard
              label="Voucher redeemed"
              value={metrics.waitlist_redeemed}
              accent="emerald"
              secondary={metrics.waitlist_total > 0 ? `${Math.round(metrics.waitlist_redeemed / metrics.waitlist_total * 100)} % conversion` : ''}
            />
          </div>
        </section>

        <p className="text-xs text-gray-400 italic text-center pt-4">
          Data se aktualizují při každém načtení stránky. Seed test profily (8 mužských) jsou vyloučené ze všech metrik.
        </p>
      </div>
    </main>
  )
}
