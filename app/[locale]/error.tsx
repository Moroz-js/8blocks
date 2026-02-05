'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';

/**
 * Next.js Error Page
 * 
 * Displays a user-friendly error message when runtime errors occur.
 * This is a Next.js special file that catches errors in the app directory.
 * 
 * Features:
 * - Multilingual support (EN/RU)
 * - Reset functionality to retry rendering
 * - Navigation to homepage
 * - Matches 8Blocks design system
 * - Shows error details in development mode
 * - Fully accessible with ARIA labels
 * - Responsive design
 * 
 * Requirements:
 * - Requirement 12.1: User-friendly error page
 * - Requirement 12.5: Error logging
 * - Requirement 10: Accessibility compliance
 * - Requirement 6: Responsive design
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('error');

  useEffect(() => {
    // Log error to console for debugging
    console.error('Error caught by error.tsx:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-[clamp(1.25rem,6.25vw,6.25rem)] py-[clamp(3.125rem,6vw,6.25rem)] bg-black">
      <div className="max-w-[600px] w-full text-center">
        {/* Error Icon */}
        <div className="mb-[30px] flex justify-center">
          <div 
            className="w-[clamp(80px,100px,100px)] h-[clamp(80px,100px,100px)] rounded-full flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
            role="img"
            aria-label="Error Icon"
          >
            <svg 
              width="50" 
              height="50" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
              aria-hidden="true"
            >
              {/* Alert circle icon */}
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        </div>

        {/* Error Title */}
        <h1 className="font-berka text-[clamp(1.75rem,2.1875rem,2.1875rem)] leading-[1.25] text-white mb-[15px]">
          {t('title')}
        </h1>

        {/* Error Description */}
        <p className="font-berka text-[clamp(0.875rem,0.9375rem,0.9375rem)] leading-[1.7] text-white/50 mb-[40px]">
          {t('description')}
        </p>

        {/* Error Details (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div 
            className="mb-[40px] p-[20px] rounded-[8px] text-left overflow-auto max-h-[300px]"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
            role="region"
            aria-label="Error details"
          >
            <p className="font-berka text-[13px] leading-[1.5] text-white/70 mb-[10px] font-medium">
              {t('errorDetails')}
            </p>
            <pre className="font-mono text-[12px] leading-[1.5] text-white/50 whitespace-pre-wrap break-words">
              {error.message}
              {error.digest && `\n\nDigest: ${error.digest}`}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-[15px] justify-center">
          <Button 
            variant="primary" 
            onClick={reset}
            className="min-w-[160px] w-full sm:w-auto"
            aria-label={t('tryAgain')}
          >
            {t('tryAgain')}
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => window.location.href = '/'}
            className="min-w-[160px] w-full sm:w-auto"
            aria-label={t('goHome')}
          >
            {t('goHome')}
          </Button>
        </div>
      </div>
    </div>
  );
}
