import React from "react";

/* ═══════════════════════════════════════════════════════════════
   DO.YOOMI — 3 LOGO VARIANTS (preview only, no app integration)
   Colors: PRIMARY=#C97A5B  SAGE=#7BAE9E  GRADIENT=['#C97A5B','#E8A87C']
   ═══════════════════════════════════════════════════════════════ */

const PRIMARY = "#C97A5B";
const AMBER   = "#E8A87C";
const SAGE    = "#7BAE9E";
const WHITE   = "#FFFFFF";
const INK     = "#2C1208";
const BG      = "#FBF7F3";

/* ── Squircle icon with D + checkmark ── */
function IconSquircle({ size = 80 }: { size?: number }) {
  const s = size;
  const r = s * 0.28;
  return (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
      <defs>
        <linearGradient id="grad-sq" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={PRIMARY} />
          <stop offset="100%" stopColor={AMBER} />
        </linearGradient>
        <filter id="shadow-sq">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={PRIMARY} floodOpacity="0.30" />
        </filter>
      </defs>
      {/* Squircle background */}
      <rect x="2" y="2" width="76" height="76" rx={r} fill="url(#grad-sq)" filter="url(#shadow-sq)" />
      {/* Letter D — white, bold */}
      <path
        d="M 22 18 L 22 62 M 22 18 L 43 18 C 62 18 62 62 43 62 L 22 62"
        stroke={WHITE}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Checkmark — sage green, overlapping bottom-right of D */}
      <polyline
        points="34,46 43,57 62,30"
        stroke={SAGE}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Circle icon with D + checkmark ── */
function IconCircle({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <defs>
        <linearGradient id="grad-ci" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={PRIMARY} />
          <stop offset="100%" stopColor={AMBER} />
        </linearGradient>
        <filter id="shadow-ci">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={PRIMARY} floodOpacity="0.30" />
        </filter>
      </defs>
      {/* Circle background */}
      <circle cx="40" cy="40" r="38" fill="url(#grad-ci)" filter="url(#shadow-ci)" />
      {/* Letter D — white */}
      <path
        d="M 20 18 L 20 62 M 20 18 L 43 18 C 62 18 62 62 43 62 L 20 62"
        stroke={WHITE}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Checkmark — sage green */}
      <polyline
        points="32,46 43,57 62,30"
        stroke={SAGE}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   VARIANT A — Horizontal: squircle icon left + "Do.Yoomi" right
   ───────────────────────────────────────────────────────────── */
function VariantA() {
  return (
    <div style={card}>
      <div style={{ ...variantLabel }}>A</div>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <IconSquircle size={80} />
        <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
          <span style={textDo}>Do.</span>
          <span style={textYoomi}>Yoomi</span>
        </div>
      </div>
      <p style={desc}>Horizontal — Icon left, text right</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   VARIANT B — Vertical: circle icon on top + "Do.Yoomi" below
   ───────────────────────────────────────────────────────────── */
function VariantB() {
  return (
    <div style={card}>
      <div style={{ ...variantLabel }}>B</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <IconCircle size={88} />
        <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
          <span style={{ ...textDo, fontSize: 30 }}>Do.</span>
          <span style={{ ...textYoomi, fontSize: 30 }}>Yoomi</span>
        </div>
      </div>
      <p style={desc}>Vertical — Icon top, text below</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   VARIANT C — Text-led: "Do✓" large + "Yoomi" subtitle style
   The ✓ replaces the dot, rendered in sage as part of the type
   ───────────────────────────────────────────────────────────── */
function VariantC() {
  return (
    <div style={card}>
      <div style={{ ...variantLabel }}>C</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        {/* "Do" + inline SVG checkmark replacing dot */}
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <span style={{ ...textDo, fontSize: 58, letterSpacing: -2 }}>Do</span>
          <svg width={28} height={38} viewBox="0 0 28 38" style={{ marginBottom: 2 }}>
            <polyline
              points="4,20 12,30 24,10"
              stroke={SAGE}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
        {/* Thin divider */}
        <svg viewBox="0 0 120 4" style={{ width: 120 }}>
          <rect x="0" y="1" width="120" height="2" rx="1"
            fill={`url(#line-grad)`} />
          <defs>
            <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={PRIMARY} stopOpacity="0.8" />
              <stop offset="100%" stopColor={AMBER} stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>
        {/* Yoomi subtitle */}
        <span style={{
          fontSize: 26,
          fontFamily: "'Inter','SF Pro Display','Helvetica Neue',sans-serif",
          fontWeight: 400,
          color: INK,
          letterSpacing: 4,
          textTransform: "uppercase" as const,
        }}>
          Yoomi
        </span>
      </div>
      <p style={desc}>Type-led — "Do✓" mark + "YOOMI" subtitle</p>
    </div>
  );
}

/* ── Shared styles ── */
const card: React.CSSProperties = {
  position: "relative",
  background: WHITE,
  borderRadius: 20,
  padding: "28px 32px 20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 16,
  boxShadow: "0 4px 24px rgba(201,122,91,0.14), 0 1px 4px rgba(0,0,0,0.06)",
  border: `1.5px solid rgba(201,122,91,0.12)`,
  minWidth: 240,
};

const variantLabel: React.CSSProperties = {
  position: "absolute",
  top: -12,
  left: -12,
  width: 30,
  height: 30,
  borderRadius: 15,
  background: PRIMARY,
  color: WHITE,
  fontSize: 15,
  fontWeight: 700,
  fontFamily: "'Inter','SF Pro Display','Helvetica Neue',sans-serif",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 2px 8px rgba(201,122,91,0.35)",
};

const textDo: React.CSSProperties = {
  fontSize: 36,
  fontWeight: 800,
  fontFamily: "'Inter','SF Pro Display','Helvetica Neue',sans-serif",
  color: PRIMARY,
  letterSpacing: -1,
  lineHeight: 1,
};

const textYoomi: React.CSSProperties = {
  fontSize: 36,
  fontWeight: 400,
  fontFamily: "'Inter','SF Pro Display','Helvetica Neue',sans-serif",
  color: INK,
  letterSpacing: -0.5,
  lineHeight: 1,
};

const desc: React.CSSProperties = {
  fontSize: 12,
  fontFamily: "'Inter','SF Pro Display','Helvetica Neue',sans-serif",
  color: SAGE,
  fontWeight: 500,
  margin: 0,
  textAlign: "center",
};

/* ═══════════════════════════════════════════════════════════════
   PAGE — gallery
   ═══════════════════════════════════════════════════════════════ */
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div style={{
        fontSize: 13,
        fontFamily: "'Inter',sans-serif",
        fontWeight: 600,
        color: PRIMARY,
        letterSpacing: 2,
        textTransform: "uppercase",
      }}>
        Do.Yoomi — Logo Preview
      </div>

      <div style={{ display: "flex", gap: 28, flexWrap: "wrap", justifyContent: "center" }}>
        <VariantA />
        <VariantB />
        <VariantC />
      </div>

      <p style={{
        fontSize: 13,
        fontFamily: "'Inter',sans-serif",
        color: "#9B7060",
        fontWeight: 500,
        textAlign: "center",
      }}>
        Tell me which variant (A, B, or C) you prefer — or request adjustments.
      </p>
    </div>
  );
}
