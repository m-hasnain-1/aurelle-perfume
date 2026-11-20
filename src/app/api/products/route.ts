import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { filterCatalog } from "@/lib/catalog";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const family = params.get("family") || undefined;
  const sizeValue = params.get("size");
  const priceValue = params.get("maxPrice");
  const sort = params.get("sort") || undefined;
  const size = sizeValue ? Number(sizeValue) : undefined;
  const maxPrice = priceValue ? Number(priceValue) * 100 : undefined;
  if ((size !== undefined && (!Number.isInteger(size) || size < 1 || size > 200)) ||
      (maxPrice !== undefined && (!Number.isFinite(maxPrice) || maxPrice < 0 || maxPrice > 1000000)) ||
      (family !== undefined && !["Amber", "Woody", "Fresh", "Floral"].includes(family)) ||
      (sort !== undefined && !["price-asc", "price-desc"].includes(sort))) {
    return NextResponse.json({ error: "Invalid product filters." }, { status: 400 });
  }
  try {
    const products = await prisma.product.findMany({
      where: {
        archivedAt: null,
        ...(family ? { family } : {}),
        variants: {
          some: {
            stock: { gt: 0 },
            ...(size ? { sizeMl: size } : {}),
            ...(maxPrice !== undefined ? { priceCents: { lte: maxPrice } } : {}),
          },
        },
      },
      include: { variants: { orderBy: { sizeMl: "asc" } } },
    });
    const filtered = filterCatalog(products, { family, size, maxPrice, sort });
    const publicProducts = filtered.map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      tagline: product.tagline,
      description: product.description,
      family: product.family,
      topNotes: product.topNotes,
      heartNotes: product.heartNotes,
      baseNotes: product.baseNotes,
      imageTone: product.imageTone,
      featured: product.featured,
      variants: product.variants.map(({ id, sizeMl, priceCents, stock }) => ({ id, sizeMl, priceCents, stock })),
    }));
    return NextResponse.json({ products: publicProducts });
  } catch (error) {
    console.error("Product listing failed:", error);
    return NextResponse.json({ error: "Unable to load the collection right now." }, { status: 503 });
  }
}
