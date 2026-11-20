"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/catalog";
import { calculateSubtotal } from "@/lib/cart";
import { useProducts } from "@/components/use-products";

export default function CheckoutPage() {
  const { items } = useCart();
  const { products } = useProducts();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const rows = items.flatMap((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    const variant = product?.variants.find((entry) => entry.id === item.variantId);
    return product && variant ? [{ ...item, product, variant, unavailable: variant.stock < item.quantity }] : [];
  });
  const unavailable = items.some((item) => !products.some((product) => product.id === item.productId && product.variants.some((variant) => variant.id === item.variantId && variant.stock >= item.quantity)));
  const subtotal = calculateSubtotal(rows.map((row) => ({ quantity: row.quantity, priceCents: row.variant.priceCents })));
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    const payload = {
      email: String(form.get("email") || ""),
      items: items.map(({ variantId, quantity }) => ({ variantId, quantity })),
    };
    try {
      const response = await fetch("/api/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We couldn't start checkout. Please try again.");
      window.location.assign(result.url);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Something went wrong. Please try again.");
      setBusy(false);
    }
  }
  return (
    <div className="container min-h-[65vh] pb-24 pt-16 md:pt-24">
      <p className="eyebrow mb-4">A secure finish</p><h1 className="serif text-6xl">Almost yours.</h1>
      {!rows.length && !items.length ? <div className="mt-9 border-y thin-rule py-16 text-center"><p className="serif text-3xl">Your bag is still waiting.</p><Link className="button mt-6" href="/shop">Browse the collection</Link></div> :
        <div className="mt-10 grid gap-12 md:grid-cols-[1fr_360px]">
          <form onSubmit={submit} className="max-w-xl">
            <h2 className="serif text-3xl">Where to reach you</h2>
            <p className="mt-2 text-sm leading-6 text-[#a9a49a]">Stripe’s secure checkout will collect your shipping details and payment information.</p>
            <label className="label mt-7" htmlFor="email">Email address</label><input id="email" name="email" type="email" required maxLength={254} autoComplete="email" className="input" placeholder="you@example.com" />
            {unavailable && <p className="notice mt-5" role="alert">Your bag includes an unavailable size. Return to your bag to update or remove it.</p>}
            {error && <p className="notice mt-5" role="alert">{error}</p>}
            <button type="submit" className="button button-solid mt-7 w-full" disabled={busy || unavailable}>{busy ? "Preparing secure checkout…" : "Continue to secure payment"}</button>
            <p className="mt-4 text-center text-[10px] text-[#827e75]">Payments are processed securely by Stripe in test mode.</p>
          </form>
          <aside className="h-fit border border-white/10 p-6">
            <h2 className="serif text-3xl">Your selection</h2>
            <div className="mt-5 space-y-4 border-y thin-rule py-5">{rows.map((row) => <div className="flex justify-between gap-4 text-sm" key={row.variantId}><span className="text-[#c5c0b5]">{row.product.name} <span className="text-[#827e75]">· {row.variant.sizeMl} ml × {row.quantity}</span>{row.unavailable && <span className="block text-xs text-[#c39b7c]">Quantity unavailable</span>}</span><span>{formatPrice(row.variant.priceCents * row.quantity)}</span></div>)}</div>
            <div className="flex justify-between pt-5 text-sm"><span className="text-[#aaa59b]">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <p className="mt-2 text-xs text-[#827e75]">Delivery calculated securely at checkout.</p>
          </aside>
        </div>}
    </div>
  );
}
