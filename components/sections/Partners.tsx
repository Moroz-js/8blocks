'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Container } from '@/components/layout';

export default function Partners() {
  const t = useTranslations('partners');

  const partners = [
    { src: '/assets/partners/1.svg', alt: 'Partner 1' },
    { src: '/assets/partners/2.svg', alt: 'Partner 2' },
    { src: '/assets/partners/3.svg', alt: 'Partner 3' },
    { src: '/assets/partners/4.svg', alt: 'Partner 4' },
    { src: '/assets/partners/5.svg', alt: 'Partner 5' },
    { src: '/assets/partners/6.svg', alt: 'Partner 6' },
    { src: '/assets/partners/7.svg', alt: 'Partner 7' },
    { src: '/assets/partners/8.svg', alt: 'Partner 8' },
    { src: '/assets/partners/9.svg', alt: 'Partner 9' },
    { src: '/assets/partners/11.svg', alt: 'Partner 11' },
    { src: '/assets/partners/12.svg', alt: 'Partner 12' },
    { src: '/assets/partners/13.svg', alt: 'Partner 13' },
    { src: '/assets/partners/14.svg', alt: 'Partner 14' },
    { src: '/assets/partners/15.svg', alt: 'Partner 15' },
    { src: '/assets/partners/16.svg', alt: 'Partner 16' },
    { src: '/assets/partners/17.svg', alt: 'Partner 17' },
  ];

  return (
    <section className="w-full pt-[90px] pb-[40px] lg:py-fluid-xl overflow-hidden">
      <Container className="mb-[30px] lg:mb-[clamp(1.875rem,3vw,3.125rem)] lg:mt-[3.125rem]">
        <h2 className="font-berka font-normal text-[30px] lg:text-[clamp(1.5625rem,2.1875rem,2.1875rem)] leading-[1.1] lg:leading-[1.25] text-white w-full text-left">
          {t('title')}
        </h2>
      </Container>

      <div className="relative w-full overflow-hidden lg:mb-[3.125rem]">
        <div className="absolute left-0 top-0 bottom-0 w-[100px] bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-[100px] bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
        
        <div className="flex gap-[28px] lg:gap-[clamp(2.5rem,5vw,5rem)] animate-marquee-mobile lg:animate-marquee hover:pause opacity-20 lg:opacity-100">
          {partners.map((partner, index) => (
            <div key={`first-${index}`} className="relative flex-shrink-0 w-[100px] lg:w-[clamp(8rem,12vw,12.5rem)] h-[3rem] lg:h-[4rem] flex items-center justify-center">
              <Image src={partner.src} alt={partner.alt} fill className="object-contain opacity-70" sizes="200px" />
            </div>
          ))}
          {partners.map((partner, index) => (
            <div key={`second-${index}`} className="relative flex-shrink-0 w-[100px] lg:w-[clamp(8rem,12vw,12.5rem)] h-[3rem] lg:h-[4rem] flex items-center justify-center">
              <Image src={partner.src} alt={partner.alt} fill className="object-contain opacity-70" sizes="200px" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
