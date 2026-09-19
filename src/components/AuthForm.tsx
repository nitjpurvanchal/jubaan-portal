"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import BodhiLeaf from "./BodhiLeaf";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isSupabaseConfigured()) {
      setError("Supabase isn't connected yet — add your project URL and anon key to .env.local (see README), then try again.");
      return;
    }
    setBusy(true);
    try {
      const supabase = createClient();
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: name.trim() } },
        });
        if (error) throw error;
        setSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center py-8">
        <BodhiLeaf className="w-12 h-14 text-gold mx-auto mb-5" glow />
        <h2 className="font-display text-3xl mb-3">Check your inbox</h2>
        <p className="text-cream/65 leading-relaxed">
          We've sent a confirmation link to <span className="text-goldsoft">{email}</span>.
          Click it to complete your journey into the sangha.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <BodhiLeaf className="w-12 h-14 text-gold mx-auto mb-5" glow />
        <h1 className="font-display text-4xl mb-2">
          {mode === "signup" ? "Join the sangha" : "Welcome back"}
        </h1>
        <p className="text-muted">
          {mode === "signup"
            ? "Create your account to RSVP, publish events and belong."
            : "Sign in to your JUBAAN account."}
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        {mode === "signup" && (
          <div>
            <label className="text-xs tracking-[0.2em] uppercase text-muted block mb-2">Full name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-2xl bg-ink border border-cream/15 px-5 py-3.5 focus:border-gold outline-none transition-colors placeholder:text-muted/60"
            />
          </div>
        )}
        <div>
          <label className="text-xs tracking-[0.2em] uppercase text-muted block mb-2">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-2xl bg-ink border border-cream/15 px-5 py-3.5 focus:border-gold outline-none transition-colors placeholder:text-muted/60"
          />
        </div>
        <div>
          <label className="text-xs tracking-[0.2em] uppercase text-muted block mb-2">Password</label>
          <input
            required
            type="password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-2xl bg-ink border border-cream/15 px-5 py-3.5 focus:border-gold outline-none transition-colors placeholder:text-muted/60"
          />
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-400 bg-red-950/40 border border-red-900/60 rounded-xl px-4 py-3"
          >
            {error}
          </motion.p>
        )}

        <button
          disabled={busy}
          className="w-full py-4 rounded-full bg-gold text-ink font-bold tracking-wide hover:bg-goldsoft transition-all duration-300 disabled:opacity-50 shadow-[0_0_30px_rgba(217,164,65,0.35)]"
        >
          {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
        </button>
      </form>

      <p className="text-center text-sm text-muted mt-6">
        {mode === "signup" ? (
          <>Already walking with us? <Link href="/login" className="text-gold hover:text-goldsoft font-semibold">Sign in</Link></>
        ) : (
          <>New to the circuit? <Link href="/signup" className="text-gold hover:text-goldsoft font-semibold">Create an account</Link></>
        )}
      </p>
    </>
  );
}
