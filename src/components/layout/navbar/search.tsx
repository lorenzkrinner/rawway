"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Form from "next/form";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";

export default function Search() {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-background hover:text-background hover:bg-muted/20"
        onClick={() => setOpen(true)}
        aria-label="Search for products"
      >
        <MagnifyingGlassIcon className="size-6" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg top-[20%] translate-y-0">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <Form
            action="/search"
            className="relative w-full"
            onSubmit={() => setOpen(false)}
          >
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              key={searchParams?.get("q")}
              type="text"
              name="q"
              placeholder="Search for products..."
              autoComplete="off"
              autoFocus
              defaultValue={searchParams?.get("q") || ""}
              className="pl-9 text-md md:text-sm"
            />
          </Form>
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
      className="text-background hover:text-background hover:bg-muted/20"
      disabled
      aria-label="Search for products"
    >
      <MagnifyingGlassIcon className="size-6" />
    </Button>
  );
}
