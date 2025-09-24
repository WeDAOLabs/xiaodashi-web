import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const pageCardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "border-border",
        feature: "border-primary/20 bg-primary/5",
        info: "border-[var(--info-border)] bg-[var(--info-bg)]",
        warning: "border-[var(--warning-border)] bg-[var(--warning-bg)]",
        success: "border-[var(--success-border)] bg-[var(--success-bg)]",
      },
      size: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8",
        xl: "p-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface PageCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pageCardVariants> {}

const PageCard = React.forwardRef<HTMLDivElement, PageCardProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(pageCardVariants({ variant, size, className }))}
      {...props}
    />
  )
);
PageCard.displayName = "PageCard";

const PageCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
PageCardHeader.displayName = "PageCardHeader";

const PageCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
PageCardTitle.displayName = "PageCardTitle";

const PageCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
PageCardDescription.displayName = "PageCardDescription";

const PageCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
PageCardContent.displayName = "PageCardContent";

const PageCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
PageCardFooter.displayName = "PageCardFooter";

export {
    PageCard, PageCardContent, PageCardDescription, PageCardFooter, PageCardHeader, PageCardTitle
};
