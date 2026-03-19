"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const IMAGES = [
  {
    src: "/images/spirit/1.png",
    alt: "Entrepreneur working late with Keon keyboard",
  },
  { src: "/images/spirit/2.png", alt: "Keon keyboard on a minimal desk setup" },
  { src: "/images/spirit/3.png", alt: "Close-up of Keon keyboard in use" },
  { src: "/images/spirit/4.png", alt: "Keon keyboard at a startup workspace" },
];

export function Spirit() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const progress = (1 - rect.bottom / (windowHeight + rect.height));
      setScrollProgress(Math.max(0, Math.min(1, progress)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const outerOffset = -40 + scrollProgress * -120;
  const innerOffset = 120 + scrollProgress * -250;

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden pb-16 pt-30 md:pb-28 md:pt-42"
    >
      <div className="relative z-10 mx-auto max-w-(--breakpoint-xl) px-6 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-loud uppercase tracking-wide">
          Built to endure your
          <br />
          next three startups.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Built for the ones who ship — through late nights, pivots, and launch
          days.
        </p>
      </div>

      <div className="relative mt-12 md:mt-16">
        <div className="hidden md:flex items-center justify-center px-4 lg:px-8">
          <div className="flex items-center w-[48%] shrink-0">
            <div
              className="relative z-0 -mr-8 lg:-mr-12 w-[46%] shrink-0"
              style={{ transform: `translateY(${outerOffset}px)` }}
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                <Image
                  src={IMAGES[0]!.src}
                  alt={IMAGES[0]!.alt}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div
              className="relative z-10 w-[54%] shrink-0"
              style={{ transform: `translateY(${innerOffset}px)` }}
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                <Image
                  src={IMAGES[1]!.src}
                  alt={IMAGES[1]!.alt}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="w-[4%] shrink-0" />

          <div className="flex items-center w-[48%] shrink-0">
            <div
              className="relative z-10 w-[54%] shrink-0"
              style={{ transform: `translateY(${innerOffset}px)` }}
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                <Image
                  src={IMAGES[2]!.src}
                  alt={IMAGES[2]!.alt}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div
              className="relative z-0 -ml-8 lg:-ml-12 w-[46%] shrink-0"
              style={{ transform: `translateY(${outerOffset}px)` }}
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                <Image
                  src={IMAGES[3]!.src}
                  alt={IMAGES[3]!.alt}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex md:hidden items-center justify-center -mx-16 gap-3">
          <div
            className="w-[35%] shrink-0"
            style={{ transform: `translateY(${outerOffset * 0.6}px)` }}
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
              <Image
                src={IMAGES[0]!.src}
                alt={IMAGES[0]!.alt}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div
            className="w-[40%] shrink-0"
            style={{ transform: `translateY(${innerOffset * 0.6}px)` }}
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
              <Image
                src={IMAGES[1]!.src}
                alt={IMAGES[1]!.alt}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div
            className="w-[40%] shrink-0"
            style={{ transform: `translateY(${innerOffset * 0.6}px)` }}
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
              <Image
                src={IMAGES[2]!.src}
                alt={IMAGES[2]!.alt}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div
            className="w-[35%] shrink-0"
            style={{ transform: `translateY(${outerOffset * 0.6}px)` }}
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
              <Image
                src={IMAGES[3]!.src}
                alt={IMAGES[3]!.alt}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
