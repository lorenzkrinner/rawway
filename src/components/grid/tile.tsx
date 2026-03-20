import clsx from "clsx";
import Image from "next/image";
import Label from "../label";

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  classNames,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: "bottom" | "center";
  };
  classNames?: {
    container?: string;
    image?: string;
  };
} & React.ComponentProps<typeof Image>) {
  return (
    <div
      className={clsx(
        classNames?.container,
        "group flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-background hover:opacity-100 transition-opacity duration-300",
        {
          relative: label,
          "opacity-100 border-1 border-muted-foreground": active,
          "opacity-40": !active,
        },
      )}
    >
      {props.src ? (
        <Image
          className={clsx(classNames?.image, "relative h-full w-full object-contain", {
            "transition duration-300 ease-in-out group-hover:scale-105":
              isInteractive,
          })}
          {...props}
        />
      ) : null}
      {label ? (
        <Label
          title={label.title}
          amount={label.amount}
          currencyCode={label.currencyCode}
          position={label.position}
        />
      ) : null}
    </div>
  );
}
