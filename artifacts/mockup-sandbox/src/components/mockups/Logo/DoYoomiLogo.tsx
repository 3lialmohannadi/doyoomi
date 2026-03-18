import React from "react";

const P  = "#C97A5B";   // primary terracotta
const A  = "#E8A87C";   // amber
const S  = "#7BAE9E";   // sage
const W  = "#FFFFFF";
const INK = "#2C1208";
const BG  = "#FBF7F3";
const DARK = "#1C130C";
const F  = "'Inter','Helvetica Neue',sans-serif";

/* ─── Icon primitives ─── */
function SquircleGlow({ sz = 80 }: { sz?: number }) {
  const r = sz * 0.28;
  return (
    <svg width={sz} height={sz} viewBox="0 0 80 80" fill="none">
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={P} /><stop offset="1" stopColor={A} />
        </linearGradient>
        <filter id="sf">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor={P} floodOpacity=".42" />
        </filter>
        <radialGradient id="sheen" cx="28%" cy="22%" r="55%">
          <stop stopColor="rgba(255,255,255,.22)" /><stop offset="1" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="76" height="76" rx={r} fill="url(#sg)" filter="url(#sf)" />
      <rect x="2" y="2" width="76" height="76" rx={r} fill="url(#sheen)" />
      {/* D letterform */}
      <path d="M 22 18 L 22 62 M 22 18 L 43 18 C 62 18 62 62 43 62 L 22 62"
        stroke={W} strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* floating sage check */}
      <circle cx="60" cy="54" r="13" fill={S} />
      <polyline points="54,54 59,60 68,46"
        stroke={W} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SquircleClean({ sz = 72 }: { sz?: number }) {
  const r = sz * 0.28;
  return (
    <svg width={sz} height={sz} viewBox="0 0 80 80" fill="none">
      <defs>
        <linearGradient id="sc" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={P} /><stop offset="1" stopColor={A} />
        </linearGradient>
        <filter id="scf">
          <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor={P} floodOpacity=".28" />
        </filter>
      </defs>
      <rect x="2" y="2" width="76" height="76" rx={r} fill="url(#sc)" filter="url(#scf)" />
      <path d="M 22 18 L 22 62 M 22 18 L 43 18 C 62 18 62 62 43 62 L 22 62"
        stroke={W} strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <polyline points="34,46 43,57 62,30"
        stroke={S} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   A3 DEEP EXPLORATION
   ════════════════════════════════════════════ */

/* A3a — gradient "Do." right of icon, sage check inside icon (tighter) */
function A3a() {
  return (
    <Card label="A3a">
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        <SquircleGlow sz={72} />
        <div style={{ display:"flex", flexDirection:"column" }}>
          <div style={{ display:"flex", alignItems:"baseline" }}>
            <GradText size={36}>Do.</GradText>
            <span style={{ ...ty, fontSize:36 }}>Yoomi</span>
          </div>
          <Tagline>Daily habits · done.</Tagline>
        </div>
      </div>
      <Desc>Gradient "Do." · check inside icon · tagline</Desc>
    </Card>
  );
}

/* A3b — icon larger, text stacked below (amber "Do.", sage "Yoomi") */
function A3b() {
  return (
    <Card label="A3b">
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        <SquircleGlow sz={80} />
        <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
          <GradText size={40}>Do.</GradText>
          <span style={{ fontSize:26, fontWeight:300, fontFamily:F, color:S, letterSpacing:1.5, lineHeight:1 }}>
            Yoomi
          </span>
        </div>
      </div>
      <Desc>Stacked text · "Yoomi" in sage 300-weight</Desc>
    </Card>
  );
}

/* A3c — icon with amber glow, full gradient wordmark "Do.Yoomi" */
function A3c() {
  return (
    <Card label="A3c">
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        <SquircleGlow sz={68} />
        <span style={{
          fontSize:38,
          fontWeight:900,
          fontFamily:F,
          letterSpacing:-1.5,
          background:`linear-gradient(120deg, ${P} 30%, ${A} 70%, ${S} 100%)`,
          WebkitBackgroundClip:"text",
          WebkitTextFillColor:"transparent",
        }}>Do.Yoomi</span>
      </div>
      <Desc>Full-wordmark gradient P→A→S</Desc>
    </Card>
  );
}

/* A3d — pill card: icon left, "Do." over "Yoomi" right */
function A3d() {
  return (
    <Card label="A3d">
      <div style={{
        display:"flex", alignItems:"center", gap:14,
        background:"rgba(201,122,91,0.06)",
        border:`1.5px solid rgba(201,122,91,0.16)`,
        borderRadius:999,
        padding:"10px 22px 10px 10px",
      }}>
        <SquircleClean sz={54} />
        <div style={{ display:"flex", flexDirection:"column" }}>
          <GradText size={28}>Do.</GradText>
          <span style={{ fontSize:18, fontWeight:300, fontFamily:F, color:INK, letterSpacing:1.5, lineHeight:1 }}>Yoomi</span>
        </div>
      </div>
      <Desc>Warm pill container · icon + stacked wordmark</Desc>
    </Card>
  );
}

/* ════════════════════════════════════════════
   C1 DEEP EXPLORATION
   ════════════════════════════════════════════ */

/* C1a — centered type: "Do." xl + ✓ badge right + "Yoomi" spaced below */
function C1a() {
  return (
    <Card label="C1a">
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ ...td, fontSize:58, letterSpacing:-2 }}>Do.</span>
          <svg width={26} height={26} viewBox="0 0 26 26" fill="none">
            <circle cx="13" cy="13" r="12" fill={S} opacity=".18" />
            <polyline points="6,13 11,18 20,8" stroke={S} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span style={{ fontSize:22, fontWeight:300, fontFamily:F, color:INK, letterSpacing:5 }}>Yoomi</span>
      </div>
      <Desc>Centered · "Do." 58px · spaced "Yoomi"</Desc>
    </Card>
  );
}

/* C1b — "Do. Yoomi" inline with ✓ solid sage in between */
function C1b() {
  return (
    <Card label="C1b">
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ ...td, fontSize:46 }}>Do</span>
        <svg width={32} height={32} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="15" fill={S} />
          <polyline points="7,16 13,22 25,10" stroke={W} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize:40, fontWeight:300, fontFamily:F, color:INK, letterSpacing:-0.5 }}>Yoomi</span>
      </div>
      <Desc>Inline · solid sage ✓ disc between words</Desc>
    </Card>
  );
}

/* C1c — warm blob behind "Do.", floating feel */
function C1c() {
  return (
    <Card label="C1c">
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
        <div style={{ position:"relative", display:"inline-flex", alignItems:"center" }}>
          <div style={{
            position:"absolute", inset:-10,
            background:`radial-gradient(ellipse, rgba(232,168,124,.28), transparent 70%)`,
            borderRadius:"50%",
          }} />
          <span style={{ ...td, fontSize:60, letterSpacing:-2, position:"relative" }}>Do.</span>
        </div>
        <svg width={20} height={12} viewBox="0 0 20 12">
          <polyline points="2,6 8,10 18,2" stroke={S} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <span style={{ fontSize:20, fontWeight:300, fontFamily:F, color:INK, letterSpacing:5 }}>Yoomi</span>
      </div>
      <Desc>Warm amber glow · "Do." luminous</Desc>
    </Card>
  );
}

/* C1d — "Do." with ✓ in terracotta tone, "Yoomi" in sage */
function C1d() {
  return (
    <Card label="C1d">
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ ...td, fontSize:52, letterSpacing:-2 }}>Do.</span>
          <svg width={26} height={26} viewBox="0 0 26 26" fill="none">
            <circle cx="13" cy="13" r="12" fill={A} opacity=".22" />
            <polyline points="6,13 11,18 20,8" stroke={P} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span style={{ fontSize:22, fontWeight:400, fontFamily:F, color:S, letterSpacing:4 }}>Yoomi</span>
      </div>
      <Desc>Terracotta ✓ · sage "Yoomi" 400-weight</Desc>
    </Card>
  );
}

/* ════════════════════════════════════════════
   C2 DEEP EXPLORATION
   ════════════════════════════════════════════ */

/* C2a — "Do" + ✓ inline + rule + tracked "YOOMI" (refined) */
function C2a() {
  return (
    <Card label="C2a">
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
        <div style={{ display:"flex", alignItems:"flex-end", gap:2 }}>
          <span style={{ ...td, fontSize:54, letterSpacing:-2 }}>Do</span>
          <svg width={18} height={40} viewBox="0 0 18 40" style={{ marginBottom:6 }}>
            <polyline points="3,22 9,30 16,12"
              stroke={S} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
        <div style={{ width:96, height:2, background:`linear-gradient(90deg, ${P}, ${A})`, borderRadius:1 }} />
        <span style={{ fontSize:18, fontWeight:600, fontFamily:F, color:INK, letterSpacing:6 }}>YOOMI</span>
      </div>
      <Desc>✓ replaces period · gradient rule · tracked caps</Desc>
    </Card>
  );
}

/* C2b — terracotta ✓ (not sage), "yoomi" italic lowercase */
function C2b() {
  return (
    <Card label="C2b">
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
        <div style={{ display:"flex", alignItems:"flex-end", gap:2 }}>
          <span style={{ ...td, fontSize:54, letterSpacing:-2 }}>Do</span>
          <svg width={18} height={40} viewBox="0 0 18 40" style={{ marginBottom:6 }}>
            <polyline points="3,22 9,30 16,12"
              stroke={P} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
        <span style={{ fontSize:22, fontWeight:300, fontFamily:F, color:INK, fontStyle:"italic", letterSpacing:2 }}>
          yoomi
        </span>
      </div>
      <Desc>Terracotta ✓ · italic lowercase "yoomi"</Desc>
    </Card>
  );
}

/* C2c — squircle mini replaces dot (D + tiny squircle + "Yoomi") */
function C2c() {
  return (
    <Card label="C2c">
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
          <span style={{ ...td, fontSize:54, letterSpacing:-2 }}>Do</span>
          <svg width={22} height={22} viewBox="0 0 80 80" fill="none" style={{ marginBottom:-2 }}>
            <defs>
              <linearGradient id="mini" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor={P} /><stop offset="1" stopColor={A} />
              </linearGradient>
            </defs>
            <rect x="4" y="4" width="72" height="72" rx="22" fill="url(#mini)" />
            <polyline points="22,44 38,58 62,28" stroke={W} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span style={{ fontSize:20, fontWeight:300, fontFamily:F, color:INK, letterSpacing:4 }}>Yoomi</span>
      </div>
      <Desc>Mini squircle replaces period · icon-dot fusion</Desc>
    </Card>
  );
}

/* C2d — gradient "Do✓" all same size, "Yoomi" below in sage */
function C2d() {
  return (
    <Card label="C2d">
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
        <div style={{ display:"flex", alignItems:"center", gap:0 }}>
          <span style={{
            fontSize:54,
            fontWeight:900,
            fontFamily:F,
            letterSpacing:-2,
            background:`linear-gradient(135deg, ${P}, ${A})`,
            WebkitBackgroundClip:"text",
            WebkitTextFillColor:"transparent",
          }}>Do</span>
          <svg width={36} height={54} viewBox="0 0 36 54">
            <polyline points="6,30 15,42 30,16"
              stroke={S} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
        <span style={{ fontSize:18, fontWeight:300, fontFamily:F, color:S, letterSpacing:5 }}>Yoomi</span>
      </div>
      <Desc>Gradient "Do" + large sage ✓ · "Yoomi" sage</Desc>
    </Card>
  );
}

/* ─── Shared helpers ─── */
function GradText({ size, children }: { size: number; children: React.ReactNode }) {
  return (
    <span style={{
      fontSize: size,
      fontWeight: 800,
      fontFamily: F,
      letterSpacing: -1,
      lineHeight: 1,
      background: `linear-gradient(135deg, ${P}, ${A})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}>{children}</span>
  );
}
function Tagline({ children }: { children: React.ReactNode }) {
  return <span style={{ fontSize:10, fontFamily:F, color:S, fontWeight:600, letterSpacing:2, textTransform:"uppercase" as const }}>{children}</span>;
}
function Desc({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize:11, fontFamily:F, color:S, fontWeight:500, margin:0, textAlign:"center" }}>{children}</p>;
}
function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      position:"relative",
      background:W,
      borderRadius:20,
      padding:"28px 24px 18px",
      display:"flex",
      flexDirection:"column",
      alignItems:"center",
      gap:14,
      boxShadow:"0 4px 24px rgba(201,122,91,0.12),0 1px 3px rgba(0,0,0,0.05)",
      border:"1.5px solid rgba(201,122,91,0.10)",
      minWidth:210,
    }}>
      <div style={{
        position:"absolute", top:-10, left:-10,
        background:P, color:W, fontSize:11, fontWeight:700, fontFamily:F,
        padding:"3px 8px", borderRadius:20,
        boxShadow:"0 2px 8px rgba(201,122,91,0.35)",
      }}>{label}</div>
      {children}
    </div>
  );
}

const td: React.CSSProperties = { fontFamily:F, fontWeight:800, color:P, letterSpacing:-1, lineHeight:1 };
const ty: React.CSSProperties = { fontFamily:F, fontWeight:400, color:INK, letterSpacing:-0.5, lineHeight:1 };

/* ─── Dark strip ─── */
function DarkStrip() {
  return (
    <div style={{
      background:DARK, borderRadius:16, padding:"20px 32px",
      display:"flex", gap:28, flexWrap:"wrap", justifyContent:"center", alignItems:"center",
    }}>
      <span style={{ fontSize:10, color:S, fontFamily:F, fontWeight:700, letterSpacing:2, textTransform:"uppercase" as const }}>Dark bg</span>
      {/* A3 on dark */}
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <SquircleGlow sz={44} />
        <div style={{ display:"flex", flexDirection:"column" }}>
          <span style={{ fontSize:22, fontWeight:800, fontFamily:F, letterSpacing:-0.5,
            background:`linear-gradient(135deg,${A},${P})`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Do.</span>
          <span style={{ fontSize:14, fontWeight:300, fontFamily:F, color:W, letterSpacing:1 }}>Yoomi</span>
        </div>
      </div>
      <div style={{ width:1, height:40, background:"rgba(255,255,255,0.10)" }} />
      {/* C1 on dark */}
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ ...td, fontSize:30, color:A }}>Do.</span>
        <svg width={20} height={20} viewBox="0 0 26 26" fill="none">
          <circle cx="13" cy="13" r="12" fill={S} opacity=".25" />
          <polyline points="6,13 11,18 20,8" stroke={S} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize:22, fontWeight:300, fontFamily:F, color:W, letterSpacing:3 }}>Yoomi</span>
      </div>
      <div style={{ width:1, height:40, background:"rgba(255,255,255,0.10)" }} />
      {/* C2 on dark */}
      <div style={{ display:"flex", alignItems:"center", gap:3 }}>
        <span style={{ ...td, fontSize:30, color:A }}>Do</span>
        <svg width={14} height={30} viewBox="0 0 14 30">
          <polyline points="2,16 6,22 12,8" stroke={S} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <span style={{ fontSize:22, fontWeight:300, fontFamily:F, color:W, letterSpacing:2 }}> Yoomi</span>
      </div>
    </div>
  );
}

/* ─── Page ─── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14, width:"100%" }}>
      <span style={{
        fontSize:11, fontFamily:F, fontWeight:700, color:"#9B7060",
        letterSpacing:2, textTransform:"uppercase" as const,
      }}>{title}</span>
      <div style={{ display:"flex", gap:18, flexWrap:"wrap", justifyContent:"center" }}>
        {children}
      </div>
    </div>
  );
}

export default function DoYoomiLogo() {
  return (
    <div style={{
      minHeight:"100vh", background:BG,
      display:"flex", flexDirection:"column", alignItems:"center",
      gap:36, padding:"44px 28px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
      `}</style>

      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
        <span style={{ fontSize:11, fontFamily:F, fontWeight:700, color:P, letterSpacing:2.5, textTransform:"uppercase" as const }}>
          Do.Yoomi — Deep Exploration
        </span>
        <span style={{ fontSize:12, fontFamily:F, color:"#9B7060" }}>A3 · C1 · C2 — 4 variants each</span>
      </div>

      <Section title="A3 — Gradient icon + wordmark">
        <A3a /><A3b /><A3c /><A3d />
      </Section>

      <Section title={'C1 — "Do." bold + checkmark + light Yoomi'}>
        <C1a /><C1b /><C1c /><C1d />
      </Section>

      <Section title="C2 — checkmark replaces the period">
        <C2a /><C2b /><C2c /><C2d />
      </Section>

      <DarkStrip />

      <p style={{ fontSize:12, fontFamily:F, color:"#9B7060", textAlign:"center" }}>
        Pick a code (e.g. A3b, C1c) to finalize and integrate into the app.
      </p>
    </div>
  );
}
