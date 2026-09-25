/**
 * Catalogue data model.
 *
 * Products are data, never layout: every page renders from these records.
 * `kind` leaves room for physical stationery later without reshaping the store.
 */

export type CategoryId =
  | "academic-systems"
  | "study-systems"
  | "university-life"
  | "career-opportunities"
  | "career-kits"
  | "mini-templates"
  | "bundles";

export type Category = {
  id: CategoryId;
  slug: string;
  name: string;
  /** One line under the name, used on cards and in navigation. */
  summary: string;
  /** Editorial introduction for the collection page. */
  statement: string;
  order: number;
};

/**
 * Lifecycle:
 * - draft     hidden everywhere
 * - upcoming  visible in the store, clearly marked, not purchasable
 * - published live and purchasable (when priced)
 * - archived  hidden from the store, still resolvable for past orders
 */
export type ProductStatus = "draft" | "upcoming" | "published" | "archived";

export type ProductKind = "digital" | "physical";

export type ProductType = "system" | "kit" | "mini" | "bundle";

export type ProductFormat = "PDF" | "Google Sheets" | "Excel";

/** Amounts are integer minor units (cents) in the store currency. */
export type Pricing =
  | { model: "free" }
  /** `amount: null` means the price has not been set yet: shown as pending, not purchasable. */
  | { model: "paid"; amount: number | null };

/** Interface previews drawn in code, reused from MÚRÀ 1.0. */
export type PreviewId =
  | "weekly-reset"
  | "semester-planner"
  | "assignment-tracker"
  | "study-planner"
  | "budget-planner"
  | "calendar"
  | "goal-tracker"
  | "expense-tracker"
  | "grade-tracker"
  | "packing-checklist";

export type ImageAsset = {
  /** Path under /public, or empty while the art-directed image is pending. */
  src?: string;
  alt: string;
  width: number;
  height: number;
  /** Brief for the photographer / designer when `src` is empty. */
  direction: string;
};

export type Faq = { q: string; a: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  kind: ProductKind;
  type: ProductType;
  category: CategoryId;
  status: ProductStatus;
  featured?: boolean;
  pricing: Pricing;
  /** One sentence: the value, not the features. */
  tagline: string;
  /** Short description for cards and meta descriptions (≤ 160 chars). */
  summary: string;
  /** The problem it solves, in the student's words. */
  problem: string;
  audience: string[];
  includes: string[];
  formats: ProductFormat[];
  howItWorks: string[];
  previews: PreviewId[];
  faqs?: Faq[];
  /** Bundles only: ids of the products included. */
  bundleItems?: string[];
  image?: ImageAsset;
  /** Id of the private deliverable in file storage. Never a public path. */
  fileKey?: string;
};
