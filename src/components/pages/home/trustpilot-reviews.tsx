"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import {
  TRUSTPILOT_REVIEWS,
  type TrustpilotReview,
} from "~/data/trustpilot-reviews";

const STAR_ICON = (
  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
);

function TrustpilotStars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex size-5 items-center justify-center bg-[#00b67a]"
        >
          <svg viewBox="0 0 24 24" fill="white" className="size-3.5">
            {STAR_ICON}
          </svg>
        </div>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: TrustpilotReview }) {
  return (
    <div className="flex h-full flex-col gap-3 border-l border-gray-200 px-6 py-4">
      <TrustpilotStars count={review.rating} />
      <p className="line-clamp-1 text-sm font-bold text-gray-900">
        {review.title}
      </p>
      <p className="line-clamp-2 text-sm text-gray-700">{review.body}</p>
      <p className="mt-auto text-xs text-gray-500">
        <span className="font-bold text-gray-900">{review.author}</span>,{" "}
        {review.time}
      </p>
    </div>
  );
}

export function TrustpilotReviews() {
  return (
    <section className="w-full bg-muted px-16 py-16 md:py-24">
      <Carousel opts={{ align: "start" }} className="w-full">
        <div className="flex flex-col">
          <div className="flex items-center gap-6">
            <div className="hidden shrink-0 flex-col items-center gap-2 lg:flex">
              <span className="text-xl font-bold text-gray-900">Great</span>
              <TrustpilotStars count={5} />
              <p className="text-xs text-gray-600">
                Based on{" "}
                <span className="font-semibold text-gray-900 underline">
                  7,823 reviews
                </span>
              </p>
              <div className="flex items-center gap-1">
                <svg viewBox="0 0 24 24" fill="#00b67a" className="size-5">
                  {STAR_ICON}
                </svg>
                <span className="text-sm font-bold text-gray-900">
                  Trustpilot
                </span>
              </div>
            </div>

            <CarouselPrevious
              className="static order-none m-0 shrink-0 translate-x-0 translate-y-0 hidden lg:flex"
              aria-label="Previous reviews"
            />
            <div className="min-w-0 flex-1">
              <CarouselContent className="-ml-0">
                {TRUSTPILOT_REVIEWS.map((review) => (
                  <CarouselItem
                    key={review.author}
                    className="basis-full pl-0 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <ReviewCard review={review} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </div>
            <CarouselNext
              className="static order-none m-0 shrink-0 translate-x-0 translate-y-0 hidden lg:flex"
              aria-label="Next reviews"
            />
          </div>

          <div className="mt-4 flex items-center justify-between lg:hidden">
            <div className="flex items-center gap-2">
              <TrustpilotStars count={5} />
              <div className="flex items-center gap-1">
                <svg viewBox="0 0 24 24" fill="#00b67a" className="size-4">
                  {STAR_ICON}
                </svg>
                <span className="text-xs font-bold text-gray-900">
                  Trustpilot
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <CarouselPrevious
                className="static m-0 translate-x-0 translate-y-0"
                aria-label="Previous reviews"
              />
              <CarouselNext
                className="static m-0 translate-x-0 translate-y-0"
                aria-label="Next reviews"
              />
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-gray-500 lg:text-left">
            Showing our 5 star reviews
          </p>
        </div>
      </Carousel>
    </section>
  );
}
