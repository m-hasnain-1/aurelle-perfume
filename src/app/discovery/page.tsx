import Link from "next/link";
import { catalog } from "@/lib/catalog";
import { BottleArt } from "@/components/bottle-art";

export const metadata = {
  title: "Discover AURELLE — AURELLE",
  description: "A thoughtful introduction to the AURELLE fragrance collection.",
};

export default function DiscoveryPage() {
  return (
    <>
      <section className="editorial-hero editorial-hero-discovery">
        <div className="container editorial-hero-inner">
          <p className="eyebrow">Begin anywhere</p>
          <h1 className="serif editorial-title">A first meeting<br /><em>with fragrance.</em></h1>
          <p className="editorial-lede">Four compositions, each with its own way of staying with you.</p>
          <Link className="button button-solid mt-8" href="/scent-finder">Find your starting point</Link>
          <span className="editorial-hero-mark" aria-hidden="true">01</span>
        </div>
      </section>
      <section className="container py-20 md:py-28">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <p className="eyebrow mb-4">The collection, considered</p>
          <h2 className="serif text-5xl">Meet the four.</h2>
          <p className="mt-4 text-sm leading-7 text-[#a9a49a]">Read a little about each composition. Follow the notes that feel like you.</p>
        </div>
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {catalog.map((product, index) => (
            <article key={product.id}>
              <Link href={`/product/${product.slug}`} className="block">
                <BottleArt tone={product.imageTone} className="!min-h-[320px]" />
                <p className="eyebrow mt-5">0{index + 1} · {product.family}</p>
                <h3 className="serif mt-2 text-3xl">{product.name}</h3>
                <p className="mt-2 text-xs text-[#bdb8ae]">{product.tagline}</p>
                <p className="mt-4 text-sm leading-6 text-[#979187]">{product.topNotes} · {product.heartNotes} · {product.baseNotes}</p>
                <span className="mt-5 inline-block text-[9px] uppercase tracking-[.16em] text-[#d1bd8c]">Meet {product.name} ↗</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="border-y thin-rule bg-[#1d1c19]">
        <div className="container grid gap-10 py-16 md:grid-cols-[1fr_auto] md:items-center md:py-20">
          <div><p className="eyebrow mb-3">Not sure where to start?</p><h2 className="serif text-4xl">Let your mood lead.</h2><p className="mt-3 max-w-lg text-sm leading-6 text-[#a9a49a]">A few small questions can help you find the notes you keep coming back to.</p></div>
          <Link className="button" href="/scent-finder">Take the scent finder ↗</Link>
        </div>
      </section>
    </>
  );
}
