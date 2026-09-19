"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import BodhiLeaf from "./BodhiLeaf";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-[11px] tracking-[0.22em] uppercase text-gold/80 font-semibold block mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center py-8">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
        >
          <BodhiLeaf className="w-14 h-16 text-gold mx-auto mb-6" glow />
        </motion.div>
        <h2 className="font-display text-3xl mb-3">Check your inbox</h2>
        <p className="text-cream/65 leading-relaxed">
          We&apos;ve sent a confirmation link to{" "}
          <span className="text-goldsoft font-medium">{email}</span>.
          Click it to complete your journey into the sangha.
        </p>
        <div className="rule-motif mt-8 text-gold/60 text-xs tracking-[0.25em] uppercase">
          <span>JUBAAN</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <BodhiLeaf className="w-12 h-14 text-gold mx-auto mb-5 animate-glow-pulse" glow />
        <h1 className="font-display text-4xl mb-2">
          {mode === "signup" ? "Join the sangha" : "Welcome back"}
        </h1>
        <p className="text-muted">
          {mode === "signup"
            ? "Create your account to RSVP, publish events and belong."
            : "Sign in to your JUBAAN account."}
        </p>
      </div>

      <form onSubmit={submit} className="space-y-5">
        {mode === "signup" && (
          <Field label="Full name">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              className="field-glow"
            />
          </Field>
        )}
        <Field label="Email">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="field-glow"
          />
        </Field>
        <Field label="Password">
          <div className="relative">
            <input
              required
              type={showPw ? "text" : "password"}
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className="field-glow pr-14"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-gold transition-colors text-sm font-medium"
            >
              {showPw ? "Hide" : "Show"}
            </button>
          </div>
        </Field>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            className="text-sm text-red-300 bg-red-950/40 border border-red-900/60 rounded-xl px-4 py-3"
          >
            {error}
          </motion.p>
        )}

        <button disabled={busy} className="btn-gold w-full py-4 text-base disabled:opacity-50">
          {busy ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-ink/30 border-t-ink animate-spin" aria-hidden="true" />
              Please wait…
            </span>
          ) : mode === "signup" ? (
            "Create account"
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <div className="rule-motif mt-8 text-gold/50 text-[10px] tracking-[0.3em] uppercase">
        <BodhiLeaf className="w-5 h-6 shrink-0" />
      </div>

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
