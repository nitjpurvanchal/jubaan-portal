"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "@/components/Reveal";
import BodhiLeaf from "@/components/BodhiLeaf";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { annualEvents, type AnnualEvent } from "@/lib/data";

type CalEvent = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  flagship: boolean;
  note: string;
  location?: string;
  fromDb?: boolean;
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function CalendarPage() {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<string>(toISO(today));
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [user, setUser] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", date: toISO(today), location: "", description: "", flagship: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    createClient().auth.getUser().then(({ data }) => setUser(data.user ?? null));
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setEvents(annualEvents.map((e: AnnualEvent, i: number) => ({ id: `seed-${i}`, title: e.title, date: e.date, flagship: e.flagship, note: e.note })));
      return;
    }
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
        if (data && data.length > 0) {
          setEvents(
            data.map((e: any) => ({
              id: String(e.id),
              title: e.title,
              date: e.event_date,
              flagship: !!e.is_flagship,
              note: e.description ?? "",
              location: e.location ?? undefined,
              fromDb: true,
            }))
          );
        } else {
          setEvents(annualEvents.map((e: AnnualEvent, i: number) => ({ id: `seed-${i}`, title: e.title, date: e.date, flagship: e.flagship, note: e.note })));
        }
      } catch {
        if (alive)
          setEvents(annualEvents.map((e: AnnualEvent, i: number) => ({ id: `seed-${i}`, title: e.title, date: e.date, flagship: e.flagship, note: e.note })));
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

  const cells = useMemo(() => {
    const y = cursor.getFullYear(), mo = cursor.getMonth();
    const first = new Date(y, mo, 1);
    const startDay = first.getDay(); // 0 = Sun
    const daysInMonth = new Date(y, mo + 1, 0).getDate();
    const arr: (Date | null)[] = [];
    for (let i = 0; i < startDay; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(y, mo, d));
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [cursor]);

  const selectedEvents = byDate.get(selected) ?? [];
  const monthEvents = events
    .filter((e) => e.date.startsWith(`${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`))
    .sort((a, b) => a.date.localeCompare(b.date));

  const addEvent = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!form.title.trim() || !isSupabaseConfigured()) return;
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
      setEvents((prev) => [
        ...prev,
        { id: String(data.id), title: data.title, date: data.event_date, flagship: !!data.is_flagship, note: data.description ?? "", location: data.location ?? undefined, fromDb: true },
      ]);
      setShowForm(false);
      setForm({ title: "", date: form.date, location: "", description: "", flagship: false });
    } catch (err) {
      alert("Could not save the event. Please check your Supabase setup and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pt-[72px]">
      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-14 pb-10">
        <Reveal className="text-center mb-10">
          <p className="text-gold tracking-[0.35em] uppercase text-xs font-semibold mb-4">Sangha gatherings</p>
          <h1 className="font-display text-5xl md:text-6xl mb-4">Events <span className="text-gradient-gold">Calendar</span></h1>
          <p className="text-cream/65 text-lg max-w-2xl mx-auto">
            The JUBAAN year, mapped month by month — flagship celebrations in gold,
            community gatherings in green. Sign in to add your own events.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
          {/* month grid */}
          <Reveal className="rounded-3xl border border-cream/10 bg-coal/60 p-5 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
                className="w-11 h-11 rounded-full border border-cream/15 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
                aria-label="Previous month"
              >←</button>
              <h2 className="font-display text-2xl md:text-3xl">
                {MONTHS[cursor.getMonth()]} <span className="text-gold">{cursor.getFullYear()}</span>
              </h2>
              <button
                onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
                className="w-11 h-11 rounded-full border border-cream/15 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
                aria-label="Next month"
              >→</button>
            </div>
            <div className="grid grid-cols-7 gap-1.5 md:gap-2 text-center text-[11px] tracking-widest uppercase text-muted mb-3">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d} className="py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1.5 md:gap-2">
              {cells.map((d, i) => {
                if (!d) return <div key={`x-${i}`} />;
                const iso = toISO(d);
                const evs = byDate.get(iso) ?? [];
                const isSel = iso === selected;
                const isToday = iso === toISO(today);
                const hasFlag = evs.some((e) => e.flagship);
                return (
                  <motion.button
                    key={iso}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setSelected(iso)}
                    className={`relative aspect-square rounded-xl md:rounded-2xl border text-sm md:text-base transition-all duration-300 flex flex-col items-center justify-center gap-1
                      ${isSel ? "border-gold bg-gold/15 text-gold shadow-[0_0_20px_rgba(217,164,65,0.25)]"
                        : "border-cream/8 bg-ember/50 text-cream/80 hover:border-gold/40 hover:text-cream"}
                      ${isToday && !isSel ? "border-bodhi/60" : ""}`}
                  >
                    <span className={isToday && !isSel ? "text-bodhi font-semibold" : ""}>{d.getDate()}</span>
                    {evs.length > 0 && (
                      <span className="flex gap-1">
                        {evs.slice(0, 3).map((e, j) => (
                          <span key={j} className={`w-1.5 h-1.5 rounded-full ${e.flagship ? "bg-gold" : "bg-bodhi"}`} />
                        ))}
                      </span>
                    )}
                    {hasFlag && !isSel && <BodhiLeaf className="absolute top-1 right-1 w-3.5 h-4 text-gold/50" />}
                  </motion.button>
                );
              })}
            </div>
            <div className="flex gap-6 mt-6 text-xs text-muted">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-gold" /> Flagship event</span>
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-bodhi" /> Community event</span>
            </div>
          </Reveal>

          {/* side panel */}
          <div className="space-y-6">
            <Reveal delay={0.1} className="rounded-3xl border border-gold/20 bg-ember/70 p-6">
              <p className="text-xs tracking-[0.25em] uppercase text-gold mb-1">Selected day</p>
              <h3 className="font-display text-2xl mb-4">
                {new Date(selected + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </h3>
              <AnimatePresence mode="wait">
                {selectedEvents.length === 0 ? (
                  <motion.p key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-muted text-sm">
                    No events on this day — a quiet day on the circuit.
                  </motion.p>
                ) : (
                  <motion.ul key="list" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                    {selectedEvents.map((e) => (
                      <li key={e.id} className="rounded-2xl border border-cream/10 bg-ink/50 p-4">
                        <div className="flex items-center gap-2 mb-1">
                          {e.flagship && (
                            <span className="px-2 py-0.5 rounded-full bg-gold text-ink text-[10px] font-bold tracking-widest uppercase">Flagship</span>
                          )}
                          {e.location && <span className="text-[11px] text-muted">· {e.location}</span>}
                        </div>
                        <p className="font-semibold text-cream">{e.title}</p>
                        {e.note && <p className="text-sm text-muted mt-1">{e.note}</p>}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </Reveal>

            <Reveal delay={0.15} className="rounded-3xl border border-cream/10 bg-coal/60 p-6">
              <h3 className="font-display text-xl mb-2">This month</h3>
              {monthEvents.length === 0 ? (
                <p className="text-muted text-sm">Nothing scheduled this month yet.</p>
              ) : (
                <ul className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {monthEvents.map((e) => (
                    <li key={e.id}>
                      <button onClick={() => setSelected(e.date)} className="w-full text-left flex gap-3 items-baseline group">
                        <span className="text-gold font-display text-sm shrink-0 w-10">
                          {new Date(e.date + "T00:00:00").getDate()} {MONTHS[new Date(e.date + "T00:00:00").getMonth()].slice(0, 3)}
                        </span>
                        <span className="text-sm text-cream/75 group-hover:text-goldsoft transition-colors">
                          {e.flagship && <span className="text-gold mr-1">★</span>}{e.title}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {user ? (
                <button
                  onClick={() => { setForm((f) => ({ ...f, date: selected })); setShowForm(!showForm); }}
                  className="mt-5 w-full py-3 rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-ink transition-all duration-300 text-sm font-semibold"
                >
                  {showForm ? "Close form" : "+ Add community event"}
                </button>
              ) : (
                <a href="/login" className="mt-5 block text-center w-full py-3 rounded-full border border-cream/20 text-cream/70 hover:border-gold hover:text-gold transition-all duration-300 text-sm">
                  Sign in to add events
                </a>
              )}
              <AnimatePresence>
                {showForm && user && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={addEvent}
                    className="overflow-hidden"
                  >
                    <div className="pt-5 space-y-3">
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
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
