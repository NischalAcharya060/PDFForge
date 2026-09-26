import * as React from "react";

import { cn } from "@/lib/utils";

export type CheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
>;

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <input
      type="checkbox"
      ref={ref}
      className={cn(
        "size-[1.15rem] shrink-0 cursor-pointer rounded-md border border-input bg-background accent-primary shadow-xs transition-[color,box-shadow,border-color] duration-200 hover:border-primary/45 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15",
        className,
      )}
      {...props}
    />
  ),
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
