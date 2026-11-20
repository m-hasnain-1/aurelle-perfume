"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/catalog";
import { useCart } from "@/components/cart-provider";
import { calculateSubtotal } from "@/lib/cart";
import { BottleArt } from "@/components/bottle-art";
import { useProducts } from "@/components/use-products";

export default function CartPage() {
  const { items, quantity, remove } = useCart();
  const { products } = useProducts();
  const rows = items.flatMap((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    const variant = product?.variants.find((entry) => entry.id === item.variantId);
    return product && variant ? [{ ...item, product, variant, unavailable: variant.stock < item.quantity }] : [];
  });
  const unavailable = items.some((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    const variant = product?.variants.find((entry) => entry.id === item.variantId);
    return !variant || variant.stock < item.quantity;
  });
  const subtotal = calculateSubtotal(rows.map((row) => ({ quantity: row.quantity, priceCents: row.variant.priceCents })));
  return (
    <div className="container min-h-[65vh] pb-24 pt-16 md:pt-24">
      <p className="eyebrow mb-4">Your edit</p><h1 className="serif text-6xl">The bag.</h1>
      {!rows.length && !items.length ? <div className="border-y thin-rule py-20 text-center"><p className="serif text-4xl">A little room for something lovely.</p><p className="mt-3 text-sm text-[#a9a49a]">Your bag is waiting for its first note.</p><Link className="button mt-7" href="/shop">Discover the collection</Link></div> :
        <div className="mt-10 grid gap-12 md:grid-cols-[1fr_330px]">
          <div>
            {unavailable &&
              <p className="notice mb-5">One or more fragrances are no longer available. Remove them to continue.</p>}
            <div className="divide-y divide-white/10 border-y border-white/10">
            {rows.map((row) => <div key={row.variantId} className="grid grid-cols-[90px_1fr_auto] items-center gap-5 py-5">
              <BottleArt tone={row.product.imageTone} className="!min-h-[120px]" />
              <div><Link href={`/product/${row.product.slug}`} className="serif text-2xl hover:text-[#d1bd8c]">{row.product.name}</Link><p className="mt-1 text-xs text-[#a9a49a]">{row.variant.sizeMl} ml · {row.product.family}</p>{row.unavailable && <p className="mt-2 text-xs text-[#c39b7c]">Only {row.variant.stock} currently available</p>}<div className="mt-3 flex items-center gap-3"><label className="sr-only" htmlFor={`qty-${row.variantId}`}>Quantity for {row.product.name}</label><select id={`qty-${row.variantId}`} className="filter-select !py-1" value={row.quantity} onChange={(event) => quantity(row.variantId, Number(event.target.value))}>{Array.from({ length: 10 }, (_, index) => index + 1).map((qty) => <option key={qty} value={qty}>{qty}</option>)}</select><button className="text-[9px] uppercase tracking-widest text-[#8d8980] hover:text-white" onClick={() => remove(row.variantId)}>Remove</button></div></div>
              <span className="text-sm">{formatPrice(row.variant.priceCents * row.quantity)}</span>
            </div>)}
            {items.filter((item) => !products.some((product) => product.id === item.productId && product.variants.some((variant) => variant.id === item.variantId))).map((item) =>
              <div className="flex items-center justify-between gap-5 py-5 text-sm" key={item.variantId}>
                <span className="text-[#aaa59b]">An unavailable fragrance <span className="text-xs">· {item.quantity} in bag</span></span>
                <button className="text-[9px] uppercase tracking-widest text-[#a7866e] hover:text-white" onClick={() => remove(item.variantId)}>Remove</button>
              </div>,
            )}
            </div>
          </div>
          <aside className="h-fit border border-white/10 p-6">
            <h2 className="serif text-3xl">A considered total.</h2>
            <div className="mt-6 flex justify-between border-t thin-rule pt-5 text-sm"><span className="text-[#aaa59b]">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <p className="mt-2 text-xs text-[#8d8980]">Delivery is calculated at checkout.</p>
            {subtotal < 15000 && <p className="mt-4 text-xs text-[#c5b07f]">Add {formatPrice(15000 - subtotal)} for complimentary delivery.</p>}
            {unavailable
              ? <button className="button button-solid mt-7 w-full" disabled>Update your bag to continue</button>
              : <Link className="button button-solid mt-7 w-full" href="/checkout">Continue to checkout</Link>}
            <Link className="mt-5 block text-center text-[9px] uppercase tracking-widest text-[#9b968b]" href="/shop">Continue browsing</Link>
          </aside>
        </div>
      }
    </div>
  );
}
