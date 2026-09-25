/**
 * Commerce switches. Payments stay off until the Flutterwave integration is connected
 * and verified (Phase 5). While off, paid products can be browsed but never charged.
 */
export const paymentsEnabled = process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === "true";
