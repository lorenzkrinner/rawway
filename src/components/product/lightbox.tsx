"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Dialog, DialogContent } from "~/components/ui/dialog";

export function Lightbox({
  images,
  initialIndex,
  open,
  onOpenAction,
}: {
  images: { src: string; altText: string }[];
  initialIndex: number;
  open: boolean;
  onOpenAction: (open: boolean) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomed, setZoomed] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState("center center");
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
      setZoomed(false);
    }
  }, [open, initialIndex]);

  const currentImage = images[currentIndex];
  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex < images.length - 1;

  const goLeft = useCallback(() => {
    if (canGoLeft) {
      setCurrentIndex((i) => i - 1);
      setZoomed(false);
    }
  }, [canGoLeft]);

  const goRight = useCallback(() => {
    if (canGoRight) {
      setCurrentIndex((i) => i + 1);
      setZoomed(false);
    }
  }, [canGoRight]);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoomed) {
      setZoomed(false);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setTransformOrigin(`${x}% ${y}%`);
    setZoomed(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setTransformOrigin(`${x}% ${y}%`);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenAction(v);
        if (!v) setZoomed(false);
      }}
    >
      <DialogContent
        className="min-w-[90dvw] w-full h-[90vh] flex flex-col p-0 gap-0 bg-muted"
        showCloseButton
      >
        <div
          ref={imageContainerRef}
          className="relative flex-1 overflow-hidden"
          style={{ cursor: zoomed ? "zoom-out" : "zoom-in" }}
          onClick={handleImageClick}
          onMouseMove={handleMouseMove}
        >
          {currentImage && (
            <Image
              src={currentImage.src}
              alt={currentImage.altText}
              fill
              className="object-contain transition-transform duration-200"
              style={{
                transform: zoomed ? "scale(2.5)" : "scale(1)",
                transformOrigin,
              }}
              sizes="90vw"
              priority
            />
          )}
        </div>

        {images.length > 1 && (
          <div className="flex items-center justify-center gap-4 py-3 border-t">
            <button
              onClick={goLeft}
              disabled={!canGoLeft}
              className="p-2 rounded-full hover:bg-muted disabled:opacity-30 disabled:cursor-default transition-colors"
              aria-label="Previous image"
            >
              <ArrowLeftIcon className="size-5" />
            </button>
            <span className="text-sm text-muted-foreground tabular-nums">
              {currentIndex + 1} / {images.length}
            </span>
            <button
              onClick={goRight}
              disabled={!canGoRight}
              className="p-2 rounded-full hover:bg-muted disabled:opacity-30 disabled:cursor-default transition-colors"
              aria-label="Next image"
            >
              <ArrowRightIcon className="size-5" />
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
