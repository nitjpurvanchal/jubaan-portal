"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { annualEvents } from "@/lib/data";

type DbEvent = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  is_flagship: boolean;
  rsvpCount?: number;
};

export default function EventsPage() {
  const [events, setEvents] = useState<DbEvent[]>([]);
  const [user, setUser] = useState<any>(null);
  const [myRsvps, setMyRsvps] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | "flagship" | "upcoming">("all");
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    createClient().auth.getUser().then(({ data }) => setUser(data.user ?? null));
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setEvents(annualEvents.map((e, i) => ({ id: `seed-${i}`, title: e.title, description: e.note, event_date: e.date, location: "NIT Jalandhar", is_flagship: e.flagship })));
      return;
    }
    (async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("events")
          .select("id,title,description,event_date,location,is_flagship")
          .order("event_date", { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) {
          const withCounts = await Promise.all(
            data.map(async (e: any) => {
              const { count } = await supabase.from("rsvps").select("*", { count: "exact", head: true }).eq("event_id", e.id);
              return { ...e, rsvpCount: count ?? 0 };
            })
          );
          setEvents(withCounts);
        } else {
          setEvents(annualEvents.map((e, i) => ({ id: `seed-${i}`, title: e.title, description: e.note, event_date: e.date, location: "NIT Jalandhar", is_flagship: e.flagship })));
        }
      } catch {
        setEvents(annualEvents.map((e, i) => ({ id: `seed-${i}`, title: e.title, description: e.note, event_date: e.date, location: "NIT Jalandhar", is_flagship: e.flagship })));
      }
    })();
  }, []);

  useEffect(() => {
    if (!user || !isSupabaseConfigured()) { setMyRsvps(new Set()); return; }
    (async () => {
      try {
        const { data } = await createClient().from("rsvps").select("event_id").eq("user_id", user.id);
        if (data) setMyRsvps(new Set(data.map((r: any) => String(r.event_id))));
      } catch { /* ignore */ }
    })();
  }, [user]);

  const toggleRsvp = async (ev: DbEvent) => {
    if (!user) { window.location.href = "/login"; return; }
    if (ev.id.startsWith("seed-")) {
      alert("RSVPs need the live Supabase database — connect it (see README) and seed events there first.");
      return;
    }
    setBusy(ev.id);
    const supabase = createClient();
    try {
      if (myRsvps.has(ev.id)) {
        await supabase.from("rsvps").delete().eq("event_id", ev.id).eq("user_id", user.id);
        setMyRsvps((s) => { const n = new Set(s); n.delete(ev.id); return n; });
        setEvents((p) => p.map((e) => e.id === ev.id ? { ...e, rsvpCount: Math.max(0, (e.rsvpCount ?? 1) - 1) } : e));
      } else {
        const { error } = await supabase.from("rsvps").insert({ event_id: ev.id, user_id: user.id });
        if (error) throw error;
        setMyRsvps((s) => new Set(s).add(ev.id));
        setEvents((p) => p.map((e) => e.id === ev.id ? { ...e, rsvpCount: (e.rsvpCount ?? 0) + 1 } : e));
      }
    } catch {
      alert("Could not update RSVP. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  const todayISO = new Date().toISOString().slice(0, 10);
  const visible = useMemo(() => {
    let list = [...events].sort((a, b) => a.event_date.localeCompare(b.event_date));
    if (filter === "flagship") list = list.filter((e) => e.is_flagship);
    if (filter === "upcoming") list = list.filter((e) => e.event_date >= todayISO);
    return list;
  }, [events, filter, todayISO]);

  return (
    <div className="pt-[72px]">
      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-14 pb-20">
        <Reveal className="text-center mb-10">
          <p className="text-gold tracking-[0.35em] uppercase text-xs font-semibold mb-4">Gatherings</p>
          <h1 className="font-display text-5xl md:text-6xl mb-4">All <span className="text-gradient-gold">Events</span></h1>
          <p className="text-cream/65 text-lg max-w-2xl mx-auto">
            Every celebration, meet and heritage evening — RSVP to the ones
            you'll attend and meet your fellow travellers.
          </p>
        </Reveal>

        <Reveal className="flex justify-center gap-3 mb-10 flex-wrap">
          {([["all", "All"], ["upcoming", "Upcoming"], ["flagship", "Flagship"]] as const).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
                filter === k
                  ? "bg-gold text-ink shadow-[0_0_24px_rgba(217,164,65,0.35)]"
                  : "border border-cream/20 text-cream/70 hover:border-gold/60 hover:text-gold"
              }`}
            >
              {label}
            </button>
          ))}
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((e, i) => {
            const past = e.event_date < todayISO;
            const rsvpd = myRsvps.has(e.id);
            return (
              <Reveal key={e.id} delay={Math.min((i % 3) * 0.07, 0.2)}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className={`h-full rounded-3xl border p-7 flex flex-col transition-colors duration-500 ${
                    e.is_flagship ? "border-gold/30 bg-gradient-to-b from-gold/10 to-ember/70" : "border-cream/10 bg-ember/60"
                  } ${past ? "opacity-60" : ""}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs tracking-[0.2em] uppercase text-gold/90">
                      {new Date(e.event_date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    {e.is_flagship && (
                      <span className="px-2.5 py-1 rounded-full bg-gold text-ink text-[10px] font-bold tracking-widest uppercase">Flagship</span>
                    )}
                  </div>
                  <h3 className="font-display text-2xl mb-2">{e.title}</h3>
                  {e.location && <p className="text-xs text-muted mb-3">📍 {e.location}</p>}
                  {e.description && <p className="text-sm text-cream/65 leading-relaxed mb-5 flex-1">{e.description}</p>}
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="text-xs text-muted">
                      {(e.rsvpCount ?? 0)} going
                      {past && " · ended"}
                    </span>
                    {!past && (
                      <button
                        onClick={() => toggleRsvp(e)}
                        disabled={busy === e.id}
                        className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 disabled:opacity-50 ${
                          rsvpd
                            ? "bg-bodhideep border border-bodhi/60 text-bodhi"
                            : "bg-gold text-ink hover:bg-goldsoft"
                        }`}
                      >
                        {busy === e.id ? "…" : rsvpd ? "✓ Going" : "RSVP"}
                      </button>
                    )}
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

        {visible.length === 0 && (
          <p className="text-center text-muted mt-10">No events match this filter.</p>
        )}
      </section>
    </div>
  );
}
