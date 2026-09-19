import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import Reveal from "@/components/Reveal";
import BodhiLeaf from "@/components/BodhiLeaf";
import VolunteerForm from "./VolunteerForm";
import VolunteerCertificate from "@/components/VolunteerCertificate";
import { certificateId, applicationForTrack } from "@/lib/volunteer";
import type { RoleName } from "@/lib/volunteer";
import type { VolunteerApplication } from "@/lib/volunteer";
import { ROLE_BADGE_STYLES, TRACKS, TRACK_LABELS, TRACK_DESCRIPTIONS } from "@/lib/volunteer";
import type { TrackName } from "@/lib/volunteer";

export const metadata = { title: "Become a Volunteer — JUBAAN" };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function VolunteerPage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string }>;
}) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="pt-[72px] min-h-[80svh] flex items-center justify-center px-5">
        <div className="max-w-md text-center rounded-3xl border border-gold/25 bg-coal/70 p-10">
          <BodhiLeaf className="w-12 h-14 text-gold mx-auto mb-5" glow />
          <h1 className="font-display text-3xl mb-3">Supabase not connected</h1>
          <p className="text-cream/65 leading-relaxed mb-6">
            Volunteering needs your Supabase project keys. Add them to
            <code className="text-goldsoft"> .env.local </code>
            (see the README) and redeploy.
          </p>
          <Link href="/" className="text-gold font-semibold hover:text-goldsoft">← Back home</Link>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profileData }, { data: appData }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name,phone")
      .eq("id", user.id)
      .single(),
    supabase
      .from("volunteer_applications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true }),
  ]);

  const applications = ((appData ?? []) as VolunteerApplication[]).map((a) => ({
    ...a,
    track_roles: a.track_roles ?? [],
    skills: a.skills ?? [],
  }));
  const profile = profileData as { full_name: string | null; phone: string | null } | null;

  const { track: trackParam } = await searchParams;
  const requestedTrack: TrackName = (TRACKS as readonly string[]).includes(trackParam ?? "")
    ? (trackParam as TrackName)
    : "volunteer";

  // Per-track logic: only the application for the REQUESTED track matters.
  const currentApp = applicationForTrack(applications, requestedTrack);
  const hasOtherApps = applications.some((a) => a.id !== currentApp?.id);

  return (
    <div className="pt-[72px]">
      <section className="max-w-3xl mx-auto px-5 md:px-8 pt-14 pb-24">
        <Reveal className="text-center mb-10">
          <p className="text-gold tracking-[0.35em] uppercase text-xs font-semibold mb-3">
            {currentApp ? `Your ${TRACK_LABELS[requestedTrack]} crew pass` : `Join as a ${TRACK_LABELS[requestedTrack]}`}
          </p>
          <h1 className="font-display text-4xl md:text-5xl mb-4">
            {currentApp ? (
              <>Once a volunteer, <span className="text-gradient-gold">always family</span></>
            ) : (
              <>Serve the <span className="text-gradient-gold">sangha</span></>
            )}
          </h1>
          <p className="text-cream/65 max-w-xl mx-auto leading-relaxed">
            {currentApp
              ? "Here is your standing in the JUBAAN crew — your certificate is yours to keep, print and share."
              : TRACK_DESCRIPTIONS[requestedTrack]}
          </p>
          {!currentApp && hasOtherApps && (
            <p className="text-cream/50 text-sm mt-3">
              You already hold another role — members can keep a{" "}
              <span className="text-goldsoft">volunteer</span> and a{" "}
              <span className="text-goldsoft">creative</span> seat at once.
            </p>
          )}
        </Reveal>

        {currentApp ? (
          <div className="space-y-10">
            <Reveal className="rounded-3xl border border-gold/25 bg-coal/60 p-7 text-center relative overflow-hidden">
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-40 bg-gold/10 blur-[70px] rounded-full pointer-events-none" />
              <p className="text-[11px] tracking-[0.3em] uppercase text-muted mb-3">Your assigned role</p>
              <span
                className={`inline-block px-8 py-3 rounded-full border text-xl font-bold tracking-wide ${ROLE_BADGE_STYLES[(currentApp.assigned_role as RoleName) ?? "Member"] ?? ROLE_BADGE_STYLES.Member}`}
              >
                {currentApp.assigned_role}
              </span>
              {(currentApp.track_roles.length > 0 || currentApp.skills.length > 0) && (
                <div className="flex flex-wrap justify-center gap-2 mt-5">
                  {(currentApp.track_roles.length > 0 ? currentApp.track_roles : currentApp.skills).map((s) => (
                    <span
                      key={s}
                      className="px-3.5 py-1.5 rounded-full text-xs font-medium border border-gold/40 text-goldsoft bg-gold/10"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </Reveal>

            <Reveal delay={0.08}>
              <VolunteerCertificate
                name={currentApp.full_name || "JUBAAN Volunteer"}
                role={(currentApp.assigned_role as RoleName) ?? "Member"}
                date={formatDate(currentApp.created_at)}
                certId={certificateId(currentApp)}
              />
            </Reveal>

            <Reveal delay={0.12}>
              <div className="rounded-3xl border border-cream/10 bg-coal/60 p-7 md:p-8">
                <h2 className="font-display text-2xl mb-1">Update your application</h2>
                <p className="text-muted text-sm mb-6">
                  Edit and save — your {TRACK_LABELS[requestedTrack].toLowerCase()} seat updates in place.
                </p>
                <VolunteerForm
                  defaultName={profile?.full_name ?? ""}
                  defaultPhone={profile?.phone ?? ""}
                  defaultTrack={requestedTrack}
                  existingApp={currentApp}
                />
              </div>
            </Reveal>

            <Reveal className="text-center">
              <Link href="/dashboard" className="text-gold font-semibold hover:text-goldsoft">
                ← Back to dashboard
              </Link>
            </Reveal>
          </div>
        ) : (
          <Reveal delay={0.05}>
            <VolunteerForm
              defaultName={profile?.full_name ?? ""}
              defaultPhone={profile?.phone ?? ""}
              defaultTrack={requestedTrack}
            />
          </Reveal>
        )}
      </section>
    </div>
  );
}
