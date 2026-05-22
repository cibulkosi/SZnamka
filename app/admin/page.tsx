
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

interface PremiumSummaryRow {
  premium_source: string
  users: number
  active: number
  expired: number
  expiring_soon: number
}

interface TrialUserRow {
  id: string
  name: string | null
  email: string | null
  premium_until: string
  premium_source: string
}

interface VoucherGenderStats {
  voucher_gender_cap: number | null
  cap_active: boolean
  female_count: number
  male_count: number
  other_count: number
  total_redempce: number
  female_pct: number | null
  male_pct: number | null
  female_cap_reached: boolean
  male_cap_reached: boolean
}

interface Stats {
  totalUsers: number; maleCount: number; femaleCount: number; otherCount: number
  premiumCount: number; waitlistCount: number; ambassadorCount: number
  activeToday: number; activeWeek: number
  likesTotal: number; matchesTotal: number
  newToday: number; newWeek: number
  premiumSummary: PremiumSummaryRow[]
  trialList: TrialUserRow[]
  voucherGender: VoucherGenderStats | null
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
  const [newMessagesCount, setNewMessagesCount] = useState<number>(0)

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
      // Fetch premium summary view (founding / trial / paid breakdown)
      const { data: premiumSummary } = await supabase
        .from('admin_premium_summary')
        .select('*')
      // Fetch list of users in trial state, ordered by closest expiry
      const { data: trialList } = await supabase
        .from('profiles')
        .select('id, name, email, premium_until, premium_source')
        .eq('premium_source', 'trial')
        .eq('premium', true)
        .order('premium_until', { ascending: true })
        .limit(50)
      // Voucher gender stats (admin-only RPC)
      const { data: voucherGenderData } = await supabase.rpc('admin_voucher_gender_stats')
      // Contact messages — count nových
      const { data: msgCountData } = await supabase.rpc('admin_contact_messages_count', { p_status: 'new' })
      setNewMessagesCount(typeof msgCountData === 'number' ? msgCountData : 0)
      setStats({
        totalUsers: totalUsers || 0, maleCount: maleCount || 0, femaleCount: femaleCount || 0,
        otherCount: otherCount || 0, premiumCount: premiumCount || 0, waitlistCount: waitlistCount || 0,
        ambassadorCount: ambassadorCount || 0,
        activeToday: activeToday || 0, activeWeek: activeWeek || 0,
        likesTotal: likesTotal || 0, matchesTotal: matchesTotal || 0,
        newToday: newToday || 0, newWeek: newWeek || 0,
        premiumSummary: (premiumSummary || []) as PremiumSummaryRow[],
        trialList: (trialList || []) as TrialUserRow[],
        voucherGender: (voucherGenderData as unknown as VoucherGenderStats) || null,
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
                    ? 'Imbalance > 65 % — zvaž aktivaci voucher gender capu v sekci níže.'
                    : 'V pořádku — registrace otevřeny pro všechny.'}
                </div>
              </div>
            </section>

            <hr className="rule mb-16" />

            {/* Voucher gender cap mechanism */}
            <section className="mb-20">
              <p className="eyebrow text-pink-500 mb-4">Voucher gender balance</p>
              <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-2">
                Voucher cap.
              </h2>
              <p className="text-sm text-gray-500 mb-8 max-w-xl leading-relaxed">
                Když dosáhne počet voucher-redempcí jednoho pohlaví limitu, RPC odmítne další redempce
                téhož pohlaví. Defaultně vypnuté — zapni manuálně při imbalance &gt; 65/35.
              </p>
              {stats.voucherGender ? (
                <div className="bg-white rounded-3xl p-8 border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div>
                      <p className="eyebrow text-gray-500 mb-1">Ženy</p>
                      <p className="serif text-3xl text-pink-500 font-medium tabular-nums">
                        {fmt(stats.voucherGender.female_count)}
                        {stats.voucherGender.cap_active && stats.voucherGender.voucher_gender_cap !== null && (
                          <span className="text-base text-gray-400"> / {fmt(stats.voucherGender.voucher_gender_cap)}</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {stats.voucherGender.female_pct !== null ? `${stats.voucherGender.female_pct} %` : '—'}
                        {stats.voucherGender.female_cap_reached && <span className="text-red-500 ml-2">cap vyčerpán</span>}
                      </p>
                    </div>
                    <div>
                      <p className="eyebrow text-gray-500 mb-1">Muži</p>
                      <p className="serif text-3xl text-gray-900 font-medium tabular-nums">
                        {fmt(stats.voucherGender.male_count)}
                        {stats.voucherGender.cap_active && stats.voucherGender.voucher_gender_cap !== null && (
                          <span className="text-base text-gray-400"> / {fmt(stats.voucherGender.voucher_gender_cap)}</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {stats.voucherGender.male_pct !== null ? `${stats.voucherGender.male_pct} %` : '—'}
                        {stats.voucherGender.male_cap_reached && <span className="text-red-500 ml-2">cap vyčerpán</span>}
                      </p>
                    </div>
                    <div>
                      <p className="eyebrow text-gray-500 mb-1">Total</p>
                      <p className="serif text-3xl text-gray-900 font-medium tabular-nums">
                        {fmt(stats.voucherGender.total_redempce)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">redempcí celkem</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="text-sm">
                      <p className="text-gray-900 font-medium">
                        Cap: {stats.voucherGender.cap_active ? `Aktivní (1 000 per gender)` : 'Vypnutý'}
                      </p>
                      <p className="text-gray-500 mt-1 leading-relaxed">
                        {(() => {
                          const f = stats.voucherGender.female_pct
                          if (stats.voucherGender.total_redempce < 100) return 'Méně než 100 redempcí — počkej na statisticky validní data.'
                          if (f === null) return ''
                          if (f >= 35) return 'Ratio je zdravé, cap nepotřeba.'
                          if (f >= 25) return 'Warning: ženy 25–35 %, zvaž aktivaci capu nebo přidej ženský marketing.'
                          return 'Doporučujeme aktivovat cap — ženy < 25 %.'
                        })()}
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        const isActive = stats.voucherGender?.cap_active
                        const newCap = isActive ? null : 1000
                        const confirm = isActive
                          ? window.confirm('Vypnout gender cap? Všichni budou moci redeemovat voucher.')
                          : window.confirm('Aktivovat gender cap (1 000 voucherů per gender)?')
                        if (!confirm) return
                        const { error } = await supabase.rpc('admin_set_voucher_gender_cap', { p_cap: newCap })
                        if (error) { alert('Chyba: ' + error.message); return }
                        await loadStats()
                      }}
                      className={`px-6 py-3 rounded-full text-sm font-medium transition ${
                        stats.voucherGender.cap_active
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                    >
                      {stats.voucherGender.cap_active ? 'Vypnout cap' : 'Aktivovat cap 1 000/1 000'}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">Načítám voucher gender stats...</p>
              )}
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

            <hr className="rule mb-16" />

            {/* ── Předplatné — founding, trial, paid breakdown ── */}
            <section className="mb-20">
              <p className="eyebrow text-pink-500 mb-4">Předplatné</p>
              <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-10">
                Kdo platí, kdo zkouší, komu končí trial.
              </h2>

              {stats.premiumSummary.length === 0 ? (
                <p className="text-gray-400 text-sm">Zatím žádné premium aktivity.</p>
              ) : (
                <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden mb-8">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
                        <th className="px-6 py-4 font-medium">Zdroj</th>
                        <th className="px-6 py-4 font-medium tabular-nums text-right">Celkem</th>
                        <th className="px-6 py-4 font-medium tabular-nums text-right">Aktivní</th>
                        <th className="px-6 py-4 font-medium tabular-nums text-right">Vyprší ≤ 3 dny</th>
                        <th className="px-6 py-4 font-medium tabular-nums text-right">Expirované</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {stats.premiumSummary.map(row => (
                        <tr key={row.premium_source}>
                          <td className="px-6 py-4">
                            <span className="font-medium text-gray-900">
                              {row.premium_source === 'founding' ? 'Founding (3 měs)' :
                               row.premium_source === 'trial' ? 'Trial (7 dní)' :
                               row.premium_source === 'paid' ? 'Placené' : row.premium_source}
                            </span>
                          </td>
                          <td className="px-6 py-4 tabular-nums text-right text-gray-700">{fmt(row.users)}</td>
                          <td className="px-6 py-4 tabular-nums text-right text-emerald-700 font-medium">{fmt(row.active)}</td>
                          <td className="px-6 py-4 tabular-nums text-right text-amber-700">{fmt(row.expiring_soon)}</td>
                          <td className="px-6 py-4 tabular-nums text-right text-gray-400">{fmt(row.expired)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {stats.trialList.length > 0 && (
                <>
                  <p className="eyebrow text-gray-500 mb-3">Aktivní trialy — řazeno podle nejbližšího vypršení</p>
                  <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
                          <th className="px-6 py-4 font-medium">Uživatel</th>
                          <th className="px-6 py-4 font-medium">E-mail</th>
                          <th className="px-6 py-4 font-medium text-right">Vyprší</th>
                          <th className="px-6 py-4 font-medium text-right">Za</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {stats.trialList.map(u => {
                          const expiresAt = new Date(u.premium_until)
                          const ms = expiresAt.getTime() - Date.now()
                          const days = Math.floor(ms / (1000 * 60 * 60 * 24))
                          const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                          const urgent = days <= 1
                          return (
                            <tr key={u.id}>
                              <td className="px-6 py-4 text-gray-900">{u.name || '—'}</td>
                              <td className="px-6 py-4 text-gray-500 text-xs">{u.email || '—'}</td>
                              <td className="px-6 py-4 text-right text-gray-500 text-xs tabular-nums">
                                {expiresAt.toLocaleString('cs-CZ', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </td>
                              <td className={`px-6 py-4 text-right tabular-nums font-medium ${urgent ? 'text-amber-700' : 'text-gray-700'}`}>
                                {ms < 0 ? 'expired' : days > 0 ? `${days} d ${hours} h` : `${hours} h`}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </section>

            <hr className="rule mb-16" />

            <section>
              <p className="eyebrow text-pink-500 mb-4">Rychlé akce</p>
              <div className="flex flex-wrap gap-3">
                <a href="https://supabase.com/dashboard/project/xdotpadgbchhecwitbpe/sql/new" target="_blank" rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-white border border-gray-300 hover:border-gray-900 text-sm text-gray-700 hover:text-gray-900 transition">
                  Supabase SQL Editor
                </a>
                <a href="https://supabase.com/dashboard/project/xdotpadgbchhecwitbpe/editor" target="_blank" rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-white border border-gray-300 hover:border-gray-900 text-sm text-gray-700 hover:text-gray-900 transition">
                  Supabase Table Editor
                </a>
                <Link href="/waitlist" className="px-5 py-2.5 rounded-full bg-white border border-gray-300 hover:border-gray-900 text-sm text-gray-700 hover:text-gray-900 transition">Waitlist</Link>
                <Link href="/ambasadorky" className="px-5 py-2.5 rounded-full bg-white border border-gray-300 hover:border-gray-900 text-sm text-gray-700 hover:text-gray-900 transition">Ambasadorky</Link>
                <Link href="/admin/messages" className="px-5 py-2.5 rounded-full bg-white border border-pink-300 hover:border-pink-500 text-sm text-pink-700 hover:text-pink-900 transition inline-flex items-center gap-2">
                  Zprávy z formuláře
                  {newMessagesCount > 0 && <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-pink-500 text-white text-xs tabular-nums">{newMessagesCount}</span>}
                </Link>
                <Link href="/admin/gdpr-requests" className="px-5 py-2.5 rounded-full bg-white border border-pink-300 hover:border-pink-500 text-sm text-pink-700 hover:text-pink-900 transition">GDPR žádosti</Link>
                <Link href="/discover" className="px-5 py-2.5 rounded-full bg-white border border-gray-300 hover:border-gray-900 text-sm text-gray-700 hover:text-gray-900 transition">Discover</Link>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  )
}
