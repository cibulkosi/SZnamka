
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, loadCurrentProfile, signOutCompletely, type Profile, getZodiac } from '@/lib/supabase'

const RELATIONSHIP_GOAL_LABELS: Record<string, string> = {
  serious: 'Vážný vztah',
  friendship: 'Přátelství',
  casual: 'Nezávazně',
  unsure: 'Zatím nevím',
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

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<Profile | null>(null)
  const [personologyText, setPersonologyText] = useState('')
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    (async () => {
      const r = await loadCurrentProfile()
      if (r.kind === 'no-session') { router.push('/login'); return }
      if (r.kind === 'no-profile') { router.push('/register'); return }
      const profile = r.profile
      setUser(profile)
      if (profile.birthday) {
        supabase.from('personology').select('opening').eq('date_key', profile.birthday).single()
          .then(({ data }) => { if (data?.opening) setPersonologyText(data.opening) })
      }
    })()
  }, [router])

  const handleLogout = async () => {
    await signOutCompletely()
  }

  async function handleDeleteAccount() {
    if (!user) return
    setDeleting(true)
    // Soft-delete: data hard-deleted after 30 days by retention_hard_delete_daily cron
    const { error } = await supabase
      .from('profiles')
      .update({ deleted_at: new Date().toISOString(), deletion_reason: 'user_initiated', active: false })
      .eq('id', user.id)
    if (error) { alert('Chyba při mazání: ' + error.message); setDeleting(false); return }
    await signOutCompletely()
    router.push('/login')
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#FAF6F0] flex items-center justify-center">
        <p className="text-gray-400 text-sm">Načítám profil…</p>
      </main>
    )
  }

  const photo = user.photos?.[0]
  const zodiac = getZodiac(user.birthday)
  const [mm, dd] = user.birthday ? user.birthday.split('-') : ['', '']
  const birthdayDisplay = user.birthday && user.birth_year ? `${dd}.${mm}.${user.birth_year}` : ''

  return (
    <main className="min-h-screen bg-[#FAF6F0] pb-24">
      <div className="max-w-xl mx-auto px-6 pt-6 flex items-center justify-between">
        <Link href="/discover" className="text-sm text-gray-500 hover:text-gray-900 transition">← Discover</Link>
        <Link href="/discover" className="text-sm text-gray-500 hover:text-gray-900 transition">Upravit profil</Link>
      </div>

      <div className="max-w-xl mx-auto px-6 pt-12">

        {/* Hero — photo + name + meta */}
        <header className="mb-12">
          <p className="eyebrow text-pink-500 mb-6">Tvůj profil</p>

          <div className="flex items-start gap-6 mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-gray-200">
              {photo ? (
                <img src={photo} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-pink-50 flex items-center justify-center">
                  <span className="serif text-4xl text-pink-500 font-medium">{user.name.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h1 className="serif-display text-4xl text-gray-900 font-medium leading-tight tracking-tight mb-2 flex items-center gap-3 flex-wrap">
                {user.name}
                {user.verified && (
                  <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    Ověřeno
                  </span>
                )}
              </h1>
              <p className="text-gray-500 text-[1.0625rem] leading-relaxed">
                {birthdayDisplay}
                {zodiac && <><span className="text-gray-300 mx-2">·</span>{zodiac}</>}
                {user.city && <><span className="text-gray-300 mx-2">·</span>{user.city}</>}
              </p>
            </div>
          </div>

          {(user.premium || user.relationship_goal) && (
            <div className="flex flex-wrap gap-2">
              {user.premium && (
                <span className="inline-flex items-center gap-1.5 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                  ★ Cosmatch+
                </span>
              )}
              {user.relationship_goal && RELATIONSHIP_GOAL_LABELS[user.relationship_goal] && (
                <span className="inline-flex items-center bg-pink-50 text-pink-600 text-[11px] font-medium px-3 py-1 rounded-full border border-pink-100">
                  {RELATIONSHIP_GOAL_LABELS[user.relationship_goal]}
                </span>
              )}
            </div>
          )}
        </header>

        <hr className="rule mb-12" />

        {/* Otisk osudu */}
        {personologyText && (
          <section className="mb-12">
            <p className="eyebrow text-pink-500 mb-3">Tvůj otisk osudu</p>
            <p className="text-gray-800 leading-[1.75] text-[1.0625rem] italic serif">
              „{personologyText}"
            </p>
          </section>
        )}

        {personologyText && <hr className="rule mb-12" />}

        {/* Bio */}
        {user.bio && (
          <section className="mb-12">
            <p className="eyebrow text-pink-500 mb-3">O mně</p>
            <p className="text-gray-800 leading-[1.75] text-[1.0625rem]">{user.bio}</p>
          </section>
        )}

        {/* Detaily */}
        {(user.occupation || user.education) && (
          <section className="mb-12">
            <p className="eyebrow text-pink-500 mb-3">Detaily</p>
            <div className="space-y-1">
              {user.occupation && <p className="text-gray-800 text-[1.0625rem]"><span className="text-gray-500">Povolání: </span>{user.occupation}</p>}
              {user.education && <p className="text-gray-800 text-[1.0625rem]"><span className="text-gray-500">Vzdělání: </span>{user.education}</p>}
            </div>
          </section>
        )}

        {/* Zájmy */}
        {user.hobbies && user.hobbies.length > 0 && (
          <section className="mb-12">
            <p className="eyebrow text-pink-500 mb-3">Zájmy</p>
            <div className="flex flex-wrap gap-2">
              {user.hobbies.map((h, i) => (
                <span key={i} className="bg-white border border-gray-200 text-gray-700 text-sm px-4 py-1.5 rounded-full">
                  {h}
                </span>
              ))}
            </div>
          </section>
        )}

        <hr className="rule mb-12" />

        {/* Premium upsell */}
        {!user.premium && (
          <section className="mb-12">
            <Link href="/premium" className="block bg-white border border-gray-100 hover:border-gray-300 rounded-3xl p-8 transition-all">
              <p className="eyebrow text-pink-500 mb-3">Cosmatch+</p>
              <h2 className="serif text-2xl text-gray-900 font-medium leading-tight mb-3">
                Odemkni hloubku, neomezené lajky.
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-[1.0625rem]">
                Cosmatch+ od 249 Kč/měs (kvartálně 597 Kč · ročně 2 088 Kč, sleva 30 %).
              </p>
              <span className="text-pink-500 font-medium text-sm">Prohlédnout plány →</span>
            </Link>
          </section>
        )}

        {/* Settings */}
        <section className="mb-12 space-y-3">
          <p className="eyebrow text-gray-500 mb-3">Nastavení</p>
          <button onClick={() => setShowLogoutConfirm(true)}
            className="w-full bg-white border border-gray-200 hover:border-gray-900 text-gray-900 py-4 rounded-full text-base font-medium transition">
            Odhlásit se
          </button>
        </section>

        <p className="text-xs text-gray-400 text-center pb-4">
          cosmatch.cz · 2026
        </p>

        <p className="text-center pb-8">
          <button onClick={() => setShowDeleteConfirm(true)}
            className="text-[11px] text-gray-400 hover:text-red-600 underline underline-offset-4 decoration-gray-300 hover:decoration-red-400 transition">
            Smazat účet
          </button>
        </p>
      </div>

      {/* Logout dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-6">
          <div className="bg-[#FAF6F0] rounded-3xl p-10 w-full max-w-md shadow-2xl">
            <p className="eyebrow text-pink-500 mb-4">Odhlášení</p>
            <h3 className="serif-display text-3xl text-gray-900 font-medium leading-tight mb-3">
              Odhlásit se?
            </h3>
            <p className="text-gray-600 leading-relaxed text-[1.0625rem] mb-8">
              Vrátíš se na přihlašovací obrazovku. Tvůj profil zůstává — můžeš se vrátit kdykoli.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-white border border-gray-300 hover:border-gray-900 text-gray-900 py-4 rounded-full font-medium transition">
                Zůstat
              </button>
              <button onClick={handleLogout}
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-full font-medium transition">
                Odhlásit
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-6">
          <div className="bg-[#FAF6F0] rounded-3xl p-10 w-full max-w-md shadow-2xl">
            <p className="eyebrow text-red-600 mb-4">Trvalé smazání účtu</p>
            <h3 className="serif-display text-3xl text-gray-900 font-medium leading-tight mb-3">
              Opravdu chceš smazat svůj účet?
            </h3>
            <p className="text-gray-700 leading-relaxed text-[1.0625rem] mb-3">
              Účet bude okamžitě zneaktivněn a zmizí z aplikace.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Tvá data se trvale smažou za 30 dní. Do té doby můžeš poslat e-mail
              na <span className="font-medium">ahoj@cosmatch.cz</span> a účet obnovíme.
              Po 30 dnech je smazání nevratné.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} disabled={deleting}
                className="flex-1 bg-white border border-gray-300 hover:border-gray-900 text-gray-900 py-4 rounded-full font-medium transition disabled:opacity-50">
                Zrušit
              </button>
              <button onClick={handleDeleteAccount} disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-full font-medium transition disabled:opacity-50">
                {deleting ? 'Mažu…' : 'Ano, smazat'}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav active="profile" />
    </main>
  )
}
