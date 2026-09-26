import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Button } from "@/components/ui/button";
import { getProduct } from "@/lib/catalog";
import { formatMoney } from "@/lib/commerce/money";
import type { Order } from "@/lib/commerce/orders";
import { brand } from "@/lib/brand";
import { confirmPayment, type PaymentOutcome } from "@/lib/server/checkout";

export const metadata: Metadata = { title: "Your order", robots: { index: false, follow: false } };

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? null;

/** e.g. "ad•••@gmail.com" — enough to spot a typo, without printing the full address. */
const maskEmail = (email: string) => {
  const [name, domain] = email.split("@");
  return `${name.slice(0, 2)}${"•".repeat(Math.max(1, Math.min(name.length - 2, 5)))}@${domain}`;
};

const copy: Record<Exclude<PaymentOutcome["state"], "paid">, { title: string; body: string }> = {
  pending: {
    title: "Your payment is processing.",
    body: "Flutterwave hasn't confirmed it yet. As soon as it does, we'll email your download link — there's nothing more you need to do.",
  },
  cancelled: { title: "Payment cancelled.", body: "Nothing was charged. Your checkout is still here whenever you're ready." },
  failed: {
    title: "The payment didn't go through.",
    body: "Your download hasn't been released because the payment couldn't be confirmed. You can try again, or contact us if you were charged.",
  },
  unverified: {
    title: "We're confirming your payment.",
    body: "We couldn't confirm it with Flutterwave just now. If you were charged, your download will be emailed once it's confirmed. If it doesn't arrive, contact us with your order number.",
  },
  "not-found": { title: "We couldn't find this checkout.", body: "The link may be incomplete. If you've paid, contact us and we'll sort it out." },
};

function Summary({ order }: { order: Order }) {
  return (
    <dl className="mx-auto mt-10 max-w-md space-y-3 rounded-[28px] bg-card p-6 text-left text-[15px] hairline">
      {order.items.map((i) => (
        <div key={i.productId} className="flex justify-between gap-4">
          <dt>{i.productName}</dt>
          <dd className="tabular-nums">{formatMoney(i.unitAmount * i.quantity)}</dd>
        </div>
      ))}
      {order.providerFee !== null && order.providerFee > 0 && (
        <div className="flex justify-between gap-4 text-muted-foreground">
          <dt>Payment charge (Flutterwave)</dt>
          <dd className="tabular-nums">{formatMoney(order.providerFee)}</dd>
        </div>
      )}
      <div className="flex justify-between gap-4 border-t pt-3 font-semibold">
        <dt>{order.status === "paid" ? "Paid" : "Total"}</dt>
        <dd className="tabular-nums">
          {formatMoney(order.total)} <span className="text-xs font-normal text-muted-foreground">{order.currency}</span>
        </dd>
      </div>
      <div className="flex justify-between gap-4 text-xs text-muted-foreground">
        <dt>Order number</dt>
        <dd className="font-mono">{order.id}</dd>
      </div>
    </dl>
  );
}

/** Where Flutterwave returns the customer. The payment is verified server-side before anything is shown as paid. */
export default async function CheckoutCompletePage(props: PageProps<"/checkout/complete">) {
  const q = await props.searchParams;
  const txRef = one(q.tx_ref);
  const outcome: PaymentOutcome = txRef
    ? await confirmPayment({ txRef, transactionId: one(q.transaction_id), redirectStatus: one(q.status) })
    : { state: "not-found" };

  const order = outcome.state === "not-found" ? null : outcome.order;
  const product = order ? getProduct(order.items[0]?.productId ?? "") : undefined;
  const retryHref = product ? `/checkout/${product.slug}` : "/systems";

  return (
    <>
      <Nav />
      <main id="main" className="page grid min-h-[80dvh] place-items-center pt-32 pb-24">
        <div className="w-full max-w-2xl text-center">
          <p className="eyebrow">Your order</p>
          {outcome.state === "paid" ? (
            <>
              <span className="mx-auto mt-6 grid size-12 place-items-center rounded-full bg-foreground text-background">
                <Check className="size-5" strokeWidth={3} aria-hidden />
              </span>
              <h1 className="headline mt-6 text-4xl md:text-5xl">Thank you. Payment confirmed.</h1>
              <p className="lede mt-5">
                {outcome.delivered ? (
                  <>
                    We&rsquo;ve emailed your download link to <span className="text-foreground">{maskEmail(outcome.order.email)}</span>. It can take a
                    minute to arrive — check your spam folder if you don&rsquo;t see it.
                  </>
                ) : (
                  <>
                    Your download email to <span className="text-foreground">{maskEmail(outcome.order.email)}</span> is being prepared. If it
                    hasn&rsquo;t arrived in a few minutes, request it from Your purchases or contact us with your order number.
                  </>
                )}
              </p>
              <Summary order={outcome.order} />
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg">
                  <Link href="/systems">
                    Keep browsing <ArrowRight />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/access">Your purchases</Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <h1 className="headline mt-5 text-4xl md:text-5xl">{copy[outcome.state].title}</h1>
              <p className="lede mt-5">{copy[outcome.state].body}</p>
              {order && <Summary order={order} />}
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                {(outcome.state === "cancelled" || outcome.state === "failed") && (
                  <Button asChild size="lg">
                    <Link href={retryHref}>
                      Try again <ArrowRight />
                    </Link>
                  </Button>
                )}
                <Button asChild size="lg" variant={outcome.state === "cancelled" || outcome.state === "failed" ? "secondary" : "primary"}>
                  <a href={`mailto:${brand.contactEmail}?subject=${encodeURIComponent(`Order ${order?.id ?? ""}`.trim())}`}>Contact us</a>
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
