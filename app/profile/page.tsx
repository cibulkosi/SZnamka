'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, loadCurrentProfile, signOutCompletely, type Profile, getZodiac, BODY_TYPES } from '@/lib/supabase'
import { computeMBTITolerant, MBTI_TYPES_CZ } from '@/lib/mbti'
import { TrialBanner } from '@/components/PremiumGate'
import FoundingBadge from '@/components/FoundingBadge'

const SUPABASE_FUNCTIONS_URL = 'https://xdotpadgbchhecwitbpe.supabase.co/functions/v1'

const RELATIONSHIP_GOAL_LABELS: Record<string, string> = {
  serious: 'Vážný vztah', friendship: 'Přátelství', casual: 'Nezávazně', unsure: 'Zatím nevím',
}

// ── Icons ─────────────────────────────────────────────────────
const SaturnIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="-50 -38 100 76">
    <g transform="rotate(-18)"><ellipse cx="0" cy="0" rx="40" ry="7" fill="none" stroke="#f9a8d4" strokeWidth="3.5" /></g>
    <circle cx="0" cy="0" r="18" fill="#ec4899" />
    <g transform="rotate(-18)"><path d="M -40 0 A 40 7 0 0 0 40 0" fill="none" stroke="#f9a8d4" strokeWidth="3.5" /></g>
  </svg>
)
const PencilIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
)

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

// ── Generic patch helper ──────────────────────────────────────
async function patchProfile(userId: string, patch: Partial<Profile>): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.from('profiles').update(patch).eq('id', userId)
  return error ? { ok: false, error: error.message } : { ok: true }
}

// ── Photo editor (6-slot grid) ────────────────────────────────
function PhotoEditor({ user, onUpdate }: { user: Profile; onUpdate: (photos: string[]) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const photos = user.photos || []

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true); setError(null)
    const remaining = 6 - photos.length
    const toUpload = Array.from(files).slice(0, remaining).filter(f => f.type.startsWith('image/'))
    const newUrls: string[] = []
    for (const file of toUpload) {
      try {
        const fd = new FormData(); fd.append('file', file); fd.append('userId', user.id)
        const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/upload-photo`, { method: 'POST', body: fd })
        const json = await res.json()
        if (json.url) newUrls.push(json.url)
      } catch (e) { setError('Nepodařilo se nahrát fotku'); break }
    }
    if (newUrls.length > 0) {
      const updated = [...photos, ...newUrls]
      const r = await patchProfile(user.id, { photos: updated })
      if (r.ok) onUpdate(updated); else setError('Uloženo, ale databáze odmítla. ' + r.error)
    }
    setUploading(false)
  }

  async function handleRemove(idx: number) {
    const updated = photos.filter((_, i) => i !== idx)
    const r = await patchProfile(user.id, { photos: updated })
    if (r.ok) onUpdate(updated); else setError('Smazání selhalo: ' + r.error)
  }

  async function moveToFirst(idx: number) {
    if (idx === 0) return
    const updated = [photos[idx], ...photos.filter((_, i) => i !== idx)]
    const r = await patchProfile(user.id, { photos: updated })
    if (r.ok) onUpdate(updated); else setError('Změna pořadí selhala: ' + r.error)
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="eyebrow text-pink-500">Fotky</p>
        <p className="text-xs text-gray-500">{photos.length} / 6</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {photos.map((url, i) => (
          <div key={url} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
            <img src={url} alt={`Fotka ${i + 1}`} className="w-full h-full object-cover" />
            <button onClick={() => handleRemove(i)} aria-label="Smazat fotku"
              className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white rounded-full w-7 h-7 flex items-center justify-center text-xs transition">×</button>
            {i === 0 ? (
              <span className="absolute bottom-2 left-2 bg-white text-gray-900 text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full font-medium">Hlavní</span>
            ) : (
              <button onClick={() => moveToFirst(i)}
                className="absolute bottom-2 left-2 bg-white/90 hover:bg-white text-gray-700 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium transition">
                Hlavní
              </button>
            )}
          </div>
        ))}
        {photos.length < 6 && (
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
            className="aspect-square rounded-2xl border border-dashed border-gray-300 bg-white/40 flex flex-col items-center justify-center text-gray-400 hover:border-gray-900 hover:text-gray-900 transition disabled:opacity-50">
            <span className="serif text-3xl">{uploading ? '…' : '+'}</span>
            <span className="text-[10px] uppercase tracking-wider mt-1">{uploading ? 'Nahrávám' : 'Přidat'}</span>
          </button>
        )}
      </div>
      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden"
        onChange={e => handleFiles(e.target.files)} />
      <p className="text-xs text-gray-400 mt-3">JPG / PNG / WebP · max 10 MB · klikni Hlavní pro přesun na první místo</p>
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  )
}

// ── Inline text editor (bio, philosophy) ──────────────────────
function EditableText({ label, value, onSave, placeholder, multiline = true, maxLength = 500 }: {
  label: string
  value: string | undefined
  onSave: (newValue: string) => Promise<void>
  placeholder: string
  multiline?: boolean
  maxLength?: number
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value || '')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    await onSave(draft.trim())
    setSaving(false)
    setEditing(false)
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="eyebrow text-pink-500">{label}</p>
        {!editing && (
          <button onClick={() => { setDraft(value || ''); setEditing(true) }}
            className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1 transition">
            <PencilIcon size={12} /> Upravit
          </button>
        )}
      </div>
      {editing ? (
        <>
          {multiline ? (
            <textarea value={draft} onChange={e => setDraft(e.target.value.slice(0, maxLength))} rows={4}
              placeholder={placeholder}
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 text-[1.0625rem] leading-relaxed focus:border-gray-900 focus:outline-none resize-none" />
          ) : (
            <input value={draft} onChange={e => setDraft(e.target.value.slice(0, maxLength))}
              placeholder={placeholder}
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 text-[1.0625rem] focus:border-gray-900 focus:outline-none" />
          )}
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-gray-400">{draft.length} / {maxLength}</p>
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} disabled={saving}
                className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-gray-300 hover:border-gray-900 transition disabled:opacity-50">
                Zrušit
              </button>
              <button onClick={handleSave} disabled={saving}
                className="px-4 py-2 rounded-full text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition disabled:opacity-50">
                {saving ? 'Ukládám…' : 'Uložit'}
              </button>
            </div>
          </div>
        </>
      ) : value ? (
        <p className="text-gray-800 leading-[1.75] text-[1.0625rem] whitespace-pre-wrap">{value}</p>
      ) : (
        <p className="text-gray-400 italic">{placeholder}</p>
      )}
    </div>
  )
}

// ── Hobbies editor (tag chips) ────────────────────────────────
function HobbiesEditor({ user, onUpdate }: { user: Profile; onUpdate: (hobbies: string[]) => void }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<string[]>(user.hobbies || [])
  const [input, setInput] = useState('')
  const [saving, setSaving] = useState(false)
  const hobbies = user.hobbies || []

  function addTag() {
    const v = input.trim()
    if (!v || draft.includes(v) || draft.length >= 10) return
    setDraft([...draft, v])
    setInput('')
  }
  function removeTag(t: string) { setDraft(draft.filter(x => x !== t)) }

  async function handleSave() {
    setSaving(true)
    const r = await patchProfile(user.id, { hobbies: draft })
    setSaving(false)
    if (r.ok) { onUpdate(draft); setEditing(false) }
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="eyebrow text-pink-500">Zájmy</p>
        {!editing && (
          <button onClick={() => { setDraft(hobbies); setEditing(true) }}
            className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1 transition">
            <PencilIcon size={12} /> Upravit
          </button>
        )}
      </div>
      {editing ? (
        <>
          <div className="flex flex-wrap gap-2 mb-3">
            {draft.map(t => (
              <span key={t} className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-full">
                {t}
                <button onClick={() => removeTag(t)} className="text-gray-400 hover:text-red-600 transition" aria-label="Odstranit">×</button>
              </span>
            ))}
          </div>
          {draft.length < 10 && (
            <div className="flex gap-2 mb-3">
              <input value={input} onChange={e => setInput(e.target.value.slice(0, 30))}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                placeholder="Přidej zájem (např. Jóga)"
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:border-gray-900 focus:outline-none" />
              <button onClick={addTag} disabled={!input.trim()}
                className="px-4 py-2 rounded-full text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition disabled:opacity-30">
                Přidat
              </button>
            </div>
          )}
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">{draft.length} / 10</p>
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} disabled={saving}
                className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-gray-300 hover:border-gray-900 transition disabled:opacity-50">
                Zrušit
              </button>
              <button onClick={handleSave} disabled={saving}
                className="px-4 py-2 rounded-full text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition disabled:opacity-50">
                {saving ? 'Ukládám…' : 'Uložit'}
              </button>
            </div>
          </div>
        </>
      ) : hobbies.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {hobbies.map(h => <span key={h} className="bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-full">{h}</span>)}
        </div>
      ) : (
        <p className="text-gray-400 italic">Žádné zájmy. Klikni Upravit a přidej co Tě baví.</p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
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
      setUser(r.profile)
      if (r.profile.birthday) {
        supabase.from('personology').select('opening').eq('date_key', r.profile.birthday).single()
          .then(({ data }) => { if (data?.opening) setPersonologyText(data.opening) })
      }
    })()
  }, [router])

  const handleLogout = async () => { await signOutCompletely() }
  async function handleDeleteAccount() {
    if (!user) return
    setDeleting(true)
    const { error } = await supabase.from('profiles')
      .update({ deleted_at: new Date().toISOString(), deletion_reason: 'user_initiated', active: false })
      .eq('id', user.id)
    if (error) { alert('Chyba: ' + error.message); setDeleting(false); return }
    await signOutCompletely(); router.push('/login')
  }

  async function updateField<K extends keyof Profile>(key: K, value: Profile[K]) {
    if (!user) return
    const r = await patchProfile(user.id, { [key]: value } as Partial<Profile>)
    if (r.ok) setUser({ ...user, [key]: value })
  }

  if (!user) return (
    <main className="min-h-screen bg-[#F0EBE3] flex items-center justify-center">
      <p className="text-gray-400 text-sm">Načítám profil…</p>
    </main>
  )

  const zodiac = getZodiac(user.birthday)
  const [mm, dd] = user.birthday ? user.birthday.split('-') : ['', '']
  const birthdayDisplay = user.birthday && user.birth_year ? `${dd}.${mm}.${user.birth_year}` : ''
  const mbti = computeMBTITolerant(user)
  const mbtiInfo = mbti ? MBTI_TYPES_CZ[mbti] : null
  const heroPhoto = user.photos?.[0]

  return (
    <main className="min-h-screen bg-[#F0EBE3] pb-24">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-[#F0EBE3]/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/discover" className="text-gray-500 hover:text-gray-900 text-sm transition">← Discover</Link>
          <div className="flex items-center gap-2"><SaturnIcon size={18} /><span className="text-sm text-gray-900 font-medium">{user.name?.split(' ')[0]}</span></div>
          <span className="text-gray-400" aria-hidden>•••</span>
        </div>
      </div>

      <article className="max-w-md mx-auto py-4 px-4 space-y-3">
        <TrialBanner profile={user} />

        {/* Hero photo + name */}
        {heroPhoto ? (
          <div className="relative rounded-3xl overflow-hidden bg-gray-200 shadow-sm" style={{ aspectRatio: '3/4' }}>
            <img src={heroPhoto} alt={user.name} className="w-full h-full object-cover" />
            {user.verified && (
              <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-xs text-emerald-700 bg-white/95 px-2 py-1 rounded-full font-medium shadow-sm">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                Ověřeno
              </span>
            )}
          </div>
        ) : (
          <div className="rounded-3xl bg-pink-50 border border-pink-100 flex items-center justify-center" style={{ aspectRatio: '3/4' }}>
            <div className="text-center p-8">
              <p className="serif-display text-6xl text-pink-300 font-medium mb-2">{user.name.charAt(0).toUpperCase()}</p>
              <p className="text-sm text-gray-500">Přidej svoji první fotku níže</p>
            </div>
          </div>
        )}

        {/* Name + meta */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-baseline gap-3 flex-wrap mb-2">
            <h1 className="serif-display text-4xl text-gray-900 font-medium leading-none">{user.name}</h1>
            {user.birth_year && <span className="text-3xl text-gray-400 font-light">{new Date().getFullYear() - user.birth_year}</span>}
            <FoundingBadge isFoundingMember={!!user.is_founding_member} visible={user.founding_badge_visible !== false} compact />
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            {birthdayDisplay && <>{birthdayDisplay}</>}
            {zodiac && <><span className="text-gray-300 mx-2">·</span>{zodiac}</>}
            {user.city && <><span className="text-gray-300 mx-2">·</span>{user.city}</>}
          </p>
          {(user.premium || user.relationship_goal) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {user.premium && <span className="inline-flex items-center gap-1.5 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">★ Cosmatch+</span>}
              {user.relationship_goal && RELATIONSHIP_GOAL_LABELS[user.relationship_goal] && (
                <span className="inline-flex items-center bg-pink-50 text-pink-700 text-xs font-medium px-3 py-1 rounded-full border border-pink-100">
                  {RELATIONSHIP_GOAL_LABELS[user.relationship_goal]}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Photo editor */}
        <PhotoEditor user={user} onUpdate={(photos) => setUser({ ...user, photos })} />

        {/* Bio (editable) */}
        <EditableText label="O mně" value={user.bio} placeholder="Napiš o sobě pár vět — co Tě baví, co hledáš, jaký vztah Ti dává smysl."
          onSave={async (v) => { await updateField('bio', v) }} maxLength={500} />

        {/* Hobbies (editable) */}
        <HobbiesEditor user={user} onUpdate={(hobbies) => setUser({ ...user, hobbies })} />

        {/* Životní filozofie (editable) */}
        <EditableText label="Životní filozofie" value={user.philosophy} placeholder="Jednou větou Tvoje hlavní pravidlo nebo motto."
          onSave={async (v) => { await updateField('philosophy', v) }} maxLength={200} />

        {/* Otisk osudu (read-only) */}
        {personologyText && (
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <p className="eyebrow text-pink-500 mb-3">Tvůj otisk osudu</p>
            <p className="text-gray-800 leading-[1.75] text-[1.0625rem] italic serif">„{personologyText}"</p>
          </div>
        )}

        {/* MBTI (read-only) */}
        {mbti && (
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <p className="eyebrow text-pink-500 mb-3">Tvůj MBTI typ</p>
            <div className="flex items-baseline gap-3">
              <span className="serif-display text-4xl text-gray-900 font-medium tabular-nums">{mbti}</span>
              {mbtiInfo && <span className="serif text-xl text-gray-700 italic">{mbtiInfo.name}</span>}
            </div>
            {mbtiInfo && <p className="text-gray-600 text-[0.95rem] mt-2 leading-relaxed">{mbtiInfo.tagline}</p>}
            <p className="text-xs text-gray-400 mt-3">Vypočteno ze 4 dimenzí (E/I + N/S + T/F + J/P) podle Myers-Briggs Type Indicator.</p>
          </div>
        )}

        {/* Premium upsell */}
        {!user.premium && (
          <Link href="/premium" className="block bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 hover:border-gray-300">
            <p className="eyebrow text-pink-500 mb-3">Cosmatch+</p>
            <h2 className="serif text-2xl text-gray-900 font-medium leading-tight mb-3">Odemkni hloubku, neomezené lajky.</h2>
            <p className="text-gray-600 leading-relaxed mb-3 text-[0.95rem]">Cosmatch+ od 249 Kč/měs (kvartálně 597 Kč · ročně 2 088 Kč, sleva 30 %).</p>
            <span className="text-pink-500 font-medium text-sm">Prohlédnout plány →</span>
          </Link>
        )}

        {/* Filtry pro Discover */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <p className="eyebrow text-gray-500 mb-1">Filtry pro Discover</p>
          <h2 className="serif text-xl text-gray-900 font-medium leading-tight mb-4">Co Ti budeme ukazovat</h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">Minimální kompatibilita</p>
              <p className="text-xs text-gray-500 mb-3">Profily pod tuto hranici se Ti nezobrazí.</p>
              <div className="grid grid-cols-4 gap-2">
                {[0, 25, 50, 75].map(pct => (
                  <button key={pct} type="button"
                    onClick={() => updateField('min_compatibility' as keyof Profile, pct as never)}
                    className={`py-2 rounded-full text-sm font-medium transition ${
                      (user.min_compatibility ?? 0) === pct ? 'bg-gray-900 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-900'
                    }`}>
                    {pct === 0 ? 'Vše' : `${pct} % +`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Premium filters */}
        {user.premium && (
          <div className="bg-pink-50 rounded-3xl p-6 shadow-sm border border-pink-200">
            <p className="text-xs font-bold text-pink-600 uppercase tracking-wide mb-4">Cosmatch+ filtry</p>
            <label className="flex items-start gap-3 cursor-pointer mb-4">
              <input type="checkbox" checked={!!(user as Profile & { filter_soul_mates_only?: boolean }).filter_soul_mates_only}
                onChange={(e) => updateField('filter_soul_mates_only' as keyof Profile, e.target.checked as never)}
                className="mt-1 w-4 h-4 rounded border-gray-300" />
              <div>
                <span className="text-sm font-medium text-gray-900 block">Jen Spřízněné duše</span>
                <p className="text-xs text-gray-500 mt-1">Zobrazí se Ti jen profily Soul Mates kategorie.</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={!!(user as Profile & { filter_mutual_only?: boolean }).filter_mutual_only}
                onChange={(e) => updateField('filter_mutual_only' as keyof Profile, e.target.checked as never)}
                className="mt-1 w-4 h-4 rounded border-gray-300" />
              <div>
                <span className="text-sm font-medium text-gray-900 block">Jen oboustranná kompatibilita ↔</span>
                <p className="text-xs text-gray-500 mt-1">Jen profily, kde jste si vzájemně kompatibilní.</p>
              </div>
            </label>
          </div>
        )}

        {/* Dealbreakers */}
        {(user.smoking === 'never' || user.alcohol === 'never' || (user as Profile & { marijuana?: string }).marijuana === 'never') && (
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <p className="eyebrow text-gray-500 mb-1">Vylučovací podmínky</p>
            <h2 className="serif text-xl text-gray-900 font-medium leading-tight mb-4">Koho nechci vidět</h2>
            <div className="space-y-3">
              {user.smoking === 'never' && (
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={!!user.smoking_dealbreaker}
                    onChange={e => updateField('smoking_dealbreaker' as keyof Profile, e.target.checked as never)}
                    className="mt-1 w-4 h-4 rounded border-gray-300" />
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">Kouření je deal-breaker</span>
                    <p className="text-xs text-gray-500 mt-1">Pravidelní kuřáci se nezobrazí. (Občasní ano.)</p>
                  </div>
                </label>
              )}
              {user.alcohol === 'never' && (
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={!!(user as Profile & { alcohol_dealbreaker?: boolean }).alcohol_dealbreaker}
                    onChange={e => updateField('alcohol_dealbreaker' as keyof Profile, e.target.checked as never)}
                    className="mt-1 w-4 h-4 rounded border-gray-300" />
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">Alkohol je deal-breaker</span>
                    <p className="text-xs text-gray-500 mt-1">Lidé pijící pravidelně se nezobrazí.</p>
                  </div>
                </label>
              )}
              {(user as Profile & { marijuana?: string }).marijuana === 'never' && (
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={!!(user as Profile & { marijuana_dealbreaker?: boolean }).marijuana_dealbreaker}
                    onChange={e => updateField('marijuana_dealbreaker' as keyof Profile, e.target.checked as never)}
                    className="mt-1 w-4 h-4 rounded border-gray-300" />
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">Marihuana je deal-breaker</span>
                    <p className="text-xs text-gray-500 mt-1">Lidé užívající pravidelně se nezobrazí.</p>
                  </div>
                </label>
              )}
            </div>
          </div>
        )}

        {/* Physical preferences */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <p className="eyebrow text-gray-500 mb-1">Fyzické preference</p>
          <h2 className="serif text-xl text-gray-900 font-medium leading-tight mb-4">Co Tě zajímá</h2>

          <p className="text-sm font-medium text-gray-900 mb-1">Výška partnera</p>
          <p className="text-xs text-gray-500 mb-3">Profily mimo rozsah se nezobrazí.</p>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div>
              <p className="text-xs text-gray-500 mb-1">od (cm)</p>
              <input type="number" min={140} max={220} placeholder="—" value={user.pref_height_min ?? ''}
                onChange={e => updateField('pref_height_min' as keyof Profile, (e.target.value ? parseInt(e.target.value) : null) as never)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">do (cm)</p>
              <input type="number" min={140} max={220} placeholder="—" value={user.pref_height_max ?? ''}
                onChange={e => updateField('pref_height_max' as keyof Profile, (e.target.value ? parseInt(e.target.value) : null) as never)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" />
            </div>
          </div>

          <p className="text-sm font-medium text-gray-900 mb-1">Postava</p>
          <p className="text-xs text-gray-500 mb-3">Nezaškrtnuté = kdokoli.</p>
          <div className="flex flex-wrap gap-2">
            {BODY_TYPES.map(bt => {
              const selected = (user.pref_body_types ?? []).includes(bt.value)
              return (
                <button key={bt.value} type="button"
                  onClick={() => {
                    const cur = user.pref_body_types ?? []
                    updateField('pref_body_types' as keyof Profile, (selected ? cur.filter(v => v !== bt.value) : [...cur, bt.value]) as never)
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    selected ? 'bg-gray-900 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-900'
                  }`}>
                  {bt.label}
                </button>
              )
            })}
          </div>

          <p className="text-xs text-gray-500 leading-relaxed mt-5 italic">
            Preference jsou filtry — nepenalizují skóre. Cosmatch nehodnotí přitažlivost.{' '}
            <Link href="/manifest-duvery" className="text-pink-500 underline">Manifest důvěry</Link>.
          </p>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-3">
          <p className="eyebrow text-gray-500 mb-2">Nastavení</p>
          <button onClick={() => setShowLogoutConfirm(true)}
            className="w-full bg-white border border-gray-200 hover:border-gray-900 text-gray-900 py-4 rounded-full text-base font-medium transition">
            Odhlásit se
          </button>
          <button onClick={() => setShowDeleteConfirm(true)}
            className="block w-full text-[11px] text-gray-400 hover:text-red-600 underline underline-offset-4 decoration-gray-300 hover:decoration-red-400 transition pt-2">
            Smazat účet
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center pt-4 pb-4">cosmatch.cz · 2026</p>
      </article>

      {/* Logout dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-6">
          <div className="bg-[#FAF6F0] rounded-3xl p-10 w-full max-w-md shadow-2xl">
            <p className="eyebrow text-pink-500 mb-4">Odhlášení</p>
            <h3 className="serif-display text-3xl text-gray-900 font-medium leading-tight mb-3">Odhlásit se?</h3>
            <p className="text-gray-600 leading-relaxed text-[1.0625rem] mb-8">Vrátíš se na přihlašovací obrazovku. Tvůj profil zůstává — můžeš se vrátit kdykoli.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 bg-white border border-gray-300 hover:border-gray-900 text-gray-900 py-4 rounded-full font-medium transition">Zůstat</button>
              <button onClick={handleLogout} className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-full font-medium transition">Odhlásit</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-6">
          <div className="bg-[#FAF6F0] rounded-3xl p-10 w-full max-w-md shadow-2xl">
            <p className="eyebrow text-red-600 mb-4">Trvalé smazání účtu</p>
            <h3 className="serif-display text-3xl text-gray-900 font-medium leading-tight mb-3">Opravdu chceš smazat svůj účet?</h3>
            <p className="text-gray-700 leading-relaxed text-[1.0625rem] mb-3">Účet bude okamžitě zneaktivněn a zmizí z aplikace.</p>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">Tvá data se trvale smažou za 30 dní. Do té doby můžeš poslat e-mail přes <Link href="/kontakt" className="font-medium text-pink-600 hover:underline">kontaktní formulář</Link> a účet obnovíme. Po 30 dnech je nevratné.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} disabled={deleting} className="flex-1 bg-white border border-gray-300 hover:border-gray-900 text-gray-900 py-4 rounded-full font-medium transition disabled:opacity-50">Zrušit</button>
              <button onClick={handleDeleteAccount} disabled={deleting} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-full font-medium transition disabled:opacity-50">{deleting ? 'Mažu…' : 'Ano, smazat'}</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav active="profile" />
    </main>
  )
}
