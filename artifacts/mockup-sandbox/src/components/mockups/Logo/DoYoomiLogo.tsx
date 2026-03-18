import React from "react";

/* ═══════════════════════════════════════════════════════
   DO.YOOMI  —  DOODLE STYLE LOGO  v2
   Caveat handwriting font + clean doodle SVG elements
   ═══════════════════════════════════════════════════════ */

const INK   = "#2C1208";
const TERRA = "#C97A5B";
const SAGE  = "#6BAB99";
const AMBER = "#F0B060";
const CREAM = "#FFF8F0";

/* ── 4-point sparkle star ── */
function Sparkle({ x, y, s = 10, color = AMBER }: { x:number; y:number; s?:number; color?:string }) {
  const h = s * 0.4;
  const pts = [
    `${x},${y-s}`, `${x+h},${y-h}`,
    `${x+s},${y}`, `${x+h},${y+h}`,
    `${x},${y+s}`, `${x-h},${y+h}`,
    `${x-s},${y}`, `${x-h},${y-h}`,
  ].join(" ");
  return <polygon points={pts} fill={color} opacity="0.90"/>;
}

/* ── wavy underline ── */
function Wave({ x, y, w }: { x:number; y:number; w:number }) {
  const s = w / 5;
  const d = `M ${x},${y} Q ${x+s*.5},${y-5} ${x+s},${y} Q ${x+s*1.5},${y+5} ${x+s*2},${y} Q ${x+s*2.5},${y-5} ${x+s*3},${y} Q ${x+s*3.5},${y+5} ${x+s*4},${y} Q ${x+s*4.5},${y-5} ${x+s*5},${y}`;
  return <path d={d} stroke={SAGE} strokeWidth="2.5" fill="none" strokeLinecap="round"/>;
}

/* ══════════════════════════════════════════════════════
   DOODLE ICON MARK
   Clean terracotta badge + hand-drawn stroke D + checkmark + dots
   ══════════════════════════════════════════════════════ */
function DoodleMark({ px = 120 }: { px?: number }) {
  return (
    <svg width={px} height={px} viewBox="0 0 200 200" fill="none">
      <defs>
        {/* subtle sketch wobble on strokes only */}
        <filter id="sk" x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="5" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.8"
            xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        {/* drop shadow for badge */}
        <filter id="bs" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="3" dy="4" stdDeviation="5" floodColor={INK} floodOpacity="0.25"/>
        </filter>
        {/* badge gradient */}
        <linearGradient id="bg" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%"  stopColor="#A84830"/>
          <stop offset="100%" stopColor="#D4886A"/>
        </linearGradient>
      </defs>

      {/* badge background — clean, no filter */}
      <rect x="4" y="4" width="192" height="192" rx="44"
        fill="url(#bg)" filter="url(#bs)"/>

      {/* slight inner top highlight */}
      <rect x="4" y="4" width="192" height="96" rx="44"
        fill="rgba(255,255,255,0.10)"/>

      {/* ── D letterform — thick wobbly stroke ── */}
      <path
        d="M 42,30 L 42,162 M 42,30 L 90,30 C 164,30 164,162 90,162 L 42,162"
        stroke={CREAM}
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#sk)"
        opacity="0.96"
      />

      {/* ── Checkmark — two-pass for doodle feel ── */}
      <polyline
        points="54,104 84,136 154,58"
        stroke={SAGE}
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#sk)"
      />
      <polyline
        points="55,106 85,137 153,60"
        stroke="#9ACFC0"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.45"
      />

      {/* ── Two dots (ي) ── */}
      <circle cx="78"  cy="180" r="7.5" fill={CREAM} filter="url(#sk)" opacity="0.92"/>
      <circle cx="104" cy="180" r="7.5" fill={CREAM} filter="url(#sk)" opacity="0.92"/>

      {/* ── Decorative doodle elements ── */}
      <Sparkle x={168} y={26}  s={9}  color={AMBER}/>
      <Sparkle x={24}  y={170} s={5.5} color="rgba(255,255,255,0.55)"/>
    </svg>
  );
}

/* ── Handwritten wordmark ── */
function Word({ light = false, size = 60 }: { light?: boolean; size?: number }) {
  return (
    <div style={{ display:"flex", alignItems:"center", lineHeight:1, gap:0 }}>
      <span style={{
        fontFamily:"'Caveat', cursive",
        fontSize:size, fontWeight:700,
        color: light ? CREAM : INK,
        letterSpacing:-0.5,
      }}>Do</span>
      <span style={{
        fontFamily:"'Caveat', cursive",
        fontSize:size, fontWeight:700,
        color: light ? AMBER : TERRA,
      }}>.</span>
      <span style={{
        fontFamily:"'Caveat', cursive",
        fontSize:size, fontWeight:700,
        color: light ? AMBER : TERRA,
        letterSpacing:-0.5,
      }}>Yoomi</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════ */
export default function DoYoomiLogo() {
  return (
    <div style={{
      minHeight:"100vh",
      background:"radial-gradient(ellipse at 38% 42%, #F5E8D8 0%, #DBBFA0 100%)",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      gap:40, padding:52,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
      `}</style>

      {/* ══ A: Horizontal (main) ══ */}
      <div style={{
        background:CREAM,
        borderRadius:26,
        padding:"26px 42px",
        display:"flex",
        alignItems:"center",
        gap:20,
        boxShadow:`4px 5px 0px rgba(44,18,8,0.20), 0 12px 40px rgba(44,18,8,0.10)`,
        border:`2px solid rgba(44,18,8,0.07)`,
        position:"relative",
        minWidth:500,
      }}>
        <DoodleMark px={96}/>

        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          <Word size={62}/>
          <svg viewBox="0 0 260 16" style={{ width:260, marginTop:0, display:"block" }}>
            <Wave x={0} y={8} w={260}/>
          </svg>
          <span style={{
            fontFamily:"'Caveat', cursive",
            fontSize:18, fontWeight:600,
            color:"#5A9E8C", marginTop:2,
          }}>Daily Productivity ✨</span>
        </div>

        {/* corner sparkle */}
        <svg style={{ position:"absolute", top:10, right:14, display:"block" }}
          width="22" height="22" viewBox="0 0 22 22">
          <Sparkle x={11} y={11} s={9} color={AMBER}/>
        </svg>
      </div>

      {/* ══ B: Stacked ══ */}
      <div style={{
        background:CREAM,
        borderRadius:26,
        padding:"34px 56px",
        display:"flex", flexDirection:"column",
        alignItems:"center", gap:12,
        boxShadow:`4px 5px 0px rgba(44,18,8,0.20), 0 12px 40px rgba(44,18,8,0.10)`,
        border:`2px solid rgba(44,18,8,0.07)`,
        minWidth:500,
      }}>
        <DoodleMark px={114}/>
        <Word size={58}/>
        <span style={{
          fontFamily:"'Caveat', cursive",
          fontSize:20, fontWeight:600,
          color:"#5A9E8C",
        }}>يومي · Daily ✓</span>
      </div>

      {/* ══ C: Dark ══ */}
      <div style={{
        background:`linear-gradient(130deg,${INK} 0%,#3A1008 100%)`,
        borderRadius:26,
        padding:"26px 42px",
        display:"flex", alignItems:"center", gap:20,
        boxShadow:`4px 6px 0px rgba(0,0,0,0.50), 0 20px 60px rgba(44,18,8,0.60)`,
        minWidth:500,
        position:"relative",
      }}>
        {/* dot pattern bg */}
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.06 }} viewBox="0 0 500 130">
          {Array.from({length:10}, (_,c) =>
            Array.from({length:4}, (_,r) =>
              <circle key={`${c}-${r}`} cx={c*56+28} cy={r*40+20} r="2.5" fill="white"/>
            )
          )}
        </svg>

        <DoodleMark px={96}/>
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          <Word size={62} light/>
          <span style={{
            fontFamily:"'Caveat', cursive",
            fontSize:18, fontWeight:600,
            color:SAGE,
          }}>Daily Productivity App ✨</span>
        </div>

        <svg style={{ position:"absolute", top:10, right:14 }}
          width="22" height="22" viewBox="0 0 22 22">
          <Sparkle x={11} y={11} s={9} color={AMBER}/>
        </svg>
      </div>

    </div>
  );
}
