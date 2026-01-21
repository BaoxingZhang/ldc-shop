import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-black/40 dark:placeholder:text-white/40 h-14 w-full min-w-0 border-4 border-black dark:border-white bg-white dark:bg-card px-4 py-2 text-base font-bold shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFFDF5] transition-all duration-100 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus:bg-secondary focus:shadow-[8px_8px_0px_0px_#000] dark:focus:shadow-[8px_8px_0px_0px_#FFFDF5] dark:focus:bg-secondary dark:focus:text-black",
        className
      )}
      {...props}
    />
  )
}

export { Input }
