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

  // Navigation links
  const navigationLinks = [
    { href: locale === 'en' ? '/#services' : `/${locale}#services`, label: 'Services' },
    { href: locale === 'en' ? '/#cases' : `/${locale}#cases`, label: 'Cases' },
    { href: locale === 'en' ? '/#benefits' : `/${locale}#benefits`, label: 'Benefits' },
    { href: locale === 'en' ? '/blog' : `/${locale}/blog`, label: 'Blog' },
  ];

  // Services links
  const servicesLinks = [
    { href: locale === 'en' ? '/#services' : `/${locale}#services`, label: 'Strategic consulting' },
    { href: locale === 'en' ? '/#services' : `/${locale}#services`, label: 'Basic tokenomics' },
    { href: locale === 'en' ? '/#services' : `/${locale}#services`, label: 'Advanced tokenomics' },
    { href: locale === 'en' ? '/#services' : `/${locale}#services`, label: 'Tokenomics audit' },
  ];

  return (
    <>
      <header 
        className="fixed top-0 left-0 right-0 z-50 border-b border-[rgba(255,255,255,0.07)] h-[3.125rem] lg:h-[4.375rem]"
        style={{
          backdropFilter: 'blur(7.5px)',
          WebkitBackdropFilter: 'blur(7.5px)',
          backgroundColor: 'rgba(0, 0, 0, 0.01)',
        }}
      >
        <Container className="relative flex items-center justify-between h-full">
          {/* Logo Area */}
          <div className="flex items-center h-[30px] shrink-0">
            <Logo />
          </div>

          {/* Navigation Area - Desktop */}
          <nav className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 gap-[48px] font-berka text-[15px] leading-[1.7] text-white">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:opacity-70 transition-opacity duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions Area - Desktop */}
          <div className="hidden lg:flex items-center gap-[32px] shrink-0">
            <LanguageSwitcher currentLocale={locale} />
            <Button variant="primary">
              {locale === 'en' ? 'Talk to the team' : 'Связаться с командой'}
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-[20px]">
            <LanguageSwitcher currentLocale={locale} />
            
            {/* Mobile Burger Menu */}
            <button
              className="flex flex-col gap-[6px] w-[44px] h-[44px] justify-center items-center"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-[6px] w-[18px]">
                <span 
                  className={`block w-full h-[2px] bg-white transition-transform duration-200 ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-[4px]' : ''
                  }`}
                />
                <span 
                  className={`block w-full h-[2px] bg-white transition-transform duration-200 ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-[4px]' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile Menu Fullscreen */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black lg:hidden flex flex-col">
          {/* Navigation columns */}
          <div className="flex gap-[20px] px-[20px] pt-[90px] text-[15px] text-white">
            {/* Navigation Column */}
            <div className="flex flex-col gap-[10px] w-[120px] shrink-0">
              <p className="font-berka font-medium leading-[1.5]">Navigation</p>
              <nav className="flex flex-col gap-[5px]">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-berka text-[15px] leading-[1.7] text-white opacity-50 hover:opacity-100 transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Services Column */}
            <div className="flex flex-col gap-[10px] flex-1 min-w-0">
              <p className="font-berka font-medium leading-[1.5]">Services</p>
              <nav className="flex flex-col gap-[5px]">
                {servicesLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="font-berka text-[15px] leading-[1.7] text-white opacity-50 hover:opacity-100 transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Contact Buttons at Bottom */}
          <div className="mx-auto flex items-center justify-between w-[335px] pb-[20px] shrink-0">
            {/* WhatsApp Button */}
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-[165px] h-[165px]"
            >
              {/* Glow layers */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[150px] h-[150px] rounded-full bg-[#75FB63] opacity-20 blur-[30px]" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[110px] h-[110px] rounded-full bg-[#75FB63] opacity-30 blur-[20px]" />
              </div>
              {/* Inner circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[70px] h-[70px] rounded-full bg-[#75FB63] flex items-center justify-center">
                  <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
                    <path d="M20 0C8.954 0 0 8.954 0 20c0 3.531.923 6.853 2.539 9.735L.063 39.938l10.454-2.524A19.913 19.913 0 0020 40c11.046 0 20-8.954 20-20S31.046 0 20 0zm0 36.667c-3.118 0-6.048-.86-8.548-2.351l-.61-.368-6.329 1.531 1.594-6.188-.399-.632A16.588 16.588 0 013.333 20c0-9.204 7.463-16.667 16.667-16.667S36.667 10.796 36.667 20 29.204 36.667 20 36.667z" fill="white"/>
                    <path d="M29 24.5c-.5-.25-3-1.5-3.5-1.625-.5-.125-.75-.25-1.125.25-.375.5-1.25 1.625-1.5 1.875-.25.375-.625.375-1.125.125-.5-.25-2.125-.75-4-2.5-1.5-1.375-2.5-3-2.75-3.5-.25-.5 0-.75.25-1 .25-.25.5-.625.75-.875.25-.25.375-.5.5-.75.125-.375.125-.625 0-.875-.125-.25-1.125-2.625-1.5-3.625-.375-1-.75-.875-1.125-.875h-.875c-.375 0-.875.125-1.375.625-.5.5-1.875 1.875-1.875 4.5s1.875 5.25 2.125 5.625c.25.375 3.75 5.75 9.125 8 1.25.5 2.25.875 3 1.125.125 0 2.375.75 2.75.75.875 0 2.625-.375 3-.1.375-.75.375-1.375.25-1.5-.125-.25-.5-.375-1-.625z" fill="white"/>
                  </svg>
                </div>
              </div>
              {/* Text label */}
              <div className="absolute bottom-[11px] left-1/2 -translate-x-1/2 flex flex-col gap-[4px] items-center w-[145px]">
                <span className="font-berka font-medium text-[12px] leading-[1.5] text-[#75FB63] whitespace-nowrap">Message us on WhatsApp</span>
                <div className="w-full h-px bg-[#75FB63] opacity-30" />
              </div>
            </a>

            {/* Telegram Button */}
            <a
              href="https://t.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-[165px] h-[165px]"
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
                <span className="font-berka font-medium text-[12px] leading-[1.5] text-[#638EFB] whitespace-nowrap">Message us on Telegram</span>
                <div className="w-full h-px bg-[#638EFB] opacity-30" />
              </div>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
