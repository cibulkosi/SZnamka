// trial-expiring — odešle se den 5 trialu (2 dny před vypršením).
// Volá se z pg_cron / Scheduled Supabase Function jednou denně,
// pro každého uživatele kde premium_source='trial' AND premium_until BETWEEN now()+24h AND now()+48h.
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
      heading: 'Ještě 2 dny.',
      body: `
        <p style="margin: 0 0 16px;">${greeting}</p>
        <p style="margin: 0 0 16px;">před pěti dny ses připojil/a k Cosmatch a my ti dali <strong>Cosmatch+ na týden zdarma</strong> — abys měl/a šanci appku poznat naplno.</p>
        <p style="margin: 0 0 16px;"><strong>Za 2 dny ti trial končí.</strong> Potom se vrátíš na free účet a ztratíš pár věcí, které ti teď ulehčují život.</p>
        <p style="margin: 24px 0 12px; font-weight: 600;">V Cosmatch+ máš teď:</p>
        <ul style="margin: 0 0 16px; padding-left: 20px; color: #374151;">
          <li style="margin-bottom: 8px;">Vidíš detail kompatibility (Soulmate Wheel) u každého profilu, ne jen procento</li>
          <li style="margin-bottom: 8px;">Vidíš, kdo si tě lajknul, dřív než je ty</li>
          <li style="margin-bottom: 8px;">Neomezené lajky a zprávy (free má 5/den)</li>
          <li style="margin-bottom: 8px;">Pět filtrů včetně záměru a vzdálenosti</li>
          <li style="margin-bottom: 8px;">Prioritní zobrazení profilu ve feedu ostatních</li>
        </ul>
        <p style="margin: 24px 0 16px; color: #6b7280; font-size: 14px;">Nebo nedělej nic a vrať se na free účet — tvoje konverzace pokračují dál.</p>
      `,
      ctaUrl: 'https://cosmatch.cz/premium',
      ctaLabel: 'Pokračovat s Cosmatch+ za 249 Kč/měs',
    })

    const text = `${greeting}\n\nPřed pěti dny ses připojil/a k Cosmatch a my ti dali Cosmatch+ na týden zdarma.\n\nZa 2 dny ti trial končí. Potom se vrátíš na free účet.\n\nV Cosmatch+ máš teď:\n• Detail kompatibility (Soulmate Wheel)\n• Pohled na to, kdo si tě lajknul\n• Neomezené lajky a zprávy\n• Pět filtrů\n• Prioritní zobrazení\n\nPokračovat s Cosmatch+: https://cosmatch.cz/premium\n\nNebo nedělej nic — tvoje konverzace pokračují dál.\n\ncosmatch.cz`

    const result = await sendEmail({ to: email, subject: 'Za 2 dny ti končí Cosmatch+ trial', html, text })
    if (!result.ok) return new Response(JSON.stringify({ error: result.error }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    return new Response(JSON.stringify({ ok: true, id: result.id }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    console.error('trial-expiring error:', e)
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
