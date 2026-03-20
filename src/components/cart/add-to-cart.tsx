"use client";

import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useAction } from "next-safe-action/hooks";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { addItems } from "src/components/cart/actions";
import Price from "src/components/price";
import type {
  CrossSellProduct,
  Product,
  ProductVariant,
} from "src/lib/shopify/types";
import { Button } from "~/components/ui/button";
import { useCart } from "./cart-context";

export function AddToCart({
  product,
  enabledAddOns = [],
}: {
  product: Product;
  enabledAddOns?: CrossSellProduct[];
}) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const searchParams = useSearchParams();

  const { execute } = useAction(addItems, {
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to add item to cart");
    },
  });

  const variant = variants.find((v: ProductVariant) =>
    v.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase()),
    ),
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const finalVariant = variants.find((v) => v.id === selectedVariantId);

  const isOutOfStock =
    !availableForSale || (finalVariant && !finalVariant.availableForSale);

  const mainPrice = finalVariant ? parseFloat(finalVariant.price.amount) : 0;
  const addOnTotal = enabledAddOns.reduce(
    (sum, addon) => sum + parseFloat(addon.priceRange.maxVariantPrice.amount),
    0,
  );
  const totalPrice = mainPrice + addOnTotal;
  const currencyCode =
    finalVariant?.price.currencyCode ??
    product.priceRange.maxVariantPrice.currencyCode;

  const handleSubmit = () => {
    if (!selectedVariantId || !finalVariant) return;

    addCartItem(finalVariant, product);

    const lines = [{ merchandiseId: selectedVariantId, quantity: 1 }];
    for (const addon of enabledAddOns) {
      if (addon.firstVariantId) {
        lines.push({ merchandiseId: addon.firstVariantId, quantity: 1 });
      }
    }

    execute({ lines });
  };

  if (isOutOfStock) {
    return (
      <Button
        className="w-full rounded-full py-7 text-sm font-semibold uppercase tracking-wider"
        onClick={() => {
          toast.info("We'll notify you when this product is back in stock.");
        }}
      >
        Notify Me When Available
      </Button>
    );
  }

  if (!selectedVariantId) {
    return (
    <Button
      disabled
      className="w-full rounded-full py-7 text-sm font-semibold uppercase tracking-wider opacity-60"
    >
      <ShoppingCartIcon className="size-5 mr-1" />
      Select an Option
    </Button>
    );
  }

  return (
    <div>
      <form action={handleSubmit}>
        <Button
          type="submit"
          aria-label="Add to cart"
          className="w-full py-7 hover:opacity-90 gap-1"
        >
          <Price
            amount={totalPrice.toString()}
            currencyCode={currencyCode}
            className="inline text-background/80"
          />
          <span className="mx-2 text-background/80">-</span>
          <span className="font-mono text-sm">Add to Cart</span>
        </Button>
      </form>
    </div>
  );
}
