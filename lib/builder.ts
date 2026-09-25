import { z } from "zod";
import { essentials, getEssential, type Essential } from "@/lib/data/essentials";
import { universities, getUniversity } from "@/lib/data/universities";

export const courses = [
  { id: "engineering", label: "Engineering" },
  { id: "medicine", label: "Medicine & Health" },
  { id: "law", label: "Law" },
  { id: "architecture", label: "Architecture" },
  { id: "computing", label: "Computing" },
  { id: "sciences", label: "Sciences" },
  { id: "business", label: "Business" },
  { id: "arts", label: "Arts & Humanities" },
] as const;

export const budgets = [
  { id: "essential", label: "Essentials only", note: "Under ₦100k" },
  { id: "balanced", label: "Balanced", note: "₦100k – ₦300k" },
  { id: "complete", label: "Complete", note: "Above ₦300k" },
] as const;

/** Items a student is most likely to already own, offered as quick toggles. */
export const ownableIds = [
  "admission-letter",
  "passport-photos",
  "headphones",
  "water-bottle",
  "notebooks",
  "calculator",
  "power-bank",
  "bedding",
  "usb-drive",
] as const;

export const builderSchema = z.object({
  university: z.enum(universities.map((u) => u.id) as [string, ...string[]], {
    error: "Choose your university to continue.",
  }),
  course: z.enum(courses.map((c) => c.id) as [string, ...string[]], { error: "Choose your course." }),
  residence: z.enum(["hostel", "off-campus"], { error: "Tell us where you'll live." }),
  budget: z.enum(budgets.map((b) => b.id) as [string, ...string[]], { error: "Pick a budget range." }),
  hasLaptop: z.boolean({ error: "Let us know about your laptop." }),
  owned: z.array(z.string()),
});

export type BuilderInput = z.infer<typeof builderSchema>;

export type Recommendation = {
  item: Essential;
  reason: string;
  priority: "now" | "soon" | "later";
};

export type BuilderResult = {
  university: string;
  recommendations: Recommendation[];
  owned: string[];
  /** Readiness based on what the student already has. */
  scoreBefore: number;
  /** Readiness once the recommended pack is complete. */
  scoreAfter: number;
  nextAction: string;
  budgetTotal: number;
};

const core = ["admission-letter", "passport-photos", "document-wallet", "notebooks", "planner", "water-bottle", "bank-account", "extension-cord", "usb-drive", "first-aid"];

const byCourse: Record<string, string[]> = {
  engineering: ["calculator", "drawing-kit"],
  medicine: ["lab-coat", "stethoscope"],
  law: ["legal-dictionary"],
  architecture: ["drawing-kit"],
  computing: ["headphones", "ethernet-cable"],
  sciences: ["calculator", "lab-coat"],
  business: ["calculator"],
  arts: ["headphones"],
};

const courseReason: Record<string, string> = {
  engineering: "Engineering maths starts in the first week.",
  medicine: "Practical sessions begin early in health programmes.",
  law: "You'll meet new vocabulary in every lecture.",
  architecture: "Studio work begins almost immediately.",
  computing: "Long focus sessions and fast connections.",
  sciences: "Laboratory practicals are part of year one.",
  business: "Quantitative courses sit in the first semester.",
  arts: "Reading-heavy weeks reward quiet focus.",
};

const hostel = ["padlock", "bedding", "laundry-basket", "bucket", "desk-lamp", "storage-box"];
const offCampus = ["padlock", "desk-lamp", "power-bank"];

const firstSteps: Record<string, string> = {
  "admission-letter": "Print two copies of your admission letter.",
  "passport-photos": "Book passport photographs this week — you'll need eight.",
  "bank-account": "Open a student bank account before resumption.",
  "document-wallet": "Gather every document into one wallet.",
  laptop: "Choose your laptop — our buying guide takes eight minutes.",
};

export function buildRecommendations(input: BuilderInput): BuilderResult {
  const uni = getUniversity(input.university)!;
  const ids = new Set<string>([
    ...core,
    ...(byCourse[input.course] ?? []),
    ...(input.residence === "hostel" ? hostel : offCampus),
    ...(input.hasLaptop ? [] : ["laptop"]),
    "laptop-sleeve",
    "power-bank",
  ]);
  if (uni.id === "alu") ids.add("travel-adapter");

  // An owned laptop counts toward readiness even though we never recommend one.
  const owned = [...input.owned.filter((id) => ids.has(id)), ...(input.hasLaptop ? ["laptop"] : [])];
  const total = ids.size + (input.hasLaptop ? 1 : 0);

  const courseItems = new Set(byCourse[input.course] ?? []);
  const residenceItems = new Set(input.residence === "hostel" ? hostel : offCampus);

  let recommendations: Recommendation[] = [...ids]
    .filter((id) => !owned.includes(id))
    .map((id) => {
      const item = getEssential(id);
      let reason = item.reason;
      if (courseItems.has(id)) reason = courseReason[input.course] ?? reason;
      else if (residenceItems.has(id) && input.residence === "hostel") reason = `${item.reason} ${uni.short} halls are shared.`;
      else if (id === "travel-adapter") reason = "Rwanda uses Type C and J sockets.";
      const priority: Recommendation["priority"] =
        item.category === "documents" || item.category === "finance" || id === "laptop"
          ? "now"
          : courseItems.has(id) || residenceItems.has(id)
            ? "soon"
            : "later";
      return { item, reason, priority };
    });

  const order = { now: 0, soon: 1, later: 2 };
  recommendations.sort((a, b) => order[a.priority] - order[b.priority] || a.item.price - b.item.price);

  // Budget shapes how much of the "later" list we suggest now.
  if (input.budget === "essential") recommendations = recommendations.filter((r) => r.priority !== "later" || r.item.price <= 8000);

  const budgetTotal = recommendations.reduce((sum, r) => sum + r.item.price, 0);
  const first = recommendations[0];

  return {
    university: uni.name,
    recommendations,
    owned,
    scoreBefore: Math.round((owned.length / total) * 100),
    scoreAfter: 100,
    nextAction: first
      ? (firstSteps[first.item.id] ?? `Start with your ${first.item.name.toLowerCase()}.`)
      : "You're ready. Review your checklist the night before you travel.",
    budgetTotal,
  };
}

export const allEssentialIds = essentials.map((e) => e.id);
