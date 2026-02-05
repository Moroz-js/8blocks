'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Logo } from './Logo';
import { Button } from '../ui/Button';
import { LanguageSwitcher } from './LanguageSwitcher';
import type { Locale } from '@/i18n/routing';

interface HeaderProps {
  locale: Locale;
}

export function Header({ locale }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = useTranslations('header');

  // Navigation links
  const navigationLinks = [
    { href: `/${locale}#services`, label: t('services') },
    { href: `/${locale}/blog`, label: t('blog') },
    { href: `/${locale}#about`, label: t('about') },
    { href: `/${locale}#contact`, label: t('contact') },
  ];

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backdropFilter: 'blur(7.5px)',
        WebkitBackdropFilter: 'blur(7.5px)',
        backgroundColor: 'rgba(0, 0, 0, 0.01)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
      }}
    >
      <div className="flex items-center justify-between px-[20px] py-[20px] lg:px-[100px] max-w-[1440px] mx-auto">
        {/* Logo Area */}
        <div className="flex items-center h-[30px] w-[205px] shrink-0">
          <Logo />
        </div>

        {/* Navigation Area - Desktop */}
        <nav className="hidden lg:flex items-center gap-[48px] font-berka text-[15px] leading-[1.7] text-white">
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
          {/* Language Switcher */}
          <LanguageSwitcher currentLocale={locale} />

          {/* CTA Button */}
          <Button variant="primary">
            {locale === 'en' ? 'Talk to the team' : 'Связаться с командой'}
          </Button>
        </div>

        {/* Mobile Burger Menu - 44x44px touch target */}
        <button
          className="lg:hidden flex flex-col gap-[6px] w-[44px] h-[44px] justify-center items-center"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="flex flex-col gap-[6px] w-[30px]">
            <span 
              className={`block w-full h-[2px] bg-white transition-transform duration-200 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-[8px]' : ''
              }`}
            />
            <span 
              className={`block w-full h-[2px] bg-white transition-opacity duration-200 ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span 
              className={`block w-full h-[2px] bg-white transition-transform duration-200 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Drawer */}
          <div 
            className="fixed top-0 right-0 bottom-0 w-[280px] bg-[#0b0b0b] z-50 lg:hidden"
            style={{
              borderLeft: '1px solid rgba(255, 255, 255, 0.07)',
            }}
          >
            <div className="flex flex-col h-full p-[20px]">
              {/* Close Button */}
              <button
                className="self-end w-[40px] h-[40px] flex items-center justify-center text-white hover:opacity-70 transition-opacity"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col gap-[30px] mt-[40px] font-berka text-[15px] leading-[1.7] text-white">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="hover:opacity-70 transition-opacity duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Actions */}
              <div className="mt-auto flex flex-col gap-[20px]">
                <LanguageSwitcher currentLocale={locale} />
                <Button variant="primary" className="w-full">
                  {locale === 'en' ? 'Talk to the team' : 'Связаться с командой'}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
