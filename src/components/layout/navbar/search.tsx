"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Collection, Product } from "src/lib/shopify/types";
import Price from "~/components/price";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Kbd } from "~/components/ui/kbd";
import { searchProducts } from "../search/actions";

export default function Search({
  collections,
  searchBgClass,
  navTextMutedClass,
}: {
  collections: Collection[];
  searchBgClass: string;
  navTextMutedClass: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isPending, startTransition] = useTransition();
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (value.trim().length === 0) {
      setResults([]);
      setHasSearched(false);
      return;
    } else if (value.trim().length < 3) {
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      setHasSearched(true);
      startTransition(async () => {
        const products = await searchProducts(value);
        setResults(products);
      });
    }, 300);
  }, []);

  const handleClose = () => {
    setOpen(false);
    setQuery("");
    setResults([]);
    setHasSearched(false);
  };

  const filteredCollections = collections.filter((c) => c.handle !== "");

  return (
    <>
      <button
        className={`relative py-1 px-3 w-50 justify-between ${searchBgClass} rounded-full flex gap-1 items-center cursor-text`}
        onClick={() => setOpen(true)}
        aria-label="Search for products"
      >
        <div className={`flex gap-1 items-center ${navTextMutedClass} `}>
          <MagnifyingGlassIcon className="size-5" />
          <span className="text-end">Search...</span>
        </div>
        <span className={`bg-transparent ${navTextMutedClass} text-xs`}>
          ⌘K
        </span>
      </button>
      <Dialog
        open={open}
        onOpenChange={(v) => (v ? setOpen(true) : handleClose())}
      >
        <DialogContent
          showCloseButton={false}
          className="top-[10%] translate-y-0 p-0 gap-0 overflow-hidden max-w-[60vw]! w-full"
        >
          <DialogTitle className="sr-only">Search products</DialogTitle>

          <div className="flex items-center border-b px-4 py-2 bg-muted">
            <MagnifyingGlassIcon className="mr-2 h-5 w-5 shrink-0 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search for products..."
              autoComplete="off"
              autoFocus
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="border-0 shadow-none focus-visible:ring-0 text-base py-6"
            />
            {query && <Kbd onClick={() => handleSearch("")}>ESC</Kbd>}
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {isPending && (
              <div className="flex items-center justify-center py-12">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
              </div>
            )}

            {!isPending && hasSearched && (
              <div className="p-2">
                {results.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No products found for &quot;{query}&quot;
                  </p>
                ) : (
                  <div>
                    <p className="px-3 py-2 text-xs font-medium text-muted-foreground">
                      {results.length}{" "}
                      {results.length === 1 ? "result" : "results"}
                    </p>
                    {results.map((product) => (
                      <Link
                        key={product.handle}
                        href={`/product/${product.handle}`}
                        onClick={handleClose}
                        className="flex items-center gap-4 rounded-lg px-3 py-3 hover:bg-muted transition-colors"
                      >
                        {product.featuredImage ? (
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border bg-muted">
                            <Image
                              src={product.featuredImage.url}
                              alt={
                                product.featuredImage.altText || product.title
                              }
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          </div>
                        ) : (
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border bg-muted">
                            <MagnifyingGlassIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="text-sm font-medium truncate">
                            {product.title}
                          </span>
                          <Price
                            amount={product.priceRange.minVariantPrice.amount}
                            currencyCode={
                              product.priceRange.minVariantPrice.currencyCode
                            }
                            className="text-sm text-muted-foreground"
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!isPending && !hasSearched && filteredCollections.length > 0 && (
              <div className="py-2">
                <p className="px-3 py-2 text-xs font-medium text-muted-foreground">
                  Collections
                </p>
                {filteredCollections.map((collection) => (
                  <Link
                    key={collection.handle}
                    href={collection.path}
                    onClick={handleClose}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-muted transition-colors"
                  >
                    <Badge variant={"secondary"}>{collection.title}</Badge>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t px-4 py-4 bg-muted">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Kbd>⌘K</Kbd>
              <span>to open</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Kbd>ESC</Kbd>
              <span>to close</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function SearchSkeleton() {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-foreground hover:bg-muted/20"
      disabled
      aria-label="Search for products"
    >
      <MagnifyingGlassIcon className="size-6" />
    </Button>
  );
}
