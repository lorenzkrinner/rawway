"use server";

import { getProducts } from "src/lib/shopify";
import { Product } from "src/lib/shopify/types";

export async function searchProducts(query: string): Promise<Product[]> {
  if (!query.trim()) return [];
  return getProducts({ query, sortKey: "RELEVANCE" });
}
