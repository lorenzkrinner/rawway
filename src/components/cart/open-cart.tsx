import { ShoppingBagIcon } from "@heroicons/react/24/solid";
import { Badge } from "~/components/ui/badge";
import { Button } from "../ui/button";

export default function OpenCart({
  className,
  quantity,
}: {
  className?: string;
  quantity?: number;
}) {
  return (
    <Button variant="ghost" size="icon" className="text-background  hover:text-background hover:bg-muted/20">
      <ShoppingBagIcon className='size-6' />

      {quantity ? (
        <Badge className="absolute right-0 top-0 -mr-2 -mt-2 h-4 w-4 rounded-sm px-0 text-[11px] font-medium">
          {quantity}
        </Badge>
      ) : null}
    </Button>
  );
}
