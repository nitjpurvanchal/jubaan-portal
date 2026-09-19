import Link from "next/link";
import { requireAdmin } from "@/lib/adminAuth";
import { createAdminClient, AdminConfigError } from "@/lib/supabase/admin";
import { logoutAdmin } from "./login/actions";
import BodhiLeaf from "@/components/BodhiLeaf";
import AdminDashboard from "./AdminTables";

export const metadata = { title: "Admin — JUBAAN", robots: "noindex,nofollow" };
export const dynamic = "force-dynamic";

export type MemberRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  roll_number: string | null;
  branch: string | null;
  semester: number | null;
  phone: string | null;
  home_state: string | null;
  home_district: string | null;
  interests: string[];
  onboarding_completed: boolean | null;
  created_at: string | null;
  photo_url: string | null;
  /** Assigned roles from ALL of the member's applications ("Member" when none). */
  roles: string[];
};

export type ApplicationRow = {
  id: string;
  user_id: string;
  full_name: string | null;
  roll_number: string | null;
  track: string | null;
  track_roles: string[];
  assigned_role: string | null;
  skills: string[];
  prior_experience: string | null;
  why_join: string | null;
  phone: string | null;
  portfolio_url: string | null;
  created_at: string | null;
};

export type EventRow = { id: string; title: string; event_date: string | null };

export type AttendeeRow = {
  event_id: string;
  name: string;
  roll_number: string | null;
  phone: string | null;
  assigned_role: string | null;
  track: string | null;
  rsvpd_at: string | null;
  photo_url: string | null;
  /** All assigned roles from the member's applications. */
  roles: string[];
};

function ConfigMissing() {
  return (
    <div className="pt-[72px] min-h-[80svh] flex items-center justify-center px-5">
      <div className="max-w-md text-center rounded-3xl border border-gold/25 bg-coal/70 p-10">
        <BodhiLeaf className="w-12 h-14 text-gold mx-auto mb-6" glow />
        <h1 className="font-display text-3xl mb-3">Service key not configured</h1>
        <p className="text-cream/65 leading-relaxed">
          Add <span className="text-goldsoft font-mono text-sm">SUPABASE_SERVICE_ROLE_KEY</span> to the
          Vercel environment variables and redeploy. The admin registers need it.
        </p>
      </div>
    </div>
  );
}

export default async function AdminPage() {
  const admin = await requireAdmin();

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (e) {
    if (e instanceof AdminConfigError) return <ConfigMissing />;
    throw e;
  }

  const [{ data: members }, { data: applications }, { data: events }, { data: rsvps }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select(
          "id,full_name,email,roll_number,branch,semester,phone,home_state,home_district,interests,onboarding_completed,created_at,photo_url"
        )
        .order("created_at", { ascending: false }),
      supabase
        .from("volunteer_applications")
        .select(
          "id,user_id,full_name,track,track_roles,assigned_role,skills,prior_experience,why_join,phone,portfolio_url,created_at"
        )
        .order("created_at", { ascending: false }),
      supabase.from("events").select("id,title,event_date").order("event_date", { ascending: true }),
      supabase.from("rsvps").select("id,event_id,user_id,created_at").order("created_at", { ascending: false }),
    ]);

  const memberRows = (members ?? []) as MemberRow[];
  const byId = new Map(memberRows.map((m) => [m.id, m]));

  type AppRaw = Omit<ApplicationRow, "roll_number">;
  const applicationRows: ApplicationRow[] = ((applications ?? []) as AppRaw[]).map((a) => ({
    ...a,
    track_roles: a.track_roles ?? [],
    skills: a.skills ?? [],
    roll_number: byId.get(a.user_id)?.roll_number ?? null,
  }));

  // Group ALL applications per member — a member can hold a volunteer AND a
  // creative application at the same time.
  const appsByUser = new Map<string, ApplicationRow[]>();
  for (const a of applicationRows) {
    const list = appsByUser.get(a.user_id);
    if (list) list.push(a);
    else appsByUser.set(a.user_id, [a]);
  }

  const rolesOf = (userId: string): string[] => {
    const apps = appsByUser.get(userId) ?? [];
    const roles = Array.from(new Set(apps.map((a) => a.assigned_role ?? "Member")));
    return roles.length > 0 ? roles : ["Member"];
  };

  // Role classification for the RSVP list: highest-priority role wins.
  const classify = (roles: string[]): string => {
    const order = ["Cultural Performer", "Creative", "Volunteer", "Member"];
    return order.find((r) => roles.includes(r)) ?? "Member";
  };

  for (const m of memberRows) {
    m.roles = rolesOf(m.id);
  }
  const eventRows = (events ?? []) as EventRow[];

  type RsvpRaw = { id: string; event_id: string; user_id: string; created_at: string | null };
  const attendeeRows: AttendeeRow[] = ((rsvps ?? []) as RsvpRaw[]).map((r) => {
    const p = byId.get(r.user_id);
    const roles = rolesOf(r.user_id);
    return {
      event_id: r.event_id,
      name: p?.full_name ?? "(unknown member)",
      roll_number: p?.roll_number ?? null,
      phone: p?.phone ?? null,
      assigned_role: classify(roles),
      track: (appsByUser.get(r.user_id) ?? [])[0]?.track ?? null,
      rsvpd_at: r.created_at,
      photo_url: p?.photo_url ?? null,
      roles,
    };
  });

  return (
    <div className="pt-[72px]">
      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-14 pb-24">
        <div className="flex flex-wrap items-start justify-between gap-6 mb-10">
          <div>
            <p className="text-gold tracking-[0.35em] uppercase text-xs font-semibold mb-3">
              Admin sanctum
            </p>
            <h1 className="font-display text-4xl md:text-5xl mb-3">
              The club <span className="text-gradient-gold">registers</span>
            </h1>
            <p className="text-cream/60 max-w-2xl leading-relaxed">
              Every member, every application, every RSVP — no database digging.
              Signed in as <span className="text-goldsoft">{admin.full_name ?? admin.roll_number}</span>{" "}
              <span className="text-cream/40">({admin.roll_number})</span>.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/admins"
              className="px-5 py-2.5 rounded-full border border-gold/40 text-gold text-sm font-semibold hover:bg-gold hover:text-ink transition-all duration-300 active:scale-95"
            >
              Manage admins
            </Link>
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full border border-cream/20 text-cream/70 text-sm hover:border-cream/50 hover:text-cream transition-all duration-300 active:scale-95"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
        <AdminDashboard
          members={memberRows}
          applications={applicationRows}
          events={eventRows}
          attendees={attendeeRows}
        />
      </section>
    </div>
  );
}
