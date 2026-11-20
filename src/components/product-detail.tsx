"use client";

import Link from "next/link";
import { useState } from "react";
import { formatPrice, type CatalogProduct } from "@/lib/catalog";
import { BottleViewer } from "@/components/bottle-viewer";
import { useCart } from "@/components/cart-provider";

type Review = { id: string; author: string; rating: number; title: string; body: string };

export function ProductDetail({ product, reviews }: { product: CatalogProduct; reviews: Review[] }) {
  const [variantIndex, setVariantIndex] = useState(Math.max(0, product.variants.findIndex((item) => item.stock > 0)));
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const variant = product.variants[Math.min(variantIndex, product.variants.length - 1)];
  return (
    <div className="container pb-24 pt-8 md:pt-14">
      <div className="mb-7 text-[10px] uppercase tracking-[.15em] text-[#8d8980]"><Link href="/shop" className="hover:text-white">Collection</Link><span className="mx-3">/</span>{product.name}</div>
      <div className="grid gap-12 md:grid-cols-[1.05fr_.95fr] md:gap-20">
        <div className="min-w-0"><BottleViewer tone={product.imageTone} /></div>
        <div className="py-4 md:py-12">
          <p className="eyebrow mb-5">{product.family} · Eau de parfum</p>
          <h1 className="serif text-6xl">{product.name}</h1>
          <p className="mt-3 text-sm text-[#c5bdac]">{product.tagline}</p>
          <p className="mt-8 max-w-md text-sm leading-7 text-[#a9a49a]">{product.description}</p>
          <div className="mt-9 border-y thin-rule py-6">
            <p className="eyebrow mb-4">The composition</p>
            <div className="grid grid-cols-3 gap-3 text-sm"><div><span className="block text-[9px] uppercase tracking-widest text-[#817d73]">Opening</span><span className="mt-2 block">{product.topNotes}</span></div><div><span className="block text-[9px] uppercase tracking-widest text-[#817d73]">Heart</span><span className="mt-2 block">{product.heartNotes}</span></div><div><span className="block text-[9px] uppercase tracking-widest text-[#817d73]">Resting</span><span className="mt-2 block">{product.baseNotes}</span></div></div>
          </div>
          <div className="mt-7">
            <p className="eyebrow mb-3">Choose your size</p>
            <div className="flex gap-3">{product.variants.map((item, index) => <button key={item.id} type="button" disabled={item.stock <= 0} className={`border px-5 py-3 text-xs ${variantIndex === index ? "border-[#b49a68] text-white" : "border-[#504d45] text-[#aaa59b]"} disabled:cursor-not-allowed disabled:opacity-40`} onClick={() => { setVariantIndex(index); setQuantity((current) => Math.min(current, item.stock)); }} aria-pressed={variantIndex === index}>{item.sizeMl} ml{item.stock <= 0 ? " · sold out" : ""}</button>)}</div>
          </div>
          <div className="mt-7 flex items-center gap-5">
            <label htmlFor="product-quantity" className="eyebrow">Quantity</label>
            <div className="flex border border-[#504d45]">
              <button className="h-11 w-11" aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <input id="product-quantity" className="w-10 bg-transparent text-center text-sm" aria-label="Quantity" value={quantity} readOnly />
              <button className="h-11 w-11" aria-label="Increase quantity" onClick={() => setQuantity(Math.min(10, variant.stock, quantity + 1))} disabled={quantity >= variant.stock}>+</button>
            </div>
            <span className="ml-auto text-lg">{formatPrice(variant.priceCents)}</span>
          </div>
          <p className="mt-3 text-xs text-[#9b968b]" role="status">{variant.stock > 0 ? `In stock · ${variant.stock} available` : "Currently unavailable"}</p>
          <button className="button button-solid mt-6 w-full" disabled={variant.stock <= 0} onClick={() => { add({ productId: product.id, variantId: variant.id, quantity: Math.min(quantity, variant.stock) }); setAdded(true); }}>
            {added ? "Added to your bag ✓" : "Add to bag"}
          </button>
          <p className="mt-4 text-center text-[10px] uppercase tracking-[.14em] text-[#827e75]">Complimentary delivery over $150 · 2 ml discovery vial included</p>
          <div className="mt-12 border-t thin-rule pt-7"><p className="eyebrow mb-4">A note from our wearers</p>
            {reviews.length ? reviews.map((review) => <article key={review.id} className="mb-5"><p className="text-xs tracking-widest text-[#c8ae77]" aria-label={`${review.rating} out of 5 stars`}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p><p className="serif mt-2 text-2xl">{review.title}</p><p className="mt-2 text-sm leading-6 text-[#a9a49a]">{review.body}</p><p className="mt-2 text-[10px] uppercase tracking-widest text-[#8d8980]">— {review.author}</p></article>)
              : <p className="text-sm text-[#a9a49a]">The first note from our wearers is yet to arrive.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
