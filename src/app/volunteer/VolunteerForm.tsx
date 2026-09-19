"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  VOLUNTEER_SKILLS,
  VOLUNTEER_SEVA_ROLES,
  CREATIVE_ARTFORMS,
  TRACKS,
  TRACK_LABELS,
  assignRole,
} from "@/lib/volunteer";
import type { RoleAssignment, TrackName } from "@/lib/volunteer";

type Props = {
  defaultName: string;
  defaultPhone: string;
  defaultTrack: TrackName;
};

const STEPS = ["About you", "Your path", "Experience", "Review"] as const;

const TRACK_OPTIONS: Record<TrackName, readonly string[]> = {
  volunteer: VOLUNTEER_SEVA_ROLES,
  creative: CREATIVE_ARTFORMS,
  member: VOLUNTEER_SKILLS,
};

const TRACK_STEP_COPY: Record<TrackName, { title: string; hint: string }> = {
  volunteer: {
    title: "Which seva roles call to you?",
    hint: "Pick every on-ground role you would happily take up at a JUBAAN gathering.",
  },
  creative: {
    title: "Which art forms are yours?",
    hint: "Stage art forms (acting, dance, singing) lead to the Cultural Performer role.",
  },
  member: {
    title: "What are your interests?",
    hint: "Tell us what you love — members belong to every celebration.",
  },
};

const TRACK_ACCENT: Record<TrackName, string> = {
  volunteer: "border-bodhi/60 bg-bodhi/10 text-bodhi",
  creative: "border-saffron/60 bg-saffron/10 text-saffron",
  member: "border-gold/60 bg-gold/10 text-goldsoft",
};

export default function VolunteerForm({ defaultName, defaultPhone, defaultTrack }: Props) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [track, setTrack] = useState<TrackName>(defaultTrack);
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  const [portfolio, setPortfolio] = useState("");
  const [trackRoles, setTrackRoles] = useState<string[]>([]);
  const [experience, setExperience] = useState("");
  const [why, setWhy] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<RoleAssignment | null>(null);

  const switchTrack = (t: TrackName) => {
    setTrack(t);
    setTrackRoles([]);
    setError(null);
  };

  const toggleRole = (r: string) =>
    setTrackRoles((p) => (p.includes(r) ? p.filter((x) => x !== r) : [...p, r]));

  const canContinue = (): boolean => {
    if (step === 0) return name.trim().length >= 2 && phone.replace(/\D/g, "").length >= 10;
    if (step === 1) return trackRoles.length > 0;
    if (step === 2) return experience.trim().length >= 10 && why.trim().length >= 30;
    return true;
  };

  const hints: Record<number, string> = {
    0: "Your profile is preloaded — confirm it.",
    1: "This decides your role in the sangha.",
    2: "No experience yet? Write that honestly — eagerness counts.",
    3: "Check everything, then join.",
  };

  const submit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      if (!isSupabaseConfigured()) throw new Error("Supabase is not connected.");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please sign in first.");

      const assignment = assignRole(trackRoles, experience, why, track);

      const { error: dbError } = await supabase.from("volunteer_applications").insert({
        user_id: user.id,
        full_name: name.trim(),
        phone: phone.trim(),
        prior_experience: experience.trim(),
        skills: trackRoles,
        track_roles: trackRoles,
        track,
        why_join: why.trim(),
        portfolio_url: portfolio.trim() || null,
        assigned_role: assignment.role,
        status: "approved",
      });

      if (dbError) {
        if (dbError.code === "23505") {
          setError("You have already applied — your role is on your dashboard.");
        } else {
          throw new Error(dbError.message);
        }
        return;
      }
      setResult(assignment);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-3xl border border-gold/30 bg-coal/70 p-10 md:p-14 text-center relative overflow-hidden"
      >
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-gold/15 blur-[80px] rounded-full pointer-events-none" />
        <p className="text-5xl mb-5" aria-hidden="true">🎉</p>
        <p className="text-gold tracking-[0.3em] uppercase text-xs font-semibold mb-3">
          Welcome to the crew
        </p>
        <h2 className="font-display text-4xl md:text-5xl mb-4">
          You are a <span className="text-gradient-gold">{result.role}</span>
        </h2>
        <p className="text-cream/70 max-w-xl mx-auto leading-relaxed mb-8">{result.reason}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/dashboard"
            className="px-8 py-3.5 rounded-full bg-gold text-ink font-bold hover:bg-goldsoft transition-all duration-300 shadow-[0_0_28px_rgba(217,164,65,0.35)]"
          >
            View your certificate →
          </Link>
          <Link
            href="/events"
            className="px-8 py-3.5 rounded-full border border-cream/25 hover:border-gold hover:text-gold transition-colors"
          >
            Browse events
          </Link>
        </div>
      </motion.div>
    );
  }

  const stepCopy = TRACK_STEP_COPY[track];

  return (
    <div className="rounded-3xl border border-cream/10 bg-coal/60 overflow-hidden">
      {/* progress */}
      <div className="px-7 md:px-10 pt-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs tracking-[0.25em] uppercase text-goldsoft">
            Step {step + 1} of {STEPS.length} · {STEPS[step]}
          </p>
          <p className="text-xs text-muted">{hints[step]}</p>
        </div>
        <div className="h-1.5 rounded-full bg-ink/60 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-gold to-saffron rounded-full"
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={reduce ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="px-7 md:px-10 py-8 min-h-[340px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${step}-${track}`}
            initial={reduce ? false : { opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -32 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <label htmlFor="v-name" className="block text-sm font-semibold text-cream/80 mb-2">
                    Full name <span className="text-muted font-normal">(from your profile)</span>
                  </label>
                  <input
                    id="v-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-2xl bg-ink/60 border border-cream/15 focus:border-gold px-5 py-3.5 text-cream placeholder:text-cream/30 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="v-phone" className="block text-sm font-semibold text-cream/80 mb-2">
                    Phone <span className="text-muted font-normal">(for crew coordination)</span>
                  </label>
                  <input
                    id="v-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    inputMode="tel"
                    className="w-full rounded-2xl bg-ink/60 border border-cream/15 focus:border-gold px-5 py-3.5 text-cream placeholder:text-cream/30 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="v-portfolio" className="block text-sm font-semibold text-cream/80 mb-2">
                    Portfolio / social link <span className="text-muted font-normal">(optional)</span>
                  </label>
                  <input
                    id="v-portfolio"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    placeholder="Instagram, YouTube, drive link…"
                    inputMode="url"
                    className="w-full rounded-2xl bg-ink/60 border border-cream/15 focus:border-gold px-5 py-3.5 text-cream placeholder:text-cream/30 outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <div className="flex flex-wrap gap-2.5 mb-6" role="tablist" aria-label="Choose your path">
                  {TRACKS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      role="tab"
                      aria-selected={track === t}
                      onClick={() => switchTrack(t)}
                      className={`px-5 py-2.5 rounded-full border text-sm font-bold transition-all duration-200 ${
                        track === t
                          ? TRACK_ACCENT[t] + " shadow-[0_0_18px_rgba(217,164,65,0.25)]"
                          : "border-cream/20 text-cream/55 hover:border-gold/50 hover:text-cream"
                      }`}
                    >
                      {TRACK_LABELS[t]}
                    </button>
                  ))}
                </div>
                <h3 className="font-display text-2xl mb-2">{stepCopy.title}</h3>
                <p className="text-cream/60 mb-5 text-sm leading-relaxed">{stepCopy.hint}</p>
                <div className="flex flex-wrap gap-3">
                  {TRACK_OPTIONS[track].map((r) => {
                    const active = trackRoles.includes(r);
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => toggleRole(r)}
                        aria-pressed={active}
                        className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-200 ${
                          active
                            ? "border-gold bg-gold/15 text-goldsoft shadow-[0_0_16px_rgba(217,164,65,0.3)]"
                            : "border-cream/20 text-cream/60 hover:border-gold/50 hover:text-cream"
                        }`}
                      >
                        {active ? "✓ " : ""}{r}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label htmlFor="v-exp" className="block text-sm font-semibold text-cream/80 mb-2">
                    Any prior experience?
                  </label>
                  <textarea
                    id="v-exp"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    rows={4}
                    placeholder="e.g. Managed the registration desk at my school fest; performed folk dance; led my society's outreach…"
                    className="w-full rounded-2xl bg-ink/60 border border-cream/15 focus:border-gold px-5 py-3.5 text-cream placeholder:text-cream/30 outline-none transition-colors resize-y"
                  />
                </div>
                <div>
                  <label htmlFor="v-why" className="block text-sm font-semibold text-cream/80 mb-2">
                    Why do you want to join JUBAAN?
                  </label>
                  <textarea
                    id="v-why"
                    value={why}
                    onChange={(e) => setWhy(e.target.value)}
                    rows={4}
                    placeholder="Tell us what draws you to our heritage — a festival memory, a language you love, a stage you dream of…"
                    className="w-full rounded-2xl bg-ink/60 border border-cream/15 focus:border-gold px-5 py-3.5 text-cream placeholder:text-cream/30 outline-none transition-colors resize-y"
                  />
                  <p className="text-xs text-muted mt-1.5">{why.trim().length} characters (min 30)</p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <p className="text-cream/70 mb-5 text-sm">Your application, as the crew will see it:</p>
                <dl className="rounded-2xl border border-cream/10 bg-ink/50 p-6 space-y-4 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">Path</dt>
                    <dd>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${TRACK_ACCENT[track]}`}>
                        {TRACK_LABELS[track]}
                      </span>
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">Name</dt>
                    <dd className="text-cream font-semibold text-right">{name}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">Phone</dt>
                    <dd className="text-cream font-semibold text-right">{phone}</dd>
                  </div>
                  {portfolio.trim() && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted">Portfolio</dt>
                      <dd className="text-goldsoft text-right break-all">{portfolio}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-muted mb-2">
                      {track === "volunteer" ? "Seva roles" : track === "creative" ? "Art forms" : "Interests"}
                    </dt>
                    <dd className="flex flex-wrap gap-2">
                      {trackRoles.map((r) => (
                        <span key={r} className="px-3 py-1 rounded-full text-xs border border-gold/40 text-goldsoft bg-gold/10">
                          {r}
                        </span>
                      ))}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted mb-1">Experience</dt>
                    <dd className="text-cream/80 leading-relaxed">{experience}</dd>
                  </div>
                  <div>
                    <dt className="text-muted mb-1">Why JUBAAN</dt>
                    <dd className="text-cream/80 leading-relaxed">{why}</dd>
                  </div>
                </dl>
                <p className="text-xs text-muted mt-4 leading-relaxed">
                  Your role follows your chosen path: Volunteers join the seva crew; Creatives
                  with stage art forms become <span className="text-goldsoft">Cultural Performers</span>,
                  other art forms become <span className="text-goldsoft">Creatives</span>; Members
                  belong to the <span className="text-goldsoft">community</span>.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <p className="mt-5 text-sm text-red-400 bg-red-400/10 border border-red-400/30 rounded-2xl px-5 py-3">
            {error}{" "}
            {error.includes("dashboard") && (
              <Link href="/dashboard" className="underline font-semibold">Go to dashboard →</Link>
            )}
          </p>
        )}
      </div>

      <div className="px-7 md:px-10 pb-8 flex items-center justify-between gap-4">
        <button
          onClick={() => { setStep((s) => Math.max(0, s - 1)); setError(null); }}
          disabled={step === 0 || submitting}
          className="px-6 py-3 rounded-full border border-cream/20 text-cream/70 hover:border-gold/60 hover:text-goldsoft transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          ← Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => { setStep((s) => s + 1); setError(null); }}
            disabled={!canContinue() || submitting}
            className="px-8 py-3 rounded-full bg-gold text-ink font-bold hover:bg-goldsoft transition-all duration-300 disabled:opacity-50 shadow-[0_0_28px_rgba(217,164,65,0.35)]"
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={submitting}
            className="px-8 py-3 rounded-full bg-gold text-ink font-bold hover:bg-goldsoft transition-all duration-300 disabled:opacity-50 shadow-[0_0_28px_rgba(217,164,65,0.35)]"
          >
            {submitting ? "Joining…" : "Join the crew ✨"}
          </button>
        )}
      </div>
    </div>
  );
}
