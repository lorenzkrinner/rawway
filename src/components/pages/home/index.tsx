import { getCollectionProducts } from "~/lib/shopify";
import {
  HOMEPAGE_ACCESSORIES_COLLECTION_HANDLE,
  HOMEPAGE_FEATURED_ITEMS_COLLECTION_HANDLE,
} from "~/constants/shopify";
import Hero from "./hero";
import { ProductSpotlight } from "./product-spotlight";
import { Benefits } from "./benefits";
import { Reviews } from "./reviews";
import { Accessories } from "./accessories";
import { BrandStory } from "./brand-story";
import { FinalCta } from "./final-cta";
import { Separator } from "~/components/ui/separator";

export default async function Home() {
  const [featuredProducts, accessoryProducts] = await Promise.all([
    getCollectionProducts({
      collection: HOMEPAGE_FEATURED_ITEMS_COLLECTION_HANDLE,
    }),
    getCollectionProducts({
      collection: HOMEPAGE_ACCESSORIES_COLLECTION_HANDLE,
    }),
  ]);

  return (
    <div>
      <Hero />

      {featuredProducts.map((product, index) => (
        <div key={product.id}>
          <ProductSpotlight product={product} reverse={index % 2 === 1} />
          {index < featuredProducts.length - 1 && (
            <Separator className="mx-auto max-w-(--breakpoint-xl)" />
          )}
        </div>
      ))}

      <Separator className="mx-auto max-w-(--breakpoint-xl)" />

      <Benefits />

      <Reviews />

      <Separator className="mx-auto max-w-(--breakpoint-xl)" />

      <Accessories products={accessoryProducts} />

      <Separator className="mx-auto max-w-(--breakpoint-xl)" />

      <BrandStory />

      {featuredProducts[0] && (
        <>
          <Separator className="mx-auto max-w-(--breakpoint-xl)" />
          <FinalCta product={featuredProducts[0]} />
        </>
      )}
    </div>
  );
}
