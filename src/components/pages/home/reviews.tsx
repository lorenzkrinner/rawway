"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "~/components/ui/button";

const reviews = [
  {
    title: "Finally, a Keyboard That Gets It",
    body: "I've tried dozens of mechanical keyboards over the years. Keon nails the balance between aesthetics and performance. The sound profile is incredibly satisfying and it **looks stunning on my desk**.",
    author: "Sarah K.",
    image: "/images/reviews/sarah.png",
  },
  {
    title: "A Game Changer for My Workflow",
    body: "As a founder, I spend 10+ hours a day typing. Switching to Keon was night and day — the tactile feedback keeps me focused and the build quality is **unmatched at this price point**. Worth every cent.",
    author: "David R.",
    image: "/images/reviews/david.png",
  },
  {
    title: "Built for People Who Ship",
    body: "Clean design, zero distractions, premium feel. Keon understands that your tools should match your ambition. This keyboard **makes me want to sit down and work**. Can't recommend it enough.",
    author: "Katherine T.",
    image: "/images/reviews/katherine.png",
  },
];

function renderBody(body: string) {
  const parts = body.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold italic">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export function Reviews() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const slide = (newIndex: number, dir: "left" | "right") => {
    if (isAnimating) return;
    setDirection(dir);
    setIsAnimating(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrent(newIndex);
      setIsAnimating(false);
    }, 300);
  };

  const prev = () => {
    const newIndex = current === 0 ? reviews.length - 1 : current - 1;
    slide(newIndex, "left");
  };

  const next = () => {
    const newIndex = current === reviews.length - 1 ? 0 : current + 1;
    slide(newIndex, "right");
  };

  const review = reviews[current]!;

  return (
    <section className="flex flex-col items-center px-8 py-16 lg:py-20 my-16 lg:my-24 bg-muted overflow-hidden">
      <div className="w-full max-w-5xl">
        <div
          className="flex flex-col md:flex-row items-center gap-8 md:gap-16 transition-all duration-300 ease-in-out"
          style={{
            transform: isAnimating
              ? `translateX(${direction === "right" ? "-40px" : "40px"})`
              : "translateX(0)",
            opacity: isAnimating ? 0 : 1,
          }}
        >
          <div className="relative w-full md:w-1/2 aspect-[4/5] bg-foreground/5 shrink-0 h-165">
            <Image
              src={review.image}
              alt={`Review by ${review.author}`}
              fill
              className="object-cover rounded-xl"
            />
          </div>

          {/* Text content */}
          <div className="flex flex-col items-start gap-5 w-full md:w-1/2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className="size-5 text-chart-1" />
              ))}
            </div>

            <h3 className="text-xl md:text-2xl font-bold font-loud">
              {review.title}
            </h3>

            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              {renderBody(review.body)}
            </p>

            <p className="text-sm font-medium text-foreground">
              {review.author}
            </p>

            <div className="flex gap-1 mt-4">
              <Button
                variant="outline"
                onClick={prev}
                className="size-12 rounded-full"
                aria-label="Previous review"
              >
                <ChevronLeftIcon className="size-4" />
              </Button>
              <Button
                variant="outline"
                onClick={next}
                className="size-12 rounded-full"
                aria-label="Next review"
              >
                <ChevronRightIcon className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
