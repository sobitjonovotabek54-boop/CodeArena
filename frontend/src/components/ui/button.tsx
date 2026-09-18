import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 text-[16px] font-medium tracking-[0.016em] transition-colors duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blurple/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cosmic disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default:
          "bg-blurple text-snow rounded-[12px] hover:bg-dark-blurple border-0",
        secondary:
          "bg-snow text-not-quite-black rounded-[12px] border border-not-quite-black hover:bg-off-white",
        ghost:
          "bg-transparent text-snow border border-snow rounded-[12px] hover:bg-snow/10",
        outline:
          "bg-transparent text-snow border border-dim-grey rounded-[12px] hover:border-fog hover:text-snow",
        login:
          "bg-snow text-void border border-void rounded-[16px] hover:bg-off-white",
        danger:
          "bg-ekko-red/15 text-ekko-red border border-ekko-red/40 rounded-[12px] hover:bg-ekko-red hover:text-snow",
        glow:
          "bg-blurple text-snow rounded-[12px] hover:bg-dark-blurple",
      },
      size: {
        default: "px-6 py-[15px]",
        sm: "px-4 py-2.5 text-sm rounded-[12px]",
        lg: "px-6 py-[19.5px] rounded-[12px]",
        icon: "h-10 w-10 rounded-[12px]",
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
