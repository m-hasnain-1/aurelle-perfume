import Link from "next/link";

export const metadata = {
  title: "Shipping & returns — AURELLE",
  description: "Shipping details and demo-store information for AURELLE orders.",
};

export default function ShippingReturnsPage() {
  return (
    <div className="container min-h-[70vh] max-w-4xl py-16 md:py-24">
      <p className="eyebrow mb-4">The practical details</p>
      <h1 className="serif text-6xl md:text-7xl">Shipping & returns.</h1>
      <p className="mt-5 max-w-2xl text-sm leading-7 text-[#a9a49a]">Clear information for this demonstration storefront. Checkout and payment use Stripe test mode; no real shipment or return service is connected.</p>
      <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
        <section className="grid gap-4 py-8 md:grid-cols-[.45fr_1fr]">
          <h2 className="serif text-3xl">Delivery</h2>
          <div><p className="text-sm leading-7 text-[#bdb8ae]">The demo checkout accepts shipping addresses in the United States, Canada, United Kingdom, France, and Germany. Orders below $150 show a $12 delivery charge; orders of $150 or more show complimentary delivery.</p><p className="mt-3 text-sm leading-7 text-[#a9a49a]">No carrier, dispatch estimate, or shipping-label service is currently connected.</p></div>
        </section>
        <section className="grid gap-4 py-8 md:grid-cols-[.45fr_1fr]">
          <h2 className="serif text-3xl">Returns</h2>
          <p className="text-sm leading-7 text-[#bdb8ae]">This demo does not accept or process returns. No real purchase should be made through its test checkout. A production shop would need a confirmed returns policy and a support channel before taking live orders.</p>
        </section>
        <section className="grid gap-4 py-8 md:grid-cols-[.45fr_1fr]">
          <h2 className="serif text-3xl">Payment</h2>
          <p className="text-sm leading-7 text-[#bdb8ae]">When configured, Stripe runs in test mode. Use Stripe test cards only. The site does not calculate tax or create fulfillment requests.</p>
        </section>
      </div>
      <div className="mt-10 flex flex-wrap gap-3"><Link className="button" href="/faq">Read frequently asked questions</Link><Link className="button" href="/shop">Back to the collection</Link></div>
    </div>
  );
}
