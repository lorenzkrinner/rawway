"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createUrl } from "~/lib/utils";
import { Separator } from "../ui/separator";

type Collection = { title: string; path: string };

type PriceRange = { min: number; max: number };

function CollectionLinks({ collections }: { collections: Collection[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <nav>
      <ul className="space-y-2">
        {collections.map((collection) => {
          const active = pathname === collection.path;
          const newParams = new URLSearchParams(searchParams.toString());
          newParams.delete("q");

          return (
            <li key={collection.path}>
              {active ? (
                <p className="text-sm font-semibold text-foreground">
                  {collection.title}
                </p>
              ) : (
                <Link
                  href={createUrl(collection.path, newParams)}
                  className="text-sm text-foreground hover:underline underline-offset-4"
                >
                  {collection.title}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function ExpandableFilter({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-sm font-semibold text-foreground"
      >
        {title}
        <ChevronDownIcon
          className={clsx("size-4 transition-transform", open && "rotate-180")}
        />
      </button>
      {open ? <div className="mt-3">{children}</div> : null}
    </>
  );
}

function PriceFilter({ priceRange }: { priceRange: PriceRange }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentMin = searchParams.get("minPrice");
  const currentMax = searchParams.get("maxPrice");

  const ranges = [
    { label: "All prices", min: undefined, max: undefined },
    {
      label: `Under €${Math.round(priceRange.max * 0.5)}`,
      min: undefined,
      max: Math.round(priceRange.max * 0.5),
    },
    {
      label: `€${Math.round(priceRange.max * 0.5)} – €${Math.round(priceRange.max * 0.75)}`,
      min: Math.round(priceRange.max * 0.5),
      max: Math.round(priceRange.max * 0.75),
    },
    {
      label: `Over €${Math.round(priceRange.max * 0.75)}`,
      min: Math.round(priceRange.max * 0.75),
      max: undefined,
    },
  ];

  return (
    <ul className="space-y-2">
      {ranges.map((range) => {
        const params = new URLSearchParams(searchParams.toString());
        if (range.min !== undefined) {
          params.set("minPrice", String(range.min));
        } else {
          params.delete("minPrice");
        }
        if (range.max !== undefined) {
          params.set("maxPrice", String(range.max));
        } else {
          params.delete("maxPrice");
        }

        const isActive =
          (currentMin ?? "") ===
            (range.min !== undefined ? String(range.min) : "") &&
          (currentMax ?? "") ===
            (range.max !== undefined ? String(range.max) : "");

        return (
          <li key={range.label}>
            <Link
              href={createUrl(pathname, params)}
              className={clsx(
                "text-sm hover:underline underline-offset-4",
                isActive
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {range.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function SeriesFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentSeries = searchParams.get("series");

  const seriesOptions = [
    { label: "All series", value: "" },
    { label: "Original Series", value: "original" },
  ];

  return (
    <ul className="space-y-2">
      {seriesOptions.map((option) => {
        const params = new URLSearchParams(searchParams.toString());
        if (option.value) {
          params.set("series", option.value);
        } else {
          params.delete("series");
        }

        const isActive = (currentSeries ?? "") === option.value;

        return (
          <li key={option.label}>
            <Link
              href={createUrl(pathname, params)}
              className={clsx(
                "text-sm hover:underline underline-offset-4",
                isActive
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {option.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function FilterSidebar({
  collections,
  priceRange,
}: {
  collections: Collection[];
  priceRange: PriceRange;
}) {
  return (
    <aside className="space-y-6">
      <CollectionLinks collections={collections} />
      <Separator />
      <ExpandableFilter title="Price">
        <PriceFilter priceRange={priceRange} />
      </ExpandableFilter>
      <Separator />
      <ExpandableFilter title="Keyboard Series">
        <SeriesFilter />
      </ExpandableFilter>
    </aside>
  );
}
