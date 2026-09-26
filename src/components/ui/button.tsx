import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-premium hover:brightness-[1.07] active:brightness-95",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:brightness-110 active:brightness-95",
        outline:
          "border border-input bg-background/70 backdrop-blur-sm shadow-xs hover:border-primary/45 hover:bg-accent hover:text-accent-foreground hover:shadow-sm",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/70",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        /** Frosted surface for secondary actions on busy backdrops. */
        glass:
          "border border-border/80 bg-card/60 backdrop-blur-xl shadow-xs hover:border-primary/40 hover:bg-card/85",
        /** High-contrast outline treatment for dark hero areas. */
        hero: "border border-primary/25 bg-primary/10 text-primary hover:bg-primary/16 hover:border-primary/50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3.5 text-xs",
        lg: "h-12 rounded-xl px-7 text-base",
        xl: "h-14 rounded-2xl px-8 text-base",
        icon: "size-10",
        "icon-sm": "size-9",
      },
    },
    compoundVariants: [
      // Every tappable surface gets a springy press and a fast, even
      // transition instead of the default `transition-colors`.
      {
        variant: ["default", "destructive", "outline", "secondary", "glass", "hero"],
        class: "press",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
