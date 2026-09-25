import { activeSeason, seasonAccentCss } from "@/lib/season/seasons";

/**
 * Applies the active season's accent through CSS variables, so every component
 * picks it up without knowing seasons exist. Renders nothing for the default season.
 */
export function SeasonalTheme() {
  const css = seasonAccentCss(activeSeason());
  return css ? <style data-season={activeSeason().id}>{css}</style> : null;
}
