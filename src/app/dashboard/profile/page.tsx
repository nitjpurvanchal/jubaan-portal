import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import Reveal from "@/components/Reveal";
import BodhiLeaf from "@/components/BodhiLeaf";
import ProfileEditor from "./ProfileEditor";
import PhotoUploader from "./PhotoUploader";
import VolunteerCertificate from "@/components/VolunteerCertificate";
import MemberShareCard from "@/components/MemberShareCard";
import type { Profile } from "@/lib/profile";
import type { VolunteerApplication, RoleName } from "@/lib/volunteer";
import { ROLE_BADGE_STYLES, certificateId, applicationForTrack } from "@/lib/volunteer";

export const metadata = { title: "Your profile — JUBAAN" };

type RsvpRow = {
  event_id: string;
  events: {
    title: string | null;
    event_date: string | null;
    location: string | null;
    is_flagship: boolean | null;
  } | null;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ProfilePage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="pt-[72px] min-h-[80svh] flex items-center justify-center px-5">
        <div className="max-w-md text-center rounded-3xl border border-gold/25 bg-coal/70 p-10">
          <BodhiLeaf className="w-12 h-14 text-gold mx-auto mb-5" glow />
          <h1 className="font-display text-3xl mb-3">Supabase not connected</h1>
          <p className="text-cream/65 leading-relaxed mb-6">
            Profiles need your Supabase project keys. Add them to
            <code className="text-goldsoft"> .env.local </code> and redeploy.
          </p>
          <Link href="/" className="text-gold font-semibold hover:text-goldsoft">← Back home</Link>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profileData }, { data: appData }, { data: rsvpsData }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id,full_name,email,avatar_url,home_state,created_at,roll_number,branch,semester,phone,home_district,interests,onboarding_completed,photo_url")
      .eq("id", user.id)
      .single(),
    supabase
      .from("volunteer_applications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("rsvps")
      .select("event_id, events(title,event_date,location,is_flagship)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const profile = (profileData ?? null) as Profile | null;
  // Onboarding gate — same as the dashboard.
  if (!profile || !profile.onboarding_completed) redirect("/onboarding");

  const applications = ((appData ?? []) as VolunteerApplication[]).map((a) => ({
    ...a,
    track_roles: a.track_roles ?? [],
    skills: a.skills ?? [],
  }));
  const rsvps = ((rsvpsData ?? []) as unknown as RsvpRow[]).filter((r) => r.events);

  const volunteerApp = applicationForTrack(applications, "volunteer");
  const creativeApp = applicationForTrack(applications, "creative");

  const roles = Array.from(
    new Set(applications.map((a) => a.assigned_role).filter(Boolean))
  ) as string[];

  const joined = profile.created_at ? formatDate(profile.created_at) : "";

  const appBlock = (
    track: "volunteer" | "creative",
    app: VolunteerApplication | null,
    accent: string
  ) => (
    <div className="rounded-3xl border border-cream/10 bg-coal/60 p-7">
      <div className="flex items-center justify-between mb-4">
        <span
          className={`inline-block px-4 py-1.5 rounded-full border text-[11px] font-bold tracking-[0.2em] uppercase ${accent}`}
        >
          {track}
        </span>
        <Link href={`/volunteer?track=${track}`} className="text-sm text-gold hover:text-goldsoft font-semibold">
          {app ? "Edit →" : "Apply →"}
        </Link>
      </div>
      {app ? (
        <div>
          <span
            className={`inline-block px-5 py-2 rounded-full border text-base font-bold ${ROLE_BADGE_STYLES[(app.assigned_role as RoleName) ?? "Member"] ?? ROLE_BADGE_STYLES.Member}`}
          >
            {app.assigned_role}
          </span>
          {app.track_roles.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {app.track_roles.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border border-cream/20 text-cream/70 bg-ink/40"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="text-muted text-sm">
          No {track} application yet —{" "}
          <Link href={`/volunteer?track=${track}`} className="text-gold hover:text-goldsoft font-semibold">
            apply now
          </Link>
          .
        </p>
      )}
    </div>
  );

  return (
    <div className="pt-[72px]">
      <section className="max-w-4xl mx-auto px-5 md:px-8 pt-14 pb-24">
        <Reveal className="mb-10">
          <Link href="/dashboard" className="text-sm text-gold hover:text-goldsoft font-semibold">
            ← Back to dashboard
          </Link>
          <p className="text-gold tracking-[0.3em] uppercase text-xs font-semibold mt-4 mb-1">Everything about you</p>
          <h1 className="font-display text-4xl md:text-5xl">
            Your <span className="text-gradient-gold">profile</span>
          </h1>
        </Reveal>

        <Reveal className="rounded-3xl border border-gold/25 bg-coal/60 p-7 md:p-8 mb-8 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-gold/10 blur-[80px] pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row items-center gap-7">
            <PhotoUploader userId={user.id} currentUrl={profile.photo_url} name={profile.full_name} />
            <div className="text-center sm:text-left">
              <h2 className="font-display text-3xl">{profile.full_name || "traveller"}</h2>
              <p className="text-muted text-sm mt-1">{profile.email ?? user.email}</p>
              {profile.roll_number && (
                <p className="text-cream/60 text-sm mt-1">Roll {profile.roll_number}</p>
              )}
              <p className="text-muted text-xs mt-3 leading-relaxed max-w-sm">
                Your photo appears on your dashboard, your share card and in the club registers.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal className="rounded-3xl border border-cream/10 bg-coal/60 p-7 md:p-8 mb-8">
          <h2 className="font-display text-2xl mb-1">Personal details</h2>
          <p className="text-muted text-sm mb-6">Keep these current — the crew and the registers read from here.</p>
          <ProfileEditor profile={profile} userId={user.id} />
        </Reveal>

        <Reveal className="mb-6">
          <h2 className="font-display text-2xl mb-1">Your roles</h2>
          <p className="text-muted text-sm">Manage each seat from its own page.</p>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Reveal>{appBlock("volunteer", volunteerApp, "border-bodhi/60 text-bodhi bg-bodhi/10")}</Reveal>
          <Reveal delay={0.06}>{appBlock("creative", creativeApp, "border-saffron/60 text-saffron bg-saffron/10")}</Reveal>
        </div>

        <Reveal className="rounded-3xl border border-cream/10 bg-coal/60 p-7 md:p-8 mb-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-2xl mb-1">Your RSVPs</h2>
              <p className="text-muted text-sm">Gatherings you&rsquo;ve marked yourself going to.</p>
            </div>
            <Link href="/dashboard" className="text-sm text-gold hover:text-goldsoft font-semibold shrink-0">
              Manage →
            </Link>
          </div>
          {rsvps.length === 0 ? (
            <p className="text-muted text-sm">
              Nothing yet — <Link href="/events" className="text-gold hover:text-goldsoft">find a gathering</Link> to join.
            </p>
          ) : (
            <ul className="space-y-3">
              {rsvps.map((r) => (
                <li
                  key={r.event_id}
                  className="rounded-2xl border border-cream/10 bg-ink/50 p-4 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-semibold text-sm">
                      {r.events?.is_flagship && <span className="text-gold mr-1.5">★</span>}
                      {r.events?.title ?? "Event"}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {r.events?.event_date ?? ""}{r.events?.location ? ` · ${r.events.location}` : ""}
                    </p>
                  </div>
                  <Link href="/events" className="text-xs text-gold hover:text-goldsoft font-semibold shrink-0">
                    Details →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Reveal>

        {applications.length > 0 && (
          <Reveal className="mb-8">
            <h2 className="font-display text-2xl mb-5">Your certificates</h2>
            <div className="space-y-8">
              {applications.map((app) => (
                <VolunteerCertificate
                  key={app.id}
                  name={app.full_name || profile.full_name || "JUBAAN Volunteer"}
                  role={(app.assigned_role as RoleName) ?? "Member"}
                  date={formatDate(app.created_at)}
                  certId={certificateId(app)}
                />
              ))}
            </div>
          </Reveal>
        )}

        <Reveal>
          <h2 className="font-display text-2xl mb-1">Share your card</h2>
          <p className="text-muted text-sm mb-6">
            Your JUBAAN identity, ready to share with the sangha and beyond.
          </p>
          <MemberShareCard
            name={profile.full_name ?? "JUBAAN Member"}
            roll={profile.roll_number ?? ""}
            branch={profile.branch ?? ""}
            roles={roles}
            photoUrl={profile.photo_url}
            joined={joined}
          />
        </Reveal>
      </section>
    </div>
  );
}
