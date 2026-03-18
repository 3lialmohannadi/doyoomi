import React from "react";

const INK = "#2C1208";
const F   = "'Inter','Helvetica Neue',sans-serif";

/* ──────────────────────────────────────────────
   F1 — "Ember Check"
   Bold white checkmark on a warm radial glow.
   Dark terracotta edge, bright amber heart.
   ─────────────────────────────────────────────*/
function F1({ sz }: { sz: number }) {
  const id = `f1${sz}`;
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <radialGradient id={`${id}bg`} cx="50%" cy="46%" r="62%">
          <stop offset="0%"  stopColor="#F0A050"/>
          <stop offset="42%" stopColor="#C96A38"/>
          <stop offset="100%" stopColor="#5A1E08"/>
        </radialGradient>
        <filter id={`${id}gl`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect width="100" height="100" rx="22" fill={`url(#${id}bg)`}/>
      <polyline points="13,52 40,77 87,20"
        stroke="rgba(255,215,130,.55)" strokeWidth="20"
        strokeLinecap="round" strokeLinejoin="round"
        filter={`url(#${id}gl)`}/>
      <polyline points="13,52 40,77 87,20"
        stroke="white" strokeWidth="14"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ──────────────────────────────────────────────
   F2 — "First Light"
   Sun rising above horizon. Flat edge at bottom,
   arc curving up. Rays fanning outward above.
   Dark sky background, warm golden sun.
   ─────────────────────────────────────────────*/
function F2({ sz }: { sz: number }) {
  const id = `f2${sz}`;
  /* Sun center at (50,72), radius 26 → horizon line at y=72 */
  const SX = 50, SY = 72, SR = 26;
  /* 5 rays fanning from sun center, pointing UP/OUTWARD above horizon */
  const rayAngles = [-90, -60, -30, -120, -150]; // degrees, -90=up
  const rayStart  = SR + 4;
  const rayEnd    = SR + 22;
  const toRad     = (d: number) => d * Math.PI / 180;
  const rays = rayAngles.map(a => ({
    x1: SX + rayStart * Math.cos(toRad(a)),
    y1: SY + rayStart * Math.sin(toRad(a)),
    x2: SX + rayEnd   * Math.cos(toRad(a)),
    y2: SY + rayEnd   * Math.sin(toRad(a)),
    w:  a === -90 ? 7 : 5.5,
  }));

  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id={`${id}bg`} x1=".5" y1="0" x2=".5" y2="1">
          <stop offset="0%"  stopColor="#0E0704"/>
          <stop offset="70%" stopColor="#2A1206"/>
          <stop offset="100%" stopColor="#3D1A08"/>
        </linearGradient>
        <radialGradient id={`${id}sun`} cx="50%" cy="30%" r="70%">
          <stop offset="0%"  stopColor="#FFD580"/>
          <stop offset="100%" stopColor="#F08030"/>
        </radialGradient>
        <linearGradient id={`${id}ray`} x1=".5" y1="1" x2=".5" y2="0">
          <stop offset="0%" stopColor="#F09040"/>
          <stop offset="100%" stopColor="#FFD580" stopOpacity=".7"/>
        </linearGradient>
        <filter id={`${id}glow`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="9" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect width="100" height="100" rx="22" fill={`url(#${id}bg)`}/>
      {/* Glow halo behind sun */}
      <circle cx={SX} cy={SY} r={SR + 14}
        fill="#F09040" opacity=".14" filter={`url(#${id}glow)`}/>
      {/* Rays */}
      {rays.map((r, i) => (
        <line key={i}
          x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
          stroke={`url(#${id}ray)`} strokeWidth={r.w} strokeLinecap="round"/>
      ))}
      {/* Horizon line */}
      <line x1="8" y1={SY} x2="92" y2={SY}
        stroke="rgba(255,190,80,.18)" strokeWidth="1.5"/>
      {/* Half-circle sun (arc above horizon, flat edge below) */}
      <path d={`M ${SX - SR} ${SY} A ${SR} ${SR} 0 0 1 ${SX + SR} ${SY}`}
        fill={`url(#${id}sun)`}/>
    </svg>
  );
}

/* ──────────────────────────────────────────────
   F3 — "Growth"
   An upward-pointing teardrop (like a sprout or
   a flame) — warm terracotta on dark ink.
   Organic, alive, daily-growth metaphor.
   ─────────────────────────────────────────────*/
function F3({ sz }: { sz: number }) {
  const id = `f3${sz}`;
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      <defs>
        <radialGradient id={`${id}bg`} cx="42%" cy="30%" r="72%">
          <stop offset="0%"  stopColor="#2E1408"/>
          <stop offset="100%" stopColor="#100602"/>
        </radialGradient>
        <linearGradient id={`${id}drop`} x1=".5" y1="0" x2=".5" y2="1">
          <stop offset="0%" stopColor="#E8A87C"/>
          <stop offset="100%" stopColor="#C06030"/>
        </linearGradient>
        <filter id={`${id}sh`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect width="100" height="100" rx="22" fill={`url(#${id}bg)`}/>
      {/* Teardrop pointing upward — like a sprout/flame */}
      <path d="M 50 14 C 72 14 82 34 82 52 C 82 70 68 84 50 84 C 32 84 18 70 18 52 C 18 34 28 14 50 14 Z"
        fill={`url(#${id}drop)`} filter={`url(#${id}sh)`}/>
      {/* White check inside */}
      <polyline points="33,54 46,68 68,38"
        stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ──────────────────────────────────────────────
   Card
   ─────────────────────────────────────────────*/
function Card({ label, name, ar, story, Icon, accent }: {
  label: string; name: string; ar: string; story: string;
  Icon: (p: { sz: number }) => JSX.Element; accent: string;
}) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
      background: "white", borderRadius: 28, padding: "40px 28px 26px",
      minWidth: 220, maxWidth: 240,
      boxShadow: "0 16px 52px rgba(44,18,8,.13), 0 2px 6px rgba(0,0,0,.04)",
      border: "1px solid rgba(201,122,91,.10)", position: "relative",
    }}>
      <div style={{
        position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
        background: accent, color: "white",
        fontFamily: F, fontWeight: 900, fontSize: 13, letterSpacing: 1,
        padding: "5px 18px", borderRadius: 20, whiteSpace: "nowrap",
      }}>{label}</div>

      <div style={{ filter: "drop-shadow(0 14px 30px rgba(44,18,8,.3))" }}>
        <Icon sz={144} />
      </div>

      <div style={{
        display: "flex", gap: 10, alignItems: "flex-end",
        background: "#F6F0EB", borderRadius: 14, padding: "10px 16px",
      }}>
        <Icon sz={60}/><Icon sz={40}/><Icon sz={28}/><Icon sz={18}/>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
          <span style={{ fontSize: 15, fontWeight: 900, fontFamily: F, color: INK }}>{name}</span>
          <span style={{ fontSize: 13, fontFamily: F, color: accent, fontWeight: 700 }}>{ar}</span>
        </div>
        <span style={{ fontSize: 11, fontFamily: F, color: "#9B7060", textAlign: "center", lineHeight: 1.7, maxWidth: 186 }}>{story}</span>
      </div>
    </div>
  );
}

export default function IconFinal3() {
  return (
    <div style={{
      minHeight: "100vh", background: "#EDE5DC",
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 48, padding: "64px 32px 48px",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}`}</style>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 10, fontFamily: F, fontWeight: 800, color: "#C97A5B", letterSpacing: 4, textTransform: "uppercase" as const }}>
          Do.Yoomi · Three Directions
        </span>
        <h1 style={{ fontSize: 32, fontWeight: 900, fontFamily: F, color: INK, letterSpacing: -0.5 }}>
          أختر اتجاهاً واحداً
        </h1>
      </div>

      <div style={{ display: "flex", gap: 28, flexWrap: "wrap" as const, justifyContent: "center" }}>
        <Card label="F1 · الجمر"  name="Ember Check" ar="إنجاز"
          story="Warm radial glow. One bold check. The simplest, most confident icon — nothing else needed."
          Icon={F1} accent="#C96A38"/>
        <Card label="F2 · الفجر"  name="First Light" ar="أول النهار"
          story="A sun rising above the horizon. Rays fanning up. Dark sky turning warm. New day, new start."
          Icon={F2} accent="#3D1A08"/>
        <Card label="F3 · النمو"  name="Growth" ar="نمو"
          story="An upward teardrop — sprout, flame, or water drop. A white check inside. Daily growth from small actions."
          Icon={F3} accent="#7A3520"/>
      </div>

      {/* Dark comparison */}
      <div style={{ background: "#0A0402", borderRadius: 24, padding: "24px 48px", display: "flex", gap: 40, alignItems: "center" }}>
        {([["F1", F1, "#C96A38"], ["F2", F2, "#3D1A08"], ["F3", F3, "#7A3520"]] as const).map(([lbl, Ic, col]) => (
          <div key={lbl} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <Ic sz={70}/>
            <span style={{ fontSize: 10, color: col as string, fontFamily: F, fontWeight: 800, letterSpacing: 1.5 }}>{lbl}</span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12, fontFamily: F, color: "#9B7060", textAlign: "center" as const }}>
        قل F1 أو F2 أو F3 — وسأطبّقه على التطبيق مباشرة.
      </p>
    </div>
  );
}
