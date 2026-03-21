import { Product } from "~/lib/shopify/types";

export default function JunipReviews({ product }: { product: Product }) {
  const productId = product.id.split("/").pop();

  if (!productId) return null;

  return (
    <section className="px-6 bg-muted py-16 md:py-24 items-start w-full">
      <div className="flex flex-col gap-4 max-w-7xl mx-auto">
        <h2 className="text-4xl font-medium font-loud text-start">Reviews</h2>
        <span
          className="junip-product-review"
          data-product-id={productId}
        ></span>
      </div>
    </section>
  );
}
