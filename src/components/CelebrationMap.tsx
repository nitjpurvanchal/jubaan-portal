"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { circuitSites } from "@/lib/data";
import {
  sacredSiteCoords,
  celebrationSpots,
  getCelebrationDetail,
  type CelebrationSpot,
} from "@/lib/celebrations";

/* ------------------------------------------------------------------ */
/* Projection: approximate lat/lng -> SVG coords (stylised, not survey) */
/* ------------------------------------------------------------------ */

const W = 820;
const H = 560;
const BOUNDS = { minLng: 76.4, maxLng: 87.2, minLat: 22.4, maxLat: 28.4 };

function project(lng: number, lat: number): [number, number] {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * W;
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * H;
  return [x, y];
}

function poly(points: [number, number][]): string {
  return points.map(([lng, lat]) => project(lng, lat).join(",")).join(" ");
}

/** Smooth curve through points (Catmull-Rom -> bezier). */
function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

/* Stylised state shapes (approximate) */
const UP_SHAPE: [number, number][] = [
  [77.6, 28.35], [80.5, 28.35], [84.7, 27.9], [84.7, 26.3],
  [83.6, 25.95], [82.6, 25.5], [81, 25.7], [79.5, 26.2], [78, 26.9], [77.6, 27.6],
];
const BIHAR_SHAPE: [number, number][] = [
  [83.3, 27.35], [86.9, 27.35], [86.9, 24.35], [86, 24.2],
  [84.5, 24.3], [83.6, 24.9], [83.3, 25.9],
];
const JHARKHAND_SHAPE: [number, number][] = [
  [83.4, 24.85], [86.85, 24.85], [86.85, 22.5], [84.5, 22.5], [83.4, 23.4],
];
const GANGA: [number, number][] = [
  [79.3, 27.7], [81, 26.9], [82.97, 25.32], [85.14, 25.61], [87.0, 25.3],
];

/* Journey order for the glowing route */
const ROUTE_ORDER = [
  "shravasti", "kushinagar", "kesaria", "vaishali",
  "nalanda", "rajgir", "bodh-gaya", "sarnath",
];

type LabelCfg = { dx: number; dy: number; anchor: "start" | "end" };
const SACRED_LABELS: Record<string, LabelCfg> = {
  "bodh-gaya": { dx: 11, dy: 4, anchor: "start" },
  sarnath: { dx: -11, dy: 4, anchor: "end" },
  nalanda: { dx: 11, dy: -7, anchor: "start" },
  rajgir: { dx: 11, dy: 13, anchor: "start" },
  vaishali: { dx: 11, dy: 4, anchor: "start" },
  kesaria: { dx: -11, dy: -5, anchor: "end" },
  kushinagar: { dx: -11, dy: 4, anchor: "end" },
  shravasti: { dx: 11, dy: -7, anchor: "start" },
};
const SPOT_LABELS: Record<string, LabelCfg> = {
  patna: { dx: 11, dy: 4, anchor: "start" },
  ranchi: { dx: 11, dy: 4, anchor: "start" },
  varanasi: { dx: -11, dy: 7, anchor: "end" },
  mathura: { dx: 11, dy: 4, anchor: "start" },
  ayodhya: { dx: 11, dy: 4, anchor: "start" },
  madhubani: { dx: -9, dy: -9, anchor: "end" },
};

type Layer = "sacred" | "celebrations";
type Selection =
  | { kind: "sacred"; slug: string }
  | { kind: "celebration"; id: string }
  | null;

export default function CelebrationMap() {
  const [layer, setLayer] = useState<Layer>("sacred");
  const [selected, setSelected] = useState<Selection>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const reduce = useReducedMotion();

  const routeD = useMemo(() => {
    const pts = ROUTE_ORDER.map((slug) => {
      const c = sacredSiteCoords[slug];
      return project(c.lng, c.lat);
    });
    return smoothPath(pts);
  }, []);
  const gangaD = useMemo(() => smoothPath(GANGA.map(([lng, lat]) => project(lng, lat))), []);

  const sacredMarkers = useMemo(
    () =>
      circuitSites.map((s) => {
        const c = sacredSiteCoords[s.slug];
        const [x, y] = project(c.lng, c.lat);
        return { ...s, x, y };
      }),
    []
  );
  const spotMarkers = useMemo(
    () =>
      celebrationSpots.map((sp) => {
        const [x, y] = project(sp.lng, sp.lat);
        return { ...sp, x, y };
      }),
    []
  );

  const selectedSacred = selected?.kind === "sacred"
    ? sacredMarkers.find((m) => m.slug === selected.slug) ?? null
    : null;
  const selectedSpot: (CelebrationSpot & { x: number; y: number }) | null =
    selected?.kind === "celebration"
      ? spotMarkers.find((m) => m.id === selected.id) ?? null
      : null;

  const hoverLabel =
    hovered != null
      ? sacredMarkers.find((m) => m.slug === hovered)?.name ??
        spotMarkers.find((m) => m.id === hovered)?.name ??
        null
      : null;
  const hoverSub =
    hovered != null
      ? sacredMarkers.find((m) => m.slug === hovered)?.tagline ??
        (() => {
          const sp = spotMarkers.find((m) => m.id === hovered);
          return sp ? sp.events.slice(0, 2).join(" · ") : null;
        })() ??
        null
      : null;
  const hoverPos =
    hovered != null
      ? (() => {
          const m =
            sacredMarkers.find((mm) => mm.slug === hovered) ??
            spotMarkers.find((mm) => mm.id === hovered);
          return m ? { x: m.x, y: m.y } : null;
        })()
      : null;

  const showSacred = layer === "sacred";

  return (
    <div className="rounded-[28px] border border-cream/10 bg-coal/70 overflow-hidden">
      {/* toggle */}
      <div className="flex items-center justify-between flex-wrap gap-4 px-6 md:px-8 pt-6">
        <div className="flex gap-2 p-1 rounded-full border border-cream/15 bg-ink/60">
          {(["sacred", "celebrations"] as const).map((l) => (
            <button
              key={l}
              onClick={() => { setLayer(l); setSelected(null); }}
              className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
                layer === l ? "text-ink" : "text-cream/60 hover:text-cream"
              }`}
            >
              {layer === l && (
                <motion.span
                  layoutId="map-layer-pill"
                  className="absolute inset-0 rounded-full bg-gold"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">{l === "sacred" ? "Sacred Sites" : "Celebrations"}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-5 text-xs text-muted">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gold shadow-[0_0_8px_rgba(217,164,65,0.9)]" /> Sacred site
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-saffron shadow-[0_0_8px_rgba(221,122,45,0.9)]" /> Celebration
          </span>
          {showSacred && (
            <span className="hidden sm:flex items-center gap-2">
              <span className="inline-block w-6 border-t-2 border-dashed border-gold/70" /> Circuit route
            </span>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_330px] gap-0">
        {/* map */}
        <div className="relative p-4 md:p-6">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none" role="img"
            aria-label="Stylised map of the Bihar, Uttar Pradesh and Jharkhand region">
            <defs>
              <radialGradient id="mapGlow" cx="50%" cy="42%" r="65%">
                <stop offset="0%" stopColor="#d9a441" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#d9a441" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="gangaGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6fa8c9" stopOpacity="0.25" />
                <stop offset="50%" stopColor="#a8d4ea" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#6fa8c9" stopOpacity="0.25" />
              </linearGradient>
              <linearGradient id="upLand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c9a86a" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#c9a86a" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="biharLand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d9a441" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#d9a441" stopOpacity="0.06" />
              </linearGradient>
              <linearGradient id="jhLand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6fa06f" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#6fa06f" stopOpacity="0.06" />
              </linearGradient>
              <pattern id="terrainDots" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="1.1" fill="rgba(247,240,221,0.055)" />
              </pattern>
              <filter id="markerGlow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="5" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="stateShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000000" floodOpacity="0.5" />
              </filter>
            </defs>

            <rect x="0" y="0" width={W} height={H} fill="url(#mapGlow)" rx="18" />
            {/* richer terrain: gradient land + etched texture + lifted shadow */}
            <g filter="url(#stateShadow)">
              <polygon points={poly(UP_SHAPE)} fill="url(#upLand)" stroke="rgba(233,196,110,0.4)" strokeWidth="2" strokeLinejoin="round" />
              <polygon points={poly(BIHAR_SHAPE)} fill="url(#biharLand)" stroke="rgba(233,196,110,0.45)" strokeWidth="2" strokeLinejoin="round" />
              <polygon points={poly(JHARKHAND_SHAPE)} fill="url(#jhLand)" stroke="rgba(233,196,110,0.4)" strokeWidth="2" strokeLinejoin="round" />
            </g>
            <polygon points={poly(UP_SHAPE)} fill="url(#terrainDots)" />
            <polygon points={poly(BIHAR_SHAPE)} fill="url(#terrainDots)" />
            <polygon points={poly(JHARKHAND_SHAPE)} fill="url(#terrainDots)" />
            {/* Ganga: soft wide wash under a bright thread */}
            <path d={gangaD} fill="none" stroke="#6fa8c9" strokeOpacity="0.14" strokeWidth="9" strokeLinecap="round" />
            <path d={gangaD} fill="none" stroke="url(#gangaGrad)" strokeWidth="2.5" strokeLinecap="round" />

            {(() => {
              const [nx, ny] = project(83.6, 28.22);
              const [ux, uy] = project(80.1, 27.62);
              const [bx, by] = project(85.62, 26.28);
              const [jx, jy] = project(85.25, 23.35);
              return (
                <g fill="rgba(247,240,221,0.28)" fontSize="13" letterSpacing="4" fontFamily="Inter, sans-serif" fontWeight="600">
                  <text x={nx} y={ny} textAnchor="middle">NEPAL</text>
                  <text x={ux} y={uy} textAnchor="middle">UTTAR PRADESH</text>
                  <text x={bx} y={by} textAnchor="middle">BIHAR</text>
                  <text x={jx} y={jy} textAnchor="middle">JHARKHAND</text>
                </g>
              );
            })()}

            {/* compass rose */}
            <g transform={`translate(${W - 46},52)`} opacity={0.75}>
              <circle r={21} fill="rgba(10,10,10,0.45)" stroke="rgba(233,196,110,0.45)" strokeWidth={1.2} />
              <path d="M0,-13 L5,4 L0,1 L-5,4 Z" fill="#e9c46e" />
              <text y={-26} textAnchor="middle" fill="#e9c46e" fontSize={11} fontWeight={700} fontFamily="Inter, sans-serif">N</text>
            </g>

            {/* circuit route */}
            {showSacred && (
              reduce ? (
                <path d={routeD} fill="none" stroke="#d9a441" strokeOpacity="0.55" strokeWidth="2" strokeDasharray="7 7" />
              ) : (
                <motion.path
                  d={routeD}
                  fill="none"
                  stroke="#d9a441"
                  strokeOpacity="0.75"
                  strokeWidth="2.5"
                  strokeDasharray="7 7"
                  filter="url(#markerGlow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3.2, ease: "easeInOut" }}
                />
              )
            )}

            {/* markers */}
            {showSacred
              ? sacredMarkers.map((m, i) => {
                  const cfg = SACRED_LABELS[m.slug] ?? { dx: 11, dy: 4, anchor: "start" as const };
                  const isSel = selected?.kind === "sacred" && selected.slug === m.slug;
                  const order = ROUTE_ORDER.indexOf(m.slug) + 1;
                  return (
                    <g key={m.slug} transform={`translate(${m.x},${m.y})`}
                      className="cursor-pointer"
                      onMouseEnter={() => setHovered(m.slug)}
                      onMouseLeave={() => setHovered((h) => (h === m.slug ? null : h))}
                      onClick={() => setSelected(isSel ? null : { kind: "sacred", slug: m.slug })}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                      {!reduce && (
                        <circle r={isSel ? 22 : 14} fill="none" stroke="#d9a441" strokeOpacity="0.5" className="animate-glow-pulse" />
                      )}
                      <motion.circle
                        r={isSel ? 8 : 6}
                        fill="#d9a441"
                        filter="url(#markerGlow)"
                        initial={reduce ? undefined : { scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.15 + i * 0.12, type: "spring", stiffness: 300, damping: 18 }}
                      />
                      {/* circuit order badge */}
                      <circle cx={11} cy={-11} r={8} fill="#141210" stroke="#e9c46e" strokeWidth={1.4} />
                      <text x={11} y={-7.5} textAnchor="middle" fill="#e9c46e" fontSize={9.5} fontWeight={700} fontFamily="Inter, sans-serif">
                        {order}
                      </text>
                      <text x={cfg.dx} y={cfg.dy} textAnchor={cfg.anchor} fill={isSel ? "#eac46e" : "rgba(247,240,221,0.78)"}
                        fontSize="12" fontWeight={isSel ? 700 : 500} fontFamily="Inter, sans-serif">
                        {m.name}
                      </text>
                    </g>
                  );
                })
              : spotMarkers.map((m, i) => {
                  const cfg = SPOT_LABELS[m.id] ?? { dx: 11, dy: 4, anchor: "start" as const };
                  const isSel = selected?.kind === "celebration" && selected.id === m.id;
                  return (
                    <g key={m.id} transform={`translate(${m.x},${m.y})`}
                      className="cursor-pointer"
                      onMouseEnter={() => setHovered(m.id)}
                      onMouseLeave={() => setHovered((h) => (h === m.id ? null : h))}
                      onClick={() => setSelected(isSel ? null : { kind: "celebration", id: m.id })}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                      {!reduce && (
                        <circle r={isSel ? 22 : 14} fill="none" stroke="#dd7a2d" strokeOpacity="0.5" className="animate-glow-pulse" />
                      )}
                      <motion.g
                        filter="url(#markerGlow)"
                        initial={reduce ? undefined : { scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 + i * 0.1, type: "spring", stiffness: 300, damping: 18 }}
                        style={{ transformBox: "fill-box", transformOrigin: "center" }}
                      >
                        <path
                          d={isSel ? "M0,-11 L11,0 L0,11 L-11,0 Z" : "M0,-8 L8,0 L0,8 L-8,0 Z"}
                          fill="#dd7a2d"
                          stroke="#f4b06a"
                          strokeWidth={1.2}
                        />
                      </motion.g>
                      <text x={cfg.dx} y={cfg.dy} textAnchor={cfg.anchor} fill={isSel ? "#f4b06a" : "rgba(247,240,221,0.78)"}
                        fontSize="12" fontWeight={isSel ? 700 : 500} fontFamily="Inter, sans-serif">
                        {m.name}
                      </text>
                    </g>
                  );
                })}
          </svg>

          {/* hover tooltip */}
          <AnimatePresence>
            {hoverLabel && hoverPos && (
              <motion.div
                key={hovered}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="absolute pointer-events-none z-10 px-4 py-2.5 rounded-2xl bg-ink/95 border border-gold/40 shadow-xl max-w-[240px]"
                style={{
                  left: `${(hoverPos.x / W) * 100}%`,
                  top: `${(hoverPos.y / H) * 100}%`,
                  transform: "translate(-50%, -115%)",
                }}
              >
                <p className="text-sm font-bold text-goldsoft leading-tight">{hoverLabel}</p>
                {hoverSub && (
                  <p className="text-[11px] text-cream/60 italic leading-snug mt-0.5 line-clamp-2">{hoverSub}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* detail panel */}
        <div className="border-t lg:border-t-0 lg:border-l border-cream/10 p-6 md:p-7 bg-ink/40">
          <AnimatePresence mode="wait">
            {selectedSacred ? (
              <motion.div key={`s-${selectedSacred.slug}`}
                initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}>
                <div className="h-1 w-16 rounded-full bg-gradient-to-r from-gold to-goldsoft mb-5" />
                <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-2">{selectedSacred.state} · Sacred site</p>
                <h3 className="font-display text-3xl mb-1">{selectedSacred.name}</h3>
                <p className="text-goldsoft italic font-display mb-4">{selectedSacred.tagline}</p>
                <p className="text-sm text-cream/65 leading-relaxed mb-4">{selectedSacred.description}</p>
                <ul className="space-y-1.5 mb-5">
                  {selectedSacred.significance.map((pt) => (
                    <li key={pt} className="text-xs text-cream/60 flex gap-2">
                      <span className="text-gold">✦</span><span>{pt}</span>
                    </li>
                  ))}
                </ul>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-[11px] tracking-[0.18em] uppercase text-goldsoft">
                  Best time · {selectedSacred.bestTime}
                </span>
              </motion.div>
            ) : selectedSpot ? (
              <motion.div key={`c-${selectedSpot.id}`}
                initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}>
                <div className="h-1 w-16 rounded-full bg-gradient-to-r from-saffron to-gold mb-5" />
                <p className="text-[11px] tracking-[0.3em] uppercase text-saffron mb-2">Celebration · {selectedSpot.name}</p>
                <h3 className="font-display text-3xl mb-3">{selectedSpot.events.join(" · ")}</h3>
                <p className="text-sm text-cream/65 leading-relaxed mb-4">{selectedSpot.note}</p>
                <p className="text-xs text-muted leading-relaxed mb-5 italic">
                  {getCelebrationDetail(selectedSpot.events[0]).how}
                </p>
                <a href="/calendar"
                  className="inline-block px-6 py-2.5 rounded-full bg-gold text-ink text-sm font-semibold hover:bg-goldsoft transition-colors">
                  See it on the calendar
                </a>
              </motion.div>
            ) : (
              <motion.div key="empty" className="h-full flex flex-col items-center justify-center text-center py-10"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="w-14 h-14 rounded-full border border-gold/30 flex items-center justify-center mb-4">
                  <span className="text-gold text-xl">✦</span>
                </div>
                <p className="font-display text-xl mb-2">Explore the region</p>
                <p className="text-sm text-muted leading-relaxed max-w-[240px]">
                  Tap a glowing marker to discover the sacred site or the living tradition behind our celebrations.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <p className="px-6 md:px-8 pb-6 text-[11px] text-muted/80">
        Stylised illustration — marker positions are approximate, not survey-accurate.
      </p>
    </div>
  );
}
