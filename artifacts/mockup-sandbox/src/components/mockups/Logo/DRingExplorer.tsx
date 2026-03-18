import React from "react";

const P    = "#C97A5B";
const PA   = "#B5623E";
const A    = "#E8A87C";
const S    = "#7BAE9E";
const SD   = "#5B9A8B";
const W    = "#FFFFFF";
const INK  = "#2C1208";
const BG   = "#FBF7F3";
const F    = "'Inter','Helvetica Neue',sans-serif";

type IC = { sz: number };

/* ──────────────────────────────────────────────
   Core D-ring + checkmark shape renderer
   id      — unique string prefix for gradient IDs
   bg1/bg2 — background gradient stops
   dClr    — D-ring stroke colour (or "grad" for gradient)
   ck1/ck2 — checkmark gradient colours
   dots    — show two dots at bottom
   dotClr  — dot fill colour
   shine   — show top-left radial highlight
   ────────────────────────────────────────────── */
interface DRingProps {
  sz: number;
  id: string;
  bg1: string; bg2: string;
  dClr: string;
  ck1: string; ck2: string;
  dots?: boolean;
  dotClr?: string;
  shine?: boolean;
  dOpacity?: number;
}

function DRingIcon({ sz, id, bg1, bg2, dClr, ck1, ck2, dots = false, dotClr = W, shine = true, dOpacity = 1 }: DRingProps) {
  const r = sz * 0.22;
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        {/* Background */}
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={bg1} /><stop offset="1" stopColor={bg2} />
        </linearGradient>
        {/* Shine */}
        <radialGradient id={`${id}-sh`} cx="28%" cy="18%" r="60%">
          <stop stopColor="rgba(255,255,255,.22)" />
          <stop offset="1" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        {/* D ring gradient (if used) */}
        <linearGradient id={`${id}-dg`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={ck1} /><stop offset="1" stopColor={ck2} />
        </linearGradient>
        {/* Checkmark */}
        <linearGradient id={`${id}-ck`} x1="0" y1="1" x2="1" y2="0">
          <stop stopColor={ck1} /><stop offset="1" stopColor={ck2} />
        </linearGradient>
        {/* Checkmark glow filter */}
        <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* D ring shadow */}
        <filter id={`${id}-dshadow`}>
          <feDropShadow dx="1" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.25)" />
        </filter>
      </defs>

      {/* Background */}
      <rect width="100" height="100" rx={r} fill={`url(#${id}-bg)`} />
      {shine && <rect width="100" height="100" rx={r} fill={`url(#${id}-sh)`} />}

      {/* ── D-ring ── */}
      <g filter={`url(#${id}-dshadow)`} opacity={dOpacity}>
        {/* Vertical bar */}
        <path d="M 28 17 L 28 78"
          stroke={dClr} strokeWidth="14" strokeLinecap="round" />
        {/* Curved belly */}
        <path d="M 28 17 C 62 17 78 28 78 48 C 78 68 62 78 28 78"
          stroke={dClr} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

      {/* ── Checkmark (overlaps D) ── */}
      <polyline
        points="17,52 40,73 83,20"
        stroke={`url(#${id}-ck)`}
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${id}-glow)`}
      />

      {/* ── Optional dots ── */}
      {dots && (
        <g>
          <circle cx="37" cy="91" r="4.5" fill={dotClr} opacity=".80" />
          <circle cx="53" cy="91" r="4.5" fill={dotClr} opacity=".80" />
        </g>
      )}
    </svg>
  );
}

/* ──────────────────────────────────────────────
   8 VARIANTS
   ────────────────────────────────────────────── */

const VARIANTS = [
  {
    label: "DR1",
    name: "Dark + warm check",
    desc: "Ink bg · white D-ring · terracotta→amber ✓",
    props: { id: "dr1", bg1: "#2A160A", bg2: INK, dClr: W, ck1: PA, ck2: A, dots: true, dotClr: A },
  },
  {
    label: "DR2",
    name: "Terracotta + sage check",
    desc: "Warm gradient bg · white D · sage→amber ✓",
    props: { id: "dr2", bg1: P, bg2: A, dClr: W, ck1: SD, ck2: A, dots: false },
  },
  {
    label: "DR3",
    name: "Sage bg + terracotta check",
    desc: "Sage bg · white D-ring · P→A gradient ✓",
    props: { id: "dr3", bg1: SD, bg2: S, dClr: W, ck1: P, ck2: A, dots: true, dotClr: W },
  },
  {
    label: "DR4",
    name: "Deep terracotta + sage check",
    desc: "Deep P bg · white D · sage glowing ✓",
    props: { id: "dr4", bg1: PA, bg2: P, dClr: W, ck1: S, ck2: "#C2E8DF", dots: false },
  },
  {
    label: "DR5",
    name: "Light warm + terracotta D",
    desc: "Cream bg · terracotta D-ring · sage→amber ✓ · dots",
    props: { id: "dr5", bg1: "#EDE5DC", bg2: "#F5EDE5", dClr: P, ck1: SD, ck2: A, dots: true, dotClr: A, shine: false },
  },
  {
    label: "DR6",
    name: "Amber reversed",
    desc: "Amber→terracotta bg · white D · dark ✓",
    props: { id: "dr6", bg1: A, bg2: PA, dClr: W, ck1: INK, ck2: "#5B3012", dots: false },
  },
  {
    label: "DR7",
    name: "Dark + sage check + dots",
    desc: "Darkest bg · white D · sage ✓ · sage dots",
    props: { id: "dr7", bg1: "#180E06", bg2: "#2A140A", dClr: W, ck1: SD, ck2: "#C2E8DF", dots: true, dotClr: S },
  },
  {
    label: "DR8",
    name: "Light + terracotta D + amber check",
    desc: "Cream bg · terracotta D · amber→P ✓ · no dots",
    props: { id: "dr8", bg1: "#FAF3EC", bg2: "#EDE5DC", dClr: P, ck1: A, ck2: P, dots: false, shine: false },
  },
];

/* ──────────────────────────────────────────────
   Card + layout
   ────────────────────────────────────────────── */
function IconCard({ label, name, desc, props }: typeof VARIANTS[0]) {
  const Comp = ({ sz }: IC) => <DRingIcon sz={sz} {...props} />;
  return (
    <div style={{
      position: "relative",
      background: W,
      borderRadius: 20,
      padding: "26px 18px 16px",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
      minWidth: 152,
      boxShadow: "0 4px 24px rgba(201,122,91,.11), 0 1px 3px rgba(0,0,0,.04)",
      border: "1.5px solid rgba(201,122,91,.09)",
    }}>
      <div style={{
        position: "absolute", top: -10, left: -10,
        background: P, color: W, fontSize: 11, fontWeight: 700, fontFamily: F,
        padding: "3px 9px", borderRadius: 20,
      }}>{label}</div>

      {/* Large preview */}
      <Comp sz={112} />

      {/* Scale tests */}
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
        <Comp sz={54} /><Comp sz={38} /><Comp sz={24} />
      </div>

      {/* Label */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <span style={{ fontSize: 12, fontWeight: 700, fontFamily: F, color: INK }}>{name}</span>
        <span style={{ fontSize: 10, fontFamily: F, color: S, textAlign: "center" as const }}>{desc}</span>
      </div>
    </div>
  );
}

export default function DRingExplorer() {
  return (
    <div style={{
      minHeight: "100vh", background: BG,
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 36, padding: "44px 20px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <span style={{
          fontSize: 11, fontFamily: F, fontWeight: 700, color: P,
          letterSpacing: 2.5, textTransform: "uppercase" as const,
        }}>
          D-Ring + Checkmark — Brand Exploration
        </span>
        <span style={{ fontSize: 12, fontFamily: F, color: "#9B7060" }}>
          Reference style · Do.Yoomi palette · 8 variants
        </span>
      </div>

      {/* Grid */}
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "center" }}>
        {VARIANTS.map(v => <IconCard key={v.label} {...v} />)}
      </div>

      {/* Dark strip */}
      <div style={{
        background: "#1C130C", borderRadius: 16,
        padding: "18px 26px",
        display: "flex", gap: 14, flexWrap: "wrap",
        justifyContent: "center", alignItems: "center",
      }}>
        <span style={{ fontSize: 10, color: S, fontFamily: F, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" as const }}>
          Dark bg
        </span>
        {VARIANTS.map(v => (
          <div key={v.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <DRingIcon sz={44} {...v.props} />
            <span style={{ fontSize: 9, fontFamily: F, color: "rgba(255,255,255,.35)", fontWeight: 600 }}>{v.label}</span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12, fontFamily: F, color: "#9B7060", textAlign: "center" }}>
        Pick a number — DR1 to DR8 — to finalize and apply to the app.
      </p>
    </div>
  );
}
