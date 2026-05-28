'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ADMIN_EMAILS = ['cibulkovasimona@gmail.com']

const POSES_LABELS: Record<string, string> = {
  thumb_up: '👍 Palec nahoru',
  open_palm: '✋ Otevřená dlaň',
  peace_sign: '✌️ Vítězství',
  finger_to_nose: '👉 Prst na nos',
  hand_on_cheek: '🤲 Ruka na tváři',
}

type VerifRow = {
  id: string
  user_id: string
  status: 'pending' | 'verified' | 'rejected'
  required_pose: string
  selfie_url: string | null
  submitted_at: string
  rejection_reason: string | null
  profile: {
    id: string
    name: string | null
    email: string | null
    photos: string[] | null
  } | null
}

export default function AdminVerifikace() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [rows, setRows] = useState<VerifRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'pending' | 'verified' | 'rejected' | 'all'>('pending')
  const [rejectDialog, setRejectDialog] = useState<{ id: string; reason: string } | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user || !ADMIN_EMAILS.includes(data.user.email || '')) {
        setAuthed(false); return
      }
      setAuthed(true)
      await loadRows(filter)
      setLoading(false)
    })
  }, [])

  async function loadRows(f: typeof filter) {
    setLoading(true)
    let q = supabase.from('profile_verifications')
      .select('id,user_id,status,required_pose,selfie_url,submitted_at,rejection_reason')
      .order('submitted_at', { ascending: false })
      .limit(100)
    if (f !== 'all') q = q.eq('status', f)

    const { data: verifs } = await q
    if (!verifs) { setRows([]); setLoading(false); return }

    // Fetch profile details for each
    const userIds = verifs.map(v => v.user_id)
    const { data: profs } = await supabase.from('profiles')
      .select('id,name,email,photos').in('id', userIds)

    const profMap = new Map(profs?.map(p => [p.id, p]) ?? [])
    const enriched = verifs.map(v => ({ ...v, profile: profMap.get(v.user_id) ?? null })) as VerifRow[]
    setRows(enriched)
    setLoading(false)
  }

  async function approve(id: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('profile_verifications')
      .update({ status: 'verified', reviewed_at: new Date().toISOString(), reviewed_by: user.id })
      .eq('id', id)
    if (error) alert('Chyba: ' + error.message)
    else loadRows(filter)
  }

  async function reject(id: string, reason: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('profile_verifications')
      .update({ status: 'rejected', reviewed_at: new Date().toISOString(), reviewed_by: user.id, rejection_reason: reason })
      .eq('id', id)
    if (error) alert('Chyba: ' + error.message)
    else { setRejectDialog(null); loadRows(filter) }
  }

  if (authed === null) return <main className="min-h-screen bg-[#F0EBE3] flex items-center justify-center"><p className="text-gray-400 text-sm">Načítám…</p></main>
  if (authed === false) return <main className="min-h-screen bg-[#F0EBE3] flex items-center justify-center"><p className="text-gray-400 text-sm">Není povoleno.</p></main>

  return (
    <main className="min-h-screen bg-[#F0EBE3] pb-24">
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900 transition">← Admin</Link>
        <h1 className="serif-display text-3xl mt-4 mb-6">Verifikace profilů</h1>

        <div className="flex gap-2 mb-8">
          {([['pending','Čeká'],['verified','Ověřeno'],['rejected','Zamítnuto'],['all','Vše']] as const).map(([f, label]) => (
            <button key={f} onClick={() => { setFilter(f); loadRows(f) }}
              className={`text-xs px-4 py-2 rounded-full font-medium transition ${
                filter === f ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {loading ? <p className="text-gray-400 text-sm">Načítám…</p> :
          rows.length === 0 ? <p className="text-gray-400 text-sm">Nic tu není.</p> :
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rows.map(v => {
              const submittedDate = new Date(v.submitted_at).toLocaleString('cs-CZ', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })
              return (
                <div key={v.id} className="bg-white rounded-3xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs eyebrow text-pink-500 mb-1">{POSES_LABELS[v.required_pose] || v.required_pose}</p>
                      <h3 className="font-medium text-gray-900">{v.profile?.name || 'Neznámé jméno'}</h3>
                      <p className="text-xs text-gray-500">{v.profile?.email}</p>
                      <p className="text-xs text-gray-500 mt-1">{submittedDate}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                      v.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      v.status === 'verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>{v.status.toUpperCase()}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Verifikační selfie</p>
                      {v.selfie_url
                        ? <img src={v.selfie_url} alt="Selfie" className="w-full aspect-square object-cover rounded-2xl" />
                        : <div className="w-full aspect-square bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-xs">Bez fotky</div>}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Profilová fotka</p>
                      {v.profile?.photos?.[0]
                        ? <img src={v.profile.photos[0]} alt="Profil" className="w-full aspect-square object-cover rounded-2xl" />
                        : <div className="w-full aspect-square bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-xs">Bez fotky</div>}
                    </div>
                  </div>

                  {v.rejection_reason && (
                    <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-2xl px-3 py-2 mb-4">
                      Důvod zamítnutí: {v.rejection_reason}
                    </p>
                  )}

                  {v.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => approve(v.id)} className="flex-1 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition">
                        ✓ Schválit
                      </button>
                      <button onClick={() => setRejectDialog({ id: v.id, reason: '' })} className="flex-1 py-2.5 rounded-full bg-white text-gray-900 border border-gray-300 text-sm font-medium hover:border-gray-900 transition">
                        ✗ Zamítnout
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        }
      </div>

      {rejectDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Důvod zamítnutí</h3>
            <textarea
              value={rejectDialog.reason}
              onChange={e => setRejectDialog({ ...rejectDialog, reason: e.target.value })}
              placeholder="Např. 'Póza neodpovídá zadání' nebo 'Selfie nepasuje na profilovou fotku'"
              className="w-full p-3 border border-gray-300 rounded-2xl text-sm h-24 mb-4 focus:outline-none focus:border-pink-500"
            />
            <div className="flex gap-2">
              <button onClick={() => setRejectDialog(null)} className="flex-1 py-2.5 rounded-full bg-white text-gray-900 border border-gray-300 text-sm font-medium">Zrušit</button>
              <button onClick={() => reject(rejectDialog.id, rejectDialog.reason)} disabled={!rejectDialog.reason.trim()} className="flex-1 py-2.5 rounded-full bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 transition disabled:opacity-50">Zamítnout</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
