import type { CategoryId } from "@/lib/catalog/types";

/**
 * Promotional campaigns. Switch one on here and every price in the store updates.
 * No countdown timers, no fake urgency: a campaign simply has honest start and end dates.
 */
export type Campaign = {
  id: string;
  /** Shown next to discounted prices and in the campaign banner. */
  label: string;
  percentOff: number;
  startsAt: string;
  endsAt: string;
  enabled: boolean;
  appliesTo: "all" | { categories?: CategoryId[]; productIds?: string[] };
};

export const campaigns: Campaign[] = [
  {
    id: "back-to-school-2026",
    label: "Back-to-school",
    percentOff: 10,
    startsAt: "2026-08-15T00:00:00Z",
    endsAt: "2026-10-15T23:59:59Z",
    enabled: false,
    appliesTo: "all",
  },
  {
    id: "christmas-2026",
    label: "Christmas",
    percentOff: 5,
    startsAt: "2026-12-10T00:00:00Z",
    endsAt: "2026-12-31T23:59:59Z",
    enabled: false,
    appliesTo: "all",
  },
];

export function activeCampaign(now = new Date()): Campaign | undefined {
  return campaigns.find(
    (c) => c.enabled && new Date(c.startsAt) <= now && now <= new Date(c.endsAt) && c.percentOff > 0 && c.percentOff < 100,
  );
}
