import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'main';
  maxWidth?: 'container' | 'content';
}

/**
 * Container component with fluid padding and max-width
 * 
 * Design specs:
 * - Max width: 1240px (77.5rem) for content, 1440px (90rem) for container
 * - Fluid padding: clamp(1.25rem, 5vw, 6.25rem) = 20px → 100px
 * - Centered with auto margins
 * - Default uses 'container' (1440px) so padding is inside, resulting in 1240px content width
 * 
 * @param children - Content to be wrapped
 * @param className - Additional CSS classes
 * @param as - HTML element to render (default: 'div')
 * @param maxWidth - Maximum width variant (default: 'container')
 */
export function Container({
  children,
  className,
  as: Component = 'div',
  maxWidth = 'container',
}: ContainerProps) {
  return (
    <Component
      className={cn(
        'w-full mx-auto',
        'px-[clamp(1.25rem,6.25vw,6.25rem)]', // Fluid horizontal padding: 20px → 100px
        maxWidth === 'content' ? 'max-w-[77.5rem]' : 'max-w-[90rem]', // 1240px or 1440px
        className
      )}
    >
      {children}
    </Component>
  );
}
