import Link from "next/link";
import type { Product } from "@/lib/catalog/types";
import { isAvailable, isFree } from "@/lib/catalog";
import { paymentsEnabled } from "@/lib/commerce/config";
import { PriceDisplay } from "@/components/store/price-display";
import { CheckoutButton } from "@/components/store/checkout-button";
import { ClaimForm } from "./claim-form";

/** Price, the one action that applies, and plain-language reassurance. */
export function PurchasePanel({ product }: { product: Product }) {
  const free = isFree(product);
  const canClaim = free && product.status === "published";
  const note =
    !isAvailable(product)
        ? "Pricing for this system will be announced shortly."
        : !free && !paymentsEnabled
          ? "Checkout will open shortly. The price shown is final."
          : null;

  return (
    <div id="get" className="scroll-mt-28">
      <div className="flex items-baseline gap-3">
        <PriceDisplay product={product} size="lg" />
        {!free && isAvailable(product) && <span className="text-sm text-muted-foreground">USD · one-time</span>}
      </div>

      <div className={canClaim || isAvailable(product) ? "mt-6" : ""}>
        {canClaim ? (
          <ClaimForm productId={product.id} productName={product.name} />
        ) : isAvailable(product) ? (
          <CheckoutButton product={product} className="w-full sm:w-auto" />
        ) : null}
      </div>

      {note && <p className="mt-3 text-sm text-muted-foreground">{note}</p>}
      {!free && (
        <p className="mt-6 text-sm text-muted-foreground">
          New to MÚRÀ?{" "}
          <Link href="/products/student-reset" className="font-medium text-foreground underline-offset-4 hover:underline">
            Start with the free Student Reset
          </Link>
          .
        </p>
      )}

      {!free && isAvailable(product) && paymentsEnabled && (
        <p className="mt-3 text-xs text-muted-foreground">
          By purchasing, you agree to the{" "}
          <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">
            Terms &amp; Conditions
          </Link>{" "}
          and{" "}
          <Link href="/refunds" className="underline underline-offset-4 hover:text-foreground">
            Refund Policy
          </Link>
          .
        </p>
      )}

      <ul className="mt-8 grid gap-3 border-t pt-6 text-[13px] text-muted-foreground sm:grid-cols-3">
        <li>
          <span className="block font-medium text-foreground">Instant delivery</span>
          Download link by email
        </li>
        <li>
          <span className="block font-medium text-foreground">{free ? "Always free" : "Pay once"}</span>
          {free ? "No card required" : "No subscription"}
        </li>
        <li>
          <span className="block font-medium text-foreground">{product.formats.join(" · ")}</span>
          {product.formats.length > 1 ? "Choose your format" : "Print or annotate"}
        </li>
      </ul>

      <p className="mt-6 text-xs text-muted-foreground">
        <Link href="/terms" className="hover:text-foreground">Terms</Link>
        {" · "}
        <Link href="/refunds" className="hover:text-foreground">Refund Policy</Link>
        {" · "}
        <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
      </p>
    </div>
  );
}
