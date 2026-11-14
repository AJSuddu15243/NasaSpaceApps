import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils';
export const buttonVariants = cva(
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:pointer-events-none disabled:opacity-50',
  { variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-accent',
      outline: 'border border-input bg-background hover:bg-accent',
      ghost: 'hover:bg-accent',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    },
    size: { default: '', sm: 'px-3 text-xs', icon: 'w-11 p-0' },
  }, defaultVariants: { variant: 'default', size: 'default' } },
);
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type = 'button', ...props }, ref) => {
    const Component = asChild ? Slot : 'button';
    return <Component ref={ref} {...(!asChild ? { type } : {})} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);
Button.displayName = 'Button';
