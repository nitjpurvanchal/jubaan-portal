-- ============================================================
-- JUBAAN Portal — migration 002: student onboarding fields
-- Run this in the Supabase SQL Editor AFTER schema.sql.
-- Adds the columns the /onboarding flow collects. The
-- handle_new_user trigger keeps working untouched (it only
-- inserts id/full_name/email; every new column has a default).
-- ============================================================

alter table public.profiles
  add column if not exists roll_number text;

alter table public.profiles
  add column if not exists branch text;

alter table public.profiles
  add column if not exists semester int;

alter table public.profiles
  add column if not exists phone text;

alter table public.profiles
  add column if not exists home_district text;

alter table public.profiles
  add column if not exists interests text[];

alter table public.profiles
  add column if not exists onboarding_completed boolean not null default false;

-- Owners can update their own profile row (needed by the
-- onboarding form). Idempotent: re-create only if missing.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'profiles_update_own'
  ) then
    create policy "profiles_update_own"
      on public.profiles for update
      using (auth.uid() = id);
  end if;
end $$;
