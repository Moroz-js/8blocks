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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Update dropdown position when opened
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8, // 8px gap (0.5rem)
        left: rect.left + window.scrollX,
      });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside or scrolling
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleScroll() {
      setIsOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-[0.3125rem] h-[2.25rem] px-[0.9375rem] py-[0.625rem] rounded-[0.5rem] font-berka font-medium text-[0.8125rem] leading-[1.5] text-white  transition-colors whitespace-nowrap flex-shrink-0"
      > 
        <span>{category.name}</span>
        <ChevronDown 
          className={`w-[1.25rem] h-[1.25rem] opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu - fixed positioning to escape overflow container */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="fixed min-w-[12rem] bg-[#0B0B0B] border border-[#171717] rounded-[0.5rem] py-[0.5rem] z-[9999] shadow-lg"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
          }}
        >
          {category.children && category.children.length > 0 ? (
            category.children.map((child, index) => (
              <div key={child.id}>
                
                <Link
                  href={`/${locale}/blog/${child.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="block px-[1rem] py-[0.5rem] font-berka font-normal text-[0.9375rem] leading-[1.7] text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                >
                  {child.name}
                </Link>
              </div>
            ))
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
