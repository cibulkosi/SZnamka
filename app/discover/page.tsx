'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, type Profile, type Compatibility, getZodiac } from '@/lib/supabase'
import { CompatBadges, ScoreRing } from '@/components/CompatBadges'
import { ProfileQuestion, PROFILE_QUESTIONS, type Question } from '@/components/ProfileQuestion'
import { computeCompatibility, profileCompleteness, isOutsideDistanceLimit } from '@/lib/compat'

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
 return <img src={photo} alt={profile.name} className="w-full h-full object-cover" /> }
 const idx = profile.name.charCodeAt(0) % AVATAR_GRADIENTS.length
 return (
 <div className={`w-full h-full bg-gradient-to-br ${AVATAR_GRADIENTS[idx]} flex items-center justify-center`}> <span className="text-white text-8xl font-bold opacity-70"> {profile.name.charAt(0).toUpperCase()}
 </span> </div> )
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
 <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"> <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/> </svg> )},
 { key: 'matches', href: '/matches', label: 'SHODY', icon: (
 <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"> <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/> <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/> </svg> )},
 { key: 'liked', href: '/matches', label: 'LÍBÍM SE', icon: (
 <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"> <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/> </svg> )},
 { key: 'chat', href: '/matches', label: 'CHAT', icon: (
 <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"> <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/> </svg> )},
 { key: 'profile', href: '/profile', label: 'JÁ', icon: (
 <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"> <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/> </svg> )},
 ]

 return (
 <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50"> <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-2"> {items.map(item => (
 <Link
 key={item.key}
 href={item.href}
 className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${
 active === item.key ? 'text-pink-500' : 'text-gray-400 hover:text-gray-600'
 }`}
 > {item.icon}
 <span className="text-[9px] font-bold tracking-wide">{item.label}</span> </Link> ))}
 </div> </nav> )
}

// Které otázky ještě nebyly zodpovězeny pro daného uživatele
function getUnansweredQuestions(user: Profile): Question[] {
 return PROFILE_QUESTIONS.filter(q => {
 const val = user[q.id as keyof Profile]
 return val === undefined || val === null || val === ''
 })
}

// Hinge-style profil (scrollovatelný) 
function HingeProfile({
 profile,
 compat,
 compatLabel,
 enhancedScore,
 onPass,
 onLike,
 actionState,
}: {
 profile: Profile
 compat: Compatibility | null
 compatLabel: string
 enhancedScore: number
 onPass: () => void
 onLike: () => void
 actionState: 'like' | 'pass' | null
}) {
 const scrollRef = useRef<HTMLDivElement>(null)

 // Při změně profilu scrolluj zpět nahoru
 useEffect(() => {
 scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' })
 }, [profile.id])

 const age = profile.birth_year ? new Date().getFullYear() - profile.birth_year : null

 return (
 <div className="relative h-full flex flex-col"> {/* Scrollovatelný obsah profilu */}
 <div
 ref={scrollRef}
 className="flex-1 overflow-y-auto"
 style={{ paddingBottom: '100px' }} // prostor pro fixní akční lištu
 > {/* Hero fotka — zabírá většinu viewportu */}
 <div
 className={`relative w-full transition-all duration-300 ${
 actionState === 'like' ? 'opacity-70 scale-[0.98]' :
 actionState === 'pass' ? 'opacity-50 scale-[0.98]' : ''
 }`}
 style={{ height: '72vh' }}
 > <ProfileAvatar profile={profile} /> {/* Skóre kompatibility — vpravo nahoře */}
 <div className="absolute top-4 right-4 z-10"> <ScoreRing score={enhancedScore} /> </div> {/* Gradient overlay spodek */}
 <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" /> {/* Jméno, věk, lokalita — přes fotku dole */}
 <div className="absolute bottom-5 left-5 right-5"> <h2 className="text-white font-bold text-3xl tracking-tight"> {profile.name.split(' ')[0]}
 {age && <span className="font-light">, {age}</span>}
 </h2> {(profile.city || profile.country) && (
 <p className="text-white/75 text-sm mt-1 flex items-center gap-1"> <span></span> {[profile.city, profile.country].filter(Boolean).join(' · ')}
 </p> )}
 {/* Záliby tagy přes fotku */}
 {profile.hobbies?.length > 0 && (
 <div className="flex flex-wrap gap-1.5 mt-2.5"> {profile.hobbies.slice(0, 4).map(h => (
 <span
 key={h}
 className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full border border-white/30"
 > {h}
 </span> ))}
 </div> )}
 </div> </div> {/* Obsah profilu pod fotkou */}
 <div className="bg-white"> {/* Kompatibilita — hned pod fotkou */}
 {compat && (
 <div className="px-5 pt-4 pb-3 border-b border-gray-100"> <CompatBadges compat={compat} lang="cs" /> {compat.is_mutual && (
 <p className="text-pink-500 text-xs font-semibold mt-2 flex items-center gap-1"> <span></span> Oboustranná numerologická shoda
 </p> )}
 </div> )}

 {/* Základní info: povolání / znamení / vzdělání */}
 <div className="px-5 py-4 border-b border-gray-100"> <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-gray-500"> {profile.occupation && (
 <span className="flex items-center gap-1.5"> <span></span> {profile.occupation}
 </span> )}
 <span className="flex items-center gap-1.5"> {getZodiac(profile.birthday)}
 </span> {profile.education && (
 <span className="flex items-center gap-1.5"> <span></span> {profile.education}
 </span> )}
 </div> </div> {/* Bio */}
 {profile.bio && (
 <div className="px-5 py-4 border-b border-gray-100"> <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Intro</p> <p className="text-gray-700 text-sm leading-relaxed">{profile.bio}</p> </div> )}

 {/* Životní filozofie */}
 {profile.philosophy && (
 <div className="px-5 py-4 border-b border-gray-100"> <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Životní filozofie</p> <p className="text-gray-700 text-sm leading-relaxed italic">&ldquo;{profile.philosophy}&rdquo;</p> </div> )}

 {/* Všechny záliby */}
 {profile.hobbies?.length > 0 && (
 <div className="px-5 py-4 border-b border-gray-100"> <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Záliby</p> <div className="flex flex-wrap gap-2"> {profile.hobbies.map(h => (
 <span key={h} className="tag">{h}</span> ))}
 </div> </div> )}

 {/* Lifestyle štítky */}
 <div className="px-5 py-4 border-b border-gray-100"> <div className="flex flex-wrap gap-2"> {profile.relationship_type === 'serious' && (
 <span className="text-xs text-pink-500 bg-pink-50 border border-pink-100 px-3 py-1 rounded-full font-medium"> Vážný vztah
 </span> )}
 {profile.relationship_type === 'friendship' && (
 <span className="text-xs text-green-600 bg-green-50 border border-green-100 px-3 py-1 rounded-full font-medium"> Přátelství
 </span> )}
 {profile.relationship_type === 'casual' && (
 <span className="text-xs text-orange-500 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full font-medium"> Nezávazně
 </span> )}
 {profile.smoking === 'never' && (
 <span className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full"> Nekouří
 </span> )}
 {profile.alcohol === 'never' && (
 <span className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full"> Nepije
 </span> )}
 {profile.diet === 'vegan' && (
 <span className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full"> Vegan
 </span> )}
 {profile.diet === 'vegetarian' && (
 <span className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full"> Vegetarián
 </span> )}
 {profile.family_plans === 'want_kids' && (
 <span className="text-xs text-blue-500 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full"> Chce děti
 </span> )}
 {profile.family_plans === 'no_kids' && (
 <span className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full"> Nechce děti
 </span> )}
 </div> </div> {/* Personologický panel — vždy dole */}
 <div className="px-5 py-5"> <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-3xl p-5"> <p className="text-xs font-bold text-purple-400 uppercase tracking-wide mb-2"> Personologická shoda</p>
 {compat ? (
 <div className="space-y-2">
 {compatLabel === 'absolute_resonance' && (
 <div>
 <p className="text-purple-700 text-sm font-bold">Absolutní rezonance</p>
 <p className="text-purple-400 text-xs mt-0.5">Oboustranná vazba — oba vnímáte toto spojení jako výjimečné.</p>
 </div>
 )}
 {compatLabel === 'magnetic_tension' && (
 <div>
 <p className="text-amber-700 text-sm font-bold flex items-center gap-1.5">
 <svg viewBox="0 0 24 24" className="w-4 h-4 fill-amber-500 flex-shrink-0"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
 Magnetická tenze
 </p>
 <p className="text-amber-600 text-xs mt-0.5">Silný vzájemný tah, ale různé perspektivy. Jeden fascinován, druhý testován — intenzivní dynamika.</p>
 </div>
 )}
 {compatLabel === 'karmic_challenge' && (
 <div>
 <p className="text-orange-700 text-sm font-bold flex items-center gap-1.5">
 <svg viewBox="0 0 24 24" className="w-4 h-4 fill-orange-500 flex-shrink-0"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
 Karmická zkouška
 </p>
 <p className="text-orange-600 text-xs mt-0.5">Oba se budete vzájemně zkoušet. Bouřlivé, ale transformační.</p>
 </div>
 )}
 {compatLabel === 'soul_mates' && (
 <div>
 <p className="text-purple-700 text-sm font-semibold">Spřízněné duše</p>
 <p className="text-purple-400 text-xs mt-0.5">Hluboké vzájemné porozumění přesahující slova.</p>
 </div>
 )}
 {compatLabel === 'fatal_attraction' && (
 <div>
 <p className="text-rose-700 text-sm font-semibold">Osudová přitažlivost</p>
 <p className="text-rose-400 text-xs mt-0.5">Nevyhnutelné osudové setkání s extrémní přitažlivostí.</p>
 </div>
 )}
 {compatLabel === 'love_friendship' && (
 <div>
 <p className="text-pink-700 text-sm font-semibold">Láska & přátelství</p>
 <p className="text-pink-400 text-xs mt-0.5">Harmonické spojení s přirozenou náklonností.</p>
 </div>
 )}
 {compatLabel === 'beneficial' && (
 <div>
 <p className="text-emerald-700 text-sm font-semibold">Prospěšný vztah</p>
 <p className="text-emerald-500 text-xs mt-0.5">Vzájemně se posilujete a obohacujete.</p>
 </div>
 )}
 {compatLabel === 'challenging' && (
 <div>
 <p className="text-yellow-700 text-sm font-semibold flex items-center gap-1.5">
 <svg viewBox="0 0 24 24" className="w-4 h-4 fill-yellow-500 flex-shrink-0"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
 Výzva a růst
 </p>
 <p className="text-yellow-600 text-xs mt-0.5">Jiskřivá dynamika — vzájemná výzva, která přináší růst.</p>
 </div>
 )}
 {compatLabel === 'neutral' && (
 <p className="text-purple-400 text-xs">Neutrální kombinace dat.</p>
 )}
 </div>
 ) : (
 <p className="text-purple-500 text-sm">Personologická data pro toto datum nejsou k dispozici.</p>
 )}
 </div> </div> {/* Hint pro scrollování */}
 <p className="text-center text-gray-300 text-xs pb-4"> ↑ Scrolluj nahoru zpět na fotku
 </p> </div> </div> {/* Fixní akční lišta — X vlevo, vpravo */}
 <div
 className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-8 py-3 z-20"
 style={{
 background: 'linear-gradient(to top, rgba(250,246,240,1) 60%, rgba(250,246,240,0))',
 paddingBottom: '16px',
 }}
 > {/* Pass — X vlevo */}
 <button
 onClick={onPass}
 className={`w-16 h-16 rounded-full bg-white shadow-lg border-2 border-gray-200 flex items-center justify-center transition-all active:scale-90 ${
 actionState === 'pass' ? 'scale-90 bg-gray-100' : 'hover:border-gray-400'
 }`}
 > <svg viewBox="0 0 24 24" className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"> <line x1="18" y1="6" x2="6" y2="18"/> <line x1="6" y1="6" x2="18" y2="18"/> </svg> </button> {/* Počítadlo profilů — uprostřed */}
 <span className="text-xs text-gray-400 font-semibold tracking-wide select-none"> — SCROLL PRO VÍCE —
 </span> {/* Like — vpravo */}
 <button
 onClick={onLike}
 className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90 ${
 actionState === 'like' ? 'scale-90 brightness-90' : 'hover:brightness-110'
 }`}
 style={{ backgroundColor: '#E91E8C' }}
 > <svg viewBox="0 0 24 24" className="w-8 h-8" fill="white"> <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/> </svg> </button> </div> </div> )
}

// Hlavní stránka 
export default function DiscoverPage() {
 const router = useRouter()
 const [user, setUser] = useState<Profile | null>(null)
 const [profiles, setProfiles] = useState<Profile[]>([])
 const [compats, setCompats] = useState<Record<string, Compatibility>>({})
 const [reverseCompats, setReverseCompats] = useState<Record<string, Compatibility>>({})
 const [idx, setIdx] = useState(0)
 const [loading, setLoading] = useState(true)
 const [action, setAction] = useState<'like' | 'pass' | null>(null)
 const [minScore, setMinScore] = useState<MinScore>(0)

 // Progressive profiling
 const [swipesSinceQuestion, setSwipesSinceQuestion] = useState(0)
 const [showQuestion, setShowQuestion] = useState(false)
 const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
 const [answeredQuestionIds, setAnsweredQuestionIds] = useState<Set<string>>(new Set())

 // Denní limit swipů (5 free / neomezeně premium)
 const DAILY_FREE_LIMIT = 5
 const [dailySwipes, setDailySwipes] = useState(0)
 const [swipeLimitReached, setSwipeLimitReached] = useState(false)

 // Vypočítaná skóre (kombinace book + profil)
 const [enhancedScores, setEnhancedScores] = useState<Record<string, number>>({})

 // Magic moment — numerologický text po prvních 3 swipech
 const [showMagic, setShowMagic] = useState(false)
 const [magicText, setMagicText] = useState('')
 const [magicViews, setMagicViews] = useState(0)

 useEffect(() => {
 const stored = localStorage.getItem('cosmatch_user')
 if (!stored) { router.push('/login'); return }
 const u = JSON.parse(stored) as Profile
 setUser(u)

 // Načti denní počet swipů z localStorage
 const today = new Date().toISOString().slice(0, 10)
 const swipeData = localStorage.getItem('cosmatch_daily_swipes')
 if (swipeData) {
 const { date, count } = JSON.parse(swipeData)
 if (date === today) {
 setDailySwipes(count)
 if (!u.premium && count >= DAILY_FREE_LIMIT) setSwipeLimitReached(true)
 } else {
 localStorage.setItem('cosmatch_daily_swipes', JSON.stringify({ date: today, count: 0 }))
 }
 } else {
 localStorage.setItem('cosmatch_daily_swipes', JSON.stringify({ date: today, count: 0 }))
 }

 // Předvyplň zodpovězené otázky
 const answered = new Set(
 PROFILE_QUESTIONS.filter(q => {
 const val = u[q.id as keyof Profile]
 return val !== undefined && val !== null && val !== ''
 }).map(q => q.id)
 )
 setAnsweredQuestionIds(answered)

 // Načti magic moment numerologický text (jednou za registraci)
 const magicSeen = localStorage.getItem('cosmatch_magic_seen')
 if (!magicSeen) {
 const bday = (JSON.parse(stored) as Profile).birthday
 supabase.from('personology').select('opening').eq('date_key', bday).single()
 .then(({ data }) => {
 if (data?.opening) setMagicText(data.opening)
 })
 }

 loadProfiles(u)
 // Aktualizuj last_seen — ukazuje, že uživatel je aktivní
 supabase.from('profiles').update({ last_seen: new Date().toISOString() }).eq('id', u.id).then(() => {})
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

 // Fetch REVERSE compat — co vidí protistrana o uživateli
 const { data: reverseData } = await supabase
 .from('compatibility')
 .select('*')
 .in('date_a', bdays)
 .eq('date_b', u.birthday)
 const reverseMap: Record<string, Compatibility> = {}
 reverseData?.forEach(c => { reverseMap[c.date_a] = c })

 // Vrstva 2 – Hard KO: vylouč profily mimo limit vzdálenosti uživatele
 const maxDistKm = (u as Profile & { max_distance?: number }).max_distance ?? 100
 const profsInRange = profs.filter(p => !isOutsideDistanceLimit(u, p, maxDistKm))

 // Vypočítej enhanced scores — s Tension Score (vážený průměr obou perspektiv)
 const scores: Record<string, number> = {}
 profsInRange.forEach(p => {
 const fwd = compatMap[p.birthday]?.score ?? null    // co vidí user o profilu
 const rev = reverseMap[p.birthday]?.score ?? null   // co vidí profil o userovi
 // Tension Score: 65 % perspektiva uživatele + 35 % perspektiva protistrany
 const bookScore = fwd !== null
 ? (rev !== null ? fwd * 0.65 + rev * 0.35 : fwd)
 : (rev !== null ? rev * 0.5 : null)
 scores[p.id] = computeCompatibility(u, p, bookScore)
 })

 // Vrstva 4b – ELO boost: profily s vyšším elo_score dostanou mírnou prioritu
 const sorted = [...profsInRange].sort((a, b) => {
 const scoreDiff = (scores[b.id] ?? 0) - (scores[a.id] ?? 0)
 if (Math.abs(scoreDiff) > 3) return scoreDiff
 // Tie-break: preferuj vyšší ELO (atraktivnější profily pro nové uživatele)
 return ((b.elo_score ?? 1400) - (a.elo_score ?? 1400)) * 0.1
 })

 setProfiles(sorted)
 setCompats(compatMap)
 setReverseCompats(reverseMap)
 setEnhancedScores(scores)
 setLoading(false)
 }

 // Přepočítej enhanced scores při aktualizaci uživatele
 const recalculateScores = useCallback((updatedUser: Profile) => {
 const newScores: Record<string, number> = {}
 profiles.forEach(p => {
 const bookScore = compats[p.birthday]?.score ?? null
 newScores[p.id] = computeCompatibility(updatedUser, p, bookScore)
 })
 setEnhancedScores(newScores)

 // Re-sort profiles
 const sorted = [...profiles].sort((a, b) => (newScores[b.id] ?? 0) - (newScores[a.id] ?? 0))
 setProfiles(sorted)
 setIdx(0)
 }, [profiles, compats])

 const filteredProfiles = profiles.filter(p => {
 return (enhancedScores[p.id] ?? 0) >= minScore
 })

 const handleAction = useCallback(async (liked: boolean) => {
 if (!user || idx >= filteredProfiles.length) return

 // Denní limit — free uživatelé max 5 swipů/den
 if (!user.premium && dailySwipes >= DAILY_FREE_LIMIT) {
 setSwipeLimitReached(true)
 return
 }

 const target = filteredProfiles[idx]
 setAction(liked ? 'like' : 'pass')
 setTimeout(() => {
 setAction(null)
 setIdx(i => i + 1)
 }, 300)

 // Zvyšuj denní počítadlo
 const newCount = dailySwipes + 1
 setDailySwipes(newCount)
 const today = new Date().toISOString().slice(0, 10)
 localStorage.setItem('cosmatch_daily_swipes', JSON.stringify({ date: today, count: newCount }))
 if (!user.premium && newCount >= DAILY_FREE_LIMIT) setSwipeLimitReached(true)

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

 // Magic moment — po 3. swipu, jednou za život
 const newMagicViews = magicViews + 1
 setMagicViews(newMagicViews)
 if (newMagicViews === 3 && magicText && !localStorage.getItem('cosmatch_magic_seen')) {
 setShowMagic(true)
 return
 }

 const newSwipeCount = swipesSinceQuestion + 1

 // Zobraz otázku každých 5 swipů
 if (newSwipeCount >= 5) {
 const unanswered = getUnansweredQuestions(user).filter(q => !answeredQuestionIds.has(q.id))
 if (unanswered.length > 0) {
 setCurrentQuestion(unanswered[0])
 setShowQuestion(true)
 setSwipesSinceQuestion(0)
 return
 }
 }
 setSwipesSinceQuestion(newSwipeCount)
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [user, idx, swipesSinceQuestion, answeredQuestionIds, dailySwipes, filteredProfiles, magicViews, magicText])

 const handleQuestionAnswer = useCallback((updatedUser: Profile) => {
 setUser(updatedUser)
 setShowQuestion(false)
 setCurrentQuestion(null)
 const newAnswered = new Set(Array.from(answeredQuestionIds).concat(currentQuestion?.id ?? ''))
 setAnsweredQuestionIds(newAnswered)
 recalculateScores(updatedUser)
 }, [answeredQuestionIds, currentQuestion, recalculateScores])

 const handleQuestionSkip = useCallback(() => {
 setShowQuestion(false)
 setCurrentQuestion(null)
 }, [])

 // Klávesové zkratky
 useEffect(() => {
 const handleKey = (e: KeyboardEvent) => {
 if (showQuestion) return
 if (e.key === 'ArrowRight' || e.key === 'l') handleAction(true)
 if (e.key === 'ArrowLeft' || e.key === 'd') handleAction(false)
 }
 window.addEventListener('keydown', handleKey)
 return () => window.removeEventListener('keydown', handleKey)
 }, [handleAction, showQuestion])

 const currentProfile = filteredProfiles[idx] ?? null
 const compat = currentProfile ? compats[currentProfile.birthday] : null
 const reverseCompat = currentProfile ? reverseCompats[currentProfile.birthday] : null
 const enhancedScore = currentProfile ? (enhancedScores[currentProfile.id] ?? compat?.score ?? 0) : 0

 // Asymmetry label logic
 type CompatLabelType = 'mutual' | 'magnetic_tension' | 'karmic_challenge' | 'absolute_resonance' | 'soul_mates' | 'fatal_attraction' | 'love_friendship' | 'beneficial' | 'challenging' | 'neutral'
 function getCompatLabel(fwd: typeof compat, rev: typeof compat): CompatLabelType {
 if (!fwd) return 'neutral'
 const fwdTop = fwd.soul_mates || fwd.fatal_attraction
 const fwdMid = fwd.love_friendship || fwd.beneficial
 const fwdLow = fwd.challenging
 const revTop = rev && (rev.soul_mates || rev.fatal_attraction)
 const revLow = rev && rev.challenging
 // Absolutní rezonance — oboustranná shoda obou top kategorií
 if (fwd.is_mutual && !fwdLow) return 'absolute_resonance'
 // Magnetická tenze — jeden vidí top, druhý vidí výzvu
 if ((fwdTop && revLow) || (fwdLow && revTop)) return 'magnetic_tension'
 // Karmická zkouška — oba vidí výzvu
 if (fwdLow && rev?.challenging) return 'karmic_challenge'
 // Standardní jednostranné kategorie
 if (fwd.soul_mates) return 'soul_mates'
 if (fwd.fatal_attraction) return 'fatal_attraction'
 if (fwd.love_friendship) return 'love_friendship'
 if (fwd.beneficial) return 'beneficial'
 if (fwd.challenging) return 'challenging'
 if (fwdMid) return 'love_friendship'
 return 'neutral'
 }
 const compatLabel = getCompatLabel(compat, reverseCompat)
 const completeness = user ? profileCompleteness(user) : 0

 if (loading) return (
 <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center"> <div className="text-center"> <div className="text-4xl mb-3 animate-spin"></div> <p className="text-gray-400 text-sm font-medium">Načítám profily...</p> </div> </div> )

 return (
 // Celá stránka — pevná výška viewportu, overflow skrytý (scroll je uvnitř HingeProfile)
 <div className="bg-[#FAF6F0]" style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}> {/* Magic Moment Modal */}
 {showMagic && magicText && (
 <div className="fixed inset-0 z-50 flex items-center justify-center px-5 bg-black/60 backdrop-blur-sm"> <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"> <div className="text-5xl mb-4"></div> <h2 className="text-xl font-bold text-gray-900 mb-2"> {user?.name}, vesmír tě zná.
 </h2> <p className="text-gray-600 text-sm leading-relaxed mb-6 whitespace-pre-wrap"> {magicText}
 </p> <button
 className="btn-primary w-full"
 onClick={() => {
 setShowMagic(false)
 localStorage.setItem('cosmatch_magic_seen', '1')
 }}
 > Pokračovat v hledání
 </button> </div> </div> )}

 {/* Horní navigace */}
 <nav className="flex-shrink-0 flex items-center justify-between px-5 py-3 max-w-lg mx-auto w-full bg-[#FAF6F0] z-30"> <Link href="/" className="flex items-center gap-1.5"> <span className="text-pink-500 text-xl font-bold">✦</span> <span className="font-bold text-gray-900 text-lg tracking-tight">Cosmatch</span> </Link> <div className="flex items-center gap-2"> {/* Filtr kompatibility */}
 <div className="flex gap-1"> {FILTER_OPTIONS.map(opt => (
 <button
 key={opt.value}
 onClick={() => { setMinScore(opt.value); setIdx(0) }}
 className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-all ${
 minScore === opt.value
 ? 'bg-pink-500 text-white shadow-sm'
 : 'bg-white text-gray-500 border border-gray-200 hover:border-pink-300'
 }`}
 > {opt.label}
 </button> ))}
 </div> {/* Avatar / odhlášení */}
 <button
 onClick={() => { localStorage.removeItem('cosmatch_user'); router.push('/') }}
 className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center ml-1"
 title="Odhlásit"
 > <svg viewBox="0 0 24 24" className="w-5 h-5 text-pink-500" fill="currentColor"> <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/> </svg> </button> </div> </nav> {/* Denní swipe limit lišta */}
 {!user?.premium && (
 <div className="flex-shrink-0 px-5 pb-2 max-w-lg mx-auto w-full"> <div className="flex items-center justify-between px-1 mb-1"> <span className="text-xs text-gray-400 font-medium">Dnešní swipy</span> <span className="text-xs font-bold text-gray-500"> {Math.min(dailySwipes, DAILY_FREE_LIMIT)} / {DAILY_FREE_LIMIT}
 {user?.premium && <span className="ml-2 text-amber-500"> PREMIUM</span>}
 </span> </div> <div className="h-1 bg-gray-100 rounded-full overflow-hidden"> <div
 className="h-full rounded-full transition-all duration-300"
 style={{
 width: `${Math.min((dailySwipes / DAILY_FREE_LIMIT) * 100, 100)}%`,
 background: dailySwipes >= DAILY_FREE_LIMIT ? '#ef4444' : '#ec4899'
 }}
 /> </div> </div> )}

 {/* Completeness banner */}
 {completeness < 50 && !showQuestion && (
 <div className="flex-shrink-0 mx-5 mb-2 max-w-lg w-full self-center bg-pink-50 border border-pink-100 rounded-2xl px-4 py-2.5 flex items-center gap-3"> <div className="flex-1"> <p className="text-xs font-semibold text-pink-700">Tvůj profil je {completeness} % vyplněn</p> <p className="text-xs text-pink-400">Odpovídej na otázky pro přesnější skóre</p> </div> <div className="w-9 h-9 rounded-full border-2 border-pink-200 flex items-center justify-center"> <span className="text-xs font-bold text-pink-500">{completeness}%</span> </div> </div> )}

 {/* Hlavní obsah */}
 <div className="flex-1 overflow-hidden max-w-lg mx-auto w-full relative" style={{ marginBottom: '56px' }}> {/* Limit dosažen */}
 {swipeLimitReached && !user?.premium ? (
 <div className="h-full flex items-center justify-center px-5"> <div className="card p-8 text-center w-full"> <div className="text-4xl mb-3">⏳</div> <h3 className="text-lg font-bold text-gray-900 mb-2">Na dnešek máš hotovo</h3> <p className="text-gray-400 text-sm mb-1"> Dnešních {DAILY_FREE_LIMIT} swipů zdarma jsou pryč.
 </p> <p className="text-gray-400 text-sm mb-6"> Vrať se zítra — nebo si odemkni neomezené swipy.
 </p> <Link href="/premium" className="btn-primary w-full text-center inline-block mb-3"> Cosmatch+ — neomezené swipy
 </Link> <p className="text-xs text-gray-300">299 Kč/měs · Zrušení kdykoliv</p> </div> </div> /* Progressivní otázka */
 ) : showQuestion && currentQuestion ? (
 <div className="h-full flex items-center justify-center px-5 overflow-y-auto"> <div className="w-full"> <ProfileQuestion
 question={currentQuestion}
 user={user!}
 onAnswer={handleQuestionAnswer}
 onSkip={handleQuestionSkip}
 questionNumber={answeredQuestionIds.size}
 totalQuestions={PROFILE_QUESTIONS.length}
 /> </div> </div> /* Žádný profil k zobrazení */
 ) : !currentProfile ? (
 <div className="h-full flex items-center justify-center px-5"> <div className="card p-12 text-center w-full"> <div className="text-5xl mb-4"></div> <h3 className="text-xl font-bold text-gray-900 mb-2">Momentálně nic dalšího</h3> <p className="text-gray-400 text-sm mb-6"> {minScore > 0 ? 'Zkus snížit filtr kompatibility' : 'Vrať se brzy pro nové profily!'}
 </p> {minScore > 0 && (
 <button onClick={() => { setMinScore(0); setIdx(0) }} className="btn-secondary mb-3 w-full"> Zobrazit všechny
 </button> )}
 <Link href="/matches" className="btn-primary inline-block w-full text-center"> Zobrazit shody
 </Link> </div> </div> /* Hinge-style profil */
 ) : (
 <HingeProfile
 profile={currentProfile}
 compat={compat}
 compatLabel={compatLabel}
 enhancedScore={enhancedScore}
 onPass={() => handleAction(false)}
 onLike={() => handleAction(true)}
 actionState={action}
 /> )}
 </div> {/* Bottom nav */}
 <BottomNav active="discover" /> </div> )
}
