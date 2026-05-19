import { sendEmail, corsHeaders } from '../_shared/resend.ts'
import { emailLayout } from '../_shared/email-layout.ts'
import { vocative, sSe, past } from '../_shared/czech.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders })

  try {
    const { match_id } = await req.json()
    if (!match_id) return new Response(JSON.stringify({ error: 'Missing match_id' }), { status: 400 })

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const headers = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` }

    const matchRes = await fetch(`${supabaseUrl}/rest/v1/matches?id=eq.${match_id}&select=*`, { headers })
    const matchData = await matchRes.json()
    if (!matchData?.[0]) return new Response(JSON.stringify({ error: 'Match not found' }), { status: 404 })
    const match = matchData[0]

    const userIds = [match.user_a, match.user_b]
    const profsRes = await fetch(`${supabaseUrl}/rest/v1/profiles?id=in.(${userIds.join(',')})&select=id,name,email,gender,deleted_at`, { headers })
    const profiles = await profsRes.json()
    if (!profiles || profiles.length !== 2) return new Response(JSON.stringify({ error: 'Profiles not found' }), { status: 404 })

    const results: Array<{ to: string; ok: boolean; id?: string }> = []
    for (const u of profiles) {
      if (u.deleted_at) continue
      const partner = profiles.find((p: { id: string }) => p.id !== u.id)
      if (!partner) continue

      const readVerb = past('četl', u.gender)

      const html = emailLayout({
        heading: 'Máš novou shodu!',
        body: `<p style="margin:0 0 16px;">Ahoj ${vocative(u.name)},</p><p style="margin:0 0 16px;">Máte vzájemný kosmický match ${sSe(partner.name)}! A to znamená, že vám Cosmatch otevřel chat.</p><p style="margin:0 0 16px;">Statistika ze seznamovacích aplikací říká, že čím dřív druhé osobě napíšeš první zprávu, tím je vyšší šance na reálné setkání.</p><p style="margin:0 0 16px;color:#6b7280;font-style:italic;">„První zpráva ti nemusí zabrat víc než minutu. Stačí jedna otázka, která ukáže, že jsi profil dané osoby opravdu ${readVerb}."</p>`,
        ctaUrl: 'https://cosmatch.cz/matches',
        ctaLabel: 'Otevřít chat',
      })
      const text = `Ahoj ${vocative(u.name)},\n\nMáte vzájemný kosmický match ${sSe(partner.name)}! A to znamená, že vám Cosmatch otevřel chat.\n\nOtevři chat: https://cosmatch.cz/matches`

      const r = await sendEmail({ to: u.email, subject: 'Máš novou shodu. Napiš jako první.', html, text })
      results.push({ to: u.email, ok: r.ok, id: r.id })

      try {
        await fetch(`${supabaseUrl}/rest/v1/email_log`, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify({ to_user: u.id, kind: 'match', match_id: match.id, sent_ok: r.ok, resend_id: r.id }) })
      } catch (e) { console.warn('email_log insert failed:', e) }
    }

    return new Response(JSON.stringify({ ok: true, sent: results }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    console.error('match-notification error:', e)
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
