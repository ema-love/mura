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
/* Admission letter                                                    */
/* ------------------------------------------------------------------ */
export function AdmissionLetter({ className }: SvgProps) {
  const id = useSvgId("letter");
  return (
    <svg viewBox="0 0 250 350" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}p`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFEFB" />
          <stop offset="1" stopColor="#F1EEE7" />
        </linearGradient>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.06" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="250" height="350" rx="3" fill={`url(#${id}p)`} />
      {/* fold creases — the letter was folded in thirds and opened again */}
      <rect y="116" width="250" height="16" fill={`url(#${id}f)`} />
      <rect y="233" width="250" height="16" fill={`url(#${id}f)`} />
      <line x1="0" x2="250" y1="116.5" y2="116.5" stroke="#000" strokeOpacity="0.07" />
      <line x1="0" x2="250" y1="233.5" y2="233.5" stroke="#000" strokeOpacity="0.07" />
      {/* crest */}
      <circle cx="125" cy="38" r="15" fill="none" stroke="#36597D" strokeOpacity="0.55" strokeWidth="1.2" />
      <circle cx="125" cy="38" r="10" fill="#DCEEFF" />
      <path d="M119 40 l6-8 6 8z" fill="#36597D" fillOpacity="0.6" />
      <rect x="85" y="62" width="80" height="3" rx="1.5" fill="#1F1F1F" fillOpacity="0.55" />
      <rect x="100" y="70" width="50" height="2" rx="1" fill="#1F1F1F" fillOpacity="0.25" />
      <text x="28" y="98" fontFamily="var(--font-geist-mono), monospace" fontSize="7" letterSpacing="1.6" fill="#1F1F1F" fillOpacity="0.7">
        OFFER OF ADMISSION
      </text>
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x="28" y={140 + i * 10} width={i % 4 === 3 ? 120 : 194} height="2.4" rx="1.2" fill="#1F1F1F" fillOpacity="0.16" />
      ))}
      <path d="M30 290 c10 -14 18 6 26 -4 s12 -12 18 0 s10 4 22 -6" fill="none" stroke="#2A3B55" strokeWidth="1.4" strokeLinecap="round" opacity="0.75" />
      <rect x="28" y="304" width="70" height="2" rx="1" fill="#1F1F1F" fillOpacity="0.2" />
      <circle cx="196" cy="296" r="20" fill="#36597D" fillOpacity="0.08" />
      <circle cx="196" cy="296" r="20" fill="none" stroke="#36597D" strokeOpacity="0.35" strokeDasharray="2 3" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Sticky notes                                                        */
/* ------------------------------------------------------------------ */
export function StickyNotes({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <rect x="10" y="10" width="106" height="106" rx="2" fill="#E9E3D2" />
      <rect x="6" y="6" width="106" height="106" rx="2" fill="#F3EEDF" />
      <rect x="0" y="0" width="108" height="108" rx="2" fill="#DCEEFF" />
      <rect x="0" y="0" width="108" height="16" fill="#000" fillOpacity="0.03" />
      <path d="M14 38 c6 -4 10 3 16 0 s8 -4 14 0 s10 2 18 -2" fill="none" stroke="#2A3B55" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
      <path d="M14 56 c8 -3 12 2 20 -1 s8 -2 14 1" fill="none" stroke="#2A3B55" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
      <path d="M14 74 l5 5 9 -11" fill="none" stroke="#2A3B55" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
      <path d="M34 75 c6 -2 10 2 16 0 s8 -2 12 0" fill="none" stroke="#2A3B55" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* USB drive                                                           */
/* ------------------------------------------------------------------ */
export function UsbDrive({ className }: SvgProps) {
  const id = useSvgId("usb");
  return (
    <svg viewBox="0 0 44 110" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}m`} x1="0" x2="1">
          <stop offset="0" stopColor="#E8EAEC" />
          <stop offset="0.5" stopColor="#B9BDC2" />
          <stop offset="1" stopColor="#8E9399" />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="0" x2="1">
          <stop offset="0" stopColor="#4A5058" />
          <stop offset="1" stopColor="#2C3036" />
        </linearGradient>
      </defs>
      <rect x="10" y="0" width="24" height="30" rx="2" fill={`url(#${id}m)`} />
      <rect x="15" y="7" width="5" height="5" rx="1" fill="#6B7076" />
      <rect x="24" y="7" width="5" height="5" rx="1" fill="#6B7076" />
      <rect x="4" y="26" width="36" height="84" rx="8" fill={`url(#${id}b)`} />
      <circle cx="22" cy="96" r="4" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="2" />
      <rect x="8" y="32" width="3" height="60" rx="1.5" fill="#fff" fillOpacity="0.08" />
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
              fill={accent ? "#36597D" : dark ? "#6D737A" : "#FFFFFF"}
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
/* Water bottle (lying horizontally)                                   */
/* ------------------------------------------------------------------ */
export function WaterBottle({ className }: SvgProps) {
  const id = useSvgId("bottle");
  return (
    <svg viewBox="0 0 340 96" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C3D2DF" />
          <stop offset="0.3" stopColor="#E3ECF4" />
          <stop offset="0.55" stopColor="#A9BCCD" />
          <stop offset="1" stopColor="#7D93A7" />
        </linearGradient>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5B6068" />
          <stop offset="0.35" stopColor="#8A9098" />
          <stop offset="1" stopColor="#2F3338" />
        </linearGradient>
      </defs>
      <rect x="0" y="6" width="270" height="84" rx="30" fill={`url(#${id}b)`} />
      <path d="M268 14 C284 18 290 26 292 30 L292 66 C290 70 284 78 268 82 Z" fill={`url(#${id}b)`} />
      <rect x="290" y="22" width="50" height="52" rx="10" fill={`url(#${id}c)`} />
      <rect x="318" y="30" width="14" height="36" rx="7" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="2" />
      <rect x="16" y="24" width="230" height="4" rx="2" fill="#fff" fillOpacity="0.55" />
      <text x="130" y="62" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontWeight="600" fontSize="11" letterSpacing="4" fill="#1F2A36" fillOpacity="0.35">
        MÚRÀ
      </text>
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
      <rect x="0" y="44" width="240" height="30" rx="12" fill="#1F2A36" />
      <rect x="0" y="62" width="240" height="12" fill="#1F2A36" />
      <rect x="106" y="52" width="28" height="6" rx="3" fill="#FFFFFF" fillOpacity="0.9" />
      <text x="16" y="64" fontFamily="var(--font-geist-mono), monospace" fontSize="8" letterSpacing="2" fill="#DCEEFF">
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
      <path d="M150 300 L150 310 L156 304 L162 310 L162 300 Z" fill="#9DB8D6" />
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
              <rect x="52" y={50 + i * 40} width={[80, 60, 96, 44, 70][i]} height="4" rx="2" fill="#36597D" fillOpacity={i === 1 ? 0.5 : 0.18} />
            </g>
          ))}
        </g>
      ) : (
        <g>
          <text x="18" y="26" fontFamily="var(--font-geist-mono), monospace" fontSize="8" letterSpacing="1.2" fill="#1F1F1F" fillOpacity="0.7">
            BEFORE RESUMPTION
          </text>
          {Array.from({ length: 8 }).map((_, i) => (
            <g key={i}>
              <rect x="18" y={46 + i * 24} width="10" height="10" rx="2.5" fill={i < 5 ? "#36597D" : "none"} fillOpacity={0.8} stroke="#36597D" strokeOpacity="0.5" />
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
      <text x="24" y="214" fontFamily="var(--font-geist-sans), sans-serif" fontWeight="600" fontSize="14" letterSpacing="-0.3" fill="#1F2A36" fillOpacity="0.75">
        Semester
      </text>
      <text x="24" y="230" fontFamily="var(--font-geist-mono), monospace" fontSize="7" letterSpacing="1.6" fill="#1F2A36" fillOpacity="0.5">
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
          <stop offset="1" stopColor="#DCEEFF" />
        </linearGradient>
      </defs>
      <rect width="420" height="290" rx="16" fill="#1A1C20" />
      <rect x="14" y="14" width="392" height="262" rx="6" fill={`url(#${id}s)`} />
      {/* a tiny MÚRÀ dashboard on the screen */}
      <rect x="30" y="30" width="80" height="6" rx="3" fill="#1F1F1F" fillOpacity="0.7" />
      <rect x="30" y="44" width="50" height="4" rx="2" fill="#1F1F1F" fillOpacity="0.25" />
      <circle cx="80" cy="130" r="40" fill="none" stroke="#fff" strokeWidth="10" />
      <circle cx="80" cy="130" r="40" fill="none" stroke="#36597D" strokeWidth="10" strokeLinecap="round" strokeDasharray="251" strokeDashoffset="43" transform="rotate(-90 80 130)" />
      {Array.from({ length: 5 }).map((_, i) => (
        <g key={i}>
          <rect x="150" y={92 + i * 18} width="10" height="10" rx="3" fill={i < 3 ? "#36597D" : "#fff"} stroke="#36597D" strokeOpacity="0.3" />
          <rect x="168" y={95 + i * 18} width={[140, 100, 160, 120, 90][i]} height="4" rx="2" fill="#1F1F1F" fillOpacity={i < 3 ? 0.2 : 0.45} />
        </g>
      ))}
      <rect x="30" y="206" width="360" height="52" rx="10" fill="#fff" fillOpacity="0.8" />
      <rect x="44" y="224" width="140" height="5" rx="2.5" fill="#1F1F1F" fillOpacity="0.5" />
      <rect x="44" y="236" width="90" height="4" rx="2" fill="#1F1F1F" fillOpacity="0.2" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Backpack                                                            */
/* ------------------------------------------------------------------ */
export function Backpack({ className }: SvgProps) {
  const id = useSvgId("bp");
  return (
    <svg viewBox="0 0 320 430" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6E7680" />
          <stop offset="0.5" stopColor="#555C65" />
          <stop offset="1" stopColor="#3F454D" />
        </linearGradient>
        <linearGradient id={`${id}p`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7A838D" />
          <stop offset="1" stopColor="#4B525A" />
        </linearGradient>
        <linearGradient id={`${id}l`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#B88A62" />
          <stop offset="1" stopColor="#8A5E3C" />
        </linearGradient>
        <pattern id={`${id}w`} width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="2" fill="#fff" fillOpacity="0.03" />
          <rect width="2" height="4" fill="#000" fillOpacity="0.035" />
        </pattern>
      </defs>
      {/* top handle */}
      <path d="M130 40 C130 6 190 6 190 40" fill="none" stroke="#353A41" strokeWidth="12" strokeLinecap="round" />
      {/* body */}
      <path d="M40 60 C40 36 70 24 160 24 C250 24 280 36 280 60 L292 390 C292 414 272 426 250 426 L70 426 C48 426 28 414 28 390 Z" fill={`url(#${id}f)`} />
      <path d="M40 60 C40 36 70 24 160 24 C250 24 280 36 280 60 L292 390 C292 414 272 426 250 426 L70 426 C48 426 28 414 28 390 Z" fill={`url(#${id}w)`} />
      {/* top zip arc */}
      <path d="M58 92 C80 56 240 56 262 92" fill="none" stroke="#2B2F35" strokeWidth="5" strokeLinecap="round" />
      <path d="M58 92 C80 56 240 56 262 92" fill="none" stroke="#fff" strokeOpacity="0.14" strokeWidth="1" strokeDasharray="2 2" />
      <rect x="244" y="80" width="12" height="26" rx="5" fill={`url(#${id}l)`} transform="rotate(30 250 93)" />
      {/* front pocket */}
      <path d="M62 220 C62 206 72 200 90 200 L230 200 C248 200 258 206 258 220 L262 380 C262 396 250 404 234 404 L86 404 C70 404 58 396 58 380 Z" fill={`url(#${id}p)`} />
      <path d="M62 220 C62 206 72 200 90 200 L230 200 C248 200 258 206 258 220 L262 380 C262 396 250 404 234 404 L86 404 C70 404 58 396 58 380 Z" fill="none" stroke="#fff" strokeOpacity="0.14" strokeDasharray="3 4" transform="translate(0 0)" />
      <line x1="78" x2="242" y1="224" y2="224" stroke="#2B2F35" strokeWidth="4" strokeLinecap="round" />
      <rect x="226" y="218" width="26" height="12" rx="5" fill={`url(#${id}l)`} />
      {/* leather tab */}
      <rect x="140" y="130" width="40" height="46" rx="8" fill={`url(#${id}l)`} />
      <rect x="146" y="136" width="28" height="34" rx="5" fill="none" stroke="#fff" strokeOpacity="0.25" strokeDasharray="2 2" />
      {/* light from the left */}
      <path d="M40 60 L28 390 C28 400 30 410 36 416 L60 60 Z" fill="#fff" fillOpacity="0.08" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Folded hoodie                                                       */
/* ------------------------------------------------------------------ */
export function FoldedHoodie({ className }: SvgProps) {
  const id = useSvgId("hd");
  return (
    <svg viewBox="0 0 280 320" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E6E1D7" />
          <stop offset="1" stopColor="#C9C1B2" />
        </linearGradient>
        <pattern id={`${id}k`} width="3" height="5" patternUnits="userSpaceOnUse">
          <rect width="1.2" height="5" fill="#000" fillOpacity="0.07" />
        </pattern>
      </defs>
      <rect width="280" height="320" rx="18" fill={`url(#${id}f)`} />
      {/* hood fold */}
      <path d="M40 0 L240 0 L240 60 C200 96 80 96 40 60 Z" fill="#000" fillOpacity="0.05" />
      <path d="M40 60 C80 96 200 96 240 60" fill="none" stroke="#000" strokeOpacity="0.1" strokeWidth="2" />
      {/* drawstrings */}
      <path d="M118 78 C114 120 112 150 116 186" fill="none" stroke="#F7F4EE" strokeWidth="5" strokeLinecap="round" />
      <path d="M162 78 C166 124 170 150 164 196" fill="none" stroke="#F7F4EE" strokeWidth="5" strokeLinecap="round" />
      <rect x="112" y="184" width="8" height="16" rx="3" fill="#9BA3AC" />
      <rect x="160" y="194" width="8" height="16" rx="3" fill="#9BA3AC" />
      {/* sleeve folds */}
      <path d="M18 120 L18 300" stroke="#000" strokeOpacity="0.07" strokeWidth="3" />
      <path d="M262 120 L262 300" stroke="#000" strokeOpacity="0.07" strokeWidth="3" />
      {/* ribbed hem */}
      <rect x="0" y="276" width="280" height="44" rx="0" fill={`url(#${id}k)`} />
      <path d="M0 276 L280 276" stroke="#000" strokeOpacity="0.08" strokeWidth="2" />
      <rect width="280" height="320" rx="18" fill="none" stroke="#fff" strokeOpacity="0.35" />
    </svg>
  );
}
