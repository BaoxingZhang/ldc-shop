import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-foreground/60 selection:bg-primary selection:text-foreground border-4 border-border h-10 w-full min-w-0 bg-card px-3 py-1 text-base font-bold shadow-[4px_4px_0px_0px_#000] transition-all duration-100 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-bold disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:shadow-[4px_4px_0px_0px_#FFFDF5]",
        "focus:bg-secondary focus:shadow-[8px_8px_0px_0px_#000] dark:focus:shadow-[8px_8px_0px_0px_#FFFDF5]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
