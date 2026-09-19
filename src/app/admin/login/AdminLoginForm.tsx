"use client";

import { useActionState } from "react";
import { loginAdmin, type LoginState } from "./actions";

const initial: LoginState = { error: null };

export default function AdminLoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, initial);

  return (
    <form action={action} className="space-y-5 text-left">
      <div>
        <label htmlFor="admin-roll" className="block text-xs tracking-[0.25em] uppercase text-gold/80 font-semibold mb-2">
          Roll number
        </label>
        <input
          id="admin-roll"
          name="roll"
          autoComplete="username"
          inputMode="numeric"
          placeholder="e.g. 25619031"
          className="w-full rounded-2xl bg-ink/60 border border-cream/15 focus:border-gold px-5 py-3.5 text-cream placeholder:text-cream/30 outline-none transition-colors"
        />
      </div>
      <div>
        <label htmlFor="admin-pass" className="block text-xs tracking-[0.25em] uppercase text-gold/80 font-semibold mb-2">
          Password · date of birth
        </label>
        <input
          id="admin-pass"
          name="password"
          type="password"
          autoComplete="current-password"
          inputMode="numeric"
          placeholder="DDMMYYYY"
          className="w-full rounded-2xl bg-ink/60 border border-cream/15 focus:border-gold px-5 py-3.5 text-cream placeholder:text-cream/30 outline-none transition-colors"
        />
        <p className="mt-2 text-xs text-cream/40">Your date of birth in DDMMYYYY format.</p>
      </div>
      {state.error && (
        <p role="alert" className="rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-3 text-sm text-red-200">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="btn-gold w-full py-3.5 text-sm disabled:opacity-60"
      >
        {pending ? "Opening the chamber…" : "Enter admin panel"}
      </button>
    </form>
  );
}
