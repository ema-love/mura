import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/brand";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/downloads/", "/access", "/checkout/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
