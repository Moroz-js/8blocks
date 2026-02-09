'use client';

import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout';
import Image from 'next/image';

export default function About() {
  const t = useTranslations('about');
  const tc = useTranslations('common');

  const teamMembers = [
    { id: 1, image: '/assets/team/team-1.png' },
    { id: 2, image: '/assets/team/team-2.png' },
    { id: 3, image: '/assets/team/team-3.png' },
    { id: 4, image: '/assets/team/team-4.png' },
    { id: 5, image: '/assets/team/team-5.png' },
  ];

  return (
    <section id="about" className="w-full relative overflow-hidden bg-black">
      {/* Background gradient from Figma - radial purple glow */}
      <div
        className="absolute left-0 right-0 pointer-events-none overflow-hidden opacity-20"
        style={{
          top: '20%',
          bottom: '0',
          backgroundImage: 'url(/assets/about-bg.svg)',
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 35%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 35%)',
        }}
      />
      
      <Container>
        <h2 className="sr-only">{t('srTitle')}</h2>
        <div className="overflow-hidden relative rounded-[20px] h-[730px] lg:h-[720px]">
          <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-[1fr_1fr] h-full">
            {/* Quote */}
            <div className="flex flex-col justify-between items-center lg:items-start pt-[20px] px-[20px] lg:pt-[35px] lg:pb-[90px] lg:px-0">
              <div className="flex flex-col gap-[10px] lg:gap-[clamp(0.625rem,2vw,0.9375rem)] font-berka font-normal text-white w-[295px] lg:w-full">
                <p className="text-[13px] lg:text-[clamp(0.8125rem,1vw,0.9375rem)] leading-[1.7] opacity-50 text-left">
                  {t('teamLabel')}
                </p>
                <p className="text-[20px] lg:text-[clamp(1.25rem,3vw,2.1875rem)] leading-[1.4] lg:leading-[1.25] max-w-[27.0625rem] text-left">
                  &ldquo;{t('quote')}&rdquo;
                </p>
              </div>

              {/* Team avatars - desktop */}
              <div className="hidden lg:flex flex-col gap-[clamp(1.5625rem,3vw,2.1875rem)] max-w-[21.8125rem] mt-[clamp(2rem,4vw,0)]">
                <div className="flex items-center">
                  {teamMembers.map((member, index) => (
                    <div
                      key={member.id}
                      className="relative rounded-full overflow-hidden -mr-[0.5625rem]"
                      style={{ 
                        width: 'clamp(3.125rem, 4vw, 3.9375rem)',
                        height: 'clamp(3.125rem, 4vw, 3.9375rem)',
                        zIndex: index + 1 
                      }}
                    >
                      <Image src={member.image} alt={`Team member ${member.id}`} fill className="object-cover" sizes="63px" />
                    </div>
                  ))}
                  <div className="relative rounded-full bg-black flex items-center justify-center -ml-[0.5625rem]" style={{ width: 'clamp(3.125rem, 4vw, 3.9375rem)', height: 'clamp(3.125rem, 4vw, 3.9375rem)', zIndex: 0 }}>
                    <p className="font-berka font-normal text-[clamp(1.25rem,2vw,1.5625rem)] leading-[1.2] text-white">+8</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-col gap-[25px] lg:gap-0 items-center lg:items-start justify-start lg:justify-between px-[20px] lg:pl-[35px] lg:pr-[100px] pt-[30px] lg:pt-[35px] lg:pb-[90px] text-center lg:text-left">
              <div className="flex flex-col items-center lg:items-start lg:gap-[0.625rem] w-full max-w-[35.375rem] font-berka font-normal text-white">
                <p className="text-[19px] lg:text-[clamp(1.25rem,2vw,1.5625rem)] leading-[1.4] lg:leading-[1.2]">{t('stat1value')}</p>
                <p className="text-[13px] lg:text-[clamp(0.875rem,1vw,0.9375rem)] leading-[1.7] opacity-50">{t('stat1label')}</p>
              </div>
              <div className="hidden lg:block w-full h-[1px]" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.15) 100%)' }} />
              <div className="flex flex-col items-center lg:items-start lg:gap-[0.625rem] w-full max-w-[35.375rem] font-berka font-normal text-white">
                <p className="text-[19px] lg:text-[clamp(1.25rem,2vw,1.5625rem)] leading-[1.4] lg:leading-[1.2]">{t('stat2value')}</p>
                <p className="text-[13px] lg:text-[clamp(0.875rem,1vw,0.9375rem)] leading-[1.7] opacity-50">{t('stat2label')}</p>
              </div>
              <div className="hidden lg:block w-full h-[1px]" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.15) 100%)' }} />
              <div className="flex flex-col items-center lg:items-start lg:gap-[0.625rem] w-full max-w-[35.375rem] font-berka font-normal text-white">
                <p className="text-[19px] lg:text-[clamp(1.25rem,2vw,1.5625rem)] leading-[1.4] lg:leading-[1.2]">{t('stat3value')}</p>
                <p className="text-[13px] lg:text-[clamp(0.875rem,1vw,0.9375rem)] leading-[1.7] opacity-50">{t('stat3label')}</p>
              </div>
              <div className="hidden lg:block w-full h-[1px]" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.15) 100%)' }} />
              <div className="flex flex-col items-center lg:items-start lg:gap-[0.625rem] w-full max-w-[35.375rem] font-berka font-normal text-white">
                <p className="text-[19px] lg:text-[clamp(1.25rem,2vw,1.5625rem)] leading-[1.4] lg:leading-[1.2]">{t('stat4value')}</p>
                <p className="text-[13px] lg:text-[clamp(0.875rem,1vw,0.9375rem)] leading-[1.7] opacity-50">{t('stat4label')}</p>
              </div>
            </div>

            {/* Team avatars - mobile */}
            <div className="flex lg:hidden flex-col gap-[20px] items-center px-[20px] pb-[30px] mt-auto">
              <div className="flex items-center pr-[7px]">
                {teamMembers.map((member, index) => (
                  <div key={member.id} className="relative rounded-full overflow-hidden border-[1.5px] border-black -mr-[7px]" style={{ width: '46.73px', height: '46.73px', zIndex: teamMembers.length - index }}>
                    <Image src={member.image} alt={`Team member ${member.id}`} fill className="object-cover" sizes="47px" />
                  </div>
                ))}
                <div className="relative rounded-full bg-black flex items-center justify-center -mr-[7px]" style={{ width: '46.73px', height: '46.73px', zIndex: 0 }}>
                  <p className="font-berka font-normal text-[18.5px] leading-[1.2] text-white">+8</p>
                </div>
              </div>
              <button className="bg-[rgba(233,233,233,0.12)] h-[36px] px-[15px] py-[10px] rounded-[8px] flex items-center justify-center font-berka font-medium text-[13px] leading-[1.5] text-white hover:opacity-80 transition-opacity">
                {tc('viewDetails')}
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
