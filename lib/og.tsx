import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { brand } from "@/lib/brand";

/**
 * Share images for Open Graph (1200×630) and Pinterest (1000×1500, 2:3).
 * Rendered from catalogue and article data, so every page gets an accurate,
 * on-brand image without anyone designing it by hand.
 */

export const ogSize = { width: 1200, height: 630 };
export const pinSize = { width: 1000, height: 1500 };

const fonts = Promise.all([
  readFile(path.join(process.cwd(), "assets/fonts/Geist-Regular.ttf")),
  readFile(path.join(process.cwd(), "assets/fonts/Geist-SemiBold.ttf")),
]).then(([regular, semibold]) => [
  { name: "Geist", data: regular, weight: 400 as const, style: "normal" as const },
  { name: "Geist", data: semibold, weight: 600 as const, style: "normal" as const },
]);

export type ShareCard = {
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Small line at the bottom, e.g. formats or reading time. */
  meta: string;
  tone: [string, string];
  badge?: string;
};

function Mark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" fill="none" stroke="#1f1f1f" strokeOpacity="0.18" strokeWidth="2.4" />
      <path d="M12 3 A9 9 0 1 1 3 12" fill="none" stroke="#1f1f1f" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="5.6" cy="5.6" r="1.7" fill="#3d5c47" />
    </svg>
  );
}

export async function renderShareImage(card: ShareCard, format: "og" | "pin") {
  const pin = format === "pin";
  const size = pin ? pinSize : ogSize;
  const pad = pin ? 80 : 72;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: pad,
          fontFamily: "Geist",
          color: "#1f1f1f",
          backgroundColor: card.tone[0],
          backgroundImage: `linear-gradient(150deg, ${card.tone[0]} 0%, ${card.tone[1]} 100%)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Mark size={pin ? 40 : 34} />
            <span style={{ fontSize: pin ? 30 : 26, fontWeight: 600, letterSpacing: 5 }}>{brand.name}</span>
          </div>
          {card.badge && (
            <span
              style={{
                fontSize: pin ? 24 : 20,
                fontWeight: 600,
                letterSpacing: 3,
                padding: "10px 22px",
                borderRadius: 999,
                background: "#1f1f1f",
                color: "#fafaf8",
              }}
            >
              {card.badge}
            </span>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "#fdfcf8",
            borderRadius: pin ? 36 : 28,
            padding: pin ? "72px 64px" : "48px 52px",
            boxShadow: "0 40px 80px -40px rgba(40,30,20,0.45)",
            ...(pin ? { minHeight: 820 } : {}),
          }}
        >
          <span style={{ fontSize: pin ? 24 : 20, letterSpacing: 5, color: "rgba(31,31,31,0.5)", textTransform: "uppercase" }}>{card.eyebrow}</span>
          <span
            style={{
              marginTop: pin ? 36 : 20,
              fontSize: pin ? (card.title.length > 30 ? 86 : 100) : card.title.length > 34 ? 56 : 66,
              fontWeight: 600,
              lineHeight: 1.02,
              letterSpacing: pin ? -3 : -2,
            }}
          >
            {card.title}
          </span>
          <span style={{ marginTop: pin ? 36 : 20, fontSize: pin ? 38 : 28, lineHeight: 1.35, color: "rgba(31,31,31,0.62)" }}>{card.subtitle}</span>
          {pin && <div style={{ flex: 1 }} />}
          <span style={{ marginTop: pin ? 48 : 28, fontSize: pin ? 24 : 20, letterSpacing: 3, color: "rgba(31,31,31,0.45)", textTransform: "uppercase" }}>
            {card.meta}
          </span>
        </div>

        <span style={{ fontSize: pin ? 30 : 24, color: "rgba(31,31,31,0.6)" }}>{brand.promise}</span>
      </div>
    ),
    { ...size, fonts: await fonts },
  );
}
