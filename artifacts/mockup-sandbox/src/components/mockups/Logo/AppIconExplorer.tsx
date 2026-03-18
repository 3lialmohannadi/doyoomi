import React from "react";

const P    = "#C97A5B";
const PA   = "#B5623E";
const A    = "#E8A87C";
const S    = "#7BAE9E";
const SD   = "#5B9A8B";
const SL   = "#9ECCC0";
const W    = "#FFFFFF";
const INK  = "#2C1208";
const BG   = "#FBF7F3";
const DARK = "#1C130C";
const F    = "'Inter','Helvetica Neue',sans-serif";

/* ─── Helpers ─── */
type IC = { sz: number };

function arc(cx: number, cy: number, r: number, pct: number, offset = 0.25) {
  const c = 2 * Math.PI * r;
  return { dasharray: `${c * pct} ${c * (1 - pct)}`, dashoffset: c * offset };
}

function Card({ label, children, name, desc }:
  { label: string; children: React.ReactNode; name: string; desc: string }) {
  return (
    <div style={{
      position: "relative", background: W, borderRadius: 20,
      padding: "26px 18px 16px", display: "flex", flexDirection: "column",
      alignItems: "center", gap: 10, minWidth: 148,
      boxShadow: "0 4px 20px rgba(201,122,91,.10), 0 1px 3px rgba(0,0,0,.04)",
      border: "1.5px solid rgba(201,122,91,.09)",
    }}>
      <div style={{ position: "absolute", top: -10, left: -10, background: P, color: W, fontSize: 11, fontWeight: 700, fontFamily: F, padding: "3px 9px", borderRadius: 20 }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        {children}
        <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
          {/* sizes rendered by parent */}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <span style={{ fontSize: 12, fontWeight: 700, fontFamily: F, color: INK }}>{name}</span>
        <span style={{ fontSize: 10, fontFamily: F, color: S, textAlign: "center" }}>{desc}</span>
      </div>
    </div>
  );
}

function MultiSize({ Comp }: { Comp: (p: IC) => JSX.Element }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <Comp sz={110} />
      <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
        <Comp sz={52} /><Comp sz={36} /><Comp sz={24} />
      </div>
    </div>
  );
}

function IconCard({ label, Comp, name, desc }:
  { label: string; Comp: (p: IC) => JSX.Element; name: string; desc: string }) {
  return (
    <div style={{
      position: "relative", background: W, borderRadius: 20,
      padding: "26px 18px 16px", display: "flex", flexDirection: "column",
      alignItems: "center", gap: 10, minWidth: 148,
      boxShadow: "0 4px 20px rgba(201,122,91,.10), 0 1px 3px rgba(0,0,0,.04)",
      border: "1.5px solid rgba(201,122,91,.09)",
    }}>
      <div style={{ position: "absolute", top: -10, left: -10, background: P, color: W, fontSize: 11, fontWeight: 700, fontFamily: F, padding: "3px 9px", borderRadius: 20 }}>{label}</div>
      <MultiSize Comp={Comp} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <span style={{ fontSize: 12, fontWeight: 700, fontFamily: F, color: INK }}>{name}</span>
        <span style={{ fontSize: 10, fontFamily: F, color: S, textAlign: "center" as const }}>{desc}</span>
      </div>
    </div>
  );
}

function Section({ title, color = "#9B7060", children }: { title: string; color?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", justifyContent: "center" }}>
        <div style={{ flex: 1, height: 1, background: "rgba(201,122,91,.14)", maxWidth: 120 }} />
        <span style={{ fontSize: 11, fontFamily: F, fontWeight: 700, color, letterSpacing: 2, textTransform: "uppercase" as const, whiteSpace: "nowrap" }}>{title}</span>
        <div style={{ flex: 1, height: 1, background: "rgba(201,122,91,.14)", maxWidth: 120 }} />
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>{children}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   R1 — Ring + D letterform in centre
   ══════════════════════════════════════════════ */

/* R1a · Thicker ring, sage D, warm bg */
function R1a({ sz }: IC) {
  const r = sz * 0.23; const { dasharray, dashoffset } = arc(50, 50, 30, 0.76);
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="r1a-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#EDE5DC" /><stop offset="1" stopColor="#F5EDE5" /></linearGradient>
        <linearGradient id="r1a-r" x1="0" y1="0" x2="1" y2="1"><stop stopColor={P} /><stop offset="1" stopColor={A} /></linearGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#r1a-bg)" />
      <circle cx="50" cy="50" r="30" stroke="rgba(201,122,91,.15)" strokeWidth="11" fill="none" />
      <circle cx="50" cy="50" r="30" stroke="url(#r1a-r)" strokeWidth="11" fill="none"
        strokeDasharray={dasharray} strokeDashoffset={dashoffset} strokeLinecap="round" transform="rotate(-90 50 50)" />
      <path d="M 38 34 L 38 66 M 38 34 L 53 34 C 68 34 68 66 53 66 L 38 66"
        stroke={SD} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* R1b · Gradient D matches ring colour, dot accent */
function R1b({ sz }: IC) {
  const r = sz * 0.23; const { dasharray, dashoffset } = arc(50, 50, 30, 0.76);
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="r1b-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#EDE5DC" /><stop offset="1" stopColor="#F5EDE5" /></linearGradient>
        <linearGradient id="r1b-r" x1="0" y1="0" x2="1" y2="1"><stop stopColor={P} /><stop offset="1" stopColor={A} /></linearGradient>
        <linearGradient id="r1b-d" x1="0" y1="0" x2="1" y2="1"><stop stopColor={P} /><stop offset="1" stopColor={A} /></linearGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#r1b-bg)" />
      <circle cx="50" cy="50" r="30" stroke="rgba(201,122,91,.15)" strokeWidth="9" fill="none" />
      <circle cx="50" cy="50" r="30" stroke="url(#r1b-r)" strokeWidth="9" fill="none"
        strokeDasharray={dasharray} strokeDashoffset={dashoffset} strokeLinecap="round" transform="rotate(-90 50 50)" />
      <path d="M 37 33 L 37 67 M 37 33 L 54 33 C 70 33 70 67 54 67 L 37 67"
        stroke="url(#r1b-d)" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="68" cy="67" r="5" fill={A} />
    </svg>
  );
}

/* R1c · D large + bolder, fills ring interior more, amber period */
function R1c({ sz }: IC) {
  const r = sz * 0.23; const { dasharray, dashoffset } = arc(50, 50, 32, 0.76);
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="r1c-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#F0E6D8" /><stop offset="1" stopColor="#FAF3EC" /></linearGradient>
        <linearGradient id="r1c-r" x1="0" y1="0" x2="1" y2="1"><stop stopColor={PA} /><stop offset="1" stopColor={P} /></linearGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#r1c-bg)" />
      <circle cx="50" cy="50" r="32" stroke="rgba(201,122,91,.12)" strokeWidth="7" fill="none" />
      <circle cx="50" cy="50" r="32" stroke="url(#r1c-r)" strokeWidth="7" fill="none"
        strokeDasharray={dasharray} strokeDashoffset={dashoffset} strokeLinecap="round" transform="rotate(-90 50 50)" />
      <path d="M 33 24 L 33 76 M 33 24 L 56 24 C 76 24 76 76 56 76 L 33 76"
        stroke={P} strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="76" cy="76" r="6.5" fill={A} />
    </svg>
  );
}

/* ══════════════════════════════════════════════
   R2 — Ring + D left + ✓ right
   ══════════════════════════════════════════════ */

/* R2a · D bold terracotta, ✓ sage solid disc */
function R2a({ sz }: IC) {
  const r = sz * 0.23; const { dasharray, dashoffset } = arc(50, 50, 30, 0.76);
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="r2a-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#EDE5DC" /><stop offset="1" stopColor="#F5EDE5" /></linearGradient>
        <linearGradient id="r2a-r" x1="0" y1="0" x2="1" y2="1"><stop stopColor={P} /><stop offset="1" stopColor={A} /></linearGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#r2a-bg)" />
      <circle cx="50" cy="50" r="30" stroke="rgba(201,122,91,.15)" strokeWidth="9" fill="none" />
      <circle cx="50" cy="50" r="30" stroke="url(#r2a-r)" strokeWidth="9" fill="none"
        strokeDasharray={dasharray} strokeDashoffset={dashoffset} strokeLinecap="round" transform="rotate(-90 50 50)" />
      <path d="M 28 36 L 28 64 M 28 36 L 42 36 C 56 36 56 64 42 64 L 28 64"
        stroke={P} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="64" cy="50" r="12" fill={S} />
      <polyline points="59,50 63,56 71,43" stroke={W} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* R2b · D sage, ✓ terracotta — colours swapped */
function R2b({ sz }: IC) {
  const r = sz * 0.23; const { dasharray, dashoffset } = arc(50, 50, 30, 0.76);
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="r2b-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#EDE5DC" /><stop offset="1" stopColor="#F5EDE5" /></linearGradient>
        <linearGradient id="r2b-r" x1="0" y1="0" x2="1" y2="1"><stop stopColor={P} /><stop offset="1" stopColor={A} /></linearGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#r2b-bg)" />
      <circle cx="50" cy="50" r="30" stroke="rgba(201,122,91,.15)" strokeWidth="9" fill="none" />
      <circle cx="50" cy="50" r="30" stroke="url(#r2b-r)" strokeWidth="9" fill="none"
        strokeDasharray={dasharray} strokeDashoffset={dashoffset} strokeLinecap="round" transform="rotate(-90 50 50)" />
      <path d="M 28 36 L 28 64 M 28 36 L 42 36 C 56 36 56 64 42 64 L 28 64"
        stroke={SD} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="64" cy="50" r="12" fill={P} />
      <polyline points="59,50 63,56 71,43" stroke={W} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* R2c · D + ✓ stacked vertically inside ring */
function R2c({ sz }: IC) {
  const r = sz * 0.23; const { dasharray, dashoffset } = arc(50, 50, 30, 0.76);
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="r2c-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#EDE5DC" /><stop offset="1" stopColor="#F5EDE5" /></linearGradient>
        <linearGradient id="r2c-r" x1="0" y1="0" x2="1" y2="1"><stop stopColor={P} /><stop offset="1" stopColor={A} /></linearGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#r2c-bg)" />
      <circle cx="50" cy="50" r="30" stroke="rgba(201,122,91,.15)" strokeWidth="9" fill="none" />
      <circle cx="50" cy="50" r="30" stroke="url(#r2c-r)" strokeWidth="9" fill="none"
        strokeDasharray={dasharray} strokeDashoffset={dashoffset} strokeLinecap="round" transform="rotate(-90 50 50)" />
      {/* D top */}
      <path d="M 38 30 L 38 48 M 38 30 L 50 30 C 62 30 62 48 50 48 L 38 48"
        stroke={P} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* divider */}
      <line x1="40" y1="51" x2="60" y2="51" stroke="rgba(201,122,91,.25)" strokeWidth="1.5" strokeLinecap="round" />
      {/* ✓ bottom */}
      <polyline points="40,60 47,68 62,54" stroke={S} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ══════════════════════════════════════════════
   R4 — Full ring on gradient bg, white D
   ══════════════════════════════════════════════ */

/* R4a · Thinner ring, bolder D, amber→terracotta direction */
function R4a({ sz }: IC) {
  const r = sz * 0.23;
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="r4a-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor={A} /><stop offset="1" stopColor={P} /></linearGradient>
        <radialGradient id="r4a-sh" cx="28%" cy="22%" r="55%"><stop stopColor="rgba(255,255,255,.22)" /><stop offset="1" stopColor="rgba(255,255,255,0)" /></radialGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#r4a-bg)" />
      <rect width="100" height="100" rx={r} fill="url(#r4a-sh)" />
      <circle cx="50" cy="50" r="32" stroke="rgba(255,255,255,.26)" strokeWidth="6" fill="none" />
      <path d="M 34 26 L 34 74 M 34 26 L 56 26 C 76 26 76 74 56 74 L 34 74"
        stroke={W} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* R4b · Double ring (outer gap, inner full) + D */
function R4b({ sz }: IC) {
  const r = sz * 0.23;
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="r4b-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor={P} /><stop offset="1" stopColor={A} /></linearGradient>
        <radialGradient id="r4b-sh" cx="28%" cy="22%" r="55%"><stop stopColor="rgba(255,255,255,.18)" /><stop offset="1" stopColor="rgba(255,255,255,0)" /></radialGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#r4b-bg)" />
      <rect width="100" height="100" rx={r} fill="url(#r4b-sh)" />
      {/* outer ring */}
      <circle cx="50" cy="50" r="38" stroke="rgba(255,255,255,.18)" strokeWidth="3" fill="none" />
      {/* inner ring */}
      <circle cx="50" cy="50" r="28" stroke="rgba(255,255,255,.30)" strokeWidth="5" fill="none" />
      <path d="M 36 30 L 36 70 M 36 30 L 54 30 C 70 30 70 70 54 70 L 36 70"
        stroke={W} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* R4c · Ring with top gap + D inside + sage accent dot */
function R4c({ sz }: IC) {
  const r = sz * 0.23; const { dasharray, dashoffset } = arc(50, 50, 31, 0.88, 0.0);
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="r4c-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor={PA} /><stop offset="1" stopColor={A} /></linearGradient>
        <radialGradient id="r4c-sh" cx="28%" cy="22%" r="55%"><stop stopColor="rgba(255,255,255,.18)" /><stop offset="1" stopColor="rgba(255,255,255,0)" /></radialGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#r4c-bg)" />
      <rect width="100" height="100" rx={r} fill="url(#r4c-sh)" />
      <circle cx="50" cy="50" r="31" stroke="rgba(255,255,255,.28)" strokeWidth="7" fill="none"
        strokeDasharray={dasharray} strokeDashoffset={dashoffset} strokeLinecap="round"
        transform="rotate(-90 50 50)" />
      <path d="M 35 28 L 35 72 M 35 28 L 55 28 C 73 28 73 72 55 72 L 35 72"
        stroke={W} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="50" cy="18" r="4.5" fill={S} />
    </svg>
  );
}

/* ══════════════════════════════════════════════
   R9 — Dashed track + solid arc + D
   ══════════════════════════════════════════════ */

/* R9a · Dots on dashed track, D larger + sage dot period */
function R9a({ sz }: IC) {
  const r = sz * 0.23; const { dasharray, dashoffset } = arc(50, 50, 30, 0.76);
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="r9a-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#EDE5DC" /><stop offset="1" stopColor="#F5EDE5" /></linearGradient>
        <linearGradient id="r9a-r" x1="0" y1="0" x2="1" y2="1"><stop stopColor={P} /><stop offset="1" stopColor={A} /></linearGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#r9a-bg)" />
      <circle cx="50" cy="50" r="30" stroke="rgba(201,122,91,.20)" strokeWidth="5" strokeDasharray="3 7" fill="none" />
      <circle cx="50" cy="50" r="30" stroke="url(#r9a-r)" strokeWidth="8" fill="none"
        strokeDasharray={dasharray} strokeDashoffset={dashoffset} strokeLinecap="round" transform="rotate(-90 50 50)" />
      <path d="M 34 26 L 34 74 M 34 26 L 55 26 C 73 26 73 74 55 74 L 34 74"
        stroke={P} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="74" cy="74" r="5.5" fill={S} />
    </svg>
  );
}

/* R9b · Sage solid arc (not terracotta), D ink */
function R9b({ sz }: IC) {
  const r = sz * 0.23; const { dasharray, dashoffset } = arc(50, 50, 30, 0.76);
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="r9b-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#EDE5DC" /><stop offset="1" stopColor="#F5EDE5" /></linearGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#r9b-bg)" />
      <circle cx="50" cy="50" r="30" stroke="rgba(123,174,158,.20)" strokeWidth="5" strokeDasharray="3 7" fill="none" />
      <circle cx="50" cy="50" r="30" stroke={S} strokeWidth="8" fill="none"
        strokeDasharray={dasharray} strokeDashoffset={dashoffset} strokeLinecap="round" transform="rotate(-90 50 50)" />
      <path d="M 37 34 L 37 66 M 37 34 L 51 34 C 65 34 65 66 51 66 L 37 66"
        stroke={P} strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* R9c · Both rings terracotta, D ink, amber dot period */
function R9c({ sz }: IC) {
  const r = sz * 0.23; const { dasharray, dashoffset } = arc(50, 50, 31, 0.76);
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="r9c-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#EDE5DC" /><stop offset="1" stopColor="#F5EDE5" /></linearGradient>
        <linearGradient id="r9c-r" x1="0" y1="0" x2="1" y2="1"><stop stopColor={P} /><stop offset="1" stopColor={A} /></linearGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#r9c-bg)" />
      <circle cx="50" cy="50" r="31" stroke="rgba(201,122,91,.18)" strokeWidth="4" strokeDasharray="5 5" fill="none" />
      <circle cx="50" cy="50" r="31" stroke="url(#r9c-r)" strokeWidth="9" fill="none"
        strokeDasharray={dasharray} strokeDashoffset={dashoffset} strokeLinecap="round" transform="rotate(-90 50 50)" />
      <path d="M 35 28 L 35 72 M 35 28 L 54 28 C 72 28 72 72 54 72 L 35 72"
        stroke={INK} strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="72" cy="72" r="6" fill={A} />
    </svg>
  );
}

/* ══════════════════════════════════════════════
   R10 — Sage bg + white ring + D + ✓
   ══════════════════════════════════════════════ */

/* R10a · D bolder + ✓ larger, ring thicker */
function R10a({ sz }: IC) {
  const r = sz * 0.23; const { dasharray, dashoffset } = arc(50, 50, 30, 0.76);
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="r10a-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor={SD} /><stop offset="1" stopColor={S} /></linearGradient>
        <radialGradient id="r10a-sh" cx="28%" cy="22%" r="55%"><stop stopColor="rgba(255,255,255,.18)" /><stop offset="1" stopColor="rgba(255,255,255,0)" /></radialGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#r10a-bg)" />
      <rect width="100" height="100" rx={r} fill="url(#r10a-sh)" />
      <circle cx="50" cy="50" r="30" stroke="rgba(255,255,255,.22)" strokeWidth="11" fill="none" />
      <circle cx="50" cy="50" r="30" stroke={W} strokeWidth="11" fill="none"
        strokeDasharray={dasharray} strokeDashoffset={dashoffset} strokeLinecap="round" transform="rotate(-90 50 50)" />
      <path d="M 31 30 L 31 60 M 31 30 L 47 30 C 60 30 60 60 47 60 L 31 60"
        stroke={W} strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <polyline points="43,66 49,74 62,58" stroke={W} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* R10b · Lighter sage, terracotta ring arc, white D */
function R10b({ sz }: IC) {
  const r = sz * 0.23; const { dasharray, dashoffset } = arc(50, 50, 30, 0.76);
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="r10b-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor={SL} /><stop offset="1" stopColor="#B8DDD7" /></linearGradient>
        <radialGradient id="r10b-sh" cx="28%" cy="22%" r="55%"><stop stopColor="rgba(255,255,255,.22)" /><stop offset="1" stopColor="rgba(255,255,255,0)" /></radialGradient>
        <linearGradient id="r10b-r" x1="0" y1="0" x2="1" y2="1"><stop stopColor={P} /><stop offset="1" stopColor={A} /></linearGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#r10b-bg)" />
      <rect width="100" height="100" rx={r} fill="url(#r10b-sh)" />
      <circle cx="50" cy="50" r="30" stroke="rgba(255,255,255,.30)" strokeWidth="9" fill="none" />
      <circle cx="50" cy="50" r="30" stroke="url(#r10b-r)" strokeWidth="9" fill="none"
        strokeDasharray={dasharray} strokeDashoffset={dashoffset} strokeLinecap="round" transform="rotate(-90 50 50)" />
      <path d="M 36 32 L 36 68 M 36 32 L 53 32 C 68 32 68 68 53 68 L 36 68"
        stroke={W} strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* R10c · D fills interior, ✓ as floating badge outside ring */
function R10c({ sz }: IC) {
  const r = sz * 0.23; const { dasharray, dashoffset } = arc(50, 50, 30, 0.76);
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="r10c-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor={SD} /><stop offset="1" stopColor={S} /></linearGradient>
        <radialGradient id="r10c-sh" cx="28%" cy="22%" r="55%"><stop stopColor="rgba(255,255,255,.18)" /><stop offset="1" stopColor="rgba(255,255,255,0)" /></radialGradient>
        <filter id="r10c-f"><feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={PA} floodOpacity=".35" /></filter>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#r10c-bg)" />
      <rect width="100" height="100" rx={r} fill="url(#r10c-sh)" />
      <circle cx="50" cy="50" r="30" stroke="rgba(255,255,255,.22)" strokeWidth="8" fill="none" />
      <circle cx="50" cy="50" r="30" stroke={W} strokeWidth="8" fill="none"
        strokeDasharray={dasharray} strokeDashoffset={dashoffset} strokeLinecap="round" transform="rotate(-90 50 50)" />
      <path d="M 31 26 L 31 74 M 31 26 L 56 26 C 76 26 76 74 56 74 L 31 74"
        stroke={W} strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* floating ✓ badge outside ring */}
      <circle cx="78" cy="22" r="12" fill={P} filter="url(#r10c-f)" />
      <polyline points="73,22 77,27 84,16" stroke={W} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Dark strip ─── */
const ALL = [
  { label: "R1a", Comp: R1a }, { label: "R1b", Comp: R1b }, { label: "R1c", Comp: R1c },
  { label: "R2a", Comp: R2a }, { label: "R2b", Comp: R2b }, { label: "R2c", Comp: R2c },
  { label: "R4a", Comp: R4a }, { label: "R4b", Comp: R4b }, { label: "R4c", Comp: R4c },
  { label: "R9a", Comp: R9a }, { label: "R9b", Comp: R9b }, { label: "R9c", Comp: R9c },
  { label: "R10a", Comp: R10a }, { label: "R10b", Comp: R10b }, { label: "R10c", Comp: R10c },
];

function DarkStrip() {
  return (
    <div style={{ background: DARK, borderRadius: 16, padding: "16px 22px", display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
      <span style={{ fontSize: 10, color: S, fontFamily: F, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" as const }}>Dark bg</span>
      {ALL.map(({ label, Comp }) => (
        <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <Comp sz={40} />
          <span style={{ fontSize: 8, fontFamily: F, color: "rgba(255,255,255,.35)", fontWeight: 600 }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Page ─── */
export default function AppIconExplorer() {
  return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", flexDirection: "column", alignItems: "center", gap: 32, padding: "44px 20px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}`}</style>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 11, fontFamily: F, fontWeight: 700, color: P, letterSpacing: 2.5, textTransform: "uppercase" as const }}>App Icon — Deep Exploration</span>
        <span style={{ fontSize: 12, fontFamily: F, color: "#9B7060" }}>R1 · R2 · R4 · R9 · R10 — 3 variants each</span>
      </div>

      <Section title="R1 — Ring + D letterform">
        <IconCard label="R1a" Comp={R1a} name="Sage D + thick ring" desc="Sage D · thick terracotta arc" />
        <IconCard label="R1b" Comp={R1b} name="Gradient D + period" desc="Gradient D matches arc · amber dot" />
        <IconCard label="R1c" Comp={R1c} name="Large D fills ring" desc="D dominates · amber period accent" />
      </Section>

      <Section title="R2 — Ring + D + ✓ together">
        <IconCard label="R2a" Comp={R2a} name="D + solid sage disc" desc="D left · filled sage ✓ right" />
        <IconCard label="R2b" Comp={R2b} name="Colours swapped" desc="Sage D · terracotta ✓ disc" />
        <IconCard label="R2c" Comp={R2c} name="D / ✓ stacked" desc="D top · rule · ✓ bottom" />
      </Section>

      <Section title="R4 — Full ring on gradient bg">
        <IconCard label="R4a" Comp={R4a} name="Amber→terracotta" desc="Reversed gradient · thin ring" />
        <IconCard label="R4b" Comp={R4b} name="Double ring + D" desc="Outer + inner rings · bold D" />
        <IconCard label="R4c" Comp={R4c} name="Gap ring + sage dot" desc="Ring w/ top gap · sage accent" />
      </Section>

      <Section title="R9 — Dashed track + solid arc + D">
        <IconCard label="R9a" Comp={R9a} name="Large D + sage dot" desc="D bigger · sage period" />
        <IconCard label="R9b" Comp={R9b} name="Sage arc" desc="Sage solid arc · terracotta D" />
        <IconCard label="R9c" Comp={R9c} name="Ink D + amber dot" desc="Dark D · amber period · dashed" />
      </Section>

      <Section title="R10 — Sage bg + white ring + D + ✓">
        <IconCard label="R10a" Comp={R10a} name="Bold + thick ring" desc="D + ✓ stacked · thick white ring" />
        <IconCard label="R10b" Comp={R10b} name="Light sage + terracotta arc" desc="Softer sage · warm ring arc" />
        <IconCard label="R10c" Comp={R10c} name="D large + ✓ badge" desc="Big D · floating ✓ corner badge" />
      </Section>

      <DarkStrip />

      <p style={{ fontSize: 12, fontFamily: F, color: "#9B7060", textAlign: "center" }}>
        Pick your final icon — e.g. R1b, R4a — to apply to the app.
      </p>
    </div>
  );
}
