import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'gray' | 'bordered';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, variant = 'bordered', className, id, ...props }, ref) => {
    const hasError = !!error;
    const isGray = variant === 'gray';
    
    // Generate a unique ID if not provided and label exists
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
    const errorId = hasError ? `${inputId}-error` : undefined;
    const helperId = helperText && !hasError ? `${inputId}-helper` : undefined;
    
    const inputStyles = cn(
      'w-full h-[clamp(3.5rem,3.75rem,3.75rem)] px-[1.5625rem] py-[0.5rem] rounded-lg transition-colors',
      'text-[0.9375rem] font-normal placeholder:opacity-50',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      isGray
        ? hasError
          ? 'border-2 border-[#ff0300] bg-[#29292A] text-white focus:border-[#ff0300] focus:ring-[#ff0300]/50'
          : 'border-0 bg-[#29292A] text-white focus:ring-white/20'
        : hasError
          ? 'border-2 border-[#ff0300] bg-[#000000] text-white focus:border-[#ff0300] focus:ring-[#ff0300]/50'
          : 'border-2 border-[#141414] bg-[#000000] text-white focus:border-white/20 focus:ring-white/20',
      className
    );

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-white/90">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={inputStyles}
          aria-invalid={hasError}
          aria-describedby={errorId || helperId}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-2 text-sm text-[#ff0300]">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="mt-2 text-sm text-white/50">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
