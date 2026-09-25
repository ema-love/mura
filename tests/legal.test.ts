import { describe, expect, it } from "vitest";
import { getLegalDoc, parseLegal } from "@/lib/legal";

describe("legal documents", () => {
  it("publish every section of the owner's text", () => {
    const terms = getLegalDoc("terms");
    const privacy = getLegalDoc("privacy");
    const refunds = getLegalDoc("refunds");
    expect(terms.title).toBe("MÚRÀ Terms & Conditions");
    expect(terms.sections).toHaveLength(21);
    expect(privacy.sections).toHaveLength(18);
    expect(refunds.sections).toHaveLength(13);
    for (const doc of [terms, privacy, refunds]) expect(doc.lastUpdated).toBe("September 2026");
  });

  it("keeps lists and subheadings intact", () => {
    const terms = getLegalDoc("terms");
    const licence = terms.sections.find((s) => s.heading === "6. Personal Use Licence")!;
    const list = licence.blocks.find((b) => b.type === "ul");
    expect(list && list.type === "ul" && list.items).toHaveLength(12);
    const privacy = getLegalDoc("privacy");
    const info = privacy.sections[1].blocks.filter((b) => b.type === "h3").map((b) => b.type === "h3" && b.text);
    expect(info).toEqual(["Information You Provide Directly", "Purchase Information", "Technical Information"]);
  });

  it("gives every section a unique anchor", () => {
    for (const id of ["terms", "privacy", "refunds"] as const) {
      const ids = getLegalDoc(id).sections.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("parses the small markdown subset", () => {
    const doc = parseLegal("# T\nLast Updated: Now\n\nIntro\n\n## 1. A\n\nPara\n- x\n- y\n### Sub\n");
    expect(doc).toMatchObject({ title: "T", lastUpdated: "Now", intro: [{ type: "p", text: "Intro" }] });
    expect(doc.sections[0].blocks).toEqual([
      { type: "p", text: "Para" },
      { type: "ul", items: ["x", "y"] },
      { type: "h3", text: "Sub" },
    ]);
  });
});
