'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, loadCurrentProfile, type Profile } from '@/lib/supabase'
import { haptic } from '@/lib/haptic'

const SUPABASE_FUNCTIONS_URL = 'https://xdotpadgbchhecwitbpe.supabase.co/functions/v1'

// Pózy — náhodně vybereme jednu, aby nešlo poslat stejnou fotku pro každého
const POSES = [
  { id: 'thumb_up', label: 'Palec nahoru', emoji: '👍', hint: 'Pravou ruku zdvihněte tak, aby palec směřoval vzhůru, a vyfoťte si selfie.' },
  { id: 'open_palm', label: 'Otevřená dlaň', emoji: '✋', hint: 'Levou nebo pravou dlaň zdvihněte vedle obličeje (jako pozdrav) a usmějte se.' },
  { id: 'peace_sign', label: 'Vítězství', emoji: '✌️', hint: 'Ukažte „V" prsty (ukazovák + prostředníček) vedle ucha.' },
  { id: 'finger_to_nose', label: 'Prst na špičce nosu', emoji: '👉', hint: 'Dotkněte se špičky nosu ukazováčkem, ať vidíme tu interakci na fotce.' },
  { id: 'hand_on_cheek', label: 'Ruka na tváři', emoji: '🤲', hint: 'Položte si jednu dlaň na tvář, jako v zamyšlení.' },
]

type VerifStatus = 'none' | 'pending' | 'verified' | 'rejected'

export default function VerifikaceFlowPage() {
  const router = useRouter()
  const [user, setUser] = useState<Profile | null>(null)
  const [status, setStatus] = useState<VerifStatus>('none')
  const [rejectionReason, setRejectionReason] = useState<string | null>(null)
  const [pose, setPose] = useState<typeof POSES[number] | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    (async () => {
      const u = await loadCurrentProfile()
      if (!u) { router.push('/login'); return }
      setUser(u)

      const { data: verif } = await supabase.from('profile_verifications')
        .select('status,required_pose,rejection_reason').eq('user_id', u.id).maybeSingle()

      if (verif) {
        setStatus(verif.status as VerifStatus)
        setRejectionReason(verif.rejection_reason)
        const matching = POSES.find(p => p.id === verif.required_pose)
        if (matching) setPose(matching)
      } else {
        // Nová verifikace — náhodně vybereme pózu
        setPose(POSES[Math.floor(Math.random() * POSES.length)])
      }
    })()
  }, [router])

  async function handleUpload(file: File) {
    if (!user || !pose) return
    if (!file.type.startsWith('image/')) { setError('Pošli prosím obrázek.'); haptic.error(); return }
    if (file.size > 8 * 1024 * 1024) { setError('Maximální velikost 8 MB.'); haptic.error(); return }

    setUploading(true); setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('userId', `verification/${user.id}`)  // Použijeme prefix v R2 path místo separátního purpose

      const r = await fetch(`${SUPABASE_FUNCTIONS_URL}/upload-photo`, {
        method: 'POST',
        body: fd,
      })
      if (!r.ok) throw new Error(await r.text() || 'Upload selhal.')
      const { url } = await r.json()

      // Smaž starou pending/rejected verifikaci (RLS umožňuje)
      await supabase.from('profile_verifications').delete().eq('user_id', user.id).in('status', ['pending', 'rejected'])

      const { error: insertErr } = await supabase.from('profile_verifications').insert({
        user_id: user.id,
        required_pose: pose.id,
        selfie_url: url,
        status: 'pending',
      })
      if (insertErr) throw insertErr

      haptic.success()
      setStatus('pending')
    } catch (e) {
      haptic.error()
      setError(e instanceof Error ? e.message : 'Chyba při uploadu.')
    } finally {
      setUploading(false)
    }
  }

  if (!user) return (
    <main id="main" className="min-h-screen bg-[#F0EBE3] flex items-center justify-center">
      <p className="text-gray-400 text-sm">Načítám…</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#F0EBE3] pb-24">
      <div className="max-w-xl mx-auto px-6 pt-6">
        <Link href="/profile" className="text-sm text-gray-500 hover:text-gray-900 transition">← Profil</Link>
      </div>

      <article className="max-w-xl mx-auto px-6 pt-10">
        <p className="eyebrow text-pink-500 mb-4">Verifikace</p>
        <h1 className="serif-display text-4xl text-gray-900 font-medium leading-[1.1] tracking-tight mb-6">
          Modrá fajfka na <em className="italic text-pink-500">Tvém profilu</em>.
        </h1>
        <hr className="rule w-12 border-gray-900 mb-8" />

        {status === 'verified' && (
          <div className="bg-white rounded-3xl p-6 border border-emerald-200">
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.91 4.09 7 4l-.09 2.91L4 9l2.09 2.91L4 14l2.91 1.09L9 18l2.91-.09L12 20l2.09-2.09L17 18l.09-2.91L20 14l-1.91-2.91L20 9l-2.91-1.09L17 4l-2.91.09L12 2zm-1.5 13.5l-3-3 1.41-1.41 1.59 1.59 4.59-4.59L17 9l-6 6.5z"/></svg>
              <h2 className="text-xl font-medium text-gray-900">Tvůj profil je ověřený</h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-sm">
              Lidé v Cosmatchi teď u Tvého jména vidí modrou fajfku. Znamená to, že jsi reálná osoba — nikoli bot ani fake účet.
            </p>
          </div>
        )}

        {status === 'pending' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200">
            <p className="eyebrow text-amber-500 mb-3">Čeká na ověření</p>
            <h2 className="text-xl font-medium text-gray-900 mb-3">Selfie nahráno. Schválení do 24 h.</h2>
            <p className="text-gray-700 leading-relaxed text-sm">
              Ručně se podíváme, jestli pózu na fotce odpovídá té zadané, a porovnáme s Tvým profilovým obrázkem. Než to dokončíme, profil zůstává plně funkční.
            </p>
          </div>
        )}

        {status === 'rejected' && (
          <div className="bg-white rounded-3xl p-6 border border-rose-200 mb-6">
            <p className="eyebrow text-rose-500 mb-3">Zamítnuto</p>
            <h2 className="text-xl font-medium text-gray-900 mb-3">Selfie neprošlo</h2>
            <p className="text-gray-700 leading-relaxed text-sm mb-2">
              {rejectionReason || 'Fotka neodpovídala zadané póze nebo nepasovala na tvé profilové foto.'}
            </p>
            <p className="text-gray-500 text-sm">Zkus to znovu — vyber jinou pózu níže.</p>
          </div>
        )}

        {(status === 'none' || status === 'rejected') && pose && (
          <>
            <div className="bg-white rounded-3xl p-6 mb-6">
              <p className="text-sm text-gray-500 mb-3">Pro Tebe je vybraná póza:</p>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-6xl">{pose.emoji}</span>
                <div>
                  <h3 className="text-2xl font-medium text-gray-900">{pose.label}</h3>
                  <p className="text-gray-500 text-sm mt-1">Každý dostane jinou — nejde tedy poslat fotku někoho jiného.</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm">{pose.hint}</p>
            </div>

            {error && <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-2xl px-4 py-2 mb-4">{error}</p>}

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="user"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f) }}
            />

            <button
              onClick={() => { haptic.medium(); fileRef.current?.click() }}
              disabled={uploading}
              className="w-full bg-gray-900 text-white py-5 rounded-full text-base font-medium hover:bg-gray-800 transition disabled:opacity-50"
            >
              {uploading ? 'Nahrávám…' : 'Vyfotit selfie a poslat'}
            </button>

            <p className="text-xs text-gray-500 mt-4 leading-relaxed text-center">
              Selfie je vidět jen pro náš ověřovací tým. Po schválení ho mažeme do 30 dní. Nikomu jinému se nezobrazí.
            </p>
          </>
        )}

        <hr className="rule mt-12 mb-6 border-gray-300" />
        <p className="text-xs text-gray-500 leading-relaxed">
          <strong>Proč verifikace?</strong> Česká republika je 6. nejzranitelnější země vůči romance scams. Modrá fajfka ukazuje, že jsi reálný člověk — ne bot, ne ukradené fotky, ne podvodník.
        </p>
      </article>
    </main>
  )
}
