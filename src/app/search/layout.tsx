import { Suspense } from "react";
import { TrustpilotReviews } from "~/components/pages/home/trustpilot-reviews";
import SearchLayoutClient from "~/components/search/search-layout-client";
import SpringSaleBanner from "~/components/search/spring-sale-banner";
import { getCollections, getProducts } from "~/lib/shopify";
import ChildrenWrapper from "./children-wrapper";

async function SearchLayoutServer({ children }: { children: React.ReactNode }) {
  const [collections, products] = await Promise.all([
    getCollections(),
    getProducts({}),
  ]);

  const prices = products.map((p) => parseFloat(p.priceRange.minVariantPrice.amount));
  const priceRange = {
    min: prices.length > 0 ? Math.floor(Math.min(...prices)) : 0,
    max: prices.length > 0 ? Math.ceil(Math.max(...prices)) : 200,
  };

  return (
    <SearchLayoutClient
      collections={collections}
      priceRange={priceRange}
      resultsCount={products.length}
    >
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </SearchLayoutClient>
  );
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-(--breakpoint-2xl) pt-10 text-foreground">
      <div className="px-8">
        <SpringSaleBanner />
        <div className="my-8">
          <Suspense fallback={null}>
            <SearchLayoutServer>{children}</SearchLayoutServer>
          </Suspense>
        </div>
      </div>
      <TrustpilotReviews />
    </div>
  );
}
