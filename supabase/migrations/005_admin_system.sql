-- ============================================================
-- JUBAAN Portal — migration 005: admin credential system
-- Run this in the Supabase SQL Editor AFTER 004_volunteer_tracks.sql.
--
-- Replaces the email-based admin gating from 004 with a dedicated
-- admin credential system: roll number + DOB password (DDMMYYYY).
-- The admin panel (/admin) is hidden from the main site and reachable
-- only by direct URL; admins log in with their roll number.
--
-- IMPORTANT: the app reads these tables with the SERVICE ROLE key
-- (server-side only). RLS is enabled with NO public policies, so the
-- anon key can never read them.
-- ============================================================

-- 1) Retire the email-based admin gating from 004 (keep the
--    track/track_roles columns on volunteer_applications!).
drop policy if exists "admins_select_profiles" on public.profiles;
drop policy if exists "admins_select_volunteer_applications" on public.volunteer_applications;
drop policy if exists "admins_select_rsvps" on public.rsvps;
drop policy if exists "admins_select_events" on public.events;
drop function if exists public.is_jubaan_admin();

-- 2) Admin accounts.
create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  roll_number text unique not null,
  full_name text,
  password_hash text not null,
  created_at timestamptz not null default now(),
  created_by uuid
);

alter table public.admins enable row level security;
-- No policies: service-role key only.

-- 3) Admin login sessions (token in an httpOnly cookie).
create table if not exists public.admin_sessions (
  token text primary key,
  admin_id uuid not null references public.admins(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.admin_sessions enable row level security;
-- No policies: service-role key only.

-- 4) Seed the first admin (idempotent).
--    Roll number: 25619031 | password: 07032008 (DDMMYYYY, change after login).
create extension if not exists pgcrypto;

insert into public.admins (roll_number, full_name, password_hash)
values (
  '25619031',
  'Shubhankar Raj',
  crypt('07032008', gen_salt('bf'))
)
on conflict (roll_number) do nothing;
