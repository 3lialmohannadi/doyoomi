import React from "react";

const P    = "#C97A5B";
const S    = "#7BAE9E";
const A    = "#E8A87C";
const INK  = "#2C1208";
const CREAM= "#F5EED6";
const BG   = "#FEFCF8";

function CheckO({ size, ring, check, sw = 3.5 }: { size: number; ring: string; check: string; sw?: number }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - sw;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} stroke={ring} strokeWidth={sw} fill="none" />
      <polyline
        points={`${cx - r * 0.36},${cy + r * 0.12} ${cx - r * 0.04},${cy + r * 0.44} ${cx + r * 0.42},${cy - r * 0.36}`}
        stroke={check} strokeWidth={sw * 1.1} strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
    </svg>
  );
}

function Dot({ size, color }: { size: number; color: string }) {
  return <span style={{ display: "inline-block", width: size, height: size, borderRadius: "50%", background: color, flexShrink: 0 }} />;
}

const F = "'Helvetica Neue','Arial',sans-serif";

function Row({ label, children, bg = BG }: { label: string; children: React.ReactNode; bg?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8, width: "100%" }}>
      <span style={{ fontSize: 11, fontFamily: F, fontWeight: 700, letterSpacing: 3, color: "#9B7060", textTransform: "uppercase" as const }}>{label}</span>
      <div style={{ background: bg, borderRadius: 16, padding: "32px 52px", width: "100%", display: "flex", alignItems: "center", boxShadow: "0 2px 16px rgba(0,0,0,.06)" }}>
        {children}
      </div>
    </div>
  );
}

const H = 72;
const W = 700;

export default function CStyleLogos() {
  return (
    <div style={{ minHeight: "100vh", background: "#EDE8E1", padding: "44px 48px", display: "flex", flexDirection: "column", gap: 20 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;700;800;900&display=swap'); *{box-sizing:border-box;margin:0;padding:0}`}</style>
      <div style={{ fontSize: 12, fontFamily: F, fontWeight: 700, letterSpacing: 3, color: "#9B7060", textTransform: "uppercase" as const, marginBottom: 8 }}>
        Do.Yoomi — 8 خيارات بأسلوب C
      </div>

      {/* C1 — ترابي + دائرة داكنة */}
      <Row label="C1 — دائرة داكنة + ترابي">
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <span style={{ fontSize: H, fontWeight: 700, fontFamily: F, color: P, lineHeight: 1 }}>DO</span>
          <span style={{ fontSize: H, fontWeight: 700, fontFamily: F, color: INK, lineHeight: 1, margin: "0 6px" }}>.</span>
          <span style={{ fontSize: H, fontWeight: 700, fontFamily: F, color: P, lineHeight: 1 }}>Y</span>
          <div style={{ width: 4 }} />
          <CheckO size={H * 0.85} ring={INK} check={P} sw={3.5} />
          <div style={{ width: 4 }} />
          <span style={{ fontSize: H, fontWeight: 700, fontFamily: F, color: P, lineHeight: 1 }}>OMI</span>
        </div>
      </Row>

      {/* C2 — داكن + نقطة فوق Y */}
      <Row label="C2 — داكن + نقطة ترابية فوق Y">
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <span style={{ fontSize: H, fontWeight: 700, fontFamily: F, color: INK, lineHeight: 1 }}>DO</span>
          <span style={{ fontSize: H, fontWeight: 700, fontFamily: F, color: INK, lineHeight: 1, margin: "0 4px" }}>.</span>
          <div style={{ position: "relative" as const, display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: H, fontWeight: 700, fontFamily: F, color: INK, lineHeight: 1 }}>Y</span>
            <div style={{ position: "absolute" as const, top: -10, left: "50%", transform: "translateX(-50%)", width: 8, height: 8, borderRadius: "50%", background: P }} />
          </div>
          <div style={{ width: 4 }} />
          <CheckO size={H * 0.85} ring={P} check={P} sw={3} />
          <div style={{ width: 4 }} />
          <span style={{ fontSize: H, fontWeight: 700, fontFamily: F, color: INK, lineHeight: 1 }}>OMI</span>
        </div>
      </Row>

      {/* C3 — داكن على بني */}
      <Row label="C3 — كريمي على خلفية داكنة (وضع ليل)" bg={INK}>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <span style={{ fontSize: H, fontWeight: 700, fontFamily: F, color: CREAM, lineHeight: 1 }}>DO</span>
          <Dot size={9} color={P} />
          <span style={{ fontSize: H, fontWeight: 700, fontFamily: F, color: CREAM, lineHeight: 1 }}>Y</span>
          <div style={{ width: 4 }} />
          <CheckO size={H * 0.85} ring={A} check={A} sw={3} />
          <div style={{ width: 4 }} />
          <span style={{ fontSize: H, fontWeight: 700, fontFamily: F, color: CREAM, lineHeight: 1 }}>OMI</span>
        </div>
      </Row>

      {/* C4 — على خلفية كريم */}
      <Row label="C4 — ترابي + خضراء مريمية على كريم" bg={CREAM}>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <span style={{ fontSize: H, fontWeight: 800, fontFamily: F, color: P, lineHeight: 1 }}>DO</span>
          <Dot size={9} color={INK} />
          <span style={{ fontSize: H, fontWeight: 800, fontFamily: F, color: P, lineHeight: 1 }}>Y</span>
          <div style={{ width: 4 }} />
          <CheckO size={H * 0.85} ring={S} check={INK} sw={4} />
          <div style={{ width: 4 }} />
          <span style={{ fontSize: H, fontWeight: 800, fontFamily: F, color: P, lineHeight: 1 }}>OMI</span>
        </div>
      </Row>

      {/* C5 — مع تاغلاين */}
      <Row label="C5 — مع سطر توصيف">
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            <span style={{ fontSize: H * 0.9, fontWeight: 700, fontFamily: F, color: P, lineHeight: 1, letterSpacing: 2 }}>DO.</span>
            <span style={{ fontSize: H * 0.9, fontWeight: 700, fontFamily: F, color: P, lineHeight: 1, letterSpacing: 2 }}>Y</span>
            <div style={{ width: 3 }} />
            <CheckO size={H * 0.77} ring={P} check={P} sw={3} />
            <div style={{ width: 3 }} />
            <span style={{ fontSize: H * 0.9, fontWeight: 700, fontFamily: F, color: P, lineHeight: 1, letterSpacing: 2 }}>OMI</span>
          </div>
          <span style={{ fontSize: 13, fontFamily: F, fontWeight: 400, color: S, letterSpacing: 5, textTransform: "uppercase" as const }}>Do Something Daily</span>
        </div>
      </Row>

      {/* C6 — تدرج من داكن إلى ترابي */}
      <Row label="C6 — تدرج لوني من داكن إلى ترابي">
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <span style={{ fontSize: H, fontWeight: 800, fontFamily: F, lineHeight: 1,
            background: `linear-gradient(90deg, ${INK}, ${P})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>DO</span>
          <Dot size={9} color={P} />
          <span style={{ fontSize: H, fontWeight: 800, fontFamily: F, lineHeight: 1,
            background: `linear-gradient(90deg, ${P}, ${A})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Y</span>
          <div style={{ width: 4 }} />
          <CheckO size={H * 0.85} ring={P} check={INK} sw={3.5} />
          <div style={{ width: 4 }} />
          <span style={{ fontSize: H, fontWeight: 800, fontFamily: F, lineHeight: 1,
            background: `linear-gradient(90deg, ${P}, ${A})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>OMI</span>
        </div>
      </Row>

      {/* C7 — رفيع خفيف ترابي */}
      <Row label="C7 — وزن خفيف ترابي كامل">
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <span style={{ fontSize: H, fontWeight: 300, fontFamily: F, color: P, lineHeight: 1, letterSpacing: 3 }}>DO</span>
          <Dot size={7} color={P} />
          <span style={{ fontSize: H, fontWeight: 300, fontFamily: F, color: P, lineHeight: 1, letterSpacing: 3 }}>Y</span>
          <div style={{ width: 5 }} />
          <CheckO size={H * 0.84} ring={P} check={INK} sw={1.8} />
          <div style={{ width: 5 }} />
          <span style={{ fontSize: H, fontWeight: 300, fontFamily: F, color: P, lineHeight: 1, letterSpacing: 3 }}>OMI</span>
        </div>
      </Row>

      {/* C8 — حروف مجوفة outline */}
      <Row label="C8 — حروف مجوفة (Outline)">
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <span style={{ fontSize: H, fontWeight: 700, fontFamily: F, lineHeight: 1,
            color: "transparent", WebkitTextStroke: `2px ${P}` }}>DO</span>
          <Dot size={9} color={P} />
          <span style={{ fontSize: H, fontWeight: 700, fontFamily: F, lineHeight: 1,
            color: "transparent", WebkitTextStroke: `2px ${P}` }}>Y</span>
          <div style={{ width: 4 }} />
          <CheckO size={H * 0.85} ring={P} check={P} sw={2} />
          <div style={{ width: 4 }} />
          <span style={{ fontSize: H, fontWeight: 700, fontFamily: F, lineHeight: 1,
            color: "transparent", WebkitTextStroke: `2px ${P}` }}>OMI</span>
        </div>
      </Row>
    </div>
  );
}
