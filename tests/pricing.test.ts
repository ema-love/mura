import { describe, expect, it, vi } from "vitest";
import type { Product } from "@/lib/catalog/types";

const base: Product = {
  id: "t",
  slug: "t",
  name: "Test",
  kind: "digital",
  type: "system",
  category: "academic-systems",
  status: "published",
  pricing: { model: "paid", amount: 1200 },
  tagline: "",
  summary: "",
  problem: "",
  audience: [],
  includes: [],
  formats: ["PDF"],
  howItWorks: [],
  previews: [],
};

describe("resolvePrice", () => {
  it("returns free, pending and paid correctly", async () => {
    const { resolvePrice } = await import("@/lib/commerce/pricing");
    expect(resolvePrice({ ...base, pricing: { model: "free" } })).toEqual({ model: "free" });
    expect(resolvePrice({ ...base, pricing: { model: "paid", amount: null } })).toEqual({ model: "pending" });
    expect(resolvePrice(base)).toEqual({ model: "paid", base: 1200, final: 1200 });
  });

  it("applies an enabled, in-date campaign", async () => {
    vi.resetModules();
    vi.doMock("@/lib/season/campaigns", () => ({
      activeCampaign: () => ({ id: "c", label: "Test", percentOff: 10, startsAt: "", endsAt: "", enabled: true, appliesTo: "all" }),
    }));
    const { resolvePrice } = await import("@/lib/commerce/pricing");
    const r = resolvePrice(base);
    expect(r.model === "paid" && r.final).toBe(1080);
    vi.doUnmock("@/lib/season/campaigns");
  });
});

describe("activeCampaign", () => {
  it("ignores disabled and out-of-date campaigns", async () => {
    vi.resetModules();
    const { activeCampaign, campaigns } = await import("@/lib/season/campaigns");
    expect(campaigns.every((c) => !c.enabled)).toBe(true);
    expect(activeCampaign(new Date("2026-09-01"))).toBeUndefined();
  });
});

describe("formatMoney", () => {
  it("formats USD minor units", async () => {
    const { formatMoney } = await import("@/lib/commerce/money");
    expect(formatMoney(1200)).toBe("$12");
    expect(formatMoney(1250)).toBe("$12.50");
  });
});
