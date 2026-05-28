-- Chat v1 polish — využíváme existující messages table
-- (columns: id, match_id, sender_id, content, read boolean, created_at)
-- Applied via MCP 2026-05-28

create index if not exists idx_messages_match_created
  on public.messages(match_id, created_at desc);

create index if not exists idx_messages_match_unread
  on public.messages(match_id, read) where read = false;

drop policy if exists "messages_update_recipient_read" on public.messages;
create policy "messages_update_recipient_read"
  on public.messages for update
  using (
    sender_id != auth.uid()
    and exists (
      select 1 from public.matches m
      where m.id = messages.match_id and (m.user_a = auth.uid() or m.user_b = auth.uid())
    )
  )
  with check (
    sender_id != auth.uid()
    and exists (
      select 1 from public.matches m
      where m.id = messages.match_id and (m.user_a = auth.uid() or m.user_b = auth.uid())
    )
  );

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname='supabase_realtime' and schemaname='public' and tablename='messages'
  ) then
    execute 'alter publication supabase_realtime add table public.messages';
  end if;
end $$;

create or replace view public.chat_conversations
with (security_invoker=true) as
select
  m.id as match_id, m.user_a, m.user_b, m.created_at as matched_at,
  (select row_to_json(t) from (
    select msg.id, msg.sender_id, msg.content, msg.created_at, msg.read
    from public.messages msg
    where msg.match_id = m.id
    order by msg.created_at desc limit 1
  ) t) as last_message,
  coalesce(
    (select max(msg.created_at) from public.messages msg where msg.match_id = m.id),
    m.created_at
  ) as last_activity_at,
  (select count(*) from public.messages msg
   where msg.match_id = m.id and msg.sender_id != auth.uid() and msg.read = false) as unread_count
from public.matches m;

grant select on public.chat_conversations to authenticated;
