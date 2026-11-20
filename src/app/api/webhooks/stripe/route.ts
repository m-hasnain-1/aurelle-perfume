import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) return NextResponse.json({ error: "Webhook is not configured." }, { status: 400 });
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(await request.text(), signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }
  if (!["checkout.session.completed", "checkout.session.async_payment_succeeded", "checkout.session.expired"].includes(event.type)) {
    return NextResponse.json({ received: true });
  }
  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.orderId;
  if (!orderId) return NextResponse.json({ error: "Order reference is missing." }, { status: 400 });

  try {
    await prisma.$transaction(async (transaction) => {
      await transaction.stripeEvent.create({ data: { id: event.id, type: event.type } });
      const order = await transaction.order.findUnique({ where: { id: orderId }, include: { items: true } });
      if (!order) throw new Error(`Order ${orderId} was not found for payment event.`);
      if (order.stripeCheckoutSessionId !== session.id &&
          !(order.stripeCheckoutSessionId === null && session.client_reference_id === orderId)) {
        throw new Error(`Checkout session did not match order ${orderId}.`);
      }
      if (order.stripeCheckoutSessionId === null) {
        await transaction.order.update({
          where: { id: order.id },
          data: { stripeCheckoutSessionId: session.id },
        });
      }
      if (event.type === "checkout.session.expired") {
        const cancelled = await transaction.order.updateMany({
          where: { id: order.id, status: "PENDING" },
          data: { status: "CANCELLED" },
        });
        if (cancelled.count === 1) {
          for (const item of order.items) {
            await transaction.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { increment: item.quantity } },
            });
          }
        }
        return;
      }
      if (session.payment_status !== "paid") return;
      if (session.currency !== "usd" || session.amount_total !== order.subtotalCents + order.shippingCents) {
        throw new Error(`Payment amount did not match order ${orderId}.`);
      }
      const claim = await transaction.order.updateMany({
        where: { id: order.id, status: "PENDING" },
        data: { status: "PAID" },
      });
      if (claim.count === 0) return;
      const address = session.shipping_details?.address;
      await transaction.order.update({
        where: { id: order.id },
        data: {
          shippingName: session.shipping_details?.name ?? null,
          shippingAddress1: address?.line1 ?? null,
          shippingAddress2: address?.line2 ?? null,
          shippingCity: address?.city ?? null,
          shippingPostalCode: address?.postal_code ?? null,
          shippingCountry: address?.country ?? null,
        },
      });
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ received: true });
    }
    console.error("Stripe order processing failed:", error);
    return NextResponse.json({ error: "Order processing failed. Stripe may retry this event." }, { status: 500 });
  }
  return NextResponse.json({ received: true });
}
