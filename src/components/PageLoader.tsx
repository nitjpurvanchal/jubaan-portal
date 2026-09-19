"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

const SCENE_MS = 520; // each sketch scene's screen time
const MIN_MS = 1500; // minimum loader presence on first load
const MAX_MS = 2200; // hard cap on first load
const ROUTE_MS = 950; // loader presence on route transitions

const STROKE = "#e8d9b8";

const SCENE_LABELS = [
  "the eternal Himalaya",
  "the Awakened One",
  "Nalanda — seat of learning",
  "the tribal hearth",
];

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
          style={{ animationDelay: `${delay + i * 70}ms` }}
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
          style={{ animationDelay: `${delay + i * 55}ms` }}
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

function SceneBuddha() {
  return (
    <g>
      <circle
        cx={205}
        cy={150}
        r={88}
        pathLength={1}
        className="sketch-stroke"
        style={{ animationDelay: "60ms" }}
        fill="none"
        stroke={STROKE}
        strokeWidth={1.6}
        opacity={0.3}
      />
      <Strokes
        delay={140}
        d={[
          "M258,44 C246,62 240,80 237,98 L231,124 C229,132 233,137 240,137 C236,143 238,149 244,151 C239,159 244,169 256,173 C268,178 272,190 269,204 C267,218 250,228 224,232",
        ]}
      />
      <Strokes
        delay={520}
        opacity={0.7}
        width={1.8}
        d={["M240,96 q11,-3 21,2", "M243,108 q9,6 18,1"]}
      />
      <Strokes
        delay={640}
        opacity={0.8}
        width={1.8}
        d={[
          "M266,128 c9,3 10,15 2,21 c-6,4 -14,1 -15,-6",
          "M258,44 c6,-8 18,-6 20,4",
        ]}
      />
      <circle cx={241} cy={88} r={2.6} fill={STROKE} opacity={0.85} />
    </g>
  );
}

function SceneNalanda() {
  return (
    <g>
      <Strokes delay={60} d={["M70,232 L330,232"]} />
      <Strokes delay={140} d={["M86,232 L86,206 L314,206 L314,232"]} />
      <Strokes
        delay={260}
        d={["M104,206 A96,78 0 0 1 296,206"]}
      />
      <Strokes
        delay={420}
        opacity={0.75}
        width={1.8}
        d={[
          "M186,118 L214,118 L214,134 L186,134 Z",
          "M200,118 L200,58",
          "M182,72 L218,72",
          "M188,86 L212,86",
          "M193,100 L207,100",
        ]}
      />
      <Strokes
        delay={560}
        opacity={0.7}
        width={1.8}
        d={[
          "M128,206 L128,182 A14,14 0 0 1 156,182 L156,206",
          "M186,206 L186,182 A14,14 0 0 1 214,182 L214,206",
          "M244,206 L244,182 A14,14 0 0 1 272,182 L272,206",
        ]}
      />
      <Strokes
        delay={700}
        opacity={0.4}
        width={1.8}
        d={["M150,250 L250,250", "M165,262 L235,262"]}
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

/* -------------------------------- loader -------------------------------- */

export default function PageLoader() {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [compact, setCompact] = useState(false);
  const [scene, setScene] = useState(0);
  const firstPath = useRef(true);
  const dismissed = useRef(false);

  const dismiss = useCallback(() => {
    if (dismissed.current) return;
    dismissed.current = true;
    setVisible(false);
  }, []);

  /* initial page load: full sketch choreography */
  useEffect(() => {
    if (reduce) {
      dismissed.current = true;
      const t = window.setTimeout(() => setVisible(false), 0);
      return () => window.clearTimeout(t);
    }
    const timers: number[] = [];
    const start = Date.now();
    for (let i = 1; i < SCENES.length; i++) {
      timers.push(window.setTimeout(() => setScene(i), i * SCENE_MS));
    }
    const finish = () => {
      const elapsed = Date.now() - start;
      timers.push(
        window.setTimeout(dismiss, Math.max(0, MIN_MS - elapsed))
      );
    };
    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
      timers.push(window.setTimeout(dismiss, MAX_MS)); // hard cap
    }
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("load", finish);
    };
  }, [reduce, dismiss]);

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
      setScene(0);
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

  if (reduce) return null;
  const Scene = SCENES[scene];

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
              <motion.div
                key={scene}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.28 }}
              >
                <svg
                  viewBox="0 0 400 300"
                  className="h-auto w-full"
                  role="img"
                  aria-label={`Pencil sketch: ${SCENE_LABELS[scene]}`}
                >
                  <defs>
                    <filter
                      id="jbn-pencil"
                      x="-20%"
                      y="-20%"
                      width="140%"
                      height="140%"
                    >
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.035"
                        numOctaves="2"
                        seed="7"
                        result="n"
                      />
                      <feDisplacementMap
                        in="SourceGraphic"
                        in2="n"
                        scale="2.6"
                      />
                    </filter>
                  </defs>
                  <g filter="url(#jbn-pencil)">
                    <Scene />
                  </g>
                </svg>
              </motion.div>

              <p className="mt-4 text-center text-[11px] uppercase tracking-[0.32em] text-muted">
                {SCENE_LABELS[scene]}
              </p>

              <AnimatePresence>
                {scene >= SCENES.length - 1 && (
                  <motion.div
                    key="wordmark"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-5 text-center"
                  >
                    <p className="pl-2 font-display text-3xl font-semibold tracking-[0.35em] text-cream">
                      JUBAAN
                    </p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-gold/80">
                      हमारी विरासत, हमारी जुबानी
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
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
