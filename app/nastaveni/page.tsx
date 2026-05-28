'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, loadCurrentProfile, signOutCompletely, type Profile } from '@/lib/supabase'
import { haptic } from '@/lib/haptic'

type ToggleProps = {
  label: string
  description: string
  value: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}

function Toggle({ label, description, value, onChange, disabled }: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="flex-1">
        <p className="text-base text-gray-900 font-medium">{label}</p>
        <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{description}</p>
      </div>
      <button
        onClick={() => { haptic.light(); onChange(!value) }}
        disabled={disabled}
        role="switch"
        aria-checked={value}
        className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 mt-1 ${
          value ? 'bg-pink-500' : 'bg-gray-300'
        } ${disabled ? 'opacity-50' : 'hover:opacity-90'}`}>
        <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
          value ? 'translate-x-5' : 'translate-x-0'
        }`} />
      </button>
    </div>
  )
}

export default function NastaveniPage() {
  const router = useRouter()
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  useEffect(() => {
    (async () => {
      const r = await loadCurrentProfile()
      if (r.kind !== 'ok') { router.push('/login'); return }
      setUser(r.profile)
      setLoading(false)
    })()
  }, [router])

  async function updateField(key: keyof Profile, value: boolean) {
    if (!user) return
    setSaving(key as string)
    setUser({ ...user, [key]: value } as Profile)
    haptic.medium()
    const { error } = await supabase.from('profiles').update({ [key]: value }).eq('id', user.id)
    if (error) {
      haptic.error()
      // Rollback
      setUser({ ...user, [key]: !value } as Profile)
    }
    setSaving(null)
  }

  async function handleDeleteAccount() {
    if (!user) return
    haptic.error()
    await supabase.from('profiles').update({
      deleted_at: new Date().toISOString(),
      deletion_reason: 'user_initiated',
    }).eq('id', user.id)
    await signOutCompletely()
    router.push('/')
  }

  if (loading || !user) return (
    <main id="main" className="min-h-screen bg-[#F0EBE3] flex items-center justify-center">
      <p className="text-gray-500 text-sm">Načítám…</p>
    </main>
  )

  return (
    <main id="main" className="min-h-screen bg-[#F0EBE3] pb-24">
      <div className="max-w-xl mx-auto px-6 pt-6">
        <Link href="/profile" className="text-sm text-gray-500 hover:text-gray-900 transition">← Profil</Link>

        <header className="mt-8 mb-10">
          <p className="eyebrow text-pink-500 mb-2">Nastavení</p>
          <h1 className="serif-display text-4xl text-gray-900 font-medium leading-tight tracking-tight">
            Co Ti chodí
          </h1>
          <hr className="rule w-12 border-gray-900 mt-6" />
        </header>

        {/* E-maily */}
        <section className="bg-white rounded-3xl p-6 mb-6 divide-y divide-gray-100">
          <p className="eyebrow text-gray-500 pb-4">E-maily</p>
          <Toggle
            label="Týdenní shrnutí kompatibility"
            description="Každý čtvrtek odpoledne — kdo Ti tento týden sedí nad průměr."
            value={user.email_weekly_insight !== false}
            onChange={(v) => updateField('email_weekly_insight' as keyof Profile, v)}
            disabled={saving === 'email_weekly_insight'}
          />
          <Toggle
            label="Notifikace nové shody"
            description="Když Ti někdo lajkne a vznikne mutual match."
            value={user.email_match_notif !== false}
            onChange={(v) => updateField('email_match_notif' as keyof Profile, v)}
            disabled={saving === 'email_match_notif'}
          />
          <Toggle
            label="Notifikace nové zprávy"
            description="Když Ti někdo napíše v chatu (jen když nejsi online)."
            value={user.email_message_notif !== false}
            onChange={(v) => updateField('email_message_notif' as keyof Profile, v)}
            disabled={saving === 'email_message_notif'}
          />
        </section>

        {/* Push notifikace */}
        <section className="bg-white rounded-3xl p-6 mb-6 divide-y divide-gray-100">
          <p className="eyebrow text-gray-500 pb-4">Push notifikace</p>
          <Toggle
            label="Povolit push do telefonu"
            description="Nové zprávy a shody se objeví jako notifikace. Funguje jen v Cosmatch appce na telefonu."
            value={user.push_enabled !== false}
            onChange={(v) => updateField('push_enabled' as keyof Profile, v)}
            disabled={saving === 'push_enabled'}
          />
        </section>

        {/* Účet */}
        <section className="bg-white rounded-3xl p-6 mb-6 space-y-3">
          <p className="eyebrow text-gray-500 mb-2">Účet</p>
          <Link href="/profile/verifikace" className="block py-3 text-gray-900 hover:text-pink-500 transition">
            <div className="flex items-center justify-between">
              <span>Verifikace profilu</span>
              <span className="text-gray-400">{user.is_verified ? '✓ Ověřeno' : 'Začít →'}</span>
            </div>
          </Link>
          <Link href="/manifest-duvery" className="block py-3 text-gray-900 hover:text-pink-500 transition">
            <div className="flex items-center justify-between">
              <span>Manifest důvěry</span>
              <span className="text-gray-400">→</span>
            </div>
          </Link>
          <Link href="/zasady-ochrany-osobnich-udaju" className="block py-3 text-gray-900 hover:text-pink-500 transition">
            <div className="flex items-center justify-between">
              <span>Zásady ochrany osobních údajů</span>
              <span className="text-gray-400">→</span>
            </div>
          </Link>
        </section>

        {/* Nebezpečná zóna */}
        <section className="bg-white rounded-3xl p-6 space-y-3">
          <p className="eyebrow text-gray-500 mb-2">Účet — akce</p>
          <button onClick={() => setShowLogoutConfirm(true)}
            className="w-full bg-white border border-gray-200 hover:border-gray-900 text-gray-900 py-4 rounded-full text-base font-medium transition">
            Odhlásit se
          </button>
          <button onClick={() => setShowDeleteConfirm(true)}
            className="block w-full text-[11px] text-gray-400 hover:text-red-600 underline underline-offset-4 decoration-gray-300 hover:decoration-red-400 transition pt-2">
            Smazat účet
          </button>
        </section>

        <p className="text-xs text-gray-400 text-center pt-8">cosmatch.cz · 2026</p>
      </div>

      {/* Logout dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-6">
          <div className="bg-[#FAF6F0] rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="serif-display text-2xl text-gray-900 font-medium leading-tight mb-3">Odhlásit se?</h3>
            <p className="text-gray-600 leading-relaxed text-sm mb-6">Vrátíš se na přihlašovací obrazovku. Tvůj profil zůstává — můžeš se vrátit kdykoli.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 bg-white border border-gray-300 hover:border-gray-900 text-gray-900 py-3 rounded-full font-medium transition">Zůstat</button>
              <button onClick={async () => { await signOutCompletely(); router.push('/login') }} className="flex-1 bg-gray-900 text-white py-3 rounded-full font-medium hover:bg-gray-800 transition">Odhlásit</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-6">
          <div className="bg-[#FAF6F0] rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <p className="eyebrow text-rose-500 mb-3">Trvalé smazání</p>
            <h3 className="serif-display text-2xl text-gray-900 font-medium leading-tight mb-3">Opravdu chceš smazat účet?</h3>
            <p className="text-gray-600 leading-relaxed text-sm mb-2">Účet bude okamžitě zneaktivněn a zmizí z aplikace.</p>
            <p className="text-gray-600 leading-relaxed text-sm mb-6">Tvá data se trvale smažou za 30 dní. Do té doby můžeš poslat e-mail přes <Link href="/kontakt" className="underline">kontaktní formulář</Link> a účet obnovíme. Po 30 dnech je nevratné.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 bg-white border border-gray-300 hover:border-gray-900 text-gray-900 py-3 rounded-full font-medium transition">Zrušit</button>
              <button onClick={handleDeleteAccount} className="flex-1 bg-rose-600 text-white py-3 rounded-full font-medium hover:bg-rose-700 transition">Smazat</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
