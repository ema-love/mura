import { renderShareImage, ogSize } from "@/lib/og";
import { brand } from "@/lib/brand";

export const alt = `${brand.name} — ${brand.promise}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderShareImage(
    {
      eyebrow: "Systems for student life",
      title: "Prepare yourself.",
      subtitle: "Planners, trackers and templates that bring clarity to every semester.",
      meta: "PDF · Google Sheets · Excel",
      tone: ["#f6f1e8", "#e2ebe2"],
    },
    "og",
  );
}
