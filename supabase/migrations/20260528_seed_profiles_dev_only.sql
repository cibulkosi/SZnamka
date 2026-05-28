-- Seed profiles for dev UI testing (TEST DATA — not for production)
-- Applied via MCP 2026-05-28
-- These profiles have is_seed_test=true so they can be filtered/deleted easily

-- Add is_seed_test column (idempotent)
alter table public.profiles add column if not exists is_seed_test boolean not null default false;

-- TEST profiles inserted directly via MCP (not via migration file)
-- To clean up: delete from public.profiles where is_seed_test = true;
