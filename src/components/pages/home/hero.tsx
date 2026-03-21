import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { TrustpilotRatedBy } from "~/components/trustpilot";
import { Button } from "~/components/ui/button";
import { NAV_HEIGHT } from "~/constants/layout";
import { trustBarItems } from "~/constants/trust";

function TrustBar() {
  return (
    <div className="flex px-4 py-4 justify-around items-center bg-muted -scale-z-100 text-foreground">
      <TrustpilotRatedBy />
      <div className="size-2 rounded-full bg-foreground" />
      {trustBarItems.map((item, idx) => (
        <>
          <div
            key={item.label}
            className="flex items-center gap-1.5 text-sm text-foreground"
          >
            <item.icon className="size-4" />
            <span className="font-medium">{item.label}</span>
          </div>
          {idx < trustBarItems.length - 1 && (
            <div className="size-2 rounded-full bg-foreground" />
          )}
        </>
      ))}
    </div>
  );
}

export default function Hero() {
  return (
    <div
      className="flex w-full h-[95dvh] flex-1 flex-col relative max-w-dvw overflow-hidden bg-foreground"
      style={{ marginTop: -NAV_HEIGHT }}
    >
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/hero.png"
          className="w-full h-full object-cover rounded-t-xl rounded-b-2xl"
          alt="Hero"
          width={1000}
          height={1000}
          priority
        />
      </div>
      <div className="z-0 h-full w-full flex flex-col">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 p-5">
          <div className="col-span-1 flex flex-col gap-0 items-start flex-1 justify-end">
            <p className="text-lg font-medium text-end text-green-400">
              Spring Sale - 20% OFF all orders
            </p>
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
              <p className="text-background text-lg font-medium text-end max-w-100">
                KEON™ keyboards are crafted for those who ship, those who take
                bets, and take pride in their work.
              </p>
            </div>
          </div>
        </div>
      </div>
      <TrustBar />
    </div>
  );
}
