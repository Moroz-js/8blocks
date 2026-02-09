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
}

export function TableOfContents({ category: _category, headings = [] }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  // If no headings provided, don't render the TOC items
  const displayHeadings = headings.slice(0, 3);

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
    <div className="flex flex-col gap-0">
      {/* Table of Contents - Headings only */}
      {displayHeadings.length > 0 && displayHeadings.map((heading) => (
        <button
          key={heading.id}
          onClick={() => handleScrollToHeading(heading.id)}
          className={`h-[2.25rem] px-[0.9375rem] py-[0.625rem] rounded-[0.5rem] flex items-center justify-start hover:bg-[rgba(233,233,233,0.06)] transition-all cursor-pointer text-left w-full ${
            activeId === heading.id ? 'bg-[rgba(233,233,233,0.12)]' : ''
          }`}
        >
          <p className={`font-berka font-medium text-[0.8125rem] leading-[1.5] text-white truncate transition-opacity ${
            activeId === heading.id ? 'opacity-100' : 'opacity-50'
          }`}>
            {heading.text}
          </p>
        </button>
      ))}
    </div>
  );
}
