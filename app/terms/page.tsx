import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { getLegalDoc } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms that govern your use of the MÚRÀ website and your purchase and use of MÚRÀ digital products.",
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return <LegalPage id="terms" doc={getLegalDoc("terms")} />;
}
