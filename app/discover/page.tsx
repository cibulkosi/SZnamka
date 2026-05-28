'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, loadCurrentProfile, type Profile, type Compatibility, getZodiac } from '@/lib/supabase'
import { TrialBanner } from '@/components/PremiumGate'
import { CompatBadges, ScoreRing } from '@/components/CompatBadges'
import { ProfileQuestion, PROFILE_QUESTIONS, type Question } from '@/components/ProfileQuestion'
import { ARCHETYPES, lifePathNumber } from '@/lib/archetypes'
import { computeCompatibility, profileCompleteness, isOutsideDistanceLimit, isOutsidePhysicalPrefs, isChildrenIncompatible, isSmokingIncompatible, isAlcoholIncompatible, isMarijuanaIncompatible, tierFallbackBoost, crawfordBidirectional } from '@/lib/compat'
import HingeProfileV2 from '@/components/HingeProfileV2'
import { haptic } from '@/lib/haptic'
import { matchConfetti } from '@/lib/animations'
import { vocative } from '@/lib/czech'
import { DiscoverSkeleton } from '@/components/Skeletons'
import { maybePromptPushPermission } from '@/lib/pushNotifications'

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


// Které otázky ještě nebyly zodpovězeny pro daného uživatele
function getUnansweredQuestions(user: Profile): Question[] {
 return PROFILE_QUESTIONS.filter(q => {
 const val = user[q.id as keyof Profile]
 return val === undefined || val === null || val === ''
 })
}

// Hinge-style profil (scrollovatelný) 

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

 useEffect(() => { (async () => {
 const r = await loadCurrentProfile()
 if (r.kind === 'no-session') { router.push('/login'); return }
 if (r.kind === 'no-profile') { router.push('/register'); return }
 const u = r.profile
 setUser(u)

 // Načti denní počet swipů ze serveru (RPC) — autoritativní, ne localStorage
 try {
 const { data: rpcData } = await supabase.rpc('my_daily_swipes_remaining')
 if (rpcData && typeof rpcData === 'object') {
 if (rpcData.unlimited === true) {
 setDailySwipes(0)
 setSwipeLimitReached(false)
 } else if (typeof rpcData.used === 'number') {
 setDailySwipes(rpcData.used)
 setSwipeLimitReached(Boolean(rpcData.limit_reached))
 }
 }
 } catch (e) {
 console.warn('daily swipes RPC failed:', e)
 // Failsafe: bez serverové info nechej dailySwipes=0, ale server-side RLS chytí abusery
 }
 // Cleanup staré localStorage data — server je teď truthový zdroj
 try { localStorage.removeItem('cosmatch_daily_swipes') } catch {}

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
 const bday = u.birthday
 supabase.from('personology').select('opening,opening_cs').eq('date_key', bday).single()
 .then(({ data }) => {
 if (data?.opening_cs) setMagicText(data.opening_cs); else if (data?.opening) setMagicText(data.opening)
 })
 }

 loadProfiles(u)
 // Aktualizuj last_seen — ukazuje, že uživatel je aktivní
 supabase.from('profiles').update({ last_seen: new Date().toISOString() }).eq('id', u.id).then(() => {})
 })() }, [router])

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
 const profsInRange = profs.filter(p => {
        if (isOutsideDistanceLimit(u, p, maxDistKm)) return false
        if (isOutsidePhysicalPrefs(u, p)) return false
        if (isChildrenIncompatible(u, p)) return false
        if (isSmokingIncompatible(u, p)) return false
        if (isAlcoholIncompatible(u, p)) return false
        if (isMarijuanaIncompatible(u, p)) return false

        // Premium filtry: aktivní jen pro Cosmatch+ uživatele
        if (u.premium) {
          const fwd = compatMap[p.birthday]
          if ((u as Profile & { filter_soul_mates_only?: boolean }).filter_soul_mates_only) {
            if (!fwd?.soul_mates) return false
          }
          if ((u as Profile & { filter_mutual_only?: boolean }).filter_mutual_only) {
            if (!fwd?.is_mutual) return false
          }
        }
        return true
      })

 // Vypočítej enhanced scores — s Tension Score (vážený průměr obou perspektiv)
 const scores: Record<string, number> = {}
 profsInRange.forEach(p => {
 // Crawford & Sullivan bidirectional lookup (atomic Layer I)
 const fwdRow = compatMap[p.birthday] ?? null
 const revRow = reverseMap[p.birthday] ?? null
 let bookScore: number | null = null
 if (fwdRow || revRow) {
   const cwf = crawfordBidirectional(fwdRow, revRow)
   bookScore = cwf.score
 } else if (u.birthday && p.birthday) {
   const myLP = lifePathNumber(`${u.birth_year}-${u.birthday}`)
   const otherLP = lifePathNumber(`${p.birth_year}-${p.birthday}`)
   const fwdFall = tierFallbackBoost(myLP, otherLP, ARCHETYPES)
   const revFall = tierFallbackBoost(otherLP, myLP, ARCHETYPES)
   if (fwdFall !== null && revFall !== null) bookScore = (fwdFall + revFall) / 2
   else if (fwdFall !== null) bookScore = fwdFall
   else if (revFall !== null) bookScore = revFall
 }
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
 // Filter scoring by min_compatibility (user-set threshold, default 0)
 const minComp = (u as typeof u & { min_compatibility?: number }).min_compatibility ?? 0
 if (minComp > 0) {
   const filtered: Record<string, number> = {}
   Object.entries(scores).forEach(([id, score]) => {
     if (score >= minComp) filtered[id] = score
   })
   setEnhancedScores(filtered)
 } else {
   setEnhancedScores(scores)
 }
 setLoading(false)
 }

 // Přepočítej enhanced scores při aktualizaci uživatele
 const recalculateScores = useCallback((updatedUser: Profile) => {
 const newScores: Record<string, number> = {}
 profiles.forEach(p => {
 const fwdRow2 = compats[p.birthday] ?? null
 const revRow2 = reverseCompats[p.birthday] ?? null
 const bookScore2 = (fwdRow2 || revRow2) ? crawfordBidirectional(fwdRow2, revRow2).score : null
 newScores[p.id] = computeCompatibility(updatedUser, p, bookScore2)
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
 haptic.error()
 setSwipeLimitReached(true)
 return
 }

 // Haptic feedback při lajku/passu
 if (liked) haptic.medium()
 else haptic.light()

 const target = filteredProfiles[idx]
 setAction(liked ? 'like' : 'pass')
 setTimeout(() => {
 setAction(null)
 setIdx(i => i + 1)
 }, 300)

 // Optimistic increment local counter (jen UX hint)
 const newCount = dailySwipes + 1
 setDailySwipes(newCount)
 if (!user.premium && newCount >= DAILY_FREE_LIMIT) setSwipeLimitReached(true)

 // INSERT do likes — server-side RLS check daily_swipe_limit_ok
 const { error: insertError } = await supabase.from('likes').upsert({
 from_user: user.id, to_user: target.id, liked
 })
 if (insertError) {
 // Pravděpodobně překročen denní limit (RLS policy violation)
 // Postgres error code 42501 = insufficient_privilege; PostgREST: PGRST116
 const isLimitError = insertError.code === '42501' || insertError.code === 'PGRST116'
   || /policy|row-level security|daily_swipe_limit_ok/i.test(insertError.message || '')
 if (isLimitError && !user.premium) {
 setSwipeLimitReached(true)
 // Re-sync ze serveru — pokud user už limit překročil, ukáže pravdivý count
 try {
 const { data: rpcData } = await supabase.rpc('my_daily_swipes_remaining')
 if (rpcData && typeof rpcData.used === 'number') setDailySwipes(rpcData.used)
 } catch {}
 return
 }
 console.error('like upsert failed:', insertError)
 return
 }

 if (liked) {
 const { data: theyLikedMe } = await supabase
 .from('likes').select('id')
 .eq('from_user', target.id).eq('to_user', user.id).eq('liked', true)
 .single()
 if (theyLikedMe) {
 // Vytvoř match — vrať match_id, ať můžeme zapsat snapshot skóre do learning loopu
 const { data: matchRow } = await supabase.from('matches').upsert({
 user_a: user.id < target.id ? user.id : target.id,
 user_b: user.id < target.id ? target.id : user.id,
 }, { onConflict: 'user_a,user_b' })
   .select('id')
   .maybeSingle()

 // Learning loop: ulož match_score snapshot do match_events
 // (trigger v DB už vytvořil match_events řádek s book_score, my doplníme match_score)
 if (matchRow?.id) {
   const matchScore = enhancedScores[target.id]
   if (typeof matchScore === 'number') {
     try {
       await supabase.rpc('update_match_score', {
         p_match_id: matchRow.id,
         p_match_score: Math.round(matchScore),
       })
     } catch (e) {
       // Non-blocking — learning loop selhání nezastaví match flow
       console.warn('update_match_score RPC failed:', e)
     }
   }
 }
 }
 }

 // Magic moment — po 3. swipu, jednou za život
 const newMagicViews = magicViews + 1
 setMagicViews(newMagicViews)
 if (newMagicViews === 3 && magicText && !localStorage.getItem('cosmatch_magic_seen')) {
 matchConfetti(); setShowMagic(true)
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

 if (loading) return <DiscoverSkeleton />

 return (
 // Celá stránka — pevná výška viewportu, overflow skrytý (scroll je uvnitř HingeProfile)
 <div className="bg-[#FAF6F0]" style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}> {/* Magic Moment Modal */}
 {showMagic && magicText && (
 <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/50 backdrop-blur-sm">
   <div className="bg-[#FAF6F0] rounded-3xl p-10 max-w-md w-full shadow-2xl">
     <p className="eyebrow text-pink-500 mb-4">Magický moment</p>
     <h2 className="serif-display text-3xl text-gray-900 font-medium leading-tight tracking-tight mb-6">
       {vocative(user?.name?.split(' ')[0] || '')}, <em className="italic text-pink-500">vesmír Tě zná</em>.
     </h2>
     <p className="text-gray-700 leading-[1.75] text-[1.0625rem] mb-8 whitespace-pre-wrap serif italic">
       „{magicText}“
     </p>
     <button
       className="w-full bg-gray-900 text-white py-5 rounded-full text-base font-medium hover:bg-gray-800 transition"
       onClick={() => {
         setShowMagic(false)
         localStorage.setItem('cosmatch_magic_seen', '1')
       }}
     >Pokračovat v hledání</button>
   </div>
 </div>
 )}

 {/* Horní navigace */}
 <nav className="flex-shrink-0 flex items-center justify-between px-5 py-4 max-w-lg mx-auto w-full bg-[#FAF6F0] z-30">
   <Link href="/" className="serif-display text-xl font-medium text-gray-900 tracking-tight">Cosmatch</Link>
   <div className="flex gap-1.5">
     {FILTER_OPTIONS.map(opt => (
       <button
         key={opt.value}
         onClick={() => { setMinScore(opt.value); setIdx(0) }}
         className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
           minScore === opt.value
             ? 'bg-gray-900 text-white'
             : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
         }`}
       >{opt.label}</button>
     ))}
   </div>
 </nav>
 {/* Trial countdown banner */}
 <div className="flex-shrink-0 px-5 max-w-lg mx-auto w-full"><TrialBanner profile={user} /></div>
 {/* Denní swipe limit lišta */}
 {!user?.premium && (
 <div className="flex-shrink-0 px-5 pb-2 max-w-lg mx-auto w-full"> <div className="flex items-center justify-between px-1 mb-1"> <span className="text-xs text-gray-500 font-medium">Dnešní swipy</span> <span className="text-xs font-bold text-gray-500"> {Math.min(dailySwipes, DAILY_FREE_LIMIT)} / {DAILY_FREE_LIMIT}
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
 </Link> <p className="text-xs text-gray-400">249 Kč/měs · Zrušení kdykoliv</p> </div> </div> /* Progressivní otázka */
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
 <HingeProfileV2
 profile={currentProfile}
 compat={compat}
 enhancedScore={enhancedScore}
 onPass={() => handleAction(false)}
 onLike={() => handleAction(true)}
 actionState={action}
 currentUser={user}
 /> )}
 </div> {/* Bottom nav */}
</div> )
}
