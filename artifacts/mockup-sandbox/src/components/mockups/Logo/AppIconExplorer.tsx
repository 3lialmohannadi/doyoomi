import React from "react";

const P    = "#C97A5B";
const A    = "#E8A87C";
const S    = "#7BAE9E";
const W    = "#FFFFFF";
const INK  = "#2C1208";
const BG   = "#FBF7F3";
const F    = "'Inter','Helvetica Neue',sans-serif";

/* ════════════════════════════════════════════
   8 icon concepts — each rendered as a pure SVG
   ════════════════════════════════════════════ */

/* 1 · D-mark: white "D" on terracotta→amber gradient */
function Icon1({ sz }: { sz: number }) {
  const r = sz * 0.23;
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="i1g" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={P} /><stop offset="1" stopColor={A} />
        </linearGradient>
        <linearGradient id="i1gs" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={P} /><stop offset="1" stopColor="#A8512F" />
        </linearGradient>
        <radialGradient id="i1sh" cx="30%" cy="22%" r="60%">
          <stop stopColor="rgba(255,255,255,.18)" /><stop offset="1" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#i1g)" />
      <rect width="100" height="100" rx={r} fill="url(#i1sh)" />
      <path d="M 26 22 L 26 78 M 26 22 L 55 22 C 82 22 82 78 55 78 L 26 78"
        stroke={W} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* 2 · Big ✓ on deep terracotta — bold, confident */
function Icon2({ sz }: { sz: number }) {
  const r = sz * 0.23;
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="i2g" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#B5623E" /><stop offset="1" stopColor={P} />
        </linearGradient>
        <radialGradient id="i2sh" cx="28%" cy="20%" r="55%">
          <stop stopColor="rgba(255,255,255,.16)" /><stop offset="1" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#i2g)" />
      <rect width="100" height="100" rx={r} fill="url(#i2sh)" />
      <polyline points="20,52 40,72 80,28"
        stroke={W} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* 3 · D + sage ✓ badge floating (our squircle design, refined) */
function Icon3({ sz }: { sz: number }) {
  const r = sz * 0.23;
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="i3g" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={P} /><stop offset="1" stopColor={A} />
        </linearGradient>
        <radialGradient id="i3sh" cx="28%" cy="22%" r="55%">
          <stop stopColor="rgba(255,255,255,.20)" /><stop offset="1" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <filter id="i3f">
          <feDropShadow dx="1" dy="2" stdDeviation="3" floodColor="#3A7A68" floodOpacity=".35" />
        </filter>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#i3g)" />
      <rect width="100" height="100" rx={r} fill="url(#i3sh)" />
      <path d="M 22 20 L 22 72 M 22 20 L 50 20 C 74 20 74 72 50 72 L 22 72"
        stroke={W} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="72" cy="70" r="18" fill={S} filter="url(#i3f)" />
      <polyline points="63,70 70,78 82,60"
        stroke={W} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* 4 · Habit ring: circular progress + ✓ centre (daily cycle) */
function Icon4({ sz }: { sz: number }) {
  const r = sz * 0.23;
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="i4bg" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#EDE5DC" /><stop offset="1" stopColor="#F5EDE5" />
        </linearGradient>
        <linearGradient id="i4ring" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={P} /><stop offset="1" stopColor={A} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#i4bg)" />
      {/* ring track */}
      <circle cx="50" cy="50" r="30" stroke="rgba(201,122,91,.18)" strokeWidth="9" fill="none" />
      {/* progress arc ~75% */}
      <circle cx="50" cy="50" r="30"
        stroke="url(#i4ring)" strokeWidth="9" fill="none"
        strokeDasharray="141 47" strokeDashoffset="35"
        strokeLinecap="round"
        transform="rotate(-90 50 50)" />
      {/* centre check */}
      <circle cx="50" cy="50" r="14" fill={S} opacity=".12" />
      <polyline points="42,50 48,57 60,42"
        stroke={S} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* 5 · Dot-day mark: 3 dots (habits) + rising check (yoomi = daily) */
function Icon5({ sz }: { sz: number }) {
  const r = sz * 0.23;
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="i5g" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#5B9A8B" /><stop offset="1" stopColor={S} />
        </linearGradient>
        <radialGradient id="i5sh" cx="28%" cy="20%" r="55%">
          <stop stopColor="rgba(255,255,255,.18)" /><stop offset="1" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#i5g)" />
      <rect width="100" height="100" rx={r} fill="url(#i5sh)" />
      {/* 3 dots = habits */}
      <circle cx="30" cy="62" r="7" fill={W} opacity=".45" />
      <circle cx="50" cy="48" r="7" fill={W} opacity=".65" />
      <circle cx="70" cy="34" r="7" fill={W} opacity=".90" />
      {/* check mark */}
      <polyline points="22,60 40,78 78,30"
        stroke={W} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* 6 · Split diagonal: terracotta top-left, sage bottom-right */
function Icon6({ sz }: { sz: number }) {
  const r = sz * 0.23;
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <clipPath id="i6clip">
          <rect width="100" height="100" rx={r} />
        </clipPath>
      </defs>
      <rect width="100" height="100" rx={r} fill={P} />
      <polygon points="100,0 100,100 0,100" fill={S} clipPath="url(#i6clip)" />
      {/* D on terracotta side */}
      <path d="M 16 20 L 16 56 M 16 20 L 36 20 C 52 20 52 56 36 56 L 16 56"
        stroke={W} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* check on sage side */}
      <polyline points="55,68 65,80 86,50"
        stroke={W} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* 7 · "Do." monogram: terracotta "D" + amber dot — typographic */
function Icon7({ sz }: { sz: number }) {
  const r = sz * 0.23;
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="i7g" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FAF3EC" /><stop offset="1" stopColor="#F0E6D8" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#i7g)" />
      {/* big D in terracotta */}
      <path d="M 20 18 L 20 72 M 20 18 L 50 18 C 76 18 76 72 50 72 L 20 72"
        stroke={P} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* amber filled dot/period */}
      <circle cx="78" cy="72" r="9" fill={A} />
    </svg>
  );
}

/* 8 · Gradient "D" outlined ring — premium feel */
function Icon8({ sz }: { sz: number }) {
  const r = sz * 0.23;
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="i8bg" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={INK} /><stop offset="1" stopColor="#3D1A0A" />
        </linearGradient>
        <linearGradient id="i8ring" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={P} /><stop offset="1" stopColor={A} />
        </linearGradient>
        <linearGradient id="i8d" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={W} /><stop offset="1" stopColor="rgba(255,255,255,.70)" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx={r} fill="url(#i8bg)" />
      {/* gradient ring */}
      <circle cx="50" cy="50" r="36" stroke="url(#i8ring)" strokeWidth="4" fill="none" />
      {/* D in white */}
      <path d="M 28 28 L 28 72 M 28 28 L 52 28 C 74 28 74 72 52 72 L 28 72"
        stroke="url(#i8d)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* sage dot */}
      <circle cx="72" cy="72" r="7" fill={S} />
    </svg>
  );
}

/* ─── Icon showcase card ─── */
const ICONS = [
  { id: 1, Comp: Icon1, name: "D-mark", desc: "White D · warm gradient" },
  { id: 2, Comp: Icon2, name: "Bold ✓", desc: "Confident check · deep terracotta" },
  { id: 3, Comp: Icon3, name: "D + badge", desc: "D mark · floating sage ✓" },
  { id: 4, Comp: Icon4, name: "Habit ring", desc: "Progress ring · sage centre" },
  { id: 5, Comp: Icon5, name: "Dot-day", desc: "3 dots rising · sage check" },
  { id: 6, Comp: Icon6, name: "Split", desc: "Diagonal · D + ✓ each side" },
  { id: 7, Comp: Icon7, name: "Do. mono", desc: "Light bg · terracotta D · amber dot" },
  { id: 8, Comp: Icon8, name: "Dark ring", desc: "Dark bg · gradient ring · D" },
];

function IconCard({ id, Comp, name, desc }: { id: number; Comp: (p: { sz: number }) => JSX.Element; name: string; desc: string }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
      background: W, borderRadius: 20,
      padding: "22px 18px 16px",
      boxShadow: "0 4px 20px rgba(201,122,91,.10), 0 1px 3px rgba(0,0,0,.05)",
      border: "1.5px solid rgba(201,122,91,.09)",
      minWidth: 150,
    }}>
      {/* large preview */}
      <Comp sz={110} />
      {/* medium */}
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
        <Comp sz={52} />
        <Comp sz={36} />
        <Comp sz={24} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <span style={{ fontSize: 12, fontWeight: 700, fontFamily: F, color: INK }}>{id}. {name}</span>
        <span style={{ fontSize: 10, fontWeight: 400, fontFamily: F, color: S }}>{desc}</span>
      </div>
    </div>
  );
}

export default function AppIconExplorer() {
  return (
    <div style={{
      minHeight: "100vh", background: BG,
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 32, padding: "44px 24px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 11, fontFamily: F, fontWeight: 700, color: P, letterSpacing: 2.5, textTransform: "uppercase" as const }}>
          Do.Yoomi — App Icon Exploration
        </span>
        <span style={{ fontSize: 12, fontFamily: F, color: "#9B7060" }}>
          8 icon concepts · large / medium / small previews
        </span>
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "center" }}>
        {ICONS.map(({ id, Comp, name, desc }) => (
          <IconCard key={id} id={id} Comp={Comp} name={name} desc={desc} />
        ))}
      </div>

      {/* dark bg strip */}
      <div style={{
        background: "#1C130C", borderRadius: 16, padding: "18px 28px",
        display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", alignItems: "center",
      }}>
        <span style={{ fontSize: 10, fontFamily: F, fontWeight: 700, color: S, letterSpacing: 2, textTransform: "uppercase" as const }}>
          On dark
        </span>
        {ICONS.map(({ id, Comp }) => (
          <div key={id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <Comp sz={44} />
            <span style={{ fontSize: 9, fontFamily: F, color: "rgba(255,255,255,.4)", fontWeight: 600 }}>{id}</span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12, fontFamily: F, color: "#9B7060", textAlign: "center" }}>
        Pick a number (1–8) to refine and apply to the app.
      </p>
    </div>
  );
}
