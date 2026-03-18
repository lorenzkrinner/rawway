import { PlusIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import Price from "~/components/price";
import type { Product } from "~/lib/shopify/types";

interface AccessoriesProps {
  products: Product[];
}

export function Accessories({ products }: AccessoriesProps) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-(--breakpoint-xl) px-6 py-16 md:py-24">
      <h2 className="text-3xl md:text-4xl font-bold font-loud uppercase tracking-wide text-center mb-12">
        Complete your setup
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.handle}`}
            className="group flex flex-col gap-4"
          >
            <div className="aspect-square w-full rounded-lg bg-muted overflow-hidden relative group-hover:opacity-90 transition-opacity">
              <Image
                src={product.featuredImage.url}
                alt={product.featuredImage.altText || product.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="font-medium text-foreground group-hover:underline">
                  {product.title}
                </h3>
                <Price
                  amount={product.priceRange.minVariantPrice.amount}
                  currencyCode={
                    product.priceRange.minVariantPrice.currencyCode
                  }
                  className="text-sm text-muted-foreground"
                />
              </div>

              <Button
                variant="outline"
                size="icon-sm"
                className="rounded-full shrink-0"
              >
                <PlusIcon className="size-4" />
              </Button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
