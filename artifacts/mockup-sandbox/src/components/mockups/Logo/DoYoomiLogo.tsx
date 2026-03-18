import React from "react";

const PRIMARY = "#C97A5B";
const AMBER   = "#E8A87C";
const SAGE    = "#7BAE9E";
const WHITE   = "#FFFFFF";
const INK     = "#2C1208";
const BG      = "#FBF7F3";
const DARK    = "#1C130C";

const fontSans = "'Inter','Helvetica Neue',sans-serif";

/* ─── Shared icon primitives ─── */
function SquircleIcon({ size = 72, r: rx }: { size?: number; r?: number }) {
  const r = rx ?? size * 0.28;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <defs>
        <linearGradient id="gsq" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={PRIMARY} />
          <stop offset="100%" stopColor={AMBER} />
        </linearGradient>
        <filter id="fsq">
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor={PRIMARY} floodOpacity="0.28" />
        </filter>
      </defs>
      <rect x="2" y="2" width="76" height="76" rx={r} fill="url(#gsq)" filter="url(#fsq)" />
      <path d="M 22 18 L 22 62 M 22 18 L 43 18 C 62 18 62 62 43 62 L 22 62"
        stroke={WHITE} strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <polyline points="34,46 43,57 62,30"
        stroke={SAGE} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SquircleIconGlow({ size = 72 }: { size?: number }) {
  const r = size * 0.28;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <defs>
        <linearGradient id="gsq2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={PRIMARY} />
          <stop offset="100%" stopColor={AMBER} />
        </linearGradient>
        <filter id="fsq2">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor={PRIMARY} floodOpacity="0.40" />
        </filter>
        <radialGradient id="glow2" cx="30%" cy="28%" r="55%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="76" height="76" rx={r} fill="url(#gsq2)" filter="url(#fsq2)" />
      <rect x="2" y="2" width="76" height="76" rx={r} fill="url(#glow2)" />
      <path d="M 22 18 L 22 62 M 22 18 L 43 18 C 62 18 62 62 43 62 L 22 62"
        stroke={WHITE} strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="58" cy="52" r="12" fill={SAGE} />
      <polyline points="52,52 57,58 66,45"
        stroke={WHITE} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckBadge({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="13" r="12" fill={SAGE} opacity="0.18" />
      <polyline points="6,13 11,18 20,8"
        stroke={SAGE} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   VARIANT A EXPLORATIONS
   ═══════════════════════════════════════════════ */

/* A1 — Classic horizontal (refined baseline) */
function A1() {
  return (
    <div style={card}>
      <div style={badge}>A1</div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <SquircleIcon size={72} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
            <span style={{ ...tDo, fontSize: 34 }}>Do.</span>
            <span style={{ ...tYoomi, fontSize: 34 }}>Yoomi</span>
          </div>
          <span style={{ fontSize: 11, fontFamily: fontSans, color: SAGE, letterSpacing: 2, marginTop: 2 }}>
            DAILY PRODUCTIVITY
          </span>
        </div>
      </div>
      <p style={desc}>Classic horizontal · tagline below</p>
    </div>
  );
}

/* A2 — Stacked wordmark beside icon */
function A2() {
  return (
    <div style={card}>
      <div style={badge}>A2</div>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <SquircleIcon size={76} />
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <span style={{ ...tDo, fontSize: 38, lineHeight: 1 }}>Do.</span>
          <span style={{ ...tYoomi, fontSize: 28, lineHeight: 1.1, fontWeight: 300, letterSpacing: 1 }}>
            Yoomi
          </span>
        </div>
      </div>
      <p style={desc}>Stacked wordmark · "Do." bold, "Yoomi" light</p>
    </div>
  );
}

/* A3 — Icon with sage check badge circle, gradient "Do." */
function A3() {
  return (
    <div style={card}>
      <div style={badge}>A3</div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <SquircleIconGlow size={76} />
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <span style={{
            fontSize: 36,
            fontWeight: 800,
            fontFamily: fontSans,
            background: `linear-gradient(135deg, ${PRIMARY}, ${AMBER})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: -1,
          }}>Do.</span>
          <span style={{ ...tYoomi, fontSize: 36 }}>Yoomi</span>
        </div>
      </div>
      <p style={desc}>Gradient wordmark · floating check badge on icon</p>
    </div>
  );
}

/* A4 — Unified pill: icon + text inside one container */
function A4() {
  return (
    <div style={card}>
      <div style={badge}>A4</div>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: WHITE,
        border: `2px solid rgba(201,122,91,0.18)`,
        borderRadius: 999,
        padding: "8px 20px 8px 8px",
        boxShadow: "0 3px 14px rgba(201,122,91,0.16)",
      }}>
        <SquircleIcon size={52} r={14} />
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <span style={{ ...tDo, fontSize: 26 }}>Do.</span>
          <span style={{ ...tYoomi, fontSize: 26 }}>Yoomi</span>
        </div>
      </div>
      <p style={desc}>Pill container · icon + text unified</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   VARIANT C EXPLORATIONS
   ═══════════════════════════════════════════════ */

/* C1 — "Do." + ✓ badge + light "Yoomi" (refined baseline) */
function C1() {
  return (
    <div style={card}>
      <div style={badge}>C1</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ ...tDo, fontSize: 54, letterSpacing: -2 }}>Do.</span>
          <CheckBadge size={24} />
        </div>
        <span style={{ fontSize: 20, fontWeight: 300, fontFamily: fontSans, color: INK, letterSpacing: 4 }}>
          Yoomi
        </span>
      </div>
      <p style={desc}>Type-led · "Do." bold + ✓ badge + light "Yoomi"</p>
    </div>
  );
}

/* C2 — Dot replaced by ✓ (no separate badge) */
function C2() {
  return (
    <div style={card}>
      <div style={badge}>C2</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          <span style={{ ...tDo, fontSize: 54, letterSpacing: -2 }}>Do</span>
          <svg width={18} height={40} viewBox="0 0 18 40" style={{ marginTop: 8 }}>
            <polyline points="3,22 9,30 16,12"
              stroke={SAGE} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
        <div style={{
          width: 100,
          height: 2,
          background: `linear-gradient(90deg, ${PRIMARY}, ${AMBER})`,
          borderRadius: 1,
        }} />
        <span style={{ fontSize: 18, fontWeight: 400, fontFamily: fontSans, color: INK, letterSpacing: 5 }}>
          YOOMI
        </span>
      </div>
      <p style={desc}>Dot-as-check · ✓ replaces the period</p>
    </div>
  );
}

/* C3 — Large "D" initial + full wordmark + sage underline accent */
function C3() {
  return (
    <div style={card}>
      <div style={badge}>C3</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2, lineHeight: 1 }}>
          <span style={{
            fontSize: 72,
            fontWeight: 900,
            fontFamily: fontSans,
            color: PRIMARY,
            lineHeight: 0.9,
            letterSpacing: -3,
          }}>D</span>
          <div style={{ display: "flex", flexDirection: "column", paddingBottom: 4 }}>
            <span style={{ fontSize: 26, fontWeight: 700, fontFamily: fontSans, color: AMBER, lineHeight: 1 }}>o.</span>
            <span style={{ fontSize: 16, fontWeight: 300, fontFamily: fontSans, color: INK, letterSpacing: 3, lineHeight: 1.4 }}>Yoomi</span>
          </div>
          <svg width={20} height={20} viewBox="0 0 26 26" style={{ marginBottom: 6, marginLeft: 4 }}>
            <circle cx="13" cy="13" r="11" fill={SAGE} opacity="0.2" />
            <polyline points="6,13 11,18 20,8"
              stroke={SAGE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
      </div>
      <p style={desc}>Large "D" initial · stacked "o.Yoomi" + ✓</p>
    </div>
  );
}

/* C4 — Monogram style: D inside sage ring + "Do.Yoomi" beside */
function C4() {
  return (
    <div style={card}>
      <div style={badge}>C4</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ position: "relative", width: 80, height: 80 }}>
          <svg width={80} height={80} viewBox="0 0 80 80" fill="none">
            <defs>
              <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={PRIMARY} />
                <stop offset="100%" stopColor={AMBER} />
              </linearGradient>
            </defs>
            <circle cx="40" cy="40" r="37" stroke="url(#ring-grad)" strokeWidth="3.5" fill="none" />
            <path d="M 20 18 L 20 62 M 20 18 L 42 18 C 62 18 62 62 42 62 L 20 62"
              stroke={PRIMARY} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="58" cy="58" r="10" fill={SAGE} />
            <polyline points="53,58 57,63 65,52"
              stroke={WHITE} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <span style={{ ...tDo, fontSize: 28 }}>Do.</span>
          <span style={{ ...tYoomi, fontSize: 28, fontWeight: 300, letterSpacing: 1 }}>Yoomi</span>
        </div>
      </div>
      <p style={desc}>Ring monogram · outline "D" + sage ✓ badge</p>
    </div>
  );
}

/* ─── Shared styles ─── */
const card: React.CSSProperties = {
  position: "relative",
  background: WHITE,
  borderRadius: 20,
  padding: "28px 28px 18px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 14,
  boxShadow: "0 4px 24px rgba(201,122,91,0.12), 0 1px 3px rgba(0,0,0,0.05)",
  border: "1.5px solid rgba(201,122,91,0.11)",
  minWidth: 230,
};

const badge: React.CSSProperties = {
  position: "absolute",
  top: -10, left: -10,
  background: PRIMARY,
  color: WHITE,
  fontSize: 12,
  fontWeight: 700,
  fontFamily: fontSans,
  padding: "3px 9px",
  borderRadius: 20,
  boxShadow: "0 2px 8px rgba(201,122,91,0.35)",
};

const tDo: React.CSSProperties = {
  fontFamily: fontSans,
  fontWeight: 800,
  color: PRIMARY,
  letterSpacing: -1,
  lineHeight: 1,
};

const tYoomi: React.CSSProperties = {
  fontFamily: fontSans,
  fontWeight: 400,
  color: INK,
  letterSpacing: -0.5,
  lineHeight: 1,
};

const desc: React.CSSProperties = {
  fontSize: 11,
  fontFamily: fontSans,
  color: SAGE,
  fontWeight: 500,
  margin: 0,
  textAlign: "center",
};

/* ─── Dark strip ─── */
function DarkStrip() {
  return (
    <div style={{
      background: DARK,
      borderRadius: 16,
      padding: "18px 32px",
      display: "flex",
      gap: 32,
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
    }}>
      <span style={{ fontSize: 10, color: SAGE, fontFamily: fontSans, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" as const }}>Dark</span>
      {/* A on dark */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <SquircleIcon size={46} />
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <span style={{ ...tDo, fontSize: 24, color: AMBER }}>Do.</span>
          <span style={{ ...tYoomi, fontSize: 24, color: WHITE }}>Yoomi</span>
        </div>
      </div>
      <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.1)" }} />
      {/* C on dark */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ ...tDo, fontSize: 32, color: AMBER }}>Do.</span>
        <CheckBadge size={20} />
        <span style={{ fontSize: 18, fontWeight: 300, fontFamily: fontSans, color: WHITE, letterSpacing: 3 }}>Yoomi</span>
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function DoYoomiLogo() {
  return (
    <div style={{
      minHeight: "100vh",
      background: BG,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      gap: 36,
      padding: "48px 32px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 11, fontFamily: fontSans, fontWeight: 700, color: PRIMARY, letterSpacing: 2.5, textTransform: "uppercase" as const }}>
          Do.Yoomi — Logo Exploration
        </span>
        <span style={{ fontSize: 12, fontFamily: fontSans, color: "#9B7060" }}>
          Variants A &amp; C expanded
        </span>
      </div>

      {/* A variants */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%" }}>
        <span style={{ fontSize: 11, fontFamily: fontSans, fontWeight: 700, color: "#9B7060", letterSpacing: 2, textTransform: "uppercase" as const }}>Variant A — Horizontal Icon</span>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
          <A1 /><A2 /><A3 /><A4 />
        </div>
      </div>

      {/* C variants */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%" }}>
        <span style={{ fontSize: 11, fontFamily: fontSans, fontWeight: 700, color: "#9B7060", letterSpacing: 2, textTransform: "uppercase" as const }}>Variant C — Type-led</span>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
          <C1 /><C2 /><C3 /><C4 />
        </div>
      </div>

      <DarkStrip />

      <p style={{ fontSize: 12, fontFamily: fontSans, color: "#9B7060", textAlign: "center" }}>
        Which one resonates? Pick a number (A1–A4 or C1–C4) to finalize.
      </p>
    </div>
  );
}
