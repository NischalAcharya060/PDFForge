import * as React from "react";

import { cn } from "@/lib/utils";

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "flex h-11 w-full cursor-pointer appearance-none rounded-xl border border-input bg-background/70 px-3.5 py-2 text-sm shadow-xs transition-[color,box-shadow,border-color,background-color] duration-200 hover:border-primary/35 focus-visible:border-primary focus-visible:bg-background focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

export { Select };
