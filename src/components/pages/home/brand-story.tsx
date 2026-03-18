export function BrandStory() {
  return (
    <section className="mx-auto w-full max-w-(--breakpoint-xl) px-6 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        {/* Text */}
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl md:text-4xl font-bold font-loud uppercase tracking-wide">
            Why Keon?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A keyboard built for the ones who ship. We started Keon because
            every late night deserves a keyboard that keeps up — one that feels
            as premium as the products you&apos;re building.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Designed for entrepreneurs, engineers, and creators who refuse to
            settle.
          </p>
        </div>

        {/* Image placeholder */}
        <div className="aspect-[4/3] w-full rounded-lg bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-sm">
            Founder / brand lifestyle image
          </span>
        </div>
      </div>
    </section>
  );
}
