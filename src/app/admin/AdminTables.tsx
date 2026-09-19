"use client";

import { useMemo, useState } from "react";
import type { MemberRow, ApplicationRow, RsvpRow } from "./page";

type Props = {
  members: MemberRow[];
  applications: ApplicationRow[];
  rsvps: RsvpRow[];
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

function TableShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-cream/10">
      <table className="w-full text-sm min-w-[720px]">
        {children}
      </table>
    </div>
  );
}

const th = "text-left px-4 py-3 text-[11px] tracking-[0.18em] uppercase text-gold/70 font-semibold bg-ink/60 whitespace-nowrap";
const td = "px-4 py-3 text-cream/80 border-t border-cream/8 align-top";

function Section({
  id,
  eyebrow,
  title,
  count,
  search,
  onExport,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  count: number;
  search: React.ReactNode;
  onExport: () => void;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="rounded-3xl border border-cream/10 bg-coal/60 p-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-gold tracking-[0.3em] uppercase text-[11px] font-semibold mb-2">{eyebrow}</p>
          <h2 className="font-display text-2xl md:text-3xl">
            {title} <span className="text-gold/70 text-xl">· {count}</span>
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {search}
          <ExportButton onClick={onExport} />
        </div>
      </div>
      {children}
    </section>
  );
}

/* --------------------------------- tables --------------------------------- */

export default function AdminTables({ members, applications, rsvps }: Props) {
  const [memberQ, setMemberQ] = useState("");
  const [appQ, setAppQ] = useState("");
  const [rsvpQ, setRsvpQ] = useState("");

  const filteredMembers = useMemo(() => {
    const q = memberQ.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) =>
      [m.full_name, m.email, m.roll_number, m.branch, m.home_state, m.home_district]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [members, memberQ]);

  const filteredApps = useMemo(() => {
    const q = appQ.trim().toLowerCase();
    if (!q) return applications;
    return applications.filter((a) =>
      [a.full_name, a.email, a.track, a.assigned_role, ...(a.track_roles ?? []), ...(a.skills ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [applications, appQ]);

  const filteredRsvps = useMemo(() => {
    const q = rsvpQ.trim().toLowerCase();
    if (!q) return rsvps;
    return rsvps.filter((r) =>
      [r.event_title, r.member_name, r.member_email].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [rsvps, rsvpQ]);

  const rsvpCounts = useMemo(() => {
    const map = new Map<string, { title: string; date: string | null; count: number }>();
    for (const r of rsvps) {
      const key = r.event_title;
      const cur = map.get(key) ?? { title: r.event_title, date: r.event_date, count: 0 };
      cur.count += 1;
      map.set(key, cur);
    }
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [rsvps]);

  return (
    <div className="space-y-8">
      {/* members */}
      <Section
        id="members"
        eyebrow="Register I"
        title="Members"
        count={filteredMembers.length}
        search={<SearchBox value={memberQ} onChange={setMemberQ} placeholder="Search name, roll, branch, state…" />}
        onExport={() =>
          downloadCsv(
            "jubaan-members.csv",
            filteredMembers.map((m) => ({
              Name: m.full_name,
              Email: m.email,
              Roll: m.roll_number,
              Branch: m.branch,
              Semester: m.semester,
              State: m.home_state,
              District: m.home_district,
              Phone: m.phone,
              Onboarded: m.onboarding_completed ? "yes" : "no",
              Joined: formatDate(m.created_at),
            }))
          )
        }
      >
        <TableShell>
          <thead>
            <tr>
              <th className={th}>Member</th>
              <th className={th}>Roll</th>
              <th className={th}>Branch · Sem</th>
              <th className={th}>Home</th>
              <th className={th}>Phone</th>
              <th className={th}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((m) => (
              <tr key={m.id} className="hover:bg-gold/5 transition-colors">
                <td className={td}>
                  <span className="text-cream font-semibold">{m.full_name ?? "—"}</span>
                  <span className="block text-xs text-muted">{m.email ?? ""}</span>
                </td>
                <td className={td}>{m.roll_number ?? "—"}</td>
                <td className={td}>
                  {m.branch ?? "—"}
                  {m.semester != null && <span className="text-muted"> · Sem {m.semester}</span>}
                </td>
                <td className={td}>
                  {m.home_district ? `${m.home_district}, ` : ""}{m.home_state ?? "—"}
                </td>
                <td className={td}>{m.phone ?? "—"}</td>
                <td className={td}>{formatDate(m.created_at)}</td>
              </tr>
            ))}
            {filteredMembers.length === 0 && (
              <tr><td className={td} colSpan={6}>No members match.</td></tr>
            )}
          </tbody>
        </TableShell>
      </Section>

      {/* applications */}
      <Section
        id="applications"
        eyebrow="Register II"
        title="Volunteer applications"
        count={filteredApps.length}
        search={<SearchBox value={appQ} onChange={setAppQ} placeholder="Search name, track, role…" />}
        onExport={() =>
          downloadCsv(
            "jubaan-applications.csv",
            filteredApps.map((a) => ({
              Name: a.full_name,
              Email: a.email,
              Track: a.track,
              Role: a.assigned_role,
              TrackRoles: (a.track_roles ?? []).join("; "),
              Phone: a.phone,
              Portfolio: a.portfolio_url,
              Experience: a.prior_experience,
              WhyJoin: a.why_join,
              Applied: formatDate(a.created_at),
            }))
          )
        }
      >
        <TableShell>
          <thead>
            <tr>
              <th className={th}>Applicant</th>
              <th className={th}>Path</th>
              <th className={th}>Assigned role</th>
              <th className={th}>Roles / art forms</th>
              <th className={th}>Motivation</th>
              <th className={th}>Applied</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.map((a) => (
              <tr key={a.id} className="hover:bg-gold/5 transition-colors">
                <td className={td}>
                  <span className="text-cream font-semibold">{a.full_name ?? "—"}</span>
                  <span className="block text-xs text-muted">{a.email ?? ""}</span>
                  {a.phone && <span className="block text-xs text-muted">{a.phone}</span>}
                </td>
                <td className={td}>
                  <span className="px-3 py-1 rounded-full text-xs font-bold border border-gold/40 text-goldsoft bg-gold/10 capitalize">
                    {a.track ?? "—"}
                  </span>
                </td>
                <td className={td}><span className="text-goldsoft font-semibold">{a.assigned_role ?? "—"}</span></td>
                <td className={td}>
                  <div className="flex flex-wrap gap-1.5 max-w-[260px]">
                    {(a.track_roles ?? []).map((r) => (
                      <span key={r} className="px-2.5 py-0.5 rounded-full text-xs border border-cream/20 text-cream/70">
                        {r}
                      </span>
                    ))}
                    {(a.track_roles ?? []).length === 0 && "—"}
                  </div>
                </td>
                <td className={td}>
                  <span className="block max-w-[280px] text-cream/60 leading-relaxed" title={a.why_join ?? ""}>
                    {a.why_join && a.why_join.length > 140 ? a.why_join.slice(0, 140) + "…" : (a.why_join ?? "—")}
                  </span>
                </td>
                <td className={td}>{formatDate(a.created_at)}</td>
              </tr>
            ))}
            {filteredApps.length === 0 && (
              <tr><td className={td} colSpan={6}>No applications yet.</td></tr>
            )}
          </tbody>
        </TableShell>
      </Section>

      {/* rsvps */}
      <Section
        id="rsvps"
        eyebrow="Register III"
        title="Event RSVPs"
        count={filteredRsvps.length}
        search={<SearchBox value={rsvpQ} onChange={setRsvpQ} placeholder="Search event or member…" />}
        onExport={() =>
          downloadCsv(
            "jubaan-rsvps.csv",
            filteredRsvps.map((r) => ({
              Event: r.event_title,
              EventDate: r.event_date ?? "",
              Member: r.member_name,
              Email: r.member_email,
              RSVPdOn: formatDate(r.rsvpd_at),
            }))
          )
        }
      >
        <div className="flex flex-wrap gap-2.5 mb-6">
          {rsvpCounts.map((c) => (
            <span
              key={c.title}
              className="px-4 py-2 rounded-full border border-gold/30 bg-gold/10 text-sm"
            >
              <span className="text-cream font-semibold">{c.title}</span>{" "}
              <span className="text-gold font-bold">{c.count}</span>
            </span>
          ))}
          {rsvpCounts.length === 0 && <span className="text-muted text-sm">No RSVPs yet.</span>}
        </div>
        <TableShell>
          <thead>
            <tr>
              <th className={th}>Event</th>
              <th className={th}>Member</th>
              <th className={th}>RSVP&apos;d on</th>
            </tr>
          </thead>
          <tbody>
            {filteredRsvps.map((r, i) => (
              <tr key={`${r.event_title}-${r.member_email}-${i}`} className="hover:bg-gold/5 transition-colors">
                <td className={td}>
                  <span className="text-cream font-semibold">{r.event_title}</span>
                  {r.event_date && <span className="block text-xs text-muted">{formatDate(r.event_date)}</span>}
                </td>
                <td className={td}>
                  <span className="text-cream/85">{r.member_name}</span>
                  <span className="block text-xs text-muted">{r.member_email}</span>
                </td>
                <td className={td}>{formatDate(r.rsvpd_at)}</td>
              </tr>
            ))}
            {filteredRsvps.length === 0 && (
              <tr><td className={td} colSpan={3}>No RSVPs match.</td></tr>
            )}
          </tbody>
        </TableShell>
      </Section>
    </div>
  );
}
