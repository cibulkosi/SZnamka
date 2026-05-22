import { sendEmail, corsHeaders } from '../_shared/resend.ts'
import { emailLayout } from '../_shared/email-layout.ts'

const SUBJECT_LABELS: Record<string, string> = {
  obecna: 'Obecná otázka',
  reklamace: 'Reklamace',
  gdpr: 'GDPR žádost',
  hlaseni: 'Hlášení podezřelého profilu',
  spoluprace: 'Spolupráce',
  jine: 'Jiné',
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = Deno.env.get('TURNSTILE_SECRET_KEY')
  if (!secret) { console.warn('TURNSTILE_SECRET_KEY not set'); return true }
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    })
    const data = await res.json()
    return !!data.success
  } catch (e) { console.error('Turnstile verify error:', e); return false }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders })

  try {
    const body = await req.json()
    const { name, email, subject, message, turnstile_token, hp_company } = body

    if (hp_company && String(hp_company).trim() !== '') {
      console.log('Honeypot triggered')
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: 'Vyplňte všechna pole.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    if (!SUBJECT_LABELS[subject]) {
      return new Response(JSON.stringify({ error: 'Neplatné téma.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return new Response(JSON.stringify({ error: 'Neplatný e-mail.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    if (name.length < 1 || name.length > 120) {
      return new Response(JSON.stringify({ error: 'Jméno musí mít 1\u2013120 znaků.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    if (message.length < 5 || message.length > 5000) {
      return new Response(JSON.stringify({ error: 'Zpráva musí mít 5\u20135000 znaků.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const ip = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (turnstile_token) {
      const valid = await verifyTurnstile(turnstile_token, ip)
      if (!valid) {
        return new Response(JSON.stringify({ error: 'Anti-bot ověření selhalo. Obnov stránku a zkus to znovu.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
    }

    const userAgent = req.headers.get('user-agent') || 'unknown'
    const ipHash = await sha256Hex(`${ip}|${new Date().toISOString().slice(0, 10)}`)

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Rate limit: max 3 zprávy z 1 IP_HASH za posledních 60 minut
    const sinceIso = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const rateRes = await fetch(`${supabaseUrl}/rest/v1/contact_messages?ip_hash=eq.${ipHash}&created_at=gte.${sinceIso}&select=id`, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` }
    })
    if (rateRes.ok) {
      const rows = await rateRes.json()
      if (Array.isArray(rows) && rows.length >= 3) {
        return new Response(JSON.stringify({ error: 'Příliš mnoho zpráv. Zkus to za hodinu.' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
    }

    const insertRes = await fetch(`${supabaseUrl}/rest/v1/contact_messages`, {
      method: 'POST',
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
      body: JSON.stringify({ name, email, subject, message, ip_hash: ipHash, user_agent: userAgent.slice(0, 500) }),
    })
    if (!insertRes.ok) {
      const err = await insertRes.text()
      console.error('INSERT failed:', err)
      return new Response(JSON.stringify({ error: 'Nepodařilo se uložit zprávu.' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    const [inserted] = await insertRes.json()
    const messageId: string = inserted?.id || ''

    const subjectLabel = SUBJECT_LABELS[subject] || subject
    const html = emailLayout({
      heading: 'Nová zpráva z kontaktního formuláře',
      body: `<p style="margin: 0 0 16px;"><strong>Téma:</strong> ${escapeHtml(subjectLabel)}</p><p style="margin: 0 0 16px;"><strong>Od:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p style="margin: 0 0 8px;"><strong>Zpráva:</strong></p><div style="background: #FAF6F0; border-radius: 12px; padding: 16px 20px; margin: 0 0 24px; white-space: pre-wrap; font-family: system-ui, sans-serif; line-height: 1.6;">${escapeHtml(message)}</div><p style="margin: 0 0 16px; font-size: 13px; color: #6b7280;">ID zprávy: ${messageId.slice(0, 8)}\u2026</p>`,
      ctaUrl: 'https://cosmatch.cz/admin',
      ctaLabel: 'Otevřít admin',
    })
    const text = `Nová zpráva z kontaktního formuláře\n\nTéma: ${subjectLabel}\nOd: ${name} <${email}>\n\nZpráva:\n${message}\n\n---\nID: ${messageId}\nAdmin: https://cosmatch.cz/admin`

    const mailResult = await sendEmail({
      to: 'ahoj@cosmatch.cz',
      replyTo: email,
      subject: `[Cosmatch] ${subjectLabel}: ${name}`,
      html,
      text,
    })

    if (mailResult.ok && messageId) {
      try {
        await fetch(`${supabaseUrl}/rest/v1/contact_messages?id=eq.${messageId}`, {
          method: 'PATCH',
          headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
          body: JSON.stringify({ notification_sent_at: new Date().toISOString() }),
        })
      } catch (e) { console.warn('update notification_sent_at:', e) }
    }

    return new Response(JSON.stringify({ ok: true, id: messageId, mail_sent: mailResult.ok }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    console.error('contact-form error:', e)
    return new Response(JSON.stringify({ error: 'Interní chyba serveru.' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
