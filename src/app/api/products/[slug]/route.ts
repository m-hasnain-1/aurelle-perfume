import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const product = await prisma.product.findFirst({
      where: { slug, archivedAt: null },
      select: {
        id: true,
        slug: true,
        name: true,
        tagline: true,
        description: true,
        family: true,
        topNotes: true,
        heartNotes: true,
        baseNotes: true,
        imageTone: true,
        featured: true,
        variants: { orderBy: { sizeMl: "asc" } },
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 20,
          select: { id: true, author: true, rating: true, title: true, body: true, createdAt: true },
        },
      },
    });
    if (!product) return NextResponse.json({ error: "Fragrance not found." }, { status: 404 });
    return NextResponse.json({ product });
  } catch (error) {
    console.error("Product detail lookup failed:", error);
    return NextResponse.json({ error: "Unable to load this fragrance right now." }, { status: 503 });
  }
}
