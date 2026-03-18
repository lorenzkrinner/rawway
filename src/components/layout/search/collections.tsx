import { Suspense } from "react";

import { getCollections } from "src/lib/shopify";
import { Skeleton } from "~/components/ui/skeleton";
import FilterList from "./filter";

async function CollectionList() {
  const collections = await getCollections();
  return <FilterList list={collections} title="Collections" />;
}

export default function Collections() {
  return (
    <Suspense
      fallback={
        <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
          <Skeleton className="mb-3 h-4 w-5/6" />
          <Skeleton className="mb-3 h-4 w-5/6" />
          <Skeleton className="mb-3 h-4 w-5/6 opacity-60" />
          <Skeleton className="mb-3 h-4 w-5/6 opacity-60" />
          <Skeleton className="mb-3 h-4 w-5/6 opacity-60" />
          <Skeleton className="mb-3 h-4 w-5/6 opacity-60" />
          <Skeleton className="mb-3 h-4 w-5/6 opacity-60" />
          <Skeleton className="mb-3 h-4 w-5/6 opacity-60" />
          <Skeleton className="mb-3 h-4 w-5/6 opacity-60" />
          <Skeleton className="mb-3 h-4 w-5/6 opacity-60" />
        </div>
      }
    >
      <CollectionList />
    </Suspense>
  );
}
