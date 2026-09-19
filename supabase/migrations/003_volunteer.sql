-- ============================================================
-- JUBAAN Portal — migration 003: volunteer applications
-- Run this in the Supabase SQL Editor AFTER 002_onboarding.sql.
-- One application per member (unique user_id); the app assigns
-- the role transparently at submit time. Status defaults to
-- 'approved' so the member instantly gets their certificate.
-- ============================================================

create table if not exists public.volunteer_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  prior_experience text,
  skills text[] not null default '{}',
  why_join text,
  portfolio_url text,
  assigned_role text not null default 'Member',
  status text not null default 'approved',
  display_on_site boolean not null default false,
  created_at timestamptz not null default now()
);

-- One application per member (idempotent).
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'volunteer_applications_user_id_key'
  ) then
    alter table public.volunteer_applications
      add constraint volunteer_applications_user_id_key unique (user_id);
  end if;
end $$;

alter table public.volunteer_applications enable row level security;

-- Members manage only their own application row.
drop policy if exists "volunteers_read_own" on public.volunteer_applications;
create policy "volunteers_read_own"
  on public.volunteer_applications for select
  using (auth.uid() = user_id);

drop policy if exists "volunteers_insert_own" on public.volunteer_applications;
create policy "volunteers_insert_own"
  on public.volunteer_applications for insert
  with check (auth.uid() = user_id);

drop policy if exists "volunteers_update_own" on public.volunteer_applications;
create policy "volunteers_update_own"
  on public.volunteer_applications for update
  using (auth.uid() = user_id);
