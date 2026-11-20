import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";
import { productSchema } from "@/lib/validation";

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: "Admin access required." }, { status: 401 });
  try {
    const products = await prisma.product.findMany({ include: { variants: { orderBy: { sizeMl: "asc" } } }, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Admin product list failed:", error);
    return NextResponse.json({ error: "Unable to load products." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: "Admin access required." }, { status: 401 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }); }
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Product details are invalid.", issues: parsed.error.flatten() }, { status: 400 });
  try {
    const product = await prisma.product.create({
      data: {
        id: parsed.data.slug,
        ...parsed.data,
        variants: { create: parsed.data.variants.map((variant) => ({ ...variant, id: `${parsed.data.slug}-${variant.sizeMl}` })) },
      },
      include: { variants: true },
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Admin product creation failed:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "A product with that slug or size already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Unable to create the product right now." }, { status: 503 });
  }
}
