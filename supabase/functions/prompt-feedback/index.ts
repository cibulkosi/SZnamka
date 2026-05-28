/**
 * prompt-feedback — Claude Haiku ratuje, jak konkrétně/zajímavě uživatel vyplnil
 * Hinge-style prompt v profilu.
 *
 * Vstup:  { question: string, answer: string }
 * Výstup: { score: 1-10, feedback: string, suggestion?: string }
 *
 * Náklady: ~50 input tokenů + ~80 output tokenů → ~0,03 ¢/request (Haiku 4.5).
 * Rate limit: 1 request / user / minutu (front-end debounce + Edge runtime check).
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')

const SYSTEM_PROMPT = `Jsi přátelská copywriting koučka pro českou seznamku Cosmatch.
Uživatel vyplňuje Hinge-style prompt (krátkou odpověď na otázku) ve svém profilu.

Tvůj úkol: Vyhodnoť odpověď z hlediska atraktivity pro potenciální shody.

Hodnoť ve škále 1–10:
  1–3 = generická, klišé ("Cestování, jídlo, knížky"), nic se z toho nedozvíme
  4–6 = OK ale obecná, schází konkrétnost nebo osobitost
  7–8 = dobrá — konkrétní detail, vtip nebo osobní příběh
  9–10 = výborná — invenční, paměťová, nutí k odpovědi

Pravidla:
- Odpovídej VÝHRADNĚ česky, tykáním, přátelsky
- "feedback" max 1 věta, max 80 znaků
- "suggestion" volitelně — když jsi dal score 1–6, navrhni v 1 větě, jak to vylepšit
- Žádné vykřičníky, žádný marketing tón
- Konkrétní, ne nudný

Vrať VÝHRADNĚ JSON v tomto formátu:
{"score": <1-10>, "feedback": "<text>", "suggestion": "<text|null>"}`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  if (!ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    const { question, answer } = await req.json()
    if (!question || !answer) {
      return new Response(JSON.stringify({ error: 'Missing question or answer' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    if (typeof answer !== 'string' || answer.length > 500) {
      return new Response(JSON.stringify({ error: 'Answer too long' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    // Minimální odpověď — skip Claude call
    if (answer.trim().length < 3) {
      return new Response(JSON.stringify({
        score: 1, feedback: 'Tahle odpověď je moc krátká.', suggestion: 'Zkus napsat aspoň větu.'
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        system: SYSTEM_PROMPT,
        messages: [{
          role: 'user',
          content: `Otázka: "${question}"\nOdpověď uživatele: "${answer}"\n\nVyhodnoť v JSON.`
        }],
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
    // Robust JSON parse — Claude občas obalí markdown
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {}

    return new Response(JSON.stringify({
      score: Math.max(1, Math.min(10, Number(parsed.score) || 5)),
      feedback: String(parsed.feedback || '').slice(0, 120),
      suggestion: parsed.suggestion ? String(parsed.suggestion).slice(0, 150) : null,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
