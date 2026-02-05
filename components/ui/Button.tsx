import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className, children, ...props }, ref) => {
    const baseStyles = 
      'inline-flex items-center justify-center h-[48px] px-[20px] py-[12px] rounded-[6px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    const variantStyles = {
      primary: 'text-white hover:opacity-80 focus-visible:ring-white',
      secondary: 'bg-white text-black hover:bg-white/90 focus-visible:ring-white'
    };

    const primaryStyle = variant === 'primary' ? {
      backdropFilter: 'blur(2px)',
      WebkitBackdropFilter: 'blur(2px)',
      backgroundColor: 'rgba(255, 255, 255, 0.14)',
    } : {};

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], 'text-[0.9375rem] leading-[1.5] font-berka font-medium', className)}
        style={primaryStyle}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
