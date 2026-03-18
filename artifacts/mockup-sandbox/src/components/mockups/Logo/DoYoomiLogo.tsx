import React from "react";

const PRIMARY = "#C97A5B";
const AMBER = "#E8A87C";
const SAGE = "#7BAE9E";
const DARK = "#2C1208";
const CREAM = "#FFF9F5";

function IconMark({ size = 96 }: { size?: number }) {
  const r = size * 0.22;
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="badgeGrad" x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#B8604A" />
          <stop offset="50%" stopColor="#C97A5B" />
          <stop offset="100%" stopColor="#E8A87C" />
        </linearGradient>
        <linearGradient id="shineGrad" x1="0" y1="0" x2="0" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
          <stop offset="55%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={PRIMARY} floodOpacity="0.45" />
        </filter>
        <clipPath id="badgeClip">
          <rect x="0" y="0" width="96" height="96" rx="22" ry="22" />
        </clipPath>
      </defs>

      <rect x="0" y="0" width="96" height="96" rx="22" ry="22"
        fill="url(#badgeGrad)" filter="url(#badgeShadow)" />
      <rect x="0" y="0" width="96" height="96" rx="22" ry="22"
        fill="url(#shineGrad)" clipPath="url(#badgeClip)" />

      <text
        x="48" y="56"
        fontFamily="'Arial Black', 'Arial Bold', Arial, sans-serif"
        fontSize="70"
        fontWeight="900"
        fill="none"
        stroke={CREAM}
        strokeWidth="5"
        strokeLinejoin="round"
        textAnchor="middle"
        dominantBaseline="middle"
        opacity="0.95"
      >D</text>

      <polyline
        points="33,46 43,58 63,34"
        stroke={SAGE}
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      <circle cx="36" cy="78" r="5.5" fill={CREAM} opacity="0.9" />
      <circle cx="52" cy="78" r="5.5" fill={CREAM} opacity="0.9" />
    </svg>
  );
}

export default function DoYoomiLogo() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#F5EDE5",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 48,
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      padding: 40,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <p style={{ fontSize: 13, letterSpacing: 3, color: SAGE, textTransform: "uppercase", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
        شعار · Logo Variants
      </p>

      {/* Version A — Horizontal Badge + Wordmark */}
      <div style={{
        background: CREAM,
        borderRadius: 24,
        padding: "36px 52px",
        display: "flex",
        alignItems: "center",
        gap: 28,
        boxShadow: "0 12px 48px rgba(44,18,8,0.10)",
        minWidth: 520,
      }}>
        <IconMark size={96} />
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 0, lineHeight: 1 }}>
            <span style={{
              fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
              fontSize: 52, fontWeight: 900, color: DARK, letterSpacing: -1.5
            }}>Do</span>
            <span style={{ fontSize: 52, fontWeight: 900, color: PRIMARY, margin: "0 1px" }}>.</span>
            <span style={{
              fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
              fontSize: 52, fontWeight: 900, letterSpacing: -1.5,
              background: `linear-gradient(90deg, ${PRIMARY}, ${AMBER})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Yoomi</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
            <div style={{ height: 2, width: 32, background: SAGE, borderRadius: 1 }} />
            <span style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 11, fontWeight: 600, letterSpacing: 3,
              color: SAGE, textTransform: "uppercase"
            }}>Daily Productivity</span>
          </div>
        </div>
      </div>

      {/* Version B — Stacked (Icon above text) */}
      <div style={{
        background: CREAM,
        borderRadius: 24,
        padding: "40px 64px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        boxShadow: "0 12px 48px rgba(44,18,8,0.10)",
        minWidth: 520,
      }}>
        <IconMark size={80} />
        <div style={{ display: "flex", alignItems: "baseline", gap: 0, lineHeight: 1 }}>
          <span style={{
            fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
            fontSize: 44, fontWeight: 900, color: DARK, letterSpacing: -1
          }}>Do</span>
          <span style={{ fontSize: 44, fontWeight: 900, color: PRIMARY }}>.</span>
          <span style={{
            fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
            fontSize: 44, fontWeight: 900, letterSpacing: -1,
            background: `linear-gradient(90deg, ${PRIMARY}, ${AMBER})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Yoomi</span>
        </div>
        <span style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 11, fontWeight: 600, letterSpacing: 4,
          color: SAGE, textTransform: "uppercase"
        }}>يومي · Daily</span>
      </div>

      {/* Version C — Dark background */}
      <div style={{
        background: `linear-gradient(135deg, ${DARK}, #4A1F0A)`,
        borderRadius: 24,
        padding: "36px 52px",
        display: "flex",
        alignItems: "center",
        gap: 28,
        boxShadow: "0 16px 48px rgba(44,18,8,0.35)",
        minWidth: 520,
      }}>
        <IconMark size={90} />
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 0, lineHeight: 1 }}>
            <span style={{
              fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
              fontSize: 50, fontWeight: 900, color: CREAM, letterSpacing: -1.5
            }}>Do</span>
            <span style={{ fontSize: 50, fontWeight: 900, color: AMBER }}>.</span>
            <span style={{
              fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
              fontSize: 50, fontWeight: 900, letterSpacing: -1.5,
              background: `linear-gradient(90deg, ${AMBER}, #F5C890)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Yoomi</span>
          </div>
          <span style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 11, fontWeight: 600, letterSpacing: 4,
            color: SAGE, textTransform: "uppercase", marginTop: 10
          }}>Daily Productivity App</span>
        </div>
      </div>
    </div>
  );
}
