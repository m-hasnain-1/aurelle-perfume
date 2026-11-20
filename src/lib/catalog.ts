export type CatalogVariant = {
  id: string;
  sizeMl: number;
  priceCents: number;
  stock: number;
};

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  family: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  imageTone: string;
  featured: boolean;
  variants: CatalogVariant[];
};

export const catalog: CatalogProduct[] = [
  {
    id: "solenne",
    slug: "solenne",
    name: "Solenne",
    tagline: "A warmth that lingers.",
    description:
      "Golden light through an open window. Solenne layers luminous neroli over soft iris and a quiet, enveloping amber.",
    family: "Amber",
    topNotes: "Neroli",
    heartNotes: "Soft iris",
    baseNotes: "Warm amber",
    imageTone: "amber",
    featured: true,
    variants: [
      { id: "solenne-30", sizeMl: 30, priceCents: 9200, stock: 18 },
      { id: "solenne-75", sizeMl: 75, priceCents: 16800, stock: 24 },
    ],
  },
  {
    id: "noctelle",
    slug: "noctelle",
    name: "Noctelle",
    tagline: "The quiet after dusk.",
    description:
      "A velvet evening of black tea, smoked fig, and cedar. Intimate and composed, with a soft trail that stays close.",
    family: "Woody",
    topNotes: "Black tea",
    heartNotes: "Smoked fig",
    baseNotes: "Cedar",
    imageTone: "plum",
    featured: true,
    variants: [
      { id: "noctelle-30", sizeMl: 30, priceCents: 9800, stock: 14 },
      { id: "noctelle-75", sizeMl: 75, priceCents: 17600, stock: 20 },
    ],
  },
  {
    id: "eau-d-aube",
    slug: "eau-d-aube",
    name: "Eau d'Aube",
    tagline: "First light, distilled.",
    description:
      "A fresh beginning: bergamot and crushed green leaves settle into delicate white musk and sun-warmed skin.",
    family: "Fresh",
    topNotes: "Bergamot",
    heartNotes: "Green leaves",
    baseNotes: "White musk",
    imageTone: "sage",
    featured: true,
    variants: [
      { id: "eau-d-aube-30", sizeMl: 30, priceCents: 8800, stock: 22 },
      { id: "eau-d-aube-75", sizeMl: 75, priceCents: 15900, stock: 16 },
    ],
  },
  {
    id: "velours-rose",
    slug: "velours-rose",
    name: "Velours Rose",
    tagline: "A softer kind of bloom.",
    description:
      "Petals with a point of view. Damask rose and pink pepper are grounded by polished sandalwood and skin musk.",
    family: "Floral",
    topNotes: "Pink pepper",
    heartNotes: "Damask rose",
    baseNotes: "Sandalwood",
    imageTone: "rose",
    featured: false,
    variants: [
      { id: "velours-rose-30", sizeMl: 30, priceCents: 9600, stock: 12 },
      { id: "velours-rose-75", sizeMl: 75, priceCents: 17200, stock: 9 },
    ],
  },
];

export function filterCatalog(
  products: CatalogProduct[],
  filters: { family?: string; maxPrice?: number; size?: number; sort?: string },
) {
  let result = products.filter((product) => {
    const variants = product.variants.filter(
      (variant) =>
        variant.stock > 0 &&
        (filters.size === undefined || variant.sizeMl === filters.size) &&
        (filters.maxPrice === undefined || variant.priceCents <= filters.maxPrice),
    );
    return (
      (filters.family === undefined || product.family === filters.family) &&
      variants.length > 0
    );
  });
  if (filters.sort === "price-asc") {
    result = [...result].sort(
      (a, b) => selectedPrice(a, filters.size) - selectedPrice(b, filters.size),
    );
  } else if (filters.sort === "price-desc") {
    result = [...result].sort(
      (a, b) => selectedPrice(b, filters.size) - selectedPrice(a, filters.size),
    );
  }
  return result;
}

function selectedPrice(product: CatalogProduct, size?: number) {
  const variants = product.variants.filter((variant) => variant.stock > 0);
  return (variants.find((variant) => variant.sizeMl === size) ?? variants[0]).priceCents;
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
