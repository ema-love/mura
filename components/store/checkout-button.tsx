import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/catalog/types";
import { isAvailable } from "@/lib/catalog";
import { paymentsEnabled } from "@/lib/commerce/config";
import { Button } from "@/components/ui/button";

/**
 * The purchase action for a paid product. It only ever links to checkout when the
 * product is priced, published and payments are switched on — never a dead end.
 */
export function CheckoutButton({ product, className }: { product: Product; className?: string }) {
  if (!isAvailable(product)) {
    return (
      <Button size="lg" disabled className={className}>
        Price coming soon
      </Button>
    );
  }
  if (!paymentsEnabled) {
    return (
      <Button size="lg" disabled className={className}>
        Checkout opens soon
      </Button>
    );
  }
  return (
    <Button asChild size="lg" className={className}>
      <Link href={`/checkout/${product.slug}`}>
        Buy now <ArrowRight />
      </Link>
    </Button>
  );
}
