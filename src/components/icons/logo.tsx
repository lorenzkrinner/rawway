import { cn } from "~/lib/cn";

export default function Logo({
  className,
  ...props
}: {
  className?: string;
} & React.ComponentProps<"span">) {
  return (
    <span className={cn("text-2xl font-loud font-black", className)} {...props}>
      KEON
    </span>
  );
}
