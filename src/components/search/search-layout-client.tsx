"use client";

import clsx from "clsx";
import { useState } from "react";
import FilterSidebar from "./filter-sidebar";
import SearchToolbar from "./search-toolbar";

type Collection = { title: string; path: string };
type PriceRange = { min: number; max: number };

export default function SearchLayoutClient({
  children,
  collections,
  priceRange,
  resultsCount,
}: {
  children: React.ReactNode;
  collections: Collection[];
  priceRange: PriceRange;
  resultsCount?: number;
}) {
  const [filtersVisible, setFiltersVisible] = useState(true);

  return (
    <>
      <SearchToolbar
        filtersVisible={filtersVisible}
        onToggleFiltersAction={() => setFiltersVisible((v) => !v)}
        resultsCount={resultsCount}
      />

      <div className="flex gap-8 pt-6">
        <div
          className={clsx(
            "shrink-0 transition-all duration-300 overflow-hidden",
            filtersVisible ? "w-56 opacity-100" : "w-0 opacity-0",
          )}
        >
          {filtersVisible ? (
            <FilterSidebar collections={collections} priceRange={priceRange} />
          ) : null}
        </div>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </>
  );
}
