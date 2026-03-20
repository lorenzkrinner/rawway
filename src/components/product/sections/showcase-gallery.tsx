"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useCallback, useState } from "react";
import type { Image as ShopifyImage } from "~/lib/shopify/types";

export default function ShowcaseGallery({ images }: { images: ShopifyImage[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <section className="relative h-[90dvh] w-full overflow-hidden my-16 lg:my-24">
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div
            key={image.url}
            className="relative h-full w-full shrink-0"
          >
            <Image
              src={image.url}
              alt={image.altText}
              fill
              sizes="100vw"
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-8 right-8 flex gap-3">
          <button
            onClick={goToPrevious}
            aria-label="Previous image"
            className="flex size-12 items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur-sm transition-colors hover:bg-background"
          >
            <ChevronLeftIcon className="size-5" />
          </button>
          <button
            onClick={goToNext}
            aria-label="Next image"
            className="flex size-12 items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur-sm transition-colors hover:bg-background"
          >
            <ChevronRightIcon className="size-5" />
          </button>
        </div>
      )}
    </section>
  );
}
