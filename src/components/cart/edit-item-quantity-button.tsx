"use client";

import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { updateItemQuantity } from "src/components/cart/actions";
import type { CartItem } from "src/lib/shopify/types";
import { Button } from "~/components/ui/button";

function SubmitButton({ type }: { type: "plus" | "minus" }) {
  return (
    <Button
      type="submit"
      variant="ghost"
      aria-label={
        type === "plus" ? "Increase item quantity" : "Reduce item quantity"
      }
      className={clsx(
        "h-full min-w-[36px] max-w-[36px] flex-none rounded-full p-2 transition-all duration-200 ease-in-out hover:opacity-80",
        {
          "ml-auto": type === "minus",
        },
      )}
    >
      {type === "plus" ? (
        <PlusIcon className="h-4 w-4 text-muted-foreground" />
      ) : (
        <MinusIcon className="h-4 w-4 text-muted-foreground" />
      )}
    </Button>
  );
}

export function EditItemQuantityButton({
  item,
  type,
  optimisticUpdate,
}: {
  item: CartItem;
  type: "plus" | "minus";
  optimisticUpdate: (
    merchandiseId: string,
    updateType: "plus" | "minus" | "delete",
  ) => void;
}) {
  const payload = {
    merchandiseId: item.merchandise.id,
    quantity: type === "plus" ? item.quantity + 1 : item.quantity - 1,
  };

  const { execute } = useAction(updateItemQuantity, {
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to update item quantity");
    },
  });

  return (
    <form
      action={async () => {
        optimisticUpdate(payload.merchandiseId, type);
        execute(payload);
      }}
    >
      <SubmitButton type={type} />
    </form>
  );
}
