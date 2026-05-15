'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, type Profile, type Compatibility, getZodiac } from '@/lib/supabase'
import { CompatBadges, ScoreRing } from '@/components/CompatBadges'

// Pastelové gradienty jako avatar fallback (bez fotky)
const AVATAR_GRADIENTS = [
  'from-pink-300 to-rose-400',
  'from-purple-300 to-pink-400',
  'from-blue-300 to-cyan-400',
  'from-emerald-300 to-teal-400',
  'from-orange-300 to-amber-400',
  'from-violet-300 to-purple-400',
]

function ProfileAvatar({ profile }: { profile: Profile }) {
  const photo = profile.photos?.[0]
  if (photo) {
    return <img src={photo} alt={profile.name} className="w-full h-full object-cover" />
  }
  const idx = profile.name.charCodeAt(0) % AVATAR_GRADIENTS.length
  return (
    <div className={`w-full h-full bg-gradient-to-br ${AVATAR_GRADIENTS[idx]} flex items-center justify-center`}>
      <span className="text-white text-7xl font-bold opacity-80">
        {profile.name.charAt(0).toUpperCase()}
      </span>
    </div>
  )
}

type MinScore = 0 | 25 | 50 | 75
const FILTER_OPTIONS: { label: string; value: MinScore }[] = [
  { label: 'Vše', value: 0 },
  { label: '25%+', value: 25 },
  { label: '50%+', value: 50 },
  { label: '75%+', value: 75 },
]

function BottomNav({ active }: { active: string }) {
  const items = [
    { key: 'discover', href: '/discover', label: 'DISCOVER', icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    )},
    { key: 'matches', href: '/matches', label: 'SHODY', icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    )},
    { key: 'liked', href: '/matches', label: 'LÍBÍM SE', icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
      </svg>
    )},
    { key: 'chat', href: '/matches', label: 'CHAT', icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    )},
    { key: 'profile', href: '/matches', label: 'JÁ', icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    )},
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-2">
        {items.map(item => (
          <Link
            key={item.key}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${
              active === item.key ? 'text-pink-500' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {item.icon}
            <span className="text-[9px] font-bold tracking-wide">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default function DiscoverPage() {
  const router = useRouter()
  const [user, setUser] = useState<Profile | null>(null)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [compats, setCompats] = useState<Record<string, Compatibility>>({})
  const [idx, setIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  const [action, setAction] = useState<'like' | 'pass' | null>(null)
  const [minScore, setMinScore] = useState<MinScore>(0)
  const [showInfo, setShowInfo] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('cosmatch_user')
    if (!stored) { router.push('/login'); return }
    const u = JSON.parse(stored) as Profile
    setUser(u)
    loadProfiles(u)
  }, [router])

  const loadProfiles = async (u: Profile) => {
    setLoading(true)
    const { data: liked } = await supabase
      .from('likes').select('to_user').eq('from_user', u.id)
    const excludeIds = [u.id, ...(liked?.map(l => l.to_user) ?? [])]

    const { data: profs } = await supabase
      .from('profiles')
      .select('*')
      .eq('active', true)
      .not('id', 'in', `(${excludeIds.join(',')})`)
      .limit(50)

    if (!profs || profs.length === 0) { setLoading(false); return }

    const bdays = profs.map(p => p.birthday)
    const { data: compatData } = await supabase
      .from('compatibility')
      .select('*')
      .eq('date_a', u.birthday)
      .in('date_b', bdays)

    const compatMap: Record<string, Compatibility> = {}
    compatData?.forEach(c => { compatMap[c.date_b] = c })

    const sorted = [...profs].sort((a, b) => {
      const ca = compatMap[a.birthday], cb = compatMap[b.birthday]
      if (ca?.is_mutual && !cb?.is_mutual) return -1
      if (!ca?.is_mutual && cb?.is_mutual) return 1
      return (cb?.score ?? 0) - (ca?.score ?? 0)
    })

    setProfiles(sorted)
    setCompats(compatMap)
    setLoading(false)
  }

  const handleAction = useCallback(async (liked: boolean) => {
    if (!user || idx >= profiles.length) return
    const target = profiles[idx]
    setAction(liked ? 'like' : 'pass')
    setShowInfo(false)
    setTimeout(() => setAction(null), 500)

    await supabase.from('likes').upsert({
      from_user: user.id, to_user: target.id, liked
    })

    if (liked) {
      const { data: theyLikedMe } = await supabase
        .from('likes').select('id')
        .eq('from_user', target.id).eq('to_user', user.id).eq('liked', true)
        .single()
      if (theyLikedMe) {
        await supabase.from('matches').upsert({
          user_a: user.id < target.id ? user.id : target.id,
          user_b: user.id < target.id ? target.id : user.id,
        })
      }
    }

    setIdx(i => i + 1)
  }, [user, idx, profiles])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (showInfo) return
      if (e.key === 'ArrowRight' || e.key === 'l') handleAction(true)
      if (e.key === 'ArrowLeft' || e.key === 'd') handleAction(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleAction, showInfo])

  const filteredProfiles = profiles.filter(p => {
    const c = compats[p.birthday]
    return (c?.score ?? 0) >= minScore
  })

  const currentProfile = filteredProfiles[idx] ?? null
  const compat = currentProfile ? compats[currentProfile.birthday] : null

  if (loading) return (
    <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-3 animate-spin">✦</div>
        <p className="text-gray-400 text-sm font-medium">Načítám profily...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAF6F0] pb-20">
      {/* Horní navigace */}
      <nav className="flex items-center justify-between px-5 py-4 max-w-lg mx-auto">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="text-pink-500 text-xl font-bold">✦</span>
          <span className="font-bold text-gray-900 text-lg tracking-tight">Cosmatch</span>
        </Link>
        <div className="flex items-center gap-2">
          {/* Filtr kompatibility */}
          <div className="flex gap-1">
            {FILTER_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => { setMinScore(opt.value); setIdx(0) }}
                className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-all ${
                  minScore === opt.value
                    ? 'bg-pink-500 text-white shadow-sm'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-pink-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {/* Avatar / odhlášení */}
          <button
            onClick={() => { localStorage.removeItem('cosmatch_user'); router.push('/') }}
            className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center ml-1"
            title="Odhlásit"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-pink-500" fill="currentColor">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </button>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4">
        {!currentProfile ? (
          <div className="card p-12 text-center mt-4">
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Momentálně nic dalšího</h3>
            <p className="text-gray-400 text-sm mb-6">
              {minScore > 0 ? 'Zkus snížit filtr kompatibility' : 'Vrať se brzy pro nové profily!'}
            </p>
            {minScore > 0 && (
              <button onClick={() => { setMinScore(0); setIdx(0) }} className="btn-secondary mb-3 w-full">
                Zobrazit všechny
              </button>
            )}
            <Link href="/matches" className="btn-primary inline-block w-full text-center">
              💫 Zobrazit shody
            </Link>
          </div>
        ) : (
          <>
            {/* Počítadlo */}
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs text-gray-400 font-semibold tracking-wide">
                {idx + 1} / {filteredProfiles.length} PROFILŮ
                {user?.premium && <span className="ml-2 text-amber-500">👑 PREMIUM</span>}
              </span>
              <span className="text-xs text-gray-300">← / → klávesy</span>
            </div>

            {/* Profilová karta */}
            <div
              className={`rounded-3xl overflow-hidden shadow-lg transition-all duration-300 ${
                action === 'like' ? 'scale-95 opacity-60 rotate-2' :
                action === 'pass' ? 'scale-95 opacity-60 -rotate-2' : ''
              }`}
              style={{ border: '2.5px solid #E91E8C' }}
            >
              {/* Fotka */}
              <div className="relative" style={{ height: '400px' }}>
                <ProfileAvatar profile={currentProfile} />

                {/* Skóre — pravý horní roh */}
                {compat && (
                  <div className="absolute top-3 right-3">
                    <ScoreRing score={compat.score} />
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

                {/* Jméno + věk + lokalita */}
                <div className="absolute bottom-3 left-4 right-4">
                  <h2 className="text-white font-bold text-2xl uppercase tracking-wide">
                    {currentProfile.name.split(' ')[0]}
                    {currentProfile.birth_year ? `, ${new Date().getFullYear() - currentProfile.birth_year}` : ''}
                  </h2>
                  {(currentProfile.city || currentProfile.country) && (
                    <p className="text-white/80 text-sm mt-0.5">
                      📍 {[currentProfile.city, currentProfile.country].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  {/* Záliby tagy přes fotku */}
                  {currentProfile.hobbies?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {currentProfile.hobbies.slice(0, 4).map(h => (
                        <span key={h} className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full border border-white/30">
                          {h}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Spodní sekce — povolání · znamení · vzdělání */}
              <div className="bg-white px-4 py-3">
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                  {currentProfile.occupation && <span>💼 {currentProfile.occupation}</span>}
                  <span className="text-gray-600">{getZodiac(currentProfile.birthday)}</span>
                  {currentProfile.education && <span>🎓 {currentProfile.education}</span>}
                </div>
                {compat && (
                  <div className="mt-2">
                    <CompatBadges compat={compat} lang="cs" />
                  </div>
                )}
              </div>

              {/* Info panel */}
              {showInfo && (
                <div className="bg-gray-50 border-t border-gray-100 px-4 py-4 space-y-4">
                  {currentProfile.bio && (
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Intro</p>
                      <p className="text-gray-700 text-sm leading-relaxed">{currentProfile.bio}</p>
                    </div>
                  )}
                  {currentProfile.philosophy && (
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Životní filozofie</p>
                      <p className="text-gray-700 text-sm leading-relaxed">{currentProfile.philosophy}</p>
                    </div>
                  )}
                  {currentProfile.hobbies?.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Záliby</p>
                      <div className="flex flex-wrap gap-1.5">
                        {currentProfile.hobbies.map(h => (
                          <span key={h} className="tag">{h}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Akční tlačítka */}
            <div className="flex items-center justify-center gap-5 mt-5">
              {/* Pass */}
              <button
                onClick={() => handleAction(false)}
                className="w-16 h-16 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
              >
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>

              {/* Info toggle */}
              <button
                onClick={() => setShowInfo(s => !s)}
                className={`w-12 h-12 rounded-full shadow-sm border flex items-center justify-center hover:scale-110 active:scale-95 transition-all ${
                  showInfo
                    ? 'bg-pink-500 border-pink-400 text-white'
                    : 'bg-white border-gray-200 text-gray-400'
                }`}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              </button>

              {/* Like — plné srdce, brand pink */}
              <button
                onClick={() => handleAction(true)}
                className="w-16 h-16 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"
                style={{ backgroundColor: '#E91E8C' }}
              >
                <svg viewBox="0 0 24 24" className="w-8 h-8" fill="white">
                  <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
                </svg>
              </button>
            </div>

            {compat?.is_mutual && (
              <p className="text-center text-pink-500 text-xs font-semibold mt-3 animate-pulse">
                ✨ Oboustranná shoda!
              </p>
            )}
          </>
        )}
      </div>

      <BottomNav active="discover" />
    </div>
  )
}
