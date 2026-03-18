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

type IC = { sz: number };

function pct(r: number, p: number, off = 0.25) {
  const c = 2 * Math.PI * r;
  return { da: `${c * p} ${c * (1 - p)}`, do: c * off };
}

/* ══════════════════════════════════════════════
   R1b family — gradient D + amber dot + ring
   ══════════════════════════════════════════════ */

/* R1b · baseline (for reference row) */
function R1b({ sz }: IC) {
  const r = sz * 0.23; const { da, do: d } = pct(30, 0.76);
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="r1b-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#EDE5DC"/><stop offset="1" stopColor="#F5EDE5"/></linearGradient>
        <linearGradient id="r1b-r" x1="0" y1="0" x2="1" y2="1"><stop stopColor={P}/><stop offset="1" stopColor={A}/></linearGradient>
        <linearGradient id="r1b-d" x1="0" y1="0" x2="1" y2="1"><stop stopColor={P}/><stop offset="1" stopColor={A}/></linearGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#r1b-bg)"/>
      <circle cx="50" cy="50" r="30" stroke="rgba(201,122,91,.15)" strokeWidth="9" fill="none"/>
      <circle cx="50" cy="50" r="30" stroke="url(#r1b-r)" strokeWidth="9" fill="none"
        strokeDasharray={da} strokeDashoffset={d} strokeLinecap="round" transform="rotate(-90 50 50)"/>
      <path d="M 37 33 L 37 67 M 37 33 L 54 33 C 70 33 70 67 54 67 L 37 67"
        stroke="url(#r1b-d)" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="68" cy="67" r="5" fill={A}/>
    </svg>
  );
}

/* R1b-1 · thick ring, D sage→amber gradient, bold */
function R1b1({ sz }: IC) {
  const r = sz * 0.23; const { da, do: d } = pct(30, 0.76);
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="x1-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#EDE5DC"/><stop offset="1" stopColor="#F5EDE5"/></linearGradient>
        <linearGradient id="x1-r" x1="0" y1="0" x2="1" y2="1"><stop stopColor={P}/><stop offset="1" stopColor={A}/></linearGradient>
        <linearGradient id="x1-d" x1="0" y1="0" x2="0" y2="1"><stop stopColor={SD}/><stop offset="1" stopColor={A}/></linearGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#x1-bg)"/>
      <circle cx="50" cy="50" r="30" stroke="rgba(201,122,91,.12)" strokeWidth="12" fill="none"/>
      <circle cx="50" cy="50" r="30" stroke="url(#x1-r)" strokeWidth="12" fill="none"
        strokeDasharray={da} strokeDashoffset={d} strokeLinecap="round" transform="rotate(-90 50 50)"/>
      <path d="M 36 32 L 36 68 M 36 32 L 53 32 C 69 32 69 68 53 68 L 36 68"
        stroke="url(#x1-d)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="68" cy="68" r="5.5" fill={A}/>
    </svg>
  );
}

/* R1b-2 · D larger + ring thinner, amber dot bigger */
function R1b2({ sz }: IC) {
  const r = sz * 0.23; const { da, do: d } = pct(32, 0.76);
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="x2-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#EDE5DC"/><stop offset="1" stopColor="#F5EDE5"/></linearGradient>
        <linearGradient id="x2-r" x1="0" y1="0" x2="1" y2="1"><stop stopColor={P}/><stop offset="1" stopColor={A}/></linearGradient>
        <linearGradient id="x2-d" x1="0" y1="0" x2="1" y2="1"><stop stopColor={P}/><stop offset="1" stopColor={A}/></linearGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#x2-bg)"/>
      <circle cx="50" cy="50" r="32" stroke="rgba(201,122,91,.12)" strokeWidth="6" fill="none"/>
      <circle cx="50" cy="50" r="32" stroke="url(#x2-r)" strokeWidth="6" fill="none"
        strokeDasharray={da} strokeDashoffset={d} strokeLinecap="round" transform="rotate(-90 50 50)"/>
      <path d="M 33 24 L 33 76 M 33 24 L 56 24 C 76 24 76 76 56 76 L 33 76"
        stroke="url(#x2-d)" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="76" cy="76" r="7" fill={A}/>
    </svg>
  );
}

/* R1b-3 · dark warm bg, gradient D glows */
function R1b3({ sz }: IC) {
  const r = sz * 0.23; const { da, do: d } = pct(30, 0.76);
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="x3-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#2A160A"/><stop offset="1" stopColor={INK}/></linearGradient>
        <linearGradient id="x3-r" x1="0" y1="0" x2="1" y2="1"><stop stopColor={P}/><stop offset="1" stopColor={A}/></linearGradient>
        <linearGradient id="x3-d" x1="0" y1="0" x2="1" y2="1"><stop stopColor={A}/><stop offset="1" stopColor={P}/></linearGradient>
        <filter id="x3-glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#x3-bg)"/>
      <circle cx="50" cy="50" r="30" stroke="rgba(255,255,255,.08)" strokeWidth="9" fill="none"/>
      <circle cx="50" cy="50" r="30" stroke="url(#x3-r)" strokeWidth="9" fill="none"
        strokeDasharray={da} strokeDashoffset={d} strokeLinecap="round" transform="rotate(-90 50 50)"/>
      <path d="M 37 33 L 37 67 M 37 33 L 54 33 C 70 33 70 67 54 67 L 37 67"
        stroke="url(#x3-d)" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#x3-glow)"/>
      <circle cx="68" cy="67" r="5" fill={S}/>
    </svg>
  );
}

/* ══════════════════════════════════════════════
   R2a family — D + filled sage ✓ disc inside ring
   ══════════════════════════════════════════════ */

function R2a({ sz }: IC) {
  const r = sz * 0.23; const { da, do: d } = pct(30, 0.76);
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="r2a-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#EDE5DC"/><stop offset="1" stopColor="#F5EDE5"/></linearGradient>
        <linearGradient id="r2a-r" x1="0" y1="0" x2="1" y2="1"><stop stopColor={P}/><stop offset="1" stopColor={A}/></linearGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#r2a-bg)"/>
      <circle cx="50" cy="50" r="30" stroke="rgba(201,122,91,.15)" strokeWidth="9" fill="none"/>
      <circle cx="50" cy="50" r="30" stroke="url(#r2a-r)" strokeWidth="9" fill="none"
        strokeDasharray={da} strokeDashoffset={d} strokeLinecap="round" transform="rotate(-90 50 50)"/>
      <path d="M 28 36 L 28 64 M 28 36 L 42 36 C 56 36 56 64 42 64 L 28 64"
        stroke={P} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="64" cy="50" r="12" fill={S}/>
      <polyline points="59,50 63,56 71,43" stroke={W} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* R2a-1 · disc bigger, D bolder, perfect balance */
function R2a1({ sz }: IC) {
  const r = sz * 0.23; const { da, do: d } = pct(30, 0.76);
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="y1-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#EDE5DC"/><stop offset="1" stopColor="#F5EDE5"/></linearGradient>
        <linearGradient id="y1-r" x1="0" y1="0" x2="1" y2="1"><stop stopColor={P}/><stop offset="1" stopColor={A}/></linearGradient>
        <filter id="y1-sf"><feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={SD} floodOpacity=".30"/></filter>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#y1-bg)"/>
      <circle cx="50" cy="50" r="30" stroke="rgba(201,122,91,.12)" strokeWidth="10" fill="none"/>
      <circle cx="50" cy="50" r="30" stroke="url(#y1-r)" strokeWidth="10" fill="none"
        strokeDasharray={da} strokeDashoffset={d} strokeLinecap="round" transform="rotate(-90 50 50)"/>
      <path d="M 24 34 L 24 66 M 24 34 L 40 34 C 55 34 55 66 40 66 L 24 66"
        stroke={P} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="66" cy="50" r="15" fill={S} filter="url(#y1-sf)"/>
      <polyline points="60,50 65,57 74,42" stroke={W} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* R2a-2 · gradient ring matches gradient D, disc sage bigger */
function R2a2({ sz }: IC) {
  const r = sz * 0.23; const { da, do: d } = pct(30, 0.76);
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="y2-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#EDE5DC"/><stop offset="1" stopColor="#F5EDE5"/></linearGradient>
        <linearGradient id="y2-r" x1="0" y1="0" x2="1" y2="1"><stop stopColor={P}/><stop offset="1" stopColor={A}/></linearGradient>
        <linearGradient id="y2-d" x1="0" y1="0" x2="1" y2="1"><stop stopColor={P}/><stop offset="1" stopColor={A}/></linearGradient>
        <linearGradient id="y2-disc" x1="0" y1="0" x2="0" y2="1"><stop stopColor={SD}/><stop offset="1" stopColor={S}/></linearGradient>
        <filter id="y2-sf"><feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={SD} floodOpacity=".28"/></filter>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#y2-bg)"/>
      <circle cx="50" cy="50" r="30" stroke="rgba(201,122,91,.12)" strokeWidth="9" fill="none"/>
      <circle cx="50" cy="50" r="30" stroke="url(#y2-r)" strokeWidth="9" fill="none"
        strokeDasharray={da} strokeDashoffset={d} strokeLinecap="round" transform="rotate(-90 50 50)"/>
      <path d="M 26 35 L 26 65 M 26 35 L 41 35 C 55 35 55 65 41 65 L 26 65"
        stroke="url(#y2-d)" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="65" cy="50" r="14" fill="url(#y2-disc)" filter="url(#y2-sf)"/>
      <polyline points="60,50 64,56 73,43" stroke={W} strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* R2a-3 · disc floats as corner badge outside ring */
function R2a3({ sz }: IC) {
  const r = sz * 0.23; const { da, do: d } = pct(30, 0.76);
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="y3-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#EDE5DC"/><stop offset="1" stopColor="#F5EDE5"/></linearGradient>
        <linearGradient id="y3-r" x1="0" y1="0" x2="1" y2="1"><stop stopColor={P}/><stop offset="1" stopColor={A}/></linearGradient>
        <filter id="y3-sf"><feDropShadow dx="0" dy="2" stdDeviation="4" floodColor={SD} floodOpacity=".35"/></filter>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#y3-bg)"/>
      <circle cx="50" cy="50" r="30" stroke="rgba(201,122,91,.12)" strokeWidth="9" fill="none"/>
      <circle cx="50" cy="50" r="30" stroke="url(#y3-r)" strokeWidth="9" fill="none"
        strokeDasharray={da} strokeDashoffset={d} strokeLinecap="round" transform="rotate(-90 50 50)"/>
      <path d="M 32 32 L 32 68 M 32 32 L 50 32 C 66 32 66 68 50 68 L 32 68"
        stroke={P} strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* sage badge outside ring at top-right */}
      <circle cx="76" cy="24" r="14" fill={S} filter="url(#y3-sf)"/>
      <polyline points="70,24 75,30 83,18" stroke={W} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ══════════════════════════════════════════════
   R4b family — double ring + D on gradient bg
   ══════════════════════════════════════════════ */

function R4b({ sz }: IC) {
  const r = sz * 0.23;
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="r4b-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor={P}/><stop offset="1" stopColor={A}/></linearGradient>
        <radialGradient id="r4b-sh" cx="28%" cy="22%" r="55%"><stop stopColor="rgba(255,255,255,.18)"/><stop offset="1" stopColor="rgba(255,255,255,0)"/></radialGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#r4b-bg)"/>
      <rect width="100" height="100" rx={r} fill="url(#r4b-sh)"/>
      <circle cx="50" cy="50" r="38" stroke="rgba(255,255,255,.18)" strokeWidth="3" fill="none"/>
      <circle cx="50" cy="50" r="28" stroke="rgba(255,255,255,.30)" strokeWidth="5" fill="none"/>
      <path d="M 36 30 L 36 70 M 36 30 L 54 30 C 70 30 70 70 54 70 L 36 70"
        stroke={W} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

/* R4b-1 · triple rings, D bolder, sage dot */
function R4b1({ sz }: IC) {
  const r = sz * 0.23;
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="z1-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor={P}/><stop offset="1" stopColor={A}/></linearGradient>
        <radialGradient id="z1-sh" cx="28%" cy="22%" r="55%"><stop stopColor="rgba(255,255,255,.20)"/><stop offset="1" stopColor="rgba(255,255,255,0)"/></radialGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#z1-bg)"/>
      <rect width="100" height="100" rx={r} fill="url(#z1-sh)"/>
      <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,.10)" strokeWidth="2.5" fill="none"/>
      <circle cx="50" cy="50" r="34" stroke="rgba(255,255,255,.18)" strokeWidth="3" fill="none"/>
      <circle cx="50" cy="50" r="24" stroke="rgba(255,255,255,.30)" strokeWidth="4.5" fill="none"/>
      <path d="M 36 30 L 36 70 M 36 30 L 54 30 C 70 30 70 70 54 70 L 36 70"
        stroke={W} strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="70" cy="30" r="6" fill={S}/>
    </svg>
  );
}

/* R4b-2 · amber→terracotta reversed, outer thick, inner thin */
function R4b2({ sz }: IC) {
  const r = sz * 0.23;
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="z2-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor={A}/><stop offset="1" stopColor={PA}/></linearGradient>
        <radialGradient id="z2-sh" cx="28%" cy="22%" r="55%"><stop stopColor="rgba(255,255,255,.22)"/><stop offset="1" stopColor="rgba(255,255,255,0)"/></radialGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#z2-bg)"/>
      <rect width="100" height="100" rx={r} fill="url(#z2-sh)"/>
      <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,.22)" strokeWidth="6" fill="none"/>
      <circle cx="50" cy="50" r="26" stroke="rgba(255,255,255,.16)" strokeWidth="2" fill="none"/>
      <path d="M 36 28 L 36 72 M 36 28 L 55 28 C 73 28 73 72 55 72 L 36 72"
        stroke={W} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

/* R4b-3 · dark bg, double ring glow, white D */
function R4b3({ sz }: IC) {
  const r = sz * 0.23;
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="z3-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#2A160A"/><stop offset="1" stopColor={INK}/></linearGradient>
        <linearGradient id="z3-r" x1="0" y1="0" x2="1" y2="1"><stop stopColor={P}/><stop offset="1" stopColor={A}/></linearGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#z3-bg)"/>
      <circle cx="50" cy="50" r="40" stroke="url(#z3-r)" strokeWidth="2.5" fill="none" opacity=".6"/>
      <circle cx="50" cy="50" r="28" stroke="url(#z3-r)" strokeWidth="5" fill="none"/>
      <path d="M 36 28 L 36 72 M 36 28 L 55 28 C 73 28 73 72 55 72 L 36 72"
        stroke={W} strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

/* ══════════════════════════════════════════════
   R4c family — gap ring + accent dot + D
   ══════════════════════════════════════════════ */

function R4c({ sz }: IC) {
  const r = sz * 0.23;
  const c = 2 * Math.PI * 31; const da = `${c * 0.88} ${c * 0.12}`;
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="r4c-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor={PA}/><stop offset="1" stopColor={A}/></linearGradient>
        <radialGradient id="r4c-sh" cx="28%" cy="22%" r="55%"><stop stopColor="rgba(255,255,255,.18)"/><stop offset="1" stopColor="rgba(255,255,255,0)"/></radialGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#r4c-bg)"/>
      <rect width="100" height="100" rx={r} fill="url(#r4c-sh)"/>
      <circle cx="50" cy="50" r="31" stroke="rgba(255,255,255,.28)" strokeWidth="7" fill="none"
        strokeDasharray={da} strokeDashoffset={0} strokeLinecap="round" transform="rotate(-90 50 50)"/>
      <path d="M 35 28 L 35 72 M 35 28 L 55 28 C 73 28 73 72 55 72 L 35 72"
        stroke={W} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="50" cy="18" r="4.5" fill={S}/>
    </svg>
  );
}

/* R4c-1 · two dots (top gap + bottom-right), more visual rhythm */
function R4c1({ sz }: IC) {
  const r = sz * 0.23;
  const c = 2 * Math.PI * 31; const da = `${c * 0.88} ${c * 0.12}`;
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="w1-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor={PA}/><stop offset="1" stopColor={A}/></linearGradient>
        <radialGradient id="w1-sh" cx="28%" cy="22%" r="55%"><stop stopColor="rgba(255,255,255,.18)"/><stop offset="1" stopColor="rgba(255,255,255,0)"/></radialGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#w1-bg)"/>
      <rect width="100" height="100" rx={r} fill="url(#w1-sh)"/>
      <circle cx="50" cy="50" r="31" stroke="rgba(255,255,255,.26)" strokeWidth="7" fill="none"
        strokeDasharray={da} strokeDashoffset="0" strokeLinecap="round" transform="rotate(-90 50 50)"/>
      <path d="M 33 26 L 33 74 M 33 26 L 54 26 C 73 26 73 74 54 74 L 33 74"
        stroke={W} strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="50" cy="18" r="5" fill={S}/>
      <circle cx="77" cy="72" r="4" fill={SL} opacity=".80"/>
    </svg>
  );
}

/* R4c-2 · gap at bottom-right, dot follows — fresh orientation */
function R4c2({ sz }: IC) {
  const r = sz * 0.23;
  const c = 2 * Math.PI * 31; const da = `${c * 0.87} ${c * 0.13}`;
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="w2-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor={PA}/><stop offset="1" stopColor={A}/></linearGradient>
        <radialGradient id="w2-sh" cx="28%" cy="22%" r="55%"><stop stopColor="rgba(255,255,255,.18)"/><stop offset="1" stopColor="rgba(255,255,255,0)"/></radialGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#w2-bg)"/>
      <rect width="100" height="100" rx={r} fill="url(#w2-sh)"/>
      {/* gap at ~135° = bottom-right */}
      <circle cx="50" cy="50" r="31" stroke="rgba(255,255,255,.28)" strokeWidth="7" fill="none"
        strokeDasharray={da} strokeDashoffset="0" strokeLinecap="round" transform="rotate(45 50 50)"/>
      <path d="M 33 26 L 33 74 M 33 26 L 54 26 C 73 26 73 74 54 74 L 33 74"
        stroke={W} strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="72" cy="72" r="5" fill={S}/>
    </svg>
  );
}

/* R4c-3 · terracotta dot instead of sage, double ring variant */
function R4c3({ sz }: IC) {
  const r = sz * 0.23;
  const c = 2 * Math.PI * 32; const da = `${c * 0.87} ${c * 0.13}`;
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="w3-bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor={P}/><stop offset="1" stopColor={A}/></linearGradient>
        <radialGradient id="w3-sh" cx="28%" cy="22%" r="55%"><stop stopColor="rgba(255,255,255,.20)"/><stop offset="1" stopColor="rgba(255,255,255,0)"/></radialGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#w3-bg)"/>
      <rect width="100" height="100" rx={r} fill="url(#w3-sh)"/>
      <circle cx="50" cy="50" r="38" stroke="rgba(255,255,255,.10)" strokeWidth="2" fill="none"/>
      <circle cx="50" cy="50" r="32" stroke="rgba(255,255,255,.26)" strokeWidth="7" fill="none"
        strokeDasharray={da} strokeDashoffset="0" strokeLinecap="round" transform="rotate(-90 50 50)"/>
      <path d="M 33 26 L 33 74 M 33 26 L 54 26 C 73 26 73 74 54 74 L 33 74"
        stroke={W} strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="50" cy="17" r="5.5" fill={INK} opacity=".35"/>
      <circle cx="50" cy="17" r="3.5" fill={W}/>
    </svg>
  );
}

/* ─── Shared UI ─── */
function MultiSize({ Comp }: { Comp: (p: IC) => JSX.Element }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <Comp sz={110}/>
      <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
        <Comp sz={52}/><Comp sz={36}/><Comp sz={22}/>
      </div>
    </div>
  );
}

function IconCard({ label, Comp, name, desc, isRef = false }:
  { label: string; Comp: (p: IC) => JSX.Element; name: string; desc: string; isRef?: boolean }) {
  return (
    <div style={{
      position: "relative", background: W, borderRadius: 20,
      padding: "26px 18px 16px",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 10, minWidth: 148,
      boxShadow: isRef
        ? `0 0 0 2.5px ${S}, 0 6px 24px rgba(123,174,158,.18)`
        : "0 4px 20px rgba(201,122,91,.09), 0 1px 3px rgba(0,0,0,.04)",
      border: isRef ? `1.5px solid ${S}` : "1.5px solid rgba(201,122,91,.09)",
      opacity: isRef ? 0.72 : 1,
    }}>
      {isRef && <div style={{ position: "absolute", top: -10, right: -10, background: S, color: W, fontSize: 9, fontWeight: 700, fontFamily: F, padding: "2px 7px", borderRadius: 10 }}>base</div>}
      <div style={{ position: "absolute", top: -10, left: -10, background: isRef ? S : P, color: W, fontSize: 11, fontWeight: 700, fontFamily: F, padding: "3px 9px", borderRadius: 20 }}>{label}</div>
      <MultiSize Comp={Comp}/>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <span style={{ fontSize: 12, fontWeight: 700, fontFamily: F, color: INK }}>{name}</span>
        <span style={{ fontSize: 10, fontFamily: F, color: S, textAlign: "center" as const }}>{desc}</span>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", justifyContent: "center" }}>
        <div style={{ flex: 1, height: 1, background: "rgba(201,122,91,.14)", maxWidth: 100 }}/>
        <span style={{ fontSize: 11, fontFamily: F, fontWeight: 700, color: "#9B7060", letterSpacing: 2, textTransform: "uppercase" as const, whiteSpace: "nowrap" as const }}>{title}</span>
        <div style={{ flex: 1, height: 1, background: "rgba(201,122,91,.14)", maxWidth: 100 }}/>
      </div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>{children}</div>
    </div>
  );
}

const DARK_ALL = [
  { l: "R1b", C: R1b }, { l: "R1b-1", C: R1b1 }, { l: "R1b-2", C: R1b2 }, { l: "R1b-3", C: R1b3 },
  { l: "R2a", C: R2a }, { l: "R2a-1", C: R2a1 }, { l: "R2a-2", C: R2a2 }, { l: "R2a-3", C: R2a3 },
  { l: "R4b", C: R4b }, { l: "R4b-1", C: R4b1 }, { l: "R4b-2", C: R4b2 }, { l: "R4b-3", C: R4b3 },
  { l: "R4c", C: R4c }, { l: "R4c-1", C: R4c1 }, { l: "R4c-2", C: R4c2 }, { l: "R4c-3", C: R4c3 },
];

export default function AppIconExplorer() {
  return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", flexDirection: "column", alignItems: "center", gap: 34, padding: "44px 18px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}`}</style>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 11, fontFamily: F, fontWeight: 700, color: P, letterSpacing: 2.5, textTransform: "uppercase" as const }}>App Icon — Final Exploration</span>
        <span style={{ fontSize: 12, fontFamily: F, color: "#9B7060" }}>R1b · R2a · R4b · R4c — 3 variants each</span>
      </div>

      <Section title="R1b — Gradient D + ring + amber dot">
        <IconCard label="R1b" Comp={R1b} name="Base" desc="Original" isRef/>
        <IconCard label="R1b-1" Comp={R1b1} name="Sage→amber D + thick" desc="Cool gradient D · heavy ring"/>
        <IconCard label="R1b-2" Comp={R1b2} name="Large D + thin ring" desc="D dominates · bigger dot"/>
        <IconCard label="R1b-3" Comp={R1b3} name="Dark version" desc="Glowing D on dark bg"/>
      </Section>

      <Section title="R2a — D + filled sage disc inside ring">
        <IconCard label="R2a" Comp={R2a} name="Base" desc="Original" isRef/>
        <IconCard label="R2a-1" Comp={R2a1} name="Bigger disc + bold D" desc="Larger ✓ disc · shadow"/>
        <IconCard label="R2a-2" Comp={R2a2} name="Gradient D + gradient disc" desc="Both elements gradient"/>
        <IconCard label="R2a-3" Comp={R2a3} name="Badge outside ring" desc="D centred · ✓ corner badge"/>
      </Section>

      <Section title="R4b — Double ring + D on gradient">
        <IconCard label="R4b" Comp={R4b} name="Base" desc="Original" isRef/>
        <IconCard label="R4b-1" Comp={R4b1} name="Triple rings + sage dot" desc="3 rings · sage accent"/>
        <IconCard label="R4b-2" Comp={R4b2} name="Amber reversed + thick outer" desc="Reversed gradient · bold outer"/>
        <IconCard label="R4b-3" Comp={R4b3} name="Dark + gradient rings" desc="Dark bg · glowing rings"/>
      </Section>

      <Section title="R4c — Gap ring + dot accent + D">
        <IconCard label="R4c" Comp={R4c} name="Base" desc="Original" isRef/>
        <IconCard label="R4c-1" Comp={R4c1} name="Two accent dots" desc="Top sage + bottom-right light"/>
        <IconCard label="R4c-2" Comp={R4c2} name="Gap at bottom-right" desc="Rotated orientation · sage dot"/>
        <IconCard label="R4c-3" Comp={R4c3} name="Double ring + white dot" desc="Extra outer ring · white dot"/>
      </Section>

      <div style={{ background: DARK, borderRadius: 16, padding: "16px 20px", display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
        <span style={{ fontSize: 10, color: S, fontFamily: F, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" as const }}>Dark</span>
        {DARK_ALL.map(({ l, C }) => (
          <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <C sz={38}/>
            <span style={{ fontSize: 8, fontFamily: F, color: "rgba(255,255,255,.30)", fontWeight: 600 }}>{l}</span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12, fontFamily: F, color: "#9B7060", textAlign: "center" }}>
        Pick your final — e.g. R2a-1, R4c-2 — to apply to the app.
      </p>
    </div>
  );
}
