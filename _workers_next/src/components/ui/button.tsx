import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold uppercase transition-all duration-100 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none border-4 border-border",
  {
    variants: {
      variant: {
        default: "bg-primary text-foreground shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none dark:shadow-[4px_4px_0px_0px_#FFFDF5] dark:hover:shadow-[6px_6px_0px_0px_#FFFDF5]",
        destructive:
          "bg-destructive text-foreground shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none dark:shadow-[4px_4px_0px_0px_#FFFDF5] dark:hover:shadow-[6px_6px_0px_0px_#FFFDF5]",
        outline:
          "bg-card text-foreground shadow-[4px_4px_0px_0px_#000] hover:bg-secondary hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none dark:shadow-[4px_4px_0px_0px_#FFFDF5] dark:hover:shadow-[6px_6px_0px_0px_#FFFDF5]",
        secondary:
          "bg-secondary text-foreground shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none dark:shadow-[4px_4px_0px_0px_#FFFDF5] dark:hover:shadow-[6px_6px_0px_0px_#FFFDF5]",
        ghost:
          "border-transparent shadow-none hover:bg-secondary hover:border-border hover:shadow-[4px_4px_0px_0px_#000] dark:hover:shadow-[4px_4px_0px_0px_#FFFDF5]",
        link: "text-primary underline-offset-4 hover:underline border-transparent shadow-none",
      },
      size: {
        default: "h-10 px-5 py-2 has-[>svg]:px-4",
        sm: "h-8 gap-1.5 px-3.5 has-[>svg]:px-2.5",
        lg: "h-11 px-7 has-[>svg]:px-5",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-11",
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
