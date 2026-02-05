'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

/**
 * Custom 404 Not Found Page
 * 
 * Displays a user-friendly error message when users navigate to non-existent pages.
 * 
 * Features:
 * - Multilingual support (EN/RU)
 * - Navigation options (home, back, popular pages)
 * - Matches 8Blocks design system
 * - Fully accessible with ARIA labels
 * - Responsive design
 * 
 * Requirements:
 * - Requirement 12.3: Custom 404 page with navigation options
 * - Requirement 10: Accessibility compliance
 * - Requirement 6: Responsive design
 */
export default function NotFound() {
  const t = useTranslations('notFound');
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-[clamp(1.25rem,6.25vw,6.25rem)] py-[clamp(3.125rem,6vw,6.25rem)] bg-black">
      <div className="max-w-[600px] w-full text-center">
        {/* 404 Icon */}
        <div className="mb-[30px] flex justify-center">
          <div 
            className="w-[clamp(80px,100px,100px)] h-[clamp(80px,100px,100px)] rounded-full flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
            role="img"
            aria-label="404 Error Icon"
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
              {/* Search icon with X */}
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </div>
        </div>

        {/* 404 Title */}
        <h1 className="font-berka text-[clamp(1.75rem,2.1875rem,2.1875rem)] leading-[1.25] text-white mb-[15px]">
          {t('title')}
        </h1>

        {/* Description */}
        <p className="font-berka text-[clamp(0.875rem,0.9375rem,0.9375rem)] leading-[1.7] text-white/50 mb-[40px]">
          {t('description')}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-[15px] justify-center mb-[50px]">
          <Link href="/">
            <Button 
              variant="primary" 
              className="min-w-[160px] w-full sm:w-auto"
              aria-label={t('goHome')}
            >
              {t('goHome')}
            </Button>
          </Link>
          <Button 
            variant="secondary" 
            onClick={handleGoBack}
            className="min-w-[160px] w-full sm:w-auto"
            aria-label={t('goBack')}
          >
            {t('goBack')}
          </Button>
        </div>

        {/* Popular Pages */}
        <div className="mt-[50px]">
          <h2 className="font-berka text-[clamp(1.125rem,1.25rem,1.25rem)] leading-[1.3] text-white mb-[20px]">
            {t('popularPages')}
          </h2>
          <nav 
            className="flex flex-wrap gap-[15px] justify-center"
            aria-label="Popular pages navigation"
          >
            <Link 
              href="/"
              className="font-berka text-[clamp(0.875rem,0.9375rem,0.9375rem)] leading-[1.7] text-white/70 hover:text-white transition-colors duration-200 underline underline-offset-4"
            >
              {t('home')}
            </Link>
            <span className="text-white/30">•</span>
            <Link 
              href="/blog"
              className="font-berka text-[clamp(0.875rem,0.9375rem,0.9375rem)] leading-[1.7] text-white/70 hover:text-white transition-colors duration-200 underline underline-offset-4"
            >
              {t('blog')}
            </Link>
            <span className="text-white/30">•</span>
            <Link 
              href="/#services"
              className="font-berka text-[clamp(0.875rem,0.9375rem,0.9375rem)] leading-[1.7] text-white/70 hover:text-white transition-colors duration-200 underline underline-offset-4"
            >
              {t('services')}
            </Link>
            <span className="text-white/30">•</span>
            <Link 
              href="/#contact"
              className="font-berka text-[clamp(0.875rem,0.9375rem,0.9375rem)] leading-[1.7] text-white/70 hover:text-white transition-colors duration-200 underline underline-offset-4"
            >
              {t('contact')}
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
