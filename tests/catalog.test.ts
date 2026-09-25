import { describe, expect, it } from "vitest";
import { products, categories, bundleItems, getProduct, visibleProducts, isAvailable, searchProducts } from "@/lib/catalog";

describe("catalogue integrity", () => {
  it("has unique ids and slugs", () => {
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length);
  });

  it("uses only known categories", () => {
    const ids = new Set(categories.map((c) => c.id));
    for (const p of products) expect(ids.has(p.category), p.id).toBe(true);
  });

  it("bundles reference real, non-bundle products", () => {
    for (const b of products.filter((p) => p.type === "bundle")) {
      expect(b.bundleItems?.length, b.id).toBeGreaterThan(0);
      for (const id of b.bundleItems!) {
        const item = getProduct(id);
        expect(item, `${b.id} → ${id}`).toBeDefined();
        expect(item!.type).not.toBe("bundle");
      }
      expect(bundleItems(b).length).toBe(b.bundleItems!.length);
    }
  });

  it("launches with the approved set", () => {
    const published = products.filter((p) => p.status === "published").map((p) => p.id).sort();
    expect(published).toEqual(["assignment-command-center", "grade-tgpa-tracker", "semester-system", "student-reset"]);
  });

  it("only the Student Reset is free", () => {
    expect(products.filter((p) => p.pricing.model === "free").map((p) => p.id)).toEqual(["student-reset"]);
  });

  it("never marks an unpriced product as available", () => {
    for (const p of visibleProducts()) {
      if (p.pricing.model === "paid" && p.pricing.amount === null) expect(isAvailable(p)).toBe(false);
    }
  });

  it("searches names, includes and formats", () => {
    expect(searchProducts("tgpa").some((p) => p.id === "grade-tgpa-tracker")).toBe(true);
    expect(searchProducts("exam countdown").some((p) => p.id === "student-reset")).toBe(true);
  });
});
