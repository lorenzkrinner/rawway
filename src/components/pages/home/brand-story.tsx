export function BrandStory() {
  return (
    <section className="mx-auto w-full max-w-(--breakpoint-xl) px-6 py-16 md:py-24 h-[90dvh] flex items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        {/* Text */}
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl md:text-4xl font-bold font-loud uppercase tracking-wide">
            It's more than just a keyboard
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Built for those who ship. A keyboard as premium as the products
            you&apos;re building.
          </p>
        </div>

        <div className="grid grid-cols-3 grid-rows-2 gap-3 h-[500px] md:h-[560px]">
          <div className="relative col-span-2 row-span-2 flex items-end overflow-hidden">
            <img
              src="/images/about/1.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="relative z-10 p-5">
              <p className="text-xs text-background font-mono uppercase tracking-wide">
                Craftsmanship
              </p>
              <p className="text-sm mt-1 text-background/60">
                Designed for late nights and big ambitions.
              </p>
            </div>
          </div>

          <div className="relative col-span-1 row-span-1 flex items-end overflow-hidden">
            <img
              src="/images/about/2.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
            <div className="relative z-10 p-4">
              <p className="text-xs text-background font-mono uppercase tracking-wide">
                Premium Build
              </p>
              <p className="text-sm text-background/60">Engineered to last</p>
            </div>
          </div>

          <div className="relative col-span-1 row-span-1 flex items-end overflow-hidden">
            <img
              src="/images/about/3.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
            <div className="relative z-10 p-4">
              <p className="text-xs text-background font-mono uppercase tracking-wide">
                Community
              </p>
              <p className="text-sm text-background/60">Made for creators</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
