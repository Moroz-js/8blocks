'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Logo } from './Logo';
import { Button } from '../ui/Button';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Container } from './Container';
import type { Locale } from '@/i18n/routing';

interface HeaderProps {
  locale: Locale;
}

export function Header({ locale }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = useTranslations('header');
  const tc = useTranslations('common');
  const ts = useTranslations('footer.services');

  const scrollToFooter = () => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navigationLinks = [
    { href: locale === 'en' ? '/#services' : `/${locale}#services`, label: t('services') },
    { href: locale === 'en' ? '/#cases' : `/${locale}#cases`, label: t('cases') },
    { href: locale === 'en' ? '/#benefits' : `/${locale}#benefits`, label: t('benefits') },
    { href: locale === 'en' ? '/blog' : `/${locale}/blog`, label: t('blog') },
  ];

  const servicesLinks = [
    { href: locale === 'en' ? '/#services' : `/${locale}#services`, label: ts('strategicConsulting') },
    { href: locale === 'en' ? '/#services' : `/${locale}#services`, label: ts('basicTokenomics') },
    { href: locale === 'en' ? '/#services' : `/${locale}#services`, label: ts('advancedTokenomics') },
    { href: locale === 'en' ? '/#services' : `/${locale}#services`, label: ts('tokenomicsAudit') },
  ];

  return (
    <>
      <header 
        className="fixed left-0 right-0 z-50 border-b border-[rgba(255,255,255,0.07)] h-[3.125rem] lg:h-[4.375rem] top-0 lg:[body.has-banner_&]:top-[44px] transition-[top] duration-300"
        style={{
          backdropFilter: 'blur(7.5px)',
          WebkitBackdropFilter: 'blur(7.5px)',
          backgroundColor: 'rgba(0, 0, 0, 0.01)',
        }}
      >
        <Container className="relative flex items-center justify-between h-full">
          <div className="flex items-center h-[30px] shrink-0">
            <Logo />
          </div>

          <nav className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 gap-[48px] font-berka text-[15px] leading-[1.7] text-white">
            {navigationLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:opacity-70 transition-opacity duration-200">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-[32px] shrink-0">
            <LanguageSwitcher currentLocale={locale} />
            <Button variant="primary" onClick={scrollToFooter}>
              {tc('talkToTeam')}
            </Button>
          </div>

          <div className="flex lg:hidden items-center gap-[20px]">
            <LanguageSwitcher currentLocale={locale} />
            <button
              className="flex flex-col gap-[6px] w-[44px] h-[44px] justify-center items-center"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-[6px] w-[18px]">
                <span className={`block w-full h-[2px] bg-white transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-45 translate-y-[4px]' : ''}`} />
                <span className={`block w-full h-[2px] bg-white transition-transform duration-200 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[4px]' : ''}`} />
              </div>
            </button>
          </div>
        </Container>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black lg:hidden flex flex-col">
          <div className="flex gap-[20px] px-[20px] pt-[90px] text-[15px] text-white">
            <div className="flex flex-col gap-[10px] w-[120px] shrink-0">
              <p className="font-berka font-medium leading-[1.5]">{t('navigation')}</p>
              <nav className="flex flex-col gap-[5px]">
                {navigationLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="font-berka text-[15px] leading-[1.7] text-white opacity-50 hover:opacity-100 transition-opacity" onClick={() => setIsMobileMenuOpen(false)}>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex flex-col gap-[10px] flex-1 min-w-0">
              <p className="font-berka font-medium leading-[1.5]">{t('services')}</p>
              <nav className="flex flex-col gap-[5px]">
                {servicesLinks.map((link, index) => (
                  <Link key={index} href={link.href} className="font-berka text-[15px] leading-[1.7] text-white opacity-50 hover:opacity-100 transition-opacity" onClick={() => setIsMobileMenuOpen(false)}>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          <div className="flex-1" />

          <div className="mx-auto flex items-center justify-center w-[335px] pb-[20px] shrink-0">
            <a
              href={locale === 'en' ? 'https://t.me/eightblocks' : 'https://t.me/Eight_Blocks'}
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-[165px] h-[165px]"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[150px] h-[150px] rounded-full bg-[#638EFB] opacity-20 blur-[30px]" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[110px] h-[110px] rounded-full bg-[#638EFB] opacity-30 blur-[20px]" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[70px] h-[70px] rounded-full bg-[#638EFB] flex items-center justify-center">
                  <svg width="28" height="24" viewBox="0 0 32 28" fill="none">
                    <path d="M30.7276 1.89331L25.7276 25.8933C25.3276 27.6433 24.1776 28.1433 22.6776 27.2683L15.3276 21.5183L11.7776 24.8933C11.3776 25.2933 11.0276 25.6433 10.2276 25.6433L10.7276 18.1433L24.8276 5.39331C25.4276 4.89331 24.6776 4.51831 23.8276 5.01831L6.97764 15.8933L-0.272363 13.5183C-1.87236 12.8933 -1.87236 11.7683 0.227637 10.8933L28.7276 0.143311C30.0776 -0.481689 31.2776 0.393311 30.7276 1.89331Z" fill="white"/>
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-[11px] left-1/2 -translate-x-1/2 flex flex-col gap-[4px] items-center w-[139px]">
                <span className="font-berka font-medium text-[12px] leading-[1.5] text-[#638EFB] whitespace-nowrap">{tc('messageOnTelegram')}</span>
                <div className="w-full h-px bg-[#638EFB] opacity-30" />
              </div>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
