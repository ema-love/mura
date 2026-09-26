/**
 * Order data model.
 *
 * No card or bank details are ever stored: the payment provider handles those.
 * An order becomes "paid" only after server-side verification with the provider.
 */

export type OrderStatus =
  /** Created, waiting for the customer to complete payment. */
  | "pending"
  /** Verified with the payment provider. */
  | "paid"
  /** Free product claimed. No payment involved. */
  | "free"
  | "failed"
  | "cancelled";

export type OrderItem = {
  productId: string;
  productName: string;
  /** Price the customer agreed to, in minor units, after any campaign. */
  unitAmount: number;
  quantity: number;
  campaignId?: string;
};

export type Order = {
  id: string;
  email: string;
  items: OrderItem[];
  currency: string;
  /** Sum of items in minor units. */
  subtotal: number;
  /** Payment charge returned by the provider, when the customer pays it. */
  providerFee: number | null;
  /** Amount charged to the customer. */
  total: number;
  status: OrderStatus;
  provider: "flutterwave" | "none";
  /** Our reference sent to the provider (tx_ref). */
  reference: string;
  /** Provider transaction id, recorded after verification. */
  providerTransactionId?: string;
  createdAt: string;
  verifiedAt?: string;
  /** Why a payment was not accepted (for support). Never shown to customers verbatim. */
  failureReason?: string;
  fulfilment?: {
    emailedAt?: string;
    /** Number of successful downloads, for support and abuse checks. */
    downloads: number;
    lastDownloadAt?: string;
  };
};
