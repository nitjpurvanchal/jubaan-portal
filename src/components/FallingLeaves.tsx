"use client";

import { useEffect, useRef, useState } from "react";

const LEAF_W = 190;

/**
 * A single, large, realistic Bodhi leaf — heart-shaped blade, long drip tip,
 * midrib and lateral veins, glossy gradient. Drawn as detailed SVG line/fill
 * art so it reads as a real leaf, not an icon.
 */
function BodhiLeafArt() {
  const blade =
    "M100,20 C142,28 174,60 178,106 C181,148 150,178 112,190 L100,194 L88,190 C50,178 19,148 22,106 C26,60 58,28 100,20 Z";
  return (
    <svg
      viewBox="0 0 200 250"
      className="h-auto w-full"
      role="img"
      aria-label="A Bodhi leaf drifting down"
    >
      <defs>
        <radialGradient id="leafBody" cx="42%" cy="32%" r="78%">
          <stop offset="0%" stopColor="#93c47d" />
          <stop offset="45%" stopColor="#5d8f52" />
          <stop offset="100%" stopColor="#2a4f2e" />
        </radialGradient>
        <linearGradient id="leafSheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="42%" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="leafRim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8c76a" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#e8c76a" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* stem */}
      <path
        d="M100,22 C100,14 100,8 100,2"
        fill="none"
        stroke="#3c6b3a"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      {/* blade */}
      <path d={blade} fill="url(#leafBody)" />
      {/* golden rim light */}
      <path d={blade} fill="none" stroke="url(#leafRim)" strokeWidth="2.5" />
      {/* glossy sheen */}
      <path d={blade} fill="url(#leafSheen)" />
      {/* midrib */}
      <path
        d="M100,26 L100,192"
        fill="none"
        stroke="#26492a"
        strokeWidth="2.6"
        opacity="0.85"
      />
      {/* lateral veins */}
      <g
        fill="none"
        stroke="#3f7340"
        strokeWidth="1.5"
        opacity="0.7"
        strokeLinecap="round"
      >
        <path d="M100,54 C120,60 140,70 156,86" />
        <path d="M100,84 C122,90 144,102 160,120" />
        <path d="M100,114 C122,120 142,132 156,150" />
        <path d="M100,144 C120,150 138,160 150,174" />
        <path d="M100,54 C80,60 60,70 44,86" />
        <path d="M100,84 C78,90 56,102 40,120" />
        <path d="M100,114 C78,120 58,132 44,150" />
        <path d="M100,144 C80,150 62,160 50,174" />
      </g>
      {/* the long drip tip */}
      <path
        d="M100,194 C103,208 102,224 100,242 C98,224 97,208 100,194 Z"
        fill="#2a4f2e"
      />
      <path
        d="M100,196 C101,212 100,228 100,240"
        fill="none"
        stroke="#4a7f4c"
        strokeWidth="1.3"
      />
    </svg>
  );
}

/**
 * One leaf, Forrest-Gump-feather style. As the visitor scrolls the home page,
 * a single Bodhi leaf detaches from the top of the viewport and rides the
 * scroll downward — slow, swaying, softly tumbling, never rushed. Scrolling
 * back up returns it; near the bottom of the page it fades away.
 *
 * Pure function of scroll position (with cinematic lag), so the motion is
 * reversible and calm. Never mounts under prefers-reduced-motion.
 */
export default function FallingLeaves() {
  const [enabled] = useState(
    () =>
      typeof window !== "undefined" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    // smoothed (cinematic) state
    let cx = window.innerWidth / 2;
    let cy = 40;
    let rot = 0;
    let op = 0;

    const tick = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const max = Math.max(1, document.documentElement.scrollHeight - vh);
      const p = Math.min(1, Math.max(0, window.scrollY / max));

      // ride the scroll: top of viewport -> bottom of viewport
      const ty = 30 + p * (vh - 300);
      // slow lateral drift, like a feather crossing the air
      const tx = vw / 2 + Math.sin(p * Math.PI * 2.5) * vw * 0.3;
      // soft pendulum tumble
      const trot =
        Math.sin(p * Math.PI * 4) * 24 + Math.sin(p * Math.PI * 2.5 + 1) * 9;
      // fade in at release, fade out near the bottom
      const targetOp =
        p < 0.05 ? p / 0.05 : p > 0.93 ? Math.max(0, (1 - p) / 0.07) : 1;

      const k = 0.055; // lag = grace
      cx += (tx - cx) * k;
      cy += (ty - cy) * k;
      rot += (trot - rot) * k;
      op += (targetOp - op) * (k * 1.7);

      const bob = Math.sin(performance.now() / 1100) * 6;
      el.style.transform = `translate3d(${(cx - LEAF_W / 2).toFixed(1)}px, ${(cy + bob).toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`;
      el.style.opacity = op.toFixed(3);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-40 will-change-transform"
      style={{
        width: LEAF_W,
        opacity: 0,
        filter: "drop-shadow(0 24px 28px rgba(0,0,0,0.45))",
      }}
    >
      <BodhiLeafArt />
    </div>
  );
}
