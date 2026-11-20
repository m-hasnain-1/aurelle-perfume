import { z } from "zod";

export const checkoutSchema = z.object({
  email: z.string().email().max(254),
  items: z
    .array(
      z.object({
        variantId: z.string().min(1).max(80),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1)
    .max(30),
});

export const productSchema = z.object({
  slug: z.string().trim().min(2).max(60).regex(/^[a-z0-9-]+$/),
  name: z.string().trim().min(2).max(80),
  tagline: z.string().trim().min(4).max(120),
  description: z.string().trim().min(20).max(2000),
  family: z.enum(["Amber", "Woody", "Fresh", "Floral"]),
  topNotes: z.string().trim().min(2).max(80),
  heartNotes: z.string().trim().min(2).max(80),
  baseNotes: z.string().trim().min(2).max(80),
  imageTone: z.enum(["amber", "plum", "sage", "rose"]),
  featured: z.boolean().default(false),
  variants: z
    .array(
      z.object({
        sizeMl: z.number().int().min(10).max(200),
        priceCents: z.number().int().min(1000).max(100000),
        stock: z.number().int().min(0).max(10000),
      }),
    )
    .min(1)
    .max(8),
});
