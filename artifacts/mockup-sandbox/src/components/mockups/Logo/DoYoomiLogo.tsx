import React from "react";

const P = "#C97A5B";   // terracotta
const A = "#E8A87C";   // amber
const S = "#7BAE9E";   // sage
const D = "#2C1208";   // dark espresso
const C = "#FFF9F5";   // cream

/* ─── The icon mark — faithfully rebuilt from the reference ─── */
function YoomiMark({ size = 120 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* badge background */}
        <linearGradient id="bg" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#9E4A32" />
          <stop offset="45%" stopColor={P} />
          <stop offset="100%" stopColor={A} />
        </linearGradient>

        {/* top-glass highlight */}
        <linearGradient id="shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.30)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        {/* checkmark gradient */}
        <linearGradient id="chk" x1="155" y1="30" x2="50" y2="155" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={A} />
          <stop offset="55%" stopColor={S} />
          <stop offset="100%" stopColor="#4E9080" />
        </linearGradient>

        {/* dot pearl */}
        <radialGradient id="dot" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor={C} />
          <stop offset="100%" stopColor="rgba(255,249,245,0.55)" />
        </radialGradient>

        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>

        <clipPath id="badge">
          <rect x="0" y="0" width="200" height="200" rx="46" />
        </clipPath>
      </defs>

      {/* ── badge background ── */}
      <rect x="0" y="0" width="200" height="200" rx="46" fill="url(#bg)" />
      {/* glass shine */}
      <rect x="0" y="0" width="200" height="200" rx="46" fill="url(#shine)" clipPath="url(#badge)" />

      {/* ── The ي / D combined shape ──
          Outer: a tall rounded rect + wide bottom arc (the ي scoop)
          Drawn as stroke-only (thick outline), no fill
      ── */}
      <path
        d="
          M 38,22
          L 105,22
          Q 162,22 162,79
          Q 162,124 118,132
          L 38,132
          Q 30,132 30,124
          L 30,30
          Q 30,22 38,22
          Z
        "
        stroke={C}
        strokeWidth="14"
        strokeLinejoin="round"
        fill="none"
        opacity="0.95"
      />

      {/* bottom open arc — the ي tail/scoop */}
      <path
        d="
          M 30,118
          Q 30,158 82,162
          Q 140,166 162,132
        "
        stroke={C}
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
        opacity="0.88"
      />

      {/* ── Big bold checkmark spanning the full mark — like reference ── */}
      <polyline
        points="44,105  82,148  162,38"
        stroke="url(#chk)"
        strokeWidth="22"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
      />

      {/* ── Two glossy 3D dots ── */}
      <circle cx="76" cy="178" r="12" fill="url(#dot)" />
      <circle cx="108" cy="178" r="12" fill="url(#dot)" />
      {/* dot inner highlights */}
      <circle cx="72" cy="174" r="4" fill="rgba(255,255,255,0.6)" />
      <circle cx="104" cy="174" r="4" fill="rgba(255,255,255,0.6)" />
    </svg>
  );
}

/* ─── Wordmark ─── */
function Wordmark({ color = D, size = 52 }: { color?: string; size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 0, lineHeight: 1 }}>
      <span style={{
        fontFamily: "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif",
        fontSize: size, fontWeight: 900, color, letterSpacing: -1.5,
      }}>Do</span>
      <span style={{ fontSize: size, fontWeight: 900, color: P, margin: "0 1px", lineHeight: 1 }}>.</span>
      <span style={{
        fontFamily: "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif",
        fontSize: size, fontWeight: 900, letterSpacing: -1.5,
        background: `linear-gradient(90deg, ${P} 0%, ${A} 100%)`,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>Yoomi</span>
    </div>
  );
}

/* ─── Main export ─── */
export default function DoYoomiLogo() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#EDE0D4",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 40,
      padding: 48,
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* ── A: Horizontal — icon + wordmark ── */}
      <div style={{
        background: C,
        borderRadius: 28,
        padding: "32px 48px",
        display: "flex",
        alignItems: "center",
        gap: 24,
        boxShadow: "0 16px 56px rgba(44,18,8,0.12)",
      }}>
        <YoomiMark size={110} />
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <Wordmark size={54} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
            <div style={{ height: 2, width: 28, background: `linear-gradient(90deg, ${S}, transparent)`, borderRadius: 1 }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3.5, color: S, textTransform: "uppercase" }}>
              Daily Productivity
            </span>
          </div>
        </div>
      </div>

      {/* ── B: Stacked — icon above text, centered ── */}
      <div style={{
        background: C,
        borderRadius: 28,
        padding: "36px 60px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        boxShadow: "0 16px 56px rgba(44,18,8,0.12)",
      }}>
        <YoomiMark size={88} />
        <Wordmark size={46} />
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 4, color: S, textTransform: "uppercase", marginTop: 2 }}>
          يومي · Daily
        </span>
      </div>

      {/* ── C: Dark background ── */}
      <div style={{
        background: `linear-gradient(135deg, ${D} 0%, #4A1F0A 100%)`,
        borderRadius: 28,
        padding: "32px 48px",
        display: "flex",
        alignItems: "center",
        gap: 24,
        boxShadow: "0 20px 60px rgba(44,18,8,0.45)",
      }}>
        <YoomiMark size={110} />
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 0, lineHeight: 1 }}>
            <span style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: 54, fontWeight: 900, color: C, letterSpacing: -1.5,
            }}>Do</span>
            <span style={{ fontSize: 54, fontWeight: 900, color: A }}>.</span>
            <span style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: 54, fontWeight: 900, letterSpacing: -1.5,
              background: `linear-gradient(90deg, ${A}, #F5C890)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Yoomi</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3.5, color: S, textTransform: "uppercase", marginTop: 12 }}>
            Daily Productivity App
          </span>
        </div>
      </div>
    </div>
  );
}
