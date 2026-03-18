import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import Price from "~/components/price";
import type { Product } from "~/lib/shopify/types";

interface FinalCtaProps {
  product: Product;
}

export function FinalCta({ product }: FinalCtaProps) {
  return (
    <section className="mx-auto w-full max-w-(--breakpoint-xl) px-6 py-16 md:py-24">
      <div className="flex flex-col items-center text-center gap-6">
        {/* Image placeholder */}
        <div className="aspect-[16/9] w-full max-w-xl rounded-lg bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-sm">
            Product image — clean studio shot
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold font-loud uppercase tracking-wide">
          {product.title}
        </h2>

        <Price
          amount={product.priceRange.minVariantPrice.amount}
          currencyCode={product.priceRange.minVariantPrice.currencyCode}
          className="text-2xl font-semibold"
        />

        <Link href={`/product/${product.handle}`}>
          <Button className="rounded-full uppercase font-mono py-7 px-10 text-base">
            Order Now
            <ArrowRightIcon />
          </Button>
        </Link>
      </div>
    </section>
  );
}
