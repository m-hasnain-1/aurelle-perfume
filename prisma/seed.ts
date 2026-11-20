import { PrismaClient } from "@prisma/client";
import { catalog } from "../src/lib/catalog";

const prisma = new PrismaClient();

async function main() {
  for (const product of catalog) {
    await prisma.product.upsert({
      where: { id: product.id },
      create: {
        ...product,
        variants: { create: product.variants },
      },
      update: {
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
        variants: {
          upsert: product.variants.map((variant) => ({
            where: { productId_sizeMl: { productId: product.id, sizeMl: variant.sizeMl } },
            create: variant,
            update: { priceCents: variant.priceCents, stock: variant.stock },
          })),
        },
      },
    });
  }
  const reviews = [
    { id: "solenne-review-1", productId: "solenne", author: "M. L.", rating: 5, title: "Soft, but memorable", body: "A warm, easy fragrance that feels thoughtful without asking for attention." },
    { id: "noctelle-review-1", productId: "noctelle", author: "A. R.", rating: 5, title: "My evening ritual", body: "The tea and wood notes are beautiful. It wears close and lasts through the night." },
  ];
  for (const review of reviews) {
    await prisma.review.upsert({ where: { id: review.id }, create: review, update: review });
  }
}

main()
  .then(() => console.log("AURELLE sample catalog seeded."))
  .catch((error: unknown) => {
    console.error("Could not seed the AURELLE catalog:", error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
