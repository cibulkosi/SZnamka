import { sendEmail, corsHeaders } from '../_shared/resend.ts'
import { emailLayout } from '../_shared/email-layout.ts'
import { vocative } from '../_shared/czech.ts'

const PLAN_NAMES: Record<string, string> = { monthly: 'Cosmatch+ měsíčně', quarterly: 'Cosmatch+ kvartálně', yearly: 'Cosmatch+ ročně' }
const PLAN_DAYS: Record<string, number> = { monthly: 30, quarterly: 90, yearly: 365 }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders })

  try {
    const { user_id, plan, amount_czk, invoice_url, invoice_number } = await req.json()
    if (!user_id || !plan || amount_czk == null) return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 })

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const headers = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` }

    const profRes = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${user_id}&select=name,email`, { headers })
    const profs = await profRes.json()
    if (!profs?.[0]) return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
    const user = profs[0]

    const planName = PLAN_NAMES[plan] ?? `Cosmatch+ ${plan}`
    const days = PLAN_DAYS[plan] ?? 30
    const validUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toLocaleDateString('cs-CZ')

    const invoiceLabel = invoice_number ? `Stáhnout fakturu ${invoice_number} (PDF)` : 'Stáhnout fakturu (PDF)'
    const invoiceLine = invoice_url
      ? `<p style="margin:0 0 16px;"><a href="${invoice_url}" style="color:#ec4899;">${invoiceLabel}</a></p>`
      : ''

    const html = emailLayout({
      heading: 'Platba potvrzena.',
      body: `<p style="margin:0 0 16px;">Ahoj ${vocative(user.name)},</p><p style="margin:0 0 16px;">přijali jsme tvou platbu. Cosmatch+ je teď aktivní.</p><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:16px 0;background:#FAF6F0;border-radius:12px;padding:16px 24px;"><tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Plán</td><td style="padding:8px 0;text-align:right;font-weight:600;">${planName}</td></tr><tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Cena</td><td style="padding:8px 0;text-align:right;font-weight:600;">${amount_czk} Kč</td></tr><tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Platnost do</td><td style="padding:8px 0;text-align:right;font-weight:600;">${validUntil}</td></tr>${invoice_number ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:14px;">Faktura č.</td><td style="padding:8px 0;text-align:right;font-weight:600;">${invoice_number}</td></tr>` : ''}</table>${invoiceLine}<p style="margin:0 0 16px;font-size:14px;color:#6b7280;">Předplatné se automaticky obnovuje. Můžeš ho kdykoli zrušit v profilu bez sankce.</p>`,
      ctaUrl: 'https://cosmatch.cz/profile',
      ctaLabel: 'Otevřít profil',
    })
    const text = `Ahoj ${vocative(user.name)},\n\nPřijali jsme tvou platbu. Cosmatch+ je teď aktivní.\n\nPlán: ${planName}\nCena: ${amount_czk} Kč\nPlatnost do: ${validUntil}\n${invoice_number ? `Faktura č.: ${invoice_number}\n` : ''}\n${invoice_url ? `Faktura: ${invoice_url}\n\n` : ''}Předplatné se automaticky obnovuje. Můžeš ho kdykoli zrušit v profilu bez sankce.`

    const r = await sendEmail({ to: user.email, subject: `Cosmatch+ aktivován — ${planName}`, html, text })

    try {
      await fetch(`${supabaseUrl}/rest/v1/email_log`, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify({ to_user: user_id, kind: 'payment', sent_ok: r.ok, resend_id: r.id }) })
    } catch (e) { console.warn(e) }

    return new Response(JSON.stringify({ ok: r.ok, id: r.id }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    console.error('payment-confirmation error:', e)
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
