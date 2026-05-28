-- Photo verification v0 (manual approval by admin)
-- Applied via MCP on 2026-05-27

create table if not exists public.profile_verifications (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null unique references auth.users(id) on delete cascade,
  status          text not null default 'pending' check (status in ('pending','verified','rejected')),
  required_pose   text not null,
  selfie_url      text,
  submitted_at    timestamptz not null default now(),
  reviewed_at     timestamptz,
  reviewed_by     uuid references auth.users(id),
  rejection_reason text,
  metadata        jsonb default '{}'::jsonb
);

create index if not exists idx_profile_verifications_status_submitted
  on public.profile_verifications(status, submitted_at desc);

alter table public.profiles
  add column if not exists is_verified boolean not null default false;

alter table public.profile_verifications enable row level security;

drop policy if exists "users read own verification" on public.profile_verifications;
create policy "users read own verification"
  on public.profile_verifications for select using (auth.uid() = user_id);

drop policy if exists "users insert own verification" on public.profile_verifications;
create policy "users insert own verification"
  on public.profile_verifications for insert with check (auth.uid() = user_id);

drop policy if exists "users delete own pending or rejected" on public.profile_verifications;
create policy "users delete own pending or rejected"
  on public.profile_verifications for delete
  using (auth.uid() = user_id and status in ('pending','rejected'));

create or replace function public.sync_verified_flag()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'verified' and (old.status is distinct from 'verified') then
    update public.profiles set is_verified = true where id = new.user_id;
  elsif new.status = 'rejected' and (old.status = 'verified') then
    update public.profiles set is_verified = false where id = new.user_id;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_sync_verified_flag on public.profile_verifications;
create trigger trg_sync_verified_flag
  after update on public.profile_verifications
  for each row execute function public.sync_verified_flag();
