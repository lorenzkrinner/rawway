"use client";

import { MagnifyingGlassPlusIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { GridTileImage } from "src/components/grid/tile";
import { Button } from "../ui/button";
import { Lightbox } from "./lightbox";

function filterImagesByVariant(
  images: { src: string; altText: string }[],
  selectedOptions: Record<string, string>,
): { src: string; altText: string }[] {
  if (Object.keys(selectedOptions).length === 0) return images;

  const tagged: { src: string; altText: string }[] = [];
  const shared: { src: string; altText: string }[] = [];

  for (const img of images) {
    const pipeIndex = img.altText.indexOf("|");
    if (pipeIndex === -1) {
      shared.push(img);
      continue;
    }

    const tag = img.altText.substring(0, pipeIndex).trim();
    const colonIndex = tag.indexOf(":");
    if (colonIndex === -1) {
      shared.push(img);
      continue;
    }

    const optionName = tag.substring(0, colonIndex).toLowerCase();
    const optionValue = tag.substring(colonIndex + 1).toLowerCase();
    const selectedValue = selectedOptions[optionName]?.toLowerCase();

    if (selectedValue && selectedValue === optionValue) {
      tagged.push({
        ...img,
        altText: img.altText.substring(pipeIndex + 1).trim(),
      });
    }
  }

  return tagged.length > 0 ? [...tagged, ...shared] : images;
}

const LEFT_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='31.5' fill='white'/%3E%3Cpath d='M35 24l-8 8 8 8' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") 32 32, pointer`;
const RIGHT_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='31.5' fill='white'/%3E%3Cpath d='M29 24l8 8-8 8' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") 32 32, pointer`;

export function Gallery({
  images: allImages,
}: {
  images: { src: string; altText: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [hoverSide, setHoverSide] = useState<"left" | "right" | null>(null);

  const selectedOptions = useMemo(() => {
    const opts: Record<string, string> = {};
    searchParams.forEach((v, k) => {
      if (k !== "image") opts[k] = v;
    });
    return opts;
  }, [searchParams]);

  const images = useMemo(
    () => filterImagesByVariant(allImages, selectedOptions),
    [allImages, selectedOptions],
  );

  const imageIndex = searchParams.has("image")
    ? parseInt(searchParams.get("image")!)
    : 0;

  const safeIndex =
    images.length > 0
      ? ((imageIndex % images.length) + images.length) % images.length
      : 0;

  const updateImage = useCallback(
    (index: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("image", index.toString());
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const handleMainClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (images.length <= 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const midpoint = rect.width / 2;

    if (clickX < midpoint) {
      updateImage((safeIndex - 1 + images.length) % images.length);
    } else {
      updateImage((safeIndex + 1) % images.length);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (images.length <= 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const midpoint = rect.width / 2;
    setHoverSide(x < midpoint ? "left" : "right");
  };

  const getCursor = () => {
    if (images.length <= 1) return "default";
    if (!hoverSide) return "default";
    return hoverSide === "left" ? LEFT_CURSOR : RIGHT_CURSOR;
  };

  return (
    <>
      <div className="flex gap-3">
        {images.length > 1 && (
          <ul className="flex flex-col gap-2 overflow-y-auto scrollbar-hide py-1 w-fit">
            {images.map((image, index) => {
              const isActive = index === safeIndex;
              return (
                <li key={image.src} className="size-20 shrink-0 max-w-20 w-fit">
                  <button
                    onClick={() => updateImage(index)}
                    aria-label={`Select image ${index + 1}`}
                    className="h-full w-full"
                  >
                    <GridTileImage
                      className="w-full"
                      alt={image.altText}
                      src={image.src}
                      width={120}
                      height={120}
                      active={isActive}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <div
          className="relative aspect-square shrink-0 w-full overflow-hidden rounded-lg bg-muted max-w-3xl"
          style={{ cursor: getCursor() }}
          onClick={handleMainClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverSide(null)}
        >
          {images[safeIndex] && (
            <Image
              className="h-full object-contain w-full "
              fill
              alt={images[safeIndex]!.altText}
              src={images[safeIndex]!.src}
              priority={true}
            />
          )}

          <Button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(true);
            }}
            className="absolute top-3 right-3 z-10 size-10 rounded-full"
            variant="ghost"
            size="icon-sm"
            aria-label="Zoom image"
          >
            <MagnifyingGlassPlusIcon className="size-5" />
          </Button>
        </div>
      </div>

      <Lightbox
        images={images}
        initialIndex={safeIndex}
        open={lightboxOpen}
        onOpenAction={setLightboxOpen}
      />
    </>
  );
}
