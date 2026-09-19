"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Reveal from "@/components/Reveal";
import BodhiLeaf from "@/components/BodhiLeaf";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { annualEvents } from "@/lib/data";
import type { User } from "@supabase/supabase-js";

type DbEvent = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  is_flagship: boolean;
  rsvpCount?: number;
};

type EventRow = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  is_flagship: boolean;
};

type RsvpCountRow = { event_id: string; rsvp_count: number };
type RsvpRow = { event_id: string };

const FILTERS = [
  ["all", "All gatherings"],
  ["upcoming", "Upcoming"],
  ["flagship", "Flagship"],
] as const;
type Filter = (typeof FILTERS)[number][0];

function seedEvents(): DbEvent[] {
  return annualEvents.map((e, i) => ({
    id: `seed-${i}`,
    title: e.title,
    description: e.note,
    event_date: e.date,
    location: "NIT Jalandhar",
    is_flagship: e.flagship,
    rsvpCount: 0,
  }));
}

export default function EventsPage() {
  const reduce = useReducedMotion();
  const router = useRouter();
  const [events, setEvents] = useState<DbEvent[]>(() => (isSupabaseConfigured() ? [] : seedEvents()));
  const [loading, setLoading] = useState(() => isSupabaseConfigured());
  const [user, setUser] = useState<User | null>(null);
  const [myRsvps, setMyRsvps] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<Filter>("all");
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    createClient().auth.getUser().then(({ data }) => setUser(data.user ?? null));
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    (async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("events")
          .select("id,title,description,event_date,location,is_flagship")
          .order("event_date", { ascending: true });
        if (error) throw error;
        const rows = (data ?? []) as unknown as EventRow[];
        if (rows.length > 0) {
          // One safe aggregate call for public counts (no user ids exposed).
          const { data: counts } = await supabase.rpc("event_rsvp_counts");
          const countMap = new Map(
            (((counts ?? []) as unknown) as RsvpCountRow[]).map((c) => [String(c.event_id), Number(c.rsvp_count) || 0])
          );
          setEvents(rows.map((e) => ({ ...e, rsvpCount: countMap.get(String(e.id)) ?? 0 })));
        } else {
          setEvents(seedEvents());
        }
      } catch {
        setEvents(seedEvents());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!user || !isSupabaseConfigured()) return;
    (async () => {
      try {
        const { data } = await createClient().from("rsvps").select("event_id").eq("user_id", user.id);
        const rows = (data ?? []) as unknown as RsvpRow[];
        setMyRsvps(new Set(rows.map((r) => String(r.event_id))));
      } catch { /* ignore */ }
    })();
  }, [user]);

  const toggleRsvp = async (ev: DbEvent) => {
    if (!user) { router.push("/login"); return; }
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

  const stats = useMemo(() => ({
    total: events.length,
    flagship: events.filter((e) => e.is_flagship).length,
    upcoming: events.filter((e) => e.event_date >= todayISO).length,
    going: events.reduce((n, e) => n + (e.rsvpCount ?? 0), 0),
  }), [events, todayISO]);

  return (
    <div className="pt-[72px]">
      {/* header */}
      <section className="relative max-w-7xl mx-auto px-5 md:px-8 pt-14 pb-8 text-center overflow-hidden">
        {!reduce && (
          <>
            <BodhiLeaf className="absolute top-20 left-[10%] w-10 h-12 text-gold/30 animate-drift" />
            <BodhiLeaf className="absolute top-32 right-[12%] w-12 h-14 text-saffron/30 animate-drift" />
          </>
        )}
        <Reveal>
          <p className="text-gold tracking-[0.35em] uppercase text-xs font-semibold mb-4">Gatherings of the sangha</p>
          <h1 className="font-display text-5xl md:text-6xl mb-4">All <span className="text-gradient-gold">Events</span></h1>
          <p className="text-cream/65 text-lg max-w-2xl mx-auto">
            Every celebration, jayanti and heritage evening — RSVP to the ones
            you&apos;ll attend and walk with your fellow travellers.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="flex justify-center gap-8 md:gap-12 mt-8 flex-wrap">
          {[
            [stats.total, "gatherings"],
            [stats.flagship, "flagship"],
            [stats.upcoming, "upcoming"],
            [stats.going, "RSVPs"],
          ].map(([n, label]) => (
            <div key={label} className="text-center">
              <p className="font-display text-3xl md:text-4xl text-gold">{n}</p>
              <p className="text-[11px] tracking-[0.25em] uppercase text-muted mt-1">{label}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* filters */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 pb-10">
        <Reveal className="flex justify-center gap-2 flex-wrap">
          <div className="flex gap-2 p-1 rounded-full border border-cream/15 bg-ink/60">
            {FILTERS.map(([k, label]) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`relative px-6 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 ${
                  filter === k ? "text-ink" : "text-cream/60 hover:text-cream"
                }`}
              >
                {filter === k && (
                  <motion.span
                    layoutId="events-filter-pill"
                    className="absolute inset-0 rounded-full bg-gold shadow-[0_0_24px_rgba(217,164,65,0.35)]"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      {/* cards */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pb-20">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-[28px] border border-cream/10 bg-ember/50 p-7 animate-pulse">
                <div className="h-4 w-24 rounded bg-cream/10 mb-4" />
                <div className="h-7 w-3/4 rounded bg-cream/10 mb-3" />
                <div className="h-3 w-full rounded bg-cream/10 mb-2" />
                <div className="h-3 w-2/3 rounded bg-cream/10" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {visible.map((e) => {
                  const past = e.event_date < todayISO;
                  const rsvpd = myRsvps.has(e.id);
                  const d = new Date(e.event_date + "T00:00:00");
                  return (
                    <motion.article
                      layout
                      key={e.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={reduce ? undefined : { y: -7 }}
                      className={`group relative rounded-[28px] border p-7 flex flex-col overflow-hidden transition-shadow duration-500 ${
                        e.is_flagship
                          ? "border-gold/35 bg-gradient-to-b from-gold/12 via-ember/70 to-ember/70 hover:shadow-[0_18px_60px_rgba(217,164,65,0.18)]"
                          : "border-cream/10 bg-ember/60 hover:border-bodhi/40 hover:shadow-[0_18px_60px_rgba(111,160,111,0.12)]"
                      } ${past ? "opacity-55" : ""}`}
                    >
                      {e.is_flagship && !reduce && (
                        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gold/15 blur-3xl group-hover:bg-gold/25 transition-colors duration-700" />
                      )}
                      <div className="relative flex items-start justify-between gap-4 mb-5">
                        <div className="flex items-center gap-3">
                          <div className={`rounded-2xl px-3.5 py-2 text-center border ${e.is_flagship ? "border-gold/40 bg-gold/10" : "border-cream/15 bg-ink/50"}`}>
                            <p className={`font-display text-2xl leading-none ${e.is_flagship ? "text-gold" : "text-cream"}`}>
                              {d.getDate()}
                            </p>
                            <p className="text-[10px] tracking-[0.18em] uppercase text-muted mt-1">
                              {d.toLocaleDateString("en-IN", { month: "short" })} &rsquo;{String(d.getFullYear()).slice(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-[11px] tracking-[0.2em] uppercase text-muted">
                              {d.toLocaleDateString("en-IN", { weekday: "long" })}
                            </p>
                            {past && (
                              <span className="inline-block mt-1 px-2 py-0.5 rounded-full border border-cream/20 text-[10px] uppercase tracking-widest text-muted">
                                Ended
                              </span>
                            )}
                          </div>
                        </div>
                        {e.is_flagship && (
                          <span className="shrink-0 px-2.5 py-1 rounded-full bg-gold text-ink text-[10px] font-bold tracking-widest uppercase">
                            Flagship
                          </span>
                        )}
                      </div>

                      <h3 className="relative font-display text-2xl leading-snug mb-2">{e.title}</h3>
                      {e.location && (
                        <p className="relative text-xs text-muted mb-3 flex items-center gap-1.5">
                          <span className="text-gold">✦</span> {e.location}
                        </p>
                      )}
                      {e.description && (
                        <p className="relative text-sm text-cream/60 leading-relaxed mb-6 flex-1 line-clamp-3">{e.description}</p>
                      )}

                      <div className="relative flex items-center justify-between mt-auto pt-4 border-t border-cream/10">
                        <span className="text-xs text-muted">
                          <span className="font-display text-base text-cream/90 mr-1">{e.rsvpCount ?? 0}</span>
                          going
                        </span>
                        {!past && (
                          <button
                            onClick={() => toggleRsvp(e)}
                            disabled={busy === e.id}
                            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 disabled:opacity-50 ${
                              rsvpd
                                ? "bg-bodhideep/70 border border-bodhi/60 text-bodhi hover:border-bodhi"
                                : "bg-gold text-ink hover:bg-goldsoft hover:shadow-[0_0_24px_rgba(217,164,65,0.45)]"
                            }`}
                          >
                            {busy === e.id ? "…" : rsvpd ? "✓ Going" : "RSVP"}
                          </button>
                        )}
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {visible.length === 0 && (
              <div className="text-center py-16">
                <BodhiLeaf className="w-12 h-14 text-gold/40 mx-auto mb-5" />
                <p className="font-display text-2xl mb-2">Nothing here yet</p>
                <p className="text-muted text-sm">No events match this filter — try another view.</p>
              </div>
            )}
          </>
        )}

        <Reveal className="text-center mt-14">
          <p className="text-muted text-sm mb-4">Want the full year at a glance?</p>
          <a
            href="/calendar"
            className="inline-block px-8 py-3.5 rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-ink transition-all duration-300 text-sm font-semibold"
          >
            Open the celebration calendar →
          </a>
        </Reveal>
      </section>
    </div>
  );
}
