'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase, loadCurrentProfile, type Profile } from '@/lib/supabase'
import { haptic } from '@/lib/haptic'

type Message = {
  id: string
  match_id: string
  sender_id: string
  content: string
  created_at: string
  read: boolean
}

const SUPABASE_FUNCTIONS_URL = 'https://xdotpadgbchhecwitbpe.supabase.co/functions/v1'

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })
}

function formatDay(iso: string): string {
  const d = new Date(iso)
  const today = new Date()
  if (d.toDateString() === today.toDateString()) return 'Dnes'
  const yest = new Date(today.getTime() - 86400000)
  if (d.toDateString() === yest.toDateString()) return 'Včera'
  return d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long' })
}

export default function ChatThreadPage() {
  const params = useParams<{ matchId: string }>()
  const router = useRouter()
  const matchId = params.matchId

  const [me, setMe] = useState<Profile | null>(null)
  const [partner, setPartner] = useState<Profile | null>(null)
  const [compatScore, setCompatScore] = useState<number | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [aiSuggestions, setAiSuggestions] = useState<string[] | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom helper
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    (async () => {
      const r = await loadCurrentProfile()
      if (r.kind !== 'ok') { router.push('/login'); return }
      setMe(r.profile)

      // Načti match → najdi partner ID
      const { data: match } = await supabase.from('matches')
        .select('id, user_a, user_b').eq('id', matchId).maybeSingle()
      if (!match) { router.push('/chat'); return }
      const partnerId = match.user_a === r.profile.id ? match.user_b : match.user_a

      // Načti partnera
      const { data: p } = await supabase.from('profiles')
        .select('*').eq('id', partnerId).maybeSingle()
      if (!p) { router.push('/chat'); return }
      setPartner(p as Profile)

      // Compatibility — fetch from compatibility table (precomputed)
      try {
        const { data: c } = await supabase.from('compatibility')
          .select('score').eq('date_a', r.profile.birthday).eq('date_b', p.birthday).maybeSingle()
        if (c?.score) setCompatScore(c.score)
      } catch {}

      // Načti messages
      const { data: msgs } = await supabase.from('messages')
        .select('*').eq('match_id', matchId).order('created_at', { ascending: true })
      setMessages((msgs ?? []) as Message[])
      setLoading(false)

      // Mark unread incoming messages as read
      const unreadIncoming = (msgs ?? []).filter(m => m.sender_id !== r.profile.id && !m.read)
      if (unreadIncoming.length > 0) {
        await supabase.from('messages').update({ read: true })
          .in('id', unreadIncoming.map(m => m.id))
      }

      // Realtime subscription
      const channel = supabase.channel(`chat-${matchId}`)
        .on('postgres_changes', {
          event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${matchId}`
        }, (payload) => {
          const newMsg = payload.new as Message
          setMessages(prev => prev.some(m => m.id === newMsg.id) ? prev : [...prev, newMsg])
          if (newMsg.sender_id !== r.profile.id) {
            haptic.light()
            // Mark as read immediately (since we're viewing it)
            supabase.from('messages').update({ read: true }).eq('id', newMsg.id).then(() => {})
          }
          setTimeout(scrollToBottom, 50)
        })
        .subscribe()

      // Initial scroll
      setTimeout(scrollToBottom, 100)

      return () => { supabase.removeChannel(channel) }
    })()
  }, [matchId, router, scrollToBottom])

  async function sendMessage() {
    if (!me || !draft.trim() || sending) return
    const content = draft.trim().slice(0, 2000)
    setSending(true)
    haptic.medium()

    // Optimistic insert
    const tempId = `temp-${Date.now()}`
    const optimistic: Message = {
      id: tempId, match_id: matchId, sender_id: me.id, content, created_at: new Date().toISOString(), read: false
    }
    setMessages(prev => [...prev, optimistic])
    setDraft('')
    setTimeout(scrollToBottom, 50)

    const { data: inserted, error } = await supabase.from('messages')
      .insert({ match_id: matchId, sender_id: me.id, content })
      .select().single()

    if (error) {
      haptic.error()
      // Rollback
      setMessages(prev => prev.filter(m => m.id !== tempId))
      setDraft(content)
      console.error('Send failed:', error)
    } else {
      // Replace optimistic with real
      setMessages(prev => prev.map(m => m.id === tempId ? (inserted as Message) : m))
      // Notification (fire-and-forget)
      fetch(`${SUPABASE_FUNCTIONS_URL}/message-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message_id: inserted.id })
      }).catch(() => {})
    }
    setSending(false)
  }

  async function getAiSuggestions() {
    if (!partner) return
    setAiLoading(true)
    haptic.light()
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const r = await fetch(`${SUPABASE_FUNCTIONS_URL}/ai-convo-starter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({
          target_profile: {
            name: partner.name, bio: partner.bio, philosophy: partner.philosophy,
            prompts: partner.prompts, hobbies: partner.hobbies,
            occupation: partner.occupation, city: partner.city,
          },
          compat_score: compatScore,
          my_name: me?.name,
        })
      })
      if (r.ok) {
        const data = await r.json()
        setAiSuggestions(data.suggestions || [])
      }
    } catch (e) { console.error(e) }
    finally { setAiLoading(false) }
  }

  if (loading || !me || !partner) return (
    <main id="main" className="min-h-screen bg-[#F0EBE3] flex items-center justify-center">
      <p className="text-gray-500 text-sm">Načítám konverzaci…</p>
    </main>
  )

  const firstName = partner.name?.split(' ')[0] || 'Profil'
  const photo = partner.photos?.[0]
  const noMessages = messages.length === 0

  return (
    <main id="main" className="min-h-screen bg-[#F0EBE3] flex flex-col" style={{ height: '100dvh' }}>
      {/* Header */}
      <header className="flex-shrink-0 bg-[#F0EBE3]/95 backdrop-blur border-b border-gray-200/60 px-4 py-3 z-30">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => { haptic.light(); router.push('/chat') }}
            className="text-gray-500 hover:text-gray-900 transition p-1" aria-label="Zpět">
            ←
          </button>
          {photo ? (
            <img src={photo} alt={firstName} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
              <span className="text-sm font-medium text-pink-700">{firstName[0]}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">
              {firstName}
              {(partner.is_verified || partner.verified) && (
                <svg className="inline-block w-4 h-4 ml-1 -mt-0.5" viewBox="0 0 24 24" fill="#3b82f6">
                  <path d="M12 2L9.91 4.09 7 4l-.09 2.91L4 9l2.09 2.91L4 14l2.91 1.09L9 18l2.91-.09L12 20l2.09-2.09L17 18l.09-2.91L20 14l-1.91-2.91L20 9l-2.91-1.09L17 4l-2.91.09L12 2z"/>
                  <path d="M10.5 14.5l-3-3 1.4-1.4 1.6 1.6 4.6-4.6 1.4 1.4-6 6z" fill="#fff"/>
                </svg>
              )}
            </p>
            {compatScore && <p className="text-xs text-pink-500">{compatScore} % kompatibilita</p>}
          </div>
        </div>
      </header>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-2">
          {noMessages ? (
            <div className="text-center py-12">
              <p className="text-5xl mb-4">💌</p>
              <h2 className="serif text-2xl text-gray-900 mb-2">Pošli první zprávu</h2>
              <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto mb-6">
                Vy si vzájemně kompatibilní {compatScore ? `na ${compatScore} %` : ''}. Napiš {firstName} něco konkrétního z {firstName === 'jeho' ? 'jeho' : 'jejího'} profilu — vždy to funguje líp než „Ahoj, jak se máš?".
              </p>
              <button onClick={getAiSuggestions} disabled={aiLoading}
                className="inline-flex items-center gap-2 bg-white border border-gray-300 hover:border-gray-900 text-gray-900 py-2.5 px-5 rounded-full text-sm font-medium transition disabled:opacity-50">
                💡 {aiLoading ? 'Vymýšlím…' : 'Navrhni zprávu'}
              </button>
            </div>
          ) : (
            messages.map((msg, i) => {
              const isMe = msg.sender_id === me.id
              const prev = messages[i - 1]
              const showDay = !prev || new Date(prev.created_at).toDateString() !== new Date(msg.created_at).toDateString()
              return (
                <div key={msg.id}>
                  {showDay && (
                    <div className="text-center my-4">
                      <span className="text-xs text-gray-500 bg-[#F0EBE3] px-3 py-1 rounded-full">
                        {formatDay(msg.created_at)}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                      isMe ? 'bg-pink-500 text-white rounded-br-sm' : 'bg-white text-gray-900 rounded-bl-sm'
                    }`}>
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${isMe ? 'text-pink-100' : 'text-gray-500'}`}>
                        {formatTime(msg.created_at)}
                        {isMe && msg.read && <span className="ml-1">· přečteno</span>}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* AI suggestions banner */}
      {aiSuggestions && aiSuggestions.length > 0 && (
        <div className="flex-shrink-0 px-4 pb-2">
          <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-pink-500 font-medium">💡 Návrhy zpráv</p>
              <button onClick={() => setAiSuggestions(null)}
                className="text-xs text-gray-500 hover:text-gray-900" aria-label="Zavřít návrhy">×</button>
            </div>
            <div className="space-y-1.5">
              {aiSuggestions.map((s, i) => (
                <button key={i} onClick={() => { setDraft(s); setAiSuggestions(null); haptic.light() }}
                  className="block w-full text-left px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-sm text-gray-800 transition">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Compose */}
      <div className="flex-shrink-0 bg-[#F0EBE3]/95 backdrop-blur border-t border-gray-200/60 px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)]">
        <div className="max-w-2xl mx-auto flex items-end gap-2">
          {!aiSuggestions && (
            <button onClick={getAiSuggestions} disabled={aiLoading}
              className="flex-shrink-0 w-11 h-11 rounded-full bg-white border border-gray-200 hover:border-gray-900 flex items-center justify-center text-lg transition disabled:opacity-50"
              aria-label="AI návrhy zpráv">
              💡
            </button>
          )}
          <textarea
            value={draft} onChange={(e) => setDraft(e.target.value.slice(0, 2000))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
            }}
            placeholder={`Napiš ${firstName}…`}
            rows={1}
            className="flex-1 resize-none px-4 py-2.5 rounded-3xl bg-white border border-gray-200 focus:border-gray-900 focus:outline-none text-[15px] leading-relaxed max-h-32"
            style={{ minHeight: '44px' }}
          />
          <button onClick={sendMessage} disabled={sending || !draft.trim()}
            className="flex-shrink-0 w-11 h-11 rounded-full bg-pink-500 text-white flex items-center justify-center hover:bg-pink-600 transition disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Odeslat zprávu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
          </button>
        </div>
      </div>
    </main>
  )
}
