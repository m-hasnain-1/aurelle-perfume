export type CartItem = { variantId: string; productId: string; quantity: number };

export function updateCartQuantity(items: CartItem[], variantId: string, quantity: number) {
  if (quantity <= 0) return items.filter((item) => item.variantId !== variantId);
  return items.map((item) => (item.variantId === variantId ? { ...item, quantity } : item));
}

export function calculateSubtotal(
  items: Array<{ quantity: number; priceCents: number }>,
) {
  return items.reduce((total, item) => total + item.quantity * item.priceCents, 0);
}
