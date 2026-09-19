"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  BRANCHES,
  INTERESTS,
  SEMESTERS,
  STATES,
  type Profile,
} from "@/lib/profile";

const inputCls =
  "w-full rounded-2xl bg-ink/60 border border-cream/15 focus:border-gold px-5 py-3 text-cream placeholder:text-cream/30 outline-none transition-colors";
const labelCls = "text-xs tracking-[0.2em] uppercase text-muted block mb-2";

export default function ProfileEditor({ profile, userId }: { profile: Profile; userId: string }) {
  const router = useRouter();
  const [name, setName] = useState(profile.full_name ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [branch, setBranch] = useState(profile.branch ?? "");
  const [semester, setSemester] = useState(profile.semester ? String(profile.semester) : "");
  const [homeState, setHomeState] = useState(profile.home_state ?? "");
  const [district, setDistrict] = useState(profile.home_district ?? "");
  const [interests, setInterests] = useState<string[]>(profile.interests ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const toggleInterest = (tag: string) =>
    setInterests((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const validate = (): string | null => {
    if (name.trim().length < 2) return "Please tell us your full name.";
    if (!branch) return "Choose your branch.";
    const n = Number(semester);
    if (!Number.isInteger(n) || n < 1 || n > 8) return "Pick a semester between 1 and 8.";
    if (!homeState) return "Choose your home state.";
    if (district.trim().length < 2) return "Tell us your home district.";
    if (phone.trim() && !/^[+\d][\d\s-]{6,15}$/.test(phone.trim()))
      return "That phone number doesn't look right — or leave it blank.";
    if (interests.length < 1) return "Pick at least one interest.";
    return null;
  };

  const save = async () => {
    setSaved(false);
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setSaving(true);
    try {
      if (!isSupabaseConfigured()) throw new Error("Supabase isn't connected yet.");
      const supabase = createClient();
      const { error: upErr } = await supabase
        .from("profiles")
        .update({
          full_name: name.trim(),
          phone: phone.trim() ? phone.trim() : null,
          branch,
          semester: Number(semester),
          home_state: homeState,
          home_district: district.trim(),
          interests,
        })
        .eq("id", userId);
      if (upErr) throw upErr;
      setSaved(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div>
          <label htmlFor="pe-name" className={labelCls}>Full name</label>
          <input id="pe-name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} autoComplete="name" />
        </div>
        <div>
          <label htmlFor="pe-phone" className={labelCls}>Phone</label>
          <input
            id="pe-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 …"
            type="tel"
            autoComplete="tel"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="pe-branch" className={labelCls}>Branch</label>
          <select
            id="pe-branch"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className={`${inputCls} appearance-none cursor-pointer ${!branch ? "text-cream/30" : ""}`}
          >
            <option value="" disabled>Select your branch</option>
            {BRANCHES.map((b) => (
              <option key={b} value={b} className="bg-ink text-cream">{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="pe-sem" className={labelCls}>Semester</label>
          <select
            id="pe-sem"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className={`${inputCls} appearance-none cursor-pointer ${!semester ? "text-cream/30" : ""}`}
          >
            <option value="" disabled>Select semester</option>
            {SEMESTERS.map((n) => (
              <option key={n} value={n} className="bg-ink text-cream">Semester {n}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="pe-state" className={labelCls}>Home state</label>
          <select
            id="pe-state"
            value={homeState}
            onChange={(e) => setHomeState(e.target.value)}
            className={`${inputCls} appearance-none cursor-pointer ${!homeState ? "text-cream/30" : ""}`}
          >
            <option value="" disabled>Select your home state</option>
            {STATES.map((s) => (
              <option key={s} value={s} className="bg-ink text-cream">{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="pe-district" className={labelCls}>Home district</label>
          <input
            id="pe-district"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            placeholder="e.g. Lakhisarai"
            autoComplete="address-level2"
            className={inputCls}
          />
        </div>
      </div>

      <div className="mb-6">
        <p className={labelCls}>Interests</p>
        <div className="flex flex-wrap gap-2.5">
          {INTERESTS.map((tag) => {
            const active = interests.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleInterest(tag)}
                aria-pressed={active}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-gold text-ink border-gold shadow-[0_0_18px_rgba(217,164,65,0.35)]"
                    : "border-cream/20 text-cream/70 hover:border-gold/60 hover:text-goldsoft"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <p role="alert" className="mb-4 text-sm text-red-400 bg-red-950/40 border border-red-900/60 rounded-xl px-4 py-3">
          {error}
        </p>
      )}
      {saved && !error && (
        <p role="status" className="mb-4 text-sm text-emerald-300 bg-emerald-950/40 border border-emerald-900/60 rounded-xl px-4 py-3">
          ✓ Saved — your profile is updated everywhere.
        </p>
      )}

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="px-8 py-3 rounded-full bg-gold text-ink font-bold hover:bg-goldsoft transition-all duration-300 disabled:opacity-50 shadow-[0_0_28px_rgba(217,164,65,0.35)]"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}
