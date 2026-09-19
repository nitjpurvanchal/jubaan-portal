-- ============================================================
-- JUBAAN Portal — migration 004: volunteer tracks + admin reads
-- Run this in the Supabase SQL Editor AFTER 003_volunteer.sql.
--
-- 1) Adds `track` ("volunteer" | "creative" | "member") and
--    `track_roles` (the track-specific picks) to volunteer_applications.
-- 2) Lets club admins read every row (profiles, volunteer_applications,
--    rsvps, events) without touching the database directly.
--
-- ADMIN EMAILS: the default admin is nitjpurvanchal@gmail.com.
-- To add more admins, append their lowercase emails to the array in
-- public.is_jubaan_admin() below AND to JUBAAN_ADMIN_EMAILS in the
-- Vercel project env vars (comma-separated). Keep both lists in sync.
-- ============================================================

-- 1) Track columns (idempotent).
alter table public.volunteer_applications
  add column if not exists track text;

alter table public.volunteer_applications
  add column if not exists track_roles text[] not null default '{}';

-- 2) Admin check helper.
create or replace function public.is_jubaan_admin()
returns boolean
language sql
stable
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = any (
    array[
      'nitjpurvanchal@gmail.com'
      -- e.g. 'second.admin@example.com',
    ]
  );
$$;

grant execute on function public.is_jubaan_admin() to authenticated, anon;

-- 3) Admin read policies (permissive: OR'd with the existing own-row policies).
drop policy if exists "admins_select_profiles" on public.profiles;
create policy "admins_select_profiles"
  on public.profiles for select
  using (public.is_jubaan_admin());

drop policy if exists "admins_select_volunteer_applications" on public.volunteer_applications;
create policy "admins_select_volunteer_applications"
  on public.volunteer_applications for select
  using (public.is_jubaan_admin());

drop policy if exists "admins_select_rsvps" on public.rsvps;
create policy "admins_select_rsvps"
  on public.rsvps for select
  using (public.is_jubaan_admin());

drop policy if exists "admins_select_events" on public.events;
create policy "admins_select_events"
  on public.events for select
  using (public.is_jubaan_admin());
