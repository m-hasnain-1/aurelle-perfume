export function calculateOrderTotals(
  items: Array<{ quantity: number; unitPriceCents: number }>,
  freeShippingThresholdCents = 15000,
  shippingFeeCents = 1200,
) {
  const subtotalCents = items.reduce(
    (total, item) => total + item.quantity * item.unitPriceCents,
    0,
  );
  return {
    subtotalCents,
    shippingCents: subtotalCents >= freeShippingThresholdCents ? 0 : shippingFeeCents,
    totalCents: subtotalCents + (subtotalCents >= freeShippingThresholdCents ? 0 : shippingFeeCents),
  };
}
