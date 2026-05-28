-- Fix: cron jobs měly app.settings.* substituci, ale v Supabase 2026 jsou NULL.
-- Hardcoded URL (verify_jwt=false na obou funkcích → no auth needed).

do $$
begin
  if exists (select 1 from cron.job where jobname = 'weekly-compat-insight') then
    perform cron.unschedule('weekly-compat-insight');
  end if;
  if exists (select 1 from cron.job where jobname = 'first-match-suggestions-daily') then
    perform cron.unschedule('first-match-suggestions-daily');
  end if;
end $$;

select cron.schedule('weekly-compat-insight', '0 15 * * 4', $$
  select net.http_post(
    url := 'https://xdotpadgbchhecwitbpe.supabase.co/functions/v1/weekly-compat-insight',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := '{}'::jsonb, timeout_milliseconds := 120000
  );
$$);

select cron.schedule('first-match-suggestions-daily', '0 6 * * *', $$
  select net.http_post(
    url := 'https://xdotpadgbchhecwitbpe.supabase.co/functions/v1/first-match-suggestions',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := '{}'::jsonb, timeout_milliseconds := 60000
  );
$$);
