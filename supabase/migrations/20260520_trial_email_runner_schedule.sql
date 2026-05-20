-- Trial e-mail runner: idempotency + pg_cron schedule
-- 20. 5. 2026
--
-- Spustí denně v 09:00 UTC Edge Function "trial-email-runner",
-- která najde trial usery v okně den-5 / den-7 a pošle jim e-maily.

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_email_day5_sent_at TIMESTAMPTZ NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_email_day7_sent_at TIMESTAMPTZ NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_trial_email_pending
  ON profiles(premium_until)
  WHERE premium_source = 'trial'
    AND (trial_email_day5_sent_at IS NULL OR trial_email_day7_sent_at IS NULL);

-- POZOR: skutečný cron schedule (s secretem v Authorization header) je nastaven
-- ručně přes Supabase MCP, ne v této migraci, aby se TRIAL_RUNNER_SECRET nedostal
-- do gitu. Pokud se DB ztratí, schedule znovu nastav přes apply_migration.
-- Schedule: 0 9 * * * (denně 09:00 UTC = 11:00 Praha v létě / 10:00 v zimě)
