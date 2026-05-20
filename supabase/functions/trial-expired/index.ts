// trial-expired — odešle se ráno dne 7 (den vypršení trialu).
// Volá se z pg_cron jednou denně pro uživatele kde premium_source='trial' AND premium_until BETWEEN now() AND now()+12h.
import { sendEmail, corsHeaders } from '../_shared/resend.ts'
import { emailLayout } from '../_shared/email-layout.ts'
import { vocative } from '../_shared/czech.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders })

  try {
    const { email, name } = await req.json()
    if (!email) {
      return new Response(JSON.stringify({ error: 'Missing email' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const greeting = name ? `${vocative(name)},` : 'Ahoj,'

    const html = emailLayout({
      heading: 'Dnes ti končí trial.',
      body: `
        <p style="margin: 0 0 16px;">${greeting}</p>
        <p style="margin: 0 0 16px;">dnes večer ztratíš přístup k Cosmatch+ features. Pojďme rovnou:</p>

        <p style="margin: 24px 0 8px; font-weight: 600; color: #111827;">Co ti zůstane:</p>
        <ul style="margin: 0 0 20px; padding-left: 20px; color: #374151;">
          <li style="margin-bottom: 6px;">Tvůj profil, fotky, kvíz, archetyp</li>
          <li style="margin-bottom: 6px;">Stávající matche a všechny konverzace, které vedeš</li>
          <li style="margin-bottom: 6px;">5 lajků a 5 zpráv denně</li>
          <li style="margin-bottom: 6px;">Tvůj numerologický archetyp</li>
        </ul>

        <p style="margin: 24px 0 8px; font-weight: 600; color: #111827;">Co ztratíš:</p>
        <ul style="margin: 0 0 24px; padding-left: 20px; color: #374151;">
          <li style="margin-bottom: 6px;">Detail kompatibility (Soulmate Wheel)</li>
          <li style="margin-bottom: 6px;">Pohled na to, kdo si tě lajknul</li>
          <li style="margin-bottom: 6px;">Neomezené lajky a zprávy</li>
          <li style="margin-bottom: 6px;">Filtry vzdálenosti a záměru</li>
          <li style="margin-bottom: 6px;">Prioritní zobrazení ve feedu</li>
        </ul>

        <p style="margin: 24px 0 16px; color: #6b7280; font-size: 14px;">Nebo dnes nedělej nic — z trialu se přesuneš na free a appku používáš dál. Žádné stržení peněz se neděje, kartu jsme nikdy nepožadovali.</p>
      `,
      ctaUrl: 'https://cosmatch.cz/premium',
      ctaLabel: 'Předplatit Cosmatch+ za 249 Kč/měs',
    })

    const text = `${greeting}\n\nDnes večer ztratíš přístup k Cosmatch+ features.\n\nCo ti zůstane:\n• Tvůj profil a archetyp\n• Stávající matche a konverzace\n• 5 lajků a 5 zpráv denně\n\nCo ztratíš:\n• Detail kompatibility (Soulmate Wheel)\n• Pohled na to, kdo si tě lajknul\n• Neomezené lajky a zprávy\n• Filtry vzdálenosti a záměru\n• Prioritní zobrazení\n\nPředplatit: https://cosmatch.cz/premium\n\nNebo nedělej nic — z trialu se přesuneš na free. Kartu jsme nikdy nepožadovali.\n\ncosmatch.cz`

    const result = await sendEmail({ to: email, subject: 'Dnes ti končí trial. Co dál?', html, text })
    if (!result.ok) return new Response(JSON.stringify({ error: result.error }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    return new Response(JSON.stringify({ ok: true, id: result.id }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    console.error('trial-expired error:', e)
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
