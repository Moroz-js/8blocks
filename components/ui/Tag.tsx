import React from 'react';
import { cn } from '@/lib/utils';

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'default' | 'category';
}

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ children, className, variant = 'default', ...props }, ref) => {
    const baseStyles = 
      'inline-flex items-center justify-center h-[2.25rem] px-[0.9375rem] py-[0.625rem] rounded-[0.5rem] text-[0.8125rem] font-medium text-white font-berka leading-[1.5]';
    
    const variantStyles = {
      default: 'bg-[rgba(233,233,233,0.12)]',
      category: 'bg-[rgba(233,233,233,0.12)]',
    };

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Tag.displayName = 'Tag';
