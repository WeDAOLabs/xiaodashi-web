import React from 'react';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full font-bold leading-normal tracking-[0.015em] transition-colors duration-200',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-transparent text-blue-600 hover:underline',
        ghost: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
      },
      size: {
        default: 'h-12 px-8 text-base',
        sm: 'h-10 px-6 text-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  href?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, href, ...props }, ref) => {
    const Comp = asChild && href ? Link : 'button';
    
    const buttonContent = (
        <span className="truncate">{props.children}</span>
    );

    if (asChild && href) {
        return (
            <Link href={href} className={cn(buttonVariants({ variant, size, className }))} ref={ref as React.Ref<HTMLAnchorElement>} {...props}>
                {buttonContent}
            </Link>
        )
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
