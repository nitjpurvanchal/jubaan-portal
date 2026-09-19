"use client";

import { useEffect, useRef, useState } from "react";

const LEAF_W = 240;
const LEAF_H = (LEAF_W * 340) / 260;

const BLADE =
  "M130,44 C166,50 204,74 213,116 C221,154 197,194 162,222 L140,242 L130,250 L120,242 L98,222 C63,194 39,154 47,116 C56,74 94,50 130,44 Z";
const DRIP_TIP =
  "M130,248 C134.5,264 133.8,294 130,330 C126.2,294 125.5,264 130,248 Z";

/** approximate blade half-width at a given y — keeps veins inside the margin */
const HW_SAMPLES: Array<[number, number]> = [
  [44, 8],
  [70, 44],
  [100, 70],
  [130, 82],
  [160, 73],
  [190, 50],
  [215, 32],
  [238, 14],
  [250, 3],
];

function bladeHalfWidth(y: number): number {
  if (y <= HW_SAMPLES[0][0]) return HW_SAMPLES[0][1];
  for (let i = 1; i < HW_SAMPLES.length; i++) {
    const [y1, w1] = HW_SAMPLES[i - 1];
    const [y2, w2] = HW_SAMPLES[i];
    if (y <= y2) {
      const t = (y - y1) / (y2 - y1);
      return w1 + (w2 - w1) * t;
    }
  }
  return 0;
}

const f1 = (n: number) => n.toFixed(1);

/**
 * Thirteen pairs of lateral veins, generated to curve from the midrib toward
 * the leaf margin and sweep down toward the drip tip — the way veins run on
 * a real Bodhi leaf. Widths taper and opacity falls toward the tip.
 */
const VEINS: Array<{ d: string; w: number; o: number }> = (() => {
  const veins: Array<{ d: string; w: number; o: number }> = [];
  const N = 13;
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const y0 = 66 + t * 158;
    const yEnd = Math.min(240, y0 + 20 + t * 34);
    const endW = Math.max(4, bladeHalfWidth(yEnd) * 0.93);
    const w = 1.8 - t * 0.9;
    const o = 0.85 - t * 0.3;
    for (const s of [1, -1]) {
      const ex = 130 + s * endW;
      veins.push({
        d: `M130,${f1(y0)} C${f1(130 + s * endW * 0.45)},${f1(y0 + (yEnd - y0) * 0.25)} ${f1(130 + s * endW * 0.85)},${f1(y0 + (yEnd - y0) * 0.6)} ${f1(ex)},${f1(yEnd)}`,
        w,
        o,
      });
    }
  }
  return veins;
})();

/**
 * A single, large, realistic Bodhi leaf — heart-shaped blade, long drip tip,
 * tapered midrib and thirteen pairs of lateral veins, layered gradients for
 * sunlit and shaded zones, feTurbulence surface grain, and a golden rim light
 * stronger on the sun side. Drawn as detailed SVG so it reads as a real leaf,
 * not an icon.
 */
function BodhiLeafArt() {
  return (
    <svg
      viewBox="0 0 260 340"
      className="h-auto w-full"
      role="img"
      aria-label="A Bodhi leaf drifting down"
    >
      <defs>
        <radialGradient id="leafBody" cx="38%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#a9d894" />
          <stop offset="38%" stopColor="#6aa862" />
          <stop offset="72%" stopColor="#3d7346" />
          <stop offset="100%" stopColor="#234a2c" />
        </radialGradient>
        <linearGradient id="leafShade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0c2012" stopOpacity="0" />
          <stop offset="55%" stopColor="#0c2012" stopOpacity="0" />
          <stop offset="100%" stopColor="#0a1c10" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="leafSheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.32" />
          <stop offset="42%" stopColor="#ffffff" stopOpacity="0.07" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="leafRim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eec86e" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#eec86e" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="tipGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3f7a45" />
          <stop offset="100%" stopColor="#22482b" />
        </linearGradient>
        <filter id="leafGrainDark" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
            result="n"
          />
          <feColorMatrix
            in="n"
            type="matrix"
            values="0 0 0 0 0.04  0 0 0 0 0.08  0 0 0 0 0.03  0.32 0.32 0.32 0 0"
          />
        </filter>
        <filter id="leafGrainLight" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.7"
            numOctaves="2"
            stitchTiles="stitch"
            result="n"
          />
          <feColorMatrix
            in="n"
            type="matrix"
            values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.2 0.2 0.2 0 0"
          />
        </filter>
        <filter id="softBlur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id="rimBlur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
        <clipPath id="bladeClip">
          <path d={BLADE} />
          <path d={DRIP_TIP} />
        </clipPath>
      </defs>

      {/* stem */}
      <path
        d="M130,46 C130,36 130,26 130,18 C130,12 130,9 130,5"
        fill="none"
        stroke="#477a44"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* blade: living green, sunlit upper-left -> shaded lower-right */}
      <path d={BLADE} fill="url(#leafBody)" />
      <path d={BLADE} fill="url(#leafShade)" />
      {/* surface texture: dark + light grain, kept subtle */}
      <g clipPath="url(#bladeClip)">
        <rect
          x="0"
          y="0"
          width="260"
          height="340"
          filter="url(#leafGrainDark)"
          opacity="0.35"
        />
        <rect
          x="0"
          y="0"
          width="260"
          height="340"
          filter="url(#leafGrainLight)"
          opacity="0.35"
        />
      </g>
      {/* glossy sheen */}
      <path d={BLADE} fill="url(#leafSheen)" />
      {/* sunlit wash, upper left */}
      <ellipse
        cx="94"
        cy="102"
        rx="42"
        ry="60"
        fill="#ffffff"
        opacity="0.1"
        filter="url(#softBlur)"
        transform="rotate(-18 94 102)"
      />
      {/* midrib — tapered, with a lit edge */}
      <path
        d="M128.8,58 C129.4,124 129.6,188 129.9,244 L130.9,244 C131.1,188 131.2,124 131.2,58 Z"
        fill="#2a4f2d"
        opacity="0.9"
      />
      <path
        d="M129.4,62 C129.9,124 130,186 130.2,240"
        fill="none"
        stroke="#7fae74"
        strokeWidth="1"
        opacity="0.5"
      />
      {/* lateral veins */}
      <g fill="none" stroke="#35663a" strokeLinecap="round">
        {VEINS.map((v, i) => (
          <path key={i} d={v.d} strokeWidth={v.w} opacity={v.o} />
        ))}
      </g>
      {/* rim light: golden all around, glowing on the sun side, cool on the shade side */}
      <path d={BLADE} fill="none" stroke="url(#leafRim)" strokeWidth="2.5" />
      <path
        d="M54,108 C60,78 88,56 122,48"
        fill="none"
        stroke="#f4e2a0"
        strokeWidth="4.5"
        strokeLinecap="round"
        opacity="0.8"
        filter="url(#rimBlur)"
      />
      <path
        d="M206,108 C210,140 196,176 168,206"
        fill="none"
        stroke="#142a1a"
        strokeWidth="2"
        opacity="0.55"
      />
      {/* the long drip tip */}
      <path d={DRIP_TIP} fill="url(#tipGrad)" />
      <path
        d={DRIP_TIP}
        fill="none"
        stroke="#eec86e"
        strokeWidth="1.2"
        opacity="0.5"
      />
      <path
        d="M130,250 C130.4,274 130,302 130,326"
        fill="none"
        stroke="#578f5c"
        strokeWidth="1.4"
      />
    </svg>
  );
}

/**
 * One leaf, Forrest-Gump-feather style — and now grabbable. As the visitor
 * scrolls the home page, a single Bodhi leaf detaches from the top of the
 * viewport and rides the scroll downward — slow, swaying, softly tumbling,
 * never rushed. Scrolling back up returns it; near the bottom of the page it
 * fades away.
 *
 * The leaf can also be grabbed with the pointer: while held it follows the
 * finger (paused from its scroll path) and grows slightly with a deeper
 * shadow; on release it flings with the measured velocity and a
 * near-critically-damped spring eases it back onto its scroll path.
 *
 * The scroll ride is a pure function of scroll position (with cinematic lag),
 * so the motion is reversible and calm. Never mounts under
 * prefers-reduced-motion.
 */
export default function FallingLeaves() {
  const [enabled] = useState(
    () =>
      typeof window !== "undefined" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [held, setHeldState] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const leafRef = useRef<HTMLDivElement>(null);
  const heldRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const wrap = wrapRef.current;
    const leaf = leafRef.current;
    if (!wrap || !leaf) return;

    const clamp = (v: number, lo: number, hi: number) =>
      Math.min(hi, Math.max(lo, v));

    type Mode = "ride" | "drag" | "settle";
    let mode: Mode = "ride";
    let raf = 0;
    let last = performance.now();

    // home = the cinematic scroll-ride target (center-x, top-y, rotation, opacity)
    let hx = window.innerWidth / 2;
    let hy = 40;
    let hr = 0;
    let hop = 0;

    // live leaf state (top-left of the leaf box)
    let x = hx - LEAF_W / 2;
    let y = hy;
    let rot = 0;
    let vx = 0;
    let vy = 0;

    // drag bookkeeping
    let pointerId = -1;
    let grabDX = 0; // pointer offset from leaf center at grab time (no jump)
    let grabDY = 0;
    let trail: Array<{ x: number; y: number; t: number }> = [];
    let shadow = "";

    const setHeld = (v: boolean) => {
      heldRef.current = v;
      setHeldState(v);
    };

    /** velocity of the pointer over the last ~120ms of its trail */
    const trailVelocity = () => {
      const now = performance.now();
      const li = trail.length - 1;
      if (li < 1) return { vx: 0, vy: 0 };
      let fi = li;
      while (fi > 0 && now - trail[fi - 1].t <= 120) fi--;
      if (fi >= li) return { vx: 0, vy: 0 };
      const a = trail[fi];
      const b = trail[li];
      const dt = Math.max(1, b.t - a.t) / 1000;
      return { vx: (b.x - a.x) / dt, vy: (b.y - a.y) / dt };
    };

    const onDown = (e: PointerEvent) => {
      if (!e.isPrimary || pointerId !== -1) return;
      e.preventDefault();
      pointerId = e.pointerId;
      try {
        leaf.setPointerCapture(pointerId);
      } catch {
        /* pointer already gone — ignore */
      }
      grabDX = x + LEAF_W / 2 - e.clientX;
      grabDY = y + LEAF_H / 2 - e.clientY;
      trail = [{ x: e.clientX, y: e.clientY, t: performance.now() }];
      vx = 0;
      vy = 0;
      mode = "drag";
      setHeld(true);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== pointerId || mode !== "drag") return;
      trail.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (trail.length > 14) trail.shift();
    };

    const onRelease = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      pointerId = -1;
      setHeld(false);
      const now = performance.now();
      const tv = trailVelocity();
      const lastT = trail.length ? trail[trail.length - 1].t : now;
      // stale trail (finger paused before release) -> kill the fling
      const freshness = clamp(1 - (now - lastT) / 160, 0, 1);
      vx = clamp(tv.vx * freshness, -3600, 3600);
      vy = clamp(tv.vy * freshness, -3600, 3600);
      trail = [];
      mode = "settle";
    };

    const tick = () => {
      const now = performance.now();
      const dt = clamp((now - last) / 1000, 0.0005, 0.05);
      last = now;

      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const max = Math.max(1, document.documentElement.scrollHeight - vh);
      const p = clamp(window.scrollY / max, 0, 1);

      // --- home (scroll-ride) target, same math as before ---
      const thx = vw / 2 + Math.sin(p * Math.PI * 2.5) * vw * 0.3;
      const thy = 30 + p * (vh - 300);
      const throt =
        Math.sin(p * Math.PI * 4) * 24 + Math.sin(p * Math.PI * 2.5 + 1) * 9;
      const tOp = p < 0.05 ? p / 0.05 : p > 0.93 ? Math.max(0, (1 - p) / 0.07) : 1;

      const hs = 1 - Math.exp(-3.4 * dt); // cinematic lag, dt-corrected
      hx += (thx - hx) * hs;
      hy += (thy - hy) * hs;
      hr += (throt - hr) * hs;
      hop += (tOp - hop) * (1 - Math.exp(-5.8 * dt));

      const homeX = hx - LEAF_W / 2;

      if (mode === "ride") {
        const s = 1 - Math.exp(-3.4 * dt);
        x += (homeX - x) * s;
        y += (hy - y) * s;
        rot += (hr - rot) * s;
        vx = 0;
        vy = 0;
      } else if (mode === "drag") {
        const lastP = trail[trail.length - 1];
        if (lastP) {
          const txp = lastP.x + grabDX - LEAF_W / 2;
          const typ = lastP.y + grabDY - LEAF_H / 2;
          const f = 1 - Math.exp(-22 * dt);
          x += (txp - x) * f;
          y += (typ - y) * f;
        }
        const tv = trailVelocity();
        const lean = clamp(tv.vx * 0.03, -22, 22);
        rot += (hr + lean - rot) * (1 - Math.exp(-8 * dt));
      } else {
        // settle: fling with momentum, then a near-critically-damped spring home
        const K = 22;
        const D = 8.8;
        vx += ((homeX - x) * K - vx * D) * dt;
        vy += ((hy - y) * K - vy * D) * dt;
        x += vx * dt;
        y += vy * dt;
        const lean = clamp(vx * 0.03, -22, 22);
        rot += (hr + lean - rot) * (1 - Math.exp(-8 * dt));
        if (Math.hypot(homeX - x, hy - y) < 2 && Math.hypot(vx, vy) < 25) {
          mode = "ride";
          vx = 0;
          vy = 0;
        }
      }

      const bob = mode === "ride" ? Math.sin(now / 1100) * 6 : 0;
      wrap.style.transform = `translate3d(${x.toFixed(1)}px, ${(y + bob).toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`;
      wrap.style.opacity = hop.toFixed(3);

      const nextShadow = heldRef.current
        ? "drop-shadow(0 46px 46px rgba(0,0,0,0.60))"
        : "drop-shadow(0 26px 30px rgba(0,0,0,0.45))";
      if (nextShadow !== shadow) {
        wrap.style.filter = nextShadow;
        shadow = nextShadow;
      }

      raf = requestAnimationFrame(tick);
    };

    leaf.addEventListener("pointerdown", onDown);
    leaf.addEventListener("pointermove", onMove);
    leaf.addEventListener("pointerup", onRelease);
    leaf.addEventListener("pointercancel", onRelease);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      leaf.removeEventListener("pointerdown", onDown);
      leaf.removeEventListener("pointermove", onMove);
      leaf.removeEventListener("pointerup", onRelease);
      leaf.removeEventListener("pointercancel", onRelease);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-40 will-change-transform"
      style={{ width: LEAF_W, opacity: 0 }}
    >
      <div
        ref={leafRef}
        className="pointer-events-auto touch-none select-none"
        style={{
          cursor: held ? "grabbing" : "grab",
          transform: held ? "scale(1.06)" : "scale(1)",
          transition: "transform 160ms ease-out",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <BodhiLeafArt />
      </div>
    </div>
  );
}
