import { Metadata } from "next";
import ProductGrid from "~/components/search/product-grid";
import { defaultSort, sorting } from "~/lib/constants";
import { getProducts } from "~/lib/shopify";

export const metadata: Metadata = {
  title: "Search | Keon",
  description: "Search for products in the store.",
  openGraph: {
    type: "website",
  },
};

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const {
    sort,
    q: searchValue,
    minPrice,
    maxPrice,
  } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  let products = await getProducts({ sortKey, reverse, query: searchValue });

  if (minPrice) {
    products = products.filter(
      (p) =>
        parseFloat(p.priceRange.minVariantPrice.amount) >= parseFloat(minPrice),
    );
  }
  if (maxPrice) {
    products = products.filter(
      (p) =>
        parseFloat(p.priceRange.minVariantPrice.amount) <= parseFloat(maxPrice),
    );
  }

  return (
    <>
      {searchValue ? (
        <p className="mb-6 text-sm text-muted-foreground">
          {products.length === 0
            ? "There are no products that match "
            : `Showing ${products.length} ${products.length === 1 ? "result" : "results"} for `}
          <span className="font-semibold text-foreground">
            &quot;{searchValue}&quot;
          </span>
        </p>
      ) : null}
      {products.length > 0 ? <ProductGrid products={products} /> : null}
    </>
  );
}
