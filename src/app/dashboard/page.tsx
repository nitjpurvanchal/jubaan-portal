import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import Reveal from "@/components/Reveal";
import BodhiLeaf from "@/components/BodhiLeaf";
import DashboardClient from "./DashboardClient";

export const metadata = { title: "Dashboard — JUBAAN" };

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="pt-[72px] min-h-[80svh] flex items-center justify-center px-5">
        <div className="max-w-md text-center rounded-3xl border border-gold/25 bg-coal/70 p-10">
          <BodhiLeaf className="w-12 h-14 text-gold mx-auto mb-5" glow />
          <h1 className="font-display text-3xl mb-3">Supabase not connected</h1>
          <p className="text-cream/65 leading-relaxed mb-6">
            The dashboard needs your Supabase project keys. Add them to
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

  const [{ data: profile }, { data: rsvps }] = await Promise.all([
    supabase.from("profiles").select("full_name,email,home_state,created_at").eq("id", user.id).single(),
    supabase
      .from("rsvps")
      .select("event_id, events(id,title,event_date,location,is_flagship)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const [{ data: mine }] = await Promise.all([
    supabase.from("events").select("id,title,event_date,is_flagship").eq("created_by", user.id).order("event_date", { ascending: true }),
  ]);

  const upcoming = (rsvps ?? []).filter((r: any) => r.events && r.events.event_date >= new Date().toISOString().slice(0, 10));

  return (
    <div className="pt-[72px]">
      <section className="max-w-6xl mx-auto px-5 md:px-8 pt-14 pb-20">
        <Reveal className="flex items-center gap-5 mb-12">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold to-saffron flex items-center justify-center shadow-[0_0_36px_rgba(217,164,65,0.4)]">
            <BodhiLeaf className="w-10 h-12 text-ink" />
          </div>
          <div>
            <p className="text-gold tracking-[0.3em] uppercase text-xs font-semibold mb-1">Member dashboard</p>
            <h1 className="font-display text-4xl md:text-5xl">
              Namaste, <span className="text-gradient-gold">{profile?.full_name || "traveller"}</span>
            </h1>
            <p className="text-muted text-sm mt-1">{profile?.email ?? user.email}</p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { n: String((rsvps ?? []).length), label: "Events RSVP'd" },
            { n: String(upcoming.length), label: "Upcoming gatherings" },
            { n: String((mine ?? []).length), label: "Events you created" },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="rounded-3xl border border-cream/10 bg-coal/60 p-7 text-center">
              <p className="font-display text-5xl text-gradient-gold font-semibold">{s.n}</p>
              <p className="text-muted text-sm mt-2">{s.label}</p>
            </Reveal>
          ))}
        </div>

        <DashboardClient
          rsvps={(rsvps ?? []).map((r: any) => ({
            event_id: String(r.event_id),
            title: r.events?.title ?? "Event",
            date: r.events?.event_date ?? "",
            location: r.events?.location ?? null,
            flagship: !!r.events?.is_flagship,
          }))}
          mine={(mine ?? []).map((e: any) => ({
            id: String(e.id),
            title: e.title,
            date: e.event_date,
            flagship: !!e.is_flagship,
          }))}
        />

        <Reveal className="mt-10 flex flex-wrap gap-4">
          <Link href="/events" className="px-7 py-3.5 rounded-full bg-gold text-ink font-semibold hover:bg-goldsoft transition-colors">
            Browse events
          </Link>
          <Link href="/calendar" className="px-7 py-3.5 rounded-full border border-cream/25 hover:border-gold hover:text-gold transition-colors">
            Open calendar
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
