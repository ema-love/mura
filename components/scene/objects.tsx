"use client";

/**
 * Editorial flat-lay objects, drawn top-down with light entering from the left.
 * Each object is self-contained SVG so it stays crisp at every size and weighs
 * almost nothing compared with photography.
 */
import { useId } from "react";

function useSvgId(prefix: string) {
  return `${prefix}${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
}

type SvgProps = { className?: string };

/* ------------------------------------------------------------------ */
/* Sticky notes                                                        */
/* ------------------------------------------------------------------ */
export function StickyNotes({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <rect x="10" y="10" width="106" height="106" rx="2" fill="#E9E3D2" />
      <rect x="6" y="6" width="106" height="106" rx="2" fill="#F3EEDF" />
      <rect x="0" y="0" width="108" height="108" rx="2" fill="#E2EBE2" />
      <rect x="0" y="0" width="108" height="16" fill="#000" fillOpacity="0.03" />
      <path d="M14 38 c6 -4 10 3 16 0 s8 -4 14 0 s10 2 18 -2" fill="none" stroke="#2B3A30" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
      <path d="M14 56 c8 -3 12 2 20 -1 s8 -2 14 1" fill="none" stroke="#2B3A30" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
      <path d="M14 74 l5 5 9 -11" fill="none" stroke="#2B3A30" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
      <path d="M34 75 c6 -2 10 2 16 0 s8 -2 12 0" fill="none" stroke="#2B3A30" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Mechanical pencil (horizontal)                                      */
/* ------------------------------------------------------------------ */
export function MechanicalPencil({ className }: SvgProps) {
  const id = useSvgId("pen");
  return (
    <svg viewBox="0 0 380 20" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5A5F66" />
          <stop offset="0.45" stopColor="#2C3035" />
          <stop offset="1" stopColor="#1B1D21" />
        </linearGradient>
        <linearGradient id={`${id}m`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2F3F4" />
          <stop offset="0.5" stopColor="#B3B7BC" />
          <stop offset="1" stopColor="#7D8288" />
        </linearGradient>
        <pattern id={`${id}k`} width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="1.4" height="3" fill="#000" fillOpacity="0.28" />
        </pattern>
      </defs>
      <path d="M0 10 L10 8.6 L10 11.4 Z" fill="#3A3D42" />
      <path d="M10 7 L34 4 L34 16 L10 13 Z" fill={`url(#${id}m)`} />
      <rect x="34" y="3" width="70" height="14" fill={`url(#${id}m)`} />
      <rect x="34" y="3" width="70" height="14" fill={`url(#${id}k)`} />
      <rect x="104" y="3" width="240" height="14" fill={`url(#${id}b)`} />
      <rect x="236" y="1" width="80" height="4" rx="2" fill={`url(#${id}m)`} />
      <rect x="344" y="4" width="30" height="12" rx="2" fill={`url(#${id}m)`} />
      <rect x="374" y="5.5" width="6" height="9" rx="2" fill="#2C3035" />
      <rect x="104" y="4.5" width="240" height="1.5" fill="#fff" fillOpacity="0.14" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Headphones                                                          */
/* ------------------------------------------------------------------ */
export function Headphones({ className }: SvgProps) {
  const id = useSvgId("hp");
  return (
    <svg viewBox="0 0 300 250" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}c`} cx="0.38" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#EFEBE3" />
          <stop offset="0.7" stopColor="#D4CEC3" />
          <stop offset="1" stopColor="#BDB6A9" />
        </radialGradient>
        <linearGradient id={`${id}h`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D8D3CA" />
          <stop offset="1" stopColor="#BAB3A6" />
        </linearGradient>
      </defs>
      {/* headband */}
      <path d="M58 150 C58 40 242 40 242 150" fill="none" stroke={`url(#${id}h)`} strokeWidth="22" strokeLinecap="round" />
      <path d="M72 130 C80 62 220 62 228 130" fill="none" stroke="#3A3D42" strokeOpacity="0.28" strokeWidth="10" strokeLinecap="round" />
      <path d="M60 140 C64 60 236 60 240 140" fill="none" stroke="#fff" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
      {/* yokes */}
      <rect x="46" y="134" width="24" height="26" rx="6" fill="#9E978A" />
      <rect x="230" y="134" width="24" height="26" rx="6" fill="#9E978A" />
      {/* ear cups */}
      <ellipse cx="58" cy="192" rx="48" ry="56" fill={`url(#${id}c)`} />
      <ellipse cx="242" cy="192" rx="48" ry="56" fill={`url(#${id}c)`} />
      <ellipse cx="58" cy="192" rx="30" ry="36" fill="none" stroke="#000" strokeOpacity="0.06" strokeWidth="2" />
      <ellipse cx="242" cy="192" rx="30" ry="36" fill="none" stroke="#000" strokeOpacity="0.06" strokeWidth="2" />
      <ellipse cx="44" cy="170" rx="12" ry="16" fill="#fff" fillOpacity="0.35" />
      <ellipse cx="228" cy="170" rx="12" ry="16" fill="#fff" fillOpacity="0.35" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Calculator                                                          */
/* ------------------------------------------------------------------ */
export function Calculator({ className }: SvgProps) {
  const id = useSvgId("calc");
  return (
    <svg viewBox="0 0 150 230" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F4F2EE" />
          <stop offset="1" stopColor="#DAD6CE" />
        </linearGradient>
        <linearGradient id={`${id}d`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C8D3CC" />
          <stop offset="1" stopColor="#AFBDB4" />
        </linearGradient>
      </defs>
      <rect width="150" height="230" rx="14" fill={`url(#${id}b)`} />
      <rect x="4" y="4" width="142" height="222" rx="11" fill="none" stroke="#fff" strokeOpacity="0.6" />
      <rect x="14" y="16" width="122" height="44" rx="5" fill="#2C3035" />
      <rect x="18" y="20" width="114" height="36" rx="3" fill={`url(#${id}d)`} />
      <text x="126" y="47" textAnchor="end" fontFamily="var(--font-geist-mono), monospace" fontSize="20" fill="#26302A" fillOpacity="0.85">
        0.73
      </text>
      {Array.from({ length: 5 }).map((_, r) =>
        Array.from({ length: 4 }).map((_, c) => {
          const accent = r === 4 && c === 3;
          const dark = c === 3 && !accent;
          return (
            <rect
              key={`${r}-${c}`}
              x={14 + c * 31}
              y={74 + r * 30}
              width="26"
              height="22"
              rx="6"
              fill={accent ? "#3D5C47" : dark ? "#6D737A" : "#FFFFFF"}
              stroke="#000"
              strokeOpacity="0.07"
            />
          );
        }),
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Student ID card on a lanyard                                        */
/* ------------------------------------------------------------------ */
export function StudentId({ className }: SvgProps) {
  const id = useSvgId("sid");
  return (
    <svg viewBox="0 0 240 190" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}p`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E8EEF4" />
          <stop offset="1" stopColor="#B9C8D6" />
        </linearGradient>
      </defs>
      {/* lanyard */}
      <path d="M120 44 C120 20 140 6 170 4 L236 4" fill="none" stroke="#2F3A48" strokeWidth="9" strokeLinecap="round" />
      <path d="M120 44 C120 20 140 6 170 4 L236 4" fill="none" stroke="#fff" strokeOpacity="0.12" strokeWidth="2" strokeDasharray="4 5" />
      <rect x="110" y="36" width="20" height="16" rx="4" fill="#A6ACB3" />
      {/* card */}
      <rect x="0" y="44" width="240" height="146" rx="12" fill="#FFFFFF" />
      <rect x="0" y="44" width="240" height="30" rx="12" fill="#1F2622" />
      <rect x="0" y="62" width="240" height="12" fill="#1F2622" />
      <rect x="106" y="52" width="28" height="6" rx="3" fill="#FFFFFF" fillOpacity="0.9" />
      <text x="16" y="64" fontFamily="var(--font-geist-mono), monospace" fontSize="8" letterSpacing="2" fill="#E2EBE2">
        STUDENT
      </text>
      <rect x="16" y="88" width="62" height="78" rx="6" fill={`url(#${id}p)`} />
      <circle cx="47" cy="118" r="14" fill="#fff" fillOpacity="0.7" />
      <path d="M24 166 C26 140 68 140 70 166 Z" fill="#fff" fillOpacity="0.7" />
      <rect x="92" y="92" width="96" height="6" rx="3" fill="#1F1F1F" fillOpacity="0.75" />
      <rect x="92" y="106" width="64" height="4" rx="2" fill="#1F1F1F" fillOpacity="0.3" />
      <rect x="92" y="118" width="80" height="4" rx="2" fill="#1F1F1F" fillOpacity="0.3" />
      {Array.from({ length: 28 }).map((_, i) => (
        <rect key={i} x={92 + i * 4.8} y="140" width={i % 3 === 0 ? 2.6 : 1.4} height="26" fill="#1F1F1F" fillOpacity="0.8" />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Notebook                                                            */
/* ------------------------------------------------------------------ */
export function Notebook({ className }: SvgProps) {
  const id = useSvgId("nb");
  return (
    <svg viewBox="0 0 230 310" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3B4048" />
          <stop offset="1" stopColor="#22252A" />
        </linearGradient>
      </defs>
      {/* ribbon */}
      <path d="M150 300 L150 310 L156 304 L162 310 L162 300 Z" fill="#9DBBA4" />
      <rect x="4" y="3" width="226" height="300" rx="10" fill="#EFEBE2" />
      <rect x="0" y="0" width="224" height="300" rx="10" fill={`url(#${id}c)`} />
      <rect x="0" y="0" width="16" height="300" rx="8" fill="#000" fillOpacity="0.18" />
      <rect x="182" y="0" width="12" height="300" fill="#15171A" />
      <rect x="183" y="0" width="2" height="300" fill="#fff" fillOpacity="0.08" />
      <text x="40" y="264" fontFamily="var(--font-geist-sans), sans-serif" fontWeight="600" fontSize="12" letterSpacing="5" fill="#fff" fillOpacity="0.22">
        MÚRÀ
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Planner — two faces so it can unfold in 3D                           */
/* ------------------------------------------------------------------ */
export function PlannerPage({ side, className }: SvgProps & { side: "left" | "right" }) {
  const id = useSvgId("pl");
  const days = ["MON", "TUE", "WED", "THU", "FRI"];
  return (
    <svg viewBox="0 0 190 250" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}s`} x1={side === "left" ? "1" : "0"} x2={side === "left" ? "0.8" : "0.2"}>
          <stop offset="0" stopColor="#000" stopOpacity="0.14" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="190" height="250" rx="4" fill="#FBF9F4" />
      <rect width="190" height="250" fill={`url(#${id}s)`} />
      {side === "left" ? (
        <g fontFamily="var(--font-geist-mono), monospace" fontSize="7" letterSpacing="1.2" fill="#1F1F1F" fillOpacity="0.45">
          <text x="18" y="26" fontSize="8" fillOpacity="0.7">WEEK 01</text>
          {days.map((d, i) => (
            <g key={d}>
              <text x="18" y={56 + i * 40}>{d}</text>
              <line x1="18" x2="172" y1={64 + i * 40} y2={64 + i * 40} stroke="#1F1F1F" strokeOpacity="0.08" />
              <rect x="52" y={50 + i * 40} width={[80, 60, 96, 44, 70][i]} height="4" rx="2" fill="#3D5C47" fillOpacity={i === 1 ? 0.5 : 0.18} />
            </g>
          ))}
        </g>
      ) : (
        <g>
          <text x="18" y="26" fontFamily="var(--font-geist-mono), monospace" fontSize="8" letterSpacing="1.2" fill="#1F1F1F" fillOpacity="0.7">
            THIS WEEK
          </text>
          {Array.from({ length: 8 }).map((_, i) => (
            <g key={i}>
              <rect x="18" y={46 + i * 24} width="10" height="10" rx="2.5" fill={i < 5 ? "#3D5C47" : "none"} fillOpacity={0.8} stroke="#3D5C47" strokeOpacity="0.5" />
              {i < 5 && <path d={`M20.5 ${51 + i * 24} l2.2 2.2 4 -4.4`} stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" />}
              <rect x="38" y={49 + i * 24} width={[110, 84, 120, 70, 96, 104, 60, 90][i]} height="4" rx="2" fill="#1F1F1F" fillOpacity={i < 5 ? 0.14 : 0.3} />
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}

export function PlannerCover({ className }: SvgProps) {
  const id = useSvgId("pc");
  return (
    <svg viewBox="0 0 190 250" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#CFDBE6" />
          <stop offset="1" stopColor="#AFC1D2" />
        </linearGradient>
        <pattern id={`${id}l`} width="3" height="3" patternUnits="userSpaceOnUse">
          <rect width="3" height="1" fill="#fff" fillOpacity="0.14" />
          <rect width="1" height="3" fill="#000" fillOpacity="0.04" />
        </pattern>
      </defs>
      <rect width="190" height="250" rx="6" fill={`url(#${id}c)`} />
      <rect width="190" height="250" rx="6" fill={`url(#${id}l)`} />
      <text x="24" y="214" fontFamily="var(--font-geist-sans), sans-serif" fontWeight="600" fontSize="14" letterSpacing="-0.3" fill="#1F2622" fillOpacity="0.75">
        Semester
      </text>
      <text x="24" y="230" fontFamily="var(--font-geist-mono), monospace" fontSize="7" letterSpacing="1.6" fill="#1F2622" fillOpacity="0.5">
        PLANNER · 2026
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Laptop — base, outer lid and inner screen                            */
/* ------------------------------------------------------------------ */
export function LaptopBase({ className }: SvgProps) {
  const id = useSvgId("lb");
  return (
    <svg viewBox="0 0 420 290" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E4E6E9" />
          <stop offset="1" stopColor="#B7BBC0" />
        </linearGradient>
      </defs>
      <rect width="420" height="290" rx="16" fill={`url(#${id}a)`} />
      <rect x="0" y="0" width="420" height="8" rx="4" fill="#8E9399" />
      <rect x="30" y="26" width="360" height="148" rx="8" fill="#2A2D32" />
      {Array.from({ length: 6 }).map((_, r) =>
        Array.from({ length: 14 }).map((_, c) => {
          if (r === 5 && c > 3 && c < 10) return null;
          return <rect key={`${r}-${c}`} x={36 + c * 25.2} y={31 + r * 23.6} width="21.5" height="19.5" rx="3.5" fill="#3A3E44" />;
        }),
      )}
      <rect x={36 + 4 * 25.2} y={31 + 5 * 23.6} width={6 * 25.2 - 3.7} height="19.5" rx="3.5" fill="#3A3E44" />
      <rect x="130" y="190" width="160" height="86" rx="9" fill="#000" fillOpacity="0.05" stroke="#000" strokeOpacity="0.06" />
      <rect x="0" y="0" width="420" height="290" rx="16" fill="none" stroke="#fff" strokeOpacity="0.5" />
    </svg>
  );
}

export function LaptopLid({ className }: SvgProps) {
  const id = useSvgId("ll");
  return (
    <svg viewBox="0 0 420 290" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#EDEFF1" />
          <stop offset="0.55" stopColor="#CDD1D5" />
          <stop offset="1" stopColor="#AEB3B9" />
        </linearGradient>
      </defs>
      <rect width="420" height="290" rx="16" fill={`url(#${id}a)`} />
      <circle cx="210" cy="145" r="16" fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="2" />
      <circle cx="210" cy="145" r="16" fill="none" stroke="#000" strokeOpacity="0.06" strokeWidth="1" transform="translate(1 1)" />
      <rect x="0" y="0" width="420" height="290" rx="16" fill="none" stroke="#fff" strokeOpacity="0.55" />
    </svg>
  );
}

export function LaptopScreen({ className }: SvgProps) {
  const id = useSvgId("ls");
  return (
    <svg viewBox="0 0 420 290" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F3F9FF" />
          <stop offset="1" stopColor="#E2EBE2" />
        </linearGradient>
      </defs>
      <rect width="420" height="290" rx="16" fill="#1A1C20" />
      <rect x="14" y="14" width="392" height="262" rx="6" fill={`url(#${id}s)`} />
      {/* the Semester System, open on screen */}
      <text x="30" y="38" fontFamily="var(--font-geist-mono), monospace" fontSize="7" letterSpacing="1.6" fill="#1F1F1F" fillOpacity="0.45">
        MÚRÀ SEMESTER SYSTEM
      </text>
      <text x="30" y="60" fontFamily="var(--font-geist-sans), sans-serif" fontWeight="600" fontSize="16" letterSpacing="-0.4" fill="#1F1F1F" fillOpacity="0.85">
        Week 6 of 14
      </text>
      <rect x="30" y="70" width="360" height="4" rx="2" fill="#1F1F1F" fillOpacity="0.07" />
      <rect x="30" y="70" width="154" height="4" rx="2" fill="#3D5C47" />
      {["MON", "TUE", "WED", "THU", "FRI"].map((d, c) => (
        <g key={d}>
          <text x={34 + c * 72} y="94" fontFamily="var(--font-geist-mono), monospace" fontSize="6" letterSpacing="1" fill="#1F1F1F" fillOpacity="0.45">{d}</text>
          {[0, 1, 2].map((r) =>
            (c + r) % 3 !== 2 ? (
              <rect key={r} x={30 + c * 72} y={102 + r * 34} width="64" height="28" rx="6" fill={(c + r) % 2 ? "#FFFFFF" : "#DCE7DC"} fillOpacity="0.95" />
            ) : null,
          )}
        </g>
      ))}
      <rect x="30" y="212" width="360" height="48" rx="10" fill="#fff" fillOpacity="0.85" />
      <text x="44" y="232" fontFamily="var(--font-geist-sans), sans-serif" fontWeight="500" fontSize="9" fill="#1F1F1F" fillOpacity="0.8">Next deadline · Essay outline</text>
      <text x="44" y="246" fontFamily="var(--font-geist-sans), sans-serif" fontSize="7.5" fill="#1F1F1F" fillOpacity="0.45">Wednesday · Academic Writing</text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Printed weekly timetable                                            */
/* ------------------------------------------------------------------ */
export function PrintedSchedule({ className }: SvgProps) {
  const id = useSvgId("sched");
  const days = ["MON", "TUE", "WED", "THU", "FRI"];
  const blocks: [number, number, number, boolean][] = [
    [0, 0, 2, true], [0, 3, 1, false], [1, 1, 2, true], [2, 0, 1, false],
    [2, 2, 2, true], [3, 1, 1, false], [4, 0, 2, true], [4, 3, 1, false],
  ];
  return (
    <svg viewBox="0 0 250 350" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}p`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFEFB" />
          <stop offset="1" stopColor="#F0EDE5" />
        </linearGradient>
      </defs>
      <rect width="250" height="350" rx="3" fill={`url(#${id}p)`} />
      <text x="24" y="36" fontFamily="var(--font-geist-mono), monospace" fontSize="7" letterSpacing="1.8" fill="#1F1F1F" fillOpacity="0.45">
        MÚRÀ · SEMESTER SYSTEM
      </text>
      <text x="24" y="58" fontFamily="var(--font-geist-sans), sans-serif" fontWeight="600" fontSize="15" letterSpacing="-0.3" fill="#1F1F1F" fillOpacity="0.85">
        Weekly timetable
      </text>
      {days.map((d, i) => (
        <text key={d} x={30 + i * 42} y="86" fontFamily="var(--font-geist-mono), monospace" fontSize="6" letterSpacing="1" fill="#1F1F1F" fillOpacity="0.45">
          {d}
        </text>
      ))}
      {Array.from({ length: 6 }).map((_, r) => (
        <line key={r} x1="24" x2="226" y1={96 + r * 38} y2={96 + r * 38} stroke="#1F1F1F" strokeOpacity="0.06" />
      ))}
      {blocks.map(([d, s0, len, accent], i) => (
        <rect
          key={i}
          x={26 + d * 40}
          y={100 + s0 * 38}
          width="36"
          height={len * 38 - 6}
          rx="5"
          fill={accent ? "#E2EBE2" : "#EFECE5"}
          stroke={accent ? "#3D5C47" : "#1F1F1F"}
          strokeOpacity={accent ? 0.25 : 0.06}
        />
      ))}
      {/* a pencilled note */}
      <path d="M150 318 c8 -10 14 4 22 -2 s10 -8 16 0" fill="none" stroke="#2B3A30" strokeWidth="1.3" strokeLinecap="round" opacity="0.55" />
      <circle cx="136" cy="316" r="3" fill="none" stroke="#2B3A30" strokeOpacity="0.5" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Printed budget sheet                                                */
/* ------------------------------------------------------------------ */
export function BudgetSheet({ className }: SvgProps) {
  const id = useSvgId("budget");
  const rows = [
    ["Rent", "42%"], ["Food", "28%"], ["Transport", "12%"], ["Books", "10%"], ["Savings", "8%"],
  ];
  return (
    <svg viewBox="0 0 260 340" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}p`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FEFDF9" />
          <stop offset="1" stopColor="#EEEBE3" />
        </linearGradient>
      </defs>
      <rect width="260" height="340" rx="3" fill={`url(#${id}p)`} />
      <text x="24" y="36" fontFamily="var(--font-geist-mono), monospace" fontSize="7" letterSpacing="1.8" fill="#1F1F1F" fillOpacity="0.45">
        MÚRÀ · STUDENT BUDGET
      </text>
      <text x="24" y="70" fontFamily="var(--font-geist-sans), sans-serif" fontWeight="600" fontSize="26" letterSpacing="-1" fill="#1F1F1F" fillOpacity="0.85">
        $1,850
      </text>
      <text x="24" y="86" fontFamily="var(--font-geist-sans), sans-serif" fontSize="8" fill="#1F1F1F" fillOpacity="0.45">
        Semester plan
      </text>
      {[0.42, 0.28, 0.12, 0.1, 0.08].reduce<[number, number][]>((acc, v) => {
        const x = acc.length ? acc[acc.length - 1][0] + acc[acc.length - 1][1] : 0;
        return [...acc, [x, v]];
      }, []).map(([x, w], i) => (
        <rect key={i} x={24 + x * 212} y="102" width={w * 212 - 2} height="8" rx="2" fill="#3D5C47" fillOpacity={0.85 - i * 0.16} />
      ))}
      {rows.map(([label, pct], i) => (
        <g key={label} fontFamily="var(--font-geist-sans), sans-serif" fontSize="9" fill="#1F1F1F">
          <text x="24" y={142 + i * 26} fillOpacity="0.55">{label}</text>
          <text x="236" y={142 + i * 26} textAnchor="end" fillOpacity="0.8">{pct}</text>
          <line x1="24" x2="236" y1={150 + i * 26} y2={150 + i * 26} stroke="#1F1F1F" strokeOpacity="0.06" />
        </g>
      ))}
      <path d="M26 300 L60 288 L92 294 L126 276 L160 282 L196 264 L234 270" fill="none" stroke="#3D5C47" strokeOpacity="0.6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Tablet showing the Assignment Command Center                        */
/* ------------------------------------------------------------------ */
export function Tablet({ className }: SvgProps) {
  const id = useSvgId("tab");
  const rows: [string, string, number][] = [
    ["Calculus problem set", "Done", 0],
    ["Lab report: titration", "In progress", 1],
    ["Essay outline", "Not started", 2],
    ["Group presentation", "Not started", 2],
    ["Reading response", "In progress", 1],
  ];
  return (
    <svg viewBox="0 0 280 376" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3A3E44" />
          <stop offset="1" stopColor="#1C1E22" />
        </linearGradient>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FBFBF9" />
          <stop offset="1" stopColor="#EEF2EC" />
        </linearGradient>
      </defs>
      <rect width="280" height="376" rx="24" fill={`url(#${id}b)`} />
      <rect x="12" y="12" width="256" height="352" rx="14" fill={`url(#${id}s)`} />
      <text x="30" y="46" fontFamily="var(--font-geist-mono), monospace" fontSize="6.5" letterSpacing="1.6" fill="#1F1F1F" fillOpacity="0.45">
        ASSIGNMENT COMMAND CENTER
      </text>
      <text x="30" y="70" fontFamily="var(--font-geist-sans), sans-serif" fontWeight="600" fontSize="17" letterSpacing="-0.4" fill="#1F1F1F" fillOpacity="0.85">
        This week
      </text>
      <rect x="30" y="84" width="220" height="4" rx="2" fill="#1F1F1F" fillOpacity="0.07" />
      <rect x="30" y="84" width="88" height="4" rx="2" fill="#3D5C47" />
      {rows.map(([t, status, k], i) => (
        <g key={t} fontFamily="var(--font-geist-sans), sans-serif">
          <rect x="24" y={104 + i * 46} width="232" height="38" rx="10" fill="#FFFFFF" stroke="#1F1F1F" strokeOpacity="0.05" />
          <text x="38" y={121 + i * 46} fontSize="9" fontWeight="500" fill="#1F1F1F" fillOpacity={k === 0 ? 0.45 : 0.85}>{t}</text>
          <text x="38" y={133 + i * 46} fontSize="7" fill="#1F1F1F" fillOpacity="0.4">due {["Mon", "Wed", "Fri", "Fri", "Thu"][i]}</text>
          <rect x={k === 0 ? 212 : k === 1 ? 196 : 194} y={114 + i * 46} width={k === 0 ? 32 : k === 1 ? 48 : 50} height="16" rx="8" fill={k === 0 ? "#1F1F1F" : k === 1 ? "#E2EBE2" : "#FFFFFF"} stroke="#1F1F1F" strokeOpacity={k === 2 ? 0.12 : 0} />
          <text x={k === 0 ? 228 : k === 1 ? 220 : 219} y={125 + i * 46} textAnchor="middle" fontSize="6.5" fontWeight="500" fill={k === 0 ? "#FFFFFF" : k === 1 ? "#3D5C47" : "#6E6E6A"}>{status}</text>
        </g>
      ))}
      <rect x="0" y="0" width="280" height="376" rx="24" fill="none" stroke="#fff" strokeOpacity="0.08" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Phone showing an exam countdown                                     */
/* ------------------------------------------------------------------ */
export function Phone({ className }: SvgProps) {
  const id = useSvgId("ph");
  return (
    <svg viewBox="0 0 100 204" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4A4F57" />
          <stop offset="1" stopColor="#23262B" />
        </linearGradient>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4F7F2" />
          <stop offset="1" stopColor="#E2EBE2" />
        </linearGradient>
      </defs>
      <rect width="100" height="204" rx="18" fill={`url(#${id}b)`} />
      <rect x="5" y="5" width="90" height="194" rx="14" fill={`url(#${id}s)`} />
      <rect x="38" y="10" width="24" height="6" rx="3" fill="#1C1E22" />
      <text x="50" y="52" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="4.6" letterSpacing="1" fill="#1F1F1F" fillOpacity="0.5">
        EXAM COUNTDOWN
      </text>
      <text x="50" y="98" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontWeight="600" fontSize="34" letterSpacing="-2" fill="#1F1F1F" fillOpacity="0.88">
        12
      </text>
      <text x="50" y="110" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="6" fill="#1F1F1F" fillOpacity="0.5">
        days · Statistics
      </text>
      {Array.from({ length: 3 }).map((_, i) => (
        <g key={i}>
          <rect x="14" y={128 + i * 18} width="72" height="12" rx="4" fill="#FFFFFF" fillOpacity="0.85" />
          <rect x="19" y={132 + i * 18} width={[40, 30, 46][i]} height="3" rx="1.5" fill="#1F1F1F" fillOpacity="0.3" />
        </g>
      ))}
      <rect x="0" y="0" width="100" height="204" rx="18" fill="none" stroke="#fff" strokeOpacity="0.1" />
    </svg>
  );
}
