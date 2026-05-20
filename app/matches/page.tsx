
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, loadCurrentProfile, type Profile, type Compatibility } from '@/lib/supabase'
import { TrialBanner } from '@/components/PremiumGate'

type Tab = 'mutual' | 'liked' | 'matches'

function Avatar({ name }: { name: string }) {
  const init = name.charAt(0).toUpperCase()
  const idx = name.charCodeAt(0) % 6
  const bgs = ['bg-pink-100','bg-purple-100','bg-emerald-100','bg-amber-100','bg-blue-100','bg-rose-100']
  return (
    <div className={`w-14 h-14 rounded-full ${bgs[idx]} flex items-center justify-center serif text-2xl text-gray-900 font-medium shrink-0`}>
      {init}
    </div>
  )
}

function BottomNav({ active }: { active: string }) {
  const items = [
    { key: 'discover', href: '/discover', label: 'DISCOVER' },
    { key: 'matches', href: '/matches', label: 'SHODY' },
    { key: 'premium', href: '/premium', label: 'PREMIUM' },
    { key: 'profile', href: '/profile', label: 'PROFIL' },
  ]
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-30">
      <div className="flex max-w-lg mx-auto">
        {items.map(item => (
          <Link key={item.key} href={item.href}
            className={`flex-1 py-4 text-center text-[10px] tracking-[0.15em] uppercase font-medium transition-colors ${
              active === item.key ? 'text-pink-500' : 'text-gray-400 hover:text-gray-600'
            }`}>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default function MatchesPage() {
  const router = useRouter()
  const [user, setUser] = useState<Profile | null>(null)
  const [tab, setTab] = useState<Tab>('matches')
  const [matches, setMatches] = useState<Profile[]>([])
  const [likedMe, setLikedMe] = useState<Profile[]>([])
  const [mutualCompat, setMutualCompat] = useState<Profile[]>([])
  const [compats, setCompats] = useState<Record<string, Compatibility>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const r = await loadCurrentProfile()
      if (r.kind === 'no-session') { router.push('/login'); return }
      if (r.kind === 'no-profile') { router.push('/register'); return }
      const u = r.profile
      setUser(u)
      loadAll(u)
    })()
  }, [router])

  const loadAll = async (u: Profile) => {
    setLoading(true)

    const { data: matchData } = await supabase.from('matches').select('*')
      .or(`user_a.eq.${u.id},user_b.eq.${u.id}`)
    const matchPartnerIds = matchData?.map(m => m.user_a === u.id ? m.user_b : m.user_a) ?? []

    const { data: likesMe } = await supabase.from('likes').select('from_user')
      .eq('to_user', u.id).eq('liked', true)
    const likedMeIds = likesMe?.map(l => l.from_user) ?? []

    const { data: cosmicCompat } = await supabase.from('compatibility')
      .select('date_b, is_mutual, score')
      .eq('date_a', u.birthday).eq('is_mutual', true)
      .order('score', { ascending: false }).limit(100)
    const cosmicBdays = cosmicCompat?.map(c => c.date_b) ?? []

    const allIds = [...new Set([...matchPartnerIds, ...likedMeIds])]
    let allProfiles: Profile[] = []
    if (allIds.length > 0) {
      const { data } = await supabase.from('profiles').select('*').in('id', allIds)
      allProfiles = data ?? []
    }

    let cosmicProfiles: Profile[] = []
    if (cosmicBdays.length > 0) {
      const { data } = await supabase.from('profiles').select('*')
        .in('birthday', cosmicBdays).neq('id', u.id).limit(50)
      cosmicProfiles = data ?? []
    }

    const allBdays = [...new Set([...allProfiles.map(p => p.birthday), ...cosmicProfiles.map(p => p.birthday)])]
    let cm: Record<string, Compatibility> = {}
    if (allBdays.length > 0) {
      const { data: compatData } = await supabase.from('compatibility').select('*')
        .eq('date_a', u.birthday).in('date_b', allBdays)
      compatData?.forEach(c => { cm[c.date_b] = c })
      setCompats(cm)
    }

    setMatches(allProfiles.filter(p => matchPartnerIds.includes(p.id)))
    setLikedMe(allProfiles.filter(p => likedMeIds.includes(p.id) && !matchPartnerIds.includes(p.id)))
    setMutualCompat(cosmicProfiles.sort((a, b) => {
      const ca = cm[a.birthday], cb = cm[b.birthday]
      return (cb?.score ?? 0) - (ca?.score ?? 0)
    }))
    setLoading(false)
  }

  const tabs: {key: Tab, label: string, count: number}[] = [
    { key: 'matches', label: 'Shody', count: matches.length },
    { key: 'mutual', label: 'Kosmické', count: mutualCompat.length },
    { key: 'liked', label: 'Líbím se', count: likedMe.length },
  ]
  const displayList = tab === 'matches' ? matches : tab === 'mutual' ? mutualCompat : likedMe

  if (loading) return (
    <main className="min-h-screen bg-[#FAF6F0] flex items-center justify-center">
      <p className="text-gray-400 text-sm">Načítám…</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#FAF6F0] pb-24">
      <div className="max-w-xl mx-auto px-6 pt-6">
        <Link href="/discover" className="text-sm text-gray-500 hover:text-gray-900 transition">← Discover</Link>
      </div>

      <div className="max-w-xl mx-auto px-6 pt-12">
        <TrialBanner profile={user} />

        <header className="mb-12">
          <p className="eyebrow text-pink-500 mb-6">Tvoje shody</p>
          <h1 className="serif-display text-5xl text-gray-900 font-medium leading-[1.05] tracking-tight">
            Kdo na tebe<br/><em className="italic text-pink-500">čeká</em>.
          </h1>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 mb-10 border-b border-gray-200">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`pb-3 pt-1 px-1 text-sm font-medium transition-all border-b-2 -mb-px ${
                tab === t.key
                  ? 'text-gray-900 border-gray-900'
                  : 'text-gray-400 border-transparent hover:text-gray-700'
              }`}>
              {t.label}
              {t.count > 0 && (
                <span className={`ml-2 inline-flex items-center justify-center text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                  tab === t.key ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'
                }`}>{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {tab === 'mutual' && (
          <div className="bg-white border border-gray-100 rounded-3xl p-6 mb-6">
            <p className="eyebrow text-pink-500 mb-2">Kosmické shody</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Tito uživatelé mají s tebou oboustrannou kompatibilitu podle data narození —
              podle data narození. Líbí se ti? Najdi je v Discover.
            </p>
          </div>
        )}

        {displayList.length === 0 ? (
          <div className="py-24 text-center">
            <p className="serif text-2xl text-gray-700 italic mb-3">
              {tab === 'matches' ? 'Zatím žádné shody.'
                : tab === 'mutual' ? 'Žádné kosmické shody.'
                : 'Nikdo tě ještě nelajknul.'}
            </p>
            <p className="text-gray-500 text-[1.0625rem] leading-relaxed mb-8 max-w-sm mx-auto">
              {tab === 'matches' ? 'Pokračuj v objevování — každý den dostáváš nové profily.'
                : tab === 'mutual' ? 'Ještě nikdo s tvou oboustrannou kompatibilitou není registrovaný.'
                : 'Trpělivost — Cosmatch se právě rozjíždí.'}
            </p>
            <Link href="/discover" className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-full text-base font-medium hover:bg-gray-800 transition">
              Otevřít Discover
            </Link>
          </div>
        ) : (
          <div className="space-y-3 relative">
            {/* Premium gate pro 'Líbím se' tab — free user vidí blur + count + CTA */}
            {tab === 'liked' && !user?.premium && displayList.length > 0 && (
              <div className="absolute inset-0 z-10 flex items-center justify-center pt-20 pointer-events-none">
                <div className="bg-white border border-pink-200 rounded-3xl p-8 max-w-sm text-center shadow-xl pointer-events-auto">
                  <p className="eyebrow text-pink-500 mb-3">Cosmatch+</p>
                  <h3 className="serif text-2xl text-gray-900 font-medium mb-3">
                    {displayList.length} {displayList.length === 1 ? 'člověk' : displayList.length < 5 ? 'lidé' : 'lidí'} tě lajkne.
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    V Cosmatch+ uvidíš, kdo přesně to je — a můžeš mu/jí napsat jako první.
                  </p>
                  <Link href="/premium" className="inline-flex items-center justify-center bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition">
                    Odemknout v Cosmatch+
                  </Link>
                </div>
              </div>
            )}
            <div className={tab === 'liked' && !user?.premium ? 'blur-md select-none pointer-events-none' : ''}>
              {displayList.map(p => {
              const c = compats[p.birthday]
              const age = p.birth_year ? new Date().getFullYear() - p.birth_year : null
              return (
                <Link key={p.id} href={`/discover`}
                  className="block bg-white border border-gray-100 hover:border-gray-300 rounded-3xl p-5 transition-all mb-3">
                  <div className="flex items-center gap-4">
                    <Avatar name={p.name} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="serif text-xl text-gray-900 font-medium leading-none">{p.name}</span>
                        {p.verified && (
                          <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full">
                            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                            Ověřeno
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {age && <>{age} let</>}
                        {age && p.city && <span className="text-gray-300 mx-1.5">·</span>}
                        {p.city && p.city}
                      </p>
                    </div>
                    {c && (
                      <div className="text-right flex-shrink-0">
                        <p className="serif-display text-2xl text-pink-500 font-medium tabular-nums leading-none">{c.score}</p>
                        <p className="text-[10px] text-gray-400 tracking-wider uppercase mt-1">skóre</p>
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
            </div>
          </div>
        )}
      </div>

      <BottomNav active="matches" />
    </main>
  )
}
