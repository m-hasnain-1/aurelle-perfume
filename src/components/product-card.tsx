"use client";

import Link from "next/link";
import { formatPrice, type CatalogProduct } from "@/lib/catalog";
import { useCart } from "./cart-provider";
import { BottleArt } from "./bottle-art";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const { add } = useCart();
  const variant = product.variants.find((item) => item.stock > 0);
  const displayPrice = variant ?? product.variants[0];
  return (
    <article>
      <Link href={`/product/${product.slug}`} className="group block">
        <BottleArt tone={product.imageTone} />
        <div className="mt-5 flex items-start justify-between gap-2">
          <div>
            <h3 className="serif text-2xl">{product.name}</h3>
            <p className="mt-1 text-xs text-[#a9a49a]">{product.tagline}</p>
          </div>
          <span className="pt-2 text-xs text-[#ddd5c5]">{displayPrice ? formatPrice(displayPrice.priceCents) : "Unavailable"}</span>
        </div>
      </Link>
      <button
        className="mt-4 border-b border-[#77705f] pb-1 text-[9px] uppercase tracking-[.17em] text-[#d0c8b8] hover:border-[#d3bf91] hover:text-white"
        disabled={!variant}
        onClick={() => variant && add({ productId: product.id, variantId: variant.id, quantity: 1 })}
      >{variant ? `Quick add · ${variant.sizeMl} ml` : "Currently unavailable"}</button>
    </article>
  );
}
