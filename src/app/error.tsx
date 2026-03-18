"use client";

import { Button } from "~/components/ui/button";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto my-4 flex max-w-xl flex-col rounded-lg border border-border bg-background p-8 md:p-12">
      <h2 className="text-xl font-bold">Oh no!</h2>
      <p className="my-2">
        There was an issue with our storefront. This could be a temporary issue,
        please try your action again.
      </p>
      <Button
        className="mx-auto mt-4 w-full rounded-full p-4 tracking-wide hover:opacity-90"
        onClick={() => reset()}
      >
        Try Again
      </Button>
    </div>
  );
}
