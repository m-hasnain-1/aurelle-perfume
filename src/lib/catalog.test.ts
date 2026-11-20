import { describe, expect, it } from "vitest";
import { catalog, filterCatalog } from "./catalog";

describe("product filtering", () => {
  it("combines scent family, size, and price filters", () => {
    const results = filterCatalog(catalog, { family: "Amber", size: 30, maxPrice: 10000 });
    expect(results.map((product) => product.slug)).toEqual(["solenne"]);
  });

  it("sorts by the chosen size's price without mutating the catalog", () => {
    const original = catalog.map((product) => product.slug);
    const results = filterCatalog(catalog, { size: 75, sort: "price-asc" });
    expect(results.map((product) => product.slug)).toEqual(["eau-d-aube", "solenne", "velours-rose", "noctelle"]);
    expect(catalog.map((product) => product.slug)).toEqual(original);
  });
});
