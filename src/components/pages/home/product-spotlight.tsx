import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import Price from "~/components/price";
import type { Product } from "~/lib/shopify/types";

interface ProductSpotlightProps {
  product: Product;
  reverse?: boolean;
}

export function ProductSpotlight({
  product,
  reverse = false,
}: ProductSpotlightProps) {
  return (
    <section className="mx-auto w-full max-w-(--breakpoint-xl) px-6 py-16 md:py-24">
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center ${
          reverse ? "md:direction-rtl" : ""
        }`}
      >
        {/* Product image */}
        <div
          className={`aspect-[4/3] w-full rounded-lg bg-muted overflow-hidden relative ${
            reverse ? "md:direction-ltr" : ""
          }`}
        >
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        {/* Product info */}
        <div
          className={`flex flex-col gap-6 ${reverse ? "md:direction-ltr" : ""}`}
        >
          <div className="flex flex-col gap-3">
            <h2 className="text-4xl md:text-5xl font-bold font-loud uppercase tracking-wide">
              {product.title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {product.description}
            </p>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <Price
              amount={product.priceRange.minVariantPrice.amount}
              currencyCode={product.priceRange.minVariantPrice.currencyCode}
              className="text-2xl font-semibold"
            />
          </div>

          <Link href={`/product/${product.handle}`}>
            <Button className="rounded-full uppercase font-mono py-7 px-8 text-base w-fit">
              Shop Now
              <ArrowRightIcon />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
