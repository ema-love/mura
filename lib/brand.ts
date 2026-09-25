/**
 * MÚRÀ brand constants. The single source for names, promises and URLs.
 */
export const brand = {
  name: "MÚRÀ",
  /** Plain-ASCII name for places that can't render diacritics (emails, file names). */
  asciiName: "MURA",
  pronunciation: "moo-rah",
  promise: "Prepare yourself.",
  description:
    "Digital systems, planners, trackers and templates that help students organise academic life, university life and the opportunities ahead.",
  shortDescription: "Systems for student life — planners, trackers and templates that bring clarity to every semester.",
  /** Public site URL, used for canonical links, sitemaps and share images. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  /** Public contact address and the company inbox. */
  contactEmail: "mura.creates@gmail.com",
  currency: "USD" as const,
  locale: "en-US",
} as const;

export const absoluteUrl = (path = "/") => `${brand.url}${path.startsWith("/") ? path : `/${path}`}`;
