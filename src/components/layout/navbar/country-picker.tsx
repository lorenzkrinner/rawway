"use client";

import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { setCountry } from "~/actions/country";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Spinner } from "~/components/ui/spinner";
import { cn } from "~/lib/cn";
import type { ShopifyCountry } from "~/lib/shopify/types";

export function CountryPicker({
  countries,
  currentCountryCode,
  navTextClass,
}: {
  countries: ShopifyCountry[];
  currentCountryCode: string;
  navTextClass: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const currentCountry = countries.find(
    (c) => c.isoCode === currentCountryCode,
  );

  function handleSelect(countryCode: string) {
    setOpen(false);
    startTransition(async () => {
      await setCountry(countryCode);
      router.refresh();
    });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "gap-1 rounded-lg px-2 py-4 hover:bg-muted/20",
            navTextClass,
          )}
          disabled={isPending}
        >
          {isPending ? <Spinner className="size-4" /> : <span className="text-base leading-none">
            {countryCodeToFlag(currentCountryCode)}
          </span>}
          <span className="hidden text-xs lg:inline">
            {currentCountry?.currency.isoCode ?? currentCountryCode}
          </span>
          <ChevronDownIcon className="size-3 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end" sideOffset={8}>
        <ScrollArea className="h-80">
          <div className="grid gap-0.5 p-2">
            {countries
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((country) => (
                <button
                  key={country.isoCode}
                  onClick={() => handleSelect(country.isoCode)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-muted transition-colors",
                    country.isoCode === currentCountryCode &&
                      "bg-muted font-medium",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base leading-none">
                      {countryCodeToFlag(country.isoCode)}
                    </span>
                    <span>{country.name}</span>
                  </span>
                  <span className="text-muted-foreground">
                    {country.currency.symbol} {country.currency.isoCode}
                  </span>
                </button>
              ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

function countryCodeToFlag(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(0x1f1e6 + char.charCodeAt(0) - 65))
    .join("");
}
