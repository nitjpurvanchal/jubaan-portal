"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Reveal from "@/components/Reveal";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ROLE_BADGE_STYLES, TRACK_DESCRIPTIONS } from "@/lib/volunteer";
import type { RoleName, TrackName, VolunteerApplication } from "@/lib/volunteer";

type Slot = { track: Extract<TrackName, "volunteer" | "creative">; app: VolunteerApplication | null };

const SLOT_STYLE: Record<Slot["track"], { pill: string; ring: string; title: string }> = {
  volunteer: {
    pill: "border-bodhi/60 text-bodhi bg-bodhi/10",
    ring: "hover:border-bodhi/40",
    title: "Volunteer",
  },
  creative: {
    pill: "border-saffron/60 text-saffron bg-saffron/10",
    ring: "hover:border-saffron/40",
    title: "Creative",
  },
};

function SlotCard({ track, app }: Slot) {
  const router = useRouter();
  const [withdrawing, setWithdrawing] = useState(false);
  const style = SLOT_STYLE[track];

  const withdraw = async () => {
    if (!app) return;
    const ok = window.confirm(
      `Withdraw your ${style.title.toLowerCase()} application? Your certificate for this role will be removed.`
    );
    if (!ok) return;
    if (!isSupabaseConfigured()) return;
    setWithdrawing(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("volunteer_applications")
        .delete()
        .eq("id", app.id);
      if (error) throw error;
      router.refresh();
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Could not withdraw. Please try again.");
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <Reveal
      delay={track === "creative" ? 0.08 : 0}
      className={`rounded-3xl border border-cream/10 bg-coal/60 p-7 md:p-8 relative overflow-hidden transition-colors ${style.ring}`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <span
            className={`inline-block px-4 py-1.5 rounded-full border text-[11px] font-bold tracking-[0.2em] uppercase ${style.pill}`}
          >
            {style.title}
          </span>
          <p className="text-cream/55 text-sm mt-3 leading-relaxed">{TRACK_DESCRIPTIONS[track]}</p>
        </div>
      </div>

      {app ? (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`px-5 py-2 rounded-full border text-base font-bold ${ROLE_BADGE_STYLES[(app.assigned_role as RoleName) ?? "Member"] ?? ROLE_BADGE_STYLES.Member}`}
            >
              {app.assigned_role}
            </span>
          </div>
          {(app.track_roles?.length ? app.track_roles : app.skills ?? []).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {(app.track_roles?.length ? app.track_roles : app.skills ?? []).map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border border-cream/20 text-cream/70 bg-ink/40"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/volunteer?track=${track}`}
              className="px-6 py-2.5 rounded-full bg-gold text-ink text-sm font-bold hover:bg-goldsoft transition-colors"
            >
              Edit application
            </Link>
            <button
              onClick={withdraw}
              disabled={withdrawing}
              className="px-6 py-2.5 rounded-full border border-red-400/40 text-red-300/90 text-sm font-semibold hover:bg-red-400/10 transition-colors disabled:opacity-50"
            >
              {withdrawing ? "Withdrawing…" : "Withdraw"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <p className="text-muted text-sm">No {style.title.toLowerCase()} application yet.</p>
          <Link
            href={`/volunteer?track=${track}`}
            className="shrink-0 px-7 py-3 rounded-full bg-gold text-ink text-sm font-bold hover:bg-goldsoft transition-all duration-300 shadow-[0_0_24px_rgba(217,164,65,0.3)] text-center"
          >
            Apply as {style.title.toLowerCase()} →
          </Link>
        </div>
      )}
    </Reveal>
  );
}

export default function RoleSlots({
  volunteerApp,
  creativeApp,
}: {
  volunteerApp: VolunteerApplication | null;
  creativeApp: VolunteerApplication | null;
}) {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-4">
      <SlotCard track="volunteer" app={volunteerApp} />
      <SlotCard track="creative" app={creativeApp} />
    </div>
  );
}
