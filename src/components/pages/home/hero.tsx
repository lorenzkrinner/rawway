import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { Button } from "~/components/ui/button";

export default function Hero() {
  return (
    <div className="flex w-full h-dvh flex-1 relative">
      <Image src="/images/hero.png" className="absolute inset-0 w-full h-full object-cover" alt="Hero" width={1000} height={1000} />
      <div className="absolute inset-0 grid grid-cols-2 p-4">
        <div className="col-span-1 flex items-center flex-1 justify-end">
          <h1 className="text-4xl font-bold">
            The next big thing.
          </h1>
        </div>
        <div className="col-span-1 flex items-center flex-1 justify-end">
          <Button className="rounded-full uppercase font-mono bg-background text-foreground py-6 px-8">
            Order Now
            <ArrowRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}