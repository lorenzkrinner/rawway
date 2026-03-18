"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { removeItem } from "components/cart/actions";
import type { CartItem } from "lib/shopify/types";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

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
      <button
        type="submit"
        aria-label="Remove cart item"
        className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-neutral-500"
      >
        <XMarkIcon className="mx-[1px] h-4 w-4 text-white dark:text-black" />
      </button>
    </form>
  );
}
