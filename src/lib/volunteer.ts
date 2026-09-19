// JUBAAN volunteer system — role assignment rules + shared constants.
//
// Role assignment is fully transparent and rule-based (no black box):
//   1. "Cultural Performer" — the member picked any performance skill
//      (Poetry, Dance, Music, Theatre). Performance is the heart of a
//      cultural club, so it takes priority over everything else.
//   2. "Creative" — the member picked any craft skill (Painting,
//      Photography, Design, Writing, Videography, Social Media,
//      Decoration & Rangoli). These members power posters, shoots,
//      stage decor and the club's visual voice.
//   3. "Volunteer" — the member picked "Organising", OR their prior
//      experience mentions organising / leading / coordinating work, OR
//      their "why join" note is 120+ characters (a strong motivation
//      signal). These members power logistics, hospitality and the
//      front-of-house of every event.
//   4. "Member" — everyone else. A full member of the sangha, welcome
//      to every gathering, and free to apply their talents as they grow.
//
// Priority order matters: a dancer who also organises is assigned
// "Cultural Performer" (rule 1 wins), because stage talent is rarer.

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
  whyJoin = ""
): RoleAssignment {
  const picked = skills.map((s) => s.trim()).filter(Boolean);

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
};

/** Deterministic, human-friendly certificate ID, e.g. JBN-2026-A1B2C3. */
export function certificateId(app: Pick<VolunteerApplication, "id" | "created_at">): string {
  const year = new Date(app.created_at).getFullYear();
  const code = app.id.replace(/-/g, "").slice(0, 6).toUpperCase();
  return `JBN-${year}-${code}`;
}
