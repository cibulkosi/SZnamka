// trial-expired — odešle se ráno dne 7 trialu. v2 — final copy 20. 5. 2026
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
      heading: `${headingPrefix}dnes Ti končí zkušební verze Cosmatch+ zdarma.`,
      body: `
        <p style="margin: 0 0 16px;">Dnes večer ztratíš přístup k výhodám v premium členství Cosmatch+.</p>

        <p style="margin: 24px 0 8px; font-weight: 600; color: #111827;">Co ti zůstane:</p>
        <ul style="margin: 0 0 20px; padding-left: 20px; color: #374151;">
          <li style="margin-bottom: 6px;">Tvůj profil, fotky, kvíz, archetyp</li>
          <li style="margin-bottom: 6px;">Stávající matche a všechny konverzace, které vedeš</li>
          <li style="margin-bottom: 6px;">5 lajků a 5 zpráv denně</li>
          <li style="margin-bottom: 6px;">Tvůj numerologický archetyp</li>
        </ul>

        <p style="margin: 24px 0 8px; font-weight: 600; color: #111827;">Co už nebude viditelné:</p>
        <ul style="margin: 0 0 24px; padding-left: 20px; color: #374151;">
          <li style="margin-bottom: 6px;">Detail kompatibility (Soulmate Wheel)</li>
          <li style="margin-bottom: 6px;">Neuvidíš, kdo Tě lajknul</li>
          <li style="margin-bottom: 6px;">Odpadne možnost neomezených lajků a zpráv</li>
          <li style="margin-bottom: 6px;">Filtry vzdálenosti a záměru</li>
          <li style="margin-bottom: 6px;">Prioritní zobrazení ve feedu</li>
        </ul>

        <p style="margin: 24px 0 16px; color: #6b7280; font-size: 14px;">Pokud nebudeš dělat nic, tak se přesuneš do free členství a appku můžeš používat dál. Peníze se Ti žádné nestrhnou, protože kartu jsme od Tebe zatím nepožadovali.</p>
      `,
      ctaUrl: 'https://cosmatch.cz/premium',
      ctaLabel: 'Předplatit Cosmatch+ za 249 Kč/měs',
    })

    const text = `${headingPrefix}dnes Ti končí zkušební verze Cosmatch+ zdarma.\n\nDnes večer ztratíš přístup k výhodám v premium členství Cosmatch+.\n\nCo ti zůstane:\n• Tvůj profil, fotky, kvíz, archetyp\n• Stávající matche a všechny konverzace\n• 5 lajků a 5 zpráv denně\n• Tvůj numerologický archetyp\n\nCo už nebude viditelné:\n• Detail kompatibility (Soulmate Wheel)\n• Neuvidíš, kdo Tě lajknul\n• Odpadne možnost neomezených lajků a zpráv\n• Filtry vzdálenosti a záměru\n• Prioritní zobrazení ve feedu\n\nPředplatit: https://cosmatch.cz/premium\n\nPokud nebudeš dělat nic, tak se přesuneš do free členství a appku můžeš používat dál. Peníze se Ti žádné nestrhnou, protože kartu jsme od Tebe zatím nepožadovali.\n\ncosmatch.cz`

    const result = await sendEmail({ to: email, subject: 'Dnes ti končí trial zdarma. Co dál?', html, text })
    if (!result.ok) return new Response(JSON.stringify({ error: result.error }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    return new Response(JSON.stringify({ ok: true, id: result.id }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    console.error('trial-expired error:', e)
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
