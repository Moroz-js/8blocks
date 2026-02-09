'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Logo } from './Logo';
import { Container } from './Container';
import type { Locale } from '@/i18n/routing';

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations('footer');

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    console.log('Newsletter subscription:', email);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail('');
    }, 1000);
  };

  return (
    <footer className="w-full bg-black pt-[1.875rem] pb-[1.875rem] lg:py-[1.875rem]">
      <Container className="flex flex-col">
        {/* === MOBILE LAYOUT === */}
        <div className="flex flex-col lg:hidden">
          {/* Navigation + Services - two columns */}
          <div className="flex gap-[1.25rem] px-0 mb-[1.875rem]">
            {/* Navigation */}
            <div className="flex flex-col gap-[0.625rem] w-[120px] shrink-0">
              <p className="font-berka font-medium text-[0.9375rem] leading-[1.5] text-white">{t('navigation.title')}</p>
              <nav className="flex flex-col gap-[0.3125rem] font-berka font-normal text-[0.9375rem] leading-[1.7]">
                <a href={locale === 'en' ? '/#services' : `/${locale}#services`} className="text-white opacity-50 hover:opacity-100 transition-opacity">{t('navigation.services')}</a>
                <a href={locale === 'en' ? '/#cases' : `/${locale}#cases`} className="text-white opacity-50 hover:opacity-100 transition-opacity">{t('navigation.cases')}</a>
                <a href={locale === 'en' ? '/#benefits' : `/${locale}#benefits`} className="text-white opacity-50 hover:opacity-100 transition-opacity">{t('navigation.benefits')}</a>
                <a href={locale === 'en' ? '/blog' : `/${locale}/blog`} className="text-white opacity-50 hover:opacity-100 transition-opacity">{t('navigation.blog')}</a>
              </nav>
            </div>

            {/* Services */}
            <div className="flex flex-col gap-[0.625rem] flex-1">
              <p className="font-berka font-medium text-[0.9375rem] leading-[1.5] text-white">{t('services.title')}</p>
              <nav className="flex flex-col gap-[0.3125rem] font-berka font-normal text-[0.9375rem] leading-[1.7]">
                <a href={locale === 'en' ? '/#services' : `/${locale}#services`} className="text-white opacity-50 hover:opacity-100 transition-opacity">{t('services.strategicConsulting')}</a>
                <a href={locale === 'en' ? '/#services' : `/${locale}#services`} className="text-white opacity-50 hover:opacity-100 transition-opacity">{t('services.basicTokenomics')}</a>
                <a href={locale === 'en' ? '/#services' : `/${locale}#services`} className="text-white opacity-50 hover:opacity-100 transition-opacity">{t('services.advancedTokenomics')}</a>
                <a href={locale === 'en' ? '/#services' : `/${locale}#services`} className="text-white opacity-50 hover:opacity-100 transition-opacity">{t('services.tokenomicsAudit')}</a>
              </nav>
            </div>
          </div>

          {/* Newsletter + Social */}
          <div className="flex flex-col gap-[1.25rem] mb-[1.875rem]">
            <div className="flex flex-col gap-[0.9375rem]">
              <form onSubmit={handleNewsletterSubmit} className="relative flex h-[3.75rem] w-full items-center justify-between rounded-[0.5rem] border-2 border-[#141414] pl-[1.5625rem] pr-[0.3125rem] py-[0.3125rem]">
                <label htmlFor="newsletter-email-mobile" className="sr-only">
                  {t('newsletter.placeholder')}
                </label>
                <input
                  id="newsletter-email-mobile"
                  type="email"
                  placeholder={t('newsletter.placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent font-berka font-normal text-[0.9375rem] leading-[1.7] text-white opacity-50 outline-none placeholder:text-white placeholder:opacity-50"
                  required
                  aria-label={t('newsletter.placeholder')}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex size-[3.125rem] shrink-0 items-center justify-center rounded-[0.5rem] bg-[#29292A] hover:bg-[#3A3A3B] transition-colors"
                  aria-label={t('newsletter.subscribe') || 'Subscribe'}
                >
                  <svg width="18" height="17" viewBox="0 0 18 17" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M17.1294 9.0196C17.3563 8.9103 17.5 8.68462 17.5 8.4375C17.5 8.19038 17.3563 7.9647 17.1294 7.8554L0.958507 0.0669498C0.707536 -0.053927 0.405922 -0.00830963 0.204141 0.181043C0.00236085 0.370396 -0.0563499 0.662911 0.0573011 0.912651L2.55837 6.40866L7.23234 8.23459C7.41788 8.30707 7.41788 8.56961 7.23234 8.64209L2.55745 10.4684L0.0573004 15.9623C-0.0563506 16.2121 0.00236014 16.5046 0.204141 16.694C0.405921 16.8833 0.707535 16.9289 0.958506 16.8081L17.1294 9.0196Z" fill="white"/>
                  </svg>
                </button>
              </form>
              <p className="font-berka font-normal text-[0.9375rem] leading-[1.7] text-white opacity-50">
                {t('newsletter.subscribeText')}
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex gap-[0.75rem]">
              <a href="https://x.com/8BlocksLabs" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="X (Twitter)">
                <img src="/assets/icons/x-icon.svg" alt="X" width={50} height={50} />
              </a>
              <a href={locale === 'en' ? 'https://t.me/eightblocks' : 'https://t.me/Eight_Blocks'} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Telegram">
                <img src="/assets/icons/tg-icon.svg" alt="Telegram" width={50} height={50} />
              </a>
              {locale === 'ru' && (
                <a href="https://www.youtube.com/@8BlocksLabs" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="YouTube">
                  <img src="/assets/icons/yt-icon.svg" alt="YouTube" width={50} height={50} />
                </a>
              )}
              <a href="https://www.linkedin.com/company/8blocksio" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="LinkedIn">
                <img src="/assets/icons/ln-icon.svg" alt="LinkedIn" width={50} height={50} />
              </a>
              <a href="https://base.app/profile/8blocks" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Base">
                <img src="/assets/icons/base-icon.svg" alt="Base" width={50} height={50} />
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full max-w-[335px] mx-auto bg-[rgba(255,255,255,0.07)]" />

          {/* Bottom: Logo + Map + Copyright */}
          <div className="flex flex-col items-center gap-[1.875rem] pt-[1.875rem]">
            <Logo />

            {/* Map */}
            <div className="h-[200px] w-full overflow-hidden rounded-[0.5rem]" style={{boxShadow: '0px 0px 0px 1.592px rgba(0,0,0,0.2), 0px 0px 3.185px 0px rgba(0,0,0,0.08), 0px 3.185px 9.554px 0px rgba(0,0,0,0.1)'}}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d231347.00243468955!2d55.05892653780744!3d25.04096525226673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6cade01aaaab%3A0x8d1c1334c0a3883d!2sDMCC%20I5%20Premium%20Business%20Centre!5e0!3m2!1sru!2sru!4v1770648759278!5m2!1sru!2sru"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(100%) invert(90%)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="8Blocks Office Location"
              />
            </div>

            {/* Copyright + Privacy */}
            <div className="flex flex-col gap-[0.3125rem] font-berka font-normal text-[0.9375rem] leading-[1.7] text-center w-full">
              <p className="text-white opacity-50">
                {t('copyright')}
              </p>
              <a href={locale === 'en' ? '/privacy-policy' : `/${locale}/privacy-policy`} className="text-white opacity-50 hover:opacity-100 transition-opacity">
                {t('privacyPolicy')}
              </a>
            </div>
          </div>
        </div>

        {/* === DESKTOP LAYOUT === */}
        <div className="hidden lg:flex lg:flex-col">
          {/* Top Section - Grid */}
          <div className="grid lg:grid-cols-[347px_386px_1fr] gap-[40px]">
            {/* Newsletter */}
            <div className="flex flex-col gap-[0.9375rem]">
              <form onSubmit={handleNewsletterSubmit} className="relative flex h-[3.75rem] w-full items-center justify-between rounded-[0.5rem] border-2 border-[#141414] pl-[1.5625rem] pr-[0.3125rem] py-[0.3125rem]">
                <label htmlFor="newsletter-email-desktop" className="sr-only">
                  {t('newsletter.placeholder')}
                </label>
                <input
                  id="newsletter-email-desktop"
                  type="email"
                  placeholder={t('newsletter.placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent font-berka font-normal text-[0.9375rem] leading-[1.7] text-white opacity-50 outline-none placeholder:text-white placeholder:opacity-50"
                  required
                  aria-label={t('newsletter.placeholder')}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex size-[3.125rem] shrink-0 items-center justify-center rounded-[0.5rem] bg-[#29292A] hover:bg-[#3A3A3B] transition-colors"
                  aria-label={t('newsletter.subscribe') || 'Subscribe'}
                >
                  <svg width="18" height="17" viewBox="0 0 18 17" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M17.1294 9.0196C17.3563 8.9103 17.5 8.68462 17.5 8.4375C17.5 8.19038 17.3563 7.9647 17.1294 7.8554L0.958507 0.0669498C0.707536 -0.053927 0.405922 -0.00830963 0.204141 0.181043C0.00236085 0.370396 -0.0563499 0.662911 0.0573011 0.912651L2.55837 6.40866L7.23234 8.23459C7.41788 8.30707 7.41788 8.56961 7.23234 8.64209L2.55745 10.4684L0.0573004 15.9623C-0.0563506 16.2121 0.00236014 16.5046 0.204141 16.694C0.405921 16.8833 0.707535 16.9289 0.958506 16.8081L17.1294 9.0196Z" fill="white"/>
                  </svg>
                </button>
              </form>
              <p className="font-berka font-normal text-[0.9375rem] leading-[1.7] text-white opacity-50">
                {t('newsletter.subscribeText')}
              </p>

              {/* Social Icons */}
              <div className="flex gap-[0.75rem]">
                <a href="https://x.com/8BlocksLabs" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="X (Twitter)">
                  <img src="/assets/icons/x-icon.svg" alt="X" width={50} height={50} />
                </a>
                <a href={locale === 'en' ? 'https://t.me/eightblocks' : 'https://t.me/Eight_Blocks'} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Telegram">
                  <img src="/assets/icons/tg-icon.svg" alt="Telegram" width={50} height={50} />
                </a>
                {locale === 'ru' && (
                  <a href="https://www.youtube.com/@8BlocksLabs" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="YouTube">
                    <img src="/assets/icons/yt-icon.svg" alt="YouTube" width={50} height={50} />
                  </a>
                )}
                <a href="https://www.linkedin.com/company/8blocksio" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="LinkedIn">
                  <img src="/assets/icons/ln-icon.svg" alt="LinkedIn" width={50} height={50} />
                </a>
                <a href="https://base.app/profile/8blocks" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Base">
                  <img src="/assets/icons/base-icon.svg" alt="Base" width={50} height={50} />
                </a>
              </div>
            </div>

            {/* Navigation + Services with vertical divider */}
            <div className="relative flex gap-[1.25rem]">
              {/* Vertical divider - left side */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-[rgba(255,255,255,0.07)]" />
              
              <div className="flex-1 flex gap-[1.25rem] pl-[2.5rem]">
                {/* Navigation */}
                <div className="flex flex-col gap-[1.5625rem] flex-1">
                  <p className="font-berka font-medium text-[0.9375rem] leading-[1.5] text-white">{t('navigation.title')}</p>
                  <nav className="flex flex-col gap-[0.9375rem] font-berka font-normal text-[0.9375rem] leading-[1.7]">
                    <a href={locale === 'en' ? '/#services' : `/${locale}#services`} className="text-white opacity-50 hover:opacity-100 transition-opacity">{t('navigation.services')}</a>
                    <a href={locale === 'en' ? '/#cases' : `/${locale}#cases`} className="text-white opacity-50 hover:opacity-100 transition-opacity">{t('navigation.cases')}</a>
                    <a href={locale === 'en' ? '/#benefits' : `/${locale}#benefits`} className="text-white opacity-50 hover:opacity-100 transition-opacity">{t('navigation.benefits')}</a>
                    <a href={locale === 'en' ? '/blog' : `/${locale}/blog`} className="text-white opacity-50 hover:opacity-100 transition-opacity">{t('navigation.blog')}</a>
                  </nav>
                </div>

                {/* Services */}
                <div className="flex flex-col gap-[1.5625rem] flex-1">
                  <p className="font-berka font-medium text-[0.9375rem] leading-[1.5] text-white">{t('services.title')}</p>
                  <nav className="flex flex-col gap-[0.9375rem] font-berka font-normal text-[0.9375rem] leading-[1.7]">
                    <a href={locale === 'en' ? '/#services' : `/${locale}#services`} className="text-white opacity-50 hover:opacity-100 transition-opacity">{t('services.strategicConsulting')}</a>
                    <a href={locale === 'en' ? '/#services' : `/${locale}#services`} className="text-white opacity-50 hover:opacity-100 transition-opacity">{t('services.basicTokenomics')}</a>
                    <a href={locale === 'en' ? '/#services' : `/${locale}#services`} className="text-white opacity-50 hover:opacity-100 transition-opacity">{t('services.advancedTokenomics')}</a>
                    <a href={locale === 'en' ? '/#services' : `/${locale}#services`} className="text-white opacity-50 hover:opacity-100 transition-opacity">{t('services.tokenomicsAudit')}</a>
                  </nav>
                </div>
              </div>
            </div>

            {/* Map - Desktop */}
            <div className="mb-[2rem] justify-self-end">
              <div className="h-[230px] w-[387px] overflow-hidden rounded-[0.5rem]" style={{boxShadow: '0px 0px 0px 1.592px rgba(0,0,0,0.2), 0px 0px 3.185px 0px rgba(0,0,0,0.08), 0px 3.185px 9.554px 0px rgba(0,0,0,0.1)'}}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d231347.00243468955!2d55.05892653780744!3d25.04096525226673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6cade01aaaab%3A0x8d1c1334c0a3883d!2sDMCC%20I5%20Premium%20Business%20Centre!5e0!3m2!1sru!2sru!4v1770648759278!5m2!1sru!2sru"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(100%) invert(90%)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="8Blocks Office Location"
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-[rgba(255,255,255,0.07)]" />

          {/* Bottom */}
          <div className="mt-[2rem] flex items-center justify-between gap-[2.5rem]">
            <Logo />
            <p className="font-berka font-normal text-[0.9375rem] leading-[1.7] text-white opacity-50 text-center">
              {t('copyright')}
            </p>
            <a href={locale === 'en' ? '/privacy-policy' : `/${locale}/privacy-policy`} className="font-berka font-normal text-[0.9375rem] leading-[1.7] text-white opacity-50 hover:opacity-100 transition-opacity">
              {t('privacyPolicy')}
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
