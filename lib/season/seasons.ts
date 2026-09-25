/**
 * Seasonal themes. Exactly one is active at a time.
 * A season can recolour the accent, add a quiet decorative mark and change the hero
 * note — components read these values, nothing is hardcoded per season.
 */

export type SeasonId = "default" | "valentines" | "easter" | "back-to-school" | "christmas";

export type Season = {
  id: SeasonId;
  label: string;
  /** Accent overrides for light and dark themes. Omit to keep the MÚRÀ green. */
  accent?: {
    light: { accent: string; soft: string; ink: string };
    dark: { accent: string; soft: string; ink: string };
  };
  /** A short line shown above the hero headline. */
  heroNote?: string;
  /** Small decorative mark rendered by <SeasonalMark />. */
  mark?: "heart" | "leaf" | "star" | "pencil";
};

export const seasons: Record<SeasonId, Season> = {
  default: { id: "default", label: "Default" },
  valentines: {
    id: "valentines",
    label: "Valentine's",
    heroNote: "Be kind to your future self.",
    mark: "heart",
    accent: {
      light: { accent: "#f3e3e3", soft: "#faf3f2", ink: "#8a4b52" },
      dark: { accent: "#2e1f22", soft: "#1d1618", ink: "#e2b4ba" },
    },
  },
  easter: {
    id: "easter",
    label: "Easter",
    heroNote: "A fresh start for the rest of the semester.",
    mark: "leaf",
    accent: {
      light: { accent: "#ecefdc", soft: "#f6f7ee", ink: "#5d6a35" },
      dark: { accent: "#252a1b", soft: "#181b12", ink: "#c7d19e" },
    },
  },
  "back-to-school": {
    id: "back-to-school",
    label: "Back-to-school",
    heroNote: "A new semester. A clear plan.",
    mark: "pencil",
  },
  christmas: {
    id: "christmas",
    label: "Christmas",
    heroNote: "Rest well. Next semester starts prepared.",
    mark: "star",
    accent: {
      light: { accent: "#e2ebe3", soft: "#f2f6f1", ink: "#2f5a43" },
      dark: { accent: "#1a2a20", soft: "#131c16", ink: "#a9cfb4" },
    },
  },
};

/** Set NEXT_PUBLIC_SEASON to switch seasons without a code change. */
export const activeSeasonId: SeasonId = (() => {
  const fromEnv = process.env.NEXT_PUBLIC_SEASON as SeasonId | undefined;
  return fromEnv && fromEnv in seasons ? fromEnv : "default";
})();

export const activeSeason = () => seasons[activeSeasonId];
