import { sendEmail, corsHeaders } from '../_shared/resend.ts'
import { emailLayout } from '../_shared/email-layout.ts'
import { vocative } from '../_shared/czech.ts'

interface RequestBody {
  email: string
  firstName?: string
  deletionScheduledFor?: string
  reason?: 'user_request' | 'inactivity' | 'tos_violation'
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders })

  try {
    const body = await req.json() as RequestBody
    if (!body.email) return new Response(JSON.stringify({ error: 'email required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const firstName = body.firstName ?? ''
    const greeting = firstName ? `Ahoj ${vocative(firstName)},` : 'Ahoj,'

    const scheduledFor = body.deletionScheduledFor ? new Date(body.deletionScheduledFor) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    const deletionDateCz = scheduledFor.toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric' })

    const reason = body.reason ?? 'user_request'
    const reasonText = reason === 'user_request'
      ? 'Tvoje žádost o smazání účtu byla přijata.'
      : reason === 'inactivity'
      ? 'Tvůj účet byl označen ke smazání kvůli dlouhodobé neaktivitě.'
      : 'Tvůj účet byl označen ke smazání kvůli porušení podmínek.'

    const html = emailLayout({
      heading: 'Tvůj účet bude smazán',
      body: `
        <p style="margin:0 0 16px;">${greeting}</p>
        <p style="margin:0 0 16px;">${reasonText}</p>
        <p style="margin:0 0 8px;"><strong>Co bude následovat?</strong></p>
        <ul style="margin:0 0 16px;padding-left:20px;line-height:1.7;">
          <li style="margin-bottom:8px;">Tvůj profil je deaktivován a nikdo tě už neuvidí v Discover ani v matches.</li>
          <li style="margin-bottom:8px;">Máš <strong>30 dní</strong> na rozmyšlenou. Pokud si to rozmyslíš, stačí se přihlásit přes <a href="https://cosmatch.cz/login" style="color:#ec4899;">cosmatch.cz/login</a> a účet se obnoví.</li>
          <li style="margin-bottom:8px;">Po <strong>${deletionDateCz}</strong> dojde k nevratnému smazání profilu, fotek, zpráv, matches a historie plateb. Z databáze zůstanou pouze fakturační záznamy, které musíme uchovat ze zákona (10 let, §35 zákona o účetnictví).</li>
        </ul>
        <p style="margin:0 0 16px;">Mrzí nás, že odcházíš. Pokud chceš, napiš nám důvod, pomáhá nám to Cosmatch zlepšovat. Stačí odpovědět na tento e-mail.</p>
        <p style="margin:0 0 16px;">Měj se,<br>Simona<br><span style="color:#6b7280;font-size:14px;">zakladatelka Cosmatch</span></p>
        <p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #e5e7eb;font-size:13px;color:#6b7280;"><strong>GDPR poznámka:</strong> Máš právo na výpis dat (Art. 15) i v průběhu 30denní lhůty. Napiš na <a href="mailto:gdpr@cosmatch.cz" style="color:#6b7280;">gdpr@cosmatch.cz</a>.</p>
      `,
      ctaUrl: 'https://cosmatch.cz/login',
      ctaLabel: 'Obnovit účet',
    })

    const text = `${greeting}\n\n${reasonText}\n\nCo bude následovat?\n- Tvůj profil je deaktivován.\n- Máš 30 dní na rozmyšlenou. Pokud si to rozmyslíš, přihlas se přes https://cosmatch.cz/login.\n- Po ${deletionDateCz} dojde k nevratnému smazání všech dat kromě fakturačních záznamů (10 let dle §35 zákona o účetnictví).\n\nMěj se,\nSimona\nzakladatelka Cosmatch\n\n---\nGDPR: gdpr@cosmatch.cz`

    const result = await sendEmail({ to: body.email, subject: 'Tvůj účet na platformě Cosmatch bude smazán', html, text, replyTo: 'gdpr@cosmatch.cz' })
    if (!result.ok) return new Response(JSON.stringify({ error: result.error }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    return new Response(JSON.stringify({ ok: true, id: result.id }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    console.error('account-deletion-confirmation error:', e)
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
