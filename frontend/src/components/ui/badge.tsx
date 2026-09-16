import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-zinc-700 bg-zinc-800/80 px-2 py-0.5 text-xs font-medium text-zinc-300",
        className
      )}
      {...props}
    />
  );
}
