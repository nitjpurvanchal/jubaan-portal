"use client";

import { useEffect, useRef, useState } from "react";

type Leaf = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  rotV: number;
  swayAmp: number;
  swayFreq: number;
  phase: number;
  alpha: number;
  gold: boolean;
};

const MAX_LEAVES = 70;

/** Draw a Bodhi leaf: heart-shaped blade, drip tip and stem. */
function paintLeaf(
  ctx: CanvasRenderingContext2D,
  s: number,
  rgb: string
) {
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.bezierCurveTo(s * 0.85, -s * 0.75, s * 0.75, s * 0.35, 0, s * 0.9);
  ctx.bezierCurveTo(-s * 0.75, s * 0.35, -s * 0.85, -s * 0.75, 0, -s);
  ctx.closePath();
  ctx.fillStyle = rgb;
  ctx.fill();
  // drip tip + centre vein
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.9);
  ctx.lineTo(0, s * 0.75);
  ctx.moveTo(0, s * 0.9);
  ctx.quadraticCurveTo(s * 0.1, s * 1.1, 0, s * 1.35);
  ctx.strokeStyle = rgb;
  ctx.lineWidth = Math.max(1, s * 0.12);
  ctx.lineCap = "round";
  ctx.stroke();
}

/**
 * Scroll-driven Bodhi leaves. A fixed canvas layer where leaf spawn rate is
 * driven by scroll velocity — fast scrolling shakes a burst of leaves loose,
 * gentle reading lets a few drift down. Capped, DPR-aware, pauses offscreen,
 * and never mounts under reduced motion.
 */
export default function FallingLeaves() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [enabled] = useState(
    () =>
      typeof window !== "undefined" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (!enabled) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const leaves: Leaf[] = [];
    const spawn = (burst: boolean) => {
      if (leaves.length >= MAX_LEAVES) leaves.shift();
      leaves.push({
        x: Math.random() * w,
        y: -30,
        vx: (Math.random() - 0.5) * 36,
        vy: 45 + Math.random() * 75 + (burst ? 45 : 0),
        size: 6 + Math.random() * 9,
        rot: Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 3.2,
        swayAmp: 22 + Math.random() * 42,
        swayFreq: 0.6 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.32 + Math.random() * 0.34,
        gold: Math.random() < 0.62,
      });
    };

    let raf = 0;
    let lastY = window.scrollY;
    let vel = 0;
    let lastT = performance.now();
    let acc = 0;

    const tick = (t: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (t - lastT) / 1000));
      lastT = t;

      // smoothed scroll velocity (px/s)
      const y = window.scrollY;
      const inst = Math.abs(y - lastY) / dt;
      vel = vel * 0.88 + inst * 0.12;
      lastY = y;

      // ambient drift + velocity-driven bursts
      acc += dt * (1.1 + Math.min(vel / 55, 26));
      while (acc >= 1) {
        acc -= 1;
        spawn(vel > 520);
      }

      ctx.clearRect(0, 0, w, h);
      const time = t / 1000;
      for (let i = leaves.length - 1; i >= 0; i--) {
        const l = leaves[i];
        l.y += l.vy * dt;
        l.x += (l.vx + Math.sin(time * l.swayFreq + l.phase) * l.swayAmp) * dt;
        l.rot += l.rotV * dt;
        if (l.y > h + 46) {
          leaves.splice(i, 1);
          continue;
        }
        const edgeFade = Math.min(1, (h + 46 - l.y) / 130);
        const topFade = Math.min(1, (l.y + 30) / 60);
        ctx.save();
        ctx.translate(l.x, l.y);
        ctx.rotate(l.rot);
        ctx.globalAlpha = Math.max(0, l.alpha * edgeFade * topFade);
        paintLeaf(ctx, l.size, l.gold ? "rgb(217,164,65)" : "rgb(111,160,111)");
        ctx.restore();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40"
    />
  );
}
