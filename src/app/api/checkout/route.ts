import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validation";
import { getStripe } from "@/lib/stripe";
import { calculateOrderTotals } from "@/lib/order-totals";

export async function POST(request: Request) {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) return NextResponse.json({ error: "Check the email and items in your bag.", issues: parsed.error.flatten() }, { status: 400 });

  const consolidated = new Map<string, number>();
  for (const item of parsed.data.items) consolidated.set(item.variantId, (consolidated.get(item.variantId) || 0) + item.quantity);
  if ([...consolidated.values()].some((quantity) => quantity > 10)) {
    return NextResponse.json({ error: "A maximum of 10 of each size may be ordered." }, { status: 400 });
  }

  try {
    const ids = [...consolidated.keys()];
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: ids }, product: { archivedAt: null } },
      include: { product: true },
    });
    if (variants.length !== ids.length) return NextResponse.json({ error: "One or more items are no longer available." }, { status: 409 });
    const items = variants.map((variant) => ({
      productId: variant.productId,
      variantId: variant.id,
      productName: variant.product.name,
      sizeMl: variant.sizeMl,
      quantity: consolidated.get(variant.id) || 0,
      unitPriceCents: variant.priceCents,
    }));
    const { subtotalCents, shippingCents } = calculateOrderTotals(items);
    const order = await prisma.$transaction(async (transaction) => {
      for (const item of items) {
        const reserved = await transaction.productVariant.updateMany({
          where: { id: item.variantId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (reserved.count !== 1) throw new Error("INVENTORY_UNAVAILABLE");
      }
      return transaction.order.create({
        data: {
          email: parsed.data.email,
          subtotalCents,
          shippingCents,
          items: { create: items },
        },
      });
    });
    let stripe: Stripe | null = null;
    let createdSession: Stripe.Checkout.Session | null = null;
    try {
      stripe = getStripe();
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        client_reference_id: order.id,
        customer_email: parsed.data.email,
        payment_intent_data: { receipt_email: parsed.data.email },
        line_items: [
          ...items.map((item) => ({
            quantity: item.quantity,
            price_data: {
              currency: "usd",
              unit_amount: item.unitPriceCents,
              product_data: { name: `${item.productName} · ${item.sizeMl} ml` },
            },
          })),
          ...(shippingCents ? [{
            quantity: 1,
            price_data: { currency: "usd", unit_amount: shippingCents, product_data: { name: "Insured delivery" } },
          }] : []),
        ],
        shipping_address_collection: { allowed_countries: ["US", "CA", "GB", "FR", "DE"] },
        metadata: { orderId: order.id },
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/checkout`,
      }, { idempotencyKey: `aurelle-order-${order.id}` });
      createdSession = session;
      if (!session.url) throw new Error("Stripe did not return a checkout URL.");
      await prisma.order.update({ where: { id: order.id }, data: { stripeCheckoutSessionId: session.id } });
      return NextResponse.json({ url: session.url });
    } catch (error) {
      let safeToReleaseReservation = !createdSession;
      if (createdSession && stripe) {
        try {
          await stripe.checkout.sessions.expire(createdSession.id);
          safeToReleaseReservation = true;
        } catch (expireError) {
          console.error("Could not expire the unreturned Stripe session:", expireError);
          try {
            await prisma.order.update({
              where: { id: order.id },
              data: { stripeCheckoutSessionId: createdSession.id },
            });
          } catch (persistError) {
            console.error("Could not associate the Stripe session with its order:", persistError);
          }
        }
      }
      if (safeToReleaseReservation) {
        await prisma.$transaction(async (transaction) => {
          const cancelled = await transaction.order.updateMany({
            where: { id: order.id, status: "PENDING" },
            data: { status: "CANCELLED" },
          });
          if (cancelled.count === 1) {
            for (const item of items) {
              await transaction.productVariant.update({
                where: { id: item.variantId },
                data: { stock: { increment: item.quantity } },
              });
            }
          }
        });
      }
      throw error;
    }
  } catch (error) {
    if (error instanceof Error && error.message === "INVENTORY_UNAVAILABLE") {
      return NextResponse.json({ error: "One or more sizes have just sold out. Please refresh your bag." }, { status: 409 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Checkout database error:", error.code);
    } else {
      console.error("Checkout could not be created:", error);
    }
    return NextResponse.json({ error: "Secure checkout is temporarily unavailable. Please try again shortly." }, { status: 503 });
  }
}
