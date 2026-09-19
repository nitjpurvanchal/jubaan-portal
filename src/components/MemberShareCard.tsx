"use client";

import { useRef, useState } from "react";
import BodhiLeaf from "@/components/BodhiLeaf";

export type MemberShareCardProps = {
  name: string;
  roll: string | null;
  branch: string | null;
  roles: string[];
  photoUrl: string | null;
  joined: string;
};

const WHATSAPP_URL = "https://chat.whatsapp.com/CtG7NzpTVDGEyLvqUO3uKG?mode=gi_t";
const INSTAGRAM_URL = "https://www.instagram.com/jubaan.nitj";
const INSTAGRAM_HANDLE = "@jubaan.nitj";
const CLUB_NAME = "JUBAAN — Jharkhand Uttar Pradesh Bihar Association And Networks, NIT Jalandhar";

const SHARE_TEXT = `I'm a proud member of ${CLUB_NAME} 🌿 Join us: ${WHATSAPP_URL} · Follow: ${INSTAGRAM_URL}`;

// Export canvas size (4:5 portrait, crisp for sharing)
const W = 1080;
const H = 1350;

type Status = "idle" | "shared" | "downloaded" | "copied" | "error";

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "J";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Fetch the QR SVG so we can inline it into the export (no external refs). */
async function loadQrInner(): Promise<{ viewBox: string; inner: string }> {
  const text = await (await fetch("/whatsapp-qr.svg")).text();
  const vb = /viewBox="([^"]+)"/.exec(text)?.[1] ?? "0 0 35 35";
  const inner = /<svg[^>]*>([\s\S]*)<\/svg>/.exec(text)?.[1] ?? "";
  return { viewBox: vb, inner };
}

/** Fetch a photo and inline it as a data URL; null when unavailable. */
async function loadPhotoDataUrl(url: string | null): Promise<string | null> {
  if (!url) return null;
  try {
    const blob = await (await fetch(url)).blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("read failed"));
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/**
 * Build a dependency-free SVG of the member card that mirrors the DOM card.
 * Everything (QR, photo, fonts) is inlined so it rasterises without network.
 */
async function buildCardSvg(p: MemberShareCardProps): Promise<string> {
  const { viewBox, inner } = await loadQrInner();
  const photo = await loadPhotoDataUrl(p.photoUrl);
  const nameSize = p.name.length > 26 ? 56 : p.name.length > 18 ? 68 : 80;
  const initials = initialsOf(p.name);

  const cx = W / 2;
  const roles = p.roles.filter(Boolean).slice(0, 4);
  const rolePills = roles
    .map((r, i) => {
      const label = esc(r.length > 22 ? r.slice(0, 21) + "…" : r);
      // pills laid out horizontally, centered; approx width from char count
      const pillW = Math.min(300, label.length * 15 + 44);
      const gap = 18;
      const total = roles.reduce((a, x) => a + Math.min(300, (x.length > 22 ? 22 : x.length) * 15 + 44), 0) + gap * (roles.length - 1);
      const x = cx - total / 2 + roles.slice(0, i).reduce((a, x) => a + Math.min(300, (x.length > 22 ? 22 : x.length) * 15 + 44) + gap, 0);
      return `<g>
        <rect x="${x.toFixed(1)}" y="818" width="${pillW.toFixed(1)}" height="56" rx="28" fill="none" stroke="#d9a441" stroke-width="2.5" opacity="0.9"/>
        <text x="${(x + pillW / 2).toFixed(1)}" y="854" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="27" fill="#f2e7cf" letter-spacing="1">${label}</text>
      </g>`;
    })
    .join("");

  const photoNode = photo
    ? `<image href="${photo}" x="${cx - 105}" y="470" width="210" height="210" clip-path="url(#photoClip)" preserveAspectRatio="xMidYMid slice"/>`
    : `<text x="${cx}" y="615" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="88" fill="#d9a441">${esc(initials)}</text>`;

  const subLine = [p.roll, p.branch].filter((x): x is string => !!x).map(esc).join("  ·  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <clipPath id="photoClip"><circle cx="${cx}" cy="575" r="105"/></clipPath>
    <radialGradient id="glow" cx="50%" cy="22%" r="55%">
      <stop offset="0%" stop-color="#d9a441" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#d9a441" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f0c766"/>
      <stop offset="100%" stop-color="#c98f2e"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" rx="36" fill="#141008"/>
  <rect width="${W}" height="${H}" rx="36" fill="url(#glow)"/>
  <rect x="26" y="26" width="${W - 52}" height="${H - 52}" rx="24" fill="none" stroke="#d9a441" stroke-width="5" opacity="0.85"/>
  <rect x="46" y="46" width="${W - 92}" height="${H - 92}" rx="16" fill="none" stroke="#d9a441" stroke-width="1.6" opacity="0.45"/>

  <!-- bodhi leaves, corners -->
  <g fill="#d9a441" opacity="0.16">
    <path transform="translate(110,150) scale(1.6)" d="M50 8 C 78 22, 96 44, 88 66 C 82 82, 66 90, 56 96 C 54 104, 53 110, 52 118 C 51 110, 49 104, 47 97 C 34 91, 18 81, 12 64 C 5 43, 24 21, 50 8 Z"/>
    <path transform="translate(870,150) scale(-1.6,1.6)" d="M50 8 C 78 22, 96 44, 88 66 C 82 82, 66 90, 56 96 C 54 104, 53 110, 52 118 C 51 110, 49 104, 47 97 C 34 91, 18 81, 12 64 C 5 43, 24 21, 50 8 Z"/>
  </g>

  <!-- header -->
  <text x="${cx}" y="200" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="72" letter-spacing="34" fill="url(#gold)">JUBAAN</text>
  <text x="${cx}" y="248" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="24" letter-spacing="6" fill="#f2e7cf" opacity="0.75">JHARKHAND · UTTAR PRADESH · BIHAR</text>
  <text x="${cx}" y="284" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="24" letter-spacing="6" fill="#f2e7cf" opacity="0.75">ASSOCIATION AND NETWORKS</text>
  <text x="${cx}" y="330" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="26" font-style="italic" fill="#d9a441" opacity="0.9">NIT Jalandhar</text>
  <rect x="${cx - 130}" y="366" width="260" height="2" fill="#d9a441" opacity="0.5"/>

  <!-- photo -->
  <circle cx="${cx}" cy="575" r="105" fill="#1e1609" stroke="#d9a441" stroke-width="4"/>
  ${photoNode}

  <!-- identity -->
  <text x="${cx}" y="748" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${nameSize}" fill="#f5ecdc">${esc(p.name)}</text>
  ${subLine ? `<text x="${cx}" y="792" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="28" fill="#f2e7cf" opacity="0.7">${subLine}</text>` : ""}
  ${rolePills}
  <text x="${cx}" y="942" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="26" font-style="italic" fill="#f2e7cf" opacity="0.65">Member since ${esc(p.joined)}</text>

  <!-- QR -->
  <rect x="${cx - 250}" y="990" width="500" height="230" rx="18" fill="#0f0b06" stroke="#d9a441" stroke-width="1.6" opacity="1"/>
  <svg x="${cx - 232}" y="1006" width="198" height="198" viewBox="${viewBox}" shape-rendering="crispEdges">${inner}</svg>
  <text x="${cx - 18}" y="1072" font-family="Georgia, 'Times New Roman', serif" font-size="28" fill="#f2e7cf">Scan to join our</text>
  <text x="${cx - 18}" y="1108" font-family="Georgia, 'Times New Roman', serif" font-size="28" fill="#f2e7cf">WhatsApp community</text>
  <text x="${cx - 18}" y="1152" font-family="Georgia, 'Times New Roman', serif" font-size="26" fill="#d9a441">${INSTAGRAM_HANDLE}</text>

  <text x="${cx}" y="1292" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="22" font-style="italic" fill="#f2e7cf" opacity="0.5">हमारी विरासत, हमारी जुबानी</text>
</svg>`;
}

/** Rasterise the card SVG to a PNG blob via canvas (dependency-free). */
async function renderCardPng(props: MemberShareCardProps): Promise<Blob> {
  const svg = await buildCardSvg(props);
  const svgUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("svg raster failed"));
      el.src = svgUrl;
    });
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no 2d context");
    ctx.drawImage(img, 0, 0, W, H);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("toBlob failed");
    return blob;
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // legacy fallback
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

/**
 * Shareable member card for JUBAAN. Renders a badge-style card plus
 * Share / Download / Copy actions. PNG export is dependency-free
 * (SVG → canvas → PNG) with the WhatsApp QR and photo inlined.
 */
export default function MemberShareCard(props: MemberShareCardProps) {
  const { name, roll, branch, roles, photoUrl, joined } = props;
  const [status, setStatus] = useState<Status>("idle");
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flash = (s: Status) => {
    setStatus(s);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2600);
  };

  const fileName = `jubaan-member-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "card"}.png`;
  const subLine = [roll, branch].filter(Boolean).join(" · ");

  const handleDownload = async () => {
    if (busy) return;
    setBusy(true);
    try {
      downloadBlob(await renderCardPng(props), fileName);
      flash("downloaded");
    } catch {
      flash("error");
    } finally {
      setBusy(false);
    }
  };

  const handleCopy = async () => {
    if (busy) return;
    setBusy(true);
    try {
      flash((await copyText(SHARE_TEXT)) ? "copied" : "error");
    } finally {
      setBusy(false);
    }
  };

  const handleShare = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const blob = await renderCardPng(props);
      const file = new File([blob], fileName, { type: "image/png" });
      const nav = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean };
      if (nav.canShare && nav.canShare({ files: [file] }) && navigator.share) {
        await navigator.share({ files: [file], title: "JUBAAN member card", text: SHARE_TEXT });
        flash("shared");
      } else {
        // graceful fallback: download the PNG and copy the text
        downloadBlob(blob, fileName);
        await copyText(SHARE_TEXT);
        flash("downloaded");
      }
    } catch (err) {
      // user dismissing the share sheet is not an error
      if (err instanceof DOMException && err.name === "AbortError") {
        setStatus("idle");
      } else {
        flash("error");
      }
    } finally {
      setBusy(false);
    }
  };

  const feedback: Record<Status, string> = {
    idle: "",
    shared: "Shared! 🌿",
    downloaded: "Saved as PNG ✓",
    copied: "Copied! 🌿",
    error: "Something went wrong — try again.",
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* ── the card ─────────────────────────────────────────── */}
      <div className="relative aspect-[4/5] rounded-2xl bg-ink p-2 shadow-[0_0_60px_rgba(217,164,65,0.25)] overflow-hidden">
        <div className="absolute inset-2 rounded-xl border-2 border-gold/80 pointer-events-none" />
        <div className="absolute inset-3.5 rounded-lg border border-gold/40 pointer-events-none" />

        <div className="relative h-full flex flex-col items-center text-center px-8 py-10">
          {/* corner leaves */}
          <BodhiLeaf className="absolute top-8 left-8 w-10 h-12 text-gold/25" aria-hidden />
          <BodhiLeaf className="absolute top-8 right-8 w-10 h-12 -scale-x-100 text-gold/25" aria-hidden />

          {/* club header */}
          <p className="font-display text-3xl tracking-[0.35em] text-gradient-gold pl-[0.35em]">JUBAAN</p>
          <p className="mt-2 text-[9px] tracking-[0.25em] uppercase text-cream/60 leading-relaxed">
            Jharkhand · Uttar Pradesh · Bihar
            <br />
            Association And Networks
          </p>
          <p className="mt-1 font-display italic text-sm text-goldsoft/90">NIT Jalandhar</p>
          <div className="mt-4 h-px w-24 bg-gold/50" />

          {/* photo */}
          <div className="mt-6 h-28 w-28 rounded-full overflow-hidden ring-2 ring-gold/70 bg-coal flex items-center justify-center shadow-[0_0_28px_rgba(217,164,65,0.35)]">
            {photoUrl ? (
              // plain img: photoUrl may be remote/blob and must not hit next/image optimisation quirks
              <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
              <span className="font-display text-4xl text-gold">{initialsOf(name)}</span>
            )}
          </div>

          {/* identity */}
          <h3 className="mt-5 font-display text-2xl text-cream leading-tight">{name}</h3>
          {subLine && <p className="mt-1.5 text-xs tracking-wider text-cream/60">{subLine}</p>}
          {roles.length > 0 && (
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {roles.slice(0, 4).map((r) => (
                <span
                  key={r}
                  className="px-3.5 py-1 rounded-full border border-gold/60 text-[11px] font-semibold tracking-wide text-goldsoft"
                >
                  {r}
                </span>
              ))}
            </div>
          )}
          <p className="mt-2.5 text-xs italic text-cream/50">Member since {joined}</p>

          {/* QR row */}
          <div className="mt-auto w-full">
            <div className="flex items-center gap-4 rounded-xl border border-gold/30 bg-coal/60 p-3">
              <img
                src="/whatsapp-qr.svg"
                alt="WhatsApp group QR code"
                className="h-20 w-20 rounded-md shrink-0"
              />
              <div className="text-left">
                <p className="text-sm text-cream leading-snug">
                  Scan to join our
                  <br />
                  <span className="text-goldsoft font-semibold">WhatsApp community</span>
                </p>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1.5 inline-block text-xs text-gold hover:text-goldsoft transition-colors"
                >
                  {INSTAGRAM_HANDLE}
                </a>
              </div>
            </div>
            <p className="mt-3 text-[10px] italic text-cream/35">हमारी विरासत, हमारी जुबानी</p>
          </div>
        </div>
      </div>

      {/* ── actions ──────────────────────────────────────────── */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleShare}
          disabled={busy}
          className="px-6 py-2.5 rounded-full bg-gold text-ink text-sm font-bold hover:bg-goldsoft transition-colors disabled:opacity-60 shadow-[0_0_24px_rgba(217,164,65,0.35)]"
        >
          {busy ? "Working…" : "↗ Share"}
        </button>
        <button
          type="button"
          onClick={handleDownload}
          disabled={busy}
          className="px-6 py-2.5 rounded-full border border-gold/60 text-goldsoft text-sm font-semibold hover:bg-gold/10 transition-colors disabled:opacity-60"
        >
          ⬇ Download
        </button>
        <button
          type="button"
          onClick={handleCopy}
          disabled={busy}
          className="px-6 py-2.5 rounded-full border border-cream/15 text-cream/80 text-sm font-semibold hover:bg-cream/5 transition-colors disabled:opacity-60"
        >
          ⧉ Copy text
        </button>
      </div>
      <p
        aria-live="polite"
        className={`mt-3 h-5 text-center text-sm transition-opacity ${status === "idle" ? "opacity-0" : "opacity-100"} ${status === "error" ? "text-red-400" : "text-goldsoft"}`}
      >
        {feedback[status]}
      </p>
    </div>
  );
}
