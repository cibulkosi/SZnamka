'use client'
import { useEffect, useState } from 'react'
import { createClient, type Session } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ADMIN_EMAILS = ['cibulkovasimona@gmail.com']

type RequestType =
  | 'access' | 'rectification' | 'erasure'
  | 'portability' | 'restriction' | 'objection' | 'withdraw_consent'

type Status = 'pending' | 'in_progress' | 'completed' | 'rejected'

interface DSR {
  id: string
  requester_email: string
  request_type: RequestType
  request_received_at: string
  request_body: string | null
  status: Status
  resolved_at: string | null
  resolution_note: string | null
  resolved_by: string | null
  due_at: string
}

const TYPE_LABELS: Record<RequestType, string> = {
  access: 'Přístup (čl. 15)',
  rectification: 'Oprava (čl. 16)',
  erasure: 'Výmaz (čl. 17)',
  portability: 'Přenositelnost (čl. 20)',
  restriction: 'Omezení (čl. 18)',
  objection: 'Námitka (čl. 21)',
  withdraw_consent: 'Odvolání souhlasu (čl. 7)',
}

const STATUS_COLORS: Record<Status, string> = {
  pending: 'bg-amber-100 text-amber-900 border-amber-200',
  in_progress: 'bg-blue-100 text-blue-900 border-blue-200',
  completed: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  rejected: 'bg-gray-100 text-gray-700 border-gray-200',
}

export default function GdprRequestsPage() {
  const [authState, setAuthState] = useState<
    | { kind: 'loading' }
    | { kind: 'unauth' }
    | { kind: 'denied'; email: string }
    | { kind: 'ok'; session: Session }
  >({ kind: 'loading' })

  const [requests, setRequests] = useState<DSR[]>([])
  const [loading, setLoading] = useState(true)
  const [newOpen, setNewOpen] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [newType, setNewType] = useState<RequestType>('access')
  const [newBody, setNewBody] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return setAuthState({ kind: 'unauth' })
      const email = session.user.email ?? ''
      if (!ADMIN_EMAILS.includes(email.toLowerCase())) {
        return setAuthState({ kind: 'denied', email })
      }
      setAuthState({ kind: 'ok', session })
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) return setAuthState({ kind: 'unauth' })
      const email = session.user.email ?? ''
      if (!ADMIN_EMAILS.includes(email.toLowerCase())) {
        return setAuthState({ kind: 'denied', email })
      }
      setAuthState({ kind: 'ok', session })
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (authState.kind !== 'ok') return
    loadRequests()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState.kind])

  async function loadRequests() {
    setLoading(true)
    const { data, error } = await supabase
      .from('data_subject_requests')
      .select('*')
      .order('request_received_at', { ascending: false })
      .limit(500)
    if (error) {
      console.error('Error loading DSRs:', error)
    } else {
      setRequests((data ?? []) as DSR[])
    }
    setLoading(false)
  }

  async function createRequest() {
    if (!newEmail.trim()) return alert('E-mail je povinný')
    const { error } = await supabase.from('data_subject_requests').insert({
      requester_email: newEmail.trim().toLowerCase(),
      request_type: newType,
      request_body: newBody || null,
    })
    if (error) return alert('Chyba: ' + error.message)
    setNewOpen(false); setNewEmail(''); setNewBody(''); setNewType('access')
    loadRequests()
  }

  async function updateStatus(id: string, status: Status, note?: string) {
    if (authState.kind !== 'ok') return
    const update: Partial<DSR> = { status }
    if (status === 'completed' || status === 'rejected') {
      update.resolved_at = new Date().toISOString()
      update.resolved_by = authState.session.user.email ?? null
      if (note) update.resolution_note = note
    }
    const { error } = await supabase
      .from('data_subject_requests').update(update).eq('id', id)
    if (error) return alert('Chyba: ' + error.message)
    loadRequests()
  }

  if (authState.kind === 'loading') {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Ověřuji přístup…</div>
  }
  if (authState.kind === 'unauth') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
        <p className="serif text-2xl">GDPR — Žádosti subjektů</p>
        <p className="text-gray-600">Přihlas se Google účtem v allowlistu.</p>
        <button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.href } })} className="btn-primary">Přihlásit přes Google</button>
      </div>
    )
  }
  if (authState.kind === 'denied') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="serif text-2xl">Přístup zamítnut</p>
        <p className="text-gray-600">Účet {authState.email} není v allowlistu.</p>
        <button onClick={async () => { await supabase.auth.signOut(); location.reload() }} className="btn-secondary">Odhlásit</button>
      </div>
    )
  }

  const now = Date.now()
  const overdue = requests.filter(r => r.status !== 'completed' && r.status !== 'rejected' && new Date(r.due_at).getTime() < now)
  const open = requests.filter(r => r.status === 'pending' || r.status === 'in_progress')

  return (
    <div className="min-h-screen bg-[#FAF6F0] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <p className="eyebrow">/admin · GDPR</p>
            <h1 className="serif text-3xl mt-1">Žádosti subjektů</h1>
            <p className="text-sm text-gray-600 mt-1">Audit trail podle čl. 12–22 GDPR. Limit vyřízení: 30 dní.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-sm text-gray-600 underline">← Admin</Link>
            <button onClick={() => setNewOpen(true)} className="btn-primary text-sm">Nová žádost</button>
          </div>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <p className="eyebrow">Otevřené</p><p className="serif text-3xl mt-1">{open.length}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <p className="eyebrow text-red-600">Po termínu</p><p className="serif text-3xl mt-1">{overdue.length}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <p className="eyebrow">Vyřízeno</p><p className="serif text-3xl mt-1">{requests.filter(r => r.status === 'completed').length}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <p className="eyebrow">Celkem</p><p className="serif text-3xl mt-1">{requests.length}</p>
          </div>
        </div>

        {newOpen && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
            <h2 className="serif text-xl mb-4">Nová žádost</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <input className="input" placeholder="E-mail žadatele" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
              <select className="input" value={newType} onChange={e => setNewType(e.target.value as RequestType)}>
                {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <textarea className="input mt-3 h-24" placeholder="Text žádosti (volitelné)" value={newBody} onChange={e => setNewBody(e.target.value)} />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setNewOpen(false)} className="btn-secondary text-sm">Zrušit</button>
              <button onClick={createRequest} className="btn-primary text-sm">Uložit</button>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-gray-500 text-center py-12">Načítám…</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-500 text-center py-12">Žádné GDPR žádosti zatím nebyly podány.</p>
        ) : (
          <div className="space-y-3">
            {requests.map(r => {
              const isOverdue = r.status !== 'completed' && r.status !== 'rejected' && new Date(r.due_at).getTime() < now
              const daysLeft = Math.ceil((new Date(r.due_at).getTime() - now) / 86400000)
              return (
                <div key={r.id} className={`bg-white border rounded-2xl p-5 ${isOverdue ? 'border-red-300' : 'border-gray-100'}`}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-xs px-2.5 py-1 rounded-full border ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                        <span className="text-xs text-gray-600">{TYPE_LABELS[r.request_type]}</span>
                        {isOverdue && <span className="text-xs text-red-700 font-medium">PO TERMÍNU</span>}
                      </div>
                      <p className="font-medium break-all">{r.requester_email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Přijato {new Date(r.request_received_at).toLocaleString('cs-CZ')}
                        {' · '}
                        {r.status === 'completed' ? `Vyřízeno ${r.resolved_at ? new Date(r.resolved_at).toLocaleString('cs-CZ') : ''}` :
                          isOverdue ? `Termín minul před ${-daysLeft} dny` : `Zbývá ${daysLeft} dní`}
                      </p>
                    </div>
                    {r.status !== 'completed' && r.status !== 'rejected' && (
                      <div className="flex flex-col gap-2 shrink-0">
                        {r.status === 'pending' && (
                          <button onClick={() => updateStatus(r.id, 'in_progress')} className="text-xs px-3 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-full hover:bg-blue-100">Zpracovávám</button>
                        )}
                        <button onClick={() => {
                          const note = prompt('Poznámka k vyřízení (jak jsi to vyřešila):')
                          if (note !== null) updateStatus(r.id, 'completed', note || undefined)
                        }} className="text-xs px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-full hover:bg-emerald-100">Vyřízeno</button>
                        <button onClick={() => {
                          const note = prompt('Důvod odmítnutí:')
                          if (note) updateStatus(r.id, 'rejected', note)
                        }} className="text-xs px-3 py-1 bg-gray-50 text-gray-700 border border-gray-200 rounded-full hover:bg-gray-100">Odmítnout</button>
                      </div>
                    )}
                  </div>
                  {r.request_body && (
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3 mt-2 whitespace-pre-wrap">{r.request_body}</p>
                  )}
                  {r.resolution_note && (
                    <p className="text-xs text-gray-600 mt-3 border-t border-gray-100 pt-3">
                      <span className="font-medium">Vyřešení:</span> {r.resolution_note} <span className="text-gray-400">— {r.resolved_by}</span>
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
