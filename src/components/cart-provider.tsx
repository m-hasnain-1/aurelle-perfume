"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartItem } from "@/lib/cart";

type CartContextValue = {
  items: CartItem[];
  count: number;
  add: (item: CartItem) => void;
  quantity: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
};
const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "aurelle-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed.filter((item): item is CartItem =>
            typeof item?.variantId === "string" &&
            typeof item?.productId === "string" &&
            Number.isInteger(item?.quantity) &&
            item.quantity > 0 &&
            item.quantity <= 10,
          ));
        }
      }
    } catch (error) {
      console.error("Could not restore the saved bag:", error);
    } finally {
      setHydrated(true);
    }
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Could not save the bag on this device:", error);
    }
  }, [items, hydrated]);
  const add = useCallback((next: CartItem) => {
    setItems((current) => {
      const existing = current.find((item) => item.variantId === next.variantId);
      if (existing) return current.map((item) => item.variantId === next.variantId
        ? { ...item, quantity: Math.min(10, item.quantity + next.quantity) } : item);
      return [...current, next];
    });
  }, []);
  const quantity = useCallback((variantId: string, nextQuantity: number) => {
    setItems((current) => nextQuantity <= 0
      ? current.filter((item) => item.variantId !== variantId)
      : current.map((item) => item.variantId === variantId ? { ...item, quantity: Math.min(10, nextQuantity) } : item));
  }, []);
  const remove = useCallback((variantId: string) => setItems((current) => current.filter((item) => item.variantId !== variantId)), []);
  const clear = useCallback(() => setItems([]), []);
  const value = useMemo(() => ({ items, count: items.reduce((n, item) => n + item.quantity, 0), add, quantity, remove, clear }), [items, add, quantity, remove, clear]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used within CartProvider");
  return value;
}
