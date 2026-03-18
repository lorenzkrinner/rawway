"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import { useAction } from "next-safe-action/hooks";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { addItem } from "src/components/cart/actions";
import { Product, ProductVariant } from "src/lib/shopify/types";
import { Button } from "~/components/ui/button";
import { useCart } from "./cart-context";

function SubmitButton({
  availableForSale,
  selectedVariantId,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
}) {
  if (!availableForSale) {
    return (
      <Button
        disabled
        className="w-full rounded-full p-4 tracking-wide opacity-60"
      >
        Out Of Stock
      </Button>
    );
  }

  if (!selectedVariantId) {
    return (
      <Button
        aria-label="Please select an option"
        disabled
        className="relative w-full rounded-full p-4 tracking-wide opacity-60"
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Add To Cart
      </Button>
    );
  }

  return (
    <Button
      aria-label="Add to cart"
      className="relative w-full rounded-full p-4 tracking-wide hover:opacity-90"
    >
      <div className="absolute left-0 ml-4">
        <PlusIcon className="h-5" />
      </div>
      Add To Cart
    </Button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const searchParams = useSearchParams();

  const { execute } = useAction(addItem, {
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to add item to cart");
    },
  });

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase()),
    ),
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId,
  )!;

  return (
    <form
      action={async () => {
        addCartItem(finalVariant, product);
        execute({ selectedVariantId: selectedVariantId! });
      }}
    >
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
      />
    </form>
  );
}
