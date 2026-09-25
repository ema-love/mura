import Link from "next/link";
import { activeCampaign } from "@/lib/season/campaigns";
import { activeSeason } from "@/lib/season/seasons";
import { isAvailable, visibleProducts } from "@/lib/catalog";
import { resolvePrice } from "@/lib/commerce/pricing";
import { SeasonalMark } from "./seasonal-mark";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

const endDate = (iso: string) => new Intl.DateTimeFormat(brand.locale, { day: "numeric", month: "long" }).format(new Date(iso));

/**
 * A calm, factual campaign note: what, how much, until when. No timers.
 * Only shown when the discount actually applies to something you can buy.
 */
export function CampaignBanner({ className }: { className?: string }) {
  const campaign = activeCampaign();
  if (!campaign) return null;
  const discounted = visibleProducts().filter((p) => {
    const price = resolvePrice(p);
    return isAvailable(p) && price.model === "paid" && !!price.discount;
  });
  if (!discounted.length) return null;

  const scope = campaign.appliesTo === "all" ? "every system" : "selected systems";
  return (
    <Link
      href="/systems"
      className={cn(
        "mx-auto mb-6 flex w-fit max-w-full items-center gap-2 rounded-full bg-foreground px-4 py-1.5 text-[12px] font-medium text-background shadow-soft transition-opacity hover:opacity-90",
        className,
      )}
    >
      <SeasonalMark mark={activeSeason().mark} />
      <span className="truncate">
        {campaign.label}: {campaign.percentOff}% off {scope} until {endDate(campaign.endsAt)}
      </span>
    </Link>
  );
}
