import { describe, expect, it } from "vitest";
import { calculateOrderTotals } from "./order-totals";

describe("server order totals", () => {
  it("calculates tax-free item totals and delivery from database-priced line items", () => {
    expect(calculateOrderTotals([
      { quantity: 1, unitPriceCents: 9200 },
      { quantity: 1, unitPriceCents: 6800 },
    ])).toEqual({ subtotalCents: 16000, shippingCents: 0, totalCents: 16000 });
    expect(calculateOrderTotals([{ quantity: 1, unitPriceCents: 9200 }])).toEqual({
      subtotalCents: 9200,
      shippingCents: 1200,
      totalCents: 10400,
    });
  });
});
