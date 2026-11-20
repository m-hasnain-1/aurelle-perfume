"use client";

import Link from "next/link";
import { useCart } from "./cart-provider";

export function SiteHeader() {
  const { count } = useCart();
  return (
    <>
      <div className="border-b thin-rule bg-[#b49a68] px-4 py-2 text-center text-[9px] uppercase tracking-[.2em] text-[#171715]">
        Complimentary delivery on orders over $150
      </div>
      <header className="relative z-20 border-b thin-rule bg-[#171715]">
        <nav className="container flex h-[82px] items-center justify-between" aria-label="Main navigation">
          <div className="hidden items-center gap-6 lg:flex">
            <Link className="text-[9px] uppercase tracking-[.16em] text-[#c5c0b5] hover:text-white" href="/shop">Shop</Link>
            <Link className="text-[9px] uppercase tracking-[.16em] text-[#c5c0b5] hover:text-white" href="/scent-finder">Find your scent</Link>
            <Link className="text-[9px] uppercase tracking-[.16em] text-[#c5c0b5] hover:text-white" href="/our-world">Our world</Link>
            <Link className="text-[9px] uppercase tracking-[.16em] text-[#c5c0b5] hover:text-white" href="/journal">Journal</Link>
          </div>
          <details className="relative lg:hidden">
            <summary className="cursor-pointer list-none text-[10px] uppercase tracking-widest focus-visible:outline-2 focus-visible:outline-[#d5bd85]">Menu</summary>
            <div className="absolute left-0 top-9 z-30 grid min-w-52 gap-4 border border-white/10 bg-[#171715] p-5 shadow-2xl">
              <Link className="text-[10px] uppercase tracking-[.16em] text-[#d8d1c3]" href="/shop">Shop the collection</Link>
              <Link className="text-[10px] uppercase tracking-[.16em] text-[#d8d1c3]" href="/scent-finder">Find your scent</Link>
              <Link className="text-[10px] uppercase tracking-[.16em] text-[#d8d1c3]" href="/discovery">Discover AURELLE</Link>
              <Link className="text-[10px] uppercase tracking-[.16em] text-[#d8d1c3]" href="/our-world">Our world</Link>
              <Link className="text-[10px] uppercase tracking-[.16em] text-[#d8d1c3]" href="/journal">The journal</Link>
              <Link className="text-[10px] uppercase tracking-[.16em] text-[#d8d1c3]" href="/fragrance-care">Fragrance care</Link>
            </div>
          </details>
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-xl tracking-[.32em] text-[#eee6d4] md:text-[22px]" aria-label="AURELLE home">
            AURELLE
          </Link>
          <div className="flex items-center gap-6">
            <Link className="hidden text-[10px] uppercase tracking-[.18em] text-[#c5c0b5] hover:text-white sm:block" href="/account">Account</Link>
            <Link className="text-[10px] uppercase tracking-[.18em] text-[#eee6d4] hover:text-[#d0ba86]" href="/cart" aria-label={`Cart, ${count} items`}>
              Bag <span className="text-[#b49a68]">({count})</span>
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}
