-- StudHub: публичный поиск профилей и публикации в базе данных.
-- Запустить один раз в Supabase → SQL Editor. Не удаляет существующие данные.

alter table public.profiles add column if not exists subtitle text not null default '';
alter table public.profiles add column if not exists bio text not null default '';
alter table public.profiles add column if not exists city text not null default '';
alter table public.profiles add column if not exists campus text not null default '';
alter table public.profiles add column if not exists interests text not null default '';

-- Публичная проекция: не открываем email и другие приватные поля auth.users.
create or replace view public.public_profiles as
select id, name, username, subtitle, bio, city, campus, interests, created_at
from public.profiles;
alter view public.public_profiles set (security_invoker = true);
grant select on public.public_profiles to anon, authenticated;

-- Required by security_invoker: public profile fields are readable under caller RLS.
drop policy if exists profiles_public_read on public.profiles;
create policy profiles_public_read on public.profiles for select to anon, authenticated using (true);
revoke select on public.profiles from anon, authenticated;
grant select (id, name, username, subtitle, bio, city, campus, interests, created_at, avatar_url)
  on public.profiles to anon, authenticated;
grant update (name, username, subtitle, bio, city, campus, interests) on public.profiles to authenticated;

create table if not exists public.user_posts (
  id bigint generated always as identity primary key,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 160),
  body text not null default '' check (char_length(body) <= 10000),
  tag text not null default 'Пост' check (char_length(tag) <= 40),
  created_at timestamptz not null default now()
);
create index if not exists user_posts_owner_created_idx on public.user_posts(owner_id, created_at desc);
alter table public.user_posts enable row level security;
revoke all on public.user_posts from anon, authenticated;

drop policy if exists user_posts_public_read on public.user_posts;
create policy user_posts_public_read on public.user_posts for select to anon, authenticated using (true);
drop policy if exists user_posts_insert_own on public.user_posts;
create policy user_posts_insert_own on public.user_posts for insert to authenticated with check (owner_id = auth.uid());
drop policy if exists user_posts_update_own on public.user_posts;
create policy user_posts_update_own on public.user_posts for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists user_posts_delete_own on public.user_posts;
create policy user_posts_delete_own on public.user_posts for delete to authenticated using (owner_id = auth.uid());
grant select on public.user_posts to anon, authenticated;
grant insert (owner_id, title, body, tag) on public.user_posts to authenticated;
grant update (title, body, tag) on public.user_posts to authenticated;
grant delete on public.user_posts to authenticated;
grant usage, select on sequence public.user_posts_id_seq to authenticated;
