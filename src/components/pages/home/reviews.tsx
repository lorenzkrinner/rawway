"use client";

import { StarIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";

const REVIEWS = [
  {
    quote: "Best keyboard I've ever owned. The build quality is insane.",
    author: "@marcusdev",
    platform: "X",
    rating: 5,
  },
  {
    quote:
      "The knob is a game-changer for productivity. Can't go back to a regular keyboard.",
    author: "@sarahbuilds",
    platform: "Reddit",
    rating: 5,
  },
  {
    quote:
      "Finally a keyboard that matches my ambition. Worth every penny.",
    author: "@alexfounder",
    platform: "Instagram",
    rating: 5,
  },
  {
    quote:
      "Hot-swappable switches sold me. Went from linear to tactile in under a minute.",
    author: "@keebsenthusiast",
    platform: "YouTube",
    rating: 5,
  },
  {
    quote: "Shipped fast, built like a tank, sounds incredible. 10/10.",
    author: "@joshdesigns",
    platform: "X",
    rating: 5,
  },
] as const;

function ReviewCard({
  review,
}: {
  review: (typeof REVIEWS)[number];
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: review.rating }).map((_, i) => (
            <StarIcon key={i} className="size-3.5 text-chart-1" />
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <p className="text-base leading-relaxed flex-1">
          &ldquo;{review.quote}&rdquo;
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{review.author}</span>
          <span>&middot;</span>
          <span>{review.platform}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function Reviews() {
  return (
    <section className="mx-auto w-full max-w-(--breakpoint-xl) px-6 py-16 md:py-24">
      <h2 className="text-3xl md:text-4xl font-bold font-loud uppercase tracking-wide text-center mb-12">
        Don&apos;t take our word for it.
      </h2>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {REVIEWS.map((review) => (
            <CarouselItem
              key={review.author}
              className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <ReviewCard review={review} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4 sm:-left-12" />
        <CarouselNext className="-right-4 sm:-right-12" />
      </Carousel>
    </section>
  );
}
