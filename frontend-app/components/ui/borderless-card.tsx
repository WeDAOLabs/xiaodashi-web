import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const borderlessCardVariants = cva(
  "bg-white rounded-xl border-none shadow-none transition-shadow",
  {
    variants: {
      variant: {
        default: "hover:shadow-sm",
        static: "", // 无 hover 效果
        elevated: "shadow-sm hover:shadow-md",
      },
      size: {
        default: "p-0",
        sm: "p-2",
        lg: "p-6",
      },
      interactive: {
        true: "cursor-pointer hover:bg-[var(--bg-secondary)]/50",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      interactive: false,
    },
  }
)

const borderlessCardContentVariants = cva(
  "flex",
  {
    variants: {
      direction: {
        row: "flex-row items-center gap-3",
        column: "flex-col gap-2",
      },
      padding: {
        none: "p-0",
        sm: "p-2",
        default: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      direction: "row",
      padding: "default",
    },
  }
)

export interface BorderlessCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof borderlessCardVariants> {}

export interface BorderlessCardContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof borderlessCardContentVariants> {}

function BorderlessCard({ 
  className, 
  variant, 
  size, 
  interactive, 
  ...props 
}: BorderlessCardProps) {
  return (
    <div
      className={cn(borderlessCardVariants({ variant, size, interactive, className }))}
      {...props}
    />
  )
}

function BorderlessCardContent({ 
  className, 
  direction, 
  padding, 
  ...props 
}: BorderlessCardContentProps) {
  return (
    <div
      className={cn(borderlessCardContentVariants({ direction, padding, className }))}
      {...props}
    />
  )
}

export { BorderlessCard, BorderlessCardContent, borderlessCardContentVariants, borderlessCardVariants }
