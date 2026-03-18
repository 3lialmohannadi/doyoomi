import React from "react";

/* ═══════════════════════════════
   YOOMI MARK  — SVG Icon Badge
   Faithful recreation of the ي/D+checkmark+dots concept
   in warm terracotta palette
══════════════════════════════════ */
function YoomiMark({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 300 300" fill="none">
      <defs>
        {/* ── Badge background ─  much darker at top for depth ── */}
        <linearGradient id="bg" x1="0" y1="0" x2="300" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#5C1E0A" />
          <stop offset="40%"  stopColor="#A04030" />
          <stop offset="80%"  stopColor="#C97A5B" />
          <stop offset="100%" stopColor="#D8936A" />
        </linearGradient>

        {/* ── Badge inner gradient (depth) ── */}
        <radialGradient id="bgRadial" cx="50%" cy="30%" r="70%">
          <stop offset="0%"   stopColor="rgba(255,140,80,0.18)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        {/* ── Glass shine ── */}
        <radialGradient id="shine" cx="38%" cy="22%" r="55%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.26)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>

        {/* ── Checkmark gradient — warm gold top, sage bottom ── */}
        <linearGradient id="chk" x1="238" y1="44" x2="56" y2="220"
          gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#F5C880" />
          <stop offset="48%"  stopColor="#7BAE9E" />
          <stop offset="100%" stopColor="#4D9082" />
        </linearGradient>

        {/* ── Checkmark soft glow ── */}
        <filter id="chkGlow" x="-12%" y="-12%" width="124%" height="124%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* ── Pearl dot ── */}
        <radialGradient id="pearl" cx="33%" cy="28%" r="65%">
          <stop offset="0%"   stopColor="rgba(255,255,255,1)" />
          <stop offset="40%"  stopColor="rgba(255,249,245,0.88)" />
          <stop offset="100%" stopColor="rgba(240,220,200,0.40)" />
        </radialGradient>

        {/* ── Dot shadow ── */}
        <filter id="dotDrop">
          <feDropShadow dx="0" dy="2" stdDeviation="2"
            floodColor="rgba(44,18,8,0.40)" />
        </filter>

        <clipPath id="badge">
          <rect x="0" y="0" width="300" height="300" rx="66" />
        </clipPath>

        {/* ── Outer badge shadow ── */}
        <filter id="outer" x="-18%" y="-18%" width="136%" height="136%">
          <feDropShadow dx="0" dy="8" stdDeviation="14"
            floodColor="rgba(80,20,0,0.55)" />
        </filter>
      </defs>

      {/* BADGE */}
      <rect x="0" y="0" width="300" height="300" rx="66"
        fill="url(#bg)" filter="url(#outer)" />
      <rect x="0" y="0" width="300" height="300" rx="66"
        fill="url(#bgRadial)" clipPath="url(#badge)" />
      <rect x="0" y="0" width="300" height="300" rx="66"
        fill="url(#shine)" clipPath="url(#badge)" />

      {/* ═══════════════════════════════
          ي / D  SHAPE
          White thick stroke outline:
           • D head (top closed portion)
           • ي tail (open arc below)
      ════════════════════════════════ */}

      {/* D head — classic D letterform with pronounced belly */}
      <path
        d={`
          M 46,30
          L 118,30
          Q 256,30 256,112
          Q 256,188 118,188
          L 46,188
          Z
        `}
        stroke="rgba(255,255,255,0.96)"
        strokeWidth="22"
        strokeLinejoin="round"
        fill="none"
        clipPath="url(#badge)"
      />

      {/* ي arc tail — graceful open sweep below the D */}
      <path
        d={`
          M 46,170
          Q 36,234 120,242
          Q 214,250 232,184
        `}
        stroke="rgba(255,255,255,0.84)"
        strokeWidth="21"
        strokeLinecap="round"
        fill="none"
        clipPath="url(#badge)"
      />

      {/* ═══════════════════════════════
          CHECKMARK — large, dramatic
          tip exits D at top-right, foot in arc
      ════════════════════════════════ */}
      <polyline
        points="60,150  108,210  240,58"
        stroke="url(#chk)"
        strokeWidth="31"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#chkGlow)"
        clipPath="url(#badge)"
      />

      {/* ═══════════════════════════════
          TWO 3D GLOSSY DOTS
      ════════════════════════════════ */}
      <circle cx="110" cy="262" r="16" fill="url(#pearl)" filter="url(#dotDrop)" />
      <circle cx="152" cy="262" r="16" fill="url(#pearl)" filter="url(#dotDrop)" />
    </svg>
  );
}

/* ── Wordmark ── */
function Wordmark({ light = false, sz = 54 }: { light?: boolean; sz?: number }) {
  const dark = "#2C1208";
  const txtCol = light ? "#FFF9F5" : dark;
  return (
    <div style={{ display: "flex", alignItems: "baseline", lineHeight: 1, gap: 0 }}>
      <span style={{
        fontFamily: "'Plus Jakarta Sans','Arial Black',system-ui,sans-serif",
        fontSize: sz, fontWeight: 900, letterSpacing: -1.5, color: txtCol,
      }}>Do</span>
      <span style={{
        fontSize: sz, fontWeight: 900, lineHeight: 1,
        color: light ? "#E8A87C" : "#C97A5B",
        margin: "0 1px",
      }}>.</span>
      <span style={{
        fontFamily: "'Plus Jakarta Sans','Arial Black',system-ui,sans-serif",
        fontSize: sz, fontWeight: 900, letterSpacing: -1.5,
        background: light
          ? "linear-gradient(90deg,#E8A87C,#F5C890)"
          : "linear-gradient(90deg,#C97A5B,#E8A87C)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}>Yoomi</span>
    </div>
  );
}

/* ── App ── */
export default function DoYoomiLogo() {
  const card: React.CSSProperties = {
    background: "#FFF9F5",
    borderRadius: 28,
    boxShadow: "0 20px 64px rgba(44,18,8,0.14)",
    display: "flex",
    padding: "32px 52px",
    alignItems: "center",
    gap: 28,
    minWidth: 500,
  };
  const sub: React.CSSProperties = {
    fontSize: 10.5, fontWeight: 700, letterSpacing: 3.5,
    color: "#7BAE9E", textTransform: "uppercase",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(155deg, #DCC9B8 0%, #C8B09A 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 40,
      padding: 48,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
      `}</style>

      {/* ─── A: Horizontal ─── */}
      <div style={card}>
        <YoomiMark size={110} />
        <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
          <Wordmark sz={54} />
          <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:12 }}>
            <div style={{
              width:28, height:2.5, borderRadius:2,
              background:"linear-gradient(90deg,#7BAE9E,transparent)",
            }} />
            <span style={sub}>Daily Productivity</span>
          </div>
        </div>
      </div>

      {/* ─── B: Stacked ─── */}
      <div style={{ ...card, flexDirection:"column", padding:"40px 64px", gap:20 }}>
        <YoomiMark size={128} />
        <Wordmark sz={50} />
        <span style={{ ...sub, letterSpacing:4.5, marginTop:2 }}>يومي · Daily</span>
      </div>

      {/* ─── C: Dark ─── */}
      <div style={{
        ...card,
        background:"linear-gradient(135deg,#2C1208,#3D1508)",
        boxShadow:"0 24px 72px rgba(44,18,8,0.60)",
      }}>
        <YoomiMark size={110} />
        <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
          <Wordmark sz={54} light />
          <span style={{ ...sub, marginTop:12 }}>Daily Productivity App</span>
        </div>
      </div>

    </div>
  );
}
