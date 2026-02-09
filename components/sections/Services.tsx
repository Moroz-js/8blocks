'use client';

import { useTranslations } from 'next-intl';
import ServiceCard from '@/components/cards/ServiceCard';
import { Button } from '@/components/ui';
import { Container } from '@/components/layout';
import type { Locale } from '@/i18n/routing';

interface ServicesProps {
  locale?: Locale;
}

export default function Services({ locale = 'en' }: ServicesProps) {
  const t = useTranslations('services');
  const tc = useTranslations('common');

  const services = [
    { id: 1, cardType: 'strategic' as const },
    { id: 2, cardType: 'basic' as const },
    { id: 3, cardType: 'advanced' as const },
    { id: 4, cardType: 'audit' as const, variant: 'large' as const },
  ];

  const scrollToFooter = () => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="services" className="w-full py-fluid-lg">
      <Container className="flex flex-col gap-[clamp(1.875rem,3vw,3.1875rem)] items-center">
        {/* Section Title */}
        <h2 className="text-[30px] lg:text-h2 leading-[1.1] font-berka font-normal text-white w-full text-left">
          {t('sectionTitle')}
        </h2>

        {/* Desktop: CSS Grid layout (>= 1024px) */}
        <div className="hidden lg:grid w-full grid-cols-[1fr_18.990625rem] gap-[1.1875rem] auto-rows-[17.125rem]">
          <div className="col-span-2">
            <ServiceCard
              title={t('strategic.title')}
              description={t('strategic.description')}
              cardType="strategic"
              locale={locale}
              buttonText={tc('viewDetails')}
            />
          </div>
          <div className="flex flex-col gap-[1.1875rem]">
            <ServiceCard
              title={t('basic.title')}
              description={t('basic.description')}
              cardType="basic"
              locale={locale}
              buttonText={tc('viewDetails')}
            />
            <ServiceCard
              title={t('advanced.title')}
              description={t('advanced.description')}
              cardType="advanced"
              locale={locale}
              buttonText={tc('viewDetails')}
            />
          </div>
          <div className="row-span-2">
            <ServiceCard
              title={t('audit.title')}
              description={t('audit.description')}
              variant="large"
              cardType="audit"
              locale={locale}
              buttonText={tc('startNow')}
            />
          </div>
        </div>

        {/* Tablet: 2 columns grid (768px - 1023px) */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-[clamp(1.25rem,2vw,1.5625rem)] w-full">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              title={t(`${service.cardType}.title`)}
              description={t(`${service.cardType}.description`)}
              cardType={service.cardType}
              variant={service.variant}
              locale={locale}
              buttonText={service.cardType === 'audit' ? tc('startNow') : tc('viewDetails')}
            />
          ))}
        </div>

        {/* Mobile: 1 column (< 768px) */}
        <div className="flex md:hidden flex-col gap-[10px] w-full">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              title={t(`${service.cardType}.title`)}
              description={t(`${service.cardType}.description`)}
              cardType={service.cardType}
              variant={service.variant}
              locale={locale}
              buttonText={service.cardType === 'audit' ? tc('startNow') : tc('viewDetails')}
            />
          ))}
        </div>

        {/* CTA Button */}
        <button 
          onClick={scrollToFooter}
          className="bg-white h-[36px] px-[15px] py-[10px] rounded-[8px] flex items-center justify-center font-berka font-medium text-[13px] leading-[1.5] text-black hover:opacity-90 transition-opacity lg:hidden"
        >
          {tc('talkToTeam')}
        </button>
        <div className="hidden lg:block">
          <Button variant="secondary" onClick={scrollToFooter}>
            {tc('talkToTeam')}
          </Button>
        </div>
      </Container>
    </section>
  );
}
