import React from 'react';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full font-bold leading-normal tracking-[0.015em] transition-colors duration-200',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--primary-color)] text-white hover:bg-[var(--accent-color)]',
        secondary: 'bg-transparent text-[var(--primary-color)] hover:underline',
        ghost: 'bg-gray-100 text-[var(--text-primary)] hover:bg-gray-200',
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
  href?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, href, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }));

    if (href) {
      return (
        <Link href={href} className={classes} ref={ref as React.Ref<HTMLAnchorElement>} {...props}>
          {children}
        </Link>
      );
    }

    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
