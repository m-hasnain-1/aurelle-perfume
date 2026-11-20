"use client";

import { useMemo, useState } from "react";
import { filterCatalog } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { useProducts } from "@/components/use-products";

export default function ShopPage() {
  const { products: productsSource, previewMode } = useProducts();
  const [family, setFamily] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [sort, setSort] = useState("");
  const products = useMemo(() => filterCatalog(productsSource, {
    family: family || undefined,
    maxPrice: price ? Number(price) * 100 : undefined,
    size: size ? Number(size) : undefined,
    sort: sort || undefined,
  }), [productsSource, family, price, size, sort]);
  return (
    <div className="container min-h-[70vh] pb-24 pt-16 md:pt-24">
      <p className="eyebrow mb-4">The AURELLE collection</p>
      <div className="flex flex-col justify-between gap-6 border-b thin-rule pb-8 md:flex-row md:items-end">
        <div><h1 className="serif text-6xl md:text-7xl">Find your note.</h1><p className="mt-4 text-sm text-[#a9a49a]">Four compositions. A thousand ways to make them yours.</p></div>
        <span className="text-xs text-[#a9a49a]">{products.length} fragrances</span>
      </div>
      <div className="mb-9 mt-5 flex flex-wrap gap-x-8 gap-y-2 border-b thin-rule pb-5">
        <label><span className="sr-only">Filter by scent family</span><select className="filter-select" value={family} onChange={(event) => setFamily(event.target.value)}><option value="">All scent families</option>{["Amber", "Woody", "Fresh", "Floral"].map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span className="sr-only">Filter by maximum price</span><select className="filter-select" value={price} onChange={(event) => setPrice(event.target.value)}><option value="">Any price</option><option value="100">Under $100</option><option value="150">Under $150</option><option value="175">Under $175</option></select></label>
        <label><span className="sr-only">Filter by bottle size</span><select className="filter-select" value={size} onChange={(event) => setSize(event.target.value)}><option value="">All sizes</option><option value="30">30 ml</option><option value="75">75 ml</option></select></label>
        <label className="md:ml-auto"><span className="sr-only">Sort fragrances</span><select className="filter-select" value={sort} onChange={(event) => setSort(event.target.value)}><option value="">Recommended</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></label>
      </div>
      {previewMode && <p className="mb-6 text-xs text-[#b49a68]" role="status">Showing the preview collection. Connect and seed PostgreSQL to load live inventory.</p>}
      {products.length ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="py-24 text-center"><h2 className="serif text-4xl">Nothing in this note.</h2><p className="mt-3 text-sm text-[#a9a49a]">Try widening your filters.</p></div>}
    </div>
  );
}
