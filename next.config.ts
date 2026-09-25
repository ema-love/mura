import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // On Netlify, fall back to the site's own URL so canonical links and share images are absolute.
  env: { NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || "http://localhost:3000" },
  poweredByHeader: false,
  // Files read at runtime (pages refresh hourly on the server): policy text and share-image fonts.
  outputFileTracingIncludes: {
    "/terms": ["./content/legal/**/*"],
    "/privacy": ["./content/legal/**/*"],
    "/refunds": ["./content/legal/**/*"],
    "/*": ["./assets/fonts/**/*"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
