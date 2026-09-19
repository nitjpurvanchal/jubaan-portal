// JUBAAN admin — shared client-safe bits.
//
// The admin panel (/admin) is hidden from the main site (no nav links) and
// uses its own credential system: roll number + DOB password (DDMMYYYY).
// Session logic lives in src/lib/adminAuth.ts (SERVER-ONLY); this file holds
// only constants and types safe to import from client components.

export const ADMIN_COOKIE = "jubaan_admin";

export type AdminSummary = {
  id: string;
  roll_number: string;
  full_name: string | null;
};
