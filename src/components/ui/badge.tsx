import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center border-3 border-border px-2 py-0.5 text-xs font-bold uppercase w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#FFFDF5] transition-all overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-foreground",
        secondary:
          "bg-secondary text-foreground",
        destructive:
          "bg-destructive text-foreground",
        outline:
          "bg-card text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
