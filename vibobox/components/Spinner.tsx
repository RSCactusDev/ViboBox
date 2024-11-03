import React from 'react';
import { cn } from '@/lib/utils'; // Make sure to import your cn utility here
import { VariantProps, cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react'; // Icon from lucide-react

// Spinner container variants
const spinnerVariants = cva('flex-col items-center justify-center', {
  variants: {
    show: {
      true: 'flex',
      false: 'hidden',
    },
  },
  defaultVariants: {
    show: true,
  },
});

// Loader animation variants for different sizes
const loaderVariants = cva('animate-spin text-primary', {
  variants: {
    size: {
      small: 'h-6 w-6',
      medium: 'h-8 w-8',
      large: 'h-12 w-12',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

interface SpinnerContentProps
  extends VariantProps<typeof spinnerVariants>,
    VariantProps<typeof loaderVariants> {
  className?: string;
  children?: React.ReactNode;
}

// Spinner component
export function Spinner({ size, show, children, className }: SpinnerContentProps) {
  return (
    <span className={cn(spinnerVariants({ show }), className)}>
      <Loader2 className={cn(loaderVariants({ size }))} />
      {children}
    </span>
  );
}
