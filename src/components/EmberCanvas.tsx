"use client";

import { useEffect, useRef } from "react";

type Props = {
  className?: string;
  /** 0..1 — particle density multiplier */
  density?: number;
  /** enable mouse-parallax drift */
  interactive?: boolean;
  /** also render a few large soft bokeh glows */
  bokeh?: boolean;
};

type P = {
  kind: "ember" | "leaf";
  x: number; // 0..1 base position
  y: number;
  r: number; // px radius
  depth: number; // 0..1 parallax depth
  vy: number; // vertical velocity px/s (negative = rising)
  vx: number; // horizontal drift px/s
  phase: number; // flicker/sway phase
  speed: number; // flicker/sway speed
  rot: number;
  rotV: number;
  alpha: number;
  sprite: number; // index into glow sprites
};

function makeGlowSprite(size: number, stops: [number, string][]): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [o, col] of stops) grad.addColorStop(o, col);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

/**
 * Cinematic canvas atmosphere: rising diya embers, drifting Bodhi leaves and
 * soft golden bokeh. DPR-aware, pauses off-screen, and renders a single static
 * frame when the user prefers reduced motion.
 */
export default function EmberCanvas({ className, density = 1, interactive = true, bokeh = true }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sprites = [
      makeGlowSprite(64, [[0, "rgba(255,214,130,1)"], [0.35, "rgba(233,178,80,0.55)"], [1, "rgba(233,178,80,0)"]]),
      makeGlowSprite(64, [[0, "rgba(255,190,120,1)"], [0.35, "rgba(221,122,45,0.5)"], [1, "rgba(221,122,45,0)"]]),
      makeGlowSprite(64, [[0, "rgba(190,230,170,0.9)"], [0.35, "rgba(111,160,111,0.4)"], [1, "rgba(111,160,111,0)"]]),
    ];
    const bokehSprite = makeGlowSprite(256, [[0, "rgba(217,164,65,0.5)"], [0.6, "rgba(217,164,65,0.12)"], [1, "rgba(217,164,65,0)"]]);

    let w = 0;
    let h = 0;
    let parts: P[] = [];
    let orbs: { x: number; y: number; r: number; depth: number; phase: number; speed: number }[] = [];
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    let raf = 0;
    let running = false;
    let last = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.min(170, Math.floor(((w * h) / 11000) * density));
      parts = Array.from({ length: target }, (_, i) => {
        const leaf = i % 4 === 0;
        return {
          kind: leaf ? "leaf" : "ember",
          x: Math.random(),
          y: Math.random(),
          r: leaf ? 5 + Math.random() * 7 : 1.5 + Math.random() * 3.4,
          depth: 0.25 + Math.random() * 0.75,
          vy: leaf ? -(4 + Math.random() * 8) : -(10 + Math.random() * 26),
          vx: (Math.random() - 0.5) * 12,
          phase: Math.random() * Math.PI * 2,
          speed: 0.6 + Math.random() * 1.8,
          rot: Math.random() * Math.PI * 2,
          rotV: (Math.random() - 0.5) * 0.6,
          alpha: 0.35 + Math.random() * 0.55,
          sprite: Math.random() < 0.62 ? 0 : Math.random() < 0.75 ? 1 : 2,
        };
      });
      orbs = bokeh
        ? Array.from({ length: 6 }, () => ({
            x: Math.random(),
            y: 0.2 + Math.random() * 0.8,
            r: 90 + Math.random() * 170,
            depth: 0.1 + Math.random() * 0.25,
            phase: Math.random() * Math.PI * 2,
            speed: 0.15 + Math.random() * 0.3,
          }))
        : [];
    };

    const drawLeaf = (p: P, px: number, py: number, t: number) => {
      const s = p.r * (1 + 0.12 * Math.sin(t * p.speed + p.phase));
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(p.rot + t * p.rotV * 0.4);
      ctx.globalAlpha = p.alpha * 0.85;
      // bodhi-leaf silhouette: two quadratic curves + tip
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(s * 0.85, -s * 0.25, 0, s);
      ctx.quadraticCurveTo(-s * 0.85, -s * 0.25, 0, -s);
      ctx.fillStyle = p.sprite === 2 ? "rgba(111,160,111,0.9)" : "rgba(217,164,65,0.85)";
      ctx.fill();
      // tiny stem
      ctx.beginPath();
      ctx.moveTo(0, s);
      ctx.lineTo(0, s + s * 0.35);
      ctx.strokeStyle = "rgba(217,164,65,0.7)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const ox = (mouse.x - 0.5) * 70;
      const oy = (mouse.y - 0.5) * 46;

      for (const o of orbs) {
        const breathe = 0.75 + 0.25 * Math.sin(t * o.speed + o.phase);
        const s = o.r * breathe * 2;
        ctx.globalAlpha = 0.16;
        ctx.drawImage(bokehSprite, o.x * w - ox * o.depth - s / 2, o.y * h - oy * o.depth - s / 2, s, s);
      }
      ctx.globalAlpha = 1;

      for (const p of parts) {
        const px = p.x * w - ox * p.depth + Math.sin(t * p.speed + p.phase) * 14 * p.depth;
        const py = p.y * h - oy * p.depth;
        if (px < -40 || px > w + 40 || py < -40 || py > h + 40) continue;
        if (p.kind === "leaf") {
          drawLeaf(p, px, py, t);
        } else {
          const flick = 0.72 + 0.28 * Math.sin(t * p.speed * 2.2 + p.phase);
          const s = p.r * 5 * flick;
          ctx.globalAlpha = p.alpha * flick;
          ctx.drawImage(sprites[p.sprite], px - s / 2, py - s / 2, s, s);
        }
      }
      ctx.globalAlpha = 1;
    };

    const step = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      // ease mouse toward target
      mouse.x += (mouse.tx - mouse.x) * 0.045;
      mouse.y += (mouse.ty - mouse.y) * 0.045;
      const t = now / 1000;
      for (const p of parts) {
        p.y += (p.vy * dt) / h;
        p.x += ((p.vx + Math.sin(t * p.speed + p.phase) * 9) * dt) / w;
        if (p.y < -0.06) {
          p.y = 1.06;
          p.x = Math.random();
        }
        if (p.x < -0.06) p.x = 1.06;
        else if (p.x > 1.06) p.x = -0.06;
      }
      draw(t);
      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMouse = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - rect.left) / Math.max(1, rect.width);
      mouse.ty = (e.clientY - rect.top) / Math.max(1, rect.height);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) start();
        else stop();
      },
      { threshold: 0.02 }
    );
    const onVis = () => (document.hidden ? stop() : start());

    resize();
    if (reduced) {
      // one composed, static frame — atmosphere without motion
      draw(2.4);
    } else {
      start();
    }
    window.addEventListener("resize", resize);
    if (interactive && !reduced) window.addEventListener("pointermove", onMouse, { passive: true });
    io.observe(canvas);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMouse);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [density, interactive, bokeh]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className ?? "pointer-events-none absolute inset-0 h-full w-full"}
    />
  );
}
