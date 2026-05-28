'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { EmptyChats } from '@/components/EmptyStates'
import Link from 'next/link'
import { supabase, loadCurrentProfile, type Profile } from '@/lib/supabase'

type Conversation = {
  match_id: string
  partner: Profile
  last_message: {
    id: string
    sender_id: string
    content: string
    created_at: string
    read: boolean
  } | null
  matched_at: string
  last_activity_at: string
  unread_count: number
}

function formatRelativeCs(iso: string): string {
  const now = Date.now()
  const t = new Date(iso).getTime()
  const diff = (now - t) / 1000
  if (diff < 60) return 'právě teď'
  if (diff < 3600) return `${Math.floor(diff/60)} m`
  if (diff < 86400) return `${Math.floor(diff/3600)} h`
  if (diff < 604800) return `${Math.floor(diff/86400)} d`
  return new Date(iso).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short' })
}

export default function ChatListPage() {
  const router = useRouter()
  const [me, setMe] = useState<Profile | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const r = await loadCurrentProfile()
      if (r.kind !== 'ok') { router.push('/login'); return }
      setMe(r.profile)

      // Load conversations via view + join partner profiles
      const { data: convs } = await supabase.from('chat_conversations')
        .select('*')
        .or(`user_a.eq.${r.profile.id},user_b.eq.${r.profile.id}`)
        .order('last_activity_at', { ascending: false })

      if (!convs) { setLoading(false); return }

      const partnerIds = convs.map(c => c.user_a === r.profile.id ? c.user_b : c.user_a)
      const { data: partners } = await supabase.from('profiles')
        .select('id,name,birthday,photos,is_verified,verified')
        .in('id', partnerIds)

      const partnerMap = new Map(partners?.map(p => [p.id, p]) ?? [])
      const enriched = convs.map(c => ({
        match_id: c.match_id,
        partner: partnerMap.get(c.user_a === r.profile.id ? c.user_b : c.user_a) as Profile,
        last_message: c.last_message,
        matched_at: c.matched_at,
        last_activity_at: c.last_activity_at,
        unread_count: c.unread_count ?? 0,
      })).filter(c => c.partner)

      setConversations(enriched)
      setLoading(false)
    })()

    // Realtime: nové zprávy → reload list
    const channel = supabase.channel('chat-list-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        // jednoduchá strategie — full reload (může se vylepšit)
        loadCurrentProfile().then(r => {
          if (r.kind !== 'ok') return
          supabase.from('chat_conversations').select('*')
            .or(`user_a.eq.${r.profile.id},user_b.eq.${r.profile.id}`)
            .order('last_activity_at', { ascending: false }).then(({ data: convs }) => {
              if (!convs) return
              const partnerIds = convs.map(c => c.user_a === r.profile.id ? c.user_b : c.user_a)
              supabase.from('profiles').select('id,name,birthday,photos,is_verified,verified').in('id', partnerIds).then(({ data: partners }) => {
                const partnerMap = new Map(partners?.map(p => [p.id, p]) ?? [])
                setConversations(convs.map(c => ({
                  match_id: c.match_id,
                  partner: partnerMap.get(c.user_a === r.profile.id ? c.user_b : c.user_a) as Profile,
                  last_message: c.last_message,
                  matched_at: c.matched_at,
                  last_activity_at: c.last_activity_at,
                  unread_count: c.unread_count ?? 0,
                })).filter(c => c.partner))
              })
            })
        })
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [router])

  if (loading) return (
    <main id="main" className="min-h-screen bg-[#F0EBE3] pb-24">
      <div className="max-w-2xl mx-auto px-6 pt-6">
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse mb-8" />
        <div className="space-y-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-3xl p-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )

  return (
    <main id="main" className="min-h-screen bg-[#F0EBE3] pb-24">
      <div className="max-w-2xl mx-auto px-6 pt-6">
        <Link href="/discover" className="text-sm text-gray-500 hover:text-gray-900 transition">← Objevuj</Link>

        <header className="mt-8 mb-8">
          <p className="eyebrow text-pink-500 mb-2">Konverzace</p>
          <h1 className="serif-display text-4xl text-gray-900 font-medium leading-tight tracking-tight">
            Zprávy
          </h1>
          <hr className="rule w-12 border-gray-900 mt-6" />
        </header>

        {conversations.length === 0 ? <EmptyChats /> : (
          <ul className="space-y-2">
            {conversations.map(c => {
              const photo = c.partner.photos?.[0]
              const firstName = c.partner.name?.split(' ')[0] || 'Profil'
              const lastMsgFromMe = c.last_message?.sender_id === me?.id
              const preview = c.last_message
                ? `${lastMsgFromMe ? 'Ty: ' : ''}${c.last_message.content.slice(0, 60)}${c.last_message.content.length > 60 ? '…' : ''}`
                : 'Napiš první zprávu'
              const time = c.last_message ? formatRelativeCs(c.last_message.created_at) : formatRelativeCs(c.matched_at)
              const isUnread = c.unread_count > 0
              return (
                <li key={c.match_id}>
                  <Link
                    href={`/chat/thread?id=${c.match_id}`}
                    className="flex items-center gap-4 bg-white rounded-2xl p-4 hover:shadow-md transition"
                  >
                    {photo ? (
                      <img src={photo} alt={firstName}
                        className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-medium text-pink-700">{firstName[0]}</span>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className={`text-base ${isUnread ? 'font-semibold text-gray-900' : 'text-gray-800'} truncate`}>
                          {firstName}
                          {(c.partner.is_verified || c.partner.verified) && (
                            <svg className="inline-block w-4 h-4 ml-1 -mt-0.5" viewBox="0 0 24 24" fill="#3b82f6">
                              <path d="M12 2L9.91 4.09 7 4l-.09 2.91L4 9l2.09 2.91L4 14l2.91 1.09L9 18l2.91-.09L12 20l2.09-2.09L17 18l.09-2.91L20 14l-1.91-2.91L20 9l-2.91-1.09L17 4l-2.91.09L12 2z"/>
                              <path d="M10.5 14.5l-3-3 1.4-1.4 1.6 1.6 4.6-4.6 1.4 1.4-6 6z" fill="#fff"/>
                            </svg>
                          )}
                        </p>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{time}</span>
                      </div>
                      <p className={`text-sm truncate ${isUnread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                        {preview}
                      </p>
                    </div>

                    {isUnread && (
                      <span className="ml-1 min-w-[20px] h-5 px-1.5 rounded-full bg-pink-500 text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
                        {c.unread_count > 9 ? '9+' : c.unread_count}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </main>
  )
}
