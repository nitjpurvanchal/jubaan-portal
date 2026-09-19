"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import ProfileAvatar from "@/components/ProfileAvatar";

const MAX_BYTES = 5 * 1024 * 1024;
const BUCKET = "profile-photos";

export default function PhotoUploader({
  userId,
  currentUrl,
  name,
}: {
  userId: string;
  currentUrl: string | null;
  name: string | null;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState<string | null>(currentUrl);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const path = `${userId}/photo.jpg`;

  const pick = (file: File | undefined) => {
    if (!file) return;
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (JPG, PNG, WebP…).");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That photo is larger than 5 MB — please pick a smaller one.");
      return;
    }
    upload(file);
  };

  const upload = async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      if (!isSupabaseConfigured()) throw new Error("Supabase isn't connected yet.");
      const supabase = createClient();

      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      const publicUrl = data.publicUrl;

      const { error: dbErr } = await supabase
        .from("profiles")
        .update({ photo_url: publicUrl })
        .eq("id", userId);
      if (dbErr) throw dbErr;

      // The storage path is stable across uploads — cache-bust the display.
      setUrl(`${publicUrl}?t=${Date.now()}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm("Remove your profile photo?")) return;
    setBusy(true);
    setError(null);
    try {
      if (!isSupabaseConfigured()) throw new Error("Supabase isn't connected yet.");
      const supabase = createClient();
      await supabase.storage.from(BUCKET).remove([path]);
      const { error: dbErr } = await supabase
        .from("profiles")
        .update({ photo_url: null })
        .eq("id", userId);
      if (dbErr) throw dbErr;
      setUrl(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not remove the photo. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 shrink-0">
      <div className="relative">
        <ProfileAvatar src={url} name={name} size={120} className="ring-2 ring-gold/40 shadow-[0_0_36px_rgba(217,164,65,0.35)]" />
        {busy && (
          <div className="absolute inset-0 rounded-full bg-ink/60 flex items-center justify-center">
            <span className="w-8 h-8 rounded-full border-2 border-gold/30 border-t-gold animate-spin" aria-hidden="true" />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        aria-label="Upload profile photo"
        onChange={(e) => {
          pick(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <div className="flex flex-wrap justify-center gap-2.5">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="px-5 py-2.5 rounded-full bg-gold text-ink text-sm font-bold hover:bg-goldsoft transition-colors disabled:opacity-50"
        >
          {url ? "Change photo" : "Upload photo"}
        </button>
        {url && (
          <button
            type="button"
            onClick={remove}
            disabled={busy}
            className="px-5 py-2.5 rounded-full border border-cream/20 text-cream/60 text-sm hover:border-red-400/60 hover:text-red-400 transition-colors disabled:opacity-50"
          >
            Remove
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="text-xs text-red-400 bg-red-950/40 border border-red-900/60 rounded-xl px-4 py-2.5 max-w-[240px] text-center">
          {error}
        </p>
      )}
    </div>
  );
}
