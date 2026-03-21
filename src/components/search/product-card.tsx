import Image from "next/image";
import Link from "next/link";
import Price from "~/components/price";
import { COLOR_SWATCH_MAP } from "~/constants/colors";
import { Product } from "~/lib/shopify/types";

function getColorOption(product: Product) {
  const colorOption = product.options.find(
    (opt) =>
      opt.name.toLowerCase() === "color" || opt.name.toLowerCase() === "colour",
  );
  return colorOption?.values ?? [];
}

export default function ProductCard({ product }: { product: Product }) {
  const colors = getColorOption(product);
  const price = product.priceRange.minVariantPrice;
  const productIdNumeric = product.id.split("/").pop();

  return (
    <div className="group animate-fadeIn">
      <Link href={`/product/${product.handle}`} prefetch={true}>
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted/30">
          {product.featuredImage?.url ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            />
          ) : null}
        </div>
      </Link>

      <div className="mt-3 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Keon
          </p>
          <span
            className="junip-product-summary"
            data-product-id={productIdNumeric}
          />
        </div>

        <Link href={`/product/${product.handle}`} prefetch={true}>
          <h3 className="text-sm font-semibold leading-snug text-foreground">
            {product.title}
          </h3>
        </Link>

        <Price
          amount={price.amount}
          currencyCode={price.currencyCode}
          className="text-sm font-semibold text-foreground"
        />

        {colors.length > 1 ? (
          <div className="flex gap-1.5 pt-1">
            {colors.map((color) => {
              const hex = COLOR_SWATCH_MAP[color.toLowerCase()] ?? "#ccc";
              return (
                <Link
                  key={color}
                  href={`/product/${product.handle}?Color=${encodeURIComponent(color)}`}
                  className="size-5 rounded-full border border-border transition-transform hover:scale-110"
                  style={{ backgroundColor: hex }}
                  title={color}
                />
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
