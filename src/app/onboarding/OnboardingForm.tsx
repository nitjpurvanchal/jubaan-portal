"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import BodhiLeaf from "@/components/BodhiLeaf";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  BRANCHES,
  INTERESTS,
  SEMESTERS,
  STATES,
  type OnboardingPayload,
  type Profile,
} from "@/lib/profile";

const STEPS = [
  { title: "Identity", hint: "Who's walking with us?" },
  { title: "Academics", hint: "Your campus chapter" },
  { title: "Roots", hint: "Where your stories come from" },
  { title: "Interests", hint: "What moves your soul" },
] as const;

const inputCls =
  "w-full rounded-2xl bg-ink border border-cream/15 px-5 py-3.5 focus:border-gold outline-none transition-colors placeholder:text-muted/60 text-cream";
const labelCls = "text-xs tracking-[0.2em] uppercase text-muted block mb-2";

export default function OnboardingForm({ profile }: { profile: Profile | null }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [name, setName] = useState(profile?.full_name ?? "");
  const [roll, setRoll] = useState(profile?.roll_number ?? "");
  const [branch, setBranch] = useState(profile?.branch ?? "");
  const [semester, setSemester] = useState(profile?.semester ? String(profile.semester) : "");
  const [homeState, setHomeState] = useState(profile?.home_state ?? "");
  const [district, setDistrict] = useState(profile?.home_district ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [interests, setInterests] = useState<string[]>(profile?.interests ?? []);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const validate = (s: number): string | null => {
    if (s === 0) {
      if (name.trim().length < 2) return "Please tell us your full name.";
      if (roll.trim().length < 2) return "Your roll number helps us know you on campus.";
      return null;
    }
    if (s === 1) {
      if (!branch) return "Choose your branch.";
      const n = Number(semester);
      if (!Number.isInteger(n) || n < 1 || n > 8) return "Pick a semester between 1 and 8.";
      return null;
    }
    if (s === 2) {
      if (!homeState) return "Choose your home state.";
      if (district.trim().length < 2) return "Tell us your home district.";
      if (phone.trim() && !/^[+\d][\d\s-]{6,15}$/.test(phone.trim()))
        return "That phone number doesn't look right — or leave it blank.";
      return null;
    }
    if (interests.length < 1) return "Pick at least one interest so we can curate for you.";
    return null;
  };

  const next = () => {
    const err = validate(step);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    if (step === STEPS.length - 1) {
      finish();
      return;
    }
    setDirection(1);
    setStep((s) => s + 1);
  };

  const back = () => {
    setError(null);
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  const toggleInterest = (tag: string) => {
    setInterests((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const finish = async () => {
    setBusy(true);
    setError(null);
    try {
      if (!isSupabaseConfigured()) throw new Error("Supabase isn't connected yet.");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You need to be signed in.");

      const payload: OnboardingPayload = {
        full_name: name.trim(),
        roll_number: roll.trim(),
        branch,
        semester: Number(semester),
        phone: phone.trim() ? phone.trim() : null,
        home_state: homeState,
        home_district: district.trim(),
        interests,
        onboarding_completed: true,
      };

      const { error: upErr } = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", user.id);
      if (upErr) throw upErr;

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setBusy(false);
    }
  };

  const slide = reduceMotion ? 0 : 44 * direction;
  const duration = reduceMotion ? 0.01 : 0.32;

  return (
    <div className="w-full max-w-2xl">
      {/* Progress */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((s, i) => (
            <div key={s.title} className="flex items-center gap-2.5 flex-1 last:flex-none">
              <motion.div
                animate={{
                  scale: i === step ? 1.15 : 1,
                  backgroundColor: i <= step ? "#d9a441" : "rgba(247,240,221,0.12)",
                  color: i <= step ? "#0f0c07" : "#a89a78",
                }}
                transition={{ duration: reduceMotion ? 0 : 0.25 }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
              >
                {i < step ? "✓" : i + 1}
              </motion.div>
              <div className="hidden sm:block mr-2">
                <p className={`text-sm font-semibold leading-none ${i === step ? "text-goldsoft" : "text-muted"}`}>
                  {s.title}
                </p>
                <p className="text-[11px] text-muted/70 mt-1">{s.hint}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px mx-2 bg-cream/10 relative overflow-hidden rounded">
                  <motion.div
                    className="absolute inset-0 bg-gold origin-left"
                    initial={false}
                    animate={{ scaleX: i < step ? 1 : 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.35 }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-cream/10 bg-coal/70 backdrop-blur p-8 md:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.6)] relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gold/10 blur-[90px] pointer-events-none" />

        <div className="flex items-center gap-4 mb-8">
          <BodhiLeaf className="w-9 h-11 text-gold shrink-0" glow />
          <div>
            <h1 className="font-display text-3xl md:text-4xl">
              {STEPS[step].title}
            </h1>
            <p className="text-muted text-sm mt-1">{STEPS[step].hint}</p>
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: slide }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduceMotion ? 0 : -44 * direction }}
            transition={{ duration, ease: "easeOut" }}
          >
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <label htmlFor="ob-name" className={labelCls}>Full name</label>
                  <input
                    id="ob-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name, as the sangha should know you"
                    autoComplete="name"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="ob-roll" className={labelCls}>Roll number</label>
                  <input
                    id="ob-roll"
                    value={roll}
                    onChange={(e) => setRoll(e.target.value)}
                    placeholder="e.g. 25619031"
                    autoComplete="off"
                    className={inputCls}
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label htmlFor="ob-branch" className={labelCls}>Branch</label>
                  <select
                    id="ob-branch"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className={`${inputCls} appearance-none cursor-pointer ${!branch ? "text-muted/60" : ""}`}
                  >
                    <option value="" disabled>Select your branch</option>
                    {BRANCHES.map((b) => (
                      <option key={b} value={b} className="bg-ink text-cream">{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="ob-sem" className={labelCls}>Semester</label>
                  <select
                    id="ob-sem"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className={`${inputCls} appearance-none cursor-pointer ${!semester ? "text-muted/60" : ""}`}
                  >
                    <option value="" disabled>Select semester</option>
                    {SEMESTERS.map((n) => (
                      <option key={n} value={n} className="bg-ink text-cream">
                        Semester {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label htmlFor="ob-state" className={labelCls}>Home state</label>
                  <select
                    id="ob-state"
                    value={homeState}
                    onChange={(e) => setHomeState(e.target.value)}
                    className={`${inputCls} appearance-none cursor-pointer ${!homeState ? "text-muted/60" : ""}`}
                  >
                    <option value="" disabled>Select your home state</option>
                    {STATES.map((s) => (
                      <option key={s} value={s} className="bg-ink text-cream">{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="ob-district" className={labelCls}>Home district</label>
                  <input
                    id="ob-district"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Lakhisarai"
                    autoComplete="address-level2"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="ob-phone" className={labelCls}>
                    Phone <span className="normal-case tracking-normal text-muted/70">(optional)</span>
                  </label>
                  <input
                    id="ob-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 …"
                    type="tel"
                    autoComplete="tel"
                    className={inputCls}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <p className="text-muted text-sm mb-5">
                  Tell us what calls to you — we&rsquo;ll shape the calendar around the sangha&rsquo;s passions.
                </p>
                <div className="flex flex-wrap gap-3">
                  {INTERESTS.map((tag) => {
                    const active = interests.includes(tag);
                    return (
                      <motion.button
                        key={tag}
                        type="button"
                        onClick={() => toggleInterest(tag)}
                        whileTap={reduceMotion ? undefined : { scale: 0.94 }}
                        aria-pressed={active}
                        className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-200 ${
                          active
                            ? "bg-gold text-ink border-gold shadow-[0_0_22px_rgba(217,164,65,0.35)]"
                            : "border-cream/20 text-cream/70 hover:border-gold/60 hover:text-goldsoft"
                        }`}
                      >
                        {tag}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            className="mt-6 text-sm text-red-400 bg-red-950/40 border border-red-900/60 rounded-xl px-4 py-3"
          >
            {error}
          </motion.p>
        )}

        <div className="flex items-center justify-between mt-8">
          <button
            type="button"
            onClick={back}
            disabled={step === 0 || busy}
            className="px-6 py-3 rounded-full border border-cream/20 text-cream/70 hover:border-gold/60 hover:text-goldsoft transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={next}
            disabled={busy}
            className="px-8 py-3 rounded-full bg-gold text-ink font-bold hover:bg-goldsoft transition-all duration-300 disabled:opacity-50 shadow-[0_0_28px_rgba(217,164,65,0.35)]"
          >
            {busy ? "Saving…" : step === STEPS.length - 1 ? "Enter the sangha →" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}
