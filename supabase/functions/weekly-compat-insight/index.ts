// weekly-compat-insight v6: používá Crawford boolean flags místo legacy score sloupce
import { sendEmail, corsHeaders } from '../_shared/resend.ts'
import { emailLayout } from '../_shared/email-layout.ts'
import { vocative } from '../_shared/czech.ts'

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
        const recentRes = await fetch(
          `${supabaseUrl}/rest/v1/notifications_sent?user_id=eq.${user.id}&type=eq.weekly_compat&sent_at=gte.${sixDaysAgo}&select=id&limit=1`,
          { headers }
        )
        const recent = await recentRes.json()
        if (Array.isArray(recent) && recent.length > 0) { results.skipped_recent++; continue }

        // Crawford booleans: Soul Mates NEBO Love & Friendship = quality match
        const compatRes = await fetch(
          `${supabaseUrl}/rest/v1/compatibility?date_a=eq.${user.birthday}` +
          `&select=date_b,soul_mates,love_friendship,fatal_attraction&or=(soul_mates.eq.true,love_friendship.eq.true)` +
          `&limit=100`,
          { headers }
        )
        const compatBdays = await compatRes.json()
        if (!Array.isArray(compatBdays) || compatBdays.length === 0) continue

        const scoreMap = new Map<string, number>()
        for (const c of compatBdays) {
          const s = c.soul_mates ? 100 : (c.love_friendship ? 95 : 85)
          scoreMap.set(c.date_b, s)
        }
        const candidateBdays = Array.from(scoreMap.keys())

        const candidatesRes = await fetch(
          `${supabaseUrl}/rest/v1/profiles?select=id,name,city,birthday` +
          `&birthday=in.(${candidateBdays.join(',')})` +
          `&gender=eq.${user.looking_for}&deleted_at=is.null&id=neq.${user.id}&limit=30`,
          { headers }
        )
        const candidates = await candidatesRes.json()
        if (!Array.isArray(candidates) || candidates.length === 0) continue

        const candIds = candidates.map((c: { id: string }) => c.id)
        const likesRes = await fetch(
          `${supabaseUrl}/rest/v1/likes?from_user=eq.${user.id}&to_user=in.(${candIds.join(',')})&select=to_user`,
          { headers }
        )
        const likedIds = new Set(((await likesRes.json()) as { to_user: string }[]).map(l => l.to_user))

        const fresh = candidates.filter((c: { id: string }) => !likedIds.has(c.id))
        if (fresh.length < MIN_MATCHES) continue

        const enriched = fresh.map((c: { id: string, birthday: string, name: string | null, city: string | null }) => ({
          ...c, score: scoreMap.get(c.birthday) || 50
        })).sort((a, b) => b.score - a.score).slice(0, 5)

        const topScore = enriched[0].score
        const count = enriched.length
        const topLabel = topScore === 100 ? 'Spřízněná duše' : topScore === 95 ? 'Láska a přátelství' : 'Magnetická tenze'

        const v = vocative(user.name || '')
        const subject = count >= 5
          ? `${v}, máš ${count} kompatibilních lidí (nejvýš ${topLabel})`
          : `${v}, koukněme na ${count} nových kompatibilních lidí`

        const html = emailLayout({
          heading: `${v}, vesmír za Tebe pracoval`,
          body: `
            <p style="margin:0 0 16px;">Algoritmus tento týden našel <strong>${count} ${count === 2 ? 'lidi' : count >= 5 ? 'lidí' : 'lidi'}</strong> s nadprůměrnou kompatibilitou — nejvyšší je <strong>${topLabel}</strong> (${topScore} %).</p>
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
              metadata: { count, top_score: topScore, top_label: topLabel } })
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
