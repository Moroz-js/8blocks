/**
 * Accessibility Tests for Icon-Only Buttons
 * 
 * Validates: Requirement 10.6 - Icon-only buttons SHALL include ARIA labels
 * Task: 20.2 - Add aria-label to icon-only buttons
 */

import { render, screen, act } from '@testing-library/react';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/en',
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Icon-Only Buttons Accessibility', () => {
  describe('Header Component', () => {
    it('should have aria-label on mobile burger menu button', () => {
      render(<Header locale="en" />);
      
      const burgerButton = screen.getByLabelText('Toggle menu');
      expect(burgerButton).toBeInTheDocument();
      expect(burgerButton).toHaveAttribute('aria-label', 'Toggle menu');
    });

    it('should have aria-label on mobile menu close button when menu is open', async () => {
      render(<Header locale="en" />);
      
      // Open the menu
      const burgerButton = screen.getByLabelText('Toggle menu');
      
      await act(async () => {
        burgerButton.click();
      });
      
      // Check close button
      const closeButton = screen.getByLabelText('Close menu');
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveAttribute('aria-label', 'Close menu');
    });
  });

  describe('Language Switcher Component', () => {
    it('should have descriptive aria-label for language toggle', () => {
      render(<LanguageSwitcher currentLocale="en" />);
      
      const languageButton = screen.getByLabelText('Switch to RU');
      expect(languageButton).toBeInTheDocument();
      expect(languageButton).toHaveAttribute('aria-label', 'Switch to RU');
    });

    it('should have correct aria-label for opposite locale', () => {
      render(<LanguageSwitcher currentLocale="ru" />);
      
      const languageButton = screen.getByLabelText('Switch to EN');
      expect(languageButton).toBeInTheDocument();
      expect(languageButton).toHaveAttribute('aria-label', 'Switch to EN');
    });
  });

  describe('Footer Component', () => {
    it('should have aria-label on newsletter submit button', () => {
      render(<Footer locale="en" />);
      
      const submitButton = screen.getByLabelText('Subscribe');
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('aria-label', 'Subscribe');
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('should have aria-labels on all social media links', () => {
      render(<Footer locale="en" />);
      
      // Check all social media links
      const twitterLink = screen.getAllByLabelText('Twitter')[0];
      expect(twitterLink).toBeInTheDocument();
      expect(twitterLink).toHaveAttribute('aria-label', 'Twitter');
      
      const telegramLink = screen.getAllByLabelText('Telegram')[0];
      expect(telegramLink).toBeInTheDocument();
      expect(telegramLink).toHaveAttribute('aria-label', 'Telegram');
      
      const youtubeLink = screen.getAllByLabelText('YouTube')[0];
      expect(youtubeLink).toBeInTheDocument();
      expect(youtubeLink).toHaveAttribute('aria-label', 'YouTube');
    });
  });

  describe('WCAG 2.1 AA Compliance', () => {
    it('all icon-only buttons should be keyboard accessible', () => {
      render(<Header locale="en" />);
      
      const burgerButton = screen.getByLabelText('Toggle menu');
      
      // Button should be focusable
      expect(burgerButton.tagName).toBe('BUTTON');
      expect(burgerButton).not.toHaveAttribute('tabindex', '-1');
    });

    it('all icon-only links should have descriptive labels', () => {
      render(<Footer locale="en" />);
      
      const socialLinks = [
        screen.getAllByLabelText('Twitter')[0],
        screen.getAllByLabelText('Telegram')[0],
        screen.getAllByLabelText('YouTube')[0],
      ];
      
      socialLinks.forEach(link => {
        const ariaLabel = link.getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
        expect(ariaLabel!.length).toBeGreaterThan(0);
      });
    });
  });
});
