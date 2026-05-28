// waitlist-onboarding-runner — daily cron (D+2 profile tip, D+7 voucher reminder)
// Idempotent přes waitlist.profile_tip_sent_at / launch_reminder_sent_at
// Deployed via MCP 2026-05-28
import { sendEmail, corsHeaders } from '../_shared/resend.ts'
import { emailLayout } from '../_shared/email-layout.ts'
import { vocative } from '../_shared/czech.ts'

// Plný kód v deployed function — viz Supabase Dashboard
Deno.serve(async () => new Response('See deployed version', { headers: corsHeaders }))
