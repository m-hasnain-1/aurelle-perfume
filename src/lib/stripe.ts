import Stripe from "stripe";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key?.startsWith("sk_test_")) {
    throw new Error("A Stripe test-mode secret key (sk_test_...) is required.");
  }
  return new Stripe(key, { apiVersion: "2025-02-24.acacia" });
}
