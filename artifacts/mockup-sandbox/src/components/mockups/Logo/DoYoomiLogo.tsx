import React from "react";

const P    = "#C97A5B";
const A    = "#E8A87C";
const S    = "#7BAE9E";
const W    = "#FFFFFF";
const INK  = "#2C1208";
const BG   = "#FBF7F3";
const DARK = "#1C130C";
const F    = "'Inter','Helvetica Neue',sans-serif";

/* ─── Shared icon ─── */
function SquircleGlow({ sz = 80 }: { sz?: number }) {
  const r = sz * 0.28;
  return (
    <svg width={sz} height={sz} viewBox="0 0 80 80" fill="none">
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={P} /><stop offset="1" stopColor={A} />
        </linearGradient>
        <filter id="sf">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor={P} floodOpacity=".40" />
        </filter>
        <radialGradient id="sheen" cx="28%" cy="22%" r="55%">
          <stop stopColor="rgba(255,255,255,.22)" /><stop offset="1" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="76" height="76" rx={r} fill="url(#sg)" filter="url(#sf)" />
      <rect x="2" y="2" width="76" height="76" rx={r} fill="url(#sheen)" />
      <path d="M 22 18 L 22 62 M 22 18 L 43 18 C 62 18 62 62 43 62 L 22 62"
        stroke={W} strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="60" cy="54" r="13" fill={S} />
      <polyline points="54,54 59,60 68,46"
        stroke={W} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Shared components ─── */
function GradText({ sz, children, dir = "135" }: { sz: number; children: React.ReactNode; dir?: string }) {
  return (
    <span style={{
      fontSize: sz, fontWeight: 800, fontFamily: F, letterSpacing: -1, lineHeight: 1,
      background: `linear-gradient(${dir}deg, ${P}, ${A})`,
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    }}>{children}</span>
  );
}

function SageCheck({ sz = 24, solid = false }: { sz?: number; solid?: boolean }) {
  return (
    <svg width={sz} height={sz} viewBox="0 0 26 26" fill="none">
      {solid
        ? <circle cx="13" cy="13" r="12" fill={S} />
        : <circle cx="13" cy="13" r="12" fill={S} opacity=".18" />}
      <polyline points="6,13 11,18 20,8"
        stroke={solid ? W : S} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TerracottaCheck({ sz = 24 }: { sz?: number }) {
  return (
    <svg width={sz} height={sz} viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="13" r="12" fill={A} opacity=".20" />
      <polyline points="6,13 11,18 20,8"
        stroke={P} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GradRule({ w = 96 }: { w?: number }) {
  return <div style={{ width: w, height: 2, background: `linear-gradient(90deg,${P},${A})`, borderRadius: 1 }} />;
}

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      position: "relative",
      background: W,
      borderRadius: 20,
      padding: "30px 26px 18px",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
      boxShadow: "0 4px 24px rgba(201,122,91,.12), 0 1px 3px rgba(0,0,0,.05)",
      border: "1.5px solid rgba(201,122,91,.10)",
      minWidth: 218,
    }}>
      <div style={{
        position: "absolute", top: -10, left: -10,
        background: P, color: W, fontSize: 11, fontWeight: 700, fontFamily: F,
        padding: "3px 9px", borderRadius: 20,
        boxShadow: "0 2px 8px rgba(201,122,91,.35)",
      }}>{label}</div>
      {children}
    </div>
  );
}

function Desc({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 11, fontFamily: F, color: S, fontWeight: 500, margin: 0, textAlign: "center" as const }}>{children}</p>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: "100%" }}>
      <span style={{ fontSize: 11, fontFamily: F, fontWeight: 700, color: "#9B7060", letterSpacing: 2, textTransform: "uppercase" as const }}>{title}</span>
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "center" }}>{children}</div>
    </div>
  );
}

/* ════════════════════════════════════════════
   A3b — Icon + stacked gradient wordmark
   ════════════════════════════════════════════ */

/* A3b-1 · amber italic "Yoomi", icon + stacked */
function A3b1() {
  return (
    <Card label="A3b-1">
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <SquircleGlow sz={80} />
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <GradText sz={42}>Do.</GradText>
          <span style={{ fontSize: 26, fontWeight: 300, fontFamily: F, color: S, letterSpacing: 1.5, fontStyle: "italic", lineHeight: 1 }}>
            Yoomi
          </span>
        </div>
      </div>
      <Desc>Sage italic "Yoomi" · amber gradient "Do."</Desc>
    </Card>
  );
}

/* A3b-2 · compact pill wrap */
function A3b2() {
  return (
    <Card label="A3b-2">
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        background: "rgba(201,122,91,0.06)",
        border: `1.5px solid rgba(201,122,91,0.16)`,
        borderRadius: 999,
        padding: "8px 20px 8px 8px",
      }}>
        <SquircleGlow sz={60} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <GradText sz={28}>Do.</GradText>
          <span style={{ fontSize: 17, fontWeight: 300, fontFamily: F, color: INK, letterSpacing: 1.5, lineHeight: 1 }}>Yoomi</span>
        </div>
      </div>
      <Desc>Warm pill · compact icon + stacked</Desc>
    </Card>
  );
}

/* A3b-3 · icon + "Do." / "Yoomi" wide with tagline */
function A3b3() {
  return (
    <Card label="A3b-3">
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <SquircleGlow sz={76} />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <GradText sz={40}>Do.</GradText>
          <span style={{ fontSize: 24, fontWeight: 300, fontFamily: F, color: INK, letterSpacing: 2, lineHeight: 1 }}>Yoomi</span>
          <GradRule w={80} />
        </div>
      </div>
      <Desc>Gradient rule accent · spaced "Yoomi"</Desc>
    </Card>
  );
}

/* ════════════════════════════════════════════
   C1a — Centered "Do." + ✓ badge + "Yoomi"
   ════════════════════════════════════════════ */

/* C1a-1 · solid sage ✓ disc + sage "Yoomi" */
function C1a1() {
  return (
    <Card label="C1a-1">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 58, fontWeight: 800, fontFamily: F, color: P, letterSpacing: -2, lineHeight: 1 }}>Do.</span>
          <SageCheck sz={26} solid />
        </div>
        <span style={{ fontSize: 22, fontWeight: 300, fontFamily: F, color: S, letterSpacing: 5, lineHeight: 1 }}>Yoomi</span>
      </div>
      <Desc>Solid sage disc ✓ · sage "Yoomi"</Desc>
    </Card>
  );
}

/* C1a-2 · gradient "Do." + ✓ ghost + wide "Yoomi" */
function C1a2() {
  return (
    <Card label="C1a-2">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <GradText sz={58}>Do.</GradText>
          <SageCheck sz={24} />
        </div>
        <span style={{ fontSize: 20, fontWeight: 300, fontFamily: F, color: INK, letterSpacing: 8, lineHeight: 1 }}>Yoomi</span>
      </div>
      <Desc>Gradient "Do." · max-tracked "Yoomi"</Desc>
    </Card>
  );
}

/* C1a-3 · warm glow + rule separator + "Yoomi" */
function C1a3() {
  return (
    <Card label="C1a-3">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 10 }}>
          <div style={{
            position: "absolute", inset: -14,
            background: `radial-gradient(ellipse, rgba(232,168,124,.30), transparent 70%)`,
            borderRadius: "50%",
          }} />
          <span style={{ fontSize: 58, fontWeight: 800, fontFamily: F, color: P, letterSpacing: -2, lineHeight: 1, position: "relative" }}>Do.</span>
          <div style={{ position: "relative" }}><SageCheck sz={24} /></div>
        </div>
        <GradRule w={80} />
        <span style={{ fontSize: 20, fontWeight: 300, fontFamily: F, color: INK, letterSpacing: 5, lineHeight: 1 }}>Yoomi</span>
      </div>
      <Desc>Amber glow · gradient rule · "Yoomi"</Desc>
    </Card>
  );
}

/* ════════════════════════════════════════════
   C1c — Amber glow "Do." · check · "Yoomi"
   ════════════════════════════════════════════ */

/* C1c-1 · gradient "Do." + bigger glow + spaced Yoomi */
function C1c1() {
  return (
    <Card label="C1c-1">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
          <div style={{
            position: "absolute", inset: -18,
            background: `radial-gradient(ellipse, rgba(232,168,124,.38), transparent 68%)`,
            borderRadius: "50%",
          }} />
          <GradText sz={62}>Do.</GradText>
        </div>
        <SageCheck sz={20} />
        <span style={{ fontSize: 22, fontWeight: 300, fontFamily: F, color: INK, letterSpacing: 5, lineHeight: 1 }}>Yoomi</span>
      </div>
      <Desc>Gradient glow "Do." · sage ✓ · spaced Yoomi</Desc>
    </Card>
  );
}

/* C1c-2 · glow "Do." + mini squircle above as monogram */
function C1c2() {
  return (
    <Card label="C1c-2">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <SquircleGlow sz={40} />
        <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
          <div style={{
            position: "absolute", inset: -12,
            background: `radial-gradient(ellipse, rgba(232,168,124,.28), transparent 70%)`,
            borderRadius: "50%",
          }} />
          <span style={{ fontSize: 52, fontWeight: 800, fontFamily: F, color: P, letterSpacing: -2, lineHeight: 1, position: "relative" }}>Do.</span>
        </div>
        <span style={{ fontSize: 18, fontWeight: 300, fontFamily: F, color: INK, letterSpacing: 5, lineHeight: 1 }}>Yoomi</span>
      </div>
      <Desc>Mini icon above · glow "Do." · Yoomi</Desc>
    </Card>
  );
}

/* C1c-3 · glow "Do." inline + ✓ + "Yoomi" all horizontal */
function C1c3() {
  return (
    <Card label="C1c-3">
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ position: "relative", display: "inline-flex" }}>
          <div style={{
            position: "absolute", inset: -14,
            background: `radial-gradient(ellipse, rgba(232,168,124,.30), transparent 70%)`,
            borderRadius: "50%",
          }} />
          <span style={{ fontSize: 42, fontWeight: 800, fontFamily: F, color: P, letterSpacing: -1.5, lineHeight: 1, position: "relative" }}>Do.</span>
        </div>
        <SageCheck sz={22} solid />
        <span style={{ fontSize: 34, fontWeight: 300, fontFamily: F, color: INK, letterSpacing: 1, lineHeight: 1 }}>Yoomi</span>
      </div>
      <Desc>Horizontal glow "Do." · solid ✓ · Yoomi</Desc>
    </Card>
  );
}

/* ════════════════════════════════════════════
   C2b — "Do" + ✓ (no period) + italic yoomi
   ════════════════════════════════════════════ */

/* C2b-1 · sage ✓ + italic sage "yoomi" */
function C2b1() {
  return (
    <Card label="C2b-1">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
          <span style={{ fontSize: 54, fontWeight: 800, fontFamily: F, color: P, letterSpacing: -2, lineHeight: 1 }}>Do</span>
          <svg width={18} height={40} viewBox="0 0 18 40" style={{ marginBottom: 6 }}>
            <polyline points="3,22 9,30 16,12" stroke={S} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
        <span style={{ fontSize: 22, fontWeight: 300, fontFamily: F, color: S, letterSpacing: 2, fontStyle: "italic", lineHeight: 1 }}>yoomi</span>
      </div>
      <Desc>Sage ✓ · italic sage "yoomi"</Desc>
    </Card>
  );
}

/* C2b-2 · gradient "Do" + amber ✓ + wider italic */
function C2b2() {
  return (
    <Card label="C2b-2">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
          <GradText sz={54}>Do</GradText>
          <svg width={18} height={40} viewBox="0 0 18 40" style={{ marginBottom: 6 }}>
            <polyline points="3,22 9,30 16,12" stroke={A} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
        <span style={{ fontSize: 22, fontWeight: 300, fontFamily: F, color: INK, letterSpacing: 4, fontStyle: "italic", lineHeight: 1 }}>yoomi</span>
      </div>
      <Desc>Gradient "Do" · amber ✓ · tracked italic</Desc>
    </Card>
  );
}

/* C2b-3 · terracotta ✓ + italic + gradient rule */
function C2b3() {
  return (
    <Card label="C2b-3">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
          <span style={{ fontSize: 54, fontWeight: 800, fontFamily: F, color: P, letterSpacing: -2, lineHeight: 1 }}>Do</span>
          <TerracottaCheck sz={22} />
        </div>
        <GradRule w={72} />
        <span style={{ fontSize: 20, fontWeight: 300, fontFamily: F, color: INK, letterSpacing: 3, fontStyle: "italic", lineHeight: 1 }}>yoomi</span>
      </div>
      <Desc>Terracotta ✓ · rule accent · italic</Desc>
    </Card>
  );
}

/* ─── Dark strip ─── */
function DarkStrip() {
  return (
    <div style={{
      background: DARK, borderRadius: 16, padding: "18px 30px",
      display: "flex", gap: 28, flexWrap: "wrap", justifyContent: "center", alignItems: "center",
    }}>
      <span style={{ fontSize: 10, color: S, fontFamily: F, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" as const }}>Dark</span>

      {/* A3b */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <SquircleGlow sz={42} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 22, fontWeight: 800, fontFamily: F,
            background: `linear-gradient(135deg,${A},${P})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: -0.5 }}>Do.</span>
          <span style={{ fontSize: 14, fontWeight: 300, fontFamily: F, color: W, letterSpacing: 1.5 }}>Yoomi</span>
        </div>
      </div>

      <div style={{ width: 1, height: 36, background: "rgba(255,255,255,.10)" }} />

      {/* C1 */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 30, fontWeight: 800, fontFamily: F, color: A, letterSpacing: -1, lineHeight: 1 }}>Do.</span>
        <SageCheck sz={18} solid />
        <span style={{ fontSize: 20, fontWeight: 300, fontFamily: F, color: W, letterSpacing: 3 }}>Yoomi</span>
      </div>

      <div style={{ width: 1, height: 36, background: "rgba(255,255,255,.10)" }} />

      {/* C2b */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 28, fontWeight: 800, fontFamily: F, color: A, letterSpacing: -1, lineHeight: 1 }}>Do</span>
        <svg width={12} height={26} viewBox="0 0 14 30">
          <polyline points="2,16 6,22 12,8" stroke={P} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <span style={{ fontSize: 18, fontWeight: 300, fontFamily: F, color: W, letterSpacing: 2, fontStyle: "italic" }}>yoomi</span>
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function DoYoomiLogo() {
  return (
    <div style={{
      minHeight: "100vh", background: BG,
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 34, padding: "44px 24px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
        <span style={{ fontSize: 11, fontFamily: F, fontWeight: 700, color: P, letterSpacing: 2.5, textTransform: "uppercase" as const }}>
          Do.Yoomi — Final Exploration
        </span>
        <span style={{ fontSize: 12, fontFamily: F, color: "#9B7060" }}>A3b · C1a · C1c · C2b — 3 micro-variants each</span>
      </div>

      <Section title="A3b — Icon + stacked gradient wordmark">
        <A3b1 /><A3b2 /><A3b3 />
      </Section>

      <Section title="C1a — Centered Do. + checkmark + Yoomi">
        <C1a1 /><C1a2 /><C1a3 />
      </Section>

      <Section title="C1c — Amber glow Do. + checkmark + Yoomi">
        <C1c1 /><C1c2 /><C1c3 />
      </Section>

      <Section title="C2b — Do + checkmark (no period) + italic yoomi">
        <C2b1 /><C2b2 /><C2b3 />
      </Section>

      <DarkStrip />

      <p style={{ fontSize: 12, fontFamily: F, color: "#9B7060", textAlign: "center" }}>
        Pick your final — e.g. A3b-1, C1a-3 — to integrate into the app.
      </p>
    </div>
  );
}
