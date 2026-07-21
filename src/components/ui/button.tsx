import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[4px] text-[12px] font-medium tracking-[0.025em] font-favorit cursor-pointer transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-transparent border border-black text-black hover:bg-black hover:text-white transition-colors duration-150",
        filled:
          "bg-black text-white hover:opacity-85 border border-black transition-opacity duration-150",
        ghost: "bg-transparent text-black hover:bg-neutral-100 transition-colors duration-150",
        outline:
          "bg-transparent border border-black text-black hover:bg-black hover:text-white transition-colors duration-150",
        secondary: "bg-[#e5e7eb] text-black hover:bg-neutral-300 transition-colors duration-150",
        destructive: "bg-black text-white hover:opacity-85 transition-opacity duration-150",
        link: "text-black underline-offset-4 hover:underline",
      },
      size: {
        default: "px-6 py-[6px] h-auto",
        sm: "px-[10px] py-[4px] text-[11px] h-auto",
        lg: "px-8 py-3 text-[13px] h-auto",
        icon: "h-9 w-9 p-0 border-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
