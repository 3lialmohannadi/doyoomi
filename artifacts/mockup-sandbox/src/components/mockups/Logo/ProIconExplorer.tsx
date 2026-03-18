import React from "react";

/* ── Brand tokens ── */
const P   = "#C97A5B";
const PA  = "#9B4D2E";
const PD  = "#7A3520";
const A   = "#E8A87C";
const S   = "#7BAE9E";
const SD  = "#4D9082";
const W   = "#FFFFFF";
const INK = "#2C1208";
const CR  = "#F9F3EE";
const F   = "'Inter','Helvetica Neue',sans-serif";

/* ────────────────────────────────────────────────
   Squircle wrapper (iOS-spec: rx≈22%)
   ─────────────────────────────────────────────── */
function Squircle({ sz, bg, children }: { sz: number; bg: React.ReactNode; children: React.ReactNode }) {
  return (
    <svg width={sz} height={sz} viewBox="0 0 100 100" fill="none">
      {bg}
      {children}
    </svg>
  );
}

/* ══════════════════════════════════════════════
   ICON  P1 — "Y-mark"
   The letter Y as a bold white glyph.
   Y = Yoomi (يومي). Arms open upward like
   hands holding the day / a sprouting plant.
   ══════════════════════════════════════════════ */
function P1({ sz }: { sz: number }) {
  return (
    <Squircle sz={sz} bg={
      <>
        <defs>
          <radialGradient id="p1-bg" cx="38%" cy="32%" r="70%">
            <stop stopColor="#E08860" /><stop offset="1" stopColor={PD} />
          </radialGradient>
        </defs>
        <rect width="100" height="100" rx="22" fill="url(#p1-bg)" />
      </>
    }>
      {/* V top of Y */}
      <path d="M 24 17 L 50 45 L 76 17"
        stroke={W} strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Stem */}
      <line x1="50" y1="45" x2="50" y2="82"
        stroke={W} strokeWidth="15" strokeLinecap="round" />
    </Squircle>
  );
}

/* ══════════════════════════════════════════════
   ICON  P2 — "Radiant Done"
   A pure, oversized checkmark using the entire
   canvas. Warm terracotta stroke + glow on
   light cream. Confident simplicity.
   ══════════════════════════════════════════════ */
function P2({ sz }: { sz: number }) {
  return (
    <Squircle sz={sz} bg={
      <>
        <defs>
          <linearGradient id="p2-bg" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#FDF8F4" /><stop offset="1" stopColor="#F0E4D8" />
          </linearGradient>
          <linearGradient id="p2-ck" x1="0" y1="1" x2="1" y2="0">
            <stop stopColor={PA} /><stop offset=".55" stopColor={P} /><stop offset="1" stopColor={A} />
          </linearGradient>
          <filter id="p2-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width="100" height="100" rx="22" fill="url(#p2-bg)" />
      </>
    }>
      {/* Glow layer */}
      <polyline points="12,50 38,76 88,18"
        stroke={A} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"
        opacity=".45" filter="url(#p2-glow)" />
      {/* Main check */}
      <polyline points="12,50 38,76 88,18"
        stroke="url(#p2-ck)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
    </Squircle>
  );
}

/* ══════════════════════════════════════════════
   ICON  P3 — "Day Star"
   A sun disc (circle + 8 rounded rays). One ray
   replaced by a sage-tinted checkmark. Warm on
   dark ink — premium, symbolic, recognisable.
   ══════════════════════════════════════════════ */
function P3({ sz }: { sz: number }) {
  /* Build 8 rays: skip index 2 (top-right) — replaced by check */
  const rays: React.ReactNode[] = [];
  for (let i = 0; i < 8; i++) {
    if (i === 2) continue;           // skip — check lives here
    const angle = i * 45;
    const rad   = (angle - 90) * Math.PI / 180;
    const cx    = 50 + Math.cos(rad) * 30;
    const cy    = 50 + Math.sin(rad) * 30;
    rays.push(
      <line key={i}
        x1={50 + Math.cos(rad) * 19} y1={50 + Math.sin(rad) * 19}
        x2={cx} y2={cy}
        stroke={W} strokeWidth="6.5" strokeLinecap="round" opacity=".88" />
    );
  }
  return (
    <Squircle sz={sz} bg={
      <>
        <defs>
          <radialGradient id="p3-bg" cx="42%" cy="35%" r="72%">
            <stop stopColor="#3D1A08" /><stop offset="1" stopColor="#1E0C04" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" rx="22" fill="url(#p3-bg)" />
      </>
    }>
      {/* Sun disc */}
      <circle cx="50" cy="50" r="16" fill={A} />
      {/* Rays */}
      {rays}
      {/* Check accent at ray-2 position (45° * 2 = 90° from top = upper-right area) */}
      <polyline points="57,26 63,33 75,18"
        stroke={S} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </Squircle>
  );
}

/* ══════════════════════════════════════════════
   ICON  P4 — "Habit Ring"
   Seven arcs in a ring (one per day). Six arcs
   filled (done), one gap (today). Center: bold
   check. Sage background, very App-Store-ready.
   ══════════════════════════════════════════════ */
function P4({ sz }: { sz: number }) {
  const arcPath = (i: number, total: number, r: number, sw: number) => {
    const slice   = (2 * Math.PI) / total;
    const gap     = 0.12;
    const start   = i * slice - Math.PI / 2 + gap / 2;
    const end     = start + slice - gap;
    const x1 = 50 + r * Math.cos(start);
    const y1 = 50 + r * Math.sin(start);
    const x2 = 50 + r * Math.cos(end);
    const y2 = 50 + r * Math.sin(end);
    return { d: `M ${x1},${y1} A ${r},${r},0,0,1,${x2},${y2}`, x1, y1, x2, y2 };
  };

  const DAYS = 7;
  return (
    <Squircle sz={sz} bg={
      <>
        <defs>
          <linearGradient id="p4-bg" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#5B9A8B" /><stop offset="1" stopColor="#3A7A6E" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" rx="22" fill="url(#p4-bg)" />
      </>
    }>
      {Array.from({ length: DAYS }, (_, i) => {
        const { d } = arcPath(i, DAYS, 34, 8);
        const done  = i < 6;
        return (
          <path key={i} d={d}
            stroke={done ? W : "rgba(255,255,255,.22)"}
            strokeWidth={done ? 8.5 : 5.5}
            strokeLinecap="round" fill="none" />
        );
      })}
      {/* Center check */}
      <polyline points="35,52 46,63 65,38"
        stroke={W} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
    </Squircle>
  );
}

/* ══════════════════════════════════════════════
   ICON  P5 — "Leaf"
   Organic teardrop pointing up. Bold white
   check cut into it. Deep ink bg. Modern &
   alive — growth metaphor for daily habits.
   ══════════════════════════════════════════════ */
function P5({ sz }: { sz: number }) {
  return (
    <Squircle sz={sz} bg={
      <>
        <defs>
          <radialGradient id="p5-bg" cx="35%" cy="28%" r="75%">
            <stop stopColor="#3D2215" /><stop offset="1" stopColor={INK} />
          </radialGradient>
          <linearGradient id="p5-leaf" x1=".5" y1="0" x2=".5" y2="1">
            <stop stopColor={P} /><stop offset="1" stopColor={PA} />
          </linearGradient>
        </defs>
        <rect width="100" height="100" rx="22" fill="url(#p5-bg)" />
      </>
    }>
      {/* Leaf / teardrop */}
      <path d="M 50 14 C 70 14 80 32 80 52 C 80 70 66 84 50 84 C 34 84 20 70 20 52 C 20 32 30 14 50 14 Z"
        fill="url(#p5-leaf)" />
      {/* White check */}
      <polyline points="31,54 44,68 69,38"
        stroke={W} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
    </Squircle>
  );
}

/* ══════════════════════════════════════════════
   ICON  P6 — "Arc Done"
   A thick ¾ circle arc (progress ring with a
   deliberate gap at bottom-right). Inside: a
   bold check. Amber warmth on cream.
   ══════════════════════════════════════════════ */
function P6({ sz }: { sz: number }) {
  /* Arc from 225° to 90° (¾ of circle), going clockwise */
  const r    = 32;
  const toRad = (d: number) => d * Math.PI / 180;
  const sx   = 50 + r * Math.cos(toRad(135));
  const sy   = 50 + r * Math.sin(toRad(135));
  const ex   = 50 + r * Math.cos(toRad(45));
  const ey   = 50 + r * Math.sin(toRad(45));

  return (
    <Squircle sz={sz} bg={
      <>
        <defs>
          <linearGradient id="p6-bg" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#F0E6DA" /><stop offset="1" stopColor="#E4D3C4" />
          </linearGradient>
          <linearGradient id="p6-arc" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor={PA} /><stop offset="1" stopColor={A} />
          </linearGradient>
        </defs>
        <rect width="100" height="100" rx="22" fill="url(#p6-bg)" />
      </>
    }>
      {/* ¾ arc — missing bottom-right quarter */}
      <path
        d={`M ${sx},${sy} A ${r},${r},0,1,1,${ex},${ey}`}
        stroke="url(#p6-arc)" strokeWidth="10" strokeLinecap="round" fill="none" />
      {/* Terracotta check inside */}
      <polyline points="30,52 44,66 70,36"
        stroke={PA} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
    </Squircle>
  );
}

/* ──────────────────────────────────────────────
   Card component
   ─────────────────────────────────────────────*/
type IconFn = (props: { sz: number }) => JSX.Element;

function Card({ id, name, tagline, Icon, note }: {
  id: string; name: string; tagline: string; Icon: IconFn; note: string;
}) {
  return (
    <div style={{
      background: W, borderRadius: 22, padding: "28px 22px 20px",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
      minWidth: 168, maxWidth: 192,
      boxShadow: "0 6px 32px rgba(44,18,8,.10), 0 1px 4px rgba(0,0,0,.05)",
      border: "1px solid rgba(201,122,91,.10)", position: "relative",
    }}>
      {/* ID badge */}
      <div style={{
        position: "absolute", top: -12, left: -8,
        background: INK, color: W, fontFamily: F, fontWeight: 800,
        fontSize: 12, padding: "4px 10px", borderRadius: 20,
      }}>{id}</div>

      {/* Main preview */}
      <div style={{ filter: "drop-shadow(0 8px 20px rgba(44,18,8,.22))" }}>
        <Icon sz={120} />
      </div>

      {/* Scale row */}
      <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
        <Icon sz={56} /><Icon sz={36} /><Icon sz={22} />
      </div>

      {/* Labels */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
        <span style={{ fontSize: 13, fontWeight: 800, fontFamily: F, color: INK }}>{name}</span>
        <span style={{ fontSize: 11, fontFamily: F, color: P, textAlign: "center" }}>{tagline}</span>
        <span style={{ fontSize: 10, fontFamily: F, color: "#9B7060", textAlign: "center", marginTop: 2 }}>{note}</span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Main explorer
   ─────────────────────────────────────────────*/
export default function ProIconExplorer() {
  const icons = [
    { id: "P1", name: "Y-mark", tagline: "Yoomi monogram", Icon: P1, note: "Growth · choice · celebration" },
    { id: "P2", name: "Radiant Done", tagline: "Pure checkmark", Icon: P2, note: "Confidence through simplicity" },
    { id: "P3", name: "Day Star", tagline: "Sun + habit check", Icon: P3, note: "Daily rhythm · achievement" },
    { id: "P4", name: "Habit Ring", tagline: "7-day streak ring", Icon: P4, note: "Week at a glance · done" },
    { id: "P5", name: "Leaf", tagline: "Organic + check", Icon: P5, note: "Growth · alive · daily bloom" },
    { id: "P6", name: "Arc Done", tagline: "Progress arc + ✓", Icon: P6, note: "Progress meets completion" },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: "#F6EFE8",
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 40, padding: "52px 24px 40px",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}`}</style>

      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span style={{
          fontSize: 10, fontFamily: F, fontWeight: 800, color: P,
          letterSpacing: 3, textTransform: "uppercase",
        }}>Do.Yoomi · App Icon · Fresh Start</span>
        <span style={{
          fontSize: 26, fontWeight: 900, fontFamily: F, color: INK, letterSpacing: -0.5,
        }}>6 Original Concepts</span>
        <span style={{ fontSize: 12, fontFamily: F, color: "#9B7060" }}>
          Every icon is new — no recycled shapes
        </span>
      </div>

      {/* Icons grid */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
        {icons.map(ic => <Card key={ic.id} {...ic} />)}
      </div>

      {/* Dark comparison strip */}
      <div style={{
        background: "#16090400", borderRadius: 20,
        display: "flex", flexDirection: "column", gap: 18,
        width: "100%", maxWidth: 840, alignItems: "center",
      }}>
        {/* On dark */}
        <div style={{
          background: INK, borderRadius: 18, width: "100%",
          padding: "20px 24px",
          display: "flex", gap: 0, alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,.35)", fontFamily: F, fontWeight: 700, letterSpacing: 2 }}>
            ON DARK
          </span>
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            {[P1, P2, P3, P4, P5, P6].map((Ic, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <Ic sz={52} />
                <span style={{ fontSize: 9, color: "rgba(255,255,255,.4)", fontFamily: F, fontWeight: 700 }}>
                  P{i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Small sizes row */}
        <div style={{
          background: W, borderRadius: 18, width: "100%",
          padding: "16px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: 10, color: "rgba(44,18,8,.35)", fontFamily: F, fontWeight: 700, letterSpacing: 2 }}>
            16 PX
          </span>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            {[P1, P2, P3, P4, P5, P6].map((Ic, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <Ic sz={16} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <p style={{ fontSize: 11, fontFamily: F, color: "#9B7060", textAlign: "center", maxWidth: 520, lineHeight: 1.6 }}>
        اختر رقماً من P1 إلى P6 — وأطلق لي يدي لأكمله بتفاصيل احترافية كاملة وأطبّقه على التطبيق.
      </p>
    </div>
  );
}
