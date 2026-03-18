import React from "react";

const P    = "#C97A5B";
const PA   = "#B5623E";
const A    = "#E8A87C";
const S    = "#7BAE9E";
const SD   = "#5B9A8B";
const W    = "#FFFFFF";
const INK  = "#2C1208";
const BG   = "#FBF7F3";
const DARK = "#1C130C";
const WARM = "#EDE5DC";
const F    = "'Inter','Helvetica Neue',sans-serif";

/* ──────────────────────────────────────────────
   BASE: Icon 4 (the chosen direction)
   ring progress + sage ✓ centre
   ────────────────────────────────────────────── */
function Base4({ sz }: { sz: number }) {
  const r = sz * 0.23;
  const cx = 50; const cy = 50; const rad = 30;
  const circ = 2 * Math.PI * rad;
  const dash = circ * 0.76;
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="b4bg" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#EDE5DC" /><stop offset="1" stopColor="#F5EDE5" />
        </linearGradient>
        <linearGradient id="b4ring" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={P} /><stop offset="1" stopColor={A} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#b4bg)" />
      <circle cx={cx} cy={cy} r={rad} stroke="rgba(201,122,91,.18)" strokeWidth="9" fill="none" />
      <circle cx={cx} cy={cy} r={rad}
        stroke="url(#b4ring)" strokeWidth="9" fill="none"
        strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={circ * 0.25}
        strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`} />
      <circle cx={cx} cy={cy} r="14" fill={S} opacity=".14" />
      <polyline points="42,50 48,57 60,42"
        stroke={S} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ──────────────────────────────────────────────
   10 EXPLORATIONS
   ────────────────────────────────────────────── */

/* R1 · D letter in centre instead of ✓ */
function R1({ sz }: { sz: number }) {
  const r = sz * 0.23; const rad = 30; const circ = 2 * Math.PI * rad;
  const dash = circ * 0.76;
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="r1bg" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#EDE5DC" /><stop offset="1" stopColor="#F5EDE5" />
        </linearGradient>
        <linearGradient id="r1r" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={P} /><stop offset="1" stopColor={A} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#r1bg)" />
      <circle cx="50" cy="50" r={rad} stroke="rgba(201,122,91,.18)" strokeWidth="9" fill="none" />
      <circle cx="50" cy="50" r={rad} stroke="url(#r1r)" strokeWidth="9" fill="none"
        strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={circ * 0.25}
        strokeLinecap="round" transform="rotate(-90 50 50)" />
      <path d="M 38 36 L 38 64 M 38 36 L 52 36 C 66 36 66 64 52 64 L 38 64"
        stroke={P} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* R2 · D + ✓ together in centre */
function R2({ sz }: { sz: number }) {
  const r = sz * 0.23; const rad = 30; const circ = 2 * Math.PI * rad;
  const dash = circ * 0.76;
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="r2bg" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#EDE5DC" /><stop offset="1" stopColor="#F5EDE5" />
        </linearGradient>
        <linearGradient id="r2r" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={P} /><stop offset="1" stopColor={A} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#r2bg)" />
      <circle cx="50" cy="50" r={rad} stroke="rgba(201,122,91,.18)" strokeWidth="9" fill="none" />
      <circle cx="50" cy="50" r={rad} stroke="url(#r2r)" strokeWidth="9" fill="none"
        strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={circ * 0.25}
        strokeLinecap="round" transform="rotate(-90 50 50)" />
      {/* small D left */}
      <path d="M 34 40 L 34 60 M 34 40 L 44 40 C 54 40 54 60 44 60 L 34 60"
        stroke={P} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* small ✓ right */}
      <polyline points="50,52 55,58 66,42"
        stroke={S} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* R3 · Dark bg, amber/white ring, white ✓ */
function R3({ sz }: { sz: number }) {
  const r = sz * 0.23; const rad = 30; const circ = 2 * Math.PI * rad;
  const dash = circ * 0.76;
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="r3bg" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#241408" /><stop offset="1" stopColor={INK} />
        </linearGradient>
        <linearGradient id="r3r" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={A} /><stop offset="1" stopColor={P} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#r3bg)" />
      <circle cx="50" cy="50" r={rad} stroke="rgba(255,255,255,.08)" strokeWidth="9" fill="none" />
      <circle cx="50" cy="50" r={rad} stroke="url(#r3r)" strokeWidth="9" fill="none"
        strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={circ * 0.25}
        strokeLinecap="round" transform="rotate(-90 50 50)" />
      <circle cx="50" cy="50" r="13" fill="rgba(255,255,255,.08)" />
      <polyline points="42,50 48,57 60,42"
        stroke={W} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* R4 · Full (100%) ring, gradient fill, D in white centre */
function R4({ sz }: { sz: number }) {
  const r = sz * 0.23;
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="r4bg" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={P} /><stop offset="1" stopColor={A} />
        </linearGradient>
        <radialGradient id="r4sh" cx="28%" cy="22%" r="55%">
          <stop stopColor="rgba(255,255,255,.20)" /><stop offset="1" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#r4bg)" />
      <rect width="100" height="100" rx={r} fill="url(#r4sh)" />
      <circle cx="50" cy="50" r="30" stroke="rgba(255,255,255,.22)" strokeWidth="9" fill="none" />
      <path d="M 36 34 L 36 66 M 36 34 L 53 34 C 70 34 70 66 53 66 L 36 66"
        stroke={W} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* R5 · Dots on track (5 habits) + ✓ centre */
function R5({ sz }: { sz: number }) {
  const r = sz * 0.23; const rad = 30; const circ = 2 * Math.PI * rad;
  const dash = circ * 0.76;
  const dots = [0, 1, 2, 3, 4].map(i => {
    const angle = (-90 + i * 72) * (Math.PI / 180);
    return { x: 50 + rad * Math.cos(angle), y: 50 + rad * Math.sin(angle), done: i < 4 };
  });
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="r5bg" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#EDE5DC" /><stop offset="1" stopColor="#F5EDE5" />
        </linearGradient>
        <linearGradient id="r5r" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={P} /><stop offset="1" stopColor={A} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#r5bg)" />
      <circle cx="50" cy="50" r={rad} stroke="rgba(201,122,91,.12)" strokeWidth="2" fill="none" />
      <circle cx="50" cy="50" r={rad} stroke="url(#r5r)" strokeWidth="2" fill="none"
        strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={circ * 0.25}
        strokeLinecap="round" transform="rotate(-90 50 50)" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="5.5"
          fill={d.done ? P : "rgba(201,122,91,.20)"} />
      ))}
      <circle cx="50" cy="50" r="14" fill={S} opacity=".14" />
      <polyline points="42,50 48,57 60,42"
        stroke={S} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* R6 · Three concentric rings (3 habits) + ✓ */
function R6({ sz }: { sz: number }) {
  const r = sz * 0.23;
  const rings = [
    { r: 36, w: 5, dash: 0.9, color: P },
    { r: 27, w: 5, dash: 0.7, color: S },
    { r: 18, w: 5, dash: 0.5, color: A },
  ];
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="r6bg" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#EDE5DC" /><stop offset="1" stopColor="#F5EDE5" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#r6bg)" />
      {rings.map((ring, i) => {
        const circ = 2 * Math.PI * ring.r;
        return (
          <g key={i}>
            <circle cx="50" cy="50" r={ring.r} stroke="rgba(0,0,0,.06)" strokeWidth={ring.w} fill="none" />
            <circle cx="50" cy="50" r={ring.r} stroke={ring.color} strokeWidth={ring.w} fill="none"
              strokeDasharray={`${circ * ring.dash} ${circ * (1 - ring.dash)}`}
              strokeDashoffset={circ * 0.25} strokeLinecap="round"
              transform="rotate(-90 50 50)" opacity="0.9" />
          </g>
        );
      })}
      <polyline points="43,51 48,57 59,43"
        stroke={INK} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" opacity=".5" />
    </svg>
  );
}

/* R7 · Ring + large D made FROM the arc (D outline = part of circle) */
function R7({ sz }: { sz: number }) {
  const r = sz * 0.23;
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="r7bg" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#EDE5DC" /><stop offset="1" stopColor="#F5EDE5" />
        </linearGradient>
        <linearGradient id="r7r" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={P} /><stop offset="1" stopColor={A} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#r7bg)" />
      {/* D vertical stroke */}
      <line x1="32" y1="22" x2="32" y2="78" stroke="url(#r7r)" strokeWidth="9" strokeLinecap="round" />
      {/* D curve = big arc from (32,22) around to (32,78) clockwise */}
      <path d="M 32 22 C 32 22 82 22 82 50 C 82 78 32 78 32 78"
        stroke="url(#r7r)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* sage dot period */}
      <circle cx="76" cy="80" r="6" fill={S} />
    </svg>
  );
}

/* R8 · Terracotta gradient bg, white ring track + sage arc, ✓ white */
function R8({ sz }: { sz: number }) {
  const r = sz * 0.23; const rad = 30; const circ = 2 * Math.PI * rad;
  const dash = circ * 0.76;
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="r8bg" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={PA} /><stop offset="1" stopColor={P} />
        </linearGradient>
        <radialGradient id="r8sh" cx="30%" cy="22%" r="55%">
          <stop stopColor="rgba(255,255,255,.18)" /><stop offset="1" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#r8bg)" />
      <rect width="100" height="100" rx={r} fill="url(#r8sh)" />
      <circle cx="50" cy="50" r={rad} stroke="rgba(255,255,255,.20)" strokeWidth="9" fill="none" />
      <circle cx="50" cy="50" r={rad} stroke={S} strokeWidth="9" fill="none"
        strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={circ * 0.25}
        strokeLinecap="round" transform="rotate(-90 50 50)" />
      <circle cx="50" cy="50" r="13" fill="rgba(255,255,255,.12)" />
      <polyline points="42,50 48,57 60,42"
        stroke={W} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* R9 · Dashed track + D in centre */
function R9({ sz }: { sz: number }) {
  const r = sz * 0.23; const rad = 30; const circ = 2 * Math.PI * rad;
  const dash = circ * 0.76;
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="r9bg" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#EDE5DC" /><stop offset="1" stopColor="#F5EDE5" />
        </linearGradient>
        <linearGradient id="r9r" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={P} /><stop offset="1" stopColor={A} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#r9bg)" />
      {/* dashed track */}
      <circle cx="50" cy="50" r={rad} stroke="rgba(201,122,91,.20)" strokeWidth="6"
        strokeDasharray="4 6" fill="none" />
      {/* solid progress arc */}
      <circle cx="50" cy="50" r={rad} stroke="url(#r9r)" strokeWidth="8" fill="none"
        strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={circ * 0.25}
        strokeLinecap="round" transform="rotate(-90 50 50)" />
      {/* D centre */}
      <path d="M 38 37 L 38 63 M 38 37 L 51 37 C 64 37 64 63 51 63 L 38 63"
        stroke={P} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* R10 · Sage bg, terracotta ring, white D + white ✓ */
function R10({ sz }: { sz: number }) {
  const r = sz * 0.23; const rad = 30; const circ = 2 * Math.PI * rad;
  const dash = circ * 0.76;
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="r10bg" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={SD} /><stop offset="1" stopColor={S} />
        </linearGradient>
        <radialGradient id="r10sh" cx="28%" cy="22%" r="55%">
          <stop stopColor="rgba(255,255,255,.18)" /><stop offset="1" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#r10bg)" />
      <rect width="100" height="100" rx={r} fill="url(#r10sh)" />
      <circle cx="50" cy="50" r={rad} stroke="rgba(255,255,255,.20)" strokeWidth="9" fill="none" />
      <circle cx="50" cy="50" r={rad} stroke={W} strokeWidth="9" fill="none"
        strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={circ * 0.25}
        strokeLinecap="round" transform="rotate(-90 50 50)" />
      <path d="M 38 37 L 38 63 M 38 37 L 51 37 C 64 37 64 63 51 63 L 38 63"
        stroke={W} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="62" cy="62" r="10" fill={W} opacity=".18" />
      <polyline points="57,62 61,67 68,57"
        stroke={W} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Shared card ─── */
function IconCard({ label, Comp, name, desc, selected = false }:
  { label: string; Comp: (p: { sz: number }) => JSX.Element; name: string; desc: string; selected?: boolean }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
      background: W, borderRadius: 20,
      padding: "22px 18px 16px",
      boxShadow: selected
        ? `0 0 0 3px ${P}, 0 8px 28px rgba(201,122,91,.22)`
        : "0 4px 20px rgba(201,122,91,.10), 0 1px 3px rgba(0,0,0,.05)",
      border: selected ? `2px solid ${P}` : "1.5px solid rgba(201,122,91,.09)",
      minWidth: 148,
      position: "relative",
    }}>
      {selected && (
        <div style={{
          position: "absolute", top: -12, right: -12,
          background: S, color: W, fontSize: 10, fontWeight: 700, fontFamily: F,
          padding: "3px 8px", borderRadius: 12,
        }}>SELECTED</div>
      )}
      <div style={{ position: "absolute", top: -10, left: -10, background: selected ? S : P, color: W, fontSize: 11, fontWeight: 700, fontFamily: F, padding: "3px 8px", borderRadius: 20 }}>{label}</div>
      <Comp sz={108} />
      <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
        <Comp sz={50} /><Comp sz={34} /><Comp sz={22} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <span style={{ fontSize: 12, fontWeight: 700, fontFamily: F, color: INK }}>{name}</span>
        <span style={{ fontSize: 10, fontFamily: F, color: S }}>{desc}</span>
      </div>
    </div>
  );
}

/* ─── Dark row ─── */
function DarkStrip({ icons }: { icons: { Comp: (p: { sz: number }) => JSX.Element; label: string }[] }) {
  return (
    <div style={{ background: DARK, borderRadius: 16, padding: "16px 24px", display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
      <span style={{ fontSize: 10, color: S, fontFamily: F, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" as const }}>Dark bg</span>
      {icons.map(({ Comp, label }) => (
        <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <Comp sz={42} />
          <span style={{ fontSize: 9, fontFamily: F, color: "rgba(255,255,255,.35)", fontWeight: 600 }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

const NEW_ICONS = [
  { label: "R1", Comp: R1, name: "Ring + D", desc: "D letterform in ring centre" },
  { label: "R2", Comp: R2, name: "D + ✓ split", desc: "D left · ✓ right inside ring" },
  { label: "R3", Comp: R3, name: "Dark ring", desc: "Dark bg · amber arc · white ✓" },
  { label: "R4", Comp: R4, name: "Full ring + D", desc: "Complete ring · D in gradient bg" },
  { label: "R5", Comp: R5, name: "Habit dots", desc: "5 dot markers · sage ✓ centre" },
  { label: "R6", Comp: R6, name: "3 rings", desc: "Concentric rings for 3 habits" },
  { label: "R7", Comp: R7, name: "D as arc", desc: "D letterform drawn from the ring" },
  { label: "R8", Comp: R8, name: "Terracotta bg", desc: "Warm bg · sage arc · white ✓" },
  { label: "R9", Comp: R9, name: "Dashed + D", desc: "Dashed track · solid arc · D" },
  { label: "R10", Comp: R10, name: "Sage bg", desc: "Sage bg · white ring · D + ✓" },
];

export default function AppIconExplorer() {
  return (
    <div style={{
      minHeight: "100vh", background: BG,
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 32, padding: "44px 20px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 11, fontFamily: F, fontWeight: 700, color: P, letterSpacing: 2.5, textTransform: "uppercase" as const }}>
          Do.Yoomi — Ring Icon Exploration
        </span>
        <span style={{ fontSize: 12, fontFamily: F, color: "#9B7060" }}>
          Base #4 (selected) + 10 new variations
        </span>
      </div>

      {/* Base selected */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 10, fontFamily: F, fontWeight: 700, color: S, letterSpacing: 2, textTransform: "uppercase" as const }}>Your pick</span>
        <IconCard label="4" Comp={Base4} name="Habit ring" desc="Progress ring · sage ✓ centre" selected />
      </div>

      <div style={{ width: "100%", height: 1, background: "rgba(201,122,91,.12)" }} />

      {/* 10 new */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 10, fontFamily: F, fontWeight: 700, color: "#9B7060", letterSpacing: 2, textTransform: "uppercase" as const }}>10 explorations</span>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          {NEW_ICONS.map(ic => <IconCard key={ic.label} {...ic} />)}
        </div>
      </div>

      <DarkStrip icons={[{ Comp: Base4, label: "4" }, ...NEW_ICONS.map(ic => ({ Comp: ic.Comp, label: ic.label }))]} />

      <p style={{ fontSize: 12, fontFamily: F, color: "#9B7060", textAlign: "center" }}>
        Pick a number — 4, R1–R10 — to apply to the app.
      </p>
    </div>
  );
}
