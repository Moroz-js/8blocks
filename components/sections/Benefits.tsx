'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Container } from '@/components/layout';

export default function Benefits() {
  const t = useTranslations('benefits');

  const benefits = [
    { id: 1, icon: '/assets/icons/benefit-1.svg', titleKey: 'title1', descKey: 'desc1' },
    { id: 2, icon: '/assets/icons/benefit-2.svg', titleKey: 'title2', descKey: 'desc2' },
    { id: 3, icon: '/assets/icons/benefit-3.svg', titleKey: 'title3', descKey: 'desc3' },
    { id: 4, icon: '/assets/icons/benefit-4.svg', titleKey: 'title4', descKey: 'desc4' },
  ];

  return (
    <section id="benefits" className="w-full py-fluid-lg">
      <Container className="flex flex-col gap-fluid-xs items-start">
        {/* Section Title */}
        <h2 className="font-berka font-normal text-[30px] lg:text-h2 leading-[1.1] text-white w-full max-w-[1040px]">
          {t('headingLine1')} {t('headingLine2')}{' '}
          <br className="hidden sm:block" />
          <span className="text-text-secondary">
            {t('headingLine3')}
          </span>
        </h2>

        {/* Desktop: 4 columns grid */}
        <div className="w-full hidden lg:grid lg:grid-cols-4 lg:gap-[3.125rem] pt-fluid-sm">
          {benefits.map((benefit, index) => (
            <div key={benefit.id} className="flex flex-col gap-[0.625rem] items-start relative">
              <div className="flex flex-col gap-[15px] items-start w-full">
                <div className="relative size-[40px] overflow-hidden flex-shrink-0">
                  <Image src={benefit.icon} alt="" fill className="object-contain" loading="lazy" sizes="40px" />
                </div>
                <h3 className="font-berka font-normal text-h3 leading-[1.2] text-white whitespace-pre-line">
                  {t(benefit.titleKey)}
                </h3>
              </div>
              <p className="font-berka font-normal text-body leading-[1.7] text-text-secondary w-full">
                {t(benefit.descKey)}
              </p>
              {index < benefits.length - 1 && (
                <div className="absolute top-0 h-full w-px" style={{ right: 'calc(-3.125rem / 2)', background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.1) 15%, rgba(255, 255, 255, 0.1) 85%, rgba(255, 255, 255, 0) 100%)' }} />
              )}
            </div>
          ))}
        </div>

        {/* Mobile: single column */}
        <div className="w-full flex flex-col gap-[30px] lg:hidden pt-fluid-sm">
          {benefits.map((benefit, index) => (
            <div key={benefit.id}>
              {index > 0 && (
                <div className="w-full h-px mb-[30px]" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 15%, rgba(255,255,255,0.1) 85%, rgba(255,255,255,0) 100%)' }} />
              )}
              <div className={`flex flex-col gap-[10px] items-start ${index > 0 ? 'pl-[15px]' : ''}`}>
                <div className="flex flex-col gap-[15px] items-start w-full">
                  <div className="relative size-[30px] overflow-hidden flex-shrink-0">
                    <Image src={benefit.icon} alt="" fill className="object-contain" loading="lazy" sizes="30px" />
                  </div>
                  <h3 className="font-berka font-normal text-[20px] leading-[1.2] text-white whitespace-pre-line">
                    {t(benefit.titleKey)}
                  </h3>
                </div>
                <p className="font-berka font-normal text-[13px] leading-[1.7] text-text-secondary w-full">
                  {t(benefit.descKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
