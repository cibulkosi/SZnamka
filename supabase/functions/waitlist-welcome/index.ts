import { sendEmail, corsHeaders } from '../_shared/resend.ts'
import { emailLayout } from '../_shared/email-layout.ts'
import { vocative } from '../_shared/czech.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders })

  try {
    const { email, name, voucher_code, archetype, life_path, source } = await req.json()
    if (!email || !voucher_code) {
      return new Response(JSON.stringify({ error: 'Missing email or voucher_code' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const greeting = name ? `Ahoj ${vocative(name)},` : 'Ahoj,'
    const archetypeLine = archetype
      ? `<p style="margin: 0 0 16px;">Tvůj numerologický archetyp je <strong>${archetype}</strong>${life_path ? ` (životní číslo ${life_path})` : ''}.</p>`
      : ''

    const html = emailLayout({
      heading: 'Vítej v Cosmatch',
      body: `
        <p style="margin: 0 0 16px;">${greeting}</p>
        <p style="margin: 0 0 16px;">díky, že ses přidal/a na waitlist seznamky Cosmatch, která páruje lidi podle data narození.</p>
        ${archetypeLine}
        <p style="margin: 0 0 16px;">Tady je Tvůj voucher na tříměsíční členství zdarma na platformě Cosmatch+:</p>
        <div style="background: #FAF6F0; border: 2px dashed #ec4899; border-radius: 12px; padding: 16px 24px; margin: 0 0 24px; text-align: center; font-family: 'Courier New', monospace; font-size: 18px; font-weight: 600; color: #111827; letter-spacing: 0.08em;">${voucher_code}</div>
        <p style="margin: 0 0 16px;">Voucher uplatníš při registraci v den, kdy Cosmatch spustíme.</p>
        <p style="margin: 0 0 16px;">Protože jsi mezi prvními 1 000 členy, můžeš zároveň získat navíc <strong>odznak zakládajícího člena</strong>. Na platformě si budeš moct vybrat, jestli ho chceš mít viditelný na svém profilu, nebo ne.</p>
      `,
      ctaUrl: 'https://cosmatch.cz/manifest-duvery',
      ctaLabel: 'Přečíst Manifest důvěry',
    })

    const text = `${greeting}\n\nDíky, že ses přidal/a na waitlist seznamky Cosmatch.\n\n${archetype ? `Tvůj archetyp: ${archetype}${life_path ? ` (životní číslo ${life_path})` : ''}\n\n` : ''}Tady je Tvůj voucher na tříměsíční členství zdarma na platformě Cosmatch+:\n\n${voucher_code}\n\nVoucher uplatníš při registraci v den, kdy Cosmatch spustíme.\n\nProtože jsi mezi prvními 1 000 členy, můžeš zároveň získat navíc odznak zakládajícího člena.\n\ncosmatch.cz`

    const result = await sendEmail({ to: email, subject: 'Jsi na seznamu a tady je tvůj voucher na 3 měsíce do platformy Cosmatch+', html, text })
    if (!result.ok) return new Response(JSON.stringify({ error: result.error }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    try {
      await fetch(`${Deno.env.get('SUPABASE_URL')}/rest/v1/waitlist?email=eq.${encodeURIComponent(email)}`, {
        method: 'PATCH',
        headers: { apikey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ email_sent_at: new Date().toISOString() }),
      })
    } catch (e) { console.warn(e) }

    return new Response(JSON.stringify({ ok: true, id: result.id, source }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    console.error('waitlist-welcome error:', e)
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
