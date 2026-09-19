"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

/*
 * Pencil-sketch loader. On a visitor's first page view of the browser session
 * the full choreography plays for ~5.3s (mountains -> Buddha -> Nalanda ->
 * tribal tree-of-life -> wordmark). Return visits get a shorter 2.3s pass;
 * in-session route changes get a compact ~950ms ring. Tap / Escape skips.
 *
 * Smoothness contract: every phase transition is a pure opacity crossfade
 * (outgoing scene layer fades via CSS transition, incoming layer fades in via
 * CSS keyframes on mount). All stroke drawing is CSS stroke-dashoffset with a
 * fixed per-phase duration — no JS timers, no rAF stepping. Nothing animates
 * layout properties, box-shadow, blur, or filter.
 */
const SEEN_KEY = "jubaan-loader-seen";
const FIRST_SCENE_MS = 1150;
const FIRST_TOTAL_MS = 5300;
const RETURN_SCENE_MS = 520;
const RETURN_TOTAL_MS = 2300;
const ROUTE_MS = 950;
/* Must match --loader-crossfade in globals.css */
const CROSSFADE_MS = 380;
const REDUCED_MS = 500;

const STROKE = "#e8d9b8";

/* Fixed pencil-draw duration per phase — consistent pacing, no per-stroke
   duration overrides. Index: 0 Himalaya, 1 Buddha, 2 Nalanda, 3 Tribal. */
const PHASE_DRAW_MS = [700, 950, 800, 650] as const;

const SCENE_LABELS = [
  "the eternal Himalaya",
  "the Awakened One",
  "Nalanda — seat of learning",
  "the tribal hearth",
];

/* CSS custom properties for stroke timing (typed so tsc is happy). */
type CSSVars = CSSProperties & { [key: `--${string}`]: string | number };

/* ------------------------- sketch stroke helpers ------------------------ */

function Strokes({
  d,
  delay = 0,
  opacity = 0.9,
  width = 2.2,
}: {
  d: string[];
  delay?: number;
  opacity?: number;
  width?: number;
}) {
  return (
    <>
      {d.map((p, i) => (
        <path
          key={i}
          d={p}
          pathLength={1}
          className="sketch-stroke"
          style={{ "--draw-delay": `${delay + i * 70}ms` } as CSSVars}
          fill="none"
          stroke={STROKE}
          strokeWidth={width}
          strokeLinecap="round"
          opacity={opacity}
        />
      ))}
    </>
  );
}

function Dots({ pts, delay = 0 }: { pts: [number, number][]; delay?: number }) {
  return (
    <>
      {pts.map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={3.4}
          pathLength={1}
          className="sketch-stroke"
          style={{ "--draw-delay": `${delay + i * 55}ms` } as CSSVars}
          fill="none"
          stroke={STROKE}
          strokeWidth={2}
          opacity={0.85}
        />
      ))}
    </>
  );
}

/* ------------------------------ the scenes ------------------------------ */

function SceneHimalaya() {
  return (
    <g>
      <circle
        cx={318}
        cy={64}
        r={20}
        pathLength={1}
        className="sketch-stroke"
        fill="none"
        stroke={STROKE}
        strokeWidth={2}
        opacity={0.5}
      />
      <Strokes
        delay={130}
        opacity={0.4}
        d={["M-10,232 L70,168 L140,214 L220,150 L300,208 L380,164 L410,190"]}
      />
      <Strokes
        delay={280}
        d={["M-10,258 L60,196 L120,238 L190,176 L260,232 L330,190 L410,240"]}
      />
      <Strokes
        delay={440}
        opacity={0.6}
        width={1.8}
        d={["M96,72 q7,-7 14,0", "M118,62 q7,-7 14,0"]}
      />
    </g>
  );
}

/**
 * The Buddha in serene profile, facing left — traced from classical
 * iconography: ushnisha crown, snail-shell curls, long arched brow,
 * downcast closed eye, straight nose, calm lips, elongated earlobe,
 * and draped monastic robes over the shoulder.
 */
function SceneBuddha() {
  return (
    <g>
      {/* faint halo */}
      <circle
        cx={168}
        cy={142}
        r={102}
        pathLength={1}
        className="sketch-stroke"
        style={{ "--draw-delay": "40ms" } as CSSVars}
        fill="none"
        stroke={STROKE}
        strokeWidth={1.6}
        opacity={0.22}
      />
      {/* head outline: nape -> crown -> ushnisha -> forehead -> nose -> lips -> chin -> jaw -> neck -> shoulder */}
      <Strokes
        delay={90}
        width={2.6}
        d={[
          "M252,300 C240,274 228,254 222,234 C218,220 220,210 228,202 C246,188 254,160 250,130 C247,102 234,80 212,68 C206,60 204,54 202,46 C200,38 192,32 182,32 C172,32 164,38 162,46 C160,54 158,58 152,62 C140,68 130,76 124,88 C120,96 118,102 116,108 C114,114 110,120 106,128 C102,136 96,144 92,150 C90,154 92,158 96,160 C100,162 102,164 102,168 C102,172 100,174 98,176 C96,180 98,184 104,186 C108,188 110,192 112,196 C114,202 120,206 128,208 C142,212 158,214 172,212 C184,210 194,206 200,200 C206,222 202,246 194,264 C186,284 172,296 152,300",
        ]}
      />
      {/* ushnisha curls + hairline */}
      <Strokes
        delay={560}
        opacity={0.8}
        width={1.8}
        d={[
          "M170,37 q6,-5 12,0",
          "M184,35 q6,-5 12,0",
          "M154,64 q7,-6 13,-1",
          "M168,57 q7,-6 13,-1",
          "M141,75 q7,-6 13,-1",
        ]}
      />
      {/* brow + closed downcast eye */}
      <Strokes
        delay={680}
        width={2.4}
        d={["M108,113 C121,104 136,102 149,107"]}
      />
      <Strokes
        delay={760}
        width={2.2}
        d={["M114,132 C122,136 132,136 140,132", "M116,127 C124,129 132,129 138,127"]}
      />
      {/* nostril + lips */}
      <Strokes
        delay={830}
        opacity={0.85}
        width={1.9}
        d={["M93,158 q4,2 8,1", "M97,180 C101,182 106,182 110,180"]}
      />
      {/* elongated earlobe */}
      <Strokes
        delay={900}
        width={2.4}
        d={[
          "M208,116 C217,122 219,136 215,150 C211,164 205,176 198,186 C194,192 187,193 183,188",
          "M204,132 C208,141 207,154 201,166",
        ]}
      />
      {/* robe folds */}
      <Strokes
        delay={980}
        opacity={0.65}
        width={2}
        d={[
          "M118,300 C138,272 158,254 184,244",
          "M88,300 C112,268 138,250 166,242",
        ]}
      />
    </g>
  );
}

/**
 * Nalanda — the great Sariputta Stupa: a massive terraced brick pyramid
 * with a central stair, ringed by small votive stupas in the foreground.
 */
function SceneNalanda() {
  return (
    <g>
      {/* ground */}
      <Strokes delay={60} d={["M36,254 L364,254"]} />
      {/* stepped pyramid terraces */}
      <Strokes
        delay={150}
        width={2.4}
        d={[
          "M66,254 L92,198 L308,198 L334,254",
          "M106,198 L124,156 L276,156 L294,198",
          "M138,156 L152,120 L248,120 L262,156",
          "M152,120 L248,120",
        ]}
      />
      {/* crowning remnant */}
      <Strokes
        delay={520}
        opacity={0.85}
        width={2}
        d={["M188,120 L192,102 L208,102 L212,120", "M192,102 L208,102"]}
      />
      {/* central stair */}
      <Strokes
        delay={620}
        opacity={0.75}
        width={1.8}
        d={[
          "M190,254 L195,120",
          "M210,254 L205,120",
          "M190,230 L210,230",
          "M191,206 L209,206",
          "M192,182 L208,182",
          "M193,158 L207,158",
          "M194,138 L206,138",
        ]}
      />
      {/* brick-course ticks on the lowest terrace */}
      <Strokes
        delay={760}
        opacity={0.4}
        width={1.6}
        d={[
          "M132,198 L132,214",
          "M172,198 L172,214",
          "M228,198 L228,214",
          "M268,198 L268,214",
        ]}
      />
      {/* votive stupa, left foreground */}
      <Strokes
        delay={820}
        opacity={0.85}
        width={2}
        d={[
          "M40,254 L40,240 L74,240 L74,254",
          "M40,240 A17,17 0 0 1 74,240",
          "M57,223 L57,212",
          "M51,216 L63,216",
        ]}
      />
      {/* votive stupa, right foreground */}
      <Strokes
        delay={900}
        opacity={0.85}
        width={2}
        d={[
          "M308,254 L308,242 L344,242 L344,254",
          "M308,242 A18,18 0 0 1 344,242",
          "M326,224 L326,214",
        ]}
      />
      {/* small votive stupa, centre foreground */}
      <Strokes
        delay={960}
        opacity={0.7}
        width={1.8}
        d={[
          "M148,264 L148,252 L182,252 L182,264",
          "M148,252 A17,17 0 0 1 182,252",
        ]}
      />
      {/* birds */}
      <Strokes
        delay={1020}
        opacity={0.45}
        width={1.6}
        d={["M62,62 q6,-6 12,0 q6,-6 12,0", "M300,48 q5,-5 10,0 q5,-5 10,0"]}
      />
    </g>
  );
}

function SceneTribal() {
  return (
    <g>
      <Strokes delay={60} d={["M110,256 L290,256"]} />
      <Strokes
        delay={140}
        d={["M200,256 C196,224 204,196 200,160"]}
      />
      <Strokes
        delay={260}
        opacity={0.85}
        d={[
          "M200,214 C178,206 160,192 150,170",
          "M200,214 C222,206 240,192 250,170",
          "M200,186 C184,178 174,162 172,144",
          "M200,186 C216,178 226,162 228,144",
          "M200,160 C200,140 198,120 200,104",
        ]}
      />
      <Dots
        delay={480}
        pts={[
          [150, 164],
          [172, 138],
          [250, 164],
          [228, 138],
          [200, 98],
          [128, 196],
          [272, 196],
          [200, 128],
        ]}
      />
      <Strokes
        delay={640}
        opacity={0.55}
        width={1.8}
        d={[
          "M200,256 C190,264 178,266 168,264",
          "M200,256 C210,264 222,266 232,264",
        ]}
      />
    </g>
  );
}

const SCENES = [SceneHimalaya, SceneBuddha, SceneNalanda, SceneTribal];

function SceneSvg({ index }: { index: number }) {
  const Scene = SCENES[index];
  return (
    <svg
      viewBox="0 0 400 300"
      className="h-auto w-full"
      role="img"
      aria-label={`Pencil sketch: ${SCENE_LABELS[index]}`}
    >
      <g filter="url(#jbn-pencil)">
        <Scene />
      </g>
    </svg>
  );
}

/* -------------------------------- loader -------------------------------- */

type Phase = { index: number; prev: number | null };

export default function PageLoader() {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [compact, setCompact] = useState(false);
  /* Small state machine: `index` is the scene drawing now, `prev` is the
     outgoing scene still crossfading out (null when settled). */
  const [phase, setPhase] = useState<Phase>({ index: 0, prev: null });
  const firstPath = useRef(true);
  const dismissed = useRef(false);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  const dismiss = useCallback(() => {
    if (dismissed.current) return;
    dismissed.current = true;
    clearTimers();
    setVisible(false);
  }, [clearTimers]);

  /* initial page load: full sketch choreography.
     First view of the browser session gets the complete ~5.3s sequence;
     later full loads in the same session get a shorter 2.3s pass. */
  useEffect(() => {
    if (reduce) {
      dismissed.current = true;
      const t = window.setTimeout(() => setVisible(false), REDUCED_MS);
      return () => window.clearTimeout(t);
    }
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      /* storage unavailable — treat as first visit */
    }
    const sceneMs = seen ? RETURN_SCENE_MS : FIRST_SCENE_MS;
    const totalMs = seen ? RETURN_TOTAL_MS : FIRST_TOTAL_MS;

    const advance = (i: number) => {
      setPhase((p) => ({ index: i, prev: p.index }));
      /* Retire the outgoing layer once its fade-out completes. */
      timers.current.push(
        window.setTimeout(() => {
          setPhase((p) => (p.index === i ? { index: p.index, prev: null } : p));
        }, CROSSFADE_MS + 80)
      );
    };

    for (let i = 1; i < SCENES.length; i++) {
      timers.current.push(window.setTimeout(() => advance(i), i * sceneMs));
    }
    timers.current.push(
      window.setTimeout(() => {
        try {
          window.sessionStorage.setItem(SEEN_KEY, "1");
        } catch {
          /* ignore */
        }
        dismiss();
      }, totalMs)
    );
    return () => {
      clearTimers();
    };
  }, [reduce, dismiss, clearTimers]);

  /* route transitions: compact loader */
  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    if (reduce) return;
    const raf = requestAnimationFrame(() => {
      dismissed.current = false;
      setCompact(true);
      setPhase({ index: 0, prev: null });
      setVisible(true);
    });
    const t = window.setTimeout(dismiss, ROUTE_MS);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [pathname, reduce, dismiss]);

  /* lock scroll while the loader is up */
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  /* skippable */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dismiss]);

  /* Reduced motion: static, simple state — no animated strokes or phases. */
  if (reduce) {
    return (
      <AnimatePresence>
        {visible && (
          <motion.div
            key="jubaan-loader-static"
            role="status"
            aria-label="Loading JUBAAN"
            onClick={dismiss}
            className="fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center gap-3 bg-ink"
            exit={{ opacity: 0, transition: { duration: 0.3, ease: "easeOut" } }}
          >
            <p className="pl-2 font-display text-3xl font-semibold tracking-[0.35em] text-cream">
              JUBAAN
            </p>
            <p className="text-[11px] uppercase tracking-[0.28em] text-gold/80">
              हमारी विरासत, हमारी जुबानी
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  /* Layers to render: outgoing scene (fading) + incoming scene (drawing).
     Keyed by scene index so the outgoing layer keeps its DOM node and the
     CSS opacity transition actually crossfades instead of remounting. */
  const layers =
    phase.prev !== null && phase.prev !== phase.index
      ? [phase.prev, phase.index]
      : [phase.index];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="jubaan-loader"
          role="status"
          aria-label="Loading JUBAAN"
          onClick={dismiss}
          className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-ink"
          exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeOut" } }}
        >
          {/* pencil-grain filter defined once; scene layers reference it */}
          <svg width={0} height={0} aria-hidden="true" className="absolute">
            <defs>
              <filter id="jbn-pencil" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.035"
                  numOctaves="2"
                  seed="7"
                  result="n"
                />
                <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" />
              </filter>
            </defs>
          </svg>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,164,65,0.07)_0%,transparent_65%)]"
          />
          {compact ? (
            <div className="relative text-center">
              <svg viewBox="0 0 100 100" className="mx-auto mb-5 h-16 w-16">
                <circle
                  cx={50}
                  cy={50}
                  r={44}
                  pathLength={1}
                  className="sketch-stroke"
                  fill="none"
                  stroke={STROKE}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
              </svg>
              <p className="pl-1 font-display text-sm tracking-[0.4em] text-cream">
                JUBAAN
              </p>
            </div>
          ) : (
            <div className="relative w-[min(82vw,400px)]">
              <div className="relative aspect-[4/3]">
                {layers.map((i) => (
                  <div
                    key={i}
                    aria-hidden={i !== phase.index}
                    className={`loader-scene ${
                      i === phase.index
                        ? "loader-scene--active"
                        : "loader-scene--leaving"
                    }`}
                    style={{ "--draw-dur": `${PHASE_DRAW_MS[i]}ms` } as CSSVars}
                  >
                    <SceneSvg index={i} />
                  </div>
                ))}
              </div>

              <div className="relative mt-4 h-4">
                {layers.map((i) => (
                  <p
                    key={i}
                    aria-hidden={i !== phase.index}
                    className={`loader-label-text text-center text-[11px] uppercase tracking-[0.32em] text-muted ${
                      i === phase.index
                        ? "loader-label-text--active"
                        : "loader-label-text--leaving"
                    }`}
                  >
                    {SCENE_LABELS[i]}
                  </p>
                ))}
              </div>

              {phase.index >= SCENES.length - 1 && (
                <div className="loader-wordmark mt-5 text-center">
                  <p className="pl-2 font-display text-3xl font-semibold tracking-[0.35em] text-cream">
                    JUBAAN
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-gold/80">
                    हमारी विरासत, हमारी जुबानी
                  </p>
                </div>
              )}
            </div>
          )}

          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-muted/60">
            tap to skip
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
