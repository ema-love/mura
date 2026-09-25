import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Providers } from "@/components/providers/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MÚRÀ — Prepare yourself.",
    template: "%s · MÚRÀ",
  },
  description:
    "Everything you need before your first day at university. Curated essentials, intelligent recommendations, planning tools and university-specific guidance.",
  applicationName: "MÚRÀ",
  keywords: ["university preparation", "freshers", "packing checklist", "student planner", "Nigeria", "Africa"],
  openGraph: {
    title: "MÚRÀ — Prepare yourself.",
    description: "Everything you need before your first day at university.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF8" },
    { media: "(prefers-color-scheme: dark)", color: "#0E1013" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-dvh font-sans">
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
          >
            Skip to content
          </a>
          {children}
        </Providers>
      </body>
    </html>
  );
}
