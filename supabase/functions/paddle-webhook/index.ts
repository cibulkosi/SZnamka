// Supabase Edge Function: paddle-webhook
// Zpracovává Paddle webhook události a aktualizuje premium status v DB
//
// Nasazení:
//   supabase functions deploy paddle-webhook --no-verify-jwt
//
// Webhook URL pro Paddle dashboard:
//   https://xdotpadgbchhecwitbpe.supabase.co/functions/v1/paddle-webhook
//
// Nastav v Supabase secrets:
//   supabase secrets set PADDLE_WEBHOOK_SECRET=<secret z Paddle dashboardu>

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const body = await req.text()
  let event: Record<string, unknown>

  try {
    event = JSON.parse(body)
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const eventType = event.event_type as string
  console.log('Paddle webhook:', eventType)

  // Zpracuj relevantní události
  if (
    eventType === 'subscription.activated' ||
    eventType === 'subscription.updated' ||
    eventType === 'transaction.completed'
  ) {
    const data = event.data as Record<string, unknown>

    // Vytáhni userId z customData (posíláme při checkout)
    const customData = data.custom_data as Record<string, string> | null
    const userId = customData?.userId

    if (userId) {
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({ premium: true })
        .eq('id', userId)

      if (error) {
        console.error('DB update error:', error)
        return new Response('DB error', { status: 500 })
      }
      console.log('Premium aktivován pro uživatele:', userId)
    }
  }

  // Deaktivace při zrušení/expiraci
  if (
    eventType === 'subscription.canceled' ||
    eventType === 'subscription.past_due'
  ) {
    const data = event.data as Record<string, unknown>
    const customData = data.custom_data as Record<string, string> | null
    const userId = customData?.userId

    if (userId) {
      await supabaseAdmin
        .from('profiles')
        .update({ premium: false })
        .eq('id', userId)
      console.log('Premium deaktivován pro uživatele:', userId)
    }
  }

  return new Response('OK', { status: 200 })
})
