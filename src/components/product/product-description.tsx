"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { AddToCart } from "src/components/cart/add-to-cart";
import Price from "src/components/price";
import type { Product, ProductVariant } from "src/lib/shopify/types";
import { trustBarItems } from "~/constants/trust";
import { TrustpilotRatedBy } from "../trustpilot";
import { CrossSellAddons } from "./cross-sell-addons";
import { ProductFaq } from "./product-faq";
import { VariantSelector } from "./variant-selector";

function StockIndicator({ variant }: { variant: ProductVariant | undefined }) {
  if (!variant) return null;

  return (
    <div className="flex items-center justify-between w-full -mb-2">
      {!variant.availableForSale ? (
        <div className="flex items-center gap-2">
          <div className="size-2.5 rounded-full bg-red-500" />
          <span className="text-sm font-medium text-red-600">Out of stock</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="size-2.5 rounded-full bg-green-500" />
          <span className="text-sm font-medium text-green-600">In stock</span>
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Shipping calculated at checkout
      </p>
    </div>
  );
}

function TrustIconsRow() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 -my-2">
      {trustBarItems.slice(1, 3).map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-1.5 text-sm text-muted-foreground"
        >
          <item.icon className="size-4" />
          <span className="font-medium">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function ProductDescription({ product }: { product: Product }) {
  const searchParams = useSearchParams();
  const [enabledAddonIds, setEnabledAddonIds] = useState<Set<string>>(
    new Set(),
  );

  const variant = product.variants.find((v: ProductVariant) =>
    v.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase()),
    ),
  );
  const defaultVariantId =
    product.variants.length === 1 ? product.variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const selectedVariant = product.variants.find(
    (v) => v.id === selectedVariantId,
  );

  const enabledAddOns = useMemo(
    () => product.crossSellProducts.filter((p) => enabledAddonIds.has(p.id)),
    [product.crossSellProducts, enabledAddonIds],
  );

  const handleAddonToggle = useCallback(
    (productId: string, enabled: boolean) => {
      setEnabledAddonIds((prev) => {
        const next = new Set(prev);
        if (enabled) {
          next.add(productId);
        } else {
          next.delete(productId);
        }
        return next;
      });
    },
    [],
  );

  return (
    <div className="relative flex h-full flex-col gap-8 pt-8 pb-6 lg:pb-6">
      <div>
        <TrustpilotRatedBy />
        <h1 className="text-4xl font-medium font-loud leading-tight">
          {product.title}
        </h1>
        {selectedVariant && (
          <Price
            amount={selectedVariant.price.amount}
            currencyCode={selectedVariant.price.currencyCode}
            className="text-xl font-medium"
          />
        )}
      </div>

      <div>
        <VariantSelector
          options={product.options}
          variants={product.variants}
        />
        {product.description && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-5">
        <ProductFaq faqItems={product.faqItems} />
        {product.crossSellProducts.length > 0 && (
          <CrossSellAddons
            products={product.crossSellProducts}
            enabledIds={enabledAddonIds}
            onToggleAction={handleAddonToggle}
          />
        )}
      </div>

      <div className="mt-auto flex flex-col gap-5 bg-background lg:sticky lg:bottom-0 py-4 pb-8">
        <StockIndicator variant={selectedVariant} />
        <AddToCart product={product} enabledAddOns={enabledAddOns} />
        <TrustIconsRow />
      </div>
    </div>
  );
}
