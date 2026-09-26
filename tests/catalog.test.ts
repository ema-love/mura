import { describe, expect, it } from "vitest";
import { products, categories, bundleItems, getProduct, visibleProducts, isAvailable, searchProducts } from "@/lib/catalog";
import { bundleValue } from "@/lib/commerce/pricing";

/** The owner's approved master catalogue: product → price in USD cents (null = free). */
const approved: Record<string, number | null> = {
  "student-reset": null,
  "semester-starter": 700,
  "assignment-command-center": 900,
  "semester-system": 1500,
  "exam-prep-system": 1000,
  "grade-tgpa-tracker": 700,
  "study-planner": 800,
  "revision-kit": 800,
  "notes-collection": 600,
  "university-starter-kit": 800,
  "student-budget": 600,
  "student-life-planner": 800,
  "internship-tracker": 600,
  "scholarship-tracker": 600,
  "opportunity-tracker": 700,
  "cv-kit": 800,
  "portfolio-kit": 800,
  "presentation-kit": 800,
  "academic-bundle": 2500,
  "university-bundle": 2500,
  "career-bundle": 2200,
  "ultimate-student-system": 4500,
  "mini-assignment-tracker": 250,
  "mini-exam-countdown": 200,
  "mini-study-timetable": 250,
  "mini-weekly-planner": 200,
  "mini-monthly-planner": 200,
  "mini-grade-tracker": 250,
  "mini-tgpa-calculator": 300,
  "mini-student-budget-template": 300,
  "mini-savings-tracker": 200,
  "mini-expense-tracker": 200,
  "mini-reading-tracker": 200,
  "mini-habit-tracker": 200,
  "mini-internship-tracker-template": 300,
  "mini-scholarship-tracker-template": 300,
  "mini-competition-tracker": 300,
  "mini-project-planner": 250,
  "mini-presentation-planner": 250,
  "mini-course-planner": 250,
  "mini-revision-tracker": 250,
  "mini-past-paper-tracker": 250,
};

describe("master catalogue", () => {
  it("contains exactly the approved products — nothing added or missing", () => {
    expect(products.map((p) => p.id).sort()).toEqual(Object.keys(approved).sort());
  });

  it("uses the approved prices", () => {
    for (const p of products) {
      const expected = approved[p.id];
      if (expected === null) expect(p.pricing, p.id).toEqual({ model: "free" });
      else expect(p.pricing, p.id).toEqual({ model: "paid", amount: expected });
    }
  });

  it("publishes Student Reset and every system; everything else stays draft", () => {
    const live = products.filter((p) => p.id === "student-reset" || p.type === "system").map((p) => p.id).sort();
    expect(live).toHaveLength(11);
    expect(visibleProducts().map((p) => p.id).sort()).toEqual(live);
    for (const p of products) if (!live.includes(p.id)) expect(p.status, p.id).toBe("draft");
    for (const id of live) expect(getProduct(id)!.fileKey, id).toBeTruthy();
  });

  it("bundles contain exactly the approved products", () => {
    const ids = (id: string) => bundleItems(getProduct(id)!).map((p) => p.id);
    expect(ids("academic-bundle")).toEqual(["semester-system", "assignment-command-center", "exam-prep-system", "grade-tgpa-tracker"]);
    expect(ids("university-bundle")).toEqual(["university-starter-kit", "semester-system", "student-budget", "student-life-planner"]);
    expect(ids("career-bundle")).toEqual(["cv-kit", "portfolio-kit", "internship-tracker", "opportunity-tracker"]);
    expect(ids("ultimate-student-system")).toHaveLength(16);
    expect(getProduct("ultimate-student-system")!.includes).toEqual(["Future updates", "New versions of included products"]);
  });

  it("computes honest bundle savings from real prices", () => {
    // Academic: $15 + $9 + $10 + $7 = $41, bundle $25 → save $16.
    expect(bundleValue(getProduct("academic-bundle")!)).toEqual({ itemsTotal: 4100, savings: 1600 });
  });

  it("has unique ids and slugs and known categories", () => {
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length);
    const cats = new Set(categories.map((c) => c.id));
    for (const p of products) expect(cats.has(p.category), p.id).toBe(true);
  });

  it("keeps the Student Reset contents as approved", () => {
    expect(getProduct("student-reset")!.includes).toEqual([
      "Weekly Reset Template",
      "Assignment Overview",
      "Weekly Study Planner",
      "Weekly Goals",
      "Exam Countdown",
      "Upcoming Deadlines",
      "“This Week” Priority List",
    ]);
  });

  it("marks the published systems as available and searchable", () => {
    for (const p of products.filter((p) => p.type === "system")) expect(isAvailable(p), p.id).toBe(true);
    expect(searchProducts("tgpa").map((p) => p.id)).toContain("grade-tgpa-tracker");
    expect(searchProducts("exam countdown").map((p) => p.id)).toContain("student-reset");
    expect(searchProducts("pomodoro").map((p) => p.id)).toContain("study-planner");
    expect(searchProducts("cv").map((p) => p.id)).not.toContain("cv-kit"); // draft kits stay hidden
  });
});
