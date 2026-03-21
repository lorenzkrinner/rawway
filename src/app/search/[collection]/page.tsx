import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductGrid from "~/components/search/product-grid";
import { defaultSort, sorting } from "~/lib/constants";
import { getCollection, getCollectionProducts } from "~/lib/shopify";

export async function generateMetadata(props: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const collection = await getCollection(params.collection);

  if (!collection) return notFound();

  return {
    title: collection.seo?.title || collection.title,
    description:
      collection.seo?.description ||
      collection.description ||
      `${collection.title} products`,
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { sort, minPrice, maxPrice } = searchParams as {
    [key: string]: string;
  };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  let products = await getCollectionProducts({
    collection: params.collection,
    sortKey,
    reverse,
  });

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
    <section>
      {products.length === 0 ? (
        <p className="py-3 text-lg text-muted-foreground">
          No products found in this collection
        </p>
      ) : (
        <ProductGrid products={products} />
      )}
    </section>
  );
}
