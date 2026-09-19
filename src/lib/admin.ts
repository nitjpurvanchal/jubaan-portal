// JUBAAN admin gating — who may open the on-site admin panel (/admin).
//
// The default admin is the club's service address. Extra admins can be added
// WITHOUT a code change via the JUBAAN_ADMIN_EMAILS env var (comma-separated,
// e.g. "a@x.com, b@y.com").
//
// IMPORTANT: keep this list in sync with the array inside
// public.is_jubaan_admin() in supabase/migrations/004_volunteer_tracks.sql —
// the env var gates the /admin page, the SQL function gates the database
// rows (RLS). Both must know an admin's email.

export const DEFAULT_ADMIN_EMAIL = "nitjpurvanchal@gmail.com";

export function getAdminEmails(): string[] {
  const fromEnv = (process.env.JUBAAN_ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return [...new Set([DEFAULT_ADMIN_EMAIL.toLowerCase(), ...fromEnv])];
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.trim().toLowerCase());
}
