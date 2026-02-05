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
              <p className="font-['Berka'] font-medium text-[0.9375rem] leading-[1.5] text-white">{t('navigation.title')}</p>
              <nav className="flex flex-col gap-[0.3125rem] font-['Berka'] font-normal text-[0.9375rem] leading-[1.7]">
                <a href={locale === 'en' ? '/#services' : `/${locale}#services`} className="text-white opacity-50 hover:opacity-100 transition-opacity">Services</a>
                <a href={locale === 'en' ? '/#cases' : `/${locale}#cases`} className="text-white opacity-50 hover:opacity-100 transition-opacity">Cases</a>
                <a href={locale === 'en' ? '/#benefits' : `/${locale}#benefits`} className="text-white opacity-50 hover:opacity-100 transition-opacity">Benefits</a>
                <a href={locale === 'en' ? '/blog' : `/${locale}/blog`} className="text-white opacity-50 hover:opacity-100 transition-opacity">Blog</a>
              </nav>
            </div>

            {/* Services */}
            <div className="flex flex-col gap-[0.625rem] flex-1">
              <p className="font-['Berka'] font-medium text-[0.9375rem] leading-[1.5] text-white">{t('services.title')}</p>
              <nav className="flex flex-col gap-[0.3125rem] font-['Berka'] font-normal text-[0.9375rem] leading-[1.7]">
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
                  className="flex-1 bg-transparent font-['Berka'] font-normal text-[0.9375rem] leading-[1.7] text-white opacity-50 outline-none placeholder:text-white placeholder:opacity-50"
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
              <p className="font-['Berka'] font-normal text-[0.9375rem] leading-[1.7] text-white opacity-50">
                {t('newsletter.subscribeText')}
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex gap-[0.75rem]">
              <a href="https://twitter.com/8blocks" target="_blank" rel="noopener noreferrer" className="flex size-[3.125rem] items-center justify-center rounded-[0.5rem] bg-[#29292A] hover:bg-[#3A3A3B] transition-colors" aria-label="Twitter">
                <svg width="21" height="19" viewBox="0 0 21 19" fill="none"><path d="M15.8824 0H18.9748L12.2189 7.72154L20.1667 18.2288H13.9436L9.06953 11.8562L3.49245 18.2288H0.398229L7.62431 9.96975L0 0H6.38102L10.7868 5.8248L15.8824 0ZM14.7971 16.3779H16.5106L5.44994 1.7537H3.61117L14.7971 16.3779Z" fill="white"/></svg>
              </a>
              <a href="https://t.me/8blocks" target="_blank" rel="noopener noreferrer" className="flex size-[3.125rem] items-center justify-center rounded-[0.5rem] bg-[#29292A] hover:bg-[#3A3A3B] transition-colors" aria-label="Telegram">
                <svg width="21" height="18" viewBox="0 0 21 18" fill="none"><path d="M19.4423 0.114974L0.973548 7.23685C-0.286868 7.7431 -0.279576 8.44623 0.742298 8.75977L5.48396 10.2389L16.4548 3.31706C16.9735 3.00143 17.4475 3.17122 17.0579 3.51706L8.16938 11.5389H8.1673L8.16938 11.54L7.8423 16.4275C8.32146 16.4275 8.53292 16.2077 8.80167 15.9483L11.1048 13.7087L15.8954 17.2473C16.7788 17.7337 17.4131 17.4837 17.6329 16.4296L20.7777 1.60872C21.0996 0.318099 20.285 -0.266276 19.4423 0.114974Z" fill="white"/></svg>
              </a>
              <a href="https://youtube.com/@8blocks" target="_blank" rel="noopener noreferrer" className="flex size-[3.125rem] items-center justify-center rounded-[0.5rem] bg-[#29292A] hover:bg-[#3A3A3B] transition-colors" aria-label="YouTube">
                <svg width="21" height="15" viewBox="0 0 21 15" fill="none"><path d="M20.7908 3.18692C20.7908 3.18692 20.5857 1.73906 19.9541 1.10332C19.1543 0.266602 18.2602 0.2625 17.85 0.213281C14.9133 -1.17347e-07 10.5041 0 10.5041 0H10.4959C10.4959 0 6.08672 -1.17347e-07 3.15 0.213281C2.73984 0.2625 1.8457 0.266602 1.0459 1.10332C0.414258 1.73906 0.213281 3.18692 0.213281 3.18692C0.213281 3.18692 0 4.88907 0 6.58711V8.17852C0 9.87657 0.20918 11.5787 0.20918 11.5787C0.20918 11.5787 0.414258 13.0266 1.0418 13.6623C1.8416 14.499 2.8916 14.4703 3.35918 14.5606C5.04082 14.7205 10.5 14.7697 10.5 14.7697C10.5 14.7697 14.9133 14.7615 17.85 14.5524C18.2602 14.5031 19.1543 14.499 19.9541 13.6623C20.5857 13.0266 20.7908 11.5787 20.7908 11.5787C20.7908 11.5787 21 9.88067 21 8.17852V6.58711C21 4.88907 20.7908 3.18692 20.7908 3.18692ZM8.33027 10.1104V4.20821L14.0027 7.16954L8.33027 10.1104Z" fill="white"/></svg>
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2244.3906!2d37.6173!3d55.7558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTXCsDQ1JzIwLjkiTiAzN8KwMzcnMDIuMyJF!5e0!3m2!1sen!2s!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="8Blocks Office Location"
              />
            </div>

            {/* Copyright + Privacy */}
            <div className="flex flex-col gap-[0.3125rem] font-['Berka'] font-normal text-[0.9375rem] leading-[1.7] text-center w-full">
              <p className="text-white opacity-50">
                {t('copyright')}
              </p>
              <a href={locale === 'en' ? '/privacy-policy' : `/${locale}/privacy-policy`} className="text-white opacity-50 hover:opacity-100 transition-opacity">
                Privacy Policy
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
                  className="flex-1 bg-transparent font-['Berka'] font-normal text-[0.9375rem] leading-[1.7] text-white opacity-50 outline-none placeholder:text-white placeholder:opacity-50"
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
              <p className="font-['Berka'] font-normal text-[0.9375rem] leading-[1.7] text-white opacity-50">
                {t('newsletter.subscribeText')}
              </p>

              {/* Social Icons */}
              <div className="flex gap-[0.75rem]">
                <a href="https://twitter.com/8blocks" target="_blank" rel="noopener noreferrer" className="flex size-[3.125rem] items-center justify-center rounded-[0.5rem] bg-[#29292A] hover:bg-[#3A3A3B] transition-colors" aria-label="Twitter">
                  <svg width="21" height="19" viewBox="0 0 21 19" fill="none"><path d="M15.8824 0H18.9748L12.2189 7.72154L20.1667 18.2288H13.9436L9.06953 11.8562L3.49245 18.2288H0.398229L7.62431 9.96975L0 0H6.38102L10.7868 5.8248L15.8824 0ZM14.7971 16.3779H16.5106L5.44994 1.7537H3.61117L14.7971 16.3779Z" fill="white"/></svg>
                </a>
                <a href="https://t.me/8blocks" target="_blank" rel="noopener noreferrer" className="flex size-[3.125rem] items-center justify-center rounded-[0.5rem] bg-[#29292A] hover:bg-[#3A3A3B] transition-colors" aria-label="Telegram">
                  <svg width="21" height="18" viewBox="0 0 21 18" fill="none"><path d="M19.4423 0.114974L0.973548 7.23685C-0.286868 7.7431 -0.279576 8.44623 0.742298 8.75977L5.48396 10.2389L16.4548 3.31706C16.9735 3.00143 17.4475 3.17122 17.0579 3.51706L8.16938 11.5389H8.1673L8.16938 11.54L7.8423 16.4275C8.32146 16.4275 8.53292 16.2077 8.80167 15.9483L11.1048 13.7087L15.8954 17.2473C16.7788 17.7337 17.4131 17.4837 17.6329 16.4296L20.7777 1.60872C21.0996 0.318099 20.285 -0.266276 19.4423 0.114974Z" fill="white"/></svg>
                </a>
                <a href="https://youtube.com/@8blocks" target="_blank" rel="noopener noreferrer" className="flex size-[3.125rem] items-center justify-center rounded-[0.5rem] bg-[#29292A] hover:bg-[#3A3A3B] transition-colors" aria-label="YouTube">
                  <svg width="21" height="15" viewBox="0 0 21 15" fill="none"><path d="M20.7908 3.18692C20.7908 3.18692 20.5857 1.73906 19.9541 1.10332C19.1543 0.266602 18.2602 0.2625 17.85 0.213281C14.9133 -1.17347e-07 10.5041 0 10.5041 0H10.4959C10.4959 0 6.08672 -1.17347e-07 3.15 0.213281C2.73984 0.2625 1.8457 0.266602 1.0459 1.10332C0.414258 1.73906 0.213281 3.18692 0.213281 3.18692C0.213281 3.18692 0 4.88907 0 6.58711V8.17852C0 9.87657 0.20918 11.5787 0.20918 11.5787C0.20918 11.5787 0.414258 13.0266 1.0418 13.6623C1.8416 14.499 2.8916 14.4703 3.35918 14.5606C5.04082 14.7205 10.5 14.7697 10.5 14.7697C10.5 14.7697 14.9133 14.7615 17.85 14.5524C18.2602 14.5031 19.1543 14.499 19.9541 13.6623C20.5857 13.0266 20.7908 11.5787 20.7908 11.5787C20.7908 11.5787 21 9.88067 21 8.17852V6.58711C21 4.88907 20.7908 3.18692 20.7908 3.18692ZM8.33027 10.1104V4.20821L14.0027 7.16954L8.33027 10.1104Z" fill="white"/></svg>
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
                  <p className="font-['Berka'] font-medium text-[0.9375rem] leading-[1.5] text-white">{t('navigation.title')}</p>
                  <nav className="flex flex-col gap-[0.9375rem] font-['Berka'] font-normal text-[0.9375rem] leading-[1.7]">
                    <a href={locale === 'en' ? '/#services' : `/${locale}#services`} className="text-white opacity-50 hover:opacity-100 transition-opacity">Services</a>
                    <a href={locale === 'en' ? '/#cases' : `/${locale}#cases`} className="text-white opacity-50 hover:opacity-100 transition-opacity">Cases</a>
                    <a href={locale === 'en' ? '/#benefits' : `/${locale}#benefits`} className="text-white opacity-50 hover:opacity-100 transition-opacity">Benefits</a>
                    <a href={locale === 'en' ? '/blog' : `/${locale}/blog`} className="text-white opacity-50 hover:opacity-100 transition-opacity">Blog</a>
                  </nav>
                </div>

                {/* Services */}
                <div className="flex flex-col gap-[1.5625rem] flex-1">
                  <p className="font-['Berka'] font-medium text-[0.9375rem] leading-[1.5] text-white">{t('services.title')}</p>
                  <nav className="flex flex-col gap-[0.9375rem] font-['Berka'] font-normal text-[0.9375rem] leading-[1.7]">
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
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2244.3906!2d37.6173!3d55.7558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTXCsDQ1JzIwLjkiTiAzN8KwMzcnMDIuMyJF!5e0!3m2!1sen!2s!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
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
            <p className="font-['Berka'] font-normal text-[0.9375rem] leading-[1.7] text-white opacity-50 text-center">
              {t('copyright')}
            </p>
            <a href={locale === 'en' ? '/privacy-policy' : `/${locale}/privacy-policy`} className="font-['Berka'] font-normal text-[0.9375rem] leading-[1.7] text-white opacity-50 hover:opacity-100 transition-opacity">
              Privacy Policy
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
