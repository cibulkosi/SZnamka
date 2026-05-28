/**
 * weekly-compat-insight — týdenní cron, který přes Resend pošle „tento týden
 * máš na Cosmatchi N lidi nad 85 % kompatibility" e-mail aktivním uživatelům.
 *
 * Spouští se: každý čtvrtek 17:00 SELČ (15:00 UTC) — peak engagement.
 *
 * Pro každého aktivního usera (deleted_at IS NULL):
 *   1. Spočítat top mutual-kompatibilní profily (≥ 85 %)
 *   2. Filtrovat ty, které už user lajknul (jen čerstvé)
 *   3. Pokud N ≥ MIN_MATCHES → Resend e-mail
 *   4. Idempotence přes notifications_sent (typ 'weekly_compat')
 */

import { sendEmail, corsHeaders } from '../_shared/resend.ts'
import { emailLayout } from '../_shared/email-layout.ts'
import { vocative } from '../_shared/czech.ts'

const MIN_SCORE = 85
const MIN_MATCHES = 2

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

  // Idempotence: stejnému uživateli neposílat víc než 1× za 6 dní (cron je 1×/týden,
  // ale pojistka pro případ manuálního re-runu)
  const sixDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()

  try {
    const usersRes = await fetch(
      `${supabaseUrl}/rest/v1/profiles?select=id,name,email,birthday,gender,looking_for,city` +
      `&deleted_at=is.null&email=not.is.null&limit=10000`,
      { headers }
    )
    const users = await usersRes.json()
    if (!Array.isArray(users)) {
      return new Response(JSON.stringify({ error: 'No users' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const results = { processed: 0, sent_emails: 0, skipped_recent: 0, errors: [] as string[] }

    for (const user of users) {
      try {
        // Skip pokud jsme nedávno poslali
        const recentRes = await fetch(
          `${supabaseUrl}/rest/v1/notifications_sent?user_id=eq.${user.id}&type=eq.weekly_compat&sent_at=gte.${sixDaysAgo}&select=id&limit=1`,
          { headers }
        )
        const recent = await recentRes.json()
        if (Array.isArray(recent) && recent.length > 0) { results.skipped_recent++; continue }

        // Top mutual kompatibility ≥ MIN_SCORE
        const compatRes = await fetch(
          `${supabaseUrl}/rest/v1/compatibility?date_a=eq.${user.birthday}` +
          `&select=date_b,score&score=gte.${MIN_SCORE}&is_mutual=eq.true&order=score.desc&limit=50`,
          { headers }
        )
        const compatBdays = await compatRes.json()
        if (!Array.isArray(compatBdays) || compatBdays.length === 0) continue

        const candidateBdays = compatBdays.map((c: { date_b: string }) => c.date_b)

        // Reálné profily, opačné pohlaví
        const candidatesRes = await fetch(
          `${supabaseUrl}/rest/v1/profiles?select=id,name,city,birthday` +
          `&birthday=in.(${candidateBdays.join(',')})` +
          `&gender=eq.${user.looking_for}&deleted_at=is.null&id=neq.${user.id}&limit=30`,
          { headers }
        )
        const candidates = await candidatesRes.json()
        if (!Array.isArray(candidates) || candidates.length === 0) continue

        // Odfiltrovat ty, které už user lajknul
        const candIds = candidates.map((c: { id: string }) => c.id)
        const likesRes = await fetch(
          `${supabaseUrl}/rest/v1/likes?from_user=eq.${user.id}&to_user=in.(${candIds.join(',')})&select=to_user`,
          { headers }
        )
        const likedIds = new Set(((await likesRes.json()) as { to_user: string }[]).map(l => l.to_user))

        const fresh = candidates.filter((c: { id: string }) => !likedIds.has(c.id))
        if (fresh.length < MIN_MATCHES) continue

        // Mapování score → fresh
        const scoresByBday: Record<string, number> = {}
        compatBdays.forEach((c: { date_b: string, score: number }) => { scoresByBday[c.date_b] = c.score })

        const enriched = fresh.map((c: { id: string, birthday: string, name: string | null, city: string | null }) => ({
          ...c, score: scoresByBday[c.birthday] || 0
        })).sort((a, b) => b.score - a.score).slice(0, 5)

        const topScore = enriched[0].score
        const count = enriched.length

        // Resend email
        const v = vocative(user.name || '')
        const subject = `${v}, tento týden ${count} ${count === 2 ? 'lidi' : count >= 5 ? 'lidí' : 'lidi'} nad ${topScore} %`

        const html = emailLayout({
          heading: `${v}, vesmír za Tebe pracoval`,
          body: `
            <p style="margin:0 0 16px;">Algoritmus tento týden našel <strong>${count} lidi</strong>, se kterými máš nadprůměrnou kompatibilitu — nejvyšší <strong>${topScore} %</strong>.</p>
            <p style="margin:0;">Otevři Cosmatch a podívej se. Tihle nikam neuteknou, ale čekání je horší společník.</p>
          `,
          ctaLabel: 'Otevřít shody',
          ctaUrl: 'https://cosmatch.cz/discover',
        })

        const sendRes = await sendEmail({ to: user.email, subject, html })
        if (sendRes.ok) {
          results.sent_emails++
          await fetch(`${supabaseUrl}/rest/v1/notifications_sent`, {
            method: 'POST', headers,
            body: JSON.stringify({ user_id: user.id, type: 'weekly_compat', sent_at: new Date().toISOString(),
              metadata: { count, top_score: topScore } })
          })
        } else {
          results.errors.push(`${user.email}: ${sendRes.error}`)
        }
        results.processed++

      } catch (e) {
        results.errors.push(`${user.id}: ${(e as Error).message}`)
      }
    }

    return new Response(JSON.stringify(results), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
