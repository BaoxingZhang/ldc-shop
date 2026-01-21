import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold uppercase tracking-wide transition-all duration-100 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none border-4 border-black dark:border-white active:translate-x-1 active:translate-y-1 active:shadow-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFFDF5] hover:shadow-[6px_6px_0px_0px_#000] dark:hover:shadow-[6px_6px_0px_0px_#FFFDF5]",
        destructive:
          "bg-destructive text-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFFDF5] hover:shadow-[6px_6px_0px_0px_#000] dark:hover:shadow-[6px_6px_0px_0px_#FFFDF5]",
        outline:
          "bg-white dark:bg-card shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFFDF5] hover:bg-secondary hover:shadow-[6px_6px_0px_0px_#000] dark:hover:shadow-[6px_6px_0px_0px_#FFFDF5]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFFDF5] hover:shadow-[6px_6px_0px_0px_#000] dark:hover:shadow-[6px_6px_0px_0px_#FFFDF5]",
        ghost:
          "border-transparent hover:bg-accent hover:border-black dark:hover:border-white",
        link: "border-transparent text-primary underline-offset-4 hover:underline shadow-none",
      },
      size: {
        default: "h-12 px-5 py-2 has-[>svg]:px-4",
        sm: "h-10 gap-1.5 px-4 has-[>svg]:px-2.5",
        lg: "h-14 px-8 has-[>svg]:px-5",
        icon: "size-12",
        "icon-sm": "size-10",
        "icon-lg": "size-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
