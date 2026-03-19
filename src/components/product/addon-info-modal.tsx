"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";
import type { CrossSellProduct } from "src/lib/shopify/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "../ui/button";

export function AddonInfoModal({
  product,
  open,
  onOpenAction,
}: {
  product: CrossSellProduct;
  open: boolean;
  onOpenAction: (open: boolean) => void;
}) {
  const [imageIndex, setImageIndex] = useState(0);

  const images =
    product.images.length > 0
      ? product.images
      : product.featuredImage.url
        ? [product.featuredImage]
        : [];

  const canGoLeft = imageIndex > 0;
  const canGoRight = imageIndex < images.length - 1;

  return (
    <Dialog open={open} onOpenChange={onOpenAction}>
      <DialogContent className="max-w-2xl sm:max-w-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {product.title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
              {images[imageIndex] && (
                <Image
                  src={images[imageIndex]!.url}
                  alt={images[imageIndex]!.altText || product.title}
                  fill
                  className="object-contain"
                  sizes="300px"
                />
              )}
            </div>

            {images.length > 1 && (
              <div className="flex items-center justify-center gap-3">
                <Button
                  onClick={() => canGoLeft && setImageIndex((i) => i - 1)}
                  variant="ghost"
                  size="icon-sm"
                  disabled={!canGoLeft}
                  className="rounded-full"
                  aria-label="Previous image"
                >
                  <ArrowLeftIcon className="size-4" />
                </Button>
                <Button
                  onClick={() => canGoRight && setImageIndex((i) => i + 1)}
                  variant="ghost"
                  size="icon-sm"
                  disabled={!canGoRight}
                  className="rounded-full"
                  aria-label="Next image"
                >
                  <ArrowRightIcon className="size-4" />
                </Button>
              </div>
            )}
          </div>

          <div>
            {product.featureBullets.length > 0 ? (
              <ul className="space-y-2.5">
                {product.featureBullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-foreground" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            ) : product.description ? (
              <p className="text-sm text-muted-foreground">
                {product.description}
              </p>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
