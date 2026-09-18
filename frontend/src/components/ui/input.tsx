import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-[12px] border border-dim-grey bg-not-quite-black px-4 py-2 text-[16px] text-snow tracking-[0.014em] placeholder:text-greyple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blurple/50 focus-visible:border-blurple",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
