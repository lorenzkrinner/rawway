"use client";

import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Price from "~/components/price";
import { Button } from "~/components/ui/button";
import type { Product } from "~/lib/shopify/types";

interface AccessoriesProps {
  products: Product[];
}

export function Accessories({ products }: AccessoriesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [thumbWidth, setThumbWidth] = useState(0);
  const isDraggingCarousel = useRef(false);
  const isDraggingScrubber = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);

  const updateProgress = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(0);
      setThumbWidth(100);
      return;
    }
    setScrollProgress(el.scrollLeft / maxScroll);
    setThumbWidth(Math.max((el.clientWidth / el.scrollWidth) * 100, 20));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateProgress();
    el.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      el.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [updateProgress]);

  const onCarouselPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = scrollRef.current;
      if (!el) return;
      isDraggingCarousel.current = true;
      dragStartX.current = e.clientX;
      dragStartScroll.current = el.scrollLeft;
      el.style.cursor = "grabbing";
      el.style.userSelect = "none";
      el.setPointerCapture(e.pointerId);
    },
    [],
  );

  const onCarouselPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingCarousel.current) return;
      const el = scrollRef.current;
      if (!el) return;
      const dx = e.clientX - dragStartX.current;
      el.scrollLeft = dragStartScroll.current - dx;
    },
    [],
  );

  const onCarouselPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = scrollRef.current;
      if (!el) return;
      const wasDragging = isDraggingCarousel.current;
      const dx = Math.abs(e.clientX - dragStartX.current);
      isDraggingCarousel.current = false;
      el.style.cursor = "";
      el.style.userSelect = "";
      el.releasePointerCapture(e.pointerId);
      // If dragged more than 5px, prevent the click on the link
      if (wasDragging && dx > 5) {
        el.addEventListener(
          "click",
          (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
          },
          { once: true, capture: true },
        );
      }
    },
    [],
  );

  // Scrubber drag
  const onScrubberPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      isDraggingScrubber.current = true;
      trackRef.current?.setPointerCapture(e.pointerId);
      scrollToScrubberPosition(e.clientX);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const onScrubberPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingScrubber.current) return;
      scrollToScrubberPosition(e.clientX);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const onScrubberPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      isDraggingScrubber.current = false;
      trackRef.current?.releasePointerCapture(e.pointerId);
    },
    [],
  );

  function scrollToScrubberPosition(clientX: number) {
    const track = trackRef.current;
    const el = scrollRef.current;
    if (!track || !el) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (clientX - rect.left) / rect.width),
    );
    const maxScroll = el.scrollWidth - el.clientWidth;
    el.scrollLeft = ratio * maxScroll;
  }

  if (products.length === 0) return null;

  const thumbLeft = scrollProgress * (100 - thumbWidth);

  return (
    <section className="mx-auto overflow-x-hidden flex gap-4 max-w-full w-full px-8 py-16 md:py-24">
      <div className="flex flex-col gap-8 h-full items-start justify-between">
        <h2 className="text-2xl md:text-4xl font-bold font-loud uppercase tracking-wide w-100">
          Complete your setup
        </h2>
        <Link
          href="/search/accessoires"
        >
          <Button variant={"ghost"}>
            Shop all
            <ArrowRightIcon />
          </Button>
        </Link>
      </div>

      <div className="flex flex-col items-stretch gap-4 w-fit overflow-x-auto">
        <div
          ref={scrollRef}
          className="flex w-full min-w-0 gap-6 overflow-x-auto scrollbar-hide pb-4"
          onPointerDown={onCarouselPointerDown}
          onPointerMove={onCarouselPointerMove}
          onPointerUp={onCarouselPointerUp}
          onPointerCancel={onCarouselPointerUp}
        >
          {products.map((product) => {
            const hoverImage = product.images[1];
            return (
              <Link
                key={product.id}
                href={`/product/${product.handle}`}
                className="group flex flex-col gap-4 shrink-0 w-[280px] sm:w-[320px] lg:w-[360px]"
                draggable={false}
              >
                <div className="aspect-[4/5] w-full bg-muted overflow-hidden relative">
                  <Image
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText || product.title}
                    fill
                    className={`object-cover transition-opacity duration-300 ${hoverImage ? "group-hover:opacity-0" : ""}`}
                    draggable={false}
                  />
                  {hoverImage && (
                    <Image
                      src={hoverImage.url}
                      alt={hoverImage.altText || product.title}
                      fill
                      className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      draggable={false}
                    />
                  )}
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-medium text-foreground group-hover:underline">
                      {product.title}
                    </h3>
                    <Price
                      amount={product.priceRange.minVariantPrice.amount}
                      currencyCode={
                        product.priceRange.minVariantPrice.currencyCode
                      }
                      className="text-sm text-muted-foreground"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <div
          ref={trackRef}
          className="mt-6 h-[6px] select-none touch-none cursor-pointer"
          onPointerDown={onScrubberPointerDown}
          onPointerMove={onScrubberPointerMove}
          onPointerUp={onScrubberPointerUp}
          onPointerCancel={onScrubberPointerUp}
        >
          <div className="h-[2px] bg-muted relative w-1/3">
            <div
              className="absolute top-0 h-full bg-foreground rounded-full transition-[left] duration-75"
              style={{
                width: `${thumbWidth}%`,
                left: `${thumbLeft}%`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
