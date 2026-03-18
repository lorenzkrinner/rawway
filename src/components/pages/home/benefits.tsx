const BENEFITS = [
  {
    headline: "Your keyboard, your feel",
    description:
      "Swap switches in seconds without soldering. Find your perfect keystroke.",
    imagePlaceholder: "Close-up: switches being swapped",
  },
  {
    headline: "One knob, zero distractions",
    description:
      "Volume, zoom, scroll — map it to whatever keeps you in flow.",
    imagePlaceholder: "Close-up: knob being turned",
  },
  {
    headline: "Built to outlast your next three startups",
    description:
      "CNC aluminum frame, PBT keycaps, gasket-mount. This thing doesn't quit.",
    imagePlaceholder: "Close-up: aluminum case detail",
  },
] as const;

export function Benefits() {
  return (
    <section className="mx-auto w-full max-w-(--breakpoint-xl) px-6 py-16 md:py-24">
      <div className="flex flex-col gap-16 md:gap-24">
        {BENEFITS.map((benefit, index) => {
          const isReversed = index % 2 === 1;

          return (
            <div
              key={benefit.headline}
              className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center ${
                isReversed ? "md:direction-rtl" : ""
              }`}
            >
              {/* Image placeholder */}
              <div
                className={`aspect-[4/3] w-full rounded-lg bg-muted flex items-center justify-center ${
                  isReversed ? "md:direction-ltr" : ""
                }`}
              >
                <span className="text-muted-foreground text-sm">
                  {benefit.imagePlaceholder}
                </span>
              </div>

              {/* Text */}
              <div
                className={`flex flex-col gap-4 ${isReversed ? "md:direction-ltr" : ""}`}
              >
                <h3 className="text-3xl md:text-4xl font-bold font-loud uppercase tracking-wide">
                  {benefit.headline}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
