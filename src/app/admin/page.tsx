import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isAdminEmail } from "@/lib/admin";
import BodhiLeaf from "@/components/BodhiLeaf";
import AdminTables from "./AdminTables";

export const metadata = { title: "Admin — JUBAAN" };

export type MemberRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  roll_number: string | null;
  branch: string | null;
  semester: number | null;
  home_state: string | null;
  home_district: string | null;
  phone: string | null;
  onboarding_completed: boolean | null;
  created_at: string | null;
};

export type ApplicationRow = {
  id: string;
  full_name: string | null;
  track: string | null;
  track_roles: string[];
  assigned_role: string | null;
  skills: string[];
  prior_experience: string | null;
  why_join: string | null;
  phone: string | null;
  portfolio_url: string | null;
  created_at: string | null;
  email: string | null;
};

export type RsvpRow = {
  event_title: string;
  event_date: string | null;
  member_name: string;
  member_email: string;
  rsvpd_at: string | null;
};

function NotAuthorized({ signedIn }: { signedIn: boolean }) {
  return (
    <div className="pt-[72px] min-h-[80svh] flex items-center justify-center px-5">
      <div className="max-w-md text-center rounded-3xl border border-gold/25 bg-coal/70 p-10">
        <BodhiLeaf className="w-12 h-14 text-gold mx-auto mb-6" glow />
        <p className="text-gold tracking-[0.3em] uppercase text-xs font-semibold mb-3">
          Restricted chamber
        </p>
        <h1 className="font-display text-3xl mb-3">Not authorized</h1>
        <p className="text-cream/65 leading-relaxed mb-8">
          {signedIn
            ? "This sanctum is open only to JUBAAN admins. Your account doesn't have access."
            : "Sign in with an admin account to view the club's registers."}
        </p>
        <Link href={signedIn ? "/" : "/login"} className="btn-gold px-8 py-3 text-sm">
          {signedIn ? "← Back home" : "Sign in"}
        </Link>
      </div>
    </div>
  );
}

export default async function AdminPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="pt-[72px] min-h-[80svh] flex items-center justify-center px-5">
        <div className="max-w-md text-center rounded-3xl border border-gold/25 bg-coal/70 p-10">
          <BodhiLeaf className="w-12 h-14 text-gold mx-auto mb-6" glow />
          <h1 className="font-display text-3xl mb-3">Supabase not connected</h1>
          <p className="text-cream/65 leading-relaxed">The admin panel needs your Supabase keys.</p>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=%2Fadmin");
  if (!isAdminEmail(user.email)) return <NotAuthorized signedIn />;

  // NOTE: these selects rely on migration 004's admin RLS policies
  // (public.is_jubaan_admin()) — run it in the SQL editor if tables come
  // back empty for an admin.
  const [{ data: members }, { data: applications }, { data: rsvps }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id,full_name,email,roll_number,branch,semester,home_state,home_district,phone,onboarding_completed,created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("volunteer_applications")
      .select("id,full_name,track,track_roles,assigned_role,skills,prior_experience,why_join,phone,portfolio_url,created_at,user_id")
      .order("created_at", { ascending: false }),
    supabase
      .from("rsvps")
      .select("created_at,user_id,events(title,event_date)")
      .order("created_at", { ascending: false }),
  ]);

  const memberRows = (members ?? []) as MemberRow[];

  // Map user_id -> profile for application + rsvp enrichment.
  const byId = new Map<string, MemberRow>();
  for (const m of memberRows) byId.set(m.id, m);

  type AppRaw = Omit<ApplicationRow, "email"> & { user_id: string };
  const applicationRows: ApplicationRow[] = ((applications ?? []) as AppRaw[]).map((a) => ({
    id: a.id,
    full_name: a.full_name,
    track: a.track,
    track_roles: a.track_roles ?? [],
    assigned_role: a.assigned_role,
    skills: a.skills ?? [],
    prior_experience: a.prior_experience,
    why_join: a.why_join,
    phone: a.phone,
    portfolio_url: a.portfolio_url,
    created_at: a.created_at,
    email: byId.get(a.user_id)?.email ?? "",
  }));

  type RsvpRaw = {
    created_at: string | null;
    user_id: string;
    events:
      | { title: string | null; event_date: string | null }
      | { title: string | null; event_date: string | null }[]
      | null;
  };
  const rsvpRows: RsvpRow[] = ((rsvps ?? []) as RsvpRaw[]).map((r) => {
    const p = byId.get(r.user_id);
    const ev = Array.isArray(r.events) ? r.events[0] : r.events;
    return {
      event_title: ev?.title ?? "(deleted event)",
      event_date: ev?.event_date ?? null,
      member_name: p?.full_name ?? "(unknown)",
      member_email: p?.email ?? "",
      rsvpd_at: r.created_at,
    };
  });

  return (
    <div className="pt-[72px]">
      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-14 pb-24">
        <p className="text-gold tracking-[0.35em] uppercase text-xs font-semibold mb-3">
          Admin sanctum
        </p>
        <h1 className="font-display text-4xl md:text-5xl mb-3">
          The club <span className="text-gradient-gold">registers</span>
        </h1>
        <p className="text-cream/60 max-w-2xl leading-relaxed mb-10">
          Every member, every application and every RSVP — no database digging.
          Search any table, or export it as CSV for your records. Signed in as{" "}
          <span className="text-goldsoft">{user.email}</span>.
        </p>
        <AdminTables members={memberRows} applications={applicationRows} rsvps={rsvpRows} />
      </section>
    </div>
  );
}
