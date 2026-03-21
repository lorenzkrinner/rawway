"use client";

import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { sorting, type SortFilterItem } from "~/lib/constants";
import { createUrl } from "~/lib/utils";

export default function SearchToolbar({
  filtersVisible,
  onToggleFiltersAction,
  resultsCount,
}: {
  filtersVisible: boolean;
  onToggleFiltersAction: () => void;
  resultsCount?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") ?? "";

  function handleSortChange(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("sort", slug);
    } else {
      params.delete("sort");
    }
    router.push(createUrl(pathname, params));
  }

  const activeSort =
    sorting.find((s: SortFilterItem) => s.slug === currentSort) ?? sorting[0];

  return (
    <div className="flex items-center justify-between border-b border-border pb-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleFiltersAction}
          className="flex items-center gap-2 text-sm text-foreground hover:opacity-70 transition-opacity"
        >
          {filtersVisible ? "Hide filters" : "Show filters"}
          <AdjustmentsHorizontalIcon className="size-5" />
        </button>
        {resultsCount !== undefined ? (
          <span className="text-sm text-muted-foreground">
            {resultsCount} {resultsCount === 1 ? "product" : "products"}
          </span>
        ) : null}
      </div>

      <Select
        value={currentSort}
        onValueChange={handleSortChange}
      >
        <SelectTrigger className="w-auto border-none shadow-none gap-2">
          <SelectValue placeholder={activeSort?.title ?? "Sort by"} />
        </SelectTrigger>
        <SelectContent align="end">
          {sorting.map((option: SortFilterItem) => (
            <SelectItem key={option.slug ?? "relevance"} value={option.slug ?? "all"}>
              {option.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
