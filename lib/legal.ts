import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Legal documents live as plain text in content/legal/*.md, exactly as the owner
 * wrote them. This reads the small subset of Markdown they use:
 *   # Title · "Last Updated: …" · ## Section · ### Subheading · - list item · paragraphs
 */

export type LegalBlock = { type: "p"; text: string } | { type: "h3"; text: string } | { type: "ul"; items: string[] };
export type LegalSection = { id: string; heading: string; blocks: LegalBlock[] };
export type LegalDoc = { title: string; lastUpdated: string; intro: LegalBlock[]; sections: LegalSection[] };

export const legalDocs = {
  terms: { file: "terms.md", path: "/terms", label: "Terms & Conditions" },
  privacy: { file: "privacy.md", path: "/privacy", label: "Privacy Policy" },
  refunds: { file: "refunds.md", path: "/refunds", label: "Refund Policy" },
} as const;
export type LegalDocId = keyof typeof legalDocs;

const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function parseLegal(source: string): LegalDoc {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  let title = "";
  let lastUpdated = "";
  const intro: LegalBlock[] = [];
  const sections: LegalSection[] = [];
  const target = () => (sections.length ? sections[sections.length - 1].blocks : intro);

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("# ")) title = line.slice(2).trim();
    else if (/^last updated:/i.test(line) && !lastUpdated) lastUpdated = line.replace(/^last updated:\s*/i, "");
    else if (line.startsWith("## ")) {
      const heading = line.slice(3).trim();
      sections.push({ id: slug(heading), heading, blocks: [] });
    } else if (line.startsWith("### ")) target().push({ type: "h3", text: line.slice(4).trim() });
    else if (line.startsWith("- ")) {
      const blocks = target();
      const last = blocks[blocks.length - 1];
      if (last?.type === "ul") last.items.push(line.slice(2).trim());
      else blocks.push({ type: "ul", items: [line.slice(2).trim()] });
    } else target().push({ type: "p", text: line });
  }
  return { title, lastUpdated, intro, sections };
}

export function getLegalDoc(id: LegalDocId): LegalDoc {
  return parseLegal(readFileSync(path.join(process.cwd(), "content/legal", legalDocs[id].file), "utf8"));
}
