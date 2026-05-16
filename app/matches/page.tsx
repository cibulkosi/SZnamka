'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, type Profile, type Compatibility } from '@/lib/supabase'
import { CompatBadges, ScoreRing } from '@/components/CompatBadges'

const AVATAR_COLORS = [
 'from-purple-500 to-pink-500','from-blue-500 to-cyan-500','from-emerald-500 to-teal-500',
 'from-orange-500 to-red-500','from-violet-500 to-purple-500','from-pink-500 to-rose-500'
]
function Avatar({ name }: { name: string }) {
 const idx = name.charCodeAt(0) % AVATAR_COLORS.length
 return (
 <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${AVATAR_COLORS[idx]} flex items-center justify-center font-bold text-white text-xl shrink-0`}> {name.charAt(0).toUpperCase()}
 </div> )
}

type Tab = 'mutual' | 'liked' | 'matches'

export default function MatchesPage() {
 const router = useRouter()
 const [user, setUser] = useState<Profile | null>(null)
 const [tab, setTab] = useState<Tab>('matches')
 const [matches, setMatches] = useState<Profile[]>([])
 const [likedMe, setLikedMe] = useState<Profile[]>([])
 const [mutualCompat, setMutualCompat] = useState<Profile[]>([])
 const [compats, setCompats] = useState<Record<string, Compatibility>>({})
 const [loading, setLoading] = useState(true)
 const [lang] = useState<'cs'|'en'>('cs')

 useEffect(() => {
 const stored = localStorage.getItem('cosmatch_user')
 if (!stored) { router.push('/login'); return }
 const u = JSON.parse(stored) as Profile
 setUser(u)
 loadAll(u)
 }, [router])

 const loadAll = async (u: Profile) => {
 setLoading(true)

 // 1. Actual app matches (mutual likes)
 const { data: matchData } = await supabase
 .from('matches')
 .select('*')
 .or(`user_a.eq.${u.id},user_b.eq.${u.id}`)

 const matchPartnerIds = matchData?.map(m => m.user_a === u.id ? m.user_b : m.user_a) ?? []

 // 2. People who liked me
 const { data: likesMe } = await supabase
 .from('likes')
 .select('from_user')
 .eq('to_user', u.id)
 .eq('liked', true)

 const likedMeIds = likesMe?.map(l => l.from_user) ?? []

 // 3. Cosmic mutual matches (compatibility-based, regardless of swipes)
 const { data: cosmicCompat } = await supabase
 .from('compatibility')
 .select('date_b, is_mutual, score')
 .eq('date_a', u.birthday)
 .eq('is_mutual', true)
 .order('score', { ascending: false })
 .limit(100)

 const cosmicBdays = cosmicCompat?.map(c => c.date_b) ?? []

 // Fetch all relevant profiles
 const allIds = [...new Set([...matchPartnerIds, ...likedMeIds])]
 let allProfiles: Profile[] = []
 if (allIds.length > 0) {
 const { data } = await supabase.from('profiles').select('*').in('id', allIds)
 allProfiles = data ?? []
 }

 // Fetch profiles with cosmic mutual compatibility
 let cosmicProfiles: Profile[] = []
 if (cosmicBdays.length > 0) {
 const { data } = await supabase
 .from('profiles')
 .select('*')
 .in('birthday', cosmicBdays)
 .neq('id', u.id)
 .limit(50)
 cosmicProfiles = data ?? []
 }

 // Load compatibility for all
 const allBdays = [...new Set([...allProfiles.map(p => p.birthday), ...cosmicProfiles.map(p => p.birthday)])]
 if (allBdays.length > 0) {
 const { data: compatData } = await supabase
 .from('compatibility')
 .select('*')
 .eq('date_a', u.birthday)
 .in('date_b', allBdays)

 const cm: Record<string, Compatibility> = {}
 compatData?.forEach(c => { cm[c.date_b] = c })
 setCompats(cm)
 }

 setMatches(allProfiles.filter(p => matchPartnerIds.includes(p.id)))
 setLikedMe(allProfiles.filter(p => likedMeIds.includes(p.id) && !matchPartnerIds.includes(p.id)))
 setMutualCompat(cosmicProfiles.sort((a, b) => {
 const ca = compats[a.birthday], cb = compats[b.birthday]
 return (cb?.score ?? 0) - (ca?.score ?? 0)
 }))
 setLoading(false)
 }

 const tabs: {key: Tab, label: string, count: number}[] = [
 { key: 'matches', label: lang === 'cs' ? ' Shody' : ' Matches', count: matches.length },
 { key: 'mutual', label: lang === 'cs' ? '↔ Kosmické' : '↔ Cosmic', count: mutualCompat.length },
 { key: 'liked', label: lang === 'cs' ? ' Líbím se' : ' Likes me', count: likedMe.length },
 ]

 const displayList = tab === 'matches' ? matches : tab === 'mutual' ? mutualCompat : likedMe

 if (loading) return (
 <div className="min-h-screen flex items-center justify-center"> <div className="text-4xl animate-spin"></div> </div> )

 return (
 <div className="min-h-screen"> <nav className="flex items-center justify-between px-6 py-4 max-w-2xl mx-auto"> <Link href="/" className="flex items-center gap-2"> <span className="text-xl"></span> <span className="font-bold">Cosmatch</span> </Link> <Link href="/discover" className="btn-secondary text-sm py-2 px-4"> {lang === 'cs' ? ' Objevovat' : ' Discover'}
 </Link> </nav> <div className="max-w-2xl mx-auto px-4 pb-10"> <h1 className="text-2xl font-bold mb-6">{lang === 'cs' ? 'Tvoje shody' : 'Your Matches'}</h1> {/* Tabs */}
 <div className="flex gap-2 mb-6"> {tabs.map(t => (
 <button key={t.key} onClick={() => setTab(t.key)}
 className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
 tab === t.key
 ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
 : 'bg-white/10 text-white/60 hover:bg-white/20'
 }`}> {t.label}
 {t.count > 0 && (
 <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
 tab === t.key ? 'bg-white/20' : 'bg-white/10'
 }`}>{t.count}</span> )}
 </button> ))}
 </div> {displayList.length === 0 ? (
 <div className="card p-12 text-center"> <div className="text-4xl mb-4">{tab === 'matches' ? '' : tab === 'mutual' ? '' : ''}</div> <p className="text-white/60"> {lang === 'cs'
 ? tab === 'matches' ? 'Zatím žádné shody. Pokračuj v objevování!'
 : tab === 'mutual' ? 'Žádné kosmické shody s registrovanými uživateli.'
 : 'Nikdo tě ještě neoznačil. Buď trpělivá!'
 : tab === 'matches' ? 'No matches yet. Keep discovering!'
 : tab === 'mutual' ? 'No cosmic matches with registered users yet.'
 : 'Nobody liked you yet. Be patient!'}
 </p> {tab === 'matches' && (
 <Link href="/discover" className="btn-primary inline-block mt-4"> {lang === 'cs' ? 'Objevovat' : 'Discover'}
 </Link> )}
 </div> ) : (
 <div className="space-y-3"> {tab === 'mutual' && (
 <div className="card p-4 bg-cyan-500/10 border-cyan-400/30 mb-4"> <p className="text-cyan-300 text-sm"> {lang === 'cs'
 ? 'Tito uživatelé mají s tebou oboustrannou kosmickou kompatibilitu — podle data narození. Líbí se ti? Přejdi do Objevovat a najdi je!'
 : 'These users have mutual cosmic compatibility with you — based on birth date. Go to Discover to find them!'}
 </p> </div> )}
 {displayList.map(p => {
 const c = compats[p.birthday]
 return (
 <div key={p.id} className="card p-4 flex items-center gap-4 hover:bg-white/15 transition-all"> <Avatar name={p.name} /> <div className="flex-1 min-w-0"> <div className="flex items-center gap-2 mb-1"> <span className="font-semibold">{p.name}</span> {p.birth_year && (
 <span className="text-white/40 text-xs">{new Date().getFullYear() - p.birth_year}y</span> )}
 {p.city && <span className="text-white/40 text-xs">· {p.city}</span>}
 </div> <div className="flex flex-wrap gap-1"> {c && <CompatBadges compat={c} lang={lang} />}
 </div> </div> {c && <ScoreRing score={c.score} />}
 </div> )
 })}
 </div> )}
 </div> </div> )
}
