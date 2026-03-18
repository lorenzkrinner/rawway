import { cn } from "~/lib/cn";

export default function Logo({
  className,
  ...props
}: {
  className?: string;
} & React.ComponentProps<"span">) {
  
  return (
    <span className={cn("text-4xl font-loud font-black tracking-tighter", className)} {...props}>KEON</span>
  );
}
