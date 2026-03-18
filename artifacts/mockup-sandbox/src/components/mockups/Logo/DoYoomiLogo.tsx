import React from "react";

/* ═══════════════════════════════════════════════════════
   DO.YOOMI — 6 DOODLE LOGO OPTIONS
   ═══════════════════════════════════════════════════════ */

const INK   = "#2C1208";
const TERRA = "#C97A5B";
const AMBER = "#F0B060";
const SAGE  = "#6BAB99";
const CREAM = "#FFF8F0";
const DARK  = "#3A100A";
const SAND  = "#F5E6D6";

const font = "'Caveat','Comic Sans MS',cursive";

/* ── shared doodle wobble ── */
const WOBBLE_FILTER = (
  <filter id="sk" x="-8%" y="-8%" width="116%" height="116%">
    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="7" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="2.5" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
);

const SHADOW_FILTER = (
  <filter id="sh" x="-20%" y="-20%" width="140%" height="140%">
    <feDropShadow dx="3" dy="4" stdDeviation="4" floodColor={INK} floodOpacity="0.22"/>
  </filter>
);

/* ── sparkle ── */
function Sp({ x, y, s=8, c=AMBER }: { x:number; y:number; s?:number; c?:string }) {
  const h = s * 0.42;
  const pts = [
    `${x},${y-s}`, `${x+h},${y-h}`, `${x+s},${y}`, `${x+h},${y+h}`,
    `${x},${y+s}`, `${x-h},${y+h}`, `${x-s},${y}`, `${x-h},${y-h}`,
  ].join(" ");
  return <polygon points={pts} fill={c} opacity="0.90"/>;
}

/* ════════════════════════════════════════════════════════
   OPTION 1 — Circle + big checkmark (minimal, clean)
   ════════════════════════════════════════════════════════ */
function Opt1() {
  return (
    <div style={card}>
      <svg width={90} height={90} viewBox="0 0 90 90" fill="none">
        <defs>{WOBBLE_FILTER}{SHADOW_FILTER}</defs>
        <circle cx="45" cy="45" r="40" fill={TERRA} filter="url(#sh)"/>
        <circle cx="45" cy="45" r="40" fill="rgba(255,255,255,0.08)"/>
        {/* big checkmark */}
        <polyline points="20,46 38,64 70,24" stroke={CREAM} strokeWidth="8"
          strokeLinecap="round" strokeLinejoin="round" filter="url(#sk)"/>
        {/* two dots */}
        <circle cx="33" cy="76" r="5" fill={CREAM} opacity="0.85" filter="url(#sk)"/>
        <circle cx="50" cy="76" r="5" fill={CREAM} opacity="0.85" filter="url(#sk)"/>
      </svg>
      <div style={wordRow}>
        <span style={{...w, color:INK}}>Do</span>
        <span style={{...w, color:TERRA}}>.</span>
        <span style={{...w, color:TERRA}}>Yoomi</span>
      </div>
      <span style={tag}>Circle · دائرة</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   OPTION 2 — Organic blob badge
   ════════════════════════════════════════════════════════ */
function Opt2() {
  return (
    <div style={card}>
      <svg width={90} height={90} viewBox="0 0 90 90" fill="none">
        <defs>{WOBBLE_FILTER}{SHADOW_FILTER}</defs>
        {/* organic blob */}
        <path d="M 45,4 C 72,4 86,16 86,45 C 86,70 72,86 45,86 C 18,86 4,70 4,45 C 4,16 18,4 45,4 Z"
          fill={TERRA} filter="url(#sh)"/>
        {/* D outline */}
        <path d="M 24,22 L 24,66 M 24,22 L 46,22 C 68,22 68,66 46,66 L 24,66"
          stroke={CREAM} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
          fill="none" filter="url(#sk)"/>
        {/* checkmark */}
        <polyline points="32,48 42,60 62,32" stroke={SAGE} strokeWidth="6"
          strokeLinecap="round" strokeLinejoin="round"/>
        <Sp x={76} y={14} s={7} c={AMBER}/>
      </svg>
      <div style={wordRow}>
        <span style={{...w, color:INK}}>Do</span>
        <span style={{...w, color:TERRA}}>.</span>
        <span style={{...w, color:TERRA}}>Yoomi</span>
      </div>
      <span style={tag}>Blob · شكل عضوي</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   OPTION 3 — Text-only wordmark (no icon badge)
   ════════════════════════════════════════════════════════ */
function Opt3() {
  return (
    <div style={card}>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
        {/* big "Do." */}
        <div style={{ display:"flex", alignItems:"baseline", lineHeight:1 }}>
          <span style={{ fontFamily:font, fontSize:52, fontWeight:700, color:INK }}>Do</span>
          <span style={{ fontFamily:font, fontSize:52, fontWeight:700, color:TERRA }}>.</span>
        </div>
        {/* divider doodle line */}
        <svg viewBox="0 0 120 10" style={{ width:120, display:"block" }}>
          <path d="M 0,5 Q 30,0 60,5 Q 90,10 120,5"
            stroke={SAGE} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        </svg>
        {/* Yoomi */}
        <span style={{ fontFamily:font, fontSize:42, fontWeight:700, color:TERRA, letterSpacing:-1 }}>
          Yoomi
        </span>
        {/* Arabic */}
        <span style={{ fontFamily:font, fontSize:17, fontWeight:600, color:SAGE, marginTop:2 }}>يومي</span>
      </div>
      <span style={tag}>Wordmark · نص فقط</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   OPTION 4 — Sun / daily sunshine motif
   ════════════════════════════════════════════════════════ */
function Opt4() {
  const rays = Array.from({length:8}, (_,i) => {
    const a = (i*45 * Math.PI)/180;
    const r1=34, r2=42;
    return `M ${(45+r1*Math.cos(a)).toFixed(1)},${(45+r1*Math.sin(a)).toFixed(1)} L ${(45+r2*Math.cos(a)).toFixed(1)},${(45+r2*Math.sin(a)).toFixed(1)}`;
  });
  return (
    <div style={card}>
      <svg width={90} height={90} viewBox="0 0 90 90" fill="none">
        <defs>{WOBBLE_FILTER}{SHADOW_FILTER}</defs>
        {/* rays */}
        {rays.map((d,i) => (
          <path key={i} d={d} stroke={AMBER} strokeWidth="3.5"
            strokeLinecap="round" filter="url(#sk)" opacity="0.85"/>
        ))}
        {/* sun circle */}
        <circle cx="45" cy="45" r="30" fill={TERRA} filter="url(#sh)"/>
        {/* checkmark */}
        <polyline points="28,46 40,58 62,28" stroke={CREAM} strokeWidth="7"
          strokeLinecap="round" strokeLinejoin="round" filter="url(#sk)"/>
        {/* two dots */}
        <circle cx="34" cy="72" r="3.5" fill={TERRA} opacity="0.90"/>
        <circle cx="47" cy="72" r="3.5" fill={TERRA} opacity="0.90"/>
      </svg>
      <div style={wordRow}>
        <span style={{...w, color:INK}}>Do</span>
        <span style={{...w, color:AMBER}}>.</span>
        <span style={{...w, color:TERRA}}>Yoomi</span>
      </div>
      <span style={tag}>Sun · شمس يومية</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   OPTION 5 — Pill / horizontal badge
   ════════════════════════════════════════════════════════ */
function Opt5() {
  return (
    <div style={{...card, minWidth:300}}>
      <svg width={260} height={72} viewBox="0 0 260 72" fill="none">
        <defs>{WOBBLE_FILTER}{SHADOW_FILTER}</defs>
        {/* pill */}
        <rect x="3" y="3" width="254" height="66" rx="33" fill={TERRA} filter="url(#sh)"/>
        <rect x="3" y="3" width="254" height="33" rx="33" fill="rgba(255,255,255,0.10)"/>
        {/* checkmark */}
        <polyline points="22,38 35,54 58,20" stroke={CREAM} strokeWidth="6"
          strokeLinecap="round" strokeLinejoin="round" filter="url(#sk)"/>
        {/* wordmark inside pill */}
        <text x="76" y="48" fontFamily={font} fontSize="36" fontWeight="700" fill={CREAM}>
          Do.Yoomi
        </text>
        {/* dots */}
        <circle cx="30" cy="63" r="3.5" fill={CREAM} opacity="0.70"/>
        <circle cx="43" cy="63" r="3.5" fill={CREAM} opacity="0.70"/>
        <Sp x={244} y={16} s={8} c={AMBER}/>
      </svg>
      <span style={tag}>Pill · بادج أفقي</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   OPTION 6 — Sticker style (white stroke border + fill)
   ════════════════════════════════════════════════════════ */
function Opt6() {
  return (
    <div style={{...card, background:DARK}}>
      <svg width={90} height={90} viewBox="0 0 90 90" fill="none">
        <defs>{WOBBLE_FILTER}{SHADOW_FILTER}</defs>
        {/* sticker white border */}
        <rect x="4" y="4" width="82" height="82" rx="22"
          fill="white" filter="url(#sh)" opacity="0.98"/>
        <rect x="9" y="9" width="72" height="72" rx="18" fill={TERRA}/>
        {/* D */}
        <path d="M 22,20 L 22,68 M 22,20 L 46,20 C 68,20 68,68 46,68 L 22,68"
          stroke={CREAM} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
          fill="none" filter="url(#sk)"/>
        {/* checkmark */}
        <polyline points="30,48 42,62 66,28" stroke={AMBER} strokeWidth="7"
          strokeLinecap="round" strokeLinejoin="round" filter="url(#sk)"/>
        <circle cx="34" cy="79" r="4" fill="white" opacity="0.90"/>
        <circle cx="50" cy="79" r="4" fill="white" opacity="0.90"/>
      </svg>
      <div style={wordRow}>
        <span style={{...w, color:CREAM}}>Do</span>
        <span style={{...w, color:AMBER}}>.</span>
        <span style={{...w, color:AMBER}}>Yoomi</span>
      </div>
      <span style={{...tag, color:SAGE}}>Sticker · ستيكر</span>
    </div>
  );
}

/* ── layout helpers ── */
const card: React.CSSProperties = {
  background: CREAM,
  borderRadius: 22,
  padding: "22px 28px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 10,
  boxShadow: "3px 4px 0px rgba(44,18,8,0.18), 0 8px 28px rgba(44,18,8,0.10)",
  border: "2px solid rgba(44,18,8,0.06)",
  minWidth: 200,
};
const wordRow: React.CSSProperties = {
  display:"flex", alignItems:"center", lineHeight:1,
};
const w: React.CSSProperties = {
  fontFamily: font, fontSize: 36, fontWeight: 700, letterSpacing: -0.5,
};
const tag: React.CSSProperties = {
  fontFamily: font, fontSize: 14, fontWeight: 500,
  color: SAGE, marginTop: 2,
};

/* ═══════════════════════════════════════════════════════
   PAGE — gallery grid
   ═══════════════════════════════════════════════════════ */
export default function DoYoomiLogo() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 40% 38%, #F0DCC8, #D4B898)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 32,
      padding: 48,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
      `}</style>

      <p style={{ fontFamily:font, fontSize:22, color:INK, fontWeight:600, letterSpacing:1 }}>
        اختر الشعار المناسب · Pick your logo
      </p>

      {/* row 1 */}
      <div style={{ display:"flex", gap:20, flexWrap:"wrap", justifyContent:"center" }}>
        <div style={{ position:"relative" }}>
          <div style={badge}>1</div>
          <Opt1/>
        </div>
        <div style={{ position:"relative" }}>
          <div style={badge}>2</div>
          <Opt2/>
        </div>
        <div style={{ position:"relative" }}>
          <div style={badge}>3</div>
          <Opt3/>
        </div>
      </div>

      {/* row 2 */}
      <div style={{ display:"flex", gap:20, flexWrap:"wrap", justifyContent:"center" }}>
        <div style={{ position:"relative" }}>
          <div style={badge}>4</div>
          <Opt4/>
        </div>
        <div style={{ position:"relative" }}>
          <div style={badge}>5</div>
          <Opt5/>
        </div>
        <div style={{ position:"relative" }}>
          <div style={badge}>6</div>
          <Opt6/>
        </div>
      </div>

      <p style={{ fontFamily:font, fontSize:18, color:"#7B5040", fontWeight:500 }}>
        ✏️ أخبرني رقم الخيار وأطوّره بالكامل
      </p>
    </div>
  );
}

const badge: React.CSSProperties = {
  position: "absolute",
  top: -10, left: -10,
  width: 28, height: 28,
  borderRadius: 14,
  background: TERRA,
  color: CREAM,
  fontFamily: font,
  fontSize: 16,
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10,
  boxShadow: "2px 2px 0 rgba(44,18,8,0.25)",
};
