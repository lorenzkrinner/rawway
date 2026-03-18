"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { removeItem } from "src/components/cart/actions";
import type { CartItem } from "src/lib/shopify/types";
import { Button } from "~/components/ui/button";

export function DeleteItemButton({
  item,
  optimisticUpdate,
}: {
  item: CartItem;
  optimisticUpdate: (
    merchandiseId: string,
    updateType: "plus" | "minus" | "delete",
  ) => void;
}) {
  const merchandiseId = item.merchandise.id;

  const { execute } = useAction(removeItem, {
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to remove item");
    },
  });

  return (
    <form
      action={async () => {
        optimisticUpdate(merchandiseId, "delete");
        execute({ merchandiseId });
      }}
    >
      <Button
        type="submit"
        aria-label="Remove cart item"
        size="icon-xs"
        className="rounded-full bg-muted-foreground text-primary-foreground"
      >
        <XMarkIcon className="mx-[1px] h-4 w-4" />
      </Button>
    </form>
  );
}
