-- Личные сообщения («Свои на связи» → «Открыть чат»).
-- Выполните этот файл один раз в Supabase → SQL Editor → New query → Run. Повторный запуск безопасен.
-- Требует, чтобы уже были выполнены schema.sql и profile-posts-migration.sql (view public_profiles).

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now(),
  check (sender_id <> recipient_id)
);
create index if not exists messages_sender_idx on public.messages(sender_id, created_at desc);
create index if not exists messages_recipient_idx on public.messages(recipient_id, created_at desc);

alter table public.messages enable row level security;

-- читать можно только свои переписки
drop policy if exists messages_read_own on public.messages;
create policy messages_read_own on public.messages for select to authenticated
  using (sender_id = auth.uid() or recipient_id = auth.uid());

-- писать можно только от своего имени
drop policy if exists messages_send on public.messages;
create policy messages_send on public.messages for insert to authenticated
  with check (sender_id = auth.uid());

-- удалять можно только свои отправленные сообщения
drop policy if exists messages_delete_own on public.messages;
create policy messages_delete_own on public.messages for delete to authenticated
  using (sender_id = auth.uid());

revoke all on public.messages from anon, authenticated;
grant select on public.messages to authenticated;
grant insert (recipient_id, body) on public.messages to authenticated;
grant delete on public.messages to authenticated;
