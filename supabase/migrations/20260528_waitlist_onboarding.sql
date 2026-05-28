-- Waitlist onboarding follow-up emaily (D+2 profile tip, D+7 voucher reminder)
alter table public.waitlist 
  add column if not exists profile_tip_sent_at timestamptz,
  add column if not exists launch_reminder_sent_at timestamptz;

-- Notification preferences na profiles
alter table public.profiles 
  add column if not exists email_weekly_insight boolean not null default true,
  add column if not exists email_match_notif boolean not null default true,
  add column if not exists email_message_notif boolean not null default true,
  add column if not exists push_enabled boolean not null default true;

-- pg_cron daily 08:00 UTC (10:00 SELČ)
do $$ begin
  if exists (select 1 from cron.job where jobname='waitlist-onboarding-daily') then
    perform cron.unschedule('waitlist-onboarding-daily');
  end if;
end $$;
select cron.schedule('waitlist-onboarding-daily', '0 8 * * *', $cron$
  select net.http_post(
    url := 'https://xdotpadgbchhecwitbpe.supabase.co/functions/v1/waitlist-onboarding-runner',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := '{}'::jsonb, timeout_milliseconds := 60000
  );
$cron$);
