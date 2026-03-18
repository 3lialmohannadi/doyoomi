import React from "react";

const F    = "'Nunito','Inter','Helvetica Neue',sans-serif";
const P    = "#C97A5B";
const GREY = "#8B9299";
const BG   = "#FEFCF8";

function CheckO({ size, ringColor, checkColor, sw = 2 }: { size: number; ringColor: string; checkColor: string; sw?: number }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - sw;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} stroke={ringColor} strokeWidth={sw} fill="none" />
      <polyline
        points={`${cx - r * 0.36},${cy + r * 0.12} ${cx - r * 0.04},${cy + r * 0.44} ${cx + r * 0.42},${cy - r * 0.36}`}
        stroke={checkColor} strokeWidth={sw * 1.2} strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
    </svg>
  );
}

function Dot({ size, color }: { size: number; color: string }) {
  return <span style={{ display: "inline-block", width: size, height: size, borderRadius: "50%", background: color, flexShrink: 0 }} />;
}

export default function LogoE() {
  const h = 80;
  return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;800&display=swap'); *{box-sizing:border-box;margin:0;padding:0}`}</style>
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        <span style={{ fontSize: h, fontWeight: 300, fontFamily: F, color: GREY, letterSpacing: 4, lineHeight: 1 }}>D</span>
        <span style={{ fontSize: h, fontWeight: 300, fontFamily: F, color: GREY, letterSpacing: 4, lineHeight: 1 }}>O</span>
        <div style={{ width: 12 }} />
        <Dot size={8} color={P} />
        <div style={{ width: 12 }} />
        <span style={{ fontSize: h, fontWeight: 300, fontFamily: F, color: GREY, letterSpacing: 4, lineHeight: 1 }}>Y</span>
        <div style={{ width: 5 }} />
        <CheckO size={h * 0.85} ringColor={P} checkColor={P} sw={1.8} />
        <div style={{ width: 5 }} />
        <span style={{ fontSize: h, fontWeight: 300, fontFamily: F, color: GREY, letterSpacing: 4, lineHeight: 1 }}>O</span>
        <span style={{ fontSize: h, fontWeight: 300, fontFamily: F, color: GREY, letterSpacing: 4, lineHeight: 1 }}>M</span>
        <span style={{ fontSize: h, fontWeight: 300, fontFamily: F, color: GREY, letterSpacing: 4, lineHeight: 1 }}>I</span>
        <div style={{ width: 8 }} />
        <Dot size={8} color={P} />
      </div>
    </div>
  );
}
