'use client';

import { NormalizedCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface CategoryFilterProps {
  categories: NormalizedCategory[];
  locale: 'en' | 'ru';
  activeCategory?: string;
}

export function CategoryFilter({
  categories,
  locale,
  activeCategory,
}: CategoryFilterProps) {
  const pathname = usePathname();

  const isActive = (categorySlug?: string) => {
    if (!categorySlug) {
      // "All" is active when no category is selected
      return !activeCategory || pathname === `/${locale}/blog`;
    }
    return activeCategory === categorySlug;
  };

  return (
    <div className="w-full">
      <nav
        className="flex gap-[0.625rem] items-center flex-wrap"
        aria-label="Blog categories"
      >
        {/* All Categories */}
        <Link
          href={`/${locale}/blog`}
          className={cn(
            'inline-flex items-center justify-center h-[2.25rem] px-[0.9375rem] py-[0.625rem] rounded-[0.5rem] text-[0.8125rem] font-medium font-[\'Berka\'] leading-[1.5] transition-all',
            isActive()
              ? 'bg-white text-black'
              : 'bg-[rgba(233,233,233,0.12)] text-white hover:bg-[rgba(233,233,233,0.18)]'
          )}
        >
          {locale === 'en' ? 'All' : 'Все'}
        </Link>

        {/* Category Filters */}
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/${locale}/blog/${category.slug}`}
            className={cn(
              'inline-flex items-center justify-center h-[2.25rem] px-[0.9375rem] py-[0.625rem] rounded-[0.5rem] text-[0.8125rem] font-medium font-[\'Berka\'] leading-[1.5] transition-all',
              isActive(category.slug)
                ? 'bg-white text-black'
                : 'bg-[rgba(233,233,233,0.12)] text-white hover:bg-[rgba(233,233,233,0.18)]'
            )}
          >
            {category.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
