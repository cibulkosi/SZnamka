-- ──────────────────────────────────────────────────────────────────────
-- Notifications log table — idempotence pro e-mailové notifikace
-- (zabrání duplicitnímu odeslání first-match e-mailu)
-- ──────────────────────────────────────────────────────────────────────

create table if not exists public.notifications_sent (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  type        text not null,                              -- 'first_match', 'weekly_insight', ...
  sent_at     timestamptz not null default now(),
  metadata    jsonb default '{}'::jsonb
);

create index if not exists idx_notifications_sent_user_type
  on public.notifications_sent(user_id, type, sent_at desc);

-- Pouze service role může číst/zapisovat (Edge Function uses service key)
alter table public.notifications_sent enable row level security;
create policy "service role only on notifications_sent"
  on public.notifications_sent
  for all
  using (false)
  with check (false);

-- ──────────────────────────────────────────────────────────────────────
-- pg_cron: každý den v 8:00 SELČ (6:00 UTC) zavolá first-match-suggestions
-- Edge Function. Cron secret kontroluje funkce.
-- ──────────────────────────────────────────────────────────────────────

-- Extension pg_cron + pg_net se v Supabase enabluje v Dashboard → Extensions
-- Tato migration jen vytvoří job (pokud extension existuje).

do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    -- Smaž starý job, kdyby existoval
    perform cron.unschedule('first-match-suggestions-daily')
      where exists (select 1 from cron.job where jobname = 'first-match-suggestions-daily');

    -- Naplánuj: každý den v 6:00 UTC (8:00 SELČ / 7:00 SEČ)
    perform cron.schedule(
      'first-match-suggestions-daily',
      '0 6 * * *',
      $cron$
      select net.http_post(
        url := current_setting('app.settings.supabase_url') || '/functions/v1/first-match-suggestions',
        headers := jsonb_build_object(
          'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'),
          'Content-Type', 'application/json'
        ),
        body := '{}'::jsonb,
        timeout_milliseconds := 60000
      );
      $cron$
    );
  end if;
end $$;
