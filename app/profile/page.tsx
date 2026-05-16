'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, type Profile, getZodiac } from '@/lib/supabase'

const AVATAR_GRADIENTS = [
 'from-pink-300 to-rose-400',
 'from-purple-300 to-pink-400',
 'from-blue-300 to-cyan-400',
 'from-emerald-300 to-teal-400',
 'from-orange-300 to-amber-400',
 'from-violet-300 to-purple-400',
]

const RELATIONSHIP_GOAL_LABELS: Record<string, string> = {
 serious: ' Vážný vztah',
 friendship: ' Přátelství',
 casual: ' Nezávazně',
 unsure: ' Zatím nevím',
}

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
 active === item.key
 ? 'text-pink-500'
 : 'text-gray-400 hover:text-gray-600'
 }`}
 > {item.icon}
 <span className="text-[9px] font-bold tracking-wide">{item.label}</span> </Link> ))}
 </div> </nav> )
}

export default function ProfilePage() {
 const router = useRouter()
 const [user, setUser] = useState<Profile | null>(null)
 const [personologyText, setPersonologyText] = useState('')
 const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

 useEffect(() => {
 const raw = localStorage.getItem('cosmatch_user')
 if (!raw) { router.push('/login'); return }
 const profile = JSON.parse(raw) as Profile
 setUser(profile)

 // Načti numerologický text
 if (profile.birthday) {
 supabase
 .from('personology')
 .select('opening')
 .eq('date_key', profile.birthday)
 .single()
 .then(({ data }) => {
 if (data?.opening) setPersonologyText(data.opening)
 })
 }
 }, [router])

 const handleLogout = () => {
 localStorage.removeItem('cosmatch_user')
 localStorage.removeItem('cosmatch_magic_seen')
 supabase.auth.signOut()
 router.push('/login')
 }

 if (!user) {
 return (
 <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center"> <div className="text-center"> <div className="text-4xl mb-4 animate-spin"></div> <p className="text-gray-400 text-sm">Načítám profil...</p> </div> </div> )
 }

 const avatarGradient = AVATAR_GRADIENTS[user.name.charCodeAt(0) % AVATAR_GRADIENTS.length]
 const photo = user.photos?.[0]
 const zodiac = getZodiac(user.birthday)
 const [mm, dd] = user.birthday ? user.birthday.split('-') : ['', '']
 const birthdayDisplay = user.birthday && user.birth_year
 ? `${dd}.${mm}.${user.birth_year}`
 : ''

 const genderLabel = user.gender === 'male' ? ' Muž' : user.gender === 'female' ? ' Žena' : ' Jiné'

 return (
 <div className="min-h-screen bg-[#FAF6F0] pb-24"> {/* Header */}
 <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between max-w-lg mx-auto"> <div className="flex items-center gap-2"> <span className="text-pink-500 text-xl font-bold">✦</span> <span className="text-lg font-bold text-gray-900">Můj profil</span> </div> {user.premium && (
 <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full"> Premium
 </span> )}
 </div> <div className="max-w-lg mx-auto px-4 pt-6 space-y-4"> {/* Avatar + jméno */}
 <div className="card p-6 flex flex-col items-center text-center"> <div className="w-28 h-28 rounded-full overflow-hidden mb-4 ring-4 ring-pink-100"> {photo ? (
 <img src={photo} alt={user.name} className="w-full h-full object-cover" /> ) : (
 <div className={`w-full h-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center`}> <span className="text-white text-5xl font-bold opacity-80"> {user.name.charAt(0).toUpperCase()}
 </span> </div> )}
 </div> <h1 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h1> {birthdayDisplay && (
 <p className="text-gray-500 text-sm mb-1"> {birthdayDisplay}</p> )}
 {zodiac && (
 <p className="text-gray-400 text-sm mb-3">{zodiac}</p> )}
 <div className="flex flex-wrap gap-2 justify-center"> <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">{genderLabel}</span> {user.city && (
 <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full"> {user.city}</span> )}
 {user.relationship_goal && RELATIONSHIP_GOAL_LABELS[user.relationship_goal] && (
 <span className="bg-pink-50 text-pink-600 text-xs font-medium px-3 py-1 rounded-full"> {RELATIONSHIP_GOAL_LABELS[user.relationship_goal]}
 </span> )}
 </div> </div> {/* Otisk osudu */}
 {personologyText && (
 <div className="card p-5"> <div className="flex items-center gap-2 mb-3"> <span className="text-lg"></span> <h2 className="font-bold text-gray-900">Tvůj otisk osudu</h2> </div> <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">{personologyText}</p> </div> )}

 {/* Bio */}
 {user.bio && (
 <div className="card p-5"> <div className="flex items-center gap-2 mb-3"> <span className="text-lg"></span> <h2 className="font-bold text-gray-900">O mně</h2> </div> <p className="text-gray-600 text-sm leading-relaxed">{user.bio}</p> </div> )}

 {/* Koníčky */}
 {user.hobbies && user.hobbies.length > 0 && (
 <div className="card p-5"> <div className="flex items-center gap-2 mb-3"> <span className="text-lg"></span> <h2 className="font-bold text-gray-900">Zájmy</h2> </div> <div className="flex flex-wrap gap-2"> {user.hobbies.map((h, i) => (
 <span key={i} className="bg-purple-50 text-purple-700 text-xs font-medium px-3 py-1.5 rounded-full"> {h}
 </span> ))}
 </div> </div> )}

 {/* Detaily */}
 {(user.occupation || user.education) && (
 <div className="card p-5"> <div className="flex items-center gap-2 mb-3"> <span className="text-lg"></span> <h2 className="font-bold text-gray-900">Detaily</h2> </div> <div className="space-y-2"> {user.occupation && (
 <div className="flex items-center gap-3 text-sm text-gray-600"> <span className="text-base"></span> <span>{user.occupation}</span> </div> )}
 {user.education && (
 <div className="flex items-center gap-3 text-sm text-gray-600"> <span className="text-base"></span> <span>{user.education}</span> </div> )}
 </div> </div> )}

 {/* Premium upgrade (jen pro free uživatele) */}
 {!user.premium && (
 <Link href="/premium" className="block card p-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-95 transition-opacity"> <div className="flex items-center justify-between"> <div> <p className="font-bold text-base mb-0.5"> Odemknout Cosmatch+</p> <p className="text-white/80 text-sm">Neomezené swipy, kdo tě lajkoval a víc</p> </div> <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5"> <path d="m9 18 6-6-6-6"/> </svg> </div> </Link> )}

 {/* Odhlásit se */}
 <div className="card p-5"> <button
 onClick={() => setShowLogoutConfirm(true)}
 className="w-full flex items-center justify-center gap-2 text-red-500 font-semibold py-2 hover:bg-red-50 rounded-xl transition-colors"
 > <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"> <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/> <polyline points="16 17 21 12 16 7"/> <line x1="21" y1="12" x2="9" y2="12"/> </svg> Odhlásit se
 </button> </div> <p className="text-center text-gray-300 text-xs pb-2">cosmatch.cz © 2025</p> </div> {/* Logout potvrzení */}
 {showLogoutConfirm && (
 <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-center p-4"> <div className="bg-white rounded-3xl p-6 w-full max-w-sm"> <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Odhlásit se?</h3> <p className="text-gray-500 text-sm text-center mb-6">Vrátíš se na přihlašovací obrazovku.</p> <div className="flex gap-3"> <button
 onClick={() => setShowLogoutConfirm(false)}
 className="btn-secondary flex-1"
 > Zůstat
 </button> <button
 onClick={handleLogout}
 className="flex-1 bg-red-500 text-white font-semibold py-3 px-6 rounded-2xl hover:bg-red-600 transition-colors"
 > Odhlásit
 </button> </div> </div> </div> )}

 <BottomNav active="profile" /> </div> )
}
