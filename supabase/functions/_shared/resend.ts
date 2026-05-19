// Shared Resend helper for all Cosmatch transactional emails

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const RESEND_FROM = Deno.env.get('RESEND_FROM') ?? 'Cosmatch <ahoj@cosmatch.cz>'

export type SendEmailParams = {
  to: string
  subject: string
  html: string
  text?: string
  replyTo?: string
}

export async function sendEmail({ to, subject, html, text, replyTo }: SendEmailParams) {
  if (!RESEND_API_KEY) return { ok: false, error: 'RESEND_API_KEY missing' }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: RESEND_FROM,
        to,
        subject,
        html,
        text,
        reply_to: replyTo ?? 'ahoj@cosmatch.cz',
      }),
    })
    if (!res.ok) return { ok: false, error: await res.text() }
    const data = await res.json()
    return { ok: true, id: data.id }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
