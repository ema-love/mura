import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { getLegalDoc } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What information MÚRÀ may collect, why, how it is used and shared, and the choices available to you.",
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  return <LegalPage id="privacy" doc={getLegalDoc("privacy")} />;
}
