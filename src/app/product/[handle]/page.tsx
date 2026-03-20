import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Gallery } from "src/components/product/gallery";
import { ProductDescription } from "src/components/product/product-description";
import { HIDDEN_PRODUCT_TAG } from "src/lib/constants";
import { getProduct } from "src/lib/shopify";
import type { Image } from "src/lib/shopify/types";
import Specs from "~/components/product/sections/specs";

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt,
            },
          ],
        }
      : null,
  };
}

export default async function ProductPage(props: {
  params: Promise<{ handle: string }>;
}) {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    offers: {
      "@type": "AggregateOffer",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount,
    },
  };

  const galleryImages = product.images.map((image: Image) => ({
    src: image.url,
    altText: image.altText,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      <div className="mx-auto max-w-(--breakpoint-xl) px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:gap-12 lg:items-stretch">
          <div className="w-full lg:w-[70%] lg:self-stretch">
            <div className="lg:sticky lg:top-24">
              <Suspense
                fallback={
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted" />
                }
              >
                <Gallery images={galleryImages} />
              </Suspense>
            </div>
          </div>

          <div className="mt-8 w-full lg:mt-0 lg:w-[30%] lg:self-stretch lg:flex">
            <Suspense fallback={null}>
              <ProductDescription product={product} />
            </Suspense>
          </div>
        </div>

        {Boolean(product.custom.keyboard_specs) && <Specs product={product} />}
      </div>
    </>
  );
}
