import React from "react";

const F   = "'Nunito','Inter','Helvetica Neue',sans-serif";
const P   = "#C97A5B";
const S   = "#7BAE9E";
const INK = "#2C1208";
const BG  = "#FEFCF8";

function CheckO({ size, ringColor, checkColor, sw = 3.5 }: { size: number; ringColor: string; checkColor: string; sw?: number }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - sw;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} stroke={ringColor} strokeWidth={sw} fill="none" />
      <polyline
        points={`${cx - r * 0.36},${cy + r * 0.12} ${cx - r * 0.04},${cy + r * 0.44} ${cx + r * 0.42},${cy - r * 0.36}`}
        stroke={checkColor} strokeWidth={sw * 1.1} strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
    </svg>
  );
}

export default function LogoD() {
  const h = 80;
  return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;800&display=swap'); *{box-sizing:border-box;margin:0;padding:0}`}</style>
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        <span style={{ fontSize: h, fontWeight: 800, fontFamily: F, color: P, letterSpacing: 2, lineHeight: 1 }}>D</span>
        <span style={{ fontSize: h, fontWeight: 800, fontFamily: F, color: P, letterSpacing: 2, lineHeight: 1 }}>O</span>
        <span style={{ fontSize: h, fontWeight: 800, fontFamily: F, color: INK, lineHeight: 1, margin: "0 4px" }}>.</span>
        <span style={{ fontSize: h, fontWeight: 800, fontFamily: F, color: P, letterSpacing: 2, lineHeight: 1 }}>Y</span>
        <div style={{ width: 4 }} />
        <CheckO size={h * 0.88} ringColor={S} checkColor={P} sw={3.5} />
        <div style={{ width: 4 }} />
        <span style={{ fontSize: h, fontWeight: 800, fontFamily: F, color: P, letterSpacing: 2, lineHeight: 1 }}>O</span>
        <span style={{ fontSize: h, fontWeight: 800, fontFamily: F, color: P, letterSpacing: 2, lineHeight: 1 }}>M</span>
        <span style={{ fontSize: h, fontWeight: 800, fontFamily: F, color: P, letterSpacing: 2, lineHeight: 1 }}>I</span>
      </div>
    </div>
  );
}
