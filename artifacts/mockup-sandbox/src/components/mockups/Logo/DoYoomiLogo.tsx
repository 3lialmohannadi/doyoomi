import React from "react";

/* ─── Clean fresh logo — built from scratch ─── */

const DARK   = "#1A0A04";
const TERRA  = "#C97A5B";
const AMBER  = "#E8A87C";
const SAGE   = "#7BAE9E";
const CREAM  = "#FFF9F5";
const SAND   = "#F0E0D0";

/* ══════════════════════════════════════════════
   ICON MARK v3
   Approach: filled D letter + checkmark + dots
   Using SVG text for the D (crisp font rendering)
   ══════════════════════════════════════════════ */
function Mark({ px = 100 }: { px?: number }) {
  return (
    <svg width={px} height={px} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="g-badge" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#3D100A" />
          <stop offset="55%"  stopColor="#8C3822" />
          <stop offset="100%" stopColor="#C97A5B" />
        </linearGradient>
        <radialGradient id="g-shine" cx="40%" cy="22%" r="60%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.22)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <linearGradient id="g-chk" x1="76" y1="22" x2="20" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#F0C070" />
          <stop offset="50%"  stopColor={SAGE} />
          <stop offset="100%" stopColor="#3D9080" />
        </linearGradient>
        <radialGradient id="g-dot" cx="33%" cy="28%" r="70%">
          <stop offset="0%"   stopColor="#ffffff" />
          <stop offset="100%" stopColor="rgba(255,240,230,0.50)" />
        </radialGradient>
        <filter id="f-glow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.4" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="f-shadow">
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#3D100A" floodOpacity="0.50"/>
        </filter>
      </defs>

      {/* badge */}
      <rect width="100" height="100" rx="22" fill="url(#g-badge)" filter="url(#f-shadow)"/>
      <rect width="100" height="100" rx="22" fill="url(#g-shine)"/>

      {/* D letter — filled white (gives solid readable D) */}
      <text
        x="14" y="74"
        fontSize="78"
        fontFamily="'Arial Black','Arial Bold',Arial,sans-serif"
        fontWeight="900"
        fill={CREAM}
        opacity="0.95"
      >D</text>

      {/* two arc dots at bottom (ي) — inside D counter using ي reference */}
      <circle cx="32" cy="88" r="5.2" fill={CREAM} opacity="0.90"/>
      <circle cx="48" cy="88" r="5.2" fill={CREAM} opacity="0.90"/>

      {/* checkmark — large, spans from upper-right into D */}
      <polyline
        points="19,58  36,76  78,24"
        stroke="url(#g-chk)"
        strokeWidth="8.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#f-glow)"
      />
    </svg>
  );
}

/* ── sub label ── */
const SUB: React.CSSProperties = {
  fontFamily: "'Plus Jakarta Sans','Segoe UI',system-ui,sans-serif",
  fontSize: 10, fontWeight: 700, letterSpacing: 3.5,
  color: SAGE, textTransform: "uppercase",
};

/* ── wordmark ── */
function Word({ light = false, size = 52 }: { light?: boolean; size?: number }) {
  const base = light ? CREAM : DARK;
  return (
    <div style={{ display:"flex", alignItems:"baseline", lineHeight:1, gap:0 }}>
      <span style={{
        fontFamily:"'Plus Jakarta Sans','Arial Black',system-ui,sans-serif",
        fontSize:size, fontWeight:900, letterSpacing:-1.5, color:base,
      }}>Do</span>
      <span style={{ fontSize:size, fontWeight:900, color:light ? AMBER : TERRA, margin:"0 1px" }}>.</span>
      <span style={{
        fontFamily:"'Plus Jakarta Sans','Arial Black',system-ui,sans-serif",
        fontSize:size, fontWeight:900, letterSpacing:-1.5,
        background: light
          ? `linear-gradient(90deg,${AMBER},#F5C890)`
          : `linear-gradient(90deg,${TERRA},${AMBER})`,
        WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
      }}>Yoomi</span>
    </div>
  );
}

/* ═══════════════════════ PAGE ═══════════════════════ */
export default function DoYoomiLogo() {
  return (
    <div style={{
      minHeight:"100vh",
      background:`linear-gradient(150deg,#E2CFC0,#C8AE9A)`,
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      gap:36, padding:48,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
      `}</style>

      {/* ── A: Horizontal — primary logo ── */}
      <div style={{
        background:CREAM,
        borderRadius:26, padding:"28px 44px",
        display:"flex", alignItems:"center", gap:24,
        boxShadow:"0 16px 56px rgba(26,10,4,0.14)",
      }}>
        <Mark px={96}/>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <Word size={52}/>
          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
            <div style={{ width:24, height:2, background:SAGE, borderRadius:1, opacity:0.7 }}/>
            <span style={SUB}>Daily Productivity</span>
          </div>
        </div>
      </div>

      {/* ── B: Stacked — for app / square use ── */}
      <div style={{
        background:CREAM,
        borderRadius:26, padding:"36px 56px",
        display:"flex", flexDirection:"column", alignItems:"center", gap:18,
        boxShadow:"0 16px 56px rgba(26,10,4,0.14)",
      }}>
        <Mark px={114}/>
        <Word size={48}/>
        <span style={{ ...SUB, letterSpacing:4, marginTop:2 }}>يومي · Daily</span>
      </div>

      {/* ── C: Dark — for splash / dark bg ── */}
      <div style={{
        background:`linear-gradient(135deg,${DARK},#2E1008)`,
        borderRadius:26, padding:"28px 44px",
        display:"flex", alignItems:"center", gap:24,
        boxShadow:"0 20px 64px rgba(26,10,4,0.60)",
      }}>
        <Mark px={96}/>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <Word size={52} light/>
          <span style={SUB}>Daily Productivity App</span>
        </div>
      </div>

      {/* ── D: Minimal icon only ── */}
      <div style={{
        display:"flex", alignItems:"center", gap:20,
        background:SAND, borderRadius:20,
        padding:"20px 36px",
        boxShadow:"0 8px 32px rgba(26,10,4,0.10)",
      }}>
        {[72, 56, 44].map((sz, i) => (
          <div key={i} style={{
            display:"flex", flexDirection:"column", alignItems:"center", gap:8,
          }}>
            <Mark px={sz}/>
            <span style={{ ...SUB, fontSize:9 }}>{sz}px</span>
          </div>
        ))}
      </div>

    </div>
  );
}
