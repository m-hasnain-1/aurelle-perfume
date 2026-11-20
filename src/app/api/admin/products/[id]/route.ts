import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";
import { productSchema } from "@/lib/validation";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: "Admin access required." }, { status: 401 });
  const { id } = await params;
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }); }
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Product details are invalid.", issues: parsed.error.flatten() }, { status: 400 });
  try {
    const product = await prisma.$transaction(async (transaction) => {
      const updated = await transaction.product.update({
        where: { id },
        data: {
          slug: parsed.data.slug,
          name: parsed.data.name,
          tagline: parsed.data.tagline,
          description: parsed.data.description,
          family: parsed.data.family,
          topNotes: parsed.data.topNotes,
          heartNotes: parsed.data.heartNotes,
          baseNotes: parsed.data.baseNotes,
          imageTone: parsed.data.imageTone,
          featured: parsed.data.featured,
        },
      });
      for (const variant of parsed.data.variants) {
        await transaction.productVariant.upsert({
          where: { productId_sizeMl: { productId: id, sizeMl: variant.sizeMl } },
          create: { ...variant, productId: id, id: `${parsed.data.slug}-${variant.sizeMl}` },
          update: variant,
        });
      }
      return updated;
    });
    return NextResponse.json({ product });
  } catch (error) {
    console.error("Admin product update failed:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Unable to update this product right now." }, { status: 503 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: "Admin access required." }, { status: 401 });
  const { id } = await params;
  try {
    const product = await prisma.product.update({ where: { id }, data: { archivedAt: new Date() } });
    return NextResponse.json({ product });
  } catch (error) {
    console.error("Admin product archive failed:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Unable to archive this product right now." }, { status: 503 });
  }
}
