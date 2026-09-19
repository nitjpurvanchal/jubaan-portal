"use client";

import { useMemo, useState } from "react";
import type { MemberRow, ApplicationRow, EventRow, AttendeeRow } from "./page";

type Props = {
  members: MemberRow[];
  applications: ApplicationRow[];
  events: EventRow[];
  attendees: AttendeeRow[];
};

/* ------------------------------- csv export ------------------------------- */

function toCsv(rows: Record<string, string | number | null | undefined>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const esc = (v: string | number | null | undefined) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.map(esc).join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
}

function downloadCsv(filename: string, rows: Record<string, string | number | null | undefined>[]) {
  const blob = new Blob(["\uFEFF" + toCsv(rows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/* --------------------------------- ui bits --------------------------------- */

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full sm:w-72 rounded-full bg-ink/60 border border-cream/15 focus:border-gold px-5 py-2.5 text-sm text-cream placeholder:text-cream/30 outline-none transition-colors"
    />
  );
}

function ExportButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-5 py-2.5 rounded-full border border-gold/40 text-gold text-sm font-semibold hover:bg-gold hover:text-ink transition-all duration-300 active:scale-95 whitespace-nowrap"
    >
      ⬇ Export CSV
    </button>
  );
}

function Pill({ children, tone }: { children: React.ReactNode; tone: "gold" | "green" | "saffron" | "plain" }) {
  const tones = {
    gold: "border-gold/50 text-gold",
    green: "border-emerald-400/40 text-emerald-300",
    saffron: "border-orange-400/40 text-orange-300",
    plain: "border-cream/25 text-cream/70",
  } as const;
  return (
    <span className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold whitespace-nowrap ${tones[tone]}`}>
      {children}
    </span>
  );
}

function roleTone(role: string | null): "gold" | "green" | "saffron" | "plain" {
  switch ((role ?? "").toLowerCase()) {
    case "cultural performer": return "gold";
    case "creative": return "saffron";
    case "volunteer": return "green";
    default: return "plain";
  }
}

function FilterSelect({
  value, onChange, options, label,
}: {
  value: string; onChange: (v: string) => void; options: string[]; label: string;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-cream/60">
      <span className="text-xs tracking-[0.15em] uppercase">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-full bg-ink/60 border border-cream/15 focus:border-gold px-4 py-2.5 text-sm text-cream outline-none"
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function TableShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-cream/10">
      <table className="w-full text-sm min-w-[760px]">{children}</table>
    </div>
  );
}

const th = "text-left px-4 py-3 text-[11px] tracking-[0.18em] uppercase text-gold/70 font-semibold bg-ink/60 whitespace-nowrap";
const td = "px-4 py-3 text-cream/80 border-t border-cream/8 align-top";

function Section({
  eyebrow, title, count, controls, children,
}: {
  eyebrow: string; title: string; count: number;
  controls: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-cream/10 bg-coal/60 p-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-gold tracking-[0.3em] uppercase text-[11px] font-semibold mb-2">{eyebrow}</p>
          <h2 className="font-display text-2xl md:text-3xl">
            {title} <span className="text-gold/70 text-xl">· {count}</span>
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">{controls}</div>
      </div>
      {children}
    </section>
  );
}

/* -------------------------------- dashboard -------------------------------- */

const ROLE_OPTIONS = ["Member", "Volunteer", "Creative", "Cultural Performer"];
const TRACK_OPTIONS = ["volunteer", "creative", "member"];

export default function AdminDashboard({ members, applications, events, attendees }: Props) {
  const [memberQ, setMemberQ] = useState("");
  const [appQ, setAppQ] = useState("");
  const [roleF, setRoleF] = useState("");
  const [trackF, setTrackF] = useState("");
  const [eventId, setEventId] = useState(events[0]?.id ?? "");

  const filteredMembers = useMemo(() => {
    const q = memberQ.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) =>
      [m.full_name, m.roll_number, m.branch, m.home_state, m.home_district, m.email]
        .filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [members, memberQ]);

  const filteredApps = useMemo(() => {
    const q = appQ.trim().toLowerCase();
    return applications.filter((a) => {
      if (roleF && (a.assigned_role ?? "Member") !== roleF) return false;
      if (trackF && (a.track ?? "") !== trackF) return false;
      if (!q) return true;
      return [a.full_name, a.roll_number, a.track, a.assigned_role, ...(a.track_roles ?? [])]
        .filter(Boolean).join(" ").toLowerCase().includes(q);
    });
  }, [applications, appQ, roleF, trackF]);

  const eventAttendees = useMemo(
    () => attendees.filter((a) => a.event_id === eventId),
    [attendees, eventId]
  );
  const selectedEvent = events.find((e) => e.id === eventId);

  const roleCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const a of applications) {
      const r = a.assigned_role ?? "Member";
      c[r] = (c[r] ?? 0) + 1;
    }
    return c;
  }, [applications]);

  return (
    <div className="space-y-8">
      {/* role summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ROLE_OPTIONS.map((r) => (
          <div key={r} className="rounded-2xl border border-cream/10 bg-coal/60 px-5 py-4">
            <p className="text-xs tracking-[0.2em] uppercase text-cream/50 mb-1">{r}s</p>
            <p className="font-display text-3xl text-gold">{roleCounts[r] ?? 0}</p>
          </div>
        ))}
      </div>

      {/* members */}
      <Section
        eyebrow="Register I"
        title="All members"
        count={filteredMembers.length}
        controls={
          <>
            <SearchBox value={memberQ} onChange={setMemberQ} placeholder="Search name, roll, branch, state…" />
            <ExportButton onClick={() => downloadCsv("jubaan-members.csv", filteredMembers.map((m) => ({
              Name: m.full_name, Roll: m.roll_number, Email: m.email, Branch: m.branch,
              Semester: m.semester, Phone: m.phone, State: m.home_state, District: m.home_district,
              Interests: (m.interests ?? []).join("; "), Onboarded: m.onboarding_completed ? "yes" : "no",
              Joined: formatDate(m.created_at),
            })))} />
          </>
        }
      >
        <TableShell>
          <thead><tr>
            <th className={th}>Name</th><th className={th}>Roll</th><th className={th}>Branch · Sem</th>
            <th className={th}>Phone</th><th className={th}>Home</th><th className={th}>Interests</th>
          </tr></thead>
          <tbody>
            {filteredMembers.map((m) => (
              <tr key={m.id}>
                <td className={td}><span className="text-cream font-medium">{m.full_name ?? "—"}</span><br /><span className="text-cream/40 text-xs">{m.email ?? ""}</span></td>
                <td className={td}>{m.roll_number ?? "—"}</td>
                <td className={td}>{[m.branch, m.semester ? `Sem ${m.semester}` : null].filter(Boolean).join(" · ") || "—"}</td>
                <td className={td}>{m.phone ?? "—"}</td>
                <td className={td}>{[m.home_district, m.home_state].filter(Boolean).join(", ") || "—"}</td>
                <td className={td}>{(m.interests ?? []).join(", ") || "—"}</td>
              </tr>
            ))}
            {filteredMembers.length === 0 && (
              <tr><td className={td} colSpan={6}>No members found.</td></tr>
            )}
          </tbody>
        </TableShell>
      </Section>

      {/* applications */}
      <Section
        eyebrow="Register II"
        title="Volunteer applications"
        count={filteredApps.length}
        controls={
          <>
            <FilterSelect label="Role" value={roleF} onChange={setRoleF} options={ROLE_OPTIONS} />
            <FilterSelect label="Track" value={trackF} onChange={setTrackF} options={TRACK_OPTIONS} />
            <SearchBox value={appQ} onChange={setAppQ} placeholder="Search name, roll, role…" />
            <ExportButton onClick={() => downloadCsv("jubaan-applications.csv", filteredApps.map((a) => ({
              Name: a.full_name, Roll: a.roll_number, Track: a.track,
              TrackRoles: (a.track_roles ?? []).join("; "), AssignedRole: a.assigned_role,
              Skills: (a.skills ?? []).join("; "), Phone: a.phone,
              Experience: a.prior_experience, WhyJoin: a.why_join,
              Portfolio: a.portfolio_url, Applied: formatDate(a.created_at),
            })))} />
          </>
        }
      >
        <TableShell>
          <thead><tr>
            <th className={th}>Name</th><th className={th}>Role</th><th className={th}>Track picks</th>
            <th className={th}>Experience</th><th className={th}>Why join</th>
          </tr></thead>
          <tbody>
            {filteredApps.map((a) => (
              <tr key={a.id}>
                <td className={td}>
                  <span className="text-cream font-medium">{a.full_name ?? "—"}</span>
                  <br /><span className="text-cream/40 text-xs">{a.roll_number ?? ""}{a.phone ? ` · ${a.phone}` : ""}</span>
                </td>
                <td className={td}>
                  <Pill tone={roleTone(a.assigned_role)}>{a.assigned_role ?? "Member"}</Pill>
                  {a.track && <span className="block mt-1 text-cream/40 text-xs capitalize">track: {a.track}</span>}
                </td>
                <td className={td}>{(a.track_roles ?? []).join(", ") || "—"}</td>
                <td className={`${td} max-w-[260px]`}><span className="line-clamp-3">{a.prior_experience || "—"}</span></td>
                <td className={`${td} max-w-[260px]`}><span className="line-clamp-3">{a.why_join || "—"}</span></td>
              </tr>
            ))}
            {filteredApps.length === 0 && (
              <tr><td className={td} colSpan={5}>No applications found.</td></tr>
            )}
          </tbody>
        </TableShell>
      </Section>

      {/* per-event attendees */}
      <Section
        eyebrow="Register III"
        title="Who is coming"
        count={eventAttendees.length}
        controls={
          <>
            <label className="flex items-center gap-2 text-sm text-cream/60">
              <span className="text-xs tracking-[0.15em] uppercase">Event</span>
              <select
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="max-w-[280px] rounded-full bg-ink/60 border border-cream/15 focus:border-gold px-4 py-2.5 text-sm text-cream outline-none"
              >
                {events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title}{e.event_date ? ` · ${formatDate(e.event_date)}` : ""}
                  </option>
                ))}
              </select>
            </label>
            <ExportButton onClick={() => downloadCsv(`jubaan-rsvps-${selectedEvent?.title ?? "event"}.csv`, eventAttendees.map((a) => ({
              Event: selectedEvent?.title, Name: a.name, Roll: a.roll_number, Phone: a.phone,
              Role: a.assigned_role, Track: a.track, RSVPd: formatDate(a.rsvpd_at),
            })))} />
          </>
        }
      >
        {selectedEvent && (
          <p className="text-cream/50 text-sm mb-4">
            {eventAttendees.length} member{eventAttendees.length === 1 ? "" : "s"} coming to{" "}
            <span className="text-goldsoft">{selectedEvent.title}</span>
            {selectedEvent.event_date ? ` on ${formatDate(selectedEvent.event_date)}` : ""}.
          </p>
        )}
        <TableShell>
          <thead><tr>
            <th className={th}>Name</th><th className={th}>Roll</th><th className={th}>Phone</th>
            <th className={th}>Club role</th><th className={th}>RSVPd</th>
          </tr></thead>
          <tbody>
            {eventAttendees.map((a, i) => (
              <tr key={`${a.event_id}-${a.roll_number}-${i}`}>
                <td className={td}><span className="text-cream font-medium">{a.name}</span></td>
                <td className={td}>{a.roll_number ?? "—"}</td>
                <td className={td}>{a.phone ?? "—"}</td>
                <td className={td}>
                  <Pill tone={roleTone(a.assigned_role)}>{a.assigned_role ?? "Member"}</Pill>
                </td>
                <td className={td}>{formatDate(a.rsvpd_at)}</td>
              </tr>
            ))}
            {eventAttendees.length === 0 && (
              <tr><td className={td} colSpan={5}>No RSVPs for this event yet.</td></tr>
            )}
          </tbody>
        </TableShell>
      </Section>
    </div>
  );
}
