import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer select-none active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 hover:from-emerald-300 hover:via-emerald-400 hover:to-emerald-500 text-zinc-950 font-bold shadow-[0_2px_12px_rgba(16,185,129,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_4px_22px_rgba(16,185,129,0.5),inset_0_1px_0_rgba(255,255,255,0.35)] border border-emerald-300/40 hover:border-emerald-200/60",
        secondary:
          "bg-gradient-to-b from-zinc-800/90 to-zinc-900/90 hover:from-zinc-750 hover:to-zinc-850 text-zinc-200 hover:text-white border border-zinc-700/80 hover:border-zinc-500 shadow-[0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.6)] backdrop-blur-sm",
        ghost:
          "hover:bg-zinc-800/70 text-zinc-400 hover:text-zinc-100",
        outline:
          "border border-zinc-700/80 bg-zinc-900/40 hover:bg-zinc-800/70 hover:border-zinc-500 text-zinc-200 hover:text-white backdrop-blur-md shadow-sm",
        danger:
          "bg-gradient-to-b from-rose-500/20 to-rose-600/30 hover:from-rose-500 hover:to-rose-600 text-rose-300 hover:text-white border border-rose-500/40 hover:border-rose-400 shadow-[0_2px_10px_rgba(244,63,94,0.2)]",
        glow:
          "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:shadow-[0_0_35px_rgba(16,185,129,0.7)] border border-emerald-300/50",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-8 px-3 text-xs rounded-lg font-medium",
        lg: "h-11 px-6 text-base rounded-xl font-bold",
        icon: "h-9 w-9 rounded-lg",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";
