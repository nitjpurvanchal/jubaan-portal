"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "@/components/Reveal";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type Rsvp = { event_id: string; title: string; date: string; location: string | null; flagship: boolean };
type Mine = { id: string; title: string; date: string; flagship: boolean };

export default function DashboardClient({ rsvps: initial, mine }: { rsvps: Rsvp[]; mine: Mine[] }) {
  const [rsvps, setRsvps] = useState<Rsvp[]>(initial);

  const cancel = async (eventId: string) => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("rsvps").delete().eq("event_id", eventId).eq("user_id", user.id);
    setRsvps((p) => p.filter((r) => r.event_id !== eventId));
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <Reveal className="rounded-3xl border border-cream/10 bg-coal/60 p-7">
        <h2 className="font-display text-2xl mb-1">Your RSVPs</h2>
        <p className="text-muted text-sm mb-5">Gatherings you've marked yourself going to.</p>
        {rsvps.length === 0 ? (
          <p className="text-muted text-sm">
            Nothing yet — <Link href="/events" className="text-gold hover:text-goldsoft">find a gathering</Link> to join.
          </p>
        ) : (
          <ul className="space-y-3">
            <AnimatePresence>
              {rsvps.map((r) => (
                <motion.li
                  key={r.event_id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  className="rounded-2xl border border-cream/10 bg-ink/50 p-4 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-semibold text-sm">
                      {r.flagship && <span className="text-gold mr-1.5">★</span>}{r.title}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {r.date} {r.location ? `· ${r.location}` : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => cancel(r.event_id)}
                    className="text-xs px-3.5 py-2 rounded-full border border-cream/20 text-cream/60 hover:border-red-400/60 hover:text-red-400 transition-colors shrink-0"
                  >
                    Cancel
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </Reveal>

      <Reveal delay={0.1} className="rounded-3xl border border-cream/10 bg-coal/60 p-7">
        <h2 className="font-display text-2xl mb-1">Events you created</h2>
        <p className="text-muted text-sm mb-5">Published by you to the community calendar.</p>
        {mine.length === 0 ? (
          <p className="text-muted text-sm">
            You haven't published any events yet — <Link href="/calendar" className="text-gold hover:text-goldsoft">add one from the calendar</Link>.
          </p>
        ) : (
          <ul className="space-y-3">
            {mine.map((e) => (
              <li key={e.id} className="rounded-2xl border border-cream/10 bg-ink/50 p-4">
                <p className="font-semibold text-sm">
                  {e.flagship && <span className="text-gold mr-1.5">★</span>}{e.title}
                </p>
                <p className="text-xs text-muted mt-0.5">{e.date}</p>
              </li>
            ))}
          </ul>
        )}
      </Reveal>
    </div>
  );
}
