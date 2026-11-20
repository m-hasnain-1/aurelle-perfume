import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { catalog, type CatalogProduct } from "@/lib/catalog";
import { ProductDetail } from "@/components/product-detail";

export const dynamic = "force-dynamic";
type Review = { id: string; author: string; rating: number; title: string; body: string };

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let product: CatalogProduct | null = null;
  let reviews: Review[] = [];
  if (process.env.DATABASE_URL) {
    const record = await prisma.product.findFirst({
      where: { slug, archivedAt: null },
      include: {
        variants: { orderBy: { sizeMl: "asc" } },
        reviews: { orderBy: { createdAt: "desc" }, take: 20, select: { id: true, author: true, rating: true, title: true, body: true } },
      },
    });
    if (record) {
      product = {
        id: record.id,
        slug: record.slug,
        name: record.name,
        tagline: record.tagline,
        description: record.description,
        family: record.family,
        topNotes: record.topNotes,
        heartNotes: record.heartNotes,
        baseNotes: record.baseNotes,
        imageTone: record.imageTone,
        featured: record.featured,
        variants: record.variants.map(({ id, sizeMl, priceCents, stock }) => ({ id, sizeMl, priceCents, stock })),
      };
      reviews = record.reviews;
    }
  } else {
    product = catalog.find((item) => item.slug === slug) ?? null;
  }
  if (!product || !product.variants.length) notFound();
  return <ProductDetail product={product} reviews={reviews} />;
}
