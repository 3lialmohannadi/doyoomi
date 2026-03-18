import React from "react";

/* ══════════════════════════════════════════════════════════
   DO.YOOMI  —  LOGO  v4
   Concept: clean geometric mark built on pure SVG primitives
   • Proper cubic-bezier D  (no hacky quadratics)
   • Hollow D (badge bg shows through the counter)
   • Bold checkmark inside the D counter
   • Two glossy dots below
   • High-contrast colours for readability at any size
   ══════════════════════════════════════════════════════════ */

/* ── tokens ── */
const BG_A = "#3A0E06";
const BG_B = "#7B3020";
const BG_C = "#C47558";
const WHITE = "rgba(255,255,255,0.95)";
const AMBER = "#F5C070";
const SAGE  = "#68B09F";
const DARK  = "#2C1208";
const CREAM = "#FFF9F5";
const TERRA = "#C97A5B";

/* ─────────────────────────────────────────────────────────
   THE MARK
   ViewBox: 300 × 300
   D: cubic-bezier, stroke only, thick, white
   Checkmark: inside D counter, bold gradient
   ي arc: extends below D
   Two 3D pearl dots
   ───────────────────────────────────────────────────────── */
function Mark({ px = 110 }: { px?: number }) {
  return (
    <svg width={px} height={px} viewBox="0 0 300 300" fill="none">
      <defs>

        {/* badge — 3-stop rich gradient */}
        <linearGradient id="m-bg" x1="0" y1="0" x2="300" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={BG_A}/>
          <stop offset="45%"  stopColor={BG_B}/>
          <stop offset="100%" stopColor={BG_C}/>
        </linearGradient>

        {/* inner radial pop at centre */}
        <radialGradient id="m-inner" cx="55%" cy="45%" r="48%">
          <stop offset="0%"   stopColor="rgba(220,120,70,0.28)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
        </radialGradient>

        {/* glass top shine */}
        <radialGradient id="m-shine" cx="38%" cy="20%" r="52%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.24)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>

        {/* checkmark — amber→sage */}
        <linearGradient id="m-chk" x1="220" y1="42" x2="52" y2="216" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={AMBER}/>
          <stop offset="55%"  stopColor={SAGE}/>
          <stop offset="100%" stopColor="#3A8870"/>
        </linearGradient>

        {/* pearl dot */}
        <radialGradient id="m-dot" cx="34%" cy="26%" r="66%">
          <stop offset="0%"   stopColor="#ffffff"/>
          <stop offset="50%"  stopColor="rgba(255,249,245,0.82)"/>
          <stop offset="100%" stopColor="rgba(230,200,180,0.35)"/>
        </radialGradient>

        {/* soft glow on checkmark */}
        <filter id="m-glow" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b"/>
          <feMerge>
            <feMergeNode in="b"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* dot drop shadow */}
        <filter id="m-dshadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#2C0A00" floodOpacity="0.45"/>
        </filter>

        {/* badge outer shadow */}
        <filter id="m-badge-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor={BG_A} floodOpacity="0.60"/>
        </filter>

        <clipPath id="m-clip">
          <rect x="0" y="0" width="300" height="300" rx="64"/>
        </clipPath>

      </defs>

      {/* ── BADGE ── */}
      <rect x="0" y="0" width="300" height="300" rx="64"
        fill="url(#m-bg)" filter="url(#m-badge-shadow)"/>
      <rect x="0" y="0" width="300" height="300" rx="64"
        fill="url(#m-inner)" clipPath="url(#m-clip)"/>
      <rect x="0" y="0" width="300" height="300" rx="64"
        fill="url(#m-shine)" clipPath="url(#m-clip)"/>

      {/* ─────────────────────────────────────────
          D  —  cubic-bezier letterform
          Stem: x=38, left vertical
          Belly: cubic bezier max width x≈252
          Stroke only (hollow) — badge bg shows through
          ───────────────────────────────────────── */}
      {/* D letterform — cubic bezier, hollow, shortened to leave room for arc+dots */}
      <path
        d="M 38,28  L 108,28  C 260,28 260,238 108,238  L 38,238  Z"
        stroke={WHITE}
        strokeWidth="24"
        strokeLinejoin="round"
        fill="none"
        clipPath="url(#m-clip)"
      />

      {/* ─────────────────────────────────────────
          ي  ARC — stays inside badge bounds
          ───────────────────────────────────────── */}
      <path
        d="M 38,248  Q 30,284 130,288  Q 238,292 260,248"
        stroke={WHITE}
        strokeWidth="23"
        strokeLinecap="round"
        fill="none"
        opacity="0.82"
        clipPath="url(#m-clip)"
      />

      {/* ─────────────────────────────────────────
          CHECKMARK — inside D counter, dramatic
          ───────────────────────────────────────── */}
      <polyline
        points="55,155  104,212  226,52"
        stroke="url(#m-chk)"
        strokeWidth="32"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#m-glow)"
        clipPath="url(#m-clip)"
      />

      {/* ─────────────────────────────────────────
          TWO  3D  DOTS
          ───────────────────────────────────────── */}
      <circle cx="112" cy="258" r="15"
        fill="url(#m-dot)" filter="url(#m-dshadow)"/>
      <circle cx="154" cy="258" r="15"
        fill="url(#m-dot)" filter="url(#m-dshadow)"/>

    </svg>
  );
}

/* ── wordmark ── */
function Word({ light = false, size = 52 }: { light?: boolean; size?: number }) {
  const base = light ? CREAM : DARK;
  return (
    <div style={{ display:"flex", alignItems:"baseline", lineHeight:1, gap:0 }}>
      <span style={{
        fontFamily:"'Plus Jakarta Sans','Arial Black',Arial,sans-serif",
        fontSize:size, fontWeight:900, letterSpacing:-1.5, color:base,
      }}>Do</span>
      <span style={{
        fontSize:size, fontWeight:900, lineHeight:1,
        color: light ? AMBER : TERRA,
        margin:"0 1px",
      }}>.</span>
      <span style={{
        fontFamily:"'Plus Jakarta Sans','Arial Black',Arial,sans-serif",
        fontSize:size, fontWeight:900, letterSpacing:-1.5,
        background: light
          ? `linear-gradient(90deg,${AMBER},#F5D090)`
          : `linear-gradient(90deg,${TERRA},#E8A87C)`,
        WebkitBackgroundClip:"text",
        WebkitTextFillColor:"transparent",
      }}>Yoomi</span>
    </div>
  );
}

const CARD: React.CSSProperties = {
  background: CREAM,
  borderRadius: 28,
  boxShadow: "0 20px 64px rgba(44,18,8,0.15)",
  display: "flex",
  alignItems: "center",
  gap: 28,
  padding: "30px 48px",
  minWidth: 520,
};
const SUB: React.CSSProperties = {
  fontFamily:"'Plus Jakarta Sans','Segoe UI',system-ui,sans-serif",
  fontSize: 10.5, fontWeight: 700,
  letterSpacing: 3.5, textTransform: "uppercase",
  color: "#7BAE9E",
};

export default function DoYoomiLogo() {
  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(148deg,#DCCABB 0%,#C4A890 100%)",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      gap:38, padding:48,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
      `}</style>

      {/* ── A  Horizontal ── */}
      <div style={CARD}>
        <Mark px={108}/>
        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          <Word size={54}/>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <div style={{width:26,height:2.5,background:"#7BAE9E",borderRadius:2,opacity:0.7}}/>
            <span style={SUB}>Daily Productivity</span>
          </div>
        </div>
      </div>

      {/* ── B  Stacked ── */}
      <div style={{...CARD, flexDirection:"column", padding:"38px 60px", gap:20}}>
        <Mark px={122}/>
        <Word size={50}/>
        <span style={{...SUB, letterSpacing:4, marginTop:2}}>يومي · Daily</span>
      </div>

      {/* ── C  Dark ── */}
      <div style={{...CARD, background:`linear-gradient(135deg,${DARK},#2E1008)`,
        boxShadow:"0 24px 72px rgba(44,18,8,0.65)"}}>
        <Mark px={108}/>
        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          <Word size={54} light/>
          <span style={SUB}>Daily Productivity App</span>
        </div>
      </div>

    </div>
  );
}
