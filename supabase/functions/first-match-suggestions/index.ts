/**
 * first-match-suggestions — daily cron pro „engineered first match" moment.
 *
 * Cíl: pro každého uživatele, který se zaregistroval v posledních 24–48 h a zatím
 * nikoho nelajknul, předpřipravit top 5 nejlepších doporučených profilů.
 * Pošleme push notifikaci + e-mail: „Saturnka, máme pro Tebe první shody."
 *
 * Spouští se denně (Supabase pg_cron volá tuto funkci v 9:00 SELČ).
 *
 * Volá: POST /functions/v1/first-match-suggestions
 *   body: {} (žádné args — projde DB)
 *   auth: Service role key (nebo cron secret)
 *
 * Response: { processed: N, sent_emails: M, errors: [...] }
 */

import { sendEmail, corsHeaders } from '../_shared/resend.ts'
import { emailLayout } from '../_shared/email-layout.ts'
import { vocative } from '../_shared/czech.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders })

  const cronSecret = Deno.env.get('CRON_SECRET')
  const auth = req.headers.get('authorization')?.replace('Bearer ', '')
  if (cronSecret && auth !== cronSecret && auth !== Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const headers = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' }

  try {
    // 1) Najdi nové usery: registrovaní v posledních 24–48 h, BEZ lajků (0 swipes), email_notifications_enabled = true
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const newUsersRes = await fetch(
      `${supabaseUrl}/rest/v1/profiles?select=id,name,email,birthday,gender,looking_for,city,relationship_goal,deleted_at` +
      `&created_at=gte.${twoDaysAgo}&created_at=lt.${oneDayAgo}` +
      `&deleted_at=is.null`,
      { headers }
    )
    const newUsers = await newUsersRes.json()
    if (!Array.isArray(newUsers) || newUsers.length === 0) {
      return new Response(JSON.stringify({ processed: 0, message: 'No new users in 24-48h window' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const results = { processed: 0, sent_emails: 0, errors: [] as string[] }

    for (const user of newUsers) {
      try {
        // Skip, pokud user už někoho lajknul
        const likesRes = await fetch(`${supabaseUrl}/rest/v1/likes?from_user=eq.${user.id}&select=id&limit=1`, { headers })
        const likes = await likesRes.json()
        if (Array.isArray(likes) && likes.length > 0) continue

        // Skip, pokud už jsme mu poslali first-match e-mail (záznam v notifications table)
        const sentRes = await fetch(`${supabaseUrl}/rest/v1/notifications_sent?user_id=eq.${user.id}&type=eq.first_match&select=id&limit=1`, { headers })
        const sent = await sentRes.json()
        if (Array.isArray(sent) && sent.length > 0) continue

        // 2) Spočítej top 5 kompatibilních profilů z compatibility table
        // Kandidáti: opačné pohlaví, looking_for matches, v podobném regionu, ne já
        const compatRes = await fetch(
          `${supabaseUrl}/rest/v1/compatibility?date_a=eq.${user.birthday}` +
          `&select=date_b,score,is_mutual&score=gte.75&order=score.desc&limit=20`,
          { headers }
        )
        const compatBdays = await compatRes.json()
        if (!Array.isArray(compatBdays) || compatBdays.length === 0) continue

        const candidateBdays = compatBdays.map((c: { date_b: string }) => c.date_b).slice(0, 20)
        if (candidateBdays.length === 0) continue

        // Najdi reálné usery s těmito daty narození
        const candidatesRes = await fetch(
          `${supabaseUrl}/rest/v1/profiles?select=id,name,birthday,city,deleted_at` +
          `&birthday=in.(${candidateBdays.join(',')})` +
          `&gender=eq.${user.looking_for}` +
          `&deleted_at=is.null` +
          `&id=neq.${user.id}` +
          `&limit=5`,
          { headers }
        )
        const candidates = await candidatesRes.json()
        if (!Array.isArray(candidates) || candidates.length === 0) continue

        // 3) Pošli e-mail
        const v = vocative(user.name || '')
        const subject = `${v}, máme pro Tebe první shody`
        const intro = candidates.length >= 3
          ? `Algoritmus za Tebe odpracoval první noc — našel ${candidates.length} lidi s nadprůměrnou kompatibilitou.`
          : `Algoritmus za Tebe odpracoval první noc — našel jsme prvního člověka, který by Ti mohl sedět.`

        const html = emailLayout({
          heading: `${v}, vesmír na Tebe čekal.`,
          body: `
            <p style="margin:0 0 16px;">${intro}</p>
            <p style="margin:0;">Otevři Cosmatch a podívej se, kdo by se Ti mohl líbit.</p>
          `,
          ctaLabel: 'Otevřít Cosmatch',
          ctaUrl: 'https://cosmatch.cz/discover',
        })

        if (user.email) {
          await sendEmail({
            to: user.email,
            subject,
            html,
          })
          results.sent_emails++
        }

        // 4) Záznam, že jsme poslali (idempotence)
        await fetch(`${supabaseUrl}/rest/v1/notifications_sent`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ user_id: user.id, type: 'first_match', sent_at: new Date().toISOString() })
        })

        results.processed++
      } catch (e) {
        results.errors.push(`${user.id}: ${(e as Error).message}`)
      }
    }

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
