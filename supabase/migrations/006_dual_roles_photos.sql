-- ============================================================
-- JUBAAN Portal — migration 006: dual-track applications + photos
-- Run this in the Supabase SQL Editor AFTER 005_admin_system.sql.
--
-- 1) profiles.photo_url — the app uploads {userId}/photo.jpg to the
--    'profile-photos' bucket and stores the public URL here.
-- 2) Dual-track applications: a member may now hold ONE volunteer
--    application AND ONE creative application simultaneously.
--    Drops volunteer_applications_user_id_key and replaces it with a
--    unique (user_id, track) constraint. Legacy rows with track NULL
--    are unaffected (Postgres treats NULLs as distinct in uniques).
-- 3) Adds volunteers_delete_own so members can withdraw their own
--    application (previously there was no delete policy).
-- 4) Creates the public 'profile-photos' storage bucket + RLS
--    policies: anyone can read; each member can only insert/update/
--    delete inside their own {userId}/ folder.
-- ============================================================

-- 1) Photo URL on profiles (idempotent).
alter table public.profiles
  add column if not exists photo_url text;

-- 2) Dual-track: replace single-application constraint with
--    unique (user_id, track).
alter table public.volunteer_applications
  drop constraint if exists volunteer_applications_user_id_key;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'volunteer_applications_user_track_key'
      and conrelid = 'public.volunteer_applications'::regclass
  ) then
    alter table public.volunteer_applications
      add constraint volunteer_applications_user_track_key
      unique (user_id, track);
  end if;
end $$;

-- 2b) Track value guard (idempotent). Existing rows only carry
--     track in ('volunteer','creative','member',NULL), so this
--     cannot break legacy data.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'volunteer_applications_track_check'
      and conrelid = 'public.volunteer_applications'::regclass
  ) then
    alter table public.volunteer_applications
      add constraint volunteer_applications_track_check
      check (track is null or track in ('volunteer', 'creative', 'member'));
  end if;
end $$;

-- 3) Let members withdraw their own application (idempotent).
drop policy if exists "volunteers_delete_own" on public.volunteer_applications;
create policy "volunteers_delete_own"
  on public.volunteer_applications
  for delete
  using (auth.uid() = user_id);

-- 4) Profile photos bucket (idempotent).
insert into storage.buckets (id, name, public)
values ('profile-photos', 'profile-photos', true)
on conflict (id) do nothing;

-- 5) Storage policies for the bucket (idempotent; policy names are
--    unique across storage.objects).
drop policy if exists "profile_photos_public_read" on storage.objects;
create policy "profile_photos_public_read"
  on storage.objects for select
  using (bucket_id = 'profile-photos');

drop policy if exists "profile_photos_insert_own" on storage.objects;
create policy "profile_photos_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'profile-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "profile_photos_update_own" on storage.objects;
create policy "profile_photos_update_own"
  on storage.objects for update
  using (
    bucket_id = 'profile-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'profile-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "profile_photos_delete_own" on storage.objects;
create policy "profile_photos_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'profile-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
