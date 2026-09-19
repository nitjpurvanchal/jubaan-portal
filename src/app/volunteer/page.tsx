import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import Reveal from "@/components/Reveal";
import BodhiLeaf from "@/components/BodhiLeaf";
import VolunteerForm from "./VolunteerForm";
import VolunteerCertificate from "@/components/VolunteerCertificate";
import { certificateId } from "@/lib/volunteer";
import type { RoleName } from "@/lib/volunteer";
import type { VolunteerApplication } from "@/lib/volunteer";
import { ROLE_BADGE_STYLES } from "@/lib/volunteer";

export const metadata = { title: "Become a Volunteer — JUBAAN" };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function VolunteerPage() {
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
      .maybeSingle(),
  ]);

  const application = (appData ?? null) as VolunteerApplication | null;
  const profile = profileData as { full_name: string | null; phone: string | null } | null;

  return (
    <div className="pt-[72px]">
      <section className="max-w-3xl mx-auto px-5 md:px-8 pt-14 pb-24">
        <Reveal className="text-center mb-10">
          <p className="text-gold tracking-[0.35em] uppercase text-xs font-semibold mb-3">
            {application ? "Your crew pass" : "Join the crew"}
          </p>
          <h1 className="font-display text-4xl md:text-5xl mb-4">
            {application ? (
              <>Once a volunteer, <span className="text-gradient-gold">always family</span></>
            ) : (
              <>Serve the <span className="text-gradient-gold">sangha</span></>
            )}
          </h1>
          <p className="text-cream/65 max-w-xl mx-auto leading-relaxed">
            {application
              ? "Here is your standing in the JUBAAN crew — your certificate is yours to keep, print and share."
              : "Tell us your talents and we will find your place — on stage, behind the lens, or running the show. Your role is assigned instantly and transparently."}
          </p>
        </Reveal>

        {application ? (
          <div className="space-y-10">
            <Reveal className="rounded-3xl border border-gold/25 bg-coal/60 p-7 text-center relative overflow-hidden">
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-40 bg-gold/10 blur-[70px] rounded-full pointer-events-none" />
              <p className="text-[11px] tracking-[0.3em] uppercase text-muted mb-3">Your assigned role</p>
              <span
                className={`inline-block px-8 py-3 rounded-full border text-xl font-bold tracking-wide ${ROLE_BADGE_STYLES[(application.assigned_role as RoleName) ?? "Member"] ?? ROLE_BADGE_STYLES.Member}`}
              >
                {application.assigned_role}
              </span>
              {application.skills.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-5">
                  {application.skills.map((s) => (
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
                name={application.full_name || "JUBAAN Volunteer"}
                role={(application.assigned_role as RoleName) ?? "Member"}
                date={formatDate(application.created_at)}
                certId={certificateId(application)}
              />
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
            />
          </Reveal>
        )}
      </section>
    </div>
  );
}
