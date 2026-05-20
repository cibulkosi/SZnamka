// trial-expiring — odešle se den 5 trialu (2 dny před vypršením). v3 — final copy 20. 5. 2026
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

    const voc = name ? vocative(name) : ''
    const headingPrefix = voc ? `${voc}, ` : ''

    const html = emailLayout({
      heading: `${headingPrefix}v Cosmatch+ Ti zbývají ještě 2 dny.`,
      body: `
        <p style="margin: 0 0 16px;">Před pěti dny ses připojil/a ke Cosmatch, měl/a možnost si vyzkoušet <strong>Cosmatch+ na týden zdarma</strong>, a poznat tak appku naplno.</p>
        <p style="margin: 0 0 16px;"><strong>Za 2 dny Ti trial končí.</strong> Potom se vrátíš na free účet a přijdeš v appce o pár věcí.</p>
        <p style="margin: 24px 0 12px; font-weight: 600;">V Cosmatch+ teď:</p>
        <ul style="margin: 0 0 16px; padding-left: 20px; color: #374151;">
          <li style="margin-bottom: 8px;">vidíš detail kompatibility (Soulmate Wheel) u každého profilu, ne jen procento</li>
          <li style="margin-bottom: 8px;">vidíš, kdo si tě lajknul</li>
          <li style="margin-bottom: 8px;">máš neomezené lajky a zprávy (free účet má limit 5 denně)</li>
          <li style="margin-bottom: 8px;">máš na výběr pět filtrů včetně záměru a vzdálenosti</li>
          <li style="margin-bottom: 8px;">máš častější zobrazení tvého profilu ve feedu ostatních</li>
        </ul>
        <p style="margin: 24px 0 16px; color: #6b7280; font-size: 14px;">Pokud neuděláš nic, bude Tvůj profil automaticky downgradován na free účet. Tvoje konverzace pokračují dál.</p>
      `,
      ctaUrl: 'https://cosmatch.cz/premium',
      ctaLabel: 'Pokračovat s Cosmatch+ za 249 Kč/měs',
    })

    const text = `${headingPrefix}v Cosmatch+ Ti zbývají ještě 2 dny.\n\nPřed pěti dny ses připojil/a ke Cosmatch, měl/a možnost si vyzkoušet Cosmatch+ na týden zdarma, a poznat tak appku naplno.\n\nZa 2 dny Ti trial končí. Potom se vrátíš na free účet.\n\nV Cosmatch+ teď:\n• detail kompatibility (Soulmate Wheel) u každého profilu\n• vidíš, kdo si tě lajknul\n• neomezené lajky a zprávy (free účet má limit 5 denně)\n• na výběr pět filtrů včetně záměru a vzdálenosti\n• častější zobrazení tvého profilu ve feedu\n\nPokračovat s Cosmatch+: https://cosmatch.cz/premium\n\nPokud neuděláš nic, bude Tvůj profil automaticky downgradován na free účet. Tvoje konverzace pokračují dál.\n\ncosmatch.cz`

    const result = await sendEmail({ to: email, subject: 'Za 2 dny ti končí Cosmatch+ trial', html, text })
    if (!result.ok) return new Response(JSON.stringify({ error: result.error }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    return new Response(JSON.stringify({ ok: true, id: result.id }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    console.error('trial-expiring error:', e)
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
