import React from "react";

const PRIMARY = "#C97A5B";
const AMBER   = "#E8A87C";
const SAGE    = "#7BAE9E";
const WHITE   = "#FFFFFF";
const INK     = "#2C1208";
const BG      = "#FBF7F3";

function IconSquircle({ size = 80 }: { size?: number }) {
  const r = size * 0.28;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <defs>
        <linearGradient id="grad-sq" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={PRIMARY} />
          <stop offset="100%" stopColor={AMBER} />
        </linearGradient>
        <filter id="shadow-sq">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={PRIMARY} floodOpacity="0.28" />
        </filter>
      </defs>
      <rect x="2" y="2" width="76" height="76" rx={r} fill="url(#grad-sq)" filter="url(#shadow-sq)" />
      <path d="M 22 18 L 22 62 M 22 18 L 43 18 C 62 18 62 62 43 62 L 22 62"
        stroke={WHITE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <polyline points="34,46 43,57 62,30"
        stroke={SAGE} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCircle({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <defs>
        <linearGradient id="grad-ci" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={PRIMARY} />
          <stop offset="100%" stopColor={AMBER} />
        </linearGradient>
        <filter id="shadow-ci">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={PRIMARY} floodOpacity="0.28" />
        </filter>
      </defs>
      <circle cx="40" cy="40" r="38" fill="url(#grad-ci)" filter="url(#shadow-ci)" />
      <path d="M 20 18 L 20 62 M 20 18 L 43 18 C 62 18 62 62 43 62 L 20 62"
        stroke={WHITE} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <polyline points="32,46 43,57 62,30"
        stroke={SAGE} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VariantA() {
  return (
    <div style={card}>
      <div style={variantLabel}>A</div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <IconSquircle size={80} />
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <span style={textDo}>Do.</span>
          <span style={textYoomi}>Yoomi</span>
        </div>
      </div>
      <p style={desc}>Horizontal · squircle icon + text</p>
    </div>
  );
}

function VariantB() {
  return (
    <div style={card}>
      <div style={variantLabel}>B</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <IconCircle size={88} />
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <span style={{ ...textDo, fontSize: 30 }}>Do.</span>
          <span style={{ ...textYoomi, fontSize: 30 }}>Yoomi</span>
        </div>
      </div>
      <p style={desc}>Vertical · circle icon + text below</p>
    </div>
  );
}

function VariantC() {
  return (
    <div style={card}>
      <div style={variantLabel}>C</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ ...textDo, fontSize: 52, letterSpacing: -1.5 }}>Do.</span>
          <svg width={26} height={26} viewBox="0 0 26 26" style={{ marginBottom: 2 }}>
            <circle cx="13" cy="13" r="12" fill={SAGE} opacity="0.15" />
            <polyline points="6,13 11,18 20,8"
              stroke={SAGE} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
        <span style={{
          fontSize: 22,
          fontWeight: 300,
          fontFamily: "'Inter','Helvetica Neue',sans-serif",
          color: INK,
          letterSpacing: 3,
        }}>
          Yoomi
        </span>
      </div>
      <p style={desc}>Type-led · "Do." bold + ✓ badge + light "Yoomi"</p>
    </div>
  );
}

const card: React.CSSProperties = {
  position: "relative",
  background: WHITE,
  borderRadius: 20,
  padding: "28px 32px 20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 16,
  boxShadow: "0 4px 24px rgba(201,122,91,0.13), 0 1px 4px rgba(0,0,0,0.05)",
  border: "1.5px solid rgba(201,122,91,0.12)",
  minWidth: 240,
};

const variantLabel: React.CSSProperties = {
  position: "absolute",
  top: -12,
  left: -12,
  width: 28,
  height: 28,
  borderRadius: 14,
  background: PRIMARY,
  color: WHITE,
  fontSize: 14,
  fontWeight: 700,
  fontFamily: "'Inter','Helvetica Neue',sans-serif",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 2px 8px rgba(201,122,91,0.32)",
};

const textDo: React.CSSProperties = {
  fontSize: 36,
  fontWeight: 800,
  fontFamily: "'Inter','Helvetica Neue',sans-serif",
  color: PRIMARY,
  letterSpacing: -1,
  lineHeight: 1,
};

const textYoomi: React.CSSProperties = {
  fontSize: 36,
  fontWeight: 400,
  fontFamily: "'Inter','Helvetica Neue',sans-serif",
  color: INK,
  letterSpacing: -0.5,
  lineHeight: 1,
};

const desc: React.CSSProperties = {
  fontSize: 12,
  fontFamily: "'Inter','Helvetica Neue',sans-serif",
  color: SAGE,
  fontWeight: 500,
  margin: 0,
  textAlign: "center",
};

export default function DoYoomiLogo() {
  return (
    <div style={{
      minHeight: "100vh",
      background: BG,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 40,
      padding: 48,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <span style={{
        fontSize: 12,
        fontFamily: "'Inter',sans-serif",
        fontWeight: 600,
        color: PRIMARY,
        letterSpacing: 2,
        textTransform: "uppercase" as const,
      }}>
        Do.Yoomi — Logo Preview
      </span>

      <div style={{ display: "flex", gap: 28, flexWrap: "wrap", justifyContent: "center" }}>
        <VariantA />
        <VariantB />
        <VariantC />
      </div>

      <p style={{
        fontSize: 13,
        fontFamily: "'Inter',sans-serif",
        color: "#9B7060",
        fontWeight: 400,
      }}>
        Which variant do you prefer — A, B, or C?
      </p>
    </div>
  );
}
