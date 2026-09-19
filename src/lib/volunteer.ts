// JUBAAN volunteer system — role assignment rules + shared constants.
//
// Role assignment is fully transparent and rule-based (no black box).
// When the member chose a track on the Join CTA, the track is honoured
// first — it is their declared intent:
//   • "creative" track — stage art forms (Acting/Theatre, Dance,
//     Singing/Music, Instrumental) → "Cultural Performer"; every other
//     art form → "Creative".
//   • "volunteer" track → "Volunteer" (on-ground seva crew).
//   • "member" track → "Member" (community; interests recorded).
// Without a track (legacy applications), the skill-based rules apply:
//   1. "Cultural Performer" — any performance skill (Poetry, Dance, Music,
//      Theatre). Performance is the heart of a cultural club, so it takes
//      priority over everything else.
//   2. "Creative" — any craft skill (Painting, Photography, Design,
//      Writing, Videography, Social Media, Decoration & Rangoli).
//   3. "Volunteer" — "Organising" picked, OR prior experience mentions
//      organising / leading / coordinating, OR the "why join" note is
//      120+ characters (a strong motivation signal).
//   4. "Member" — everyone else.

export const VOLUNTEER_SKILLS = [
  "Poetry",
  "Dance",
  "Music",
  "Theatre",
  "Painting",
  "Photography",
  "Design",
  "Writing",
  "Videography",
  "Social Media",
  "Decoration & Rangoli",
  "Organising",
] as const;

/** The three paths a member can choose on the Join CTA. */
export const TRACKS = ["volunteer", "creative", "member"] as const;
export type TrackName = (typeof TRACKS)[number];

export const TRACK_LABELS: Record<TrackName, string> = {
  volunteer: "Volunteer",
  creative: "Creative",
  member: "Member",
};

export const TRACK_DESCRIPTIONS: Record<TrackName, string> = {
  volunteer:
    "On-ground seva — discipline, logistics, hospitality and the front-of-house of every gathering.",
  creative:
    "Stage & craft — act, dance, sing, write poetry, paint and shape how JUBAAN looks and sounds.",
  member:
    "Community — belong to every celebration and grow into a specialised role over time.",
};

/** On-ground seva roles offered on the Volunteer track. */
export const VOLUNTEER_SEVA_ROLES = [
  "Discipline & Crowd Management",
  "Stage & Logistics",
  "Hospitality & Guest Care",
  "Registration Desk",
  "Documentation & Photography",
  "Outreach & Promotion",
  "First-aid & Safety",
] as const;

/** Art forms offered on the Creative track. */
export const CREATIVE_ARTFORMS = [
  "Acting / Theatre",
  "Dance",
  "Singing / Music",
  "Poetry / Shayari",
  "Painting / Rangoli",
  "Instrumental",
  "Anchoring",
  "Content Writing",
] as const;

export type RoleName = "Member" | "Volunteer" | "Creative" | "Cultural Performer";

export type RoleAssignment = {
  role: RoleName;
  /** Broad track shown on the dashboard, e.g. "Performance". */
  track: string;
  /** Human-readable explanation shown to the member. */
  reason: string;
};

const PERFORMANCE_SKILLS = new Set<string>(["Poetry", "Dance", "Music", "Theatre"]);

const CREATIVE_SKILLS = new Set<string>([
  "Painting",
  "Photography",
  "Design",
  "Writing",
  "Videography",
  "Social Media",
  "Decoration & Rangoli",
]);

// Stage art forms inside the Creative track — these put a member on stage.
const CREATIVE_STAGE_ARTFORMS = new Set<string>([
  "Acting / Theatre",
  "Dance",
  "Singing / Music",
  "Instrumental",
]);
// Signals of organising/leadership experience in free text.
const ORGANISING_RE =
  /\b(organis|organiz|co-?ordinat|manag|led\b|lead(ing|er)?s?\b|volunteer(ed|ing)?|captain|coordinator|head\b|president|secretary|committee|anchored|hosted)\b/i;

const STRONG_MOTIVATION_MIN_LENGTH = 120;

function joinList(items: string[]): string {
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function assignRole(
  skills: string[],
  priorExperience: string,
  whyJoin = "",
  track?: TrackName
): RoleAssignment {
  const picked = skills.map((s) => s.trim()).filter(Boolean);

  // A chosen track is the member's declared intent — honour it first.
  if (track === "creative") {
    const stage = picked.filter((s) => CREATIVE_STAGE_ARTFORMS.has(s));
    if (stage.length > 0) {
      return {
        role: "Cultural Performer",
        track: "Performance",
        reason: `Your ${joinList(stage)} ${
          stage.length === 1 ? "art form" : "art forms"
        } put you on stage — Cultural Performers bring JUBAAN's festivals to life.`,
      };
    }
    return {
      role: "Creative",
      track: "Creativity",
      reason: `Your ${picked.length > 0 ? joinList(picked) : "chosen art forms"} ${
        picked.length === 1 ? "shapes" : "shape"
      } how JUBAAN looks and sounds — Creatives craft our performances, posters, shoots, decor and stories.`,
    };
  }
  if (track === "volunteer") {
    return {
      role: "Volunteer",
      track: "Service",
      reason: `You chose the seva path${
        picked.length > 0 ? ` — ${joinList(picked)}` : ""
      }. Volunteers run the discipline, logistics, hospitality and front-of-house of every JUBAAN gathering.`,
    };
  }
  if (track === "member") {
    return {
      role: "Member",
      track: "Community",
      reason:
        "Welcome to the sangha — as a Member you belong to every JUBAAN celebration, and you can grow into a specialised role as your talents bloom.",
    };
  }

  // Legacy path: no track chosen — fall back to skill-based rules.

  const performance = picked.filter((s) => PERFORMANCE_SKILLS.has(s));
  if (performance.length > 0) {
    return {
      role: "Cultural Performer",
      track: "Performance",
      reason: `Your ${joinList(performance)} ${
        performance.length === 1 ? "talent" : "talents"
      } put you on stage — Cultural Performers bring JUBAAN's festivals to life.`,
    };
  }

  const creative = picked.filter((s) => CREATIVE_SKILLS.has(s));
  if (creative.length > 0) {
    return {
      role: "Creative",
      track: "Creativity",
      reason: `Your ${joinList(creative)} ${
        creative.length === 1 ? "skill" : "skills"
      } shape how JUBAAN looks and sounds — Creatives craft our posters, shoots, decor and stories.`,
    };
  }

  const organised =
    picked.includes("Organising") ||
    ORGANISING_RE.test(priorExperience) ||
    whyJoin.trim().length >= STRONG_MOTIVATION_MIN_LENGTH;
  if (organised) {
    return {
      role: "Volunteer",
      track: "Service",
      reason:
        "Your organising experience and drive to serve put you on the crew — Volunteers run the logistics, hospitality and front-of-house of every JUBAAN gathering.",
    };
  }

  return {
    role: "Member",
    track: "Community",
    reason:
      "Welcome to the sangha — as a Member you are part of every JUBAAN celebration, and you can grow into a specialised role as your talents bloom.",
  };
}

/** Distinct badge styling per role for profile cards and certificates. */
export const ROLE_BADGE_STYLES: Record<RoleName, string> = {
  Member:
    "border-cream/30 text-cream/80 bg-cream/5",
  Volunteer:
    "border-bodhi/60 text-bodhi bg-bodhi/10 shadow-[0_0_18px_rgba(111,160,111,0.25)]",
  Creative:
    "border-saffron/60 text-saffron bg-saffron/10 shadow-[0_0_18px_rgba(221,122,45,0.25)]",
  "Cultural Performer":
    "border-gold text-goldsoft bg-gold/10 shadow-[0_0_22px_rgba(217,164,65,0.35)]",
};

/** Short track label per role. */
export const ROLE_TRACK: Record<RoleName, string> = {
  Member: "Community",
  Volunteer: "Service",
  Creative: "Creativity",
  "Cultural Performer": "Performance",
};

export type VolunteerApplication = {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  prior_experience: string | null;
  skills: string[];
  why_join: string | null;
  portfolio_url: string | null;
  assigned_role: string;
  status: string;
  display_on_site: boolean;
  created_at: string;
  /** Chosen join track: "volunteer" | "creative" | "member" (null for legacy rows). */
  track: string | null;
  /** The track-specific roles/artforms/interests the member picked. */
  track_roles: string[];
};

/** Deterministic, human-friendly certificate ID, e.g. JBN-2026-A1B2C3. */
export function certificateId(app: Pick<VolunteerApplication, "id" | "created_at">): string {
  const year = new Date(app.created_at).getFullYear();
  const code = app.id.replace(/-/g, "").slice(0, 6).toUpperCase();
  return `JBN-${year}-${code}`;
}

/**
 * Find the member's application for a given join track. Legacy applications
 * (null track) are matched by their assigned role, so existing single-role
 * members land in the right slot.
 */
export function applicationForTrack(
  apps: VolunteerApplication[],
  track: TrackName
): VolunteerApplication | null {
  const exact = apps.find((a) => a.track === track);
  if (exact) return exact;
  const legacyRoles: Record<TrackName, string[]> = {
    volunteer: ["Volunteer"],
    creative: ["Creative", "Cultural Performer"],
    member: ["Member"],
  };
  return (
    apps.find(
      (a) =>
        (a.track == null || a.track === "") && legacyRoles[track].includes(a.assigned_role)
    ) ?? null
  );
}

/** Highest-priority role across a member's applications (Member is the floor). */
export function primaryRole(apps: Pick<VolunteerApplication, "assigned_role">[]): RoleName {
  const order: RoleName[] = ["Cultural Performer", "Creative", "Volunteer", "Member"];
  const have = new Set(apps.map((a) => a.assigned_role));
  return order.find((r) => have.has(r)) ?? "Member";
}
