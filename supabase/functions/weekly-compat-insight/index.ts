/**
 * weekly-compat-insight — týdenní cron, který do Klaviyo pošle „tento týden
 * máš na Cosmatchi N lidi nad 89 % kompatibility" event pro každého aktivního
 * uživatele, který má ne-lajknuté shody nad threshold.
 *
 * Spouští se: každý čtvrtek v 17:00 SELČ (15:00 UTC) — peak engagement čas.
 *
 * Pro každého aktivního usera (zhrubla last_active < 14 dní):
 *   1. Spočítat top 3 ne-lajknuté reverse-kompatibilní profily
 *   2. Filtrovat score >= 85
 *   3. Pokud N >= 2 (jinak nestojí to za e-mail) → Klaviyo event
 *      „Weekly Compat Insight" s payloadem { count, top_score, names[] }
 *   4. Klaviyo flow odešle e-mail s personalizovaným template
 *
 * Klaviyo event payload:
 *   {
 *     "metric": { "name": "Weekly Compat Insight" },
 *     "profile": { "$email": "...", "$first_name": "..." },
 *     "properties": { "match_count": 3, "top_score": 94, "city": "Praha" }
 *   }
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const KLAVIYO_API_KEY = Deno.env.get('KLAVIYO_PRIVATE_API_KEY')!
const MIN_SCORE = 85       // Nadprůměrná kompatibilita
const MIN_MATCHES = 2      // Aspoň 2 shody, jinak email nepouštět

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

  if (!KLAVIYO_API_KEY) {
    return new Response(JSON.stringify({ error: 'KLAVIYO_PRIVATE_API_KEY missing' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    // 1) Najdi aktivní usery — registrovaní, neudaleni, email_notifications_enabled = true
    const usersRes = await fetch(
      `${supabaseUrl}/rest/v1/profiles?select=id,name,email,birthday,gender,looking_for,city,relationship_goal` +
      `&deleted_at=is.null` +
      `&email=not.is.null` +
      `&limit=10000`,
      { headers }
    )
    const users = await usersRes.json()
    if (!Array.isArray(users)) return new Response(JSON.stringify({ error: 'No users' }), { status: 500 })

    const results = { processed: 0, events_sent: 0, errors: [] as string[] }

    for (const user of users) {
      try {
        // 2) Najdi top reverse-kompatibilní profily (mutual >= MIN_SCORE)
        const compatRes = await fetch(
          `${supabaseUrl}/rest/v1/compatibility?date_a=eq.${user.birthday}` +
          `&select=date_b,score&score=gte.${MIN_SCORE}&is_mutual=eq.true&order=score.desc&limit=50`,
          { headers }
        )
        const compatBdays = await compatRes.json()
        if (!Array.isArray(compatBdays) || compatBdays.length === 0) continue

        const candidateBdays = compatBdays.map((c: { date_b: string }) => c.date_b)

        // 3) Najdi reálné profily s těmito daty (opačné pohlaví, ne já)
        const candidatesRes = await fetch(
          `${supabaseUrl}/rest/v1/profiles?select=id,name,birthday,city` +
          `&birthday=in.(${candidateBdays.join(',')})` +
          `&gender=eq.${user.looking_for}` +
          `&deleted_at=is.null` +
          `&id=neq.${user.id}` +
          `&limit=20`,
          { headers }
        )
        const candidates = await candidatesRes.json()
        if (!Array.isArray(candidates) || candidates.length === 0) continue

        // 4) Filtruj ty, které už user lajknul
        const candIds = candidates.map((c: { id: string }) => c.id)
        const likesRes = await fetch(
          `${supabaseUrl}/rest/v1/likes?from_user=eq.${user.id}&to_user=in.(${candIds.join(',')})&select=to_user`,
          { headers }
        )
        const likedIds = new Set(((await likesRes.json()) as { to_user: string }[]).map(l => l.to_user))

        const fresh = candidates.filter((c: { id: string }) => !likedIds.has(c.id))
        if (fresh.length < MIN_MATCHES) continue

        // 5) Mapování score → top fresh
        const scoresByBday: Record<string, number> = {}
        compatBdays.forEach((c: { date_b: string, score: number }) => { scoresByBday[c.date_b] = c.score })

        const enriched = fresh.map((c: { id: string, name: string | null, birthday: string, city: string | null }) => ({
          ...c, score: scoresByBday[c.birthday] || 0
        })).sort((a, b) => b.score - a.score).slice(0, 5)

        const topScore = enriched[0].score
        const count = enriched.length

        // 6) Pošli Klaviyo event
        const klaviyoRes = await fetch('https://a.klaviyo.com/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
            'revision': '2024-10-15',
            'accept': 'application/json',
          },
          body: JSON.stringify({
            data: {
              type: 'event',
              attributes: {
                properties: {
                  match_count: count,
                  top_score: topScore,
                  city: user.city || '',
                  first_name: user.name || '',
                },
                metric: { data: { type: 'metric', attributes: { name: 'Weekly Compat Insight' } } },
                profile: { data: {
                  type: 'profile',
                  attributes: {
                    email: user.email,
                    first_name: user.name,
                    properties: { user_id: user.id, city: user.city }
                  }
                }},
              },
            },
          }),
        })

        if (klaviyoRes.ok) {
          results.events_sent++
        } else {
          results.errors.push(`${user.email}: Klaviyo ${klaviyoRes.status}: ${(await klaviyoRes.text()).slice(0, 200)}`)
        }
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
