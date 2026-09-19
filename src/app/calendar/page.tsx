"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Reveal from "@/components/Reveal";
import BodhiLeaf from "@/components/BodhiLeaf";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { annualEvents, type AnnualEvent } from "@/lib/data";
import { getCelebrationDetail } from "@/lib/celebrations";
import type { User } from "@supabase/supabase-js";

type CalEvent = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  flagship: boolean;
  note: string;
  location?: string;
  fromDb?: boolean;
};

type EventRow = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  is_flagship: boolean;
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

/** Academic year Aug 2026 -> Jul 2027 */
const YEAR_MONTHS: { y: number; m: number }[] = [
  { y: 2026, m: 7 }, { y: 2026, m: 8 }, { y: 2026, m: 9 }, { y: 2026, m: 10 },
  { y: 2026, m: 11 }, { y: 2027, m: 0 }, { y: 2027, m: 1 }, { y: 2027, m: 2 },
  { y: 2027, m: 3 }, { y: 2027, m: 4 }, { y: 2027, m: 5 }, { y: 2027, m: 6 },
];

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function fmtLong(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function daysUntil(iso: string, todayISO: string): number {
  const a = new Date(todayISO + "T00:00:00").getTime();
  const b = new Date(iso + "T00:00:00").getTime();
  return Math.round((b - a) / 86400000);
}

function monthCells(y: number, m: number): (number | null)[] {
  const startDay = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const arr: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) arr.push(null);
  for (let d = 1; d <= days; d++) arr.push(d);
  return arr;
}

export default function CalendarPage() {
  const reduce = useReducedMotion();
  const todayISO = useMemo(() => toISO(new Date()), []);
  const [events, setEvents] = useState<CalEvent[]>(() =>
    annualEvents.map((e: AnnualEvent, i: number) => ({
      id: `seed-${i}`, title: e.title, date: e.date, flagship: e.flagship, note: e.note,
    }))
  );
  const [user, setUser] = useState<User | null>(null);
  const [active, setActive] = useState<CalEvent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", date: todayISO, location: "", description: "", flagship: false });
  const [saving, setSaving] = useState(false);
  const monthRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    createClient().auth.getUser().then(({ data }) => setUser(data.user ?? null));
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    let alive = true;
    (async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("events")
          .select("id,title,description,event_date,location,is_flagship")
          .order("event_date", { ascending: true });
        if (error) throw error;
        if (!alive) return;
        const rows = (data ?? []) as unknown as EventRow[];
        if (rows.length > 0) {
          setEvents(rows.map((e) => ({
            id: String(e.id), title: e.title, date: e.event_date, flagship: !!e.is_flagship,
            note: e.description ?? "", location: e.location ?? undefined, fromDb: true,
          })));
        } // else: keep the seeded fallback already in state
      } catch {
        // keep the seeded fallback already in state
      }
    })();
    return () => { alive = false; };
  }, []);

  const byDate = useMemo(() => {
    const m = new Map<string, CalEvent[]>();
    for (const e of events) {
      const arr = m.get(e.date) ?? [];
      arr.push(e);
      m.set(e.date, arr);
    }
    return m;
  }, [events]);

  const upcoming = useMemo(
    () => events.filter((e) => e.date >= todayISO).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4),
    [events, todayISO]
  );

  const flagshipCount = useMemo(() => events.filter((e) => e.flagship).length, [events]);

  const jumpTo = (i: number) => {
    monthRefs.current[i]?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  };

  const addEvent = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!form.title.trim() || !isSupabaseConfigured() || !user) return;
    setSaving(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("events")
        .insert({
          title: form.title.trim(),
          description: form.description.trim() || null,
          event_date: form.date,
          location: form.location.trim() || null,
          is_flagship: form.flagship,
          created_by: user.id,
        })
        .select("id,title,description,event_date,location,is_flagship")
        .single();
      if (error) throw error;
      const row = data as unknown as EventRow;
      setEvents((prev) => [
        ...prev,
        { id: String(row.id), title: row.title, date: row.event_date, flagship: !!row.is_flagship, note: row.description ?? "", location: row.location ?? undefined, fromDb: true },
      ]);
      setShowForm(false);
      setForm({ title: "", date: form.date, location: "", description: "", flagship: false });
    } catch {
      alert("Could not save the event. Please check your Supabase setup and try again.");
    } finally {
      setSaving(false);
    }
  };

  const activeDetail = active ? getCelebrationDetail(active.title) : null;

  return (
    <div className="pt-[72px]">
      {/* header */}
      <section className="relative max-w-7xl mx-auto px-5 md:px-8 pt-14 pb-8 text-center overflow-hidden">
        {!reduce && (
          <>
            <BodhiLeaf className="absolute top-16 left-[8%] w-10 h-12 text-gold/30 animate-drift" />
            <BodhiLeaf className="absolute top-28 right-[10%] w-14 h-16 text-bodhi/30 animate-drift" />
          </>
        )}
        <Reveal>
          <p className="text-gold tracking-[0.35em] uppercase text-xs font-semibold mb-4">The JUBAAN year · Aug 2026 – Jul 2027</p>
          <h1 className="font-display text-5xl md:text-6xl mb-4">Celebration <span className="text-gradient-gold">Calendar</span></h1>
          <p className="text-cream/65 text-lg max-w-2xl mx-auto">
            Every festival, jayanti and heritage evening of the year — flagship celebrations
            in gold, community gatherings in green. Tap any event for the full story.
          </p>
          <p className="text-muted text-xs mt-3">Festival dates follow the lunar calendar and are provisional.</p>
        </Reveal>
      </section>

      {/* up next strip */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pb-10">
        <Reveal className="flex items-end justify-between mb-5">
          <h2 className="font-display text-2xl md:text-3xl">Up <span className="text-gradient-gold">next</span></h2>
          <span className="text-xs text-muted tracking-widest uppercase">{events.length} events · {flagshipCount} flagship</span>
        </Reveal>
        <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {upcoming.map((e, i) => {
            const n = daysUntil(e.date, todayISO);
            return (
              <Reveal key={e.id} delay={i * 0.06} className="shrink-0 snap-start">
                <motion.button
                  whileHover={reduce ? undefined : { y: -5 }}
                  onClick={() => setActive(e)}
                  className={`w-72 text-left rounded-3xl border p-6 transition-colors duration-300 ${
                    e.flagship
                      ? "border-gold/40 bg-gradient-to-br from-gold/15 via-ember/70 to-ember/70 shadow-[0_0_32px_rgba(217,164,65,0.12)]"
                      : "border-cream/10 bg-ember/60 hover:border-bodhi/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[11px] font-bold tracking-[0.2em] uppercase ${e.flagship ? "text-gold" : "text-bodhi"}`}>
                      {n === 0 ? "Today" : n === 1 ? "Tomorrow" : `In ${n} days`}
                    </span>
                    {e.flagship && (
                      <span className="px-2 py-0.5 rounded-full bg-gold text-ink text-[10px] font-bold tracking-widest uppercase">Flagship</span>
                    )}
                  </div>
                  <p className="font-display text-xl mb-1.5 leading-snug">{e.title}</p>
                  <p className="text-xs text-muted">{fmtLong(e.date)}{e.location ? ` · ${e.location}` : ""}</p>
                </motion.button>
              </Reveal>
            );
          })}
          {upcoming.length === 0 && (
            <p className="text-muted text-sm">The year has wound down — see you next season.</p>
          )}
        </div>
      </section>

      {/* month jump */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 pb-8">
        <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {YEAR_MONTHS.map(({ y, m }, i) => (
            <button
              key={`${y}-${m}`}
              onClick={() => jumpTo(i)}
              className="shrink-0 px-4 py-1.5 rounded-full border border-cream/15 text-xs text-cream/70 hover:border-gold hover:text-gold transition-colors"
            >
              {MONTHS[m].slice(0, 3)} {String(y).slice(2)}
            </button>
          ))}
        </div>
      </div>

      {/* 12-month grid */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pb-14">
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {YEAR_MONTHS.map(({ y, m }, mi) => {
            const cells = monthCells(y, m);
            const prefix = `${y}-${String(m + 1).padStart(2, "0")}`;
            const monthEvts = events
              .filter((e) => e.date.startsWith(prefix))
              .sort((a, b) => a.date.localeCompare(b.date));
            return (
              <Reveal key={prefix} delay={Math.min((mi % 3) * 0.06, 0.18)}>
                <article
                  ref={(el) => { monthRefs.current[mi] = el; }}
                  className="rounded-[28px] border border-cream/10 bg-coal/60 p-6 hover:border-gold/30 transition-colors duration-500 scroll-mt-28"
                >
                  <div className="flex items-baseline justify-between mb-4">
                    <h3 className="font-display text-2xl">
                      {MONTHS[m]} <span className="text-gold">{y}</span>
                    </h3>
                    <span className="text-[11px] text-muted tracking-widest uppercase">
                      {monthEvts.length} event{monthEvts.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] tracking-widest text-muted mb-1.5">
                    {WEEKDAYS.map((d, i) => <div key={i} className="py-0.5">{d}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {cells.map((d, i) => {
                      if (d === null) return <div key={`x-${i}`} />;
                      const iso = `${prefix}-${String(d).padStart(2, "0")}`;
                      const evs = byDate.get(iso) ?? [];
                      const hasFlag = evs.some((e) => e.flagship);
                      return (
                        <div
                          key={iso}
                          className={`relative aspect-square rounded-lg flex items-center justify-center text-[11px] ${
                            iso === todayISO
                              ? "bg-gold text-ink font-bold"
                              : evs.length > 0
                                ? hasFlag
                                  ? "bg-gold/20 text-gold font-semibold"
                                  : "bg-bodhi/20 text-bodhi font-semibold"
                                : "text-cream/40"
                          }`}
                        >
                          {d}
                        </div>
                      );
                    })}
                  </div>
                  {monthEvts.length > 0 ? (
                    <ul className="mt-4 space-y-2">
                      {monthEvts.map((e) => (
                        <li key={e.id}>
                          <button
                            onClick={() => setActive(e)}
                            className="w-full text-left flex items-center gap-3 rounded-xl px-3 py-2 border border-transparent hover:border-gold/30 hover:bg-gold/5 transition-all duration-300 group"
                          >
                            <span className={`w-2 h-2 rounded-full shrink-0 ${e.flagship ? "bg-gold shadow-[0_0_8px_rgba(217,164,65,0.9)]" : "bg-bodhi"}`} />
                            <span className="text-sm text-cream/75 group-hover:text-cream transition-colors flex-1">
                              {new Date(e.date + "T00:00:00").getDate()} {MONTHS[m].slice(0, 3)} · {e.title}
                            </span>
                            <span className="text-gold/50 group-hover:text-gold group-hover:translate-x-0.5 transition-all">→</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-xs text-muted italic">A quiet month on the circuit.</p>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* add event */}
      <section className="max-w-3xl mx-auto px-5 md:px-8 pb-20">
        <Reveal className="rounded-[28px] border border-cream/10 bg-ember/60 p-7 md:p-9">
          <h3 className="font-display text-2xl mb-2">Add a community gathering</h3>
          <p className="text-sm text-muted mb-6">Signed-in members can propose events for the sangha calendar.</p>
          {user ? (
            <>
              <button
                onClick={() => setShowForm(!showForm)}
                className="w-full py-3.5 rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-ink transition-all duration-300 text-sm font-semibold"
              >
                {showForm ? "Close form" : "+ Propose an event"}
              </button>
              <AnimatePresence>
                {showForm && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={addEvent}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 space-y-3">
                      <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Event title" className="w-full rounded-xl bg-ink border border-cream/15 px-4 py-2.5 text-sm focus:border-gold outline-none placeholder:text-muted" />
                      <div className="grid grid-cols-2 gap-3">
                        <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="rounded-xl bg-ink border border-cream/15 px-4 py-2.5 text-sm focus:border-gold outline-none [color-scheme:dark]" />
                        <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" className="rounded-xl bg-ink border border-cream/15 px-4 py-2.5 text-sm focus:border-gold outline-none placeholder:text-muted" />
                      </div>
                      <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={2} className="w-full rounded-xl bg-ink border border-cream/15 px-4 py-2.5 text-sm focus:border-gold outline-none placeholder:text-muted" />
                      <label className="flex items-center gap-2 text-sm text-cream/70 cursor-pointer">
                        <input type="checkbox" checked={form.flagship} onChange={(e) => setForm({ ...form, flagship: e.target.checked })} className="accent-[#d9a441] w-4 h-4" />
                        Flagship event
                      </label>
                      <button disabled={saving} className="w-full py-3 rounded-full bg-gold text-ink font-semibold text-sm hover:bg-goldsoft transition-colors disabled:opacity-50">
                        {saving ? "Saving…" : "Publish event"}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </>
          ) : (
            <a href="/login" className="block text-center w-full py-3.5 rounded-full border border-cream/20 text-cream/70 hover:border-gold hover:text-gold transition-all duration-300 text-sm">
              Sign in to propose events
            </a>
          )}
        </Reveal>
      </section>

      {/* event detail modal */}
      <AnimatePresence>
        {active && activeDetail && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-ink/80 backdrop-blur-sm"
            onClick={() => setActive(null)}
          >
            <motion.div
              key="modal"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 60, scale: 0.96 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full sm:max-w-xl max-h-[88vh] overflow-y-auto rounded-t-[28px] sm:rounded-[28px] border border-gold/25 bg-coal p-7 md:p-9 shadow-[0_0_80px_rgba(217,164,65,0.15)]"
              role="dialog"
              aria-modal="true"
              aria-label={active.title}
            >
              <button
                onClick={() => setActive(null)}
                aria-label="Close"
                className="absolute top-5 right-5 w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center text-cream/60 hover:border-gold hover:text-gold transition-colors"
              >
                ✕
              </button>
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                {active.flagship && (
                  <span className="px-3 py-1 rounded-full bg-gold text-ink text-[10px] font-bold tracking-widest uppercase">Flagship</span>
                )}
                <span className="text-xs tracking-[0.2em] uppercase text-gold">{fmtLong(active.date)}</span>
              </div>
              <h3 className="font-display text-3xl md:text-4xl mb-1.5 pr-10">{active.title}</h3>
              <p className="text-sm text-muted mb-6">📍 {active.location ?? activeDetail.venue}</p>

              <div className="space-y-5">
                <div>
                  <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-2">What we celebrate</p>
                  <p className="text-cream/75 leading-relaxed">{activeDetail.what}</p>
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-2">How JUBAAN celebrates</p>
                  <p className="text-cream/75 leading-relaxed">{activeDetail.how}</p>
                </div>
                {active.note && !celebrationDetailsKnown(active.title) && (
                  <p className="text-sm text-muted italic">{active.note}</p>
                )}
                {activeDetail.provisional && (
                  <p className="text-xs text-saffron/90 bg-saffron/10 border border-saffron/25 rounded-xl px-4 py-2.5">
                    Date is provisional — festival dates follow the lunar calendar and will be confirmed closer to the season.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3 mt-8">
                <a
                  href="/events"
                  className="px-7 py-3 rounded-full bg-gold text-ink font-semibold text-sm hover:bg-goldsoft transition-colors"
                >
                  RSVP on the Events page →
                </a>
                <button
                  onClick={() => setActive(null)}
                  className="px-7 py-3 rounded-full border border-cream/25 text-sm hover:border-gold hover:text-gold transition-colors"
                >
                  Back to calendar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** True when we have curated copy for this title (avoids duplicating the seed note). */
function celebrationDetailsKnown(title: string): boolean {
  return getCelebrationDetail(title).what !== "A JUBAAN community gathering.";
}
