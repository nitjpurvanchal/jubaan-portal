-- ============================================================
-- JUBAAN Portal — Supabase schema
-- Run this in the Supabase SQL Editor (one paste, one run).
-- ============================================================

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  home_state text,
  created_at timestamptz not null default now()
);

-- ---------- events ----------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date date not null,
  location text,
  is_flagship boolean not null default false,
  image_url text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------- rsvps ----------
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

-- ---------- auto-create profile on signup ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- Row Level Security ----------
alter table public.profiles enable row level security;
alter table public.events   enable row level security;
alter table public.rsvps    enable row level security;

-- profiles: anyone can read; owners can update their own
create policy "profiles_read_all"
  on public.profiles for select using (true);
create policy "profiles_update_own"
  on public.profiles for update using (auth.uid() = id);

-- events: anyone can read; signed-in users can create
create policy "events_read_all"
  on public.events for select using (true);
create policy "events_insert_auth"
  on public.events for insert with check (auth.uid() is not null);
create policy "events_update_own"
  on public.events for update using (auth.uid() = created_by);
create policy "events_delete_own"
  on public.events for delete using (auth.uid() = created_by);

-- rsvps: users manage their own; event creators see rsvps for their events
create policy "rsvps_read_own"
  on public.rsvps for select
  using (auth.uid() = user_id
     or exists (select 1 from public.events e
                where e.id = rsvps.event_id and e.created_by = auth.uid()));
create policy "rsvps_insert_own"
  on public.rsvps for insert with check (auth.uid() = user_id);
create policy "rsvps_delete_own"
  on public.rsvps for delete using (auth.uid() = user_id);

-- ---------- seed: JUBAAN annual calendar (2026-27) ----------
insert into public.events (title, description, event_date, location, is_flagship) values
  ('Club Introduction & Membership Drive', 'Welcome meet for new members at the start of the odd semester.', '2026-08-10', 'NIT Jalandhar', false),
  ('Santhal Movement — Heritage Session', 'Awareness session on the Santhal movement, tribal resistance and culture.', '2026-08-24', 'NIT Jalandhar', false),
  ('Ramdhari Singh Dinkar Jayanti', 'Poetry and literary session on the Rashtrakavi.', '2026-09-23', 'NIT Jalandhar', false),
  ('Jayprakash Narayan Jayanti', 'Talks and discussions on the life and values of JP Narayan.', '2026-10-11', 'NIT Jalandhar', false),
  ('Navratri & Ramleela', 'Ramleela performance with the Sita–Ram Vivah episode as a dramatic theatrical presentation.', '2026-10-20', 'NIT Jalandhar', true),
  ('Chhath Puja — Heritage Evening', 'Folk songs, documentary screening and photo exhibition on the festival''s cultural significance.', '2026-11-15', 'NIT Jalandhar', true),
  ('Jharkhand Foundation Day', 'Cultural programme with tribal art, music and dance celebrating the spirit of Jharkhand.', '2026-11-15', 'NIT Jalandhar', true),
  ('Janjatiya Gaurav Diwas / Birsa Munda Day', 'Tribute to tribal heritage on Birsa Munda Jayanti — talks, exhibitions and cultural performances.', '2026-11-15', 'NIT Jalandhar', true),
  ('Dev Deepawali', 'Cultural evening with lamps, rangoli and folk songs.', '2026-11-25', 'NIT Jalandhar', false),
  ('Good Governance Day / Atal Bihari Vajpayee Jayanti', 'Talks on governance, leadership and nation-building.', '2026-12-25', 'NIT Jalandhar', false),
  ('Makar Sankranti Celebration', 'Til-gur, kites and talks on harvest traditions.', '2027-01-14', 'NIT Jalandhar', false),
  ('Karpoori Thakur Jayanti', 'Remembrance of the Bharat Ratna and social-justice leader.', '2027-01-24', 'NIT Jalandhar', false),
  ('Bhasha Sangam', 'Bhojpuri, Maithili, Magahi, Awadhi and Hindi literary meet — kavi sammelan, storytelling and reading circles.', '2027-02-12', 'NIT Jalandhar', false),
  ('Braj Mahotsav — Holi Milan Samaroh', 'Celebration of Braj culture with Holi-of-Braj themed music, colours and poetry.', '2027-03-15', 'NIT Jalandhar', true),
  ('Bihar Diwas', 'Heritage talks, exhibitions and cultural performances celebrating Bihar''s history, art and traditions.', '2027-03-22', 'NIT Jalandhar', true),
  ('Food Fest', 'Traditional food and heritage exhibition — litti-chokha, malpua, pitha, Banarasi thandai, dhuska, chilka roti and more.', '2027-04-10', 'NIT Jalandhar', true),
  ('Mithila Mahotsav', 'Maithili songs, Mithila painting workshops and Bihar folk culture.', '2027-04-24', 'NIT Jalandhar', false),
  ('Year-End Cultural Showcase', 'Closing showcase of the year''s cultural work by members.', '2027-05-08', 'NIT Jalandhar', false)
on conflict do nothing;
