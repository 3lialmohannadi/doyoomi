import React from "react";

const F = "'Nunito','Inter','Helvetica Neue',sans-serif";

const P   = "#C97A5B";
const S   = "#7BAE9E";
const INK = "#2C1208";
const BG  = "#FEFCF8";

const GREY_L = "#8B9299";
const GREY_D = "#4A5568";

function CheckO({
  size,
  ringColor,
  checkColor,
  strokeWidth = 2,
}: {
  size: number;
  ringColor: string;
  checkColor: string;
  strokeWidth?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r  = size / 2 - strokeWidth;
  const sw = strokeWidth;
  const p1x = cx - r * 0.36, p1y = cy + r * 0.12;
  const p2x = cx - r * 0.04, p2y = cy + r * 0.44;
  const p3x = cx + r * 0.42, p3y = cy - r * 0.36;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block", flexShrink: 0 }}
    >
      <circle
        cx={cx} cy={cy} r={r}
        stroke={ringColor}
        strokeWidth={sw}
        fill="none"
      />
      <polyline
        points={`${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}`}
        stroke={checkColor}
        strokeWidth={sw * 1.15}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function Dot({ size, color }: { size: number; color: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        flexShrink: 0,
      }}
    />
  );
}

function StyleE() {
  const h       = 72;
  const weight  = 300;
  const ls      = 4;
  const col     = GREY_L;
  const dotSz   = 7;

  return (
    <div
      style={{
        background: BG,
        borderRadius: 20,
        padding: "52px 72px",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        boxShadow: "0 2px 32px rgba(0,0,0,.06)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        <span style={{ fontSize: h, fontWeight: weight, fontFamily: F, color: col, letterSpacing: ls, lineHeight: 1 }}>D</span>
        <span style={{ fontSize: h, fontWeight: weight, fontFamily: F, color: col, letterSpacing: ls, lineHeight: 1 }}>O</span>
        <div style={{ width: 10 }} />
        <Dot size={dotSz} color={P} />
        <div style={{ width: 10 }} />
        <span style={{ fontSize: h, fontWeight: weight, fontFamily: F, color: col, letterSpacing: ls, lineHeight: 1 }}>Y</span>
        <div style={{ width: 4 }} />
        <CheckO size={h * 0.85} ringColor={P} checkColor={P} strokeWidth={1.8} />
        <div style={{ width: 4 }} />
        <span style={{ fontSize: h, fontWeight: weight, fontFamily: F, color: col, letterSpacing: ls, lineHeight: 1 }}>O</span>
        <span style={{ fontSize: h, fontWeight: weight, fontFamily: F, color: col, letterSpacing: ls, lineHeight: 1 }}>M</span>
        <span style={{ fontSize: h, fontWeight: weight, fontFamily: F, color: col, letterSpacing: ls, lineHeight: 1 }}>I</span>
        <div style={{ width: 6 }} />
        <Dot size={dotSz} color={P} />
      </div>
      <span style={{ fontSize: 11, fontFamily: F, letterSpacing: 3, color: "#C4B5A8", textTransform: "uppercase" as const, fontWeight: 600 }}>
        E — Ultra Minimal Light
      </span>
    </div>
  );
}

function StyleD() {
  const h      = 72;
  const weight = 800;
  const ls     = 2;

  return (
    <div
      style={{
        background: BG,
        borderRadius: 20,
        padding: "52px 72px",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        boxShadow: "0 2px 32px rgba(0,0,0,.06)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        <span style={{ fontSize: h, fontWeight: weight, fontFamily: F, color: P, letterSpacing: ls, lineHeight: 1 }}>D</span>
        <span style={{ fontSize: h, fontWeight: weight, fontFamily: F, color: P, letterSpacing: ls, lineHeight: 1 }}>O</span>
        <span style={{ fontSize: h, fontWeight: weight, fontFamily: F, color: INK, letterSpacing: 0, lineHeight: 1, marginLeft: 4, marginRight: 4 }}>.</span>
        <span style={{ fontSize: h, fontWeight: weight, fontFamily: F, color: P, letterSpacing: ls, lineHeight: 1 }}>Y</span>
        <div style={{ width: 3 }} />
        <CheckO size={h * 0.88} ringColor={S} checkColor={P} strokeWidth={3.5} />
        <div style={{ width: 3 }} />
        <span style={{ fontSize: h, fontWeight: weight, fontFamily: F, color: P, letterSpacing: ls, lineHeight: 1 }}>O</span>
        <span style={{ fontSize: h, fontWeight: weight, fontFamily: F, color: P, letterSpacing: ls, lineHeight: 1 }}>M</span>
        <span style={{ fontSize: h, fontWeight: weight, fontFamily: F, color: P, letterSpacing: ls, lineHeight: 1 }}>I</span>
      </div>
      <span style={{ fontSize: 11, fontFamily: F, letterSpacing: 3, color: "#C4B5A8", textTransform: "uppercase" as const, fontWeight: 600 }}>
        D — Terracotta + Sage Circle
      </span>
    </div>
  );
}

function StyleEDark() {
  const h       = 68;
  const weight  = 300;
  const ls      = 4;
  const col     = "#D4C9C2";
  const dotSz   = 7;

  return (
    <div
      style={{
        background: INK,
        borderRadius: 20,
        padding: "52px 72px",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        boxShadow: "0 2px 32px rgba(0,0,0,.24)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        <span style={{ fontSize: h, fontWeight: weight, fontFamily: F, color: col, letterSpacing: ls, lineHeight: 1 }}>D</span>
        <span style={{ fontSize: h, fontWeight: weight, fontFamily: F, color: col, letterSpacing: ls, lineHeight: 1 }}>O</span>
        <div style={{ width: 10 }} />
        <Dot size={dotSz} color={P} />
        <div style={{ width: 10 }} />
        <span style={{ fontSize: h, fontWeight: weight, fontFamily: F, color: col, letterSpacing: ls, lineHeight: 1 }}>Y</span>
        <div style={{ width: 4 }} />
        <CheckO size={h * 0.85} ringColor={P} checkColor={P} strokeWidth={1.8} />
        <div style={{ width: 4 }} />
        <span style={{ fontSize: h, fontWeight: weight, fontFamily: F, color: col, letterSpacing: ls, lineHeight: 1 }}>O</span>
        <span style={{ fontSize: h, fontWeight: weight, fontFamily: F, color: col, letterSpacing: ls, lineHeight: 1 }}>M</span>
        <span style={{ fontSize: h, fontWeight: weight, fontFamily: F, color: col, letterSpacing: ls, lineHeight: 1 }}>I</span>
        <div style={{ width: 6 }} />
        <Dot size={dotSz} color={P} />
      </div>
      <span style={{ fontSize: 11, fontFamily: F, letterSpacing: 3, color: "#6B5C54", textTransform: "uppercase" as const, fontWeight: 600 }}>
        E Dark — Ultra Minimal
      </span>
    </div>
  );
}

function StyleDDark() {
  const h      = 68;
  const weight = 800;
  const ls     = 2;

  return (
    <div
      style={{
        background: INK,
        borderRadius: 20,
        padding: "52px 72px",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        boxShadow: "0 2px 32px rgba(0,0,0,.24)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        <span style={{ fontSize: h, fontWeight: weight, fontFamily: F, color: "#F5EED6", letterSpacing: ls, lineHeight: 1 }}>D</span>
        <span style={{ fontSize: h, fontWeight: weight, fontFamily: F, color: "#F5EED6", letterSpacing: ls, lineHeight: 1 }}>O</span>
        <span style={{ fontSize: h, fontWeight: weight, fontFamily: F, color: P, letterSpacing: 0, lineHeight: 1, marginLeft: 4, marginRight: 4 }}>.</span>
        <span style={{ fontSize: h, fontWeight: weight, fontFamily: F, color: "#F5EED6", letterSpacing: ls, lineHeight: 1 }}>Y</span>
        <div style={{ width: 3 }} />
        <CheckO size={h * 0.88} ringColor={S} checkColor={P} strokeWidth={3.5} />
        <div style={{ width: 3 }} />
        <span style={{ fontSize: h, fontWeight: weight, fontFamily: F, color: "#F5EED6", letterSpacing: ls, lineHeight: 1 }}>O</span>
        <span style={{ fontSize: h, fontWeight: weight, fontFamily: F, color: "#F5EED6", letterSpacing: ls, lineHeight: 1 }}>M</span>
        <span style={{ fontSize: h, fontWeight: weight, fontFamily: F, color: "#F5EED6", letterSpacing: ls, lineHeight: 1 }}>I</span>
      </div>
      <span style={{ fontSize: 11, fontFamily: F, letterSpacing: 3, color: "#6B5C54", textTransform: "uppercase" as const, fontWeight: 600 }}>
        D Dark — Cream + Sage Circle
      </span>
    </div>
  );
}

export default function WordmarkFinal() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F0EBE4",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 36,
        padding: "60px 40px",
        fontFamily: F,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, color: "#9B7060", textTransform: "uppercase" as const }}>
        Do.Yoomi — Final Two Wordmarks
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "center" }}>
        <StyleE />
        <StyleD />
      </div>

      <div style={{ width: "100%", height: 1, background: "rgba(0,0,0,.08)" }} />

      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "#9B7060", textTransform: "uppercase" as const }}>
        Dark Mode
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "center" }}>
        <StyleEDark />
        <StyleDDark />
      </div>
    </div>
  );
}
