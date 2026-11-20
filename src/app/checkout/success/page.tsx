import Link from "next/link";
import { getStripe } from "@/lib/stripe";
import { CartClearer } from "@/components/cart-clearer";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  let paid = false;
  if (sessionId && /^cs_(test|live)_[a-zA-Z0-9]+$/.test(sessionId)) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      paid = session.payment_status === "paid" &&
        Boolean(session.metadata?.orderId) &&
        session.client_reference_id === session.metadata?.orderId;
    } catch (error) {
      console.error("Could not verify the checkout return:", error);
    }
  }
  if (!paid) {
    return (
      <div className="container min-h-[65vh] py-28 text-center">
        <p className="eyebrow mb-5">Payment confirmation</p>
        <h1 className="serif text-6xl">One moment.</h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#a9a49a]">We couldn’t verify a completed payment for this return. If you finished checkout, please check your email for Stripe’s confirmation.</p>
        <Link className="button mt-8" href="/shop">Return to the collection</Link>
      </div>
    );
  }
  return (
    <div className="container min-h-[65vh] py-28 text-center">
      <CartClearer />
      <p className="eyebrow mb-5">A moment to remember</p>
      <h1 className="serif text-6xl">Thank you.</h1>
      <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#a9a49a]">Your order is on its way to becoming a ritual. Your payment is confirmed, and Stripe will send your receipt by email.</p>
      <Link className="button mt-8" href="/shop">Return to the collection</Link>
    </div>
  );
}
