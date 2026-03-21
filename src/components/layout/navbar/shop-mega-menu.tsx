"use client";

import Image from "next/image";
import Link from "next/link";
import type { Collection, Product } from "src/lib/shopify/types";
import { cn } from "~/lib/cn";

function visibleMegaMenuCollections(collections: Collection[]) {
  return collections.filter(
    (c) => !c.handle.toLowerCase().startsWith("hidden"),
  );
}

function MegaFeaturedProductCard({ product }: { product: Product }) {
  const image = product.images[1] ?? product.images[0];
  if (!image) {
    return null;
  }

  const href = `/product/${product.handle}`;

  return (
    <Link
      href={href}
      prefetch={true}
      className={cn("relative group block min-w-0 bg-muted/40 flex-1")}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden bg-muted/30 aspect-square",
        )}
      >
        <Image
          src={image.url}
          alt={image.altText}
          width={image.width}
          height={image.height}
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
        />
        <p
          className={cn(
            "absolute bottom-0 left-0 px-3 py-3 font-semibold tracking-tight text-foreground",
          )}
        >
          {product.title}
        </p>
      </div>
    </Link>
  );
}

export function ShopMegaMenu({
  collections,
  originalSeriesProducts,
}: {
  collections: Collection[];
  originalSeriesProducts: Product[];
}) {
  const visible = visibleMegaMenuCollections(collections).filter(
    (c) => c.handle !== "all",
  );
  const featured = originalSeriesProducts.slice(0, 2);

  return (
    <div className="mx-auto flex max-w-7xl gap-10 px-6 py-8">
      <div className="flex flex-col gap-4 w-[42%] shrink-0">
        <h3 className="text-sm font-semibold text-foreground mb-2">
          Shop by Collection
        </h3>
        <ul className="flex flex-col gap-2">
          {visible.map((c) => (
            <li key={c.handle || "all"}>
              <Link
                href={c.path}
                prefetch={true}
                className="text-foreground/70 transition-colors hover:text-foreground"
              >
                {c.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex min-w-0 flex-1 gap-4">
        {featured[0] ? <MegaFeaturedProductCard product={featured[0]} /> : null}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {featured[1] ? (
            <MegaFeaturedProductCard product={featured[1]} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
