/**
 * ai-convo-starter — Claude Haiku navrhne 3 otvírací zprávy do chatu na
 * základě profilu druhé osoby + Cosmatch kompatibility skóre.
 *
 * Vstup:  { target_profile: { name, bio, prompts, philosophy }, compat_score, my_name }
 * Výstup: { suggestions: [string, string, string] }
 *
 * Náklady: ~150 input + ~120 output tokenů → ~0,08 ¢/request (Haiku 4.5).
 * Použití: chat compose box → tlačítko „💡 Navrhni zprávu"
 *
 * Připravené pro budoucí integraci, až bude /chat live.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')

const SYSTEM_PROMPT = `Pomáháš lidem napsat zajímavou otvírací zprávu na české seznamce Cosmatch.

Pravidla:
- Odpovídej VÝHRADNĚ česky, tykáním
- Každá zpráva max 15 slov
- Tři různé tóny:
  1. Zvědavý (otázka, která naváže na něco konkrétního z profilu)
  2. Hravý (vtipný observation, ne stupid pickup line)
  3. Komplimentový (něco konkrétního z profilu, ne fyzický vzhled)
- Nikdy: „Ahoj, jak se máš?", „Krásný úsměv", „Co děláš ráda?"
- Vždy: konkrétní reference na bio/prompts druhého

Vrať VÝHRADNĚ JSON:
{"suggestions": ["<zpráva 1>", "<zpráva 2>", "<zpráva 3>"]}`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  if (!ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    const { target_profile, compat_score, my_name } = await req.json()
    if (!target_profile) {
      return new Response(JSON.stringify({ error: 'Missing target_profile' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const profileSummary = [
      `Jméno: ${target_profile.name || 'neznámé'}`,
      target_profile.bio ? `Bio: "${String(target_profile.bio).slice(0, 200)}"` : null,
      target_profile.philosophy ? `Filozofie: "${String(target_profile.philosophy).slice(0, 150)}"` : null,
      Array.isArray(target_profile.prompts) && target_profile.prompts.length > 0
        ? `Hinge prompts:\n${target_profile.prompts.slice(0, 3).map((p: { question: string, answer: string }) =>
            `  - ${p.question}: "${String(p.answer).slice(0, 150)}"`).join('\n')}`
        : null,
      target_profile.hobbies?.length ? `Záliby: ${target_profile.hobbies.slice(0, 6).join(', ')}` : null,
      target_profile.occupation ? `Povolání: ${target_profile.occupation}` : null,
      target_profile.city ? `Město: ${target_profile.city}` : null,
    ].filter(Boolean).join('\n')

    const userMsg = `Pomoz mi (${my_name || 'uživatel'}) napsat 3 otvírací zprávy pro tento profil.\n\nKompatibilita: ${compat_score || '?'} %\n\n${profileSummary}\n\nNavrhni v JSON.`

    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMsg }],
      })
    })

    if (!claudeRes.ok) {
      const errTxt = await claudeRes.text()
      return new Response(JSON.stringify({ error: `Claude API: ${errTxt}` }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const data = await claudeRes.json()
    const text = data?.content?.[0]?.text || '{}'
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {}
    const suggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 3).map((s: unknown) => String(s).slice(0, 200)) : []

    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
