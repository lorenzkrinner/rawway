import { ArrowPathIcon, ArrowRightIcon, CheckCircleIcon, StarIcon, TruckIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { NAV_HEIGHT } from "~/constants/layout";

const trustBarItems = [
  {
    icon: TruckIcon,
    label: "Free Shipping",
  },
  {
    icon: ArrowPathIcon,
    label: "30-Day Returns",
  },
  {
    icon: CheckCircleIcon,
    label: "2-Year Warranty",
  },
];

function TrustBar() {
  return (
    <div className="flex px-4 py-2 justify-around items-center backdrop-blur-xs">
      <div className="flex items-center gap-1.5 text-sm text-background">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} className="size-3.5 text-chart-1" />
          ))}
        </div>
        <span className="font-medium">4.9 / 5</span>
        <span className="text-background/60">(120+ Reviews)</span>
      </div>
      <div className="size-2 rounded-full bg-background" />
      {trustBarItems.map((item, idx) => (
        <>
          <div key={item.label} className="flex items-center gap-1.5 text-sm text-background">
            <item.icon className="size-4" />
            <span className="font-medium">{item.label}</span>
          </div>
          {idx < trustBarItems.length - 1 && <div className="size-2 rounded-full bg-background" />}
        </>
      ))}
    </div>
  );
}

export default function Hero() {
  return (
    <div
      className="flex w-full h-dvh flex-1 flex-col relative"
      style={{ marginTop: -NAV_HEIGHT }}
    >
      <Image
        src="/images/hero2.png"
        className="absolute inset-0 w-full h-full object-cover"
        alt="Hero"
        width={1000}
        height={1000}
        priority
      />
      <div className="absolute inset-0 flex flex-col">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 p-5">
          <div className="col-span-1 flex items-end flex-1 justify-start">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold leading-tight lg:leading-35 text-background font-loud uppercase tracking-wide">
              Type the next big thing
            </h1>
          </div>
          <div className="col-span-1 flex items-end flex-1 justify-end mb-2 mr-4">
            <div className="flex flex-col items-end gap-2">
              <Link href="/product/one">
                <Button className="rounded-full uppercase font-mono bg-background text-foreground py-8 px-10 text-lg mb-2">
                  Order Now
                  <ArrowRightIcon />
                </Button>
              </Link>
              <div className="flex items-center gap-1.5 text-sm text-background">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className="size-3.5 text-chart-1" />
                  ))}
                </div>
                <span className="font-medium">Rated 4.9 / 5</span>
                <span className="text-background/60">by 120+ Customers</span>
              </div>
              <p className="text-background text-lg font-medium text-end max-w-100">
                The Knob One™ is a keyboard made to endure long nights and
                launch parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
