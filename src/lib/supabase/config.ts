export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Validate a `?next=` redirect target. Only same-origin absolute paths are
 * allowed ("/dashboard", "/volunteer?track=creative"); anything else —
 * external URLs, protocol-relative "//evil" — is rejected.
 */
export function safeNextPath(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const decoded = decodeURIComponent(value);
    if (decoded.startsWith("/") && !decoded.startsWith("//")) return decoded;
  } catch {
    // malformed encoding — reject
  }
  return null;
}
