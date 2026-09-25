import type { Product } from "@/lib/catalog/types";
import { bundleItems } from "@/lib/catalog";
import { activeCampaign, type Campaign } from "@/lib/season/campaigns";

export type ResolvedPrice =
  | { model: "free" }
  /** Paid product whose price has not been set yet. */
  | { model: "pending" }
  | {
      model: "paid";
      /** Base price in minor units, before any campaign. */
      base: number;
      /** Price the customer pays for the product (before any payment-provider charge). */
      final: number;
      discount?: { campaign: Campaign; amount: number };
    };

function campaignApplies(c: Campaign, p: Product) {
  if (c.appliesTo === "all") return true;
  return (c.appliesTo.productIds?.includes(p.id) ?? false) || (c.appliesTo.categories?.includes(p.category) ?? false);
}

/**
 * The one place prices are decided. Pages, cards and checkout all call this,
 * so a campaign switched on in config reaches everywhere at once.
 */
export function resolvePrice(product: Product, now = new Date()): ResolvedPrice {
  if (product.pricing.model === "free") return { model: "free" };
  const base = product.pricing.amount;
  if (base === null) return { model: "pending" };

  const campaign = activeCampaign(now);
  if (campaign && campaignApplies(campaign, product)) {
    const amount = Math.round((base * campaign.percentOff) / 100);
    return { model: "paid", base, final: base - amount, discount: { campaign, amount } };
  }
  return { model: "paid", base, final: base };
}

/**
 * Honest bundle value: only computed when every included product has a price.
 * Returns null otherwise, so the UI never shows a savings figure it can't back up.
 */
export function bundleValue(bundle: Product, now = new Date()) {
  const items = bundleItems(bundle);
  const prices = items.map((p) => resolvePrice(p, now));
  if (!items.length || prices.some((p) => p.model !== "paid")) return null;
  const total = prices.reduce((sum, p) => sum + (p.model === "paid" ? p.final : 0), 0);
  const own = resolvePrice(bundle, now);
  if (own.model !== "paid") return { itemsTotal: total, savings: null };
  const savings = total - own.final;
  return { itemsTotal: total, savings: savings > 0 ? savings : null };
}
