"use client";

import { useEffect, useState } from "react";
import { catalog, type CatalogProduct } from "@/lib/catalog";

export function useProducts() {
  const [products, setProducts] = useState<CatalogProduct[]>(catalog);
  const [previewMode, setPreviewMode] = useState(false);
  useEffect(() => {
    let active = true;
    fetch("/api/products")
      .then(async (response) => {
        if (!response.ok) throw new Error("Live product list unavailable.");
        const result: { products?: CatalogProduct[] } = await response.json();
        if (active && Array.isArray(result.products)) setProducts(result.products);
      })
      .catch(() => { if (active) setPreviewMode(true); });
    return () => { active = false; };
  }, []);
  return { products, previewMode };
}
