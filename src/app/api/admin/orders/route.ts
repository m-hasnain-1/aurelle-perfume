import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: "Admin access required." }, { status: 401 });
  try {
    const orders = await prisma.order.findMany({
      select: {
        id: true,
        email: true,
        status: true,
        subtotalCents: true,
        createdAt: true,
        items: { select: { productName: true, sizeMl: true, quantity: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Admin orders lookup failed:", error);
    return NextResponse.json({ error: "Unable to load orders." }, { status: 503 });
  }
}
