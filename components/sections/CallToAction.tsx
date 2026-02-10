'use client';

import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout';
import type { Locale } from '@/i18n/routing';

interface CallToActionProps {
  locale?: Locale;
}

export default function CallToAction({ locale = 'en' }: CallToActionProps) {
  const t = useTranslations('cta');
  const tc = useTranslations('common');

  return (
    <section className="w-full pt-[120px] pb-[200px] lg:py-[clamp(3.125rem,6vw,6.25rem)]">
      <Container>
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_417px] gap-[20px] lg:gap-[clamp(2.5rem,5vw,5rem)] items-start lg:items-center">
          {/* Left Column: Text */}
          <div className="flex flex-col gap-[10px] items-start text-left pt-[20px] lg:pt-0">
            <h2 className="font-berka font-normal text-[30px] lg:text-[clamp(1.5625rem,2vw,1.5625rem)] leading-[1.1] lg:leading-[1.2] text-white">
              {t('title')}
            </h2>
            <p className="font-berka font-normal text-[15px] lg:text-[clamp(0.875rem,1vw,0.9375rem)] leading-[1.7] text-white opacity-50">
              {t('description')}
            </p>
          </div>

          {/* Right Column: Contact Button */}
          <div className="flex items-center justify-center w-full lg:w-auto lg:justify-end">
            <a
              href={locale === 'en' ? 'https://t.me/Eight_Blocks' : 'https://t.me/Eight_Blocks'}
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-[165px] h-[165px]"
              aria-label={tc('messageOnTelegram')}
            >
              {/* Glow layers */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[150px] h-[150px] rounded-full bg-[#638EFB] opacity-20 blur-[30px]" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[110px] h-[110px] rounded-full bg-[#638EFB] opacity-30 blur-[20px]" />
              </div>
              {/* Inner circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[70px] h-[70px] rounded-full bg-[#638EFB] flex items-center justify-center">
                  <svg width="28" height="24" viewBox="0 0 32 28" fill="none">
                    <path d="M30.7276 1.89331L25.7276 25.8933C25.3276 27.6433 24.1776 28.1433 22.6776 27.2683L15.3276 21.5183L11.7776 24.8933C11.3776 25.2933 11.0276 25.6433 10.2276 25.6433L10.7276 18.1433L24.8276 5.39331C25.4276 4.89331 24.6776 4.51831 23.8276 5.01831L6.97764 15.8933L-0.272363 13.5183C-1.87236 12.8933 -1.87236 11.7683 0.227637 10.8933L28.7276 0.143311C30.0776 -0.481689 31.2776 0.393311 30.7276 1.89331Z" fill="white"/>
                  </svg>
                </div>
              </div>
              {/* Text label */}
              <div className="absolute bottom-[11px] left-1/2 -translate-x-1/2 flex flex-col gap-[4px] items-center w-[139px]">
                <span className="font-berka font-medium text-[12px] leading-[1.5] text-[#638EFB] whitespace-nowrap">{tc('messageOnTelegram')}</span>
                <div className="w-full h-px bg-[#638EFB] opacity-30" />
              </div>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
