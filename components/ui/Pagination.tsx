'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
}: PaginationProps) {
  const t = useTranslations('blog');

  if (totalPages <= 1) {
    return null;
  }

  const getPageUrl = (page: number) => {
    return page === 1 ? baseUrl : `${baseUrl}?page=${page}`;
  };

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Near start: 1 2 3 4 ... last
        pages.push(2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end: 1 ... last-3 last-2 last-1 last
        pages.push('...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Middle: 1 ... current-1 current current+1 ... last
        pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  return (
    <nav
      className="flex items-center justify-center gap-[0.625rem] mt-[3.125rem]"
      aria-label="Pagination"
    >
      {/* Previous button */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className={cn(
            'inline-flex items-center justify-center h-[2.5rem] px-[1.25rem] rounded-[0.375rem]',
            'font-[\'Berka\'] font-medium text-[0.9375rem] leading-[1.5]',
            'bg-[rgba(255,255,255,0.14)] backdrop-blur-[2px] text-white',
            'hover:bg-[rgba(255,255,255,0.2)] transition-all'
          )}
        >
          {t('previousPage')}
        </Link>
      ) : (
        <span
          className={cn(
            'inline-flex items-center justify-center h-[2.5rem] px-[1.25rem] rounded-[0.375rem]',
            'font-[\'Berka\'] font-medium text-[0.9375rem] leading-[1.5]',
            'bg-[rgba(255,255,255,0.07)] text-white opacity-40 cursor-not-allowed'
          )}
        >
          {t('previousPage')}
        </span>
      )}

      {/* Page numbers */}
      <div className="flex items-center gap-[0.3125rem]">
        {renderPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="inline-flex items-center justify-center w-[2.5rem] h-[2.5rem] text-white opacity-50"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <Link
              key={pageNum}
              href={getPageUrl(pageNum)}
              className={cn(
                'inline-flex items-center justify-center w-[2.5rem] h-[2.5rem] rounded-[0.375rem]',
                'font-[\'Berka\'] font-medium text-[0.9375rem] leading-[1.5]',
                'transition-all',
                isActive
                  ? 'bg-white text-black'
                  : 'bg-[rgba(255,255,255,0.08)] text-white hover:bg-[rgba(255,255,255,0.14)]'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      {/* Next button */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className={cn(
            'inline-flex items-center justify-center h-[2.5rem] px-[1.25rem] rounded-[0.375rem]',
            'font-[\'Berka\'] font-medium text-[0.9375rem] leading-[1.5]',
            'bg-[rgba(255,255,255,0.14)] backdrop-blur-[2px] text-white',
            'hover:bg-[rgba(255,255,255,0.2)] transition-all'
          )}
        >
          {t('nextPage')}
        </Link>
      ) : (
        <span
          className={cn(
            'inline-flex items-center justify-center h-[2.5rem] px-[1.25rem] rounded-[0.375rem]',
            'font-[\'Berka\'] font-medium text-[0.9375rem] leading-[1.5]',
            'bg-[rgba(255,255,255,0.07)] text-white opacity-40 cursor-not-allowed'
          )}
        >
          {t('nextPage')}
        </span>
      )}
    </nav>
  );
}
