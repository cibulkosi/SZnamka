'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xdotpadgbchhecwitbpe.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhkb3RwYWRnYmNoaGVjd2l0YnBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MDQzNTEsImV4cCI6MjA5MDk4MDM1MX0.1OUSDOo4cUIYuI1nwT4DTddAU9bIfJwCiDuj2ED2wS0'
)

const ADMIN_EMAILS = ['cibulkovasimona@gmail.com']

const SUBJECT_LABELS: Record<string, string> = {
  obecna: 'Obecná otázka',
  reklamace: 'Reklamace',
  gdpr: 'GDPR žádost',
  hlaseni: 'Hlášení podezřelého profilu',
  spoluprace: 'Spolupráce',
  jine: 'Jiné',
}

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  new: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  read: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  replied: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  spam: { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200' },
  archived: { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200' },
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Nová',
  read: 'Přečtená',
  replied: 'Odpovězeno',
  spam: 'Spam',
  archived: 'Archiv',
}

type Message = {
  id: string
  created_at: string
  name: string
  email: string
  subject: string
  message: string
  status: string
  replied_at: string | null
  notification_sent_at: string | null
  admin_notes: string | null
  ip_hash_short: string | null
}

type AuthState = { kind: 'loading' } | { kind: 'unauth' } | { kind: 'denied'; email: string } | { kind: 'ok'; email: string }

export default function AdminMessagesPage() {
  const [auth, setAuth] = useState<AuthState>({ kind: 'loading' })
  const [messages, setMessages] = useState<Message[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const [notesDraft, setNotesDraft] = useState<string>('')

  useEffect(() => {
    let cancelled = false
    const update = (session: { user?: { email?: string | null } } | null) => {
      if (cancelled) return
      const email = session?.user?.email?.toLowerCase()
      if (!email) { setAuth({ kind: 'unauth' }); return }
      if (ADMIN_EMAILS.includes(email)) setAuth({ kind: 'ok', email })
      else setAuth({ kind: 'denied', email })
    }
    supabase.auth.getSession().then(({ data }) => update(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => update(session))
    return () => { cancelled = true; sub.subscription.unsubscribe() }
  }, [])

  async function load() {
    setLoading(true)
    try {
      const { data, error } = await supabase.rpc('admin_list_contact_messages', {
        p_limit: 200,
        p_status: filter === 'all' ? null : filter,
      })
      if (error) { console.error(error); setMessages([]); return }
      setMessages((data || []) as Message[])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (auth.kind === 'ok') {
      load()
      const i = setInterval(load, 60_000)
      return () => clearInterval(i)
    }
  }, [auth.kind, filter])

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.rpc('admin_update_contact_message', { p_id: id, p_status: status })
    if (error) { alert('Chyba: ' + error.message); return }
    await load()
  }

  async function saveNotes(id: string) {
    const { error } = await supabase.rpc('admin_update_contact_message', { p_id: id, p_notes: notesDraft })
    if (error) { alert('Chyba: ' + error.message); return }
    setNotesDraft('')
    await load()
  }

  async function signIn() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/admin/messages` },
    })
  }

  async function signOut() {
    await supabase.auth.signOut()
    setAuth({ kind: 'unauth' })
  }

  if (auth.kind === 'loading') {
    return <main className="min-h-screen bg-[#FAF6F0] flex items-center justify-center"><p className="text-gray-500">Načítám…</p></main>
  }

  if (auth.kind === 'unauth') {
    return (
      <main className="min-h-screen bg-[#FAF6F0] flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <p className="eyebrow text-pink-500 mb-4">Admin</p>
          <h1 className="serif-display text-4xl text-gray-900 font-medium mb-6">Zprávy</h1>
          <button onClick={signIn} className="w-full bg-gray-900 text-white hover:bg-gray-800 px-8 py-4 rounded-full transition">Přihlásit přes Google</button>
        </div>
      </main>
    )
  }

  if (auth.kind === 'denied') {
    return (
      <main className="min-h-screen bg-[#FAF6F0] flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <p className="eyebrow text-red-500 mb-4">Přístup zamítnut</p>
          <p className="text-gray-700 mb-6">Účet <strong>{auth.email}</strong> nemá oprávnění.</p>
          <button onClick={signOut} className="text-pink-500 hover:underline text-sm">Odhlásit a zkusit jiný účet</button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#FAF6F0]">
      <div className="max-w-5xl mx-auto px-6 pt-6 flex items-center justify-between">
        <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900 transition">← Admin</Link>
        <button onClick={signOut} className="text-sm text-gray-500 hover:text-gray-900 transition">Odhlásit</button>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-12 pb-24">
        <header className="mb-10">
          <p className="eyebrow text-pink-500 mb-4">Zprávy z formuláře</p>
          <h1 className="serif-display text-5xl text-gray-900 font-medium tracking-tight mb-4">
            Příchozí <em className="italic text-pink-500">zprávy</em>.
          </h1>
          <hr className="rule w-12 border-gray-900 mb-4" />
          <p className="text-gray-600">Z kontaktního formuláře na <Link href="/kontakt" className="underline hover:text-gray-900">/kontakt</Link>. Notifikace chodí na ahoj@cosmatch.cz.</p>
        </header>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            ['all', 'Vše'],
            ['new', 'Nové'],
            ['read', 'Přečtené'],
            ['replied', 'Odpovězeno'],
            ['spam', 'Spam'],
            ['archived', 'Archiv'],
          ].map(([val, lbl]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`px-4 py-2 rounded-full text-sm border transition ${
                filter === val
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900'
              }`}
            >
              {lbl}
            </button>
          ))}
          <button onClick={load} className="px-4 py-2 rounded-full text-sm border bg-white text-gray-500 border-gray-200 hover:border-gray-900 hover:text-gray-900 transition ml-auto">
            {loading ? 'Načítám…' : 'Obnovit'}
          </button>
        </div>

        {messages.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-3xl p-10 text-center text-gray-500">
            {loading ? 'Načítám zprávy…' : 'Žádné zprávy v této kategorii.'}
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => {
              const isOpen = openId === m.id
              const sCol = STATUS_COLORS[m.status] || STATUS_COLORS.archived
              return (
                <div key={m.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
                  <button
                    onClick={() => {
                      const newOpen = isOpen ? null : m.id
                      setOpenId(newOpen)
                      if (newOpen) {
                        setNotesDraft(m.admin_notes || '')
                        if (m.status === 'new') setStatus(m.id, 'read')
                      }
                    }}
                    className="w-full text-left px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-gray-50 transition"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                        <span className="serif text-lg text-gray-900 font-medium">{m.name}</span>
                        <span className="text-sm text-gray-500">{m.email}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span className={`inline-block px-2 py-0.5 rounded-full font-medium ${sCol.bg} ${sCol.text} border ${sCol.border}`}>
                          {STATUS_LABELS[m.status] || m.status}
                        </span>
                        <span>·</span>
                        <span>{SUBJECT_LABELS[m.subject] || m.subject}</span>
                        <span>·</span>
                        <span className="tabular-nums">
                          {new Date(m.created_at).toLocaleString('cs-CZ', {
                            day: 'numeric',
                            month: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                    <span className="text-gray-400 text-xl flex-shrink-0">{isOpen ? '−' : '+'}</span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-gray-100 px-6 py-6 bg-gray-50 space-y-5">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Zpráva</p>
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{m.message}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                        <div>
                          <span className="uppercase tracking-wider block mb-1">Notifikace na ahoj@</span>
                          <span className={m.notification_sent_at ? 'text-emerald-700 font-medium' : 'text-amber-700 font-medium'}>
                            {m.notification_sent_at ? 'Odesláno ' + new Date(m.notification_sent_at).toLocaleString('cs-CZ', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Neodesláno'}
                          </span>
                        </div>
                        <div>
                          <span className="uppercase tracking-wider block mb-1">IP hash (24h)</span>
                          <span className="font-mono text-gray-700">{m.ip_hash_short || '—'}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Interní poznámka</p>
                        <textarea
                          value={notesDraft}
                          onChange={(e) => setNotesDraft(e.target.value)}
                          rows={3}
                          placeholder="Jen pro tebe / asistentku…"
                          className="w-full bg-white border border-gray-300 focus:border-gray-900 outline-none rounded-2xl p-3 text-sm text-gray-900"
                        />
                        <div className="flex justify-end mt-2">
                          <button onClick={() => saveNotes(m.id)} className="text-xs text-pink-600 hover:text-pink-700 font-medium">
                            Uložit poznámku
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                        <a
                          href={`mailto:${m.email}?subject=${encodeURIComponent('Re: ' + (SUBJECT_LABELS[m.subject] || m.subject))}&body=${encodeURIComponent('Ahoj ' + m.name + ',\n\n')}`}
                          className="px-4 py-2 rounded-full text-xs bg-gray-900 text-white hover:bg-gray-800 transition"
                        >
                          Odpovědět e-mailem
                        </a>
                        <button onClick={() => setStatus(m.id, 'replied')} className="px-4 py-2 rounded-full text-xs bg-white text-emerald-700 border border-emerald-200 hover:border-emerald-700 transition">
                          Označit jako odpovězené
                        </button>
                        <button onClick={() => setStatus(m.id, 'spam')} className="px-4 py-2 rounded-full text-xs bg-white text-gray-500 border border-gray-200 hover:border-gray-900 hover:text-gray-900 transition">
                          Spam
                        </button>
                        <button onClick={() => setStatus(m.id, 'archived')} className="px-4 py-2 rounded-full text-xs bg-white text-gray-500 border border-gray-200 hover:border-gray-900 hover:text-gray-900 transition">
                          Archivovat
                        </button>
                        <button onClick={() => setStatus(m.id, 'new')} className="px-4 py-2 rounded-full text-xs bg-white text-pink-600 border border-pink-200 hover:border-pink-500 transition">
                          Označit jako novou
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
