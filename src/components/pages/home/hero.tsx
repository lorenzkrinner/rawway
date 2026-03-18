import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { NAV_HEIGHT } from "~/constants/layout";

export default function Hero() {
  return (
    <div className="flex w-full h-dvh flex-1 relative" style={{ marginTop: -NAV_HEIGHT }}>
      <Image src="/images/hero2.png" className="absolute inset-0 w-full h-full object-cover" alt="Hero" width={1000} height={1000} />
      <div className="absolute inset-0 grid grid-cols-2 p-5">
        <div className="col-span-1 flex items-end flex-1 justify-start">
          <h1 className="text-8xl font-bold leading-35 text-background font-loud uppercase tracking-wide">
            Type the next big thing
          </h1>
        </div>
        <div className="col-span-1 flex items-end flex-1 justify-end mb-2 mr-4">
          <div className="flex flex-col items-end gap-4">
            <Link href="/product/one">
              <Button className="rounded-full uppercase font-mono bg-background text-foreground py-8 px-10 text-lg">
                Order Now
                <ArrowRightIcon />
              </Button>
            </Link>
            <p className="text-background text-lg font-medium text-end max-w-100">The Knob One™ is a keyboard made to endure long nights and launch parties.</p>
          </div>
        </div>
      </div>
    </div>
  );
}