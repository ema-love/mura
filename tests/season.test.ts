import { describe, expect, it } from "vitest";
import { activeCampaign, campaigns } from "@/lib/season/campaigns";
import { seasons, seasonAccentCss } from "@/lib/season/seasons";

describe("campaigns", () => {
  const c = campaigns[0];
  const inside = new Date(new Date(c.startsAt).getTime() + 86_400_000);
  const after = new Date(new Date(c.endsAt).getTime() + 86_400_000);

  it("stay off unless switched on", () => {
    expect(activeCampaign(inside, "")).toBeUndefined();
  });
  it("can be switched on by environment, within their dates only", () => {
    expect(activeCampaign(inside, c.id)?.id).toBe(c.id);
    expect(activeCampaign(after, c.id)).toBeUndefined();
  });
  it("never allow a 0% or 100% discount", () => {
    for (const x of campaigns) expect(x.percentOff > 0 && x.percentOff < 100).toBe(true);
  });
});

describe("seasons", () => {
  it("default keeps the MÚRÀ green", () => {
    expect(seasonAccentCss(seasons.default)).toBeNull();
  });
  it("seasonal accents cover light and dark themes", () => {
    const css = seasonAccentCss(seasons.valentines)!;
    expect(css).toContain(":root{--accent:");
    expect(css).toContain(".dark{--accent:");
  });
  it("defines the five required seasons", () => {
    expect(Object.keys(seasons).sort()).toEqual(["back-to-school", "christmas", "default", "easter", "valentines"]);
  });
});
