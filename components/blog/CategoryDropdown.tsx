'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

interface CategoryDropdownProps {
  category: Category;
  locale: string;
}

export default function CategoryDropdown({ category, locale }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const hasChildren = category.children && category.children.length > 0;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-[0.3125rem] h-[2.25rem] px-[0.9375rem] py-[0.625rem] rounded-[0.5rem] font-berka font-medium text-[0.8125rem] leading-[1.5] text-white transition-colors whitespace-nowrap flex-shrink-0"
      >
        <span>{category.name}</span>
        <ChevronDown 
          className={`w-[1.25rem] h-[1.25rem] opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-[0.5rem] min-w-[12rem] bg-[#0B0B0B] border border-[#171717] rounded-[0.5rem] py-[0.5rem] z-50 shadow-lg">
          {/* Children categories with dash separators */}
          {hasChildren ? (
            <>
              {category.children?.map((child, index) => (
                <div key={child.id}>
                  {index > 0 && (
                    <div className="px-[1rem] py-[0.25rem] font-berka font-normal text-[0.9375rem] leading-[1.7] text-white opacity-50">
                      -
                    </div>
                  )}
                  <Link
                    href={`/${locale}/blog/${child.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="block px-[1rem] py-[0.5rem] font-berka font-normal text-[0.9375rem] leading-[1.7] text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                  >
                    {child.name}
                  </Link>
                </div>
              ))}
            </>
          ) : (
            <Link
              href={`/${locale}/blog/${category.slug}`}
              onClick={() => setIsOpen(false)}
              className="block px-[1rem] py-[0.5rem] font-berka font-normal text-[0.9375rem] leading-[1.7] text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              {category.name}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
