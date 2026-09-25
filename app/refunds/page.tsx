import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { getLegalDoc } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "How MÚRÀ handles refund and remedy requests for digital products.",
  alternates: { canonical: "/refunds" },
};

export default function Page() {
  return <LegalPage id="refunds" doc={getLegalDoc("refunds")} />;
}
