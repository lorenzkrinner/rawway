"use client";

import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Price from "~/components/price";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/cn";
import type { Product } from "~/lib/shopify/types";

interface ProductSpotlightProps {
  products: Product[];
}

export function ProductSpotlight({ products }: ProductSpotlightProps) {
  return (
    <section className="flex w-full px-8 gap-8 pb-20 pt-8">
      {products.slice(0, 2).map((product) => {
        return (
          <ProductSpotlightCard
            key={product.id}
            product={product}
          />
        );
      })}
    </section>
  );
}

function ProductSpotlightCard({
  product,
}: {
  product: Product;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const primaryImage = product.featuredImage;
  const hoverImage = product.images[1];

  return (
    <Link
      href={`/product/${product.handle}`}
      className={`flex w-full flex-col justify-between items-center min-h-[700px] bg-background text-foreground`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      <div className="relative w-full h-full">
        <div className={cn("absolute top-4 left-4 right-4 text-center z-10 flex items-center justify-between text-sm text-background transition-colors duration-500 ease-in-out", isHovered && "text-muted-foreground")}>
          {/* <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            {product.title}
          </h2> */}
          <p>Keyboard</p>
          <p>{product.title}</p>
        </div>
        <Image
          src={primaryImage.url}
          alt={primaryImage.altText || product.title}
          fill
          sizes="50vw"
          className={`object-cover object-top transition-opacity duration-500 ease-in-out absolute inset-0 ${
            isHovered && hoverImage ? "opacity-0" : "opacity-100"
          }`}
        />
        {hoverImage && (
          <Image
            src={hoverImage.url}
            alt={hoverImage.altText || `${product.title} preview`}
            fill
            sizes="50vw"
            className={`object-cover transition-opacity duration-500 ease-in-out ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
      </div>

      <div className="w-full flex items-center justify-between px-6 py-5 min-h-20 bg-muted z-10 border">
        <div className="flex flex-col *:items-start gap-1">
          <Price
            amount={product.priceRange.minVariantPrice.amount}
            currencyCode={product.priceRange.minVariantPrice.currencyCode}
          />
          <p className="text-xs text-muted-foreground/80 text-balance max-w-4/5">
            {product.description}
          </p>
        </div>
        <Button className="font-mono text-sm font-normal rounded-full py-6 px-10">
          Buy now
          <ArrowRightIcon />
        </Button>
      </div>
    </Link>
  );
}
