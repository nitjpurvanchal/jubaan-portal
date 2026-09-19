import Link from "next/link";
import { requireAdmin } from "@/lib/adminAuth";
import { createAdminClient, AdminConfigError } from "@/lib/supabase/admin";
import AdminManagers, { type AdminListRow } from "./AdminManagers";

export const metadata = { title: "Manage admins — JUBAAN", robots: "noindex,nofollow" };
export const dynamic = "force-dynamic";

export default async function AdminsPage() {
  const admin = await requireAdmin();

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (e) {
    if (e instanceof AdminConfigError) {
      return (
        <div className="pt-[72px] min-h-[80svh] flex items-center justify-center px-5">
          <p className="text-cream/60">SUPABASE_SERVICE_ROLE_KEY is not configured.</p>
        </div>
      );
    }
    throw e;
  }

  const { data } = await supabase
    .from("admins")
    .select("id,roll_number,full_name,created_at")
    .order("created_at", { ascending: true });

  const admins = (data ?? []) as AdminListRow[];

  return (
    <div className="pt-[72px]">
      <section className="max-w-5xl mx-auto px-5 md:px-8 pt-14 pb-24">
        <Link href="/admin" className="text-sm text-gold/80 hover:text-gold">← Back to registers</Link>
        <p className="text-gold tracking-[0.35em] uppercase text-xs font-semibold mb-3 mt-6">
          Admin sanctum
        </p>
        <h1 className="font-display text-4xl md:text-5xl mb-3">
          Manage <span className="text-gradient-gold">admins</span>
        </h1>
        <p className="text-cream/60 max-w-2xl leading-relaxed mb-10">
          Only admins can see or change this. Signed in as{" "}
          <span className="text-goldsoft">{admin.full_name ?? admin.roll_number}</span>.
        </p>
        <AdminManagers admins={admins} selfId={admin.id} />
      </section>
    </div>
  );
}
