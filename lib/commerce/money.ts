import { brand } from "@/lib/brand";

/** Formats integer minor units. Whole amounts drop the decimals: $12, $12.50. */
export function formatMoney(minor: number, currency: string = brand.currency) {
  const major = minor / 100;
  return new Intl.NumberFormat(brand.locale, {
    style: "currency",
    currency,
    minimumFractionDigits: Number.isInteger(major) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(major);
}
