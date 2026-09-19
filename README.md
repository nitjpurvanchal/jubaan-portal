# JUBAAN — Bodhi Circuit Portal

A community portal for **JUBAAN — The Cultural Club of NIT Jalandhar**
(Jharkhand · Uttar Pradesh · Bihar Association And Networks), themed around
the sacred **Bodhi Circuit** of Lord Buddha.

Built with **Next.js 16 · React 19 · Tailwind CSS v4 · Framer Motion · Supabase · TypeScript**.

## Features

- **Landing page** — cinematic parallax hero, animated stats, Bodhi Circuit
  preview cards, flagship events, join CTA
- **Bodhi Circuit guide** — 8 sacred sites (Bodh Gaya, Sarnath, Nalanda,
  Rajgir, Vaishali, Kesaria, Kushinagar, Shravasti) on an animated timeline
- **Interactive events calendar** — month grid, flagship/community markers,
  day detail panel, add events when signed in
- **Events + RSVP** — filter (all / upcoming / flagship), one-tap RSVP
  backed by Supabase
- **Auth** — sign up (email confirmation), sign in, sign out via Supabase Auth
- **Member dashboard** — profile, RSVP list with cancel, events you created
- **About** — vision, mission, values, committees

## 1. Supabase setup (5 minutes)

1. Create a free project at [supabase.com](https://supabase.com) → **New project**.
2. Open **SQL Editor** → paste the entire contents of `supabase/schema.sql` →
   **Run**. This creates `profiles`, `events`, `rsvps`, RLS policies,
   the auto-profile trigger, and seeds the 18-event JUBAAN annual calendar.
3. Go to **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Under **Authentication → URL Configuration**, add your site URL
   (e.g. `https://your-app.vercel.app`) to **Redirect URLs**.

## 2. Run locally

```bash
cp .env.example .env.local
# fill in the two Supabase values
npm install
npm run dev
```

Open http://localhost:3000.

> Without Supabase keys the site still renders — the calendar and events
> pages fall back to the built-in annual calendar, and auth/RSVP will
> prompt you to connect Supabase.

## 3. Push to GitHub

```bash
git init
git add .
git commit -m "JUBAAN Bodhi Circuit portal"
gh repo create jubaan-portal --public --source=. --push
# (or create the repo on github.com and: git remote add origin <url> && git push -u origin main)
```

## 4. Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) → **Import** your GitHub repo.
2. Framework preset: **Next.js** (auto-detected). No build changes needed.
3. Add **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Deploy**. Every `git push` to `main` redeploys automatically.

## Project structure

```
src/
  app/
    page.tsx          landing
    circuit/          Bodhi Circuit guide
    calendar/         interactive calendar
    events/           events + RSVP
    login/ signup/    auth
    dashboard/        member dashboard (protected)
    about/            club story
    layout.tsx        fonts, nav, footer
    globals.css       Tailwind v4 theme (ink/gold/bodhi palette)
  components/         Navbar, Footer, Reveal, AuthForm, BodhiLeaf, …
  lib/
    data.ts           circuit sites + annual calendar seed data
    supabase/         browser + server clients
  middleware.ts       Supabase session refresh
supabase/schema.sql   tables, RLS, trigger, seed data
public/images/        generated artwork (hero, canopy, sarnath)
```
