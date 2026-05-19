import { sendEmail, corsHeaders } from '../_shared/resend.ts'
import { emailLayout } from '../_shared/email-layout.ts'
import { vocative, past } from '../_shared/czech.ts'

const RATE_LIMIT_MINUTES = 5

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders })

  try {
    const { message_id } = await req.json()
    if (!message_id) return new Response(JSON.stringify({ error: 'Missing message_id' }), { status: 400 })

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const headers = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` }

    const msgRes = await fetch(`${supabaseUrl}/rest/v1/messages?id=eq.${message_id}&select=*`, { headers })
    const msgData = await msgRes.json()
    if (!msgData?.[0]) return new Response(JSON.stringify({ error: 'Message not found' }), { status: 404 })
    const msg = msgData[0]

    const matchRes = await fetch(`${supabaseUrl}/rest/v1/matches?id=eq.${msg.match_id}&select=user_a,user_b`, { headers })
    const matches = await matchRes.json()
    if (!matches?.[0]) return new Response(JSON.stringify({ error: 'Match not found' }), { status: 404 })
    const match = matches[0]
    const recipientId = msg.sender_id === match.user_a ? match.user_b : match.user_a

    const since = new Date(Date.now() - RATE_LIMIT_MINUTES * 60 * 1000).toISOString()
    const logRes = await fetch(`${supabaseUrl}/rest/v1/email_log?to_user=eq.${recipientId}&kind=eq.message&match_id=eq.${msg.match_id}&created_at=gte.${since}&select=id&limit=1`, { headers })
    const logs = await logRes.json()
    if (Array.isArray(logs) && logs.length > 0) {
      return new Response(JSON.stringify({ ok: true, skipped: 'rate_limited' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const profsRes = await fetch(`${supabaseUrl}/rest/v1/profiles?id=in.(${recipientId},${msg.sender_id})&select=id,name,email,gender,deleted_at`, { headers })
    const profiles = await profsRes.json()
    const recipient = profiles.find((p: { id: string }) => p.id === recipientId)
    const sender = profiles.find((p: { id: string }) => p.id === msg.sender_id)
    if (!recipient || !sender || recipient.deleted_at) return new Response(JSON.stringify({ ok: true, skipped: 'profile_missing' }), { status: 200 })

    const preview = (msg.content as string).slice(0, 120) + ((msg.content as string).length > 120 ? '…' : '')
    const wrote = past('napsal', sender.gender)

    const html = emailLayout({
      heading: `${sender.name} ti ${wrote}.`,
      body: `<p style="margin:0 0 16px;">Ahoj ${vocative(recipient.name)},</p><p style="margin:0 0 16px;">${sender.name} ti právě ${wrote}:</p><blockquote style="margin:16px 0;padding:16px 24px;border-left:3px solid #ec4899;background:#FAF6F0;font-style:italic;color:#374151;">${preview}</blockquote>`,
      ctaUrl: 'https://cosmatch.cz/matches',
      ctaLabel: 'Otevřít chat',
    })
    const text = `Ahoj ${vocative(recipient.name)},\n\n${sender.name} ti právě ${wrote}:\n\n"${preview}"\n\nOtevři chat: https://cosmatch.cz/matches`

    const r = await sendEmail({ to: recipient.email, subject: `${sender.name} ti ${wrote}`, html, text })

    await fetch(`${supabaseUrl}/rest/v1/email_log`, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify({ to_user: recipientId, kind: 'message', match_id: msg.match_id, sent_ok: r.ok, resend_id: r.id }) })

    return new Response(JSON.stringify({ ok: r.ok, id: r.id }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    console.error('message-notification error:', e)
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
