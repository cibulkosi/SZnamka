// trial-email-runner — dávkový processor trial e-mailů.
// Volán denně z pg_cron v 09:00 UTC. Najde uživatele v okně den-5 a den-7,
// pro každého zavolá odpovídající Edge Function (trial-expiring/trial-expired)
// a zaznamená timestamp (idempotency).
//
// Authorization: vyžaduje 'Bearer <TRIAL_RUNNER_SECRET>' header.

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const RUNNER_SECRET = Deno.env.get('TRIAL_RUNNER_SECRET')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

type TrialUser = {
  id: string
  email: string | null
  name: string | null
  premium_until: string
}

async function dbFetch(path: string, init?: RequestInit) {
  return await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
  })
}

async function invokeFn(fnName: string, payload: Record<string, unknown>) {
  return await fetch(`${SUPABASE_URL}/functions/v1/${fnName}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
    body: JSON.stringify(payload),
  })
}

async function processBatch(
  selectFilter: string,
  markColumn: 'trial_email_day5_sent_at' | 'trial_email_day7_sent_at',
  fnName: 'trial-expiring' | 'trial-expired',
) {
  const sent: string[] = []
  const failed: { id: string; reason: string }[] = []

  const listRes = await dbFetch(`profiles?select=id,email,name,premium_until&${selectFilter}&limit=500`)
  if (!listRes.ok) return { sent, failed: [{ id: 'query', reason: await listRes.text() }] }
  const users: TrialUser[] = await listRes.json()

  for (const u of users) {
    if (!u.email) { failed.push({ id: u.id, reason: 'no_email' }); continue }
    try {
      const r = await invokeFn(fnName, { email: u.email, name: u.name })
      if (!r.ok) { failed.push({ id: u.id, reason: `fn_${r.status}: ${await r.text()}` }); continue }
      const upd = await dbFetch(`profiles?id=eq.${u.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ [markColumn]: new Date().toISOString() }),
      })
      if (!upd.ok) { failed.push({ id: u.id, reason: `mark_${upd.status}: ${await upd.text()}` }); continue }
      sent.push(u.id)
    } catch (e) {
      failed.push({ id: u.id, reason: String(e) })
    }
  }
  return { sent, failed }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const auth = req.headers.get('Authorization') || ''
  if (auth !== `Bearer ${RUNNER_SECRET}`) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const now = new Date()
    // Den 5 okno: premium_until vyprší za 24–60 hodin
    // Den 7 okno: premium_until vyprší za -6 až +18 hodin (= dnes)
    const d5From = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
    const d5To = new Date(now.getTime() + 60 * 60 * 60 * 1000).toISOString()
    const d7From = new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString()
    const d7To = new Date(now.getTime() + 18 * 60 * 60 * 1000).toISOString()

    const d5Filter = `premium_source=eq.trial&premium=eq.true&trial_email_day5_sent_at=is.null&premium_until=gte.${d5From}&premium_until=lte.${d5To}`
    const d7Filter = `premium_source=eq.trial&premium=eq.true&trial_email_day7_sent_at=is.null&premium_until=gte.${d7From}&premium_until=lte.${d7To}`

    const day5 = await processBatch(d5Filter, 'trial_email_day5_sent_at', 'trial-expiring')
    const day7 = await processBatch(d7Filter, 'trial_email_day7_sent_at', 'trial-expired')

    return new Response(JSON.stringify({
      ok: true,
      ran_at: now.toISOString(),
      day5: { sent: day5.sent.length, failed: day5.failed.length, errors: day5.failed },
      day7: { sent: day7.sent.length, failed: day7.failed.length, errors: day7.failed },
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    console.error('trial-email-runner error:', e)
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
