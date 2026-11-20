import { describe, expect, it } from "vitest";
import { calculateSubtotal, updateCartQuantity } from "./cart";

describe("cart calculations", () => {
  it("calculates a subtotal from trusted unit prices and quantities", () => {
    expect(
      calculateSubtotal([
        { quantity: 2, priceCents: 9200 },
        { quantity: 1, priceCents: 16800 },
      ]),
    ).toBe(35200);
  });

  it("updates quantities and removes zero-quantity items", () => {
    const cart = [
      { variantId: "a", productId: "one", quantity: 1 },
      { variantId: "b", productId: "two", quantity: 2 },
    ];
    expect(updateCartQuantity(cart, "b", 3)[1].quantity).toBe(3);
    expect(updateCartQuantity(cart, "a", 0)).toEqual([cart[1]]);
  });
});
