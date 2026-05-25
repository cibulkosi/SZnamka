'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, loadCurrentProfile, type Profile, type Compatibility, getZodiac } from '@/lib/supabase'
import { TrialBanner } from '@/components/PremiumGate'

type Tab = 'mutual' | 'liked' | 'matches'

// ─── Category styling (same as HingeProfileV2 + DemoProfileDetail) ───
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Spřízněné duše': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  'Láska a přátelství': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Magnetická tenze': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  'Prospěšný vztah': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Náročný vztah': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  'Neutrální': { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
}
function getCategoryLabel(c: Compatibility | null | undefined): string {
  if (!c) return 'Neutrální'
  if (c.soul_mates) return 'Spřízněné duše'
  if (c.love_friendship) return 'Láska a přátelství'
  if (c.fatal_attraction) return 'Magnetická tenze'
  if (c.beneficial) return 'Prospěšný vztah'
  if (c.challenging) return 'Náročný vztah'
  return 'Neutrální'
}

const AVATAR_GRADIENTS = [
  'from-pink-200 to-rose-300', 'from-purple-200 to-pink-300',
  'from-blue-200 to-cyan-300', 'from-emerald-200 to-teal-300',
  'from-orange-200 to-amber-300', 'from-violet-200 to-purple-300',
]
function PhotoFallback({ name }: { name: string }) {
  const idx = name.charCodeAt(0) % AVATAR_GRADIENTS.length
  return (
    <div className={`w-full h-full bg-gradient-to-br ${AVATAR_GRADIENTS[idx]} flex items-center justify-center`}>
      <span className="text-white text-7xl font-bold serif opacity-80">{name.charAt(0).toUpperCase()}</span>
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
  const [matchMeta, setMatchMeta] = useState<Record<string, { matchId: string; metAt: string | null }>>({})
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
    const { data: matchData } = await supabase.from('matches').select('id, user_a, user_b')
      .or(`user_a.eq.${u.id},user_b.eq.${u.id}`)
    const matchPartnerIds = matchData?.map(m => m.user_a === u.id ? m.user_b : m.user_a) ?? []

    const matchMetaMap: Record<string, { matchId: string; metAt: string | null }> = {}
    if (matchData && matchData.length > 0) {
      const orderedPairs = matchData.map(m => {
        const [a, b] = m.user_a < m.user_b ? [m.user_a, m.user_b] : [m.user_b, m.user_a]
        return { a, b, matchId: m.id, partner: m.user_a === u.id ? m.user_b : m.user_a }
      })
      const { data: eventsData } = await supabase.from('match_events')
        .select('user_a_id, user_b_id, met_irl_at')
        .or(`user_a_id.eq.${u.id},user_b_id.eq.${u.id}`)
      const eventsMap: Record<string, string | null> = {}
      eventsData?.forEach(e => { eventsMap[`${e.user_a_id}|${e.user_b_id}`] = e.met_irl_at })
      orderedPairs.forEach(p => { matchMetaMap[p.partner] = { matchId: p.matchId, metAt: eventsMap[`${p.a}|${p.b}`] ?? null } })
    }
    setMatchMeta(matchMetaMap)

    const { data: likesMe } = await supabase.from('likes').select('from_user').eq('to_user', u.id).eq('liked', true)
    const likedMeIds = likesMe?.map(l => l.from_user) ?? []

    const { data: cosmicCompat } = await supabase.from('compatibility')
      .select('date_b, is_mutual, score').eq('date_a', u.birthday).eq('is_mutual', true)
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
      const { data } = await supabase.from('profiles').select('*').in('birthday', cosmicBdays).neq('id', u.id).limit(50)
      cosmicProfiles = data ?? []
    }
    const allBdays = [...new Set([...allProfiles.map(p => p.birthday), ...cosmicProfiles.map(p => p.birthday)])]
    let cm: Record<string, Compatibility> = {}
    if (allBdays.length > 0) {
      const { data: compatData } = await supabase.from('compatibility').select('*').eq('date_a', u.birthday).in('date_b', allBdays)
      compatData?.forEach(c => { cm[c.date_b] = c })
      setCompats(cm)
    }
    setMatches(allProfiles.filter(p => matchPartnerIds.includes(p.id)))
    setLikedMe(allProfiles.filter(p => likedMeIds.includes(p.id) && !matchPartnerIds.includes(p.id)))
    setMutualCompat(cosmicProfiles.sort((a, b) => (cm[b.birthday]?.score ?? 0) - (cm[a.birthday]?.score ?? 0)))
    setLoading(false)
  }

  const tabs: {key: Tab, label: string, count: number}[] = [
    { key: 'matches', label: 'Shody', count: matches.length },
    { key: 'mutual', label: 'Kosmické', count: mutualCompat.length },
    { key: 'liked', label: 'Líbím se', count: likedMe.length },
  ]
  const displayList = tab === 'matches' ? matches : tab === 'mutual' ? mutualCompat : likedMe

  const handleMetIrl = async (matchId: string, partnerId: string) => {
    setMatchMeta(prev => ({ ...prev, [partnerId]: { matchId, metAt: new Date().toISOString() } }))
    try {
      const { data, error } = await supabase.rpc('record_irl_meeting', { p_match_id: matchId })
      if (error || !data?.ok) {
        setMatchMeta(prev => ({ ...prev, [partnerId]: { matchId, metAt: null } }))
        console.warn('record_irl_meeting failed:', error || data)
      }
    } catch (e) {
      setMatchMeta(prev => ({ ...prev, [partnerId]: { matchId, metAt: null } }))
    }
  }

  if (loading) return (
    <main className="min-h-screen bg-[#F0EBE3] flex items-center justify-center">
      <p className="text-gray-400 text-sm">Načítám…</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#F0EBE3] pb-24">
      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link href="/discover" className="text-sm text-gray-500 hover:text-gray-900 transition">← Discover</Link>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-12">
        <TrialBanner profile={user} />

        <header className="mb-12">
          <p className="eyebrow text-pink-500 mb-6">Tvoje shody</p>
          <h1 className="serif-display text-5xl text-gray-900 font-medium leading-[1.05] tracking-tight">
            Kdo na Tebe<br/><em className="italic text-pink-500">čeká</em>.
          </h1>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 mb-10 border-b border-gray-200">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`pb-3 pt-1 px-1 text-sm font-medium transition-all border-b-2 -mb-px ${
                tab === t.key ? 'text-gray-900 border-gray-900' : 'text-gray-400 border-transparent hover:text-gray-700'
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
          <div className="bg-white border border-gray-100 rounded-3xl p-6 mb-6 shadow-sm">
            <p className="eyebrow text-pink-500 mb-2">Kosmické shody</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Tito uživatelé mají s Tebou oboustrannou kompatibilitu podle data narození. Najdi je v Discover a začni konverzaci.
            </p>
          </div>
        )}

        {displayList.length === 0 ? (
          <div className="py-24 text-center">
            <p className="serif text-2xl text-gray-700 italic mb-3">
              {tab === 'matches' ? 'Zatím žádné shody.'
                : tab === 'mutual' ? 'Žádné kosmické shody.'
                : 'Nikdo Tě ještě nelajknul.'}
            </p>
            <p className="text-gray-500 text-[1.0625rem] leading-relaxed mb-8 max-w-sm mx-auto">
              {tab === 'matches' ? 'Pokračuj v objevování — každý den dostáváš nové profily.'
                : tab === 'mutual' ? 'Ještě nikdo s Tvou oboustrannou kompatibilitou není registrovaný.'
                : 'Trpělivost — Cosmatch se právě rozjíždí.'}
            </p>
            <Link href="/discover" className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-full text-base font-medium hover:bg-gray-800 transition">
              Otevřít Discover
            </Link>
          </div>
        ) : (
          <div className="relative">
            {/* Premium gate pro 'Líbím se' tab */}
            {tab === 'liked' && !user?.premium && displayList.length > 0 && (
              <div className="absolute inset-0 z-10 flex items-center justify-center pt-20 pointer-events-none">
                <div className="bg-white border border-pink-200 rounded-3xl p-8 max-w-sm text-center shadow-xl pointer-events-auto">
                  <p className="eyebrow text-pink-500 mb-3">Cosmatch+</p>
                  <h3 className="serif text-2xl text-gray-900 font-medium mb-3">
                    {displayList.length} {displayList.length === 1 ? 'člověk' : displayList.length < 5 ? 'lidé' : 'lidí'} Tě lajkne.
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

            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-5 ${tab === 'liked' && !user?.premium ? 'blur-md select-none pointer-events-none' : ''}`}>
              {displayList.map((p, idx) => {
                const c = compats[p.birthday]
                const age = p.birth_year ? new Date().getFullYear() - p.birth_year : null
                const zodiac = getZodiac(p.birthday)
                const matchCategory = getCategoryLabel(c)
                const cat = CATEGORY_COLORS[matchCategory]
                const heroPhoto = p.photos?.[0]
                const indexNum = String(idx + 1).padStart(2, '0')

                return (
                  <Link key={p.id} href="/discover"
                    className="group block bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all">
                    {/* Hero photo */}
                    <div className="relative bg-gray-100" style={{ aspectRatio: '4/5' }}>
                      {heroPhoto ? (
                        <img src={heroPhoto} alt={p.name} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
                      ) : (
                        <PhotoFallback name={p.name} />
                      )}
                      {p.verified && (
                        <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-xs text-emerald-700 bg-white/95 px-2 py-1 rounded-full font-medium shadow-sm">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                          Ověřeno
                        </span>
                      )}
                      <div className="absolute top-3 left-3 bg-white/95 px-2 py-1 rounded-full shadow-sm">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                          {tab === 'matches' ? `Shoda ${indexNum}` : tab === 'mutual' ? `Kosmická ${indexNum}` : `Lajk ${indexNum}`}
                        </p>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-5">
                      <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                        <h2 className="serif text-xl text-gray-900 font-medium">{p.name}{age && <span className="font-light text-gray-400">, {age}</span>}</h2>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">
                        {[p.city, zodiac, p.occupation].filter(Boolean).join(' · ')}
                      </p>

                      {p.bio && <p className="text-sm text-gray-700 leading-relaxed mb-4 line-clamp-2">{p.bio}</p>}

                      {/* Score + category */}
                      {c && (
                        <div className={`-mx-1 px-4 py-3 rounded-2xl ${cat.bg} ${cat.border} border flex items-center justify-between`}>
                          <div>
                            <p className={`text-[10px] uppercase tracking-wider ${cat.text} font-medium`}>Kompatibilita</p>
                            <p className={`text-sm ${cat.text} font-medium`}>{matchCategory}</p>
                          </div>
                          <div className="text-right">
                            <p className="serif-display text-2xl text-gray-900 font-medium tabular-nums leading-none">{c.score}</p>
                            <p className="text-[10px] text-gray-500">% shody</p>
                          </div>
                        </div>
                      )}

                      {/* Učící smyčka — jen v matches tab */}
                      {tab === 'matches' && matchMeta[p.id] && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          {matchMeta[p.id].metAt ? (
                            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
                              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                              Setkali jste se naživo
                            </p>
                          ) : (
                            <button type="button"
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMetIrl(matchMeta[p.id].matchId, p.id) }}
                              className="text-xs text-gray-500 hover:text-gray-900 font-medium underline underline-offset-4 transition">
                              Už jsme se viděli naživo
                            </button>
                          )}
                        </div>
                      )}

                      <p className="text-xs text-pink-600 mt-4 font-medium">Otevřít profil →</p>
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
