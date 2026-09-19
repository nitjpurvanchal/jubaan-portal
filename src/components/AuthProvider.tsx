"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type SessionContextValue = {
  /** The signed-in user, or null. */
  user: User | null;
  session: Session | null;
  /** True while the initial session is being read from storage. */
  loading: boolean;
  signOut: () => Promise<void>;
  /** Re-read the session from storage (rarely needed; events update it). */
  refresh: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

/**
 * Provides the Supabase auth session to the whole app. Mounted once in the
 * root layout; subscribes to the shared browser client so Navbar, join
 * CTAs and every other consumer update the instant auth state changes —
 * no page reload needed to "see" that you are signed in.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  // If Supabase isn't configured there is no session to wait for.
  const [loading, setLoading] = useState(() => isSupabaseConfigured());

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    // getSession reads locally (no network) — fast first paint.
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      signOut: async () => {
        await createClient().auth.signOut();
        setSession(null);
      },
      refresh: async () => {
        const { data } = await createClient().auth.getSession();
        setSession(data.session);
      },
    }),
    [session, loading]
  );

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

/** Read the current auth session anywhere inside <AuthProvider>. */
export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside <AuthProvider>");
  return ctx;
}
