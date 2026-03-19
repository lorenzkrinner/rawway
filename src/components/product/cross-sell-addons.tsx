"use client";

import { InformationCircleIcon, PlusIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";
import Price from "src/components/price";
import type { CrossSellProduct } from "src/lib/shopify/types";
import { Switch } from "~/components/ui/switch";
import { AddonInfoModal } from "./addon-info-modal";

function AddonRow({
  product,
  enabled,
  onToggle,
}: {
  product: CrossSellProduct;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}) {
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3 rounded-lg border border-border p-3">
        <button
          onClick={() => setInfoOpen(true)}
          className="relative shrink-0"
          aria-label={`More info about ${product.title}`}
        >
          <InformationCircleIcon className="absolute -top-1 -left-1 z-10 size-4 text-muted-foreground" />
          <div className="relative size-14 overflow-hidden rounded-md bg-muted">
            {product.featuredImage.url && (
              <Image
                src={product.featuredImage.url}
                alt={product.featuredImage.altText || product.title}
                fill
                className="object-contain"
                sizes="56px"
              />
            )}
          </div>
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{product.title}</p>
          <Price
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
            className="text-sm text-muted-foreground"
          />
        </div>

        <Switch
          checked={enabled}
          onCheckedChange={onToggle}
          aria-label={`Add ${product.title}`}
        />
      </div>

      <AddonInfoModal
        product={product}
        open={infoOpen}
        onOpenAction={setInfoOpen}
      />
    </>
  );
}

export function CrossSellAddons({
  products,
  enabledIds,
  onToggleAction,
}: {
  products: CrossSellProduct[];
  enabledIds: Set<string>;
  onToggleAction: (productId: string, enabled: boolean) => void;
}) {
  const [showAll, setShowAll] = useState(false);

  if (products.length === 0) return null;

  const visibleProducts = showAll ? products : products.slice(0, 2);
  const hasMore = products.length > 2 && !showAll;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Popular add-ons</h3>

      <div className="space-y-2">
        {visibleProducts.map((product) => (
          <AddonRow
            key={product.id}
            product={product}
            enabled={enabledIds.has(product.id)}
            onToggle={(enabled) => onToggleAction(product.id, enabled)}
          />
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setShowAll(true)}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-muted/50 py-3 text-sm font-medium hover:bg-muted transition-colors"
        >
          Show all add-ons
          <PlusIcon className="size-4" />
        </button>
      )}
    </div>
  );
}
