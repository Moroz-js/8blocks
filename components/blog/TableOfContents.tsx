'use client';

import { useState, useEffect } from 'react';

interface TableOfContentsProps {
  category: {
    id: string | number;
    name: string;
    slug: string;
  };
  headings?: Array<{
    id: string;
    text: string;
    level: number;
  }>;
  variant?: 'sidebar' | 'inline'; // 'sidebar' for desktop sticky, 'inline' for mobile static
}

export function TableOfContents({ category: _category, headings = [], variant = 'sidebar' }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  // If no headings provided, don't render the TOC items
  const displayHeadings = headings;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -80% 0px',
        threshold: 0,
      }
    );

    // Observe all heading elements
    displayHeadings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [displayHeadings]);

  const handleScrollToHeading = (headingId: string) => {
    const element = document.getElementById(headingId);
    if (element) {
      const headerOffset = 100; // Offset for fixed header (70px) + extra space
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={`flex flex-col ${
      variant === 'sidebar' 
        ? 'gap-0 max-h-[calc(100vh-12rem)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30' 
        : 'gap-[0.625rem]'
    }`}>
      {/* Table of Contents - Headings only */}
      {displayHeadings.length > 0 && displayHeadings.map((heading) => (
        <button
          key={heading.id}
          onClick={() => handleScrollToHeading(heading.id)}
          className={variant === 'sidebar' 
            ? `h-[2.25rem] px-[0.9375rem] py-[0.625rem] rounded-[0.5rem] flex items-center justify-start hover:bg-[rgba(233,233,233,0.06)] transition-all cursor-pointer text-left w-full ${
                activeId === heading.id ? 'bg-[rgba(233,233,233,0.12)]' : ''
              }`
            : 'text-left w-full py-[0.3125rem]'
          }
        >
          <p className={variant === 'sidebar'
            ? `font-berka font-medium text-[0.8125rem] leading-[1.5] text-white truncate transition-opacity ${
                activeId === heading.id ? 'opacity-100' : 'opacity-50'
              }`
            : 'font-berka font-normal text-[0.9375rem] leading-[1.7] text-white opacity-50'
          }>
            {heading.text}
          </p>
        </button>
      ))}
    </div>
  );
}
