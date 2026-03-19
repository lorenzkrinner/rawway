import {
  HOMEPAGE_ACCESSORIES_COLLECTION_HANDLE,
  HOMEPAGE_FEATURED_ITEMS_COLLECTION_HANDLE,
} from "~/constants/shopify";
import { getCollectionProducts } from "~/lib/shopify";
import { Accessories } from "./accessories";
import { BrandStory } from "./brand-story";
import Hero from "./hero";
import { ProductSpotlight } from "./product-spotlight";
import { Spirit } from "./spirit";
import { TrustpilotReviews } from "./trustpilot-reviews";

export default async function Home() {
  const [featuredProducts, accessoryProducts] = await Promise.all([
    getCollectionProducts({
      collection: HOMEPAGE_FEATURED_ITEMS_COLLECTION_HANDLE,
    }),
    getCollectionProducts({
      collection: HOMEPAGE_ACCESSORIES_COLLECTION_HANDLE,
    }),
  ]);

  console.log(featuredProducts);

  return (
    <div>
      <Hero />

      <div className="flex flex-col max-w-(--breakpoint-2xl) mx-auto">
        <ProductSpotlight products={featuredProducts} />
        <TrustpilotReviews />
        <Accessories products={accessoryProducts} />
        <Spirit />
        <BrandStory />
      </div>
    </div>
  );
}
